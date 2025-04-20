from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash

# Fix import path
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Missing email or password"}), 400
    
    user = db.get_user_by_email(data['email'])
    
    if not user or not check_password_hash(user['password_hash'], data['password']):
        return jsonify({"msg": "Invalid credentials"}), 401
    
    # Create access token
    access_token = create_access_token(identity=str(user['_id']))
    
    return jsonify({
        "token": access_token,
        "user": db.user_to_dict(user)
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # JWT is stateless, so we don't actually invalidate the token here
    # Client should remove the token from storage
    return jsonify({"msg": "Successfully logged out"}), 200
