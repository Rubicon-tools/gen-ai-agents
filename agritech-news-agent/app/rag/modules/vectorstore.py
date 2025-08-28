from typing import List, Sequence, Dict, Any
import os
import hashlib

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct


_COLLECTION_NAME = "rag_collection"


def get_qdrant_client(host: str = "localhost", port: int = 6333) -> QdrantClient:
    """Return a Qdrant client.
    Tries, in order:
    - QDRANT_URL env (e.g., "http://localhost:6333" or ":memory:")
    - TCP localhost:6333
    - In-memory fallback (non-persistent)
    """
    url = os.getenv("QDRANT_URL")
    if url:
        try:
            client = QdrantClient(url)
            # Probe health
            client.get_collections()
            return client
        except Exception:
            pass

    # Try localhost:6333
    try:
        client = QdrantClient(host=host, port=port)
        client.get_collections()
        return client
    except Exception:
        # Fallback: in-memory (non-persistent)
        fallback = QdrantClient(":memory:")
        return fallback


def ensure_collection(client: QdrantClient, vector_size: int) -> None:
    client.recreate_collection(
        collection_name=_COLLECTION_NAME,
        vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
    )


def get_existing_documents(client: QdrantClient) -> Dict[str, List[int]]:
    """
    Retrieve the list of already indexed documents with their chunk IDs.
    Return: {filename_hash: [chunk_ids]}
    """
    try:
        # Retrieve all points with their payloads
        all_points = client.scroll(
            collection_name=_COLLECTION_NAME,
            limit=10000,  # High limit to retrieve all points
            with_payload=True
        )[0]
        
        existing_docs = {}
        for point in all_points:
            if "document_hash" in point.payload:
                doc_hash = point.payload["document_hash"]
                if doc_hash not in existing_docs:
                    existing_docs[doc_hash] = []
                existing_docs[doc_hash].append(point.id)
        
        return existing_docs
    except Exception:
        return {}


def upsert_embeddings(
    client: QdrantClient, 
    embeddings: Sequence[Sequence[float]], 
    chunks: Sequence[str],
    document_hashes: Sequence[str] = None
) -> None:
    """
    Insert the embeddings with document metadata.
    If document_hashes is provided, add the document hash to each chunk.
    """
    points = []
    for i, (emb, chunk) in enumerate(zip(embeddings, chunks)):
        payload = {"text": chunk}
        if document_hashes and i < len(document_hashes):
            payload["document_hash"] = document_hashes[i]
        
        points.append(PointStruct(id=i, vector=emb, payload=payload))
    
    client.upsert(collection_name=_COLLECTION_NAME, points=points)


def upsert_embeddings_incremental(
    client: QdrantClient,
    embeddings: Sequence[Sequence[float]],
    chunks: Sequence[str],
    document_hashes: Sequence[str],
    start_id: int = None
) -> int:
    """
    Add new embeddings with incremental IDs.
    Return the next available ID.
    """
    if start_id is None:
        # Find the largest existing ID
        try:
            all_points = client.scroll(
                collection_name=_COLLECTION_NAME,
                limit=1,
                offset=0
            )[0]
            start_id = max([p.id for p in all_points]) + 1 if all_points else 0
        except Exception:
            start_id = 0
    
    points = []
    for i, (emb, chunk) in enumerate(zip(embeddings, chunks)):
        payload = {"text": chunk}
        if document_hashes and i < len(document_hashes):
            payload["document_hash"] = document_hashes[i]
        
        points.append(PointStruct(id=start_id + i, vector=emb, payload=payload))
    
    client.upsert(collection_name=_COLLECTION_NAME, points=points)
    return start_id + len(points)


def search_top_k(client: QdrantClient, query_vector: Sequence[float], k: int = 3) -> List[str]:
    results = client.search(
        collection_name=_COLLECTION_NAME,
        query_vector=query_vector,
        limit=k,
    )
    return [hit.payload["text"] for hit in results]


def get_document_hash(file_path: str) -> str:
    """
    Generate a unique hash for a PDF file based on its name and size.
    """
    file_stat = os.stat(file_path)
    file_info = f"{os.path.basename(file_path)}_{file_stat.st_size}_{file_stat.st_mtime}"
    return hashlib.md5(file_info.encode()).hexdigest()
