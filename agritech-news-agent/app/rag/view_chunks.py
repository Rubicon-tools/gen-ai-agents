#!/usr/bin/env python3
"""
Script pour visualiser tous les chunks stockés dans la base de données
Affiche le contenu complet de chaque chunk avec ses métadonnées
"""

from qdrant_client import QdrantClient
import json

def view_all_chunks():
    """Affiche tous les chunks stockés dans la base de données"""
    
    print("📄 VISUALISATION COMPLÈTE DES CHUNKS")
    print("=" * 50)
    
    # Connexion à Qdrant
    client = QdrantClient(host="localhost", port=6333)
    
    try:
        # Récupérer tous les chunks
        all_chunks = client.scroll(
            collection_name="rag_collection",
            limit=100,  # Récupérer jusqu'à 100 chunks
            with_payload=True,
            with_vectors=False  # Pas besoin des vecteurs pour l'affichage
        )
        
        chunks = all_chunks[0]
        print(f"📊 Total des chunks trouvés: {len(chunks)}")
        print()
        
        if not chunks:
            print("❌ Aucun chunk trouvé dans la base de données")
            return
        
        # Afficher chaque chunk en détail
        for i, chunk in enumerate(chunks, 1):
            print(f"🔍 CHUNK #{i}")
            print("-" * 30)
            
            # Informations du chunk
            chunk_id = chunk.id
            chunk_text = chunk.payload.get('text', 'Pas de texte')
            
            print(f"🆔 ID: {chunk_id}")
            print(f"📏 Longueur du texte: {len(chunk_text)} caractères")
            print(f"📝 Contenu:")
            print("─" * 40)
            
            # Afficher le texte du chunk
            print(chunk_text)
            print("─" * 40)
            
            # Statistiques du texte
            words = chunk_text.split()
            sentences = chunk_text.split('.')
            
            print(f"📊 Statistiques:")
            print(f"   • Mots: {len(words)}")
            print(f"   • Phrases: {len(sentences)}")
            print(f"   • Caractères: {len(chunk_text)}")
            
            # Aperçu des premiers mots
            if words:
                first_words = ' '.join(words[:10])
                print(f"   • Premiers mots: {first_words}...")
            
            print()
            
            # Séparateur entre chunks
            if i < len(chunks):
                print("=" * 60)
                print()
        
        # Résumé final
        print("📈 RÉSUMÉ FINAL")
        print("=" * 30)
        print(f"Total des chunks analysés: {len(chunks)}")
        
        # Calculer les statistiques globales
        total_chars = sum(len(chunk.payload.get('text', '')) for chunk in chunks)
        total_words = sum(len(chunk.payload.get('text', '').split()) for chunk in chunks)
        
        print(f"Total des caractères: {total_chars:,}")
        print(f"Total des mots: {total_words:,}")
        print(f"Moyenne par chunk: {total_chars/len(chunks):.0f} caractères")
        
    except Exception as e:
        print(f"❌ Erreur lors de la récupération des chunks: {e}")

def view_chunk_by_id(chunk_id):
    """Affiche un chunk spécifique par son ID"""
    
    print(f"🔍 CHUNK SPÉCIFIQUE (ID: {chunk_id})")
    print("=" * 40)
    
    client = QdrantClient(host="localhost", port=6333)
    
    try:
        # Récupérer le chunk par ID
        chunk = client.retrieve(
            collection_name="rag_collection",
            ids=[chunk_id],
            with_payload=True,
            with_vectors=False
        )
        
        if chunk:
            chunk_data = chunk[0]
            chunk_text = chunk_data.payload.get('text', 'Pas de texte')
            
            print(f"📝 Contenu du chunk {chunk_id}:")
            print("─" * 40)
            print(chunk_text)
            print("─" * 40)
            
            print(f"📊 Statistiques:")
            print(f"   • Longueur: {len(chunk_text)} caractères")
            print(f"   • Mots: {len(chunk_text.split())}")
        else:
            print(f"❌ Aucun chunk trouvé avec l'ID {chunk_id}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    print("Choisissez une option:")
    print("1. Voir tous les chunks")
    print("2. Voir un chunk spécifique par ID")
    
    choice = input("Votre choix (1 ou 2): ").strip()
    
    if choice == "1":
        view_all_chunks()
    elif choice == "2":
        chunk_id = input("Entrez l'ID du chunk: ").strip()
        try:
            chunk_id = int(chunk_id)
            view_chunk_by_id(chunk_id)
        except ValueError:
            print("❌ L'ID doit être un nombre entier")
    else:
        print("❌ Choix invalide. Affichage de tous les chunks par défaut.")
        view_all_chunks()
