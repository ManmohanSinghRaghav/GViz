from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash

# Fix import path
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import db

user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"msg": "Missing required fields"}), 400
    
    # Check if user already exists
    if db.get_user_by_email(data['email']):
        return jsonify({"msg": "Email already registered"}), 409
    
    # Create new user
    password_hash = generate_password_hash(data['password'])
    user = db.create_user(
        name=data['name'],
        email=data['email'],
        password_hash=password_hash,
        avatar=data.get('avatar')
    )
    
    return jsonify({"msg": "User registered successfully", "user": db.user_to_dict(user)}), 201

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = db.get_user_by_id(user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify(db.user_to_dict(user)), 200

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = db.get_user_by_id(user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    data = request.get_json()
    update_data = {}
    
    if data.get('name'):
        update_data['name'] = data['name']
    
    if data.get('avatar'):
        update_data['avatar'] = data['avatar']
    
    updated_user = db.update_user(user_id, update_data)
    
    return jsonify(db.user_to_dict(updated_user)), 200

@user_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifications = db.get_user_notifications(user_id)
    
    return jsonify([db.notification_to_dict(notification) for notification in notifications]), 200
