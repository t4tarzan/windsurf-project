from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io
import numpy as np
from typing import List
import json
from datetime import datetime
from pydantic import BaseModel

app = FastAPI(title="Plant Health Meter API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PlantInfo(BaseModel):
    name: str
    health_score: float
    recommendations: List[str]
    possible_diseases: List[str]

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

class FarmingTool(BaseModel):
    name: str
    description: str
    calculator_type: str
    parameters: dict

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

class GamificationProgress(BaseModel):
    user_id: str
    activity: str
    progress: float
    achievements: List[str]

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
