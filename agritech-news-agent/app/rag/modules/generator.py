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

_SYSTEM_PROMPT = (
    "You are a helpful assistant for question answering. You must answer ONLY using the given context. "
    "If the answer is not in the context, say you don't know based on the provided documents."
)

# Fallback models if the primary one is rate limited
_MODELS = ["mistral-large-latest", "mistral-medium-latest", "mistral-small-latest"]


def generate_response(retrieved_chunks: List[str], question: str) -> str:
    context = "\n\n".join(retrieved_chunks)
    user_prompt = (
        f"Context:\n{context}\n\n"
        f"Question: {question}\n\n"
        f"Answer using only the context above:"
    )

    messages = [
        {"role": "system", "content": _SYSTEM_PROMPT},
        {"role": "user", "content": user_prompt},
    ]

    # Try different models with rate limiting
    for model in _MODELS:
        max_retries = 3
        base_delay = 2.0
        
        for attempt in range(max_retries):
            try:
                print(f"Trying model: {model}")
                resp = _client.chat.complete(model=model, messages=messages)
                return resp.choices[0].message.content
                
            except Exception as e:
                if "rate_limited" in str(e).lower() or "429" in str(e) or "capacity_exceeded" in str(e):
                    if attempt < max_retries - 1:
                        delay = base_delay * (2 ** attempt)
                        print(f"Rate limited on {model}, retrying in {delay}s... (attempt {attempt + 1}/{max_retries})")
                        time.sleep(delay)
                        continue
                    else:
                        print(f"Rate limit exceeded on {model}, trying next model...")
                        break
                else:
                    print(f"Error with {model}: {e}")
                    if model == _MODELS[-1]:  # Last model
                        raise
                    break
        
        # Wait before trying next model
        if model != _MODELS[-1]:
            time.sleep(3.0)
    
    raise RuntimeError("All models are rate limited. Please try again later.")
