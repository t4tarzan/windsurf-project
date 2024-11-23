import asyncio
from datetime import datetime
import pytz
import random
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import openai
import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
import sys

load_dotenv()

# Initialize Firebase if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()
openai.api_key = os.getenv('OPENAI_API_KEY')

# List of blog topics and their subtopics
BLOG_TOPICS = {
    "Windsurfing Techniques": [
        "Beginner's Guide to Windsurfing",
        "Advanced Windsurfing Maneuvers",
        "Wind Reading Techniques",
        "Equipment Selection Tips",
        "Safety Practices in Windsurfing",
    ],
    "Windsurfing Destinations": [
        "Top Windsurfing Spots Worldwide",
        "Hidden Gems for Windsurfing",
        "Seasonal Windsurfing Locations",
        "Beach and Weather Conditions Guide",
    ],
    "Equipment Reviews": [
        "Latest Windsurfing Board Reviews",
        "Sail Selection Guide",
        "Wetsuit and Accessories Guide",
        "Maintenance Tips",
    ],
    "Windsurfing Lifestyle": [
        "Fitness for Windsurfing",
        "Nutrition for Water Sports",
        "Community and Events",
        "Environmental Impact and Sustainability",
    ]
}

async def generate_blog_post(topic, subtopic):
    """Generate a blog post using OpenAI's GPT model"""
    try:
        prompt = f"""Write a detailed, engaging blog post about {subtopic} in the context of {topic}.
        Include practical tips, real-world examples, and structure it with clear headings.
        Use markdown formatting including tables where relevant.
        Add image placeholders in markdown format like ![description][relevant description] where appropriate.
        The post should be informative yet conversational in tone."""

        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional windsurfing blogger and instructor with years of experience."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )

        content = response.choices[0].message.content
        
        # Create post metadata
        post = {
            'title': subtopic,
            'category': topic,
            'content': content,
            'createdAt': datetime.now(pytz.UTC),
            'lastModified': datetime.now(pytz.UTC),
            'author': 'WindsurfBot',
            'tags': [topic.lower(), subtopic.lower(), 'windsurfing', 'automated'],
            'status': 'published'
        }

        return post

    except Exception as e:
        print(f"Error generating blog post: {e}")
        return None

async def publish_blog_post(post):
    """Save the blog post to Firebase"""
    try:
        doc_ref = db.collection('posts').document()
        doc_ref.set(post)
        print(f"Published post: {post['title']}")
        return True
    except Exception as e:
        print(f"Error publishing blog post: {e}")
        return False

async def generate_daily_posts():
    """Generate and publish two blog posts"""
    print(f"Starting daily blog post generation at {datetime.now()}")
    
    # Select two random topics
    topics = random.sample(list(BLOG_TOPICS.keys()), 2)
    
    for topic in topics:
        # Select a random subtopic
        subtopic = random.choice(BLOG_TOPICS[topic])
        
        # Generate and publish post
        post = await generate_blog_post(topic, subtopic)
        if post:
            await publish_blog_post(post)
    
    print("Completed daily blog post generation")

async def test_post_generation():
    """Test function to generate and publish a single post immediately"""
    print("Starting test post generation...")
    
    # Select a random topic and subtopic
    topic = random.choice(list(BLOG_TOPICS.keys()))
    subtopic = random.choice(BLOG_TOPICS[topic])
    
    print(f"Generating post about: {subtopic} (Category: {topic})")
    
    # Generate and publish post
    post = await generate_blog_post(topic, subtopic)
    if post:
        success = await publish_blog_post(post)
        if success:
            print(f"Test post published successfully: {post['title']}")
            print(f"Content preview:\n{post['content'][:200]}...")
        else:
            print("Failed to publish test post")
    else:
        print("Failed to generate test post")

def start_scheduler():
    """Start the scheduler for daily blog post generation"""
    scheduler = AsyncIOScheduler()
    
    # Schedule first post at 9:00 AM UTC
    scheduler.add_job(
        generate_daily_posts,
        CronTrigger(hour=9, minute=0),
        id='morning_post'
    )
    
    # Schedule second post at 3:00 PM UTC
    scheduler.add_job(
        generate_daily_posts,
        CronTrigger(hour=15, minute=0),
        id='afternoon_post'
    )
    
    scheduler.start()
    print("Blog post scheduler started")
    
    # Keep the scheduler running
    try:
        asyncio.get_event_loop().run_forever()
    except (KeyboardInterrupt, SystemExit):
        pass

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        asyncio.run(test_post_generation())
    else:
        start_scheduler()
