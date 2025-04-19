import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Gemini with API key from environment variable
api_key = os.environ.get('GEMINI_API_KEY')
genai.configure(api_key=api_key)