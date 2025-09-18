#!/usr/bin/env python3
"""
RAG System - Question-Answer Interface
======================================

This script allows you to ask questions about the indexed documents.
Make sure to run ingestion_pipeline.py before using this script.
"""

import warnings
warnings.filterwarnings("ignore", message=".*urllib3.*OpenSSL.*")

import os
from typing import List

from app.rag.modules.vectorstore import get_qdrant_client, search_top_k
from app.rag.modules.embeddings import embed_texts
from app.rag.modules.generator import generate_response
from dotenv import load_dotenv


def check_database_status():
    """Check if the database contains data"""
    try:
        client = get_qdrant_client()
        
        # Check if the collection exists
        collections = client.get_collections()
        if not collections.collections:
            return False, "No collection found"
        
        # Check if the collection rag_collection contains data
        try:
            points_count = client.count("rag_collection").count
            if points_count == 0:
                return False, "Empty collection - no documents indexed"
            return True, f"Collection contains {points_count} chunks"
        except:
            return False, "Unable to access the rag_collection"
            
    except Exception as e:
        return False, f"Error connecting to the database: {e}"


def interactive_qa():
    """Interactive interface to ask questions"""
    print("🤖 RAG SYSTEM - QUESTION-ANSWER MODE")
    print("=" * 50)
    print("💡 Ask questions about the indexed documents")
    print("📚 Commands: 'quit' to exit, 'status' to check the status")
    print()
    
    client = get_qdrant_client()
    
    while True:
        try:
            question = input("❓ Your question: ").strip()
            
            if not question:
                continue
                
            if question.lower() in {"exit", "quit", ":q", "q"}:
                print("👋 Goodbye!")
                break
                
            if question.lower() == "status":
                # Display the database status
                try:
                    points_count = client.count("rag_collection").count
                    collection_info = client.get_collection("rag_collection")
                    print(f"📊 Database status:")
                    print(f"   • Collection: {collection_info.status}")
                    print(f"   • Chunks indexed: {points_count}")
                    print(f"   • Vector dimension: {collection_info.config.params.vectors.size}")
                except Exception as e:
                    print(f"❌ Error checking the status: {e}")
                continue
            
            # Process the question
            print(f"\n🔍 Searching...")
            
            # 1. Generate the question embedding
            question_embedding = embed_texts([question])[0]
            
            # 2. Search for relevant chunks
            top_chunks: List[str] = search_top_k(client, question_embedding, k=3)
            
            if not top_chunks:
                print("❌ No relevant context found")
                continue
            
            # 3. Generate the answer
            print(f"📄 Found context: {len(top_chunks)} chunks")
            answer = generate_response(top_chunks, question)
            
            # 4. Display the answer
            print(f"\n🤖 Answer:")
            print("─" * 50)
            print(answer)
            print("─" * 50)
            
            print()
            
        except EOFError:
            break
        except KeyboardInterrupt:
            print("\n👋 User interruption")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
            print("💡 Try to reformulate your question")


def main():
    """Main entry point"""
    
    # Load environment variables
    load_dotenv()
    
    print("🔍 RAG SYSTEM - INITIAL CHECK")
    print("=" * 40)
    
    # Check if the database is ready
    db_ready, status_message = check_database_status()
    
    if not db_ready:
        print(f"❌ {status_message}")
        print("\n💡 SOLUTIONS:")
        print("   1. Run: python ingestion_pipeline.py")
        print("   2. Check if Qdrant is running")
        print("   3. Check if documents have been indexed")
        return
    
    print(f"✅ {status_message}")
    print("🚀 RAG system ready for questions!")
    print()
    
    # Start the Q&A interface
    interactive_qa()


if __name__ == "__main__":
    main()
