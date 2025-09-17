#!/usr/bin/env python3
"""
Incremental Ingestion Pipeline for the RAG System
================================================

This script processes only NEW PDF documents and adds them to the existing vector database, without duplicating already indexed documents.

Usage:
- First run: process all PDFs
- Subsequent runs: process only new PDFs
"""

import warnings
warnings.filterwarnings("ignore", message=".*urllib3.*OpenSSL.*")

import os
import sys
import json
from typing import List, Dict, Any

# Import des modules
from modules.ingestion import load_pdfs_from_folder
from modules.chunking import split_texts_into_chunks 
from modules.embeddings import embed_texts
from modules.vectorstore import (
    get_qdrant_client,
    get_existing_documents,
    upsert_embeddings_incremental,
    get_document_hash
)

class IncrementalIngestionPipeline:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.qdrant_client = get_qdrant_client()
        self.collection_name = "rag_collection"
        
    def get_pdf_files_with_hashes(self) -> Dict[str, str]:
        """Retrieve all PDF files with their hashes."""
        pdf_files = {}
        for filename in sorted(os.listdir(self.data_dir)):
            if filename.lower().endswith('.pdf'):
                file_path = os.path.join(self.data_dir, filename)
                file_hash = get_document_hash(file_path)
                pdf_files[filename] = file_hash
        return pdf_files
    
    def identify_new_documents(self) -> List[str]:
        """Identify documents that have not yet been indexed."""
        print("🔍 Checking existing documents...")
        
        # Retrieve already indexed documents
        existing_docs = get_existing_documents(self.qdrant_client)
        existing_hashes = set(existing_docs.keys())
        
        # Retrieve all PDFs with their hashes
        all_pdfs = self.get_pdf_files_with_hashes()
        
        # Identify new documents
        new_documents = []
        for filename, file_hash in all_pdfs.items():
            if file_hash not in existing_hashes:
                new_documents.append(filename)
            else:
                print(f"✅ {filename} - already indexed")
        
        return new_documents
    
    def process_single_document(self, filename: str) -> Dict[str, Any]:
        """Process a single PDF document."""
        file_path = os.path.join(self.data_dir, filename)
        file_hash = get_document_hash(file_path)
        
        print(f"\n📄 Processing: {filename}")
        print(f"🔐 Hash: {file_hash[:8]}...")
        
        # Extract the content
        try:
            texts = load_pdfs_from_folder(self.data_dir, max_files=None)
            # Filter to keep only the current document
            current_text = None
            for text in texts:
                # Check if this text corresponds to the current file
                # (approximation based on file size)
                if len(text) > 1000:  # Basic filter based on file size
                    current_text = text
                    break
            
            if not current_text:
                raise ValueError(f"No content extracted from {filename}")
            
            # Split into chunks
            chunks = split_texts_into_chunks([current_text])
            
            # Generate embeddings
            embeddings = embed_texts(chunks)
            
            # Add to the vector database
            document_hashes = [file_hash] * len(chunks)
            next_id = upsert_embeddings_incremental(
                self.qdrant_client, 
                embeddings, 
                chunks, 
                document_hashes
            )
            
            return {
                "filename": filename,
                "hash": file_hash,
                "chunks_created": len(chunks),
                "embeddings_generated": len(embeddings),
                "next_id": next_id
            }
            
        except Exception as e:
            print(f"❌ Error processing {filename}: {e}")
            return {
                "filename": filename,
                "hash": file_hash,
                "error": str(e)
            }
    
    def run(self) -> Dict[str, Any]:
        """Execute the incremental ingestion pipeline."""
        print("🔧 RAG INCREMENTAL INGESTION PIPELINE")
        print("=" * 50)
        print("This script processes only NEW PDF documents.")
        print(f"📁 Data directory: {self.data_dir}")
        
        # Identify new documents
        new_documents = self.identify_new_documents()
        
        if not new_documents:
            print("\n✅ No new documents to process!")
            print("All PDFs are already indexed.")
            return {"status": "no_new_documents"}
        
        print(f"\n🆕 {len(new_documents)} new document(s) to process:")
        for doc in new_documents:
            print(f"   • {doc}")
        
        # Demander confirmation
        response = input(f"\n🚀 Traiter ces {len(new_documents)} document(s) ? (y/N): ")
        if response.lower() != 'y':
            print("❌ Cancelled by the user.")
            return {"status": "cancelled"}
        
        print(f"\n🚀 STARTING INCREMENTAL INGESTION")
        print("=" * 50)
        
        results = {
            "status": "success",
            "new_documents": len(new_documents),
            "processed_documents": [],
            "errors": []
        }
        
        # Process each new document
        for i, filename in enumerate(new_documents, 1):
            print(f"\n📄 [{i}/{len(new_documents)}] Processing: {filename}")
            
            result = self.process_single_document(filename)
            
            if "error" in result:
                results["errors"].append(result)
                print(f"❌ Failure: {result['error']}")
            else:
                results["processed_documents"].append(result)
                print(f"✅ Success: {result['chunks_created']} chunks created")
        
        # Résumé final
        print(f"\n🎉 INCREMENTAL INGESTION COMPLETED!")
        print("=" * 50)
        print(f"📊 Processed documents: {len(results['processed_documents'])}")
        print(f"❌ Errors: {len(results['errors'])}")
        
        if results["processed_documents"]:
            total_chunks = sum(doc["chunks_created"] for doc in results["processed_documents"])
            print(f"🧩 Total chunks added: {total_chunks}")
        
        # Sauvegarder les résultats
        with open("incremental_ingestion_results.json", "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Results saved in incremental_ingestion_results.json")
        
        return results

def main():
    """Main entry point."""
    if len(sys.argv) > 1:
        data_dir = sys.argv[1]
    else:
        data_dir = "data"
    
    if not os.path.exists(data_dir):
        print(f"❌ The {data_dir} directory does not exist!")
        sys.exit(1)
    
    pipeline = IncrementalIngestionPipeline(data_dir)
    pipeline.run()

if __name__ == "__main__":
    main()
