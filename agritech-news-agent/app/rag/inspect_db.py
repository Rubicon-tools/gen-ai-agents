#!/usr/bin/env python3
"""
Script to inspect the vector database Qdrant
Check collections, chunks and embeddings
"""

from qdrant_client import QdrantClient
from qdrant_client.models import Filter
import json

def inspect_qdrant_database():
    """Inspect the Qdrant database and display the statistics"""
    
    # Connect to Qdrant
    client = QdrantClient(host="localhost", port=6333)
    
    print("🔍 INSPECTION OF THE QDRANT DATABASE")
    print("=" * 50)
    
    # 1. List all collections
    collections = client.get_collections()
    print(f"\n📚 Available collections: {len(collections.collections)}")
    
    for collection in collections.collections:
        print(f"  - {collection.name}")
        
        # 2. Get detailed information about the collection
        collection_info = client.get_collection(collection.name)
        print(f"    📊 Status: {collection_info.status}")
        
        # 3. Count the points manually
        try:
            points_count = client.count(collection.name).count
            print(f"    🔢 Number of points: {points_count}")
        except:
            print(f"    🔢 Number of points: Impossible to determine")
        
        print(f"    📏 Vector dimension: {collection_info.config.params.vectors.size}")
        print(f"    📐 Distance: {collection_info.config.params.vectors.distance}")
        
        # 4. Display some examples of chunks
        try:
            search_result = client.scroll(
                collection_name=collection.name,
                limit=3,
                with_payload=True,
                with_vectors=False
            )
            
            if search_result[0]:
                print(f"\n    📄 Examples of chunks (first 3):")
                for i, point in enumerate(search_result[0]):
                    chunk_text = point.payload.get('text', 'No text')
                    # Truncate the text for display
                    preview = chunk_text[:100] + "..." if len(chunk_text) > 100 else chunk_text
                    print(f"      Chunk {i+1}: {preview}")
            else:
                print(f"\n    📄 No chunk found")
        except Exception as e:
            print(f"\n    📄 Error during the retrieval of chunks: {e}")
        
        print()
    
    # 5. Statistiques globales
    print("📈 GLOBAL STATISTICS")
    print("-" * 30)
    
    total_points = 0
    for collection in collections.collections:
        try:
            count = client.count(collection.name).count
            total_points += count
        except:
            pass
    
    print(f"Total points in all collections: {total_points}")
    
    # 6. Check the quality of embeddings
    if collections.collections:
        main_collection = collections.collections[0].name
        print(f"\n🔍 Checking the quality of embeddings in '{main_collection}':")
        
        try:
            # Get a point with its vector
            point_with_vector = client.scroll(
                collection_name=main_collection,
                limit=1,
                with_payload=True,
                with_vectors=True
            )
            
            if point_with_vector[0]:
                point = point_with_vector[0][0]
                vector = point.vector
                print(f"  ✅ Generated vector: {len(vector)} dimensions")
                print(f"  📏 First values: {vector[:5]}...")
                print(f"  📊 Minimum value: {min(vector):.6f}")
                print(f"  📊 Maximum value: {max(vector):.6f}")
                print(f"  📊 Average value: {sum(vector)/len(vector):.6f}")
            else:
                print("  ❌ No point found with vector")
        except Exception as e:
            print(f"  ❌ Error during the verification of embeddings: {e}")

if __name__ == "__main__":
    try:
        inspect_qdrant_database()
    except Exception as e:
        print(f"❌ Error during the inspection: {e}")
        print("Check if Qdrant is running on port 6333")
