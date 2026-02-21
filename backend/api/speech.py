from fastapi import APIRouter, UploadFile, File, HTTPException
import os
# from google.cloud import speech

router = APIRouter()

# Initialize Google Cloud Speech Client
# client = speech.SpeechClient()

@router.post("/process-audio")
async def process_audio(file: UploadFile = File(...)):
    print(f"Received audio file: {file.filename}")
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty audio")
        transcript = "Pay electricity bill 500 rupees"
        return {"text": transcript, "intent": parse_intent(transcript)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def parse_intent(text):
    """
    Simple rule-based intent parser.
    In production, use Dialogflow or an NLP model.
    """
    text = text.lower()
    intent = {
        "type": "unknown",
        "amount": 0,
        "biller": None
    }
    
    if "pay" in text:
        intent["type"] = "bill_payment"
        
        # Extract amount
        import re
        amount_match = re.search(r'(\d+)', text)
        if amount_match:
            intent["amount"] = int(amount_match.group(1))
            
        # Extract biller
        if "electricity" in text:
            intent["biller"] = "Electricity Board"
        elif "water" in text:
            intent["biller"] = "Water Board"
        elif "mobile" in text or "recharge" in text:
            intent["biller"] = "Mobile Recharge"
            
    return intent
