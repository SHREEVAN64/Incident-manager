from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from classifier import classify_incident

app = FastAPI(title="Incident Severity Classifier")

class IncidentRequest(BaseModel):
    description: str

@app.post("/classify")
def classify(request: IncidentRequest):
    if not request.description.strip():
        raise HTTPException(status_code=400, detail="Description cannot be empty")
    return classify_incident(request.description)

@app.get("/health")
def health():
    return {"status": "ok"}