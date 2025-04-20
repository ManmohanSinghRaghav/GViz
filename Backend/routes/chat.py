from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import time

# Fix import path
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import db

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('', methods=['POST'])
@jwt_required()
def process_chat():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('message'):
        return jsonify({"msg": "Message is required"}), 400
    
    message = data['message']
    image = data.get('image')
    
    # For demo purposes, we'll just echo back the message
    # In a real implementation, you would process the message with your NLP/ML model
    
    # Simulate processing time
    time.sleep(1)
    
    response = {
        "reply": f"You said: {message}",
        "timestamp": time.time()
    }
    
    # If image was sent, acknowledge it
    if image:
        response["image_processed"] = True
    
    return jsonify(response), 200
