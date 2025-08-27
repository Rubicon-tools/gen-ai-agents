#!/usr/bin/env python3
"""
Script de diagnostic des requêtes RAG
Montre comment le système trouve le contexte pertinent pour chaque question
"""

from qdrant_client import QdrantClient
from modules.embeddings import embed_texts
from modules.generator import generate_response
import json

def debug_query(question: str, show_full_context: bool = False):
    """
    Débogue une requête en montrant le processus de recherche et de récupération
    """
    print("🔍 DIAGNOSTIC DE REQUÊTE RAG")
    print("=" * 50)
    print(f"❓ Question: {question}")
    print()
    
    # 1. Connexion à Qdrant
    client = QdrantClient(host="localhost", port=6333)
    
    # 2. Générer l'embedding de la question
    print("🧠 ÉTAPE 1: Génération de l'embedding de la question")
    print("-" * 40)
    
    try:
        question_embedding = embed_texts([question])[0]
        print(f"✅ Embedding généré: {len(question_embedding)} dimensions")
        print(f"📊 Premières valeurs: {question_embedding[:5]}...")
    except Exception as e:
        print(f"❌ Erreur lors de la génération de l'embedding: {e}")
        return
    
    # 3. Rechercher les chunks les plus similaires
    print(f"\n🔍 ÉTAPE 2: Recherche des chunks pertinents")
    print("-" * 40)
    
    try:
        search_results = client.search(
            collection_name="rag_collection",
            query_vector=question_embedding,
            limit=5,  # Récupérer top-5 pour l'analyse
            with_payload=True,
            with_vectors=False
        )
        
        print(f"📊 Chunks trouvés: {len(search_results)}")
        print()
        
        # Analyser chaque résultat
        relevant_chunks = []
        for i, result in enumerate(search_results):
            score = result.score
            chunk_text = result.payload.get('text', 'Pas de texte')
            chunk_id = result.id
            
            print(f"🏆 CHUNK #{i+1} (ID: {chunk_id})")
            print(f"   📈 Score de similarité: {score:.4f}")
            print(f"   📏 Longueur: {len(chunk_text)} caractères")
            
            # Analyser la pertinence du chunk
            relevance_analysis = analyze_chunk_relevance(question, chunk_text)
            print(f"   🎯 Pertinence: {relevance_analysis}")
            
            # Afficher un aperçu du chunk
            preview = chunk_text[:150] + "..." if len(chunk_text) > 150 else chunk_text
            print(f"   📝 Aperçu: {preview}")
            
            # Décider si le chunk est suffisamment pertinent
            if score > 0.3:  # Seuil de pertinence
                relevant_chunks.append(chunk_text)
                print(f"   ✅ CONSERVÉ (score > 0.3)")
            else:
                print(f"   ⚠️  SCORE TROP FAIBLE")
            
            print()
        
        # 4. Construire le contexte final
        print("📋 ÉTAPE 3: Construction du contexte final")
        print("-" * 40)
        
        if relevant_chunks:
            context = "\n\n".join(relevant_chunks)
            print(f"✅ Contexte construit: {len(relevant_chunks)} chunks pertinents")
            print(f"📏 Longueur totale du contexte: {len(context)} caractères")
            
            if show_full_context:
                print(f"\n📄 CONTEXTE COMPLET:")
                print("─" * 50)
                print(context)
                print("─" * 50)
            
            # 5. Générer la réponse
            print(f"\n🤖 ÉTAPE 4: Génération de la réponse")
            print("-" * 40)
            
            try:
                answer = generate_response(relevant_chunks, question)
                print(f"✅ Réponse générée:")
                print("─" * 50)
                print(answer)
                print("─" * 50)
                
            except Exception as e:
                print(f"❌ Erreur lors de la génération: {e}")
                
        else:
            print("❌ Aucun chunk suffisamment pertinent trouvé")
            print("💡 Suggestions:")
            print("   • Reformulez votre question")
            print("   • Utilisez des mots-clés du document")
            print("   • Vérifiez que le document contient l'information")
    
    except Exception as e:
        print(f"❌ Erreur lors de la recherche: {e}")


def analyze_chunk_relevance(question: str, chunk_text: str) -> str:
    """
    Analyse la pertinence d'un chunk par rapport à une question
    """
    question_lower = question.lower()
    chunk_lower = chunk_text.lower()
    
    # Compter les mots-clés communs
    question_words = set(question_lower.split())
    chunk_words = set(chunk_lower.split())
    common_words = question_words.intersection(chunk_words)
    
    # Filtrer les mots trop courts
    common_words = {w for w in common_words if len(w) > 3}
    
    if len(common_words) >= 3:
        return f"TRÈS PERTINENT ({len(common_words)} mots-clés: {', '.join(list(common_words)[:3])})"
    elif len(common_words) >= 1:
        return f"PERTINENT ({len(common_words)} mots-clés: {', '.join(common_words)})"
    else:
        return "PEU PERTINENT (aucun mot-clé commun)"


def interactive_debug():
    """
    Mode interactif pour tester plusieurs questions
    """
    print("🔍 MODE DIAGNOSTIC INTERACTIF")
    print("=" * 40)
    print("Tapez vos questions pour analyser le processus RAG")
    print("Commandes: 'quit' pour quitter, 'context' pour voir le contexte complet")
    print()
    
    while True:
        try:
            question = input("❓ Votre question: ").strip()
            
            if not question:
                continue
                
            if question.lower() in ['quit', 'exit', 'q']:
                break
                
            if question.lower() == 'context':
                # Mode avec contexte complet
                debug_query("humanitarian data", show_full_context=True)
                continue
            
            # Mode normal
            debug_query(question, show_full_context=False)
            
            print("\n" + "="*60 + "\n")
            
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"❌ Erreur: {e}")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        # Mode ligne de commande
        question = " ".join(sys.argv[1:])
        debug_query(question, show_full_context=True)
    else:
        # Mode interactif
        interactive_debug()
