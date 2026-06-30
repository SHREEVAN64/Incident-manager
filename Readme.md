# Incident Severity Classifier

A FastAPI-based incident severity classification system leveraging keyword matching and confidence scoring.

## Features
- **POST /classify** — Classify incident descriptions into P1-P4 severity levels
- **GET /health** — Health check endpoint
- **GET /history** — View last 10 classifications

## Setup

```bash
pip install -r requirements.txt
```

## Run Locally

```bash
py -m uvicorn main:app --reload
```

Navigate to `http://localhost:8000/docs` for interactive API documentation.

## Example Request

```bash
curl -X POST "http://localhost:8000/classify" \
  -H "Content-Type: application/json" \
  -d '{"description": "Production database is down"}'
```

## Response

```json
{
  "severity": "P1",
  "confidence": 0.95,
  "description": "Production database is down",
  "timestamp": "2026-06-29T14:23:45.123456"
}
```

## Severity Levels

- **P1**: Production outages, data loss, complete service failure
- **P2**: Performance degradation, partial outages, intermittent issues
- **P3**: Minor issues, warnings, low-impact alerts
- **P4**: Informational, routine, non-critical

## Tech Stack
- FastAPI
- Pydantic
- Python 3.8+