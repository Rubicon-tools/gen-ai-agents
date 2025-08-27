#!/usr/bin/env python3
"""
Script d'inspection de la base de données vectorielle Qdrant
Vérifie les collections, chunks et embeddings
"""

from qdrant_client import QdrantClient
from qdrant_client.models import Filter
import json

def inspect_qdrant_database():
    """Inspecte la base de données Qdrant et affiche les statistiques"""
    
    # Connexion à Qdrant
    client = QdrantClient(host="localhost", port=6333)
    
    print("🔍 INSPECTION DE LA BASE DE DONNÉES QDRANT")
    print("=" * 50)
    
    # 1. Lister toutes les collections
    collections = client.get_collections()
    print(f"\n📚 Collections disponibles: {len(collections.collections)}")
    
    for collection in collections.collections:
        print(f"  - {collection.name}")
        
        # 2. Obtenir les informations détaillées de la collection
        collection_info = client.get_collection(collection.name)
        print(f"    📊 Statut: {collection_info.status}")
        
        # 3. Compter les points manuellement
        try:
            points_count = client.count(collection.name).count
            print(f"    🔢 Nombre de points: {points_count}")
        except:
            print(f"    🔢 Nombre de points: Impossible à déterminer")
        
        print(f"    📏 Dimension des vecteurs: {collection_info.config.params.vectors.size}")
        print(f"    📐 Distance: {collection_info.config.params.vectors.distance}")
        
        # 4. Afficher quelques exemples de chunks
        try:
            search_result = client.scroll(
                collection_name=collection.name,
                limit=3,
                with_payload=True,
                with_vectors=False
            )
            
            if search_result[0]:
                print(f"\n    📄 Exemples de chunks (premiers 3):")
                for i, point in enumerate(search_result[0]):
                    chunk_text = point.payload.get('text', 'Pas de texte')
                    # Tronquer le texte pour l'affichage
                    preview = chunk_text[:100] + "..." if len(chunk_text) > 100 else chunk_text
                    print(f"      Chunk {i+1}: {preview}")
            else:
                print(f"\n    📄 Aucun chunk trouvé")
        except Exception as e:
            print(f"\n    📄 Erreur lors de la récupération des chunks: {e}")
        
        print()
    
    # 5. Statistiques globales
    print("📈 STATISTIQUES GLOBALES")
    print("-" * 30)
    
    total_points = 0
    for collection in collections.collections:
        try:
            count = client.count(collection.name).count
            total_points += count
        except:
            pass
    
    print(f"Total des points dans toutes les collections: {total_points}")
    
    # 6. Vérifier la qualité des embeddings
    if collections.collections:
        main_collection = collections.collections[0].name
        print(f"\n🔍 Vérification de la qualité des embeddings dans '{main_collection}':")
        
        try:
            # Obtenir un point avec son vecteur
            point_with_vector = client.scroll(
                collection_name=main_collection,
                limit=1,
                with_payload=True,
                with_vectors=True
            )
            
            if point_with_vector[0]:
                point = point_with_vector[0][0]
                vector = point.vector
                print(f"  ✅ Vecteur généré: {len(vector)} dimensions")
                print(f"  📏 Premières valeurs: {vector[:5]}...")
                print(f"  📊 Valeur min: {min(vector):.6f}")
                print(f"  📊 Valeur max: {max(vector):.6f}")
                print(f"  📊 Valeur moyenne: {sum(vector)/len(vector):.6f}")
            else:
                print("  ❌ Aucun point trouvé avec vecteur")
        except Exception as e:
            print(f"  ❌ Erreur lors de la vérification des embeddings: {e}")

if __name__ == "__main__":
    try:
        inspect_qdrant_database()
    except Exception as e:
        print(f"❌ Erreur lors de l'inspection: {e}")
        print("Vérifiez que Qdrant est en cours d'exécution sur le port 6333")
