"""Service orchestrator that routes tasks to registered services."""

from __future__ import annotations

from typing import Any, Dict, Mapping, Type

from .base import AIService
from .summarizer import SummarizerService
from .embedder import EmbeddingService


class Orchestrator:
    """Simple orchestrator for AI services."""

    def __init__(self) -> None:
        self._registry: Dict[str, Type[AIService]] = {
            "summarize": SummarizerService,
            "embed": EmbeddingService,
        }

    def list_services(self) -> Mapping[str, str]:
        return {name: cls.__name__ for name, cls in self._registry.items()}

    def run(self, task: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        service_cls = self._registry.get(task)
        if service_cls is None:
            return {"error": f"Unknown task: {task}", "available": list(self._registry.keys())}

        service = service_cls()
        return service.run(payload)


orchestrator = Orchestrator()


