from flask_mongoengine import MongoEngine
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import os
import mongoengine as me
import pymongo
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

db = MongoEngine()

def initialize_db(app):
    try:
        # Try to initialize with the configured database
        db.init_app(app)
        # Test connection
        db.get_db().client.admin.command('ismaster')
        logger.info("MongoDB connection successful")
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error(f"MongoDB connection failed: {e}")
        
        # If we're already using local DB and still failing, we have a problem
        if os.environ.get('USE_LOCAL_DB', 'false').lower() == 'true':
            logger.error("Local MongoDB connection failed. Make sure MongoDB is installed and running.")
        else:
            # Try to switch to local database
            logger.info("Attempting to connect to local MongoDB instance...")
            os.environ['USE_LOCAL_DB'] = 'true'
            app.config['MONGODB_SETTINGS']['host'] = os.environ.get('MONGO_URI_LOCAL', 'mongodb://localhost:27017/SqTech')
            
            try:
                # Reinitialize with local database
                db.init_app(app)
                db.get_db().client.admin.command('ismaster')
                logger.info("Successfully connected to local MongoDB instance")
            except Exception as local_e:
                logger.error(f"Local MongoDB connection also failed: {local_e}")
                logger.error("Please ensure MongoDB is installed and running locally")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")

# Create an in-memory user repository as absolute last resort
in_memory_users = {}

class User(db.Document):
    email = db.StringField(required=True, unique=True)
    password_hash = db.StringField(required=True)
    name = db.StringField(required=True)
    created_at = db.DateTimeField(default=datetime.datetime.utcnow)
    skills = db.ListField(db.StringField(), default=[])
    job_interests = db.ListField(db.StringField(), default=[])
    profile_photo_url = db.StringField(default='')
    
    meta = {
        'collection': 'User',  # Match your MongoDB collection name
        'db_alias': 'default',
        'indexes': ['email']
    }
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_json(self):
        return {
            'id': str(self.id),
            'email': self.email,
            'name': self.name,
            'skills': self.skills,
            'job_interests': self.job_interests,
            'profile_photo_url': self.profile_photo_url,
            'created_at': self.created_at.isoformat()
        }
