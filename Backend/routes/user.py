from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import database
import logging

logger = logging.getLogger(__name__)
user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Basic validation
        if not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({"msg": "Email, password, and name are required"}), 400
        
        # Create new user in MongoDB
        user, error = database.create_user(
            email=data.get('email'),
            name=data.get('name'),
            password=data.get('password')
        )
        
        if error:
            if "already registered" in error:
                return jsonify({"msg": error}), 400
            return jsonify({"msg": f"Registration failed: {error}"}), 500
        
        if user:
            logger.info(f"User registered successfully: {data.get('email')}")
            user_id = user.get('_id')
            return jsonify({
                "msg": "User registered successfully",
                "user": {
                    "id": user_id,
                    "email": user['email'],
                    "name": user['name']
                }
            }), 201
        
        # If we get here with no error but no user, something went wrong
        return jsonify({"msg": "Failed to create user"}), 500
            
    except Exception as e:
        logger.error(f"Unexpected error in registration: {e}")
        return jsonify({"msg": f"Registration failed: {str(e)}"}), 500

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = database.get_user_by_id(current_user_id)
        
        if not user:
            return jsonify({"msg": "User not found"}), 404
        
        # Remove sensitive information
        if 'password_hash' in user:
            del user['password_hash']
        
        return jsonify(user), 200
    except Exception as e:
        logger.error(f"Error retrieving profile: {e}")
        return jsonify({"msg": f"Error retrieving profile: {str(e)}"}), 500

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user_id = get_jwt_identity()
        user = database.get_user_by_id(current_user_id)
        
        if not user:
            return jsonify({"msg": "User not found"}), 404
        
        data = request.get_json()
        
        # Filter allowed update fields
        allowed_fields = ['name', 'skills', 'job_interests', 'profile_photo_url']
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        if database.update_user(current_user_id, update_data):
            # Get updated user
            updated_user = database.get_user_by_id(current_user_id)
            if 'password_hash' in updated_user:
                del updated_user['password_hash']
            return jsonify(updated_user), 200
        else:
            return jsonify({"msg": "Failed to update profile"}), 500
    except Exception as e:
        logger.error(f"Profile update failed: {e}")
        return jsonify({"msg": f"Profile update failed: {str(e)}"}), 500
