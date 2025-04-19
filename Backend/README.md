# Authentication API

A simple user authentication API with MongoDB integration.

## Setup

1. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Configuration**

   The `.env` file should contain:
   
   ```
   FLASK_APP=app.py
   FLASK_ENV=development
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   MONGO_DB_NAME=SqTech
   COLLECTION_NAME=User
   JWT_SECRET_KEY=your-secret-key
   JWT_ACCESS_TOKEN_EXPIRES_MINUTES=60
   ```

3. **Run the server**

   ```bash
   flask run
   ```

## API Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api` | GET | No | API root - check if service is running |
| `/api/register` | POST | No | Register a new user |
| `/api/login` | POST | No | Login and get access token |
| `/api/logout` | POST | Yes | Logout (revoke token) |
| `/api/profile` | GET | Yes | Get user profile |

## Registration Example

```json
POST /api/register
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

## Login Example

```json
POST /api/login
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

## Authentication

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer your_access_token
```
