"""Summarizer service using OpenAI if available, else a stub implementation.
"""

from __future__ import annotations

import os
from typing import Any, Dict

from .base import AIService


class SummarizerService(AIService):
    """Summarize input text via OpenAI when `OPENAI_API_KEY` is set.

    Fallbacks to a deterministic stub when no key is configured.
    """

    def __init__(self) -> None:
        self._api_key = os.getenv("OPENAI_API_KEY")
        self._use_openai = bool(self._api_key)

        self._client = None
        if self._use_openai:
            try:
                from openai import OpenAI  # type: ignore

                self._client = OpenAI(api_key=self._api_key)
            except Exception:
                # If the OpenAI package is missing or fails, fallback to stub.
                self._use_openai = False

    def _summarize_with_openai(self, text: str) -> str:
        assert self._client is not None
        response = self._client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.2,
            messages=[
                {"role": "system", "content": "You are a concise summarizer."},
                {"role": "user", "content": f"Summarize the following text:\n\n{text}"},
            ],
        )
        content = response.choices[0].message.content if response.choices else ""
        return content or ""

    @staticmethod
    def _stub_summary(text: str, max_len: int = 160) -> str:
        cleaned = " ".join(text.strip().split())
        if len(cleaned) <= max_len:
            return cleaned
        return cleaned[: max_len - 3] + "..."

    def run(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        text = str(payload.get("input", ""))
        if not text:
            return {"error": "Missing 'input' for summarize"}

        if self._use_openai:
            try:
                summary = self._summarize_with_openai(text)
                return {"summary": summary, "engine": "openai"}
            except Exception as exc:
                # Fallback to stub if OpenAI fails at runtime
                fallback = self._stub_summary(text)
                return {
                    "summary": fallback,
                    "engine": "stub",
                    "warning": f"OpenAI failed: {type(exc).__name__}",
                }

        return {"summary": self._stub_summary(text), "engine": "stub"}


