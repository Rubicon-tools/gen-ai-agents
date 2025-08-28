import os
import re
from typing import List

import fitz  # PyMuPDF


def clean_text_preserve_content(text: str) -> str:
    """
    Clean the text by removing only the noise and special characters.
    PRESERVE ALL INFORMATION - no content deletion.
    """
    if not text:
        return ""
    
    # 1. Cleaning special characters and noise
    cleaned_text = text
    
    # Remove invisible control characters
    cleaned_text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', cleaned_text)
    
    # Normalize multiple spaces (keep content)
    cleaned_text = re.sub(r'[ \t]+', ' ', cleaned_text)
    
    # Normalize multiple line returns
    cleaned_text = re.sub(r'\n\s*\n\s*\n+', '\n\n', cleaned_text)
    
    # Clean spaces at the beginning/end of line
    cleaned_text = '\n'.join(line.strip() for line in cleaned_text.split('\n'))
    
    # Remove multiple empty lines
    cleaned_text = re.sub(r'\n{3,}', '\n\n', cleaned_text)
    
    return cleaned_text.strip()


def extract_pdf_content_ordered(file_path: str) -> str:
    """
    Extract the PDF content in the correct order of pages
    without deleting any information.
    """
    with fitz.open(file_path) as doc:
        extracted_pages = []
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            
            # Extract the text from the page
            page_text = page.get_text("text")
            
            # Clean only the noise (not the content)
            cleaned_page_text = clean_text_preserve_content(page_text)
            
            if cleaned_page_text:
                extracted_pages.append(cleaned_page_text)
                print(f"  Page {page_num + 1}: {len(cleaned_page_text)} characters extracted")
            else:
                print(f"  Page {page_num + 1}: Empty page")
        
        # Join the pages in the correct order
        full_text = "\n\n".join(extracted_pages)
        return full_text


def load_pdfs_from_folder(folder_path: str, max_files: int = 5) -> List[str]:
    """
    Load the PDFs and extract ALL the content without losing any information.
    Only the noise and special characters are removed.
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
            # Extract the complete content
            full_text = extract_pdf_content_ordered(file_path)
            
            if full_text:
                texts.append(full_text)
                print(f"✅ Total: {len(full_text)} characters extracted (without loss)")
                # Count the pages using an intermediate variable
                page_separator = "\n\n"
                page_count = len(full_text.split(page_separator))
                print(f"📊 Pages processed: {page_count}")
            else:
                print(f"⚠️  No content extracted from {filename}")
                
        except Exception as e:
            print(f"❌ Error during the processing of {filename}: {e}")
            continue
    
    return texts


def analyze_extracted_content(texts: List[str]) -> dict:
    """
    Analyze the extracted content to check the quality
    """
    if not texts:
        return {"error": "No text extracted"}
    
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
