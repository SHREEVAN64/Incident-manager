P1_KEYWORDS = ["outage", "down", "critical", "production down", "data loss", "breach"]
P2_KEYWORDS=["slow", "degraded", "high latency", "partial", "intermittent"]
P3_KEYWORDS=["warning", "minor", "low impact", "non-critical"]

def classify_incident(des:str):
    try:
        text = des.lower()

        if any(word in text for word in P1_KEYWORDS):
            return{"severity": "p1", "confidence": 0.95,"description":des}
        elif any(word in text for word in P2_KEYWORDS):
            return{"severity": "p2", "confidence": 0.90,"description":des}
        elif any(word in text for word in P3_KEYWORDS):
            return{"severity": "p3", "confidence": 0.85,"description":des}
        else:
            return{"severity": "p4", "confidence": 0.80,"description":des}
    except Exception as e:
        return {"error":str(e)}


if  __name__=="__main__":
    test_cases=[
        "Production server is down",
        "Application running slow",
        "Minor warning in logs",
        "Routine maintenance check"
    ]
    for test in test_cases:
        result = classify_incident(test)
        print(f"Input: {test}")
        print(f"Result: {result}\n")