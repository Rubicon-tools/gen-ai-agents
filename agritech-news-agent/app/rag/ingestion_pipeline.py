#!/usr/bin/env python3
"""
Ingestion Pipeline for the RAG System
=====================================

This script processes PDF documents and indexes them into the vector database.  
Run it BEFORE using the Q&A system.  

Steps:  
1. Extract PDF documents  
2. Split into optimized chunks  
3. Generate embeddings  
4. Index into the vector database  
"""

import warnings
warnings.filterwarnings("ignore", message=".*urllib3.*OpenSSL.*")

import os
import json
from datetime import datetime
from typing import List, Dict, Any

from modules.ingestion import load_pdfs_from_folder, analyze_extracted_content
from modules.chunking import split_texts_into_chunks, analyze_chunks
from modules.embeddings import embed_texts
from modules.vectorstore import get_qdrant_client, ensure_collection, upsert_embeddings


class IngestionPipeline:
    """Full document ingestion pipeline"""
    
    def __init__(self, data_dir: str = "data", collection_name: str = "rag_collection"):
        self.data_dir = data_dir
        self.collection_name = collection_name
        self.qdrant_client = get_qdrant_client()
        
    def run(self) -> Dict[str, Any]:
        """
        Run the full ingestion pipeline
        """
        print("🚀 STARTING INGESTION PIPELINE")
        print("=" * 50)
        
        results = {
            "timestamp": datetime.now().isoformat(),
            "data_directory": self.data_dir,
            "collection_name": self.collection_name,
            "steps": {}
        }
        
            # ÉTAPE 1: Extraction des PDFs
        print("\n📄 STEP 1: Extraction des documents PDF")
        print("-" * 40)
        
        try:
            texts = load_pdfs_from_folder(self.data_dir, max_files=None)  # Traite tous les PDFs
            extraction_analysis = analyze_extracted_content(texts)
            
            results["steps"]["extraction"] = {
                "status": "success",
                "documents_processed": len(texts),
                "analysis": extraction_analysis
            }
            
            print(f"✅ {len(texts)} documents extracted with success")
            print(f"📊 Total: {extraction_analysis['total_characters']:,} caractères")
            
        except Exception as e:
            results["steps"]["extraction"] = {
                "status": "error",
                "error": str(e)
            }
            print(f"❌ Error during extraction: {e}")
            return results
        
        # STEP 2: Découpage en chunks optimisés
        print(f"\n✂️ STEP 2: Découpage en chunks optimisés")
        print("-" * 40)
        
        try:
            chunks = split_texts_into_chunks(
                texts,
                chunk_size_tokens=512,  # Fixed size
                chunk_overlap_tokens=128  # Significant overlap
            )
            
            chunk_analysis = analyze_chunks(chunks)
            
            results["steps"]["chunking"] = {
                "status": "success",
                "chunks_created": len(chunks),
                "analysis": chunk_analysis
            }
            
            print(f"✅ {len(chunks)} chunks created")
            print(f"📊 Taille moyenne: {chunk_analysis['avg_size']:.0f} tokens")
            print(f"📈 Distribution: {chunk_analysis['size_distribution']}")
            
        except Exception as e:
            results["steps"]["chunking"] = {
                "status": "error",
                "error": str(e)
            }
            print(f"❌ Erreur lors du chunking: {e}")
            return results
        
        # STEP 3: Embedding Generation
        print(f"\n🧠 STEP 3: Embedding Generation ({len(chunks)} chunks)")
        print("-" * 40)
        
        try:
            chunk_embeddings = embed_texts(chunks)
            
            if not chunk_embeddings or not chunk_embeddings[0]:
                raise RuntimeError("No embedding generated")
            
            vector_size = len(chunk_embeddings[0])
            
            results["steps"]["embeddings"] = {
                "status": "success",
                "embeddings_generated": len(chunk_embeddings),
                "vector_dimension": vector_size
            }
            
            print(f"✅ {len(chunk_embeddings)} embeddings generated")
            print(f"📏 Vector dimension: {vector_size}")
            
        except Exception as e:
            results["steps"]["embeddings"] = {
                "status": "error",
                "error": str(e)
            }
            print(f"❌ Error during embedding generation: {e}")
            return results
        
        # STEP 4: Indexation dans Qdrant
        print(f"\n🗄️ STEP 4: Indexation dans la base vectorielle")
        print("-" * 40)
        
        try:
            # Créer/recréer la collection
            ensure_collection(self.qdrant_client, vector_size)
            print(f"✅ Collection '{self.collection_name}' configured")
            
            # Stocker les embeddings
            upsert_embeddings(self.qdrant_client, chunk_embeddings, chunks)
            print(f"✅ {len(chunks)} chunks indexed in Qdrant")
            
            # Vérifier le stockage
            collection_info = self.qdrant_client.get_collection(self.collection_name)
            points_count = self.qdrant_client.count(self.collection_name).count
            
            results["steps"]["indexing"] = {
                "status": "success",
                "collection_status": collection_info.status,
                "points_stored": points_count,
                "vector_dimension": vector_size
            }
            
            print(f"📊 Collection status: {collection_info.status}")
            print(f"🔢 Points stored: {points_count}")
            
        except Exception as e:
            results["steps"]["indexing"] = {
                "status": "error",
                "error": str(e)
            }
            print(f"❌ Error during indexing: {e}")
            return results
        
        # RÉSUMÉ FINAL
        print("\n🎉 INGESTION PIPELINE COMPLETED SUCCESSFULLY!")
        print("=" * 50)
        
        results["status"] = "success"
        results["summary"] = {
            "total_documents": len(texts),
            "total_chunks": len(chunks),
            "total_embeddings": len(chunk_embeddings),
            "total_points_stored": points_count,
            "vector_dimension": vector_size
        }
        
        print(f"📈 FINAL SUMMARY:")
        print(f"   • Documents processed: {len(texts)}")
        print(f"   • Chunks created: {len(chunks)}")
        print(f"   • Embeddings generated: {len(chunk_embeddings)}")
        print(f"   • Points indexed: {points_count}")
        print(f"   • Vector dimension: {vector_size}")
        
        return results
    
    def save_results(self, results: Dict[str, Any], output_file: str = "ingestion_results.json"):
        """Save the pipeline results"""
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            print(f"💾 Results saved in {output_file}")
        except Exception as e:
            print(f"⚠️  Impossible to save results: {e}")


def main():
    """Main entry point"""
    
    print("🔧 RAG INGESTION PIPELINE")
    print("=" * 40)
    print("This script processes PDF documents and indexes them into the vector database.")
    print("Run it BEFORE using the Q&A system.\n")
    
    # Vérifier que le dossier data existe
    data_dir = "data"
    if not os.path.exists(data_dir):
        print(f"❌ The '{data_dir}' directory does not exist.")
        print("Create it and add your PDF documents.")
        return
    
    # Vérifier qu'il y a des PDFs
    pdf_files = [f for f in os.listdir(data_dir) if f.lower().endswith('.pdf')]
    if not pdf_files:
        print(f"❌ No PDF files found in '{data_dir}'.")
        print("Add PDF documents before running this script.")
        return
    
    print(f"📁 Data directory: {data_dir}")
    print(f"📄 PDFs found: {len(pdf_files)}")
    for pdf in pdf_files[:3]:  # Display the first 3 PDFs
        print(f"   • {pdf}")
    if len(pdf_files) > 3:
        print(f"   • ... and {len(pdf_files) - 3} others")
    print()
    
    # Confirmation utilisateur
    response = input("🚀 Start the ingestion pipeline? (y/N): ").strip().lower()
    if response not in ['y', 'yes', 'oui', 'o']:
        print("❌ Pipeline cancelled.")
        return
    
    # Exécuter le pipeline
    pipeline = IngestionPipeline(data_dir)
    results = pipeline.run()
    
    # Sauvegarder les résultats
    if results.get("status") == "success":
        pipeline.save_results(results)
        print("\n✅ The RAG system is now ready for questions!")
        print("💡 Use 'python main.py' to ask questions.")
    else:
        print("\n❌ The pipeline failed. Check the errors above.")


if __name__ == "__main__":
    main()
