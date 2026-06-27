"""
Abstract persistence for WorkflowContext.
"""
from abc import ABC, abstractmethod
from typing import Optional
from backend.app.models.workflow_context import WorkflowContext

class AbstractWorkflowRepository(ABC):
    @abstractmethod
    def save(self, context: WorkflowContext) -> WorkflowContext:
        pass

    @abstractmethod
    def get(self, workflow_id: str) -> Optional[WorkflowContext]:
        pass

class InMemoryWorkflowRepository(AbstractWorkflowRepository):
    def __init__(self):
        self._store = {}

    def save(self, context: WorkflowContext) -> WorkflowContext:
        self._store[context.metadata.workflow_id] = context
        return context

    def get(self, workflow_id: str) -> Optional[WorkflowContext]:
        return self._store.get(workflow_id)
