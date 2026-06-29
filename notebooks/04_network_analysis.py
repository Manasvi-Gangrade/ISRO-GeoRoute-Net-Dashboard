import json

# Compile mock centrality metrics tracking high-impact urban intersections
mock_network_centralities = {
    "Majestic_Jn": 0.94,
    "SilkBoard_Flyover": 0.88,
    "Hebbal_Outer_Ring_Road": 0.71,
    "KR_Puram_Bridge": 0.54
}

# 1. Maintenance Prioritization Budget Allocation Sort
ranked_priorities = sorted(mock_network_centralities.items(), key=lambda x: x[1], reverse=True)

# 2. Structure an emergency `.geojson` line file footprint asset
geojson_output = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {"segment_name": "Primary_Artery_Healed", "reliability": 0.94},
        "geometry": {"type": "LineString", "coordinates": [[77.59, 12.97], [77.61, 12.99]]}
    }]
}

# Export production layers to the local files
with open("sample_data/output/healed_network.geojson", "w") as f:
    json.dump(geojson_output, f, indent=2)

print("✔ Infrastructure Criticality Ranking Matrix:")
for rank, (node, score) in enumerate(ranked_priorities):
    print(f"  Rank {rank+1}: {node} (Structural Centrality: {score})")
    
print("\n✔ Production GIS Export Complete: sample_data/output/healed_network.geojson")
