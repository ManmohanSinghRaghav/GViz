from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize Flask app
app = Flask(__name__)
app.config.from_object('config.Config')

# Initialize extensions
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
jwt = JWTManager(app)

# Import the db module to ensure connection is established
import db

# Import routes - must be after app is created
from routes.auth import auth_bp
from routes.user import user_bp
from routes.chat import chat_bp
from routes.search import search_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api/user')
app.register_blueprint(chat_bp, url_prefix='/api/chat')
app.register_blueprint(search_bp, url_prefix='/api/search')

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "GViz API is running", "db": "MongoDB Cloud"})

if __name__ == '__main__':
    app.run(debug=True)
