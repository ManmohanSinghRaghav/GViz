import os
import logging
import uuid
import datetime
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize PyMongo instance
mongo = PyMongo()

# In-memory user repository as fallback
in_memory_users = {}

def init_app(app):
    """Initialize database with the Flask app."""
    try:
        # Initialize with the cloud database
        mongo.init_app(app)
        
        # Test connection
        mongo.db.command('ping')
        logger.info("MongoDB Atlas connection successful")
        
        # Make sure we're connected to the right database
        db_name = os.environ.get('MONGO_DB_NAME', 'SqTech')
        current_db = mongo.cx.get_database(db_name)
        logger.info(f"Connected to database: {current_db.name}")
        
        # Ensure necessary collections exist
        collections = current_db.list_collection_names()
        
        # Create users collection if it doesn't exist
        if 'users' not in collections:
            current_db.create_collection('users')
            logger.info("Created 'users' collection")
        
        # Create recommendations collection if it doesn't exist
        if 'recommendations' not in collections:
            current_db.create_collection('recommendations')
            logger.info("Created 'recommendations' collection")
            
        # Create indexes for better performance
        mongo.db.users.create_index('email', unique=True)
        logger.info("Ensured index on users.email field")
        
        # Create initial admin user if no users exist
        if mongo.db.users.count_documents({}) == 0:
            admin_email = 'admin@example.com'
            admin_password = 'admin123'  # Should be changed immediately
            
            admin_user = {
                'email': admin_email,
                'name': 'Admin User',
                'password_hash': generate_password_hash(admin_password),
                'skills': ['Python', 'Flask', 'MongoDB'],
                'job_interests': ['Software Development', 'Data Science'],
                'profile_photo_url': '',
                'created_at': datetime.datetime.utcnow(),
                'is_admin': True
            }
            
            mongo.db.users.insert_one(admin_user)
            logger.info(f"Created initial admin user: {admin_email}")
            logger.warning("Please change the admin password immediately!")
        
    except Exception as e:
        logger.error(f"MongoDB Atlas connection failed: {e}")
        logger.warning("Using in-memory storage for this session")

# User model functions
def create_user(email, name, password):
    """Create a new user."""
    try:
        # Check if user already exists
        if mongo.db.users.find_one({'email': email}):
            return None, "Email already registered"
        
        user = {
            'email': email,
            'name': name,
            'password_hash': generate_password_hash(password),
            'skills': [],
            'job_interests': [],
            'profile_photo_url': '',
            'created_at': datetime.datetime.utcnow()
        }
        
        result = mongo.db.users.insert_one(user)
        user['_id'] = str(result.inserted_id)
        return user, None
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        
        # Fall back to in-memory storage
        if email in in_memory_users:
            return None, "Email already registered"
            
        user_id = str(uuid.uuid4())
        in_memory_users[email] = {
            '_id': user_id,  # Use _id for consistency with MongoDB
            'email': email,
            'name': name,
            'password_hash': generate_password_hash(password),
            'skills': [],
            'job_interests': [],
            'profile_photo_url': '',
            'created_at': datetime.datetime.utcnow().isoformat()
        }
        
        logger.warning(f"User registered in IN-MEMORY storage: {email}")
        return in_memory_users[email], None

def get_user_by_email(email):
    """Get a user by email."""
    try:
        user = mongo.db.users.find_one({'email': email})
        if user:
            user['_id'] = str(user['_id'])
        return user
    except Exception as e:
        logger.error(f"Error getting user by email: {e}")
        
        # Fall back to in-memory storage
        if email in in_memory_users:
            return in_memory_users[email]
        return None

def get_user_by_id(user_id):
    """Get a user by ID."""
    try:
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        if user:
            user['_id'] = str(user['_id'])
        return user
    except Exception as e:
        logger.error(f"Error getting user by ID: {e}")
        
        # Check in-memory users
        for user in in_memory_users.values():
            if user['_id'] == user_id:
                return user
        return None

def update_user(user_id, update_data):
    """Update a user."""
    try:
        result = mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0
    except Exception as e:
        logger.error(f"Error updating user: {e}")
        
        # Update in-memory user if applicable
        for email, user in in_memory_users.items():
            if user['_id'] == user_id:
                for key, value in update_data.items():
                    user[key] = value
                return True
        return False

def check_password(user, password):
    """Check if password matches user's password hash."""
    if not user or 'password_hash' not in user:
        return False
    return check_password_hash(user['password_hash'], password)

def check_connection():
    """Check if database connection is working."""
    try:
        mongo.db.command('ping')
        return True
    except Exception:
        return False