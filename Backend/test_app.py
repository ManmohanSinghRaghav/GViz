import unittest
import json
import os
from app import app
import database

class TestApp(unittest.TestCase):
    
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        
        # Create a test user if it doesn't exist
        test_email = 'test@example.com'
        test_user = database.get_user_by_email(test_email)
        
        if not test_user:
            database.create_user(
                email=test_email,
                name='Test User',
                password='password123'
            )
    
    def test_api_endpoint(self):
        response = self.app.get('/api')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('time', data)
        
    def test_login_success(self):
        response = self.app.post('/api/login', 
                                json={'email': 'test@example.com', 'password': 'password123'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('access_token', data)
        
    def test_login_failure(self):
        response = self.app.post('/api/login', 
                                json={'email': 'test@example.com', 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, 401)
        
    def test_registration(self):
        # Create a unique email to avoid conflicts
        test_email = f'test2_{os.urandom(4).hex()}@example.com'
        
        response = self.app.post('/api/user/register', 
                                json={
                                    'email': test_email, 
                                    'password': 'password123',
                                    'name': 'Test User 2'
                                })
        self.assertEqual(response.status_code, 201)
        
if __name__ == '__main__':
    unittest.main()
