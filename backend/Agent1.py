import json
import re
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Model import ask_hf_model 

def run_agent1(hr_data_path="hr_mock_data.json"):
    # Load mock HR data
    with open(hr_data_path, "r") as f:
        hr_data = json.load(f)
    
    # Convert HR data to string for prompt
    hr_data_str = json.dumps(hr_data, indent=2)

    # Prepare the prompt for the AI model
    prompt = f"""
        You are an HR analytics and automation assistant.
        Analyze the following HR dataset and produce:
        1. A short trend analysis summary (staffing, hiring, attrition, exit reasons)
        2. Keep Agent ID as 1 in all tasks.
        3. A list of **domain-specific actionable HR tasks**, like:
            - recruiting or removing employees,
            - listing new job openings,
            - increasing payroll or incentives,
            - adjusting department sizes,
            - introducing retention measures.

        Provide the output strictly in JSON format as follows:

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

    # Call the model using the function from Model.py
    response = ask_hf_model(prompt, model="openai/gpt-oss-120b")

    # Strip triple backticks if present
    response_clean = re.sub(r"```.*?```", "", response, flags=re.DOTALL).strip()

    # Try parsing the response as JSON
    try:
        response_json = json.loads(response_clean)
    except json.JSONDecodeError:
        response_json = {"error": "Failed to parse JSON", "raw_response": response_clean}

    return response_json

