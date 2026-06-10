"""
PrivateScreen - Cerebras AI Integration

Usage:
    python cerebras_client.py

Environment:
    Set CEREBRAS_API_KEY environment variable or use the default key below.
"""

import os
from cerebras.cloud.sdk import Cerebras

# API configuration
API_KEY = os.environ.get("CEREBRAS_API_KEY")
MODEL = "gpt-oss-120b"
BASE_URL = "https://api.cerebras.ai/v1"


def create_client() -> Cerebras:
    """Create and return a Cerebras API client."""
    return Cerebras(api_key=API_KEY)


def chat_completion(prompt: str, model: str = MODEL) -> str:
    """
    Send a chat completion request to Cerebras API.

    Args:
        prompt: The user message to send
        model: The model to use (default: gpt-oss-120b)

    Returns:
        The assistant's response text
    """
    client = create_client()
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=model,
    )
    return response.choices[0].message.content


def main():
    """Simple test of the Cerebras API."""
    prompt = "Why is fast inference important?"
    print(f"Sending: {prompt}")
    print(f"Model: {MODEL}")
    print("-" * 50)

    result = chat_completion(prompt)
    print(f"Response: {result}")


if __name__ == "__main__":
    main()
