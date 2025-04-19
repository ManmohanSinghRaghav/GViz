from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging
import base64
import os
import sys
import json

# Configure logging
logger = logging.getLogger(__name__)

# Ensure the chatbot module can be imported
root_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_path not in sys.path:
    sys.path.insert(0, root_path)

# Create Blueprint
chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/api/chat', methods=['POST'])
@jwt_required()
def chat():
    """Handle chat messages from authenticated users"""
    try:
        # Get the current user's identity
        user_id = get_jwt_identity()
        logger.info(f"Processing chat request from user: {user_id}")
        
        # Get data from request
        data = request.get_json()
        if not data:
            logger.warning("Missing request data")
            return jsonify({"success": False, "msg": "Missing request data"}), 400
        
        message = data.get('message', '').strip()
        if not message:
            logger.warning("Empty message received")
            return jsonify({"success": False, "msg": "Message cannot be empty"}), 400
        
        # Check if there's image data
        image_data = None
        mime_type = None
        
        if 'image' in data and data['image']:
            try:
                # Parse the base64 image data
                image_info = data['image'].split(',')
                if len(image_info) == 2:
                    # Extract MIME type
                    mime_type = image_info[0].split(':')[1].split(';')[0]
                    # Decode base64 image
                    image_data = base64.b64decode(image_info[1])
                    logger.info(f"Received image of type {mime_type}, size {len(image_data)} bytes")
            except Exception as e:
                logger.error(f"Error processing image data: {e}")
                return jsonify({"success": False, "msg": "Invalid image format"}), 400
        
        # Import chatbot module here to avoid circular imports
        try:
            from chatbot import get_chat_response
            
            # Get response from Gemini
            response = get_chat_response(user_id, message, image_data, mime_type)
            logger.info(f"Chat response generated successfully for user {user_id}")
            
            return jsonify(response)
            
        except ImportError as e:
            logger.error(f"Failed to import chatbot module: {e}")
            return jsonify({
                "success": False,
                "msg": "Chatbot functionality is not available",
                "error": str(e)
            }), 500
    
    except Exception as e:
        logger.exception(f"Error in chat endpoint: {e}")
        return jsonify({
            "success": False,
            "msg": "An error occurred processing your message",
            "error": str(e)
        }), 500
