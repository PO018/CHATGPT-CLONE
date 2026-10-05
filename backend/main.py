from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()  # Load environment variables from .env file

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-3.8-flash")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Prompt(BaseModel):
    text: str


@app.get("/")
def root():
    return {"message": "FastAPI is working!"}


@app.get("/home")
def home():
    return {"message": "Welcome to the Home Page!"}


@app.post("/send-prompt")
def send_prompt(prompt: Prompt):
    response = model.generate_content(prompt.text)

    return {
        "response": response.text
    }