from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import speech, payment, auth
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Vpay Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"
                 "http://127.0.0.1:5173" ],  # In production, replace with specific frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(speech.router, prefix="/api/speech", tags=["Speech"])
app.include_router(payment.router, prefix="/api/payment", tags=["Payment"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])

@app.get("/")
async def root():
    return {"message": "Vpay API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
