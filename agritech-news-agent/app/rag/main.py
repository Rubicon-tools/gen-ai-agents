#!/usr/bin/env python3
"""
Système RAG - Interface de question-réponse
===========================================

Ce script permet de poser des questions sur les documents indexés.
Assurez-vous d'avoir exécuté ingestion_pipeline.py AVANT d'utiliser ce script.
"""

import warnings
warnings.filterwarnings("ignore", message=".*urllib3.*OpenSSL.*")

import os
from typing import List

from modules.vectorstore import get_qdrant_client, search_top_k
from modules.embeddings import embed_texts
from modules.generator import generate_response
from dotenv import load_dotenv


def check_database_status():
    """Vérifie que la base de données contient des données"""
    try:
        client = get_qdrant_client()
        
        # Vérifier que la collection existe
        collections = client.get_collections()
        if not collections.collections:
            return False, "Aucune collection trouvée"
        
        # Vérifier que la collection rag_collection contient des données
        try:
            points_count = client.count("rag_collection").count
            if points_count == 0:
                return False, "Collection vide - aucun document indexé"
            return True, f"Collection contient {points_count} chunks"
        except:
            return False, "Impossible d'accéder à la collection rag_collection"
            
    except Exception as e:
        return False, f"Erreur de connexion à la base: {e}"


def interactive_qa():
    """Interface interactive pour poser des questions"""
    print("🤖 SYSTÈME RAG - MODE QUESTIONS-RÉPONSES")
    print("=" * 50)
    print("💡 Posez vos questions sur les documents indexés")
    print("📚 Commandes: 'quit' pour quitter, 'status' pour le statut")
    print()
    
    client = get_qdrant_client()
    
    while True:
        try:
            question = input("❓ Votre question: ").strip()
            
            if not question:
                continue
                
            if question.lower() in {"exit", "quit", ":q", "q"}:
                print("👋 Au revoir !")
                break
                
            if question.lower() == "status":
                # Afficher le statut de la base
                try:
                    points_count = client.count("rag_collection").count
                    collection_info = client.get_collection("rag_collection")
                    print(f"📊 Statut de la base:")
                    print(f"   • Collection: {collection_info.status}")
                    print(f"   • Chunks indexés: {points_count}")
                    print(f"   • Dimension des vecteurs: {collection_info.config.params.vectors.size}")
                except Exception as e:
                    print(f"❌ Erreur lors de la vérification du statut: {e}")
                continue
            
            # Traiter la question
            print(f"\n🔍 Recherche en cours...")
            
            # 1. Générer l'embedding de la question
            question_embedding = embed_texts([question])[0]
            
            # 2. Rechercher les chunks pertinents
            top_chunks: List[str] = search_top_k(client, question_embedding, k=3)
            
            if not top_chunks:
                print("❌ Aucun contexte pertinent trouvé")
                continue
            
            # 3. Générer la réponse
            print(f"📄 Contexte trouvé: {len(top_chunks)} chunks")
            answer = generate_response(top_chunks, question)
            
            # 4. Afficher la réponse
            print(f"\n🤖 Réponse:")
            print("─" * 50)
            print(answer)
            print("─" * 50)
            
            print()
            
        except EOFError:
            break
        except KeyboardInterrupt:
            print("\n👋 Interruption utilisateur")
            break
        except Exception as e:
            print(f"❌ Erreur: {e}")
            print("💡 Essayez de reformuler votre question")


def main():
    """Point d'entrée principal"""
    
    # Charger les variables d'environnement
    load_dotenv()
    
    print("🔍 SYSTÈME RAG - VÉRIFICATION INITIALE")
    print("=" * 40)
    
    # Vérifier que la base de données est prête
    db_ready, status_message = check_database_status()
    
    if not db_ready:
        print(f"❌ {status_message}")
        print("\n💡 SOLUTIONS:")
        print("   1. Exécutez d'abord: python ingestion_pipeline.py")
        print("   2. Vérifiez que Qdrant est en cours d'exécution")
        print("   3. Vérifiez que des documents ont été indexés")
        return
    
    print(f"✅ {status_message}")
    print("🚀 Système RAG prêt pour les questions !")
    print()
    
    # Démarrer l'interface Q&A
    interactive_qa()


if __name__ == "__main__":
    main()
