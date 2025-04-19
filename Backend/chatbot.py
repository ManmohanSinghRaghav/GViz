import os
import logging
import marko
import google.generativeai as genai
from dotenv import load_dotenv
from base64 import b64decode

# Configure logging
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Gemini API with key from environment variable
api_key = os.environ.get('GEMINI_API_KEY')
genai.configure(api_key=api_key)

# Configure generation parameters
config = {
    'temperature': 0.7,
    'top_k': 20,
    'top_p': 0.9,
    'max_output_tokens': 800
}

# Safety settings
safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
]

# Initialize text-only model
text_model = genai.GenerativeModel(model_name="gemini-pro",
                                  generation_config=config,
                                  safety_settings=safety_settings)

# Initialize model with image capability
vision_model = genai.GenerativeModel(model_name="gemini-pro-vision",
                                    generation_config=config,
                                    safety_settings=safety_settings)

# Dictionary to store chat sessions by user ID
chat_sessions = {}

def get_chat_response(user_id, message, image_data=None, mime_type=None):
    """
    Get a response from Gemini for a specific user's message
    
    Args:
        user_id (str): The ID of the user
        message (str): The message sent by the user
        image_data (bytes, optional): Image data if an image was uploaded
        mime_type (str, optional): MIME type of the image if provided
        
    Returns:
        dict: The response object
    """
    if not api_key:
        logger.error("Gemini API key not found in environment variables")
        return {
            "success": False,
            "response": "Chatbot service is not properly configured. Please contact support."
        }
    
    try:
        # If this is a new conversation for this user, create a new chat session
        if user_id not in chat_sessions:
            chat_sessions[user_id] = text_model.start_chat(history=[])
        
        chat = chat_sessions[user_id]
        
        # If image is provided, use the vision model instead
        if image_data:
            logger.info(f"Processing image from user {user_id}")
            
            # Prepare image content
            image_parts = [
                {
                    "mime_type": mime_type,
                    "data": image_data
                },
            ]
            
            # Prepare prompt with the image
            prompt_parts = [
                f"User message: {message}\n\nUser's image:",
                image_parts[0],
                "\n\nPlease analyze this image and respond to the user's query."
            ]
            
            # Generate response with the vision model
            response = vision_model.generate_content(prompt_parts)
            formatted_response = marko.convert(response.text)
            
            return {
                "success": True,
                "response": formatted_response
            }
        else:
            # Text-only response using the ongoing chat
            logger.info(f"Processing text message from user {user_id}")
            response = chat.send_message(message)
            return {
                "success": True,
                "response": response.text
            }
            
    except Exception as e:
        logger.exception(f"Error processing message: {str(e)}")
        return {
            "success": False,
            "response": f"Sorry, an error occurred: {str(e)}"
        }
