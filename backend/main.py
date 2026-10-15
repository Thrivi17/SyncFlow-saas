from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = FastAPI(
    title="SyncFlow API",
    version="2.0.0",
    description="Production-grade multi-platform content repurposing SaaS backend."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY environment variable is missing!")

client = Groq(api_key=api_key)


class ContentRequest(BaseModel):
    text: str
    tone: str = "professional"  # options: professional, viral, technical


@app.get("/")
def read_root():
    return {"status": "online", "service": "SyncFlow API v2.0 is running."}


@app.post("/api/repurpose")
async def repurpose_content(payload: ContentRequest):
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")

    tone_instructions = {
        "professional": "Adopt a polished, authoritative corporate tone suitable for LinkedIn and executive summaries.",
        "viral": "Adopt an engaging, hook-driven, high-retention tone optimized for X (Twitter) threads and creators.",
        "technical": "Adopt a precise, engineering-focused tone emphasizing system architecture, metrics, and changelogs."
    }.get(payload.tone, "Adopt a professional tone.")

    prompt = f"""
    You are an expert content strategist and copywriter. 
    Tone Guideline: {tone_instructions}

    Analyze the source text and generate three distinct outputs:
    1. **TWITTER_THREAD**: A punchy 4-tweet thread with hooks and numbering.
    2. **LINKEDIN_POST**: A structured network post with bullet points and hashtags.
    3. **CHANGELOG**: A concise technical release summary.

    Source Text:
    {payload.text}

    Format your response clearly with these exact headings:
    ### 🐦 Twitter Thread
    [Content here]

    ### 💼 LinkedIn Post
    [Content here]

    ### 🚀 Changelog Summary
    [Content here]
    """

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",  # Groq's active catalog model ID
            messages=[
                {"role": "system", "content": "You are a precise, production-ready AI content generation assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )
        return {
            "status": "success",
            "repurposed_content": completion.choices[0].message.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")