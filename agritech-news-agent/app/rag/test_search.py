#!/usr/bin/env python3
"""
Script de test de recherche vectorielle
Teste la qualité des embeddings et de la recherche
"""

from qdrant_client import QdrantClient
from modules.embeddings import embed_texts
import numpy as np

def test_vector_search():
    """Teste la recherche vectorielle et affiche les résultats"""
    
    print("🔍 TEST DE RECHERCHE VECTORIELLE")
    print("=" * 40)
    
    # Connexion à Qdrant
    client = QdrantClient(host="localhost", port=6333)
    
    # Test avec différentes requêtes
    test_queries = [
        "humanitarian data",
        "non-personal data",
        "principled humanitarian action",
        "centre for humanitarian data",
        "loi de finances",
        "procédures administratives"
    ]
    
    for query in test_queries:
        print(f"\n🔍 Requête: '{query}'")
        print("-" * 30)
        
        try:
            # Générer l'embedding de la requête
            query_embedding = embed_texts([query])[0]
            print(f"✅ Embedding généré: {len(query_embedding)} dimensions")
            
            # Rechercher les chunks les plus similaires
            search_results = client.search(
                collection_name="rag_collection",
                query_vector=query_embedding,
                limit=3,
                with_payload=True,
                with_vectors=False
            )
            
            print(f"📊 Résultats trouvés: {len(search_results)}")
            
            for i, result in enumerate(search_results):
                score = result.score
                chunk_text = result.payload.get('text', 'Pas de texte')
                preview = chunk_text[:150] + "..." if len(chunk_text) > 150 else chunk_text
                
                print(f"  {i+1}. Score: {score:.4f}")
                print(f"     Chunk: {preview}")
                print()
                
        except Exception as e:
            print(f"❌ Erreur: {e}")
    
    # Test de similarité entre chunks
    print("\n🔍 TEST DE SIMILARITÉ ENTRE CHUNKS")
    print("=" * 40)
    
    try:
        # Récupérer quelques chunks
        chunks_data = client.scroll(
            collection_name="rag_collection",
            limit=3,
            with_payload=True,
            with_vectors=True
        )
        
        if chunks_data[0]:
            print(f"📊 Comparaison de {len(chunks_data[0])} chunks:")
            
            for i in range(len(chunks_data[0])):
                for j in range(i+1, len(chunks_data[0])):
                    vec1 = np.array(chunks_data[0][i].vector)
                    vec2 = np.array(chunks_data[0][j].vector)
                    
                    # Calculer la similarité cosinus
                    similarity = np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
                    
                    print(f"  Chunk {i+1} vs Chunk {j+1}: Similarité = {similarity:.4f}")
                    
                    # Afficher un aperçu des chunks
                    chunk1_preview = chunks_data[0][i].payload.get('text', '')[:50]
                    chunk2_preview = chunks_data[0][j].payload.get('text', '')[:50]
                    print(f"    '{chunk1_preview}' vs '{chunk2_preview}'")
                    print()
        else:
            print("❌ Aucun chunk trouvé pour la comparaison")
            
    except Exception as e:
        print(f"❌ Erreur lors de la comparaison: {e}")

if __name__ == "__main__":
    try:
        test_vector_search()
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")
        print("Vérifiez que Qdrant est en cours d'exécution et que les modules sont disponibles")
