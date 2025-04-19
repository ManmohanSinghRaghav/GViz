from pymongo import MongoClient
from pymongo.server_api import ServerApi
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from datetime import datetime
import os
import logging

# Set up logging
logger = logging.getLogger(__name__)

# MongoDB connection
try:
    mongo_uri = os.getenv('MONGO_URI')
    db_name = os.getenv('MONGO_DB_NAME', 'gviz_db')
    collection_name = os.getenv('COLLECTION_NAME', 'users')
    
    client = MongoClient(mongo_uri)
    client.admin.command('ping')  # Test connection
    
    db = client[db_name]
    users_collection = db[collection_name]
    
    logger.info(f"Connected to MongoDB: {db_name}, Collection: {collection_name}")
    
    # Ensure collection exists and has indexes
    if collection_name not in db.list_collection_names():
        db.create_collection(collection_name)
        logger.info(f"Created collection: {collection_name}")
    
    # Create index on email field
    users_collection.create_index("email", unique=True)
    
except Exception as e:
    logger.error(f"MongoDB connection error: {str(e)}")
    raise

def create_user(email, name, password):
    """Create a new user in the database."""
    try:
        # Check if user already exists
        if users_collection.find_one({'email': email}):
            return None, "Email already registered"
            
        # Create user document
        user = {
            'email': email,
            'name': name,
            'password_hash': generate_password_hash(password),
            'created_at': datetime.utcnow(),
            'role': 'user',
            'avatar': f"https://ui-avatars.com/api/?name={name.replace(' ', '+')}"
        }
        
        # Insert user
        result = users_collection.insert_one(user)
        user['_id'] = str(result.inserted_id)
        
        return user, None
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        return None, str(e)
        
def verify_user(email, password):
    """Verify user credentials and return user if valid."""
    try:
        user = users_collection.find_one({'email': email})
        
        if user and check_password_hash(user['password_hash'], password):
            # Convert ObjectId to string for serialization
            user['_id'] = str(user['_id'])
            return user
            
        return None
    except Exception as e:
        logger.error(f"Error verifying user: {str(e)}")
        return None
        
def get_user_by_id(user_id):
    """Get user by ID."""
    try:
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        
        if user:
            user['_id'] = str(user['_id'])
            
        return user
    except Exception as e:
        logger.error(f"Error getting user by ID: {str(e)}")
        return None
        
def update_user(user_id, update_data):
    """Update user document."""
    try:
        result = users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        
        return result.modified_count > 0
    except Exception as e:
        logger.error(f"Error updating user: {str(e)}")
        return False
