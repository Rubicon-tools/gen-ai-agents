from __future__ import annotations

import os
from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from dotenv import load_dotenv
    load_dotenv()  # Best-effort; if missing, it's fine
except Exception:
    pass

from services.orchestrator import orchestrator


class OrchestrateRequest(BaseModel):
    task: str
    input: Any
    options: Optional[Dict[str, Any]] = None


app = FastAPI(title="AI Orchestrator", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
def healthz() -> Dict[str, bool]:
    return {"ok": True}


@app.get("/services")
def list_services() -> Dict[str, str]:
    return dict(orchestrator.list_services())


@app.post("/orchestrate")
def run_orchestrate(req: OrchestrateRequest) -> Dict[str, Any]:
    payload: Dict[str, Any] = {"input": req.input, "options": req.options or {}}
    result = orchestrator.run(req.task, payload)
    if "error" in result and req.task not in orchestrator.list_services():
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@app.get("/ui")
def ui() -> str:
    return (
        """
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AI Orchestrator UI</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 32px; }
      label { display:block; margin-top:12px; }
      textarea { width:100%; height:120px; }
      select, input, button { padding:8px; margin-top:6px; }
      pre { background:#f6f6f8; padding:12px; border-radius:6px; }
    </style>
  </head>
  <body>
    <h1>AI Orchestrator</h1>
    <p>Try <code>summarize</code> or <code>embed</code>.</p>
    <label>Task
      <select id="task">
        <option value="summarize">summarize</option>
        <option value="embed">embed</option>
      </select>
    </label>
    <label>Input
      <textarea id="input">This is a long paragraph to summarize for testing.</textarea>
    </label>
    <button onclick="run()">Run</button>
    <h3>Result</h3>
    <pre id="out"></pre>
    <script>
      async function run() {
        const task = document.getElementById('task').value;
        const input = document.getElementById('input').value;
        const res = await fetch('/orchestrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task, input })
        });
        const data = await res.json();
        document.getElementById('out').textContent = JSON.stringify(data, null, 2);
      }
    </script>
  </body>
</html>
        """
    )


