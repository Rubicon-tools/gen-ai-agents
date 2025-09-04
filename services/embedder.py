"""Embedding service stub.

Produces a simple, deterministic numeric vector from input text for testing.
"""

from __future__ import annotations

from typing import Any, Dict, List

from .base import AIService


class EmbeddingService(AIService):
    """Simple embedding stub that maps characters to integer codes.

    Not intended for production-quality embeddings; useful for local tests.
    """

    def run(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        text = str(payload.get("input", ""))
        if not text:
            return {"error": "Missing 'input' for embed"}

        # Deterministic stub: map each character to its Unicode code point modulo 100.
        vector: List[int] = [ord(ch) % 100 for ch in text][:256]
        return {"embedding": vector, "dims": len(vector), "engine": "stub"}


