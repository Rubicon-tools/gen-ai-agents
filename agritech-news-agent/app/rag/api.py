import os
import time
import hashlib
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# ---- RAG utils ----
from app.rag.modules.embeddings import embed_texts
from app.rag.modules.generator import generate_response
from app.rag.modules.vectorstore import get_qdrant_client, search_top_k
from app.rag.ingestion_pipeline import IngestionPipeline
from app.rag.incremental_ingestion import IncrementalIngestionPipeline

app = FastAPI(title="RAG API")


# ---------- Incremental Ingestion ----------
@app.post("/ingest_incrementally")
async def ingest_incrementally() -> Dict[str, Any]:
    pipeline = IncrementalIngestionPipeline(data_dir="app/data", auto_confirm=True)
    results = pipeline.run()
    return results

# ---------- Ingest ----------
@app.post("/ingest")
async def ingest() -> Dict[str, Any]:
    pipeline = IngestionPipeline(data_dir="app/data")
    results = pipeline.run()
    pipeline.save_results(results)
    return results

# ---------- Status ----------
@app.get("/status")
async def status() -> Dict[str, Any]:
    try:
        client = get_qdrant_client()
        collections = client.get_collections()
        info = {"collections": [c.name for c in collections.collections]}
        try:
            points_count = client.count("rag_collection").count
            info.update({"rag_collection": {"points": points_count}})
        except Exception:
            info.update({"rag_collection": {"points": 0}})
        return {"status": "ok", "qdrant": info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Qdrant error: {e}")

# ---------- Health ----------
@app.get("/health")
async def health() -> Dict[str, str]:
    return {"status": "ok"}

# ---------- Schemas ----------
class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    model: str
    messages: List[Message]
    temperature: Optional[float] = 1.0


class ChatChoice(BaseModel):
    index: int
    message: Message
    finish_reason: str = "stop"


class ChatResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    model: str
    choices: List[ChatChoice]
    created: int


# ---------- Model list ----------
@app.get("/v1/models")
async def list_models():
    return {
        "object": "list",
        "data": [
            {
                "id": "rag-agritech-agent",  # alias WebUI uses
                "object": "model",
                "created": int(time.time()),
                "owned_by": "local",
            }
        ],
    }


# ---------- Chat completions (OpenAI-compatible) ----------
@app.post("/v1/chat/completions", response_model=ChatResponse)
async def chat_completions(request: ChatRequest):
    # Take last user message
    user_message = next((m for m in reversed(request.messages) if m.role == "user"), None)
    if not user_message:
        raise HTTPException(status_code=400, detail="No user message found")

    question = user_message.content.strip()

    # ---- Embed & search ----
    query_vec = embed_texts([question])[0]
    if not query_vec:
        raise HTTPException(status_code=500, detail="Failed to embed question")

    client = get_qdrant_client()
    top_chunks = search_top_k(client, query_vec, k=3)

    if not top_chunks:
        answer = "Aucun contexte trouvé pour répondre à votre question."
    else:
        # Generate final response from retrieved chunks
        answer = generate_response(top_chunks, question)

    # ---- Return OpenAI-style JSON ----
    return ChatResponse(
        id=f"chatcmpl-{int(time.time())}",
        model=request.model,
        created=int(time.time()),
        choices=[
            ChatChoice(
                index=0,
                message=Message(role="assistant", content=answer),
            )
        ],
    )
