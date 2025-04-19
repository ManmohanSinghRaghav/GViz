import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Application configuration settings."""
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-CHANGE-ME')
    
    # JWT settings
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-dev-key-CHANGE-ME')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Database settings
    USE_LOCAL_DB = os.environ.get('USE_LOCAL_DB', 'false').lower() == 'true'
    MONGO_DB_NAME = os.environ.get('MONGO_DB_NAME', 'SqTech')
    
    # API settings
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
    
    @classmethod
    def get_db_uri(cls):
        """Get the appropriate database URI based on configuration."""
        if cls.USE_LOCAL_DB:
            return os.environ.get('MONGO_URI_LOCAL', f'mongodb://localhost:27017/{cls.MONGO_DB_NAME}')
        # Add a default for MONGO_URI
        return os.environ.get('MONGO_URI', f'mongodb://localhost:27017/{cls.MONGO_DB_NAME}')
