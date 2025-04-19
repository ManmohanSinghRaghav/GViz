from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import database
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Basic validation
        if not data.get('email') or not data.get('password'):
            return jsonify({"msg": "Email and password are required"}), 400
        
        # Verify credentials
        user = database.verify_user(data.get('email'), data.get('password'))
        
        if not user:
            return jsonify({"msg": "Invalid credentials"}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user['_id']))
        
        # Remove sensitive data
        if 'password_hash' in user:
            del user['password_hash']
        
        logger.info(f"User logged in: {user['email']}")
        
        return jsonify({
            "msg": "Login successful",
            "access_token": access_token,
            "user": user
        }), 200
            
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({"msg": "Login failed"}), 500
