from __future__ import annotations
# FastAPI endpoint for RAG
from incremental_ingestion import IncrementalIngestionPipeline
import hashlib
import io
import os
from typing import Any, Dict, Optional

import requests
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse

from app.rag.modules.ingestion import load_pdfs_from_folder, analyze_extracted_content
from app.rag.modules.chunking import split_texts_into_chunks, analyze_chunks
from app.rag.modules.embeddings import embed_texts
from app.rag.modules.generator import generate_response
from app.rag.modules.vectorstore import (
    get_qdrant_client,
    ensure_collection,
    upsert_embeddings_incremental,
    search_top_k,
    get_existing_documents,
    get_document_hash
)


app = FastAPI(title="RAG Ingestion API")


def _hash_bytes(data: bytes) -> str:
    return hashlib.md5(data).hexdigest()


def _get_data_dir() -> str:
    """Return absolute path to the data directory (app/data)."""
    current_dir = os.path.dirname(__file__)  # app/rag
    data_dir = os.path.normpath(os.path.join(current_dir, "..", "data"))
    return data_dir


def _create_collection_if_missing(client, vector_size: int) -> None:
    try:
        client.get_collection("rag_collection")
    except Exception:
        ensure_collection(client, vector_size)


def _process_text_and_upsert(text: str, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="No text extracted from the document")

    # Chunk
    chunks = split_texts_into_chunks([text])
    if not chunks:
        raise HTTPException(status_code=400, detail="No chunks generated from the document")

    # Embed
    embeddings = embed_texts(chunks)
    if not embeddings or not embeddings[0]:
        raise HTTPException(status_code=500, detail="Failed to generate embeddings")

    vector_size = len(embeddings[0])

    # Upsert into Qdrant
    client = get_qdrant_client()
    _create_collection_if_missing(client, vector_size)

    # Use the same document hash for all chunks
    doc_hash = hashlib.md5(text.encode("utf-8")).hexdigest()
    document_hashes = [doc_hash] * len(chunks)

    upsert_embeddings_incremental(client, embeddings, chunks, document_hashes)

    return {
        "status": "success",
        "document_id": doc_hash,
        "chunks_ingested": len(chunks),
        "metadata": metadata or {},
    }


@app.get("/health")
async def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/status")
async def status() -> Dict[str, Any]:
    try:
        client = get_qdrant_client()
        collections = client.get_collections()
        info = {"collections": [c.name for c in collections.collections]}
        try:
            points_count = client.count("rag_collection").count
            info.update({"rag_collection": {"points": points_count}})
        except Exception:
            info.update({"rag_collection": {"points": 0}})
        return {"status": "ok", "qdrant": info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Qdrant error: {e}")


@app.post("/ask")
async def ask(payload: Dict[str, Any]) -> str:
    """Ask a question and return only the answer (like CLI)"""
    question = payload.get("question")
    if not question or not isinstance(question, str):
        raise HTTPException(status_code=400, detail="Missing 'question' string in body")

    # Embed the question
    query_vec = embed_texts([question])[0]
    if not query_vec:
        raise HTTPException(status_code=500, detail="Failed to embed question")

    # Search
    client = get_qdrant_client()
    top_chunks = search_top_k(client, query_vec, k=3)
    if not top_chunks:
        return "Aucun contexte trouvé pour répondre à votre question."

    # Generate
    answer = generate_response(top_chunks, question)
    return answer


@app.post("/ingest")
async def ingest() -> Dict[str, Any]:
    """
    Full ingestion endpoint - processes all PDFs in the data folder (like CLI)
    """
    data_dir = _get_data_dir()
    
    # Check if data directory exists
    if not os.path.exists(data_dir):
        raise HTTPException(status_code=400, detail=f"The '{data_dir}' directory does not exist. Create it and add your PDF documents.")
    
    # Check for PDF files
    pdf_files = [f for f in os.listdir(data_dir) if f.lower().endswith('.pdf')]
    if not pdf_files:
        raise HTTPException(status_code=400, detail=f"No PDF files found in '{data_dir}'. Add PDF documents before running ingestion.")
    
    try:
        # Step 1: Extract PDFs
        texts = load_pdfs_from_folder(data_dir, max_files=None)
        extraction_analysis = analyze_extracted_content(texts)
        
        # Step 2: Chunk texts
        chunks = split_texts_into_chunks(
            texts,
            chunk_size_tokens=512,
            chunk_overlap_tokens=128
        )
        chunk_analysis = analyze_chunks(chunks)
        
        # Step 3: Generate embeddings
        chunk_embeddings = embed_texts(chunks)
        if not chunk_embeddings or not chunk_embeddings[0]:
            raise HTTPException(status_code=500, detail="Failed to generate embeddings")
        
        vector_size = len(chunk_embeddings[0])
        
        # Step 4: Index in Qdrant
        client = get_qdrant_client()
        ensure_collection(client, vector_size)
        
        # Create document hashes for each text
        document_hashes = []
        for text in texts:
            doc_hash = hashlib.md5(text.encode("utf-8")).hexdigest()
            # Assign same hash to all chunks from same document
            chunks_per_doc = len(chunks) // len(texts)
            document_hashes.extend([doc_hash] * chunks_per_doc)
        
        # Ensure we have enough hashes
        while len(document_hashes) < len(chunks):
            document_hashes.append(document_hashes[-1] if document_hashes else "unknown")
        
        upsert_embeddings_incremental(client, chunk_embeddings, chunks, document_hashes)
        
        # Get final count
        points_count = client.count("rag_collection").count
        
        return {
            "status": "success",
            "documents_processed": len(texts),
            "chunks_created": len(chunks),
            "embeddings_generated": len(chunk_embeddings),
            "points_indexed": points_count,
            "vector_dimension": vector_size,
            "pdf_files": pdf_files
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")


@app.post("/incremental")
async def incremental() -> Dict[str, Any]:
    """
    Incremental ingestion endpoint - processes only NEW PDFs in the data folder
    """
    try:
        if len(sys.argv) > 1:
            data_dir = sys.argv[1]
        else:
            data_dir = "data"
        
        if not os.path.exists(data_dir):
            print(f"❌ The {data_dir} directory does not exist!")
            sys.exit(1)
        
        pipeline = IncrementalIngestionPipeline(data_dir)
        pipeline.run()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Incremental ingestion failed: {str(e)}")