from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io
import numpy as np
import json
from datetime import datetime
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from openai import OpenAI
from typing import List, Optional

# Load environment variables
load_dotenv()

app = FastAPI(title="Plant Health Meter API")

# Enable CORS with specific origins
origins = [
    "http://localhost:3000",  # Local development
    "https://windsurf-project-2ke3-9ltk89v5s-t4tarzans-projects.vercel.app",  # Vercel deployment
    "https://planthealthmeter.com",  # Custom domain
    "https://www.planthealthmeter.com",  # www subdomain
]

print("Configured CORS origins:", origins)  # Debug log

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY')
)

class PlantInfo(BaseModel):
    name: str
    health_score: float
    recommendations: List[str]
    possible_diseases: List[str]

class BlogContent(BaseModel):
    title: str
    content: str
    category: Optional[str] = None

class FarmingTool(BaseModel):
    name: str
    description: str
    calculator_type: str
    parameters: dict

class GamificationProgress(BaseModel):
    user_id: str
    activity: str
    progress: float
    achievements: List[str]

@app.post("/analyze-plant", response_model=PlantInfo)
async def analyze_plant(file: UploadFile = File(...)):
    try:
        # Read and process the image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # TODO: Implement actual plant analysis using ML model
        # For now, return mock data
        mock_response = PlantInfo(
            name="Sample Plant",
            health_score=0.85,
            recommendations=[
                "Ensure proper watering schedule",
                "Check for adequate sunlight",
                "Monitor soil pH levels"
            ],
            possible_diseases=[
                "Leaf spot",
                "Root rot"
            ]
        )
        return mock_response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/farming-tools")
async def get_farming_tools():
    tools = [
        {
            "name": "Irrigation Calculator",
            "description": "Calculate optimal irrigation schedules",
            "calculator_type": "irrigation",
            "parameters": {
                "crop_type": "string",
                "soil_type": "string",
                "area": "number"
            }
        },
        {
            "name": "Harvest Planner",
            "description": "Plan your harvest timeline",
            "calculator_type": "harvest",
            "parameters": {
                "crop_type": "string",
                "planting_date": "date"
            }
        }
    ]
    return JSONResponse(content=tools)

@app.post("/update-progress")
async def update_progress(progress: GamificationProgress):
    # TODO: Implement actual progress tracking
    return {"status": "success", "message": "Progress updated"}

@app.get("/leaderboard")
async def get_leaderboard():
    # Mock leaderboard data
    return {
        "top_users": [
            {"username": "GreenThumb", "points": 1200},
            {"username": "PlantMaster", "points": 1100},
            {"username": "GardenGuru", "points": 1000}
        ]
    }

@app.post("/generate-blog-content")
async def generate_blog_content(data: BlogContent):
    try:
        print(f"Received blog generation request for title: {data.title}")  # Debug log
        
        if not data.title or not data.content:
            raise HTTPException(status_code=400, detail="Missing required fields")

        print("Using OpenAI API key:", os.getenv('OPENAI_API_KEY')[:10] + "...")  # Debug log (first 10 chars only)

        prompt = f"""Create a professional, engaging blog post about "{data.title}" in the style of Medium/Substack articles. Include:

        1. A compelling introduction with a hook
        2. Table of Contents with at least 5 main sections
        3. For each section:
           - Clear, well-formatted headings (use ## for main sections, ### for subsections)
           - Engaging content with examples and real-world applications
           - Where relevant, include:
             * Markdown tables for comparing data/options
             * Code snippets (if applicable)
             * Bullet points for key ideas
             * Blockquotes for important insights
             * Suggested image placeholders with detailed descriptions (format: ![alt text][description of ideal image])
        4. Expert Tips & Best Practices (in a formatted table)
        5. Common Mistakes to Avoid (as a bulleted list)
        6. Key Takeaways (in a summary box)
        7. Related Resources section including:
           - 2-3 relevant YouTube video suggestions with descriptions
           - Recommended books or articles
           - Useful tools or products (if applicable)
        
        Context: {data.content}
        Category: {data.category or 'Gardening'}
        
        Format everything in clean, properly spaced markdown with clear section breaks.
        Make the content visually engaging with a mix of different markdown elements.
        Include suggested places for images with detailed descriptions in markdown format."""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo-16k",
            messages=[
                {"role": "system", "content": "You are a professional content creator who specializes in creating engaging, visually rich blog posts. You excel at using markdown to create well-structured, easy-to-read content with a perfect mix of text, tables, quotes, and suggested media placements."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4000
        )

        generated_content = response.choices[0].message.content

        # Parse the content to extract sections and media suggestions
        sections = []
        current_section = ""
        content_lines = generated_content.split('\n')
        
        for line in content_lines:
            if line.startswith('##'):
                if current_section:
                    sections.append(current_section.strip())
                current_section = line[2:].strip()
            else:
                if current_section:
                    current_section += '\n' + line

        if current_section:
            sections.append(current_section.strip())

        return {
            'content': generated_content,
            'sections': sections,
            'status': 'success'
        }

    except Exception as e:
        print(f"Error generating content: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
