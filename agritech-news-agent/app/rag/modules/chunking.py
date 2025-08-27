from typing import List, Callable

import tiktoken
from langchain_text_splitters import RecursiveCharacterTextSplitter


def _token_len_function() -> Callable[[str], int]:
    """
    Returns a function that computes approximate token length using tiktoken's
    cl100k_base encoding for consistent chunk sizing.
    """
    encoding = tiktoken.get_encoding("cl100k_base")

    def count_tokens(text: str) -> int:
        return len(encoding.encode(text))

    return count_tokens


def split_texts_into_chunks(
    texts: List[str],
    chunk_size_tokens: int = 512,  # Taille fixe plus petite
    chunk_overlap_tokens: int = 128,  # Overlap significatif
) -> List[str]:
    """
    Split texts into chunks of fixed size with proper overlap.
    No information is lost - all content is preserved.
    """
    token_len = _token_len_function()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size_tokens,
        chunk_overlap=chunk_overlap_tokens,
        length_function=token_len,
        is_separator_regex=False,
        separators=["\n\n", "\n", ". ", " ", ""],  # Séparateurs optimisés
    )

    chunks: List[str] = []
    for text in texts:
        if not text:
            continue
        text_chunks = splitter.split_text(text)
        chunks.extend(text_chunks)
    
    return chunks


def analyze_chunks(chunks: List[str]) -> dict:
    """
    Analyse la qualité des chunks générés
    """
    if not chunks:
        return {"error": "Aucun chunk généré"}
    
    token_len = _token_len_function()
    
    chunk_sizes = [token_len(chunk) for chunk in chunks]
    
    return {
        "total_chunks": len(chunks),
        "min_size": min(chunk_sizes),
        "max_size": max(chunk_sizes),
        "avg_size": sum(chunk_sizes) / len(chunk_sizes),
        "total_tokens": sum(chunk_sizes),
        "size_distribution": {
            "small": len([s for s in chunk_sizes if s < 400]),
            "medium": len([s for s in chunk_sizes if 400 <= s <= 600]),
            "large": len([s for s in chunk_sizes if s > 600])
        }
    }
