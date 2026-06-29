P1_KEYWORDS = [
    "outage", "down", "critical", "production down", "data loss", "breach",
    "complete failure", "all users affected", "revenue impact", "database down",
    "service unavailable", "cannot access", "total outage","Jira-tool down"
]

P2_KEYWORDS = [
    "slow", "degraded", "high latency", "partial", "intermittent", 
    "some users", "performance degradation", "timeout", "memory leak",
    "disk space", "cpu spike", "connection refused","Jira-tool is very slow"
]

P3_KEYWORDS = [
    "warning", "minor", "low impact", "non-critical", "degraded performance",
    "scheduled maintenance", "upcoming", "preparation", "monitoring alert"
]

P4_KEYWORDS = [
    "informational", "routine", "test", "dev environment", "non-production"
]

def classify_incident(description: str):
    try:
        text = description.lower()
        
        if any(word in text for word in P1_KEYWORDS):
            severity = "P1"
            confidence = 0.95
        elif any(word in text for word in P2_KEYWORDS):
            severity = "P2"
            confidence = 0.85
        elif any(word in text for word in P3_KEYWORDS):
            severity = "P3"
            confidence = 0.75
        elif any(word in text for word in P4_KEYWORDS):
            severity = "P4"
            confidence = 0.60
        else:
            # Default fallback
            severity = "P4"
            confidence = 0.50
        
        return {
            "severity": severity,
            "confidence": confidence,
            "description": description
        }
    
    except Exception as e:
        return {"error": str(e), "description": description}


if __name__ == "__main__":
    pass
    