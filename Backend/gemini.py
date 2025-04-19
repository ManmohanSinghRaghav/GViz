import json
import requests
import os
import logging
from dotenv import load_dotenv

# Configure logging
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def generate_recommendation(prompt):
    """
    Generate recommendations using Google's Gemini API
    
    Args:
        prompt (str): The prompt to send to Gemini
        
    Returns:
        list: The parsed JSON response from Gemini
    """
    api_key = os.environ.get('GEMINI_API_KEY')
    
    if not api_key:
        logger.warning("Gemini API key not configured")
        # Return mock data when API key is missing
        return [
            {
                "title": "Sample Recommendation",
                "description": "This is a sample recommendation because the Gemini API key is not configured.",
                "importance": 8,
                "resources": ["https://example.com/resource1", "https://example.com/resource2"]
            }
        ]
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    
    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "topK": 32,
            "topP": 0.95,
            "maxOutputTokens": 1024,
        }
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=10)
        
        if response.status_code != 200:
            logger.error(f"API request failed with status code {response.status_code}: {response.text}")
            return [{"error": "Failed to generate recommendations"}]
        
        response_json = response.json()
        
        # Extract the text from the response
        generated_text = response_json["candidates"][0]["content"]["parts"][0]["text"]
        
        # Find the JSON part in the text
        try:
            # Extract everything between [ and ] (inclusive)
            start_idx = generated_text.find('[')
            end_idx = generated_text.rfind(']') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = generated_text[start_idx:end_idx]
                return json.loads(json_str)
            else:
                logger.error("No JSON array found in response")
                return [{"error": "Invalid response format from AI"}]
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from response: {e}")
            return [{"error": "Invalid JSON in AI response"}]
    except requests.RequestException as e:
        logger.error(f"Request to Gemini API failed: {e}")
        return [{"error": "Failed to connect to recommendation service"}]
