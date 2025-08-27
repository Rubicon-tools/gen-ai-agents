import os
import time
from typing import List

from dotenv import load_dotenv
from mistralai import Mistral


load_dotenv()
_API_KEY = os.getenv("MISTRAL_API_KEY")
if not _API_KEY:
    raise EnvironmentError(
        "MISTRAL_API_KEY is not set. Please export it or put it in a .env file."
    )

_client = Mistral(api_key=_API_KEY)


def embed_texts(texts: List[str], model: str = "mistral-embed") -> List[List[float]]:
    """
    Calls Mistral embeddings API to transform each text into a vector using
    the specified embedding model. Includes conservative rate limiting.
    """
    embeddings: List[List[float]] = []
    
    for i, text in enumerate(texts):
        if not text:
            embeddings.append([])
            continue
            
        max_retries = 5
        base_delay = 2.0
        
        for attempt in range(max_retries):
            try:
                resp = _client.embeddings.create(model=model, inputs=[text])
                embeddings.append(resp.data[0].embedding)
                print(f"Embedded chunk {i+1}/{len(texts)}")
                
                # Conservative delay between requests (2 seconds)
                if i < len(texts) - 1:
                    time.sleep(2.0)
                break
                
            except Exception as e:
                if "rate_limited" in str(e).lower() or "429" in str(e):
                    if attempt < max_retries - 1:
                        delay = base_delay * (2 ** attempt)  # Exponential backoff
                        print(f"Rate limited, retrying in {delay}s... (attempt {attempt + 1}/{max_retries})")
                        time.sleep(delay)
                        continue
                    else:
                        print(f"Rate limit exceeded after {max_retries} attempts. Stopping.")
                        raise
                else:
                    print(f"Error embedding chunk {i+1}: {e}")
                    raise
                    
    return embeddings
