import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

def ask_hf_model(prompt: str, model: str = "gemini-2.0-flash") -> str:
    response = client.models.generate_content(
        model=model,
        contents=prompt
    )
    return response.text  # returns the LLM output same as OpenAI-style
