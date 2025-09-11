from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json

app = FastAPI(
    title="Scraper API",
    description="A FastAPI service for web scraping",
    version="1.0.0"
)

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    url: str
    options: Optional[Dict[str, Any]] = None

class ScrapeResponse(BaseModel):
    ok: bool
    data: Dict[str, Any]

def run_scraper(url: str, options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Stub function for web scraping - returns dummy data for now"""
    return {
        "url": url,
        "scraped_at": "2024-01-09T10:34:00Z",
        "content_length": 1234,
        "title": "Example Page",
        "links_found": 5,
        "options_used": options or {}
    }

@app.get("/healthz")
async def health_check():
    """Health check endpoint"""
    return {"ok": True}

@app.post("/scrape", response_model=ScrapeResponse)
async def scrape_url(request: ScrapeRequest):
    """Scrape a URL with optional parameters"""
    try:
        data = run_scraper(request.url, request.options)
        return ScrapeResponse(ok=True, data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ui", response_class=HTMLResponse)
async def get_ui():
    """Simple HTML UI for testing the scraper"""
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Scraper API - Test UI</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input[type="text"] { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
            button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
            button:hover { background: #0056b3; }
            #result { margin-top: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9; white-space: pre-wrap; }
        </style>
    </head>
    <body>
        <h1>Scraper API Test</h1>
        <div class="form-group">
            <label for="url">URL to scrape:</label>
            <input type="text" id="url" placeholder="https://example.com" value="https://example.com">
        </div>
        <div class="form-group">
            <label for="options">Options (JSON):</label>
            <input type="text" id="options" placeholder='{"depth": 1}' value='{"depth": 1}'>
        </div>
        <button onclick="scrapeUrl()">Scrape URL</button>
        <div id="result"></div>

        <script>
            async function scrapeUrl() {
                const url = document.getElementById('url').value;
                const optionsText = document.getElementById('options').value;
                const resultDiv = document.getElementById('result');
                
                let options = {};
                try {
                    if (optionsText.trim()) {
                        options = JSON.parse(optionsText);
                    }
                } catch (e) {
                    resultDiv.textContent = 'Error: Invalid JSON in options field';
                    return;
                }

                const payload = { url, options };
                
                try {
                    const response = await fetch('/scrape', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    const data = await response.json();
                    resultDiv.textContent = JSON.stringify(data, null, 2);
                } catch (error) {
                    resultDiv.textContent = 'Error: ' + error.message;
                }
            }
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
