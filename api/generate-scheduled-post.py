from http.server import BaseHTTPRequestHandler
import os
import firebase_admin
from firebase_admin import credentials, firestore
import openai
from datetime import datetime
import pytz
import random
import json

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Initialize Firebase
            if not firebase_admin._apps:
                firebase_credentials = {
                    "type": "service_account",
                    "project_id": os.getenv('FIREBASE_PROJECT_ID'),
                    "private_key_id": os.getenv('FIREBASE_PRIVATE_KEY_ID'),
                    "private_key": os.getenv('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
                    "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
                    "client_id": os.getenv('FIREBASE_CLIENT_ID'),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_x509_cert_url": os.getenv('FIREBASE_CLIENT_CERT_URL')
                }
                cred = credentials.Certificate(firebase_credentials)
                firebase_admin.initialize_app(cred)

            db = firestore.client()
            openai.api_key = os.getenv('OPENAI_API_KEY')

            # Blog topics
            BLOG_TOPICS = {
                "Windsurfing Techniques": [
                    "Beginner's Guide to Windsurfing",
                    "Advanced Windsurfing Maneuvers",
                    "Wind Reading Techniques",
                    "Equipment Selection Tips",
                    "Safety Practices in Windsurfing"
                ],
                "Windsurfing Destinations": [
                    "Top Windsurfing Spots in Europe",
                    "Best Beaches for Windsurfing",
                    "Hidden Gems for Windsurfing",
                    "Seasonal Windsurfing Locations",
                    "Urban Windsurfing Locations"
                ],
                "Equipment Guide": [
                    "Choosing Your First Windsurf Board",
                    "Understanding Sail Types",
                    "Essential Windsurfing Gear",
                    "Maintenance Tips for Equipment",
                    "Upgrading Your Windsurfing Kit"
                ],
                "Weather and Conditions": [
                    "Reading Weather Forecasts",
                    "Understanding Wind Patterns",
                    "Tide and Current Effects",
                    "Best Conditions for Beginners",
                    "Extreme Weather Windsurfing"
                ]
            }

            # Select random topic and subtopic
            topic = random.choice(list(BLOG_TOPICS.keys()))
            subtopic = random.choice(BLOG_TOPICS[topic])

            # Generate content using OpenAI
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional windsurfing instructor and blogger. Write engaging, detailed content with practical tips and real examples."},
                    {"role": "user", "content": f"Write a comprehensive blog post about {subtopic} in the context of {topic}. Include:\n1. An engaging introduction\n2. Practical tips and techniques\n3. Real-world examples\n4. Safety considerations\n5. Equipment recommendations if relevant\n6. A conclusion with next steps"}
                ]
            )

            content = response.choices[0].message.content

            # Prepare post data
            post = {
                "title": subtopic,
                "category": topic,
                "content": content,
                "generatedContent": content,
                "timestamp": datetime.now(pytz.UTC).isoformat(),
                "sections": [],
                "isContentGenerated": True
            }

            # Save to Firebase
            doc_ref = db.collection('blogs').document()
            doc_ref.set(post)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "message": f"Generated and published blog post: {subtopic}"
            }).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": False,
                "error": str(e)
            }).encode())
