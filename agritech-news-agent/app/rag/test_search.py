#!/usr/bin/env python3
"""
Test vector search
Test the quality of embeddings and search
"""

from qdrant_client import QdrantClient
from modules.embeddings import embed_texts
import numpy as np

def test_vector_search():
    """Test vector search and display the results"""
    
    print("🔍 TEST VECTOR SEARCH")
    print("=" * 40)
    
    # Connect to Qdrant
    client = QdrantClient(host="localhost", port=6333)
    
    # Test with different queries
    test_queries = [
        "humanitarian data",
        "non-personal data",
        "principled humanitarian action",
        "centre for humanitarian data",
        "loi de finances",
        "procédures administratives"
    ]
    
    for query in test_queries:
        print(f"\n🔍 Query: '{query}'")
        print("-" * 30)
        
        try:
            # Generate the query embedding
            query_embedding = embed_texts([query])[0]
            print(f"✅ Embedding generated: {len(query_embedding)} dimensions")
            
            # Search for the most similar chunks
            search_results = client.search(
                collection_name="rag_collection",
                query_vector=query_embedding,
                limit=3,
                with_payload=True,
                with_vectors=False
            )
            
            print(f"📊 Found results: {len(search_results)}")
            
            for i, result in enumerate(search_results):
                score = result.score
                chunk_text = result.payload.get('text', 'No text')
                preview = chunk_text[:150] + "..." if len(chunk_text) > 150 else chunk_text
                
                print(f"  {i+1}. Score: {score:.4f}")
                print(f"     Chunk: {preview}")
                print()
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    # Test similarity between chunks
    print("\n🔍 TEST DE SIMILARITÉ ENTRE CHUNKS")
    print("=" * 40)
    
    try:
        # Get some chunks
        chunks_data = client.scroll(
            collection_name="rag_collection",
            limit=3,
            with_payload=True,
            with_vectors=True
        )
        
        if chunks_data[0]:
            print(f"📊 Comparison of {len(chunks_data[0])} chunks:")
            
            for i in range(len(chunks_data[0])):
                for j in range(i+1, len(chunks_data[0])):
                    vec1 = np.array(chunks_data[0][i].vector)
                    vec2 = np.array(chunks_data[0][j].vector)
                    
                    # Calculate cosine similarity
                    similarity = np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
                    
                    print(f"  Chunk {i+1} vs Chunk {j+1}: Similarité = {similarity:.4f}")
                    
                    # Display a preview of the chunks
                    chunk1_preview = chunks_data[0][i].payload.get('text', '')[:50]
                    chunk2_preview = chunks_data[0][j].payload.get('text', '')[:50]
                    print(f"    '{chunk1_preview}' vs '{chunk2_preview}'")
                    print()
        else:
            print("❌ No chunk found for the comparison")
            
    except Exception as e:
        print(f"❌ Error during the comparison: {e}")

if __name__ == "__main__":
    try:
        test_vector_search()
    except Exception as e:
        print(f"❌ Error during the test: {e}")
        print("Check if Qdrant is running and that the modules are available")
