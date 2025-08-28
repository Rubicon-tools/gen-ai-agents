#!/usr/bin/env python3
"""
Pipeline d'ingestion incrémentale pour le système RAG
====================================================

Ce script traite uniquement les NOUVEAUX documents PDF et les ajoute
à la base vectorielle existante, sans dupliquer les documents déjà indexés.

Utilisation:
- Premier lancement: traite tous les PDFs
- Lancements suivants: traite seulement les nouveaux PDFs
"""

import warnings
warnings.filterwarnings("ignore", message=".*urllib3.*OpenSSL.*")

import os
import sys
import json
from typing import List, Dict, Any

# Import des modules
from modules.ingestion import load_pdfs_from_folder
from modules.chunking import split_texts_into_chunks
from modules.embeddings import embed_texts
from modules.vectorstore import (
    get_qdrant_client,
    get_existing_documents,
    upsert_embeddings_incremental,
    get_document_hash
)

class IncrementalIngestionPipeline:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.qdrant_client = get_qdrant_client()
        self.collection_name = "rag_collection"
        
    def get_pdf_files_with_hashes(self) -> Dict[str, str]:
        """Récupère tous les fichiers PDF avec leurs hashes."""
        pdf_files = {}
        for filename in sorted(os.listdir(self.data_dir)):
            if filename.lower().endswith('.pdf'):
                file_path = os.path.join(self.data_dir, filename)
                file_hash = get_document_hash(file_path)
                pdf_files[filename] = file_hash
        return pdf_files
    
    def identify_new_documents(self) -> List[str]:
        """Identifie les documents qui n'ont pas encore été indexés."""
        print("🔍 Vérification des documents existants...")
        
        # Récupérer les documents déjà indexés
        existing_docs = get_existing_documents(self.qdrant_client)
        existing_hashes = set(existing_docs.keys())
        
        # Récupérer tous les PDFs avec leurs hashes
        all_pdfs = self.get_pdf_files_with_hashes()
        
        # Identifier les nouveaux documents
        new_documents = []
        for filename, file_hash in all_pdfs.items():
            if file_hash not in existing_hashes:
                new_documents.append(filename)
            else:
                print(f"✅ {filename} - déjà indexé")
        
        return new_documents
    
    def process_single_document(self, filename: str) -> Dict[str, Any]:
        """Traite un seul document PDF."""
        file_path = os.path.join(self.data_dir, filename)
        file_hash = get_document_hash(file_path)
        
        print(f"\n📄 Traitement de: {filename}")
        print(f"🔐 Hash: {file_hash[:8]}...")
        
        # Extraire le contenu
        try:
            texts = load_pdfs_from_folder(self.data_dir, max_files=None)
            # Filtrer pour ne garder que le document actuel
            current_text = None
            for text in texts:
                # Vérifier si ce texte correspond au fichier actuel
                # (approximation basée sur la taille du fichier)
                if len(text) > 1000:  # Filtre basique
                    current_text = text
                    break
            
            if not current_text:
                raise ValueError(f"Aucun contenu extrait de {filename}")
            
            # Découper en chunks
            chunks = split_texts_into_chunks([current_text])
            
            # Générer les embeddings
            embeddings = embed_texts(chunks)
            
            # Ajouter à la base vectorielle
            document_hashes = [file_hash] * len(chunks)
            next_id = upsert_embeddings_incremental(
                self.qdrant_client, 
                embeddings, 
                chunks, 
                document_hashes
            )
            
            return {
                "filename": filename,
                "hash": file_hash,
                "chunks_created": len(chunks),
                "embeddings_generated": len(embeddings),
                "next_id": next_id
            }
            
        except Exception as e:
            print(f"❌ Erreur lors du traitement de {filename}: {e}")
            return {
                "filename": filename,
                "hash": file_hash,
                "error": str(e)
            }
    
    def run(self) -> Dict[str, Any]:
        """Exécute le pipeline d'ingestion incrémentale."""
        print("🔧 PIPELINE D'INGESTION INCÉMENTALE RAG")
        print("=" * 50)
        print("Ce script traite uniquement les NOUVEAUX documents PDF.")
        print(f"📁 Dossier de données: {self.data_dir}")
        
        # Identifier les nouveaux documents
        new_documents = self.identify_new_documents()
        
        if not new_documents:
            print("\n✅ Aucun nouveau document à traiter!")
            print("Tous les PDFs sont déjà indexés.")
            return {"status": "no_new_documents"}
        
        print(f"\n🆕 {len(new_documents)} nouveau(x) document(s) à traiter:")
        for doc in new_documents:
            print(f"   • {doc}")
        
        # Demander confirmation
        response = input(f"\n🚀 Traiter ces {len(new_documents)} document(s) ? (y/N): ")
        if response.lower() != 'y':
            print("❌ Annulé par l'utilisateur.")
            return {"status": "cancelled"}
        
        print(f"\n🚀 DÉMARRAGE DU TRAITEMENT INCÉMENTAL")
        print("=" * 50)
        
        results = {
            "status": "success",
            "new_documents": len(new_documents),
            "processed_documents": [],
            "errors": []
        }
        
        # Traiter chaque nouveau document
        for i, filename in enumerate(new_documents, 1):
            print(f"\n📄 [{i}/{len(new_documents)}] Traitement de: {filename}")
            
            result = self.process_single_document(filename)
            
            if "error" in result:
                results["errors"].append(result)
                print(f"❌ Échec: {result['error']}")
            else:
                results["processed_documents"].append(result)
                print(f"✅ Succès: {result['chunks_created']} chunks créés")
        
        # Résumé final
        print(f"\n🎉 TRAITEMENT INCÉMENTAL TERMINÉ!")
        print("=" * 50)
        print(f"📊 Documents traités: {len(results['processed_documents'])}")
        print(f"❌ Erreurs: {len(results['errors'])}")
        
        if results["processed_documents"]:
            total_chunks = sum(doc["chunks_created"] for doc in results["processed_documents"])
            print(f"🧩 Total chunks ajoutés: {total_chunks}")
        
        # Sauvegarder les résultats
        with open("incremental_ingestion_results.json", "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Résultats sauvegardés dans incremental_ingestion_results.json")
        
        return results

def main():
    """Point d'entrée principal."""
    if len(sys.argv) > 1:
        data_dir = sys.argv[1]
    else:
        data_dir = "data"
    
    if not os.path.exists(data_dir):
        print(f"❌ Le dossier {data_dir} n'existe pas!")
        sys.exit(1)
    
    pipeline = IncrementalIngestionPipeline(data_dir)
    pipeline.run()

if __name__ == "__main__":
    main()
