import os
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash

# Load environment variables
load_dotenv()

# Connect to MongoDB
mongo_uri = os.environ.get('MONGO_URI')
db_name = os.environ.get('MONGO_DB_NAME', 'gviz_db')
collection_name = os.environ.get('COLLECTION_NAME', 'users')

try:
    print(f"Connecting to MongoDB: {mongo_uri}")
    print(f"Database: {db_name}, Collection: {collection_name}")
    
    client = MongoClient(mongo_uri)
    db = client[db_name]
    users = db[collection_name]
    
    # Create test user
    test_user = {
        'email': 'test@example.com',
        'name': 'Test User',
        'password_hash': generate_password_hash('password123'),
        'created_at': datetime.utcnow(),
        'avatar': 'https://ui-avatars.com/api/?name=Test+User',
        'role': 'user',
        'profile': {
            'skills': [],
            'job_interests': [],
            'profile_photo_url': ''
        }
    }
    
    # Check if user already exists
    existing_user = users.find_one({'email': test_user['email']})
    if existing_user:
        print(f"User {test_user['email']} already exists")
    else:
        result = users.insert_one(test_user)
        print(f"Created test user: {test_user['email']}")
        print(f"User ID: {result.inserted_id}")
    
    # List all users
    print("\nAll users in the database:")
    for user in users.find():
        print(f"- {user['email']} ({user['name']})")
    
except Exception as e:
    print(f"Error: {e}")
