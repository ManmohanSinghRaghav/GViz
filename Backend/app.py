import os
import sys
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure package paths are resolved correctly
root_path = os.path.dirname(os.path.abspath(__file__))
if root_path not in sys.path:
    sys.path.insert(0, root_path)

# Load environment variables
load_dotenv()

def create_app():
    # Initialize Flask app
    app = Flask(__name__)
    
    # Configure app
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES_MINUTES', 60)) * 60  # Convert to seconds
    
    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    jwt = JWTManager(app)
    
    # Import blueprints - this needs to happen after app creation to avoid circular imports
    try:
        from routes.auth_routes import auth_bp
        from routes.user_routes import user_bp
        
        # Register basic blueprints
        app.register_blueprint(auth_bp)
        app.register_blueprint(user_bp)
        
        # Try to register the chatbot blueprint if it exists
        try:
            from routes.chatbot_routes import chatbot_bp
            app.register_blueprint(chatbot_bp)
            logger.info("Chatbot routes registered")
        except ImportError as e:
            logger.warning(f"Chatbot routes not registered: {e}")
            
    except ImportError as e:
        logger.error(f"Error importing routes: {e}")
        
        @app.route('/')
        def error_page():
            return jsonify({
                "error": "Application initialization failed",
                "message": "The routes could not be loaded. Check server logs for details."
            }), 500
    
    # Root API route for health check
    @app.route('/api')
    def api_root():
        return jsonify({
            "status": "online",
            "version": "1.0.0"
        })
    
    return app

# Create the app instance
app = create_app()

# Add application entrypoint
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)