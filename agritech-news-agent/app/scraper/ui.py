from fastapi import Request

def scraper_ui(request: Request):
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Scraper Live Output</title>
        <style>
            body { font-family: monospace; background: #222; color: #eee; margin: 0; }
            .centered {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                max-height: 100vh;
                zoom: 1.5;
            }
            #output {
                white-space: pre-wrap;
                background: #111;
                padding: 1em;
                border-radius: 8px;
                width: 600px;
                height: 300px;
                overflow-y: auto;
                margin-top: 1em;
            }
            button, input[type='number'] { margin: 1em 0; padding: 0.5em 1em; }
            label { margin-right: 1em; }
        </style>
    </head>
    <body>
        <div class="centered">
            <h2>Scraper Live Output</h2>
            <label>Count: <input type="number" id="count" value="10" min="1" /></label>
            <label><input type="checkbox" id="continue_flag" /> Continue</label>
            <label><input type="checkbox" id="update_flag" /> Update</label>
            <button onclick="startScrape()">Start Scrape</button>
            <div id="output"></div>
        </div>
        <script>
        function startScrape() {
            const output = document.getElementById('output');
            output.textContent = '';
            const count = document.getElementById('count').value;
            const continueFlag = document.getElementById('continue_flag').checked;
            const updateFlag = document.getElementById('update_flag').checked;
            let url = `/scrape?count=${count}`;
            if (continueFlag) url += `&continue_flag=true`;
            if (updateFlag) url += `&update_flag=true`;
            fetch(url, { method: 'POST' })
                .then(response => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    function read() {
                        reader.read().then(({ done, value }) => {
                            if (done) return;
                            output.textContent += decoder.decode(value);
                            output.scrollTop = output.scrollHeight;
                            read();
                        });
                    }
                    read();
                });
        }
        </script>
    </body>
    </html>
    """
