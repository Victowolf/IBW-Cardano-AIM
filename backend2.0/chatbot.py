import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Load Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("❌ GEMINI_API_KEY not found in environment variables.")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

def ask_gemini(prompt: str, model: str = "gemini-2.5-flash") -> str:
    """
    Sends a prompt to Google Gemini and returns model response as a string.
    """
    try:
        # Create model object
        model_obj = genai.GenerativeModel(model)

        # Send prompt
        response = model_obj.generate_content(prompt)

        # Return text safely
        if hasattr(response, "text"):
            return response.text

        # Fallback for edge formats
        return str(response)

    except Exception as e:
        print("Gemini error:", e)
        return "⚠️ Error: Could not get response from Gemini."


if __name__ == "__main__":
    # Test
    reply = ask_gemini("Hello, what can you do?")
    print("Gemini:", reply)
