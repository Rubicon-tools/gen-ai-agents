#!/usr/bin/env python3
"""
Pipeline d'ingestion pour le système RAG
========================================

Ce script traite les documents PDF et les indexe dans la base vectorielle.
Exécutez-le AVANT d'utiliser le système de Q&A.

Étapes:
1. Extraction des documents PDF
2. Découpage en chunks optimisés
3. Génération des embeddings
4. Indexation dans la base vectorielle
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
    """Pipeline complet d'ingestion des documents"""
    
    def __init__(self, data_dir: str = "data", collection_name: str = "rag_collection"):
        self.data_dir = data_dir
        self.collection_name = collection_name
        self.qdrant_client = get_qdrant_client()
        
    def run(self) -> Dict[str, Any]:
        """
        Exécute le pipeline complet d'ingestion
        """
        print("🚀 DÉMARRAGE DU PIPELINE D'INGESTION")
        print("=" * 50)
        
        results = {
            "timestamp": datetime.now().isoformat(),
            "data_directory": self.data_dir,
            "collection_name": self.collection_name,
            "steps": {}
        }
        
        # ÉTAPE 1: Extraction des PDFs
        print("\n📄 ÉTAPE 1: Extraction des documents PDF")
        print("-" * 40)
        
        try:
            texts = load_pdfs_from_folder(self.data_dir, max_files=None)  # Traite tous les PDFs
            extraction_analysis = analyze_extracted_content(texts)
            
            results["steps"]["extraction"] = {
                "status": "success",
                "documents_processed": len(texts),
                "analysis": extraction_analysis
            }
            
            print(f"✅ {len(texts)} documents extraits avec succès")
            print(f"📊 Total: {extraction_analysis['total_characters']:,} caractères")
            
        except Exception as e:
            results["steps"]["extraction"] = {
                "status": "error",
                "error": str(e)
            }
            print(f"❌ Erreur lors de l'extraction: {e}")
            return results
        
        # ÉTAPE 2: Découpage en chunks
        print(f"\n✂️ ÉTAPE 2: Découpage en chunks optimisés")
        print("-" * 40)
        
        try:
            chunks = split_texts_into_chunks(
                texts,
                chunk_size_tokens=512,  # Taille fixe
                chunk_overlap_tokens=128  # Overlap significatif
            )
            
            chunk_analysis = analyze_chunks(chunks)
            
            results["steps"]["chunking"] = {
                "status": "success",
                "chunks_created": len(chunks),
                "analysis": chunk_analysis
            }
            
            print(f"✅ {len(chunks)} chunks créés")
            print(f"📊 Taille moyenne: {chunk_analysis['avg_size']:.0f} tokens")
            print(f"📈 Distribution: {chunk_analysis['size_distribution']}")
            
        except Exception as e:
            results["steps"]["chunking"] = {
                "status": "error",
                "error": str(e)
            }
            print(f"❌ Erreur lors du chunking: {e}")
            return results
        
        # ÉTAPE 3: Génération des embeddings
        print(f"\n🧠 ÉTAPE 3: Génération des embeddings ({len(chunks)} chunks)")
        print("-" * 40)
        
        try:
            chunk_embeddings = embed_texts(chunks)
            
            if not chunk_embeddings or not chunk_embeddings[0]:
                raise RuntimeError("Aucun embedding généré")
            
            vector_size = len(chunk_embeddings[0])
            
            results["steps"]["embeddings"] = {
                "status": "success",
                "embeddings_generated": len(chunk_embeddings),
                "vector_dimension": vector_size
            }
            
            print(f"✅ {len(chunk_embeddings)} embeddings générés")
            print(f"📏 Dimension des vecteurs: {vector_size}")
            
        except Exception as e:
            results["steps"]["embeddings"] = {
                "status": "error",
                "error": str(e)
            }
            print(f"❌ Erreur lors de la génération des embeddings: {e}")
            return results
        
        # ÉTAPE 4: Indexation dans Qdrant
        print(f"\n🗄️ ÉTAPE 4: Indexation dans la base vectorielle")
        print("-" * 40)
        
        try:
            # Créer/recréer la collection
            ensure_collection(self.qdrant_client, vector_size)
            print(f"✅ Collection '{self.collection_name}' configurée")
            
            # Stocker les embeddings
            upsert_embeddings(self.qdrant_client, chunk_embeddings, chunks)
            print(f"✅ {len(chunks)} chunks indexés dans Qdrant")
            
            # Vérifier le stockage
            collection_info = self.qdrant_client.get_collection(self.collection_name)
            points_count = self.qdrant_client.count(self.collection_name).count
            
            results["steps"]["indexing"] = {
                "status": "success",
                "collection_status": collection_info.status,
                "points_stored": points_count,
                "vector_dimension": vector_size
            }
            
            print(f"📊 Statut de la collection: {collection_info.status}")
            print(f"🔢 Points stockés: {points_count}")
            
        except Exception as e:
            results["steps"]["indexing"] = {
                "status": "error",
                "error": str(e)
            }
            print(f"❌ Erreur lors de l'indexation: {e}")
            return results
        
        # RÉSUMÉ FINAL
        print("\n🎉 PIPELINE D'INGESTION TERMINÉ AVEC SUCCÈS!")
        print("=" * 50)
        
        results["status"] = "success"
        results["summary"] = {
            "total_documents": len(texts),
            "total_chunks": len(chunks),
            "total_embeddings": len(chunk_embeddings),
            "total_points_stored": points_count,
            "vector_dimension": vector_size
        }
        
        print(f"📈 RÉSUMÉ FINAL:")
        print(f"   • Documents traités: {len(texts)}")
        print(f"   • Chunks créés: {len(chunks)}")
        print(f"   • Embeddings générés: {len(chunk_embeddings)}")
        print(f"   • Points indexés: {points_count}")
        print(f"   • Dimension des vecteurs: {vector_size}")
        
        return results
    
    def save_results(self, results: Dict[str, Any], output_file: str = "ingestion_results.json"):
        """Sauvegarde les résultats du pipeline"""
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            print(f"💾 Résultats sauvegardés dans {output_file}")
        except Exception as e:
            print(f"⚠️  Impossible de sauvegarder les résultats: {e}")


def main():
    """Point d'entrée principal"""
    
    print("🔧 PIPELINE D'INGESTION RAG")
    print("=" * 40)
    print("Ce script traite les documents PDF et les indexe dans la base vectorielle.")
    print("Exécutez-le AVANT d'utiliser le système de Q&A.\n")
    
    # Vérifier que le dossier data existe
    data_dir = "data"
    if not os.path.exists(data_dir):
        print(f"❌ Le dossier '{data_dir}' n'existe pas.")
        print("Créez-le et ajoutez-y vos documents PDF.")
        return
    
    # Vérifier qu'il y a des PDFs
    pdf_files = [f for f in os.listdir(data_dir) if f.lower().endswith('.pdf')]
    if not pdf_files:
        print(f"❌ Aucun fichier PDF trouvé dans '{data_dir}'.")
        print("Ajoutez des documents PDF avant d'exécuter ce script.")
        return
    
    print(f"📁 Dossier de données: {data_dir}")
    print(f"📄 PDFs trouvés: {len(pdf_files)}")
    for pdf in pdf_files[:3]:  # Afficher les 3 premiers
        print(f"   • {pdf}")
    if len(pdf_files) > 3:
        print(f"   • ... et {len(pdf_files) - 3} autres")
    print()
    
    # Confirmation utilisateur
    response = input("🚀 Démarrer le pipeline d'ingestion ? (y/N): ").strip().lower()
    if response not in ['y', 'yes', 'oui', 'o']:
        print("❌ Pipeline annulé.")
        return
    
    # Exécuter le pipeline
    pipeline = IngestionPipeline(data_dir)
    results = pipeline.run()
    
    # Sauvegarder les résultats
    if results.get("status") == "success":
        pipeline.save_results(results)
        print("\n✅ Le système RAG est maintenant prêt pour les questions !")
        print("💡 Utilisez 'python main.py' pour poser des questions.")
    else:
        print("\n❌ Le pipeline a échoué. Vérifiez les erreurs ci-dessus.")


if __name__ == "__main__":
    main()
