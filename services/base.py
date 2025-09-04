"""Base AI service interface.

Defines the abstract `AIService` contract that all services must implement.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict


class AIService(ABC):
    """Abstract AI service.

    All services must implement the `run` method and return a serializable dict.
    """

    @abstractmethod
    def run(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Run the service with the given payload.

        Args:
            payload: Input payload for the service.

        Returns:
            A dictionary with the result. Should be JSON-serializable.
        """
        raise NotImplementedError


