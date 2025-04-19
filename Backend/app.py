import time
import os
import logging
import datetime
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import database  # Use the Flask-PyMongo module instead
from routes.user import user_bp
from routes.recommendation import recommendation_bp
from dotenv import load_dotenv
import config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configuration using environment variables
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-change-me')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-key-change-me')

# MongoDB configuration
use_local_db = os.environ.get('USE_LOCAL_DB', 'false').lower() == 'true'
mongo_uri = os.environ.get('MONGO_URI_LOCAL' if use_local_db else 'MONGO_URI')

# Ensure we're using the right MongoDB URI
if not mongo_uri or mongo_uri == 'MONGO_URI':
    # If MONGO_URI wasn't found, use the literal value from .env
    mongo_uri = os.environ.get('MONGO_URI')
    logger.info(f"Using Cloud MongoDB URI: {mongo_uri[:20]}...")

app.config['MONGO_URI'] = mongo_uri

# Enable CORS with proper configuration
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Initialize extensions
jwt = JWTManager(app)
database.init_app(app)  # Initialize Flask-PyMongo

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api/user')
app.register_blueprint(recommendation_bp, url_prefix='/api/recommendation')

@app.route('/api/health')
def health_check():
    """API health check endpoint that also checks database connectivity"""
    try:
        # Check if we can connect to the database
        database.mongo.db.command('ping')
        db_status = 'connected'
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        db_status = 'disconnected'
    
    return {
        'status': 'healthy' if db_status == 'connected' else 'degraded',
        'time': time.time(), 
        'database': db_status,
        'mode': 'local' if os.environ.get('USE_LOCAL_DB', 'false').lower() == 'true' else 'remote'
    }

@app.route('/api')
def api():
    return {'time': time.time(), 'status': 'API is running'}

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        # Get user by email using Flask-PyMongo
        user = database.get_user_by_email(data.get('email'))
        
        if user and database.check_password(user, data.get('password')):
            # Create access token
            user_id = user.get('_id')
            access_token = create_access_token(identity=user_id)
            
            # Remove sensitive information
            if 'password_hash' in user:
                del user['password_hash']
                
            return jsonify(access_token=access_token, user=user), 200
        
        return jsonify({"msg": "Invalid credentials"}), 401
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({"msg": f"Login error: {str(e)}"}), 500

@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    try:
        current_user_id = get_jwt_identity()
        user = database.get_user_by_id(current_user_id)
        
        if not user:
            return jsonify({"msg": "User not found"}), 404
            
        return jsonify(logged_in_as=user.get('email')), 200
    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Error handlers
@app.errorhandler(500)
def handle_500(e):
    return jsonify({"msg": "Internal server error. Please try again later."}), 500

@app.errorhandler(503)
def handle_503(e):
    return jsonify({"msg": "Service temporarily unavailable. Please try again later."}), 503

if __name__ == '__main__':
    app.run(debug=True)