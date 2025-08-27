import os
import re
from typing import List

import fitz  # PyMuPDF


def clean_text_preserve_content(text: str) -> str:
    """
    Nettoie le texte en supprimant uniquement le bruit et les caractères spéciaux.
    PRÉSERVE TOUTE L'INFORMATION - aucune suppression de contenu.
    """
    if not text:
        return ""
    
    # 1. Nettoyage des caractères spéciaux et du bruit
    cleaned_text = text
    
    # Supprimer les caractères de contrôle invisibles
    cleaned_text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', cleaned_text)
    
    # Normaliser les espaces multiples (garder le contenu)
    cleaned_text = re.sub(r'[ \t]+', ' ', cleaned_text)
    
    # Normaliser les retours à la ligne multiples
    cleaned_text = re.sub(r'\n\s*\n\s*\n+', '\n\n', cleaned_text)
    
    # Nettoyer les espaces en début/fin de ligne
    cleaned_text = '\n'.join(line.strip() for line in cleaned_text.split('\n'))
    
    # Supprimer les lignes vides multiples
    cleaned_text = re.sub(r'\n{3,}', '\n\n', cleaned_text)
    
    return cleaned_text.strip()


def extract_pdf_content_ordered(file_path: str) -> str:
    """
    Extrait le contenu PDF dans l'ordre correct des pages
    sans supprimer d'informations.
    """
    with fitz.open(file_path) as doc:
        extracted_pages = []
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            
            # Extraire le texte de la page
            page_text = page.get_text("text")
            
            # Nettoyer uniquement le bruit (pas le contenu)
            cleaned_page_text = clean_text_preserve_content(page_text)
            
            if cleaned_page_text:
                extracted_pages.append(cleaned_page_text)
                print(f"  Page {page_num + 1}: {len(cleaned_page_text)} caractères extraits")
            else:
                print(f"  Page {page_num + 1}: Page vide")
        
        # Joindre les pages dans l'ordre
        full_text = "\n\n".join(extracted_pages)
        return full_text


def load_pdfs_from_folder(folder_path: str, max_files: int = 5) -> List[str]:
    """
    Charge les PDFs et extrait TOUT le contenu sans perte d'information.
    Seul le bruit et les caractères spéciaux sont supprimés.
    """
    if not os.path.isdir(folder_path):
        raise FileNotFoundError(f"Data folder not found: {folder_path}")

    pdf_filenames = [
        f for f in sorted(os.listdir(folder_path)) if f.lower().endswith(".pdf")
    ]
    if max_files is not None:
        pdf_filenames = pdf_filenames[:max_files]

    if len(pdf_filenames) == 0:
        raise FileNotFoundError(
            f"No PDF files found in {folder_path}. Please add at least one PDF."
        )

    texts: List[str] = []
    for filename in pdf_filenames:
        file_path = os.path.join(folder_path, filename)
        print(f"📄 Processing: {filename}")
        
        try:
            # Extraire le contenu complet
            full_text = extract_pdf_content_ordered(file_path)
            
            if full_text:
                texts.append(full_text)
                print(f"✅ Total: {len(full_text)} caractères extraits (sans perte)")
                # Compter les pages en utilisant une variable intermédiaire
                page_separator = "\n\n"
                page_count = len(full_text.split(page_separator))
                print(f"📊 Pages traitées: {page_count}")
            else:
                print(f"⚠️  Aucun contenu extrait de {filename}")
                
        except Exception as e:
            print(f"❌ Erreur lors du traitement de {filename}: {e}")
            continue
    
    return texts


def analyze_extracted_content(texts: List[str]) -> dict:
    """
    Analyse le contenu extrait pour vérifier la qualité
    """
    if not texts:
        return {"error": "Aucun texte extrait"}
    
    analysis = {
        "total_documents": len(texts),
        "total_characters": sum(len(text) for text in texts),
        "avg_characters_per_doc": sum(len(text) for text in texts) / len(texts) if texts else 0,
        "document_details": []
    }
    
    for i, text in enumerate(texts):
        doc_analysis = {
            "document": i + 1,
            "characters": len(text),
            "words": len(text.split()),
            "lines": len(text.split('\n')),
            "paragraphs": len(text.split('\n\n'))
        }
        analysis["document_details"].append(doc_analysis)
    
    return analysis
