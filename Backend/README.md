# GViz Backend

A simplified Flask backend with MongoDB integration for the GViz application.

## Quick Start

1. **Setup MongoDB**:
   - **Local** (recommended for development): 
     - Install [MongoDB Community Edition](https://www.mongodb.com/docs/manual/installation/)
     - Start MongoDB service: `net start MongoDB` (Windows) or `sudo systemctl start mongod` (Mac/Linux)
   - **Cloud** (MongoDB Atlas):
     - Ensure your IP is whitelisted in Atlas dashboard
     - Update connection string in `.env` file

2. **Setup Environment**:
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Mac/Linux
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Configure environment variables (see below)
   cp .env.example .env  # Then edit .env with your values
   ```

3. **Run the Application**:
   ```bash
   flask run
   ```

## Configuration

Create a `.env` file with these variables:

```
# Flask configuration
FLASK_APP=app.py
FLASK_ENV=development

# Database configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
MONGO_URI_LOCAL=mongodb://localhost:27017/SqTech
USE_LOCAL_DB=true
MONGO_DB_NAME=SqTech

# Security
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key

# APIs
GEMINI_API_KEY=your-gemini-api-key
```

## API Reference

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/health` | GET | System health check | No |
| `/api/login` | POST | User authentication | No |
| `/api/user/register` | POST | Create new user | No |
| `/api/user/profile` | GET | Get user profile | Yes |
| `/api/user/profile` | PUT | Update user profile | Yes |
| `/api/recommendation/job` | GET | Get job recommendations | Yes |
| `/api/recommendation/skill` | GET | Get skill recommendations | Yes |

## Troubleshooting

- **Database Connection Issues**: 
  - Check MongoDB service is running
  - Verify network connectivity if using Atlas
  - The app will fall back to in-memory storage if database is unavailable

- **Authentication Problems**:
  - JWT tokens expire after 1 hour by default
  - Verify credentials when logging in
