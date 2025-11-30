import json
import re
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Model import ask_hf_model 

def run_agent1(hr_data_path="hr_mock_data.json"):
    with open(hr_data_path, "r") as f:
        hr_data = json.load(f)
    
    hr_data_str = json.dumps(hr_data, indent=2)

    prompt = f"""
        You are an HR analytics and automation assistant.
        Analyze the following HR dataset and produce:
        1. A short trend analysis summary (staffing, hiring, attrition, exit reasons)
        2. Keep Agent ID as 1 in all tasks.
        3. Domain-specific HR tasks.

        Output strictly in JSON:

        {{
        "Analysis": "...",
        "Recruits": "value",
        "Resigned": "value",
        "Fired": "value",
        "tasks": [
            {{"Agent_ID": 1, "task_description": "..."}},
            {{"Agent_ID": 1, "task_description": "..."}}
        ]
        }}

        HR data:
        {hr_data_str}
        """

    # LLM call
    response = ask_hf_model(prompt)

    # FIX: Same cleaning as Agent 2
    response_clean = (
        response.replace("```json", "")
                .replace("```", "")
                .strip("`")
                .strip()
    )

    try:
        return json.loads(response_clean)
    except json.JSONDecodeError:
        return {"error": "Failed to parse JSON", "raw_response": response_clean}
