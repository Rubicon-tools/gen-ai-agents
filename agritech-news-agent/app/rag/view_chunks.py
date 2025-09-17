#!/usr/bin/env python3
"""
Script to view all chunks stored in the database
Display the complete content of each chunk with its metadata
"""

from qdrant_client import QdrantClient
import json

def view_all_chunks():
    """Display all chunks stored in the database"""
    
    print("📄 FULL CHUNKS VISUALIZATION")
    print("=" * 50)
    
    # Connect to Qdrant
    client = QdrantClient(host="localhost", port=6333)
    
    try:
        # Get all chunks
        all_chunks = client.scroll(
            collection_name="rag_collection",
            limit=100,  # Get up to 100 chunks
            with_payload=True,
            with_vectors=False  # No need for vectors for display
        )
        
        chunks = all_chunks[0]
        print(f"📊 Total found chunks: {len(chunks)}")
        print()
        
        if not chunks:
            print("❌ No chunk found in the database")
            return
        
        # Display each chunk in detail
        for i, chunk in enumerate(chunks, 1):
            print(f"🔍 CHUNK #{i}")
            print("-" * 30)
            
            # Chunk information
            chunk_id = chunk.id
            chunk_text = chunk.payload.get('text', 'No text')
            
            print(f"🆔 ID: {chunk_id}")
            print(f"📏 Text length: {len(chunk_text)} characters")
            print(f"📝 Contenu:")
            print("─" * 40)
            
            # Display the chunk text
            print(chunk_text)
            print("─" * 40)
            
            # Text statistics
            words = chunk_text.split()
            sentences = chunk_text.split('.')
            
            print(f"📊 Statistiques:")
            print(f"   • Mots: {len(words)}")
            print(f"   • Phrases: {len(sentences)}")
            print(f"   • Caractères: {len(chunk_text)}")
            
            # Preview of the first words
            if words:
                first_words = ' '.join(words[:10])
                print(f"   • Premiers mots: {first_words}...")
            
            print()
            
            # Separator between chunks
            if i < len(chunks):
                print("=" * 60)
                print()
        
        # Final summary
        print("📈 FINAL SUMMARY")
        print("=" * 30)
        print(f"Total analyzed chunks: {len(chunks)}")
        
        # Calculate global statistics
        total_chars = sum(len(chunk.payload.get('text', '')) for chunk in chunks)
        total_words = sum(len(chunk.payload.get('text', '').split()) for chunk in chunks)
        
        print(f"Total characters: {total_chars:,}")
        print(f"Total words: {total_words:,}")
        print(f"Average per chunk: {total_chars/len(chunks):.0f} characters")
        
    except Exception as e:
        print(f"❌ Error during the retrieval of chunks: {e}")

def view_chunk_by_id(chunk_id):
    """Display a specific chunk by its ID"""
    
    print(f"🔍 SPECIFIC CHUNK (ID: {chunk_id})")
    print("=" * 40)
    
    client = QdrantClient(host="localhost", port=6333)
    
    try:
        # Get the chunk by ID
        chunk = client.retrieve(
            collection_name="rag_collection",
            ids=[chunk_id],
            with_payload=True,
            with_vectors=False
        )
        
        if chunk:
            chunk_data = chunk[0]
            chunk_text = chunk_data.payload.get('text', 'No text')
            
            print(f"📝 Chunk content {chunk_id}:")
            print("─" * 40)
            print(chunk_text)
            print("─" * 40)
            
            print(f"📊 Statistics:")
            print(f"   • Length: {len(chunk_text)} characters")
            print(f"   • Words: {len(chunk_text.split())}")
        else:
            print(f"❌ No chunk found with the ID {chunk_id}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("Choose an option:")
    print("1. View all chunks")
    print("2. View a specific chunk by ID")
    
    choice = input("Your choice (1 or 2): ").strip()
    
    if choice == "1":
        view_all_chunks()
    elif choice == "2":
        chunk_id = input("Enter the ID of the chunk: ").strip()
        try:
            chunk_id = int(chunk_id)
            view_chunk_by_id(chunk_id)
        except ValueError:
            print("❌ The ID must be an integer")
    else:
        print("❌ Invalid choice. Displaying all chunks by default.")
        view_all_chunks()
