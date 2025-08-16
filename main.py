from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Allow frontend (React/JS in browser) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

API_URL = "https://stablediffusionapi.com/api/v3/text2video"
API_KEY = os.getenv("STABLE_DIFFUSION_KEY")

class VideoRequest(BaseModel):
    prompt: str

@app.get("/")
async def root():
    return {"message": "FastAPI is running with Text-to-Video!"}

@app.post("/generate_video")
async def generate_video(request: VideoRequest):
    payload = {
        "key": API_KEY,
        "prompt": request.prompt,
        "seconds": 5   # keep it simple
    }

    try:
        response = requests.post(API_URL, json=payload)
        result = response.json()

        # Log full response for debugging
        print("DEBUG RESULT:", result)

        if result.get("status") == "success":
            return {"video_url": result["output"][0]}
        else:
            raise HTTPException(status_code=400, detail=f"API Error: {result}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
