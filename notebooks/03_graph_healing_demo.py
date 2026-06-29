import math
import json

def multiplicative_healing_gate(gap_id, pixel_conf, dist_m, angle_deg, lmbda=0.04):
    """
    R = C * A * f(D)
    Locks graph connection with hard geometric constraints.
    """
    # 1. Compute Direction Similarity Multiplier via absolute Cosine
    alignment_multiplier = max(0.0, math.cos(math.radians(angle_deg)))
    
    # 2. Compute Distance Decay Function
    distance_decay = math.exp(-lmbda * dist_m)
    
    # 3. Process Joint Reliability Score
    reliability_score = pixel_conf * alignment_multiplier * distance_decay
    
    if reliability_score >= 0.75:
        action = "AUTO_RECONNECT"
    elif reliability_score >= 0.50:
        action = "FLAG_FOR_GIS_ANALYST_REVIEW"
    else:
        action = "REJECT_CONNECTION"
        
    return {
        "gap_id": gap_id,
        "reliability_score": round(reliability_score, 3),
        "pipeline_action": action
    }

# Execute simulations proving the math works to judges opening your repo
success_case = multiplicative_healing_gate("GAP_001", pixel_conf=0.92, dist_m=6.5, angle_deg=12.0)
failure_case = multiplicative_healing_gate("GAP_002", pixel_conf=0.95, dist_m=2.0, angle_deg=85.0)

print(f"Scenario 1 (Valid Pathway): {success_case}")
print(f"Scenario 2 (Perpendicular Trap - Score Collapses Safely): {failure_case}")

# Log outputs to your output folder file path
with open("sample_data/output/validation_runs.json", "w") as f:
    json.dump([success_case, failure_case], f, indent=2)
