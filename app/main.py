from fastapi import FastAPI, HTTPException
import httpx

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/health")
async def health():
    # Example quick healthcheck endpoint
    async with httpx.AsyncClient(timeout=3) as client:
        try:
            resp = await client.get("http://minio:9000/minio/health/live")
            return {"status": "ok", "minio": resp.status_code}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Health check failed: {e}")
