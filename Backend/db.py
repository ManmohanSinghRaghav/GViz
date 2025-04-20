from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from datetime import datetime

# MongoDB connection URI
uri = "mongodb+srv://manmohan0singh0:RWmiRUV6nRUgM4cc@usercluster.eo5fol0.mongodb.net/?retryWrites=true&w=majority&appName=UserCluster"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Get database
db = client.SqTech

# Collections
users = db.users
notifications = db.notifications

# Helper functions for model-like behavior
def create_user(name, email, password_hash, avatar=None):
    user = {
        "name": name,
        "email": email,
        "password_hash": password_hash,
        "avatar": avatar,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    result = users.insert_one(user)
    user["_id"] = result.inserted_id
    return user

def get_user_by_email(email):
    return users.find_one({"email": email})

def get_user_by_id(user_id):
    from bson.objectid import ObjectId
    try:
        return users.find_one({"_id": ObjectId(user_id)})
    except Exception as e:
        print(f"Error getting user by ID: {e}")
        return None

def update_user(user_id, data):
    from bson.objectid import ObjectId
    data["updated_at"] = datetime.utcnow()
    users.update_one({"_id": ObjectId(user_id)}, {"$set": data})
    return get_user_by_id(user_id)

def user_to_dict(user):
    if not user:
        return None
    
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "avatar": user.get("avatar"),
        "created_at": user["created_at"].isoformat(),
        "updated_at": user["updated_at"].isoformat()
    }

def create_notification(user_id, title, message):
    notification = {
        "user_id": user_id,
        "title": title,
        "message": message,
        "is_read": False,
        "created_at": datetime.utcnow()
    }
    result = notifications.insert_one(notification)
    notification["_id"] = result.inserted_id
    return notification

def get_user_notifications(user_id):
    return list(notifications.find({"user_id": user_id}).sort("created_at", -1))

def notification_to_dict(notification):
    if not notification:
        return None
    
    # Calculate time display
    now = datetime.utcnow()
    diff = now - notification["created_at"]
    
    if diff.days > 0:
        time_display = f"{diff.days}d ago"
    elif diff.seconds >= 3600:
        time_display = f"{diff.seconds // 3600}h ago"
    elif diff.seconds >= 60:
        time_display = f"{diff.seconds // 60}m ago"
    else:
        time_display = "Just now"
    
    return {
        "id": str(notification["_id"]),
        "title": notification["title"],
        "message": notification["message"],
        "unread": not notification["is_read"],
        "time": time_display,
        "created_at": notification["created_at"].isoformat()
    }

# Initialize with test connection
try:
    client.admin.command('ping')
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"MongoDB connection error: {e}")
