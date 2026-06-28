
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from classifier import classify_incident
from datetime import datetime

app = FastAPI(title="Incident Severity Classifier")

class IncidentRequest(BaseModel):
    description: str

# Store last 10 classifications in memory
classification_history = []

@app.post("/classify")
def classify(request: IncidentRequest):
    if not request.description.strip():
        raise HTTPException(status_code=400, detail="Description cannot be empty")
    
    result = classify_incident(request.description)
    
    # Add timestamp and store
    result["timestamp"] = datetime.now().isoformat()
    classification_history.append(result)
    
    # Keep only last 10
    if len(classification_history) > 10:
        classification_history.pop(0)
    
    return result

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/history")
def get_history():
    return {
        "total_classifications": len(classification_history),
        "history": classification_history
    }