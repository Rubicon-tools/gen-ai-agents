# FastAPI endpoint for scraping articles
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse, StreamingResponse, HTMLResponse
import subprocess
import os
from .ui import scraper_ui

app = FastAPI()

# Add the /ui route to the main app (after app is defined)
app.add_api_route("/ui", scraper_ui, methods=["GET"], response_class=HTMLResponse)

@app.post("/scrape")

def run_scrape(count: int = Query(10, description="Number of items to scrape"),
			   continue_flag: bool = Query(False, description="Continue flag")):
	cwd = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
	cmd = ["python", "-u", "scraper/main.py", str(count)]
	if continue_flag:
		cmd.append("--continue")

	def stream_process():
		process = subprocess.Popen(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
		try:
			if process.stdout:
				for line in process.stdout:
					yield line
				process.stdout.close()
			process.wait()
		except Exception as e:
			yield f"Error: {str(e)}\n"

	return StreamingResponse(stream_process(), media_type="text/plain")
