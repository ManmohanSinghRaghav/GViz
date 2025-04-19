import os
import logging
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from dotenv import load_dotenv
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-jwt-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(
    minutes=int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES_MINUTES', 60))
)

# Store revoked tokens (in a real app, use Redis or DB)
revoked_tokens = set()

# Enable CORS
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Initialize JWT
jwt = JWTManager(app)

# Check if token has been revoked
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in revoked_tokens

# Connect to MongoDB
try:
    # Extract connection details from environment
    mongo_uri = os.environ.get('MONGO_URI')
    db_name = os.environ.get('MONGO_DB_NAME', 'SqTech')
    collection_name = os.environ.get('COLLECTION_NAME', 'User')
    
    # Create MongoDB client with retry capabilities
    client = MongoClient(mongo_uri)
    db = client[db_name]
    users_collection = db[collection_name]
    
    # Test connection
    db.command('ping')
    logger.info(f"Connected to MongoDB: {db_name}, Collection: {collection_name}")
    
    # Make sure the collection exists
    if collection_name not in db.list_collection_names():
        db.create_collection(collection_name)
        logger.info(f"Created collection: {collection_name}")
        
    # Create index on email field if it doesn't exist
    users_collection.create_index("email", unique=True)
    
except Exception as e:
    logger.error(f"MongoDB connection error: {e}")
    raise

# API root endpoint
@app.route('/api')
def api_root():
    return jsonify({
        'status': 'online',
        'message': 'Authentication API is running'
    })

# User registration endpoint
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"error": "Email, password, and name are required"}), 400
    
    # Check email format
    email = data.get('email')
    if '@' not in email or '.' not in email:
        return jsonify({"error": "Invalid email format"}), 400
    
    # Check password strength
    password = data.get('password')
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    
    try:
        # Check if user already exists
        existing_user = users_collection.find_one({'email': email})
        if existing_user:
            return jsonify({"error": "Email already registered"}), 409
        
        # Create new user document
        new_user = {
            'email': email,
            'name': data.get('name'),
            'password_hash': generate_password_hash(password),
            'created_at': datetime.utcnow(),
            'profile': {
                'skills': [],
                'job_interests': [],
                'profile_photo_url': ''
            }
        }
        
        # Insert into database
        result = users_collection.insert_one(new_user)
        
        # Create safe version to return (without password)
        safe_user = {
            'id': str(result.inserted_id),
            'email': email,
            'name': data.get('name'),
            'created_at': new_user['created_at'].isoformat()
        }
        
        return jsonify({
            "message": "Registration successful",
            "user": safe_user
        }), 201
        
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({"error": "Registration failed. Please try again."}), 500

# Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400
    
    try:
        # Find user by email
        user = users_collection.find_one({'email': data.get('email')})
        
        # Check if user exists and password matches
        if user and check_password_hash(user['password_hash'], data.get('password')):
            # Create access token
            user_identity = str(user['_id'])
            access_token = create_access_token(identity=user_identity)
            
            # Prepare safe user object (without password)
            safe_user = {
                'id': user_identity,
                'email': user['email'],
                'name': user['name']
            }
            
            return jsonify({
                "message": "Login successful",
                "access_token": access_token,
                "user": safe_user
            }), 200
        
        # Invalid credentials
        return jsonify({"error": "Invalid email or password"}), 401
    
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({"error": "Login failed. Please try again."}), 500

# Logout endpoint
@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        # Add token to revoked list
        jti = get_jwt()["jti"]
        revoked_tokens.add(jti)
        
        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        logger.error(f"Logout error: {e}")
        return jsonify({"error": "Logout failed"}), 500

# User profile endpoint
@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        # Get current user ID from token
        current_user_id = get_jwt_identity()
        
        # Find user by ID
        user = users_collection.find_one({'_id': ObjectId(current_user_id)})
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Create safe user object (without password)
        safe_user = {
            'id': str(user['_id']),
            'email': user['email'],
            'name': user['name'],
            'profile': user.get('profile', {})
        }
        
        return jsonify({"user": safe_user}), 200
    
    except Exception as e:
        logger.error(f"Profile error: {e}")
        return jsonify({"error": "Could not retrieve profile"}), 500

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)