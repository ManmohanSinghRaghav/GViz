import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB Configuration
MONGO_URI = "mongodb+srv://manmohan0singh0:DRAfVBPZBpEjXJpZ@usercluster.eo5fol0.mongodb.net/?retryWrites=true&w=majority&appName=UserCluster"

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-key-for-development")
JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds

# API Configuration
API_PREFIX = "/api"
