from http.server import BaseHTTPRequestHandler
import os
import json

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # List of expected environment variables
        expected_vars = [
            'FIREBASE_PROJECT_ID',
            'FIREBASE_PRIVATE_KEY_ID',
            'FIREBASE_PRIVATE_KEY',
            'FIREBASE_CLIENT_EMAIL',
            'FIREBASE_CLIENT_ID',
            'FIREBASE_CLIENT_CERT_URL',
            'OPENAI_API_KEY'
        ]
        
        # Check which variables are set
        response = "Environment Variables Status:\n"
        for var in expected_vars:
            value = os.environ.get(var)
            if value:
                # For private key, check if it contains the correct markers
                if var == 'FIREBASE_PRIVATE_KEY':
                    has_begin = '-----BEGIN PRIVATE KEY-----' in value
                    has_end = '-----END PRIVATE KEY-----' in value
                    response += f"{var}: Present (Valid format: {has_begin and has_end})\n"
                else:
                    response += f"{var}: Present\n"
            else:
                response += f"{var}: Missing\n"

        self.send_response(200)
        self.send_header('Content-Type', 'text/plain')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(response.encode())
