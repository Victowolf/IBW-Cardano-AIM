import json
import os
from Model import ask_hf_model

def run_agent3():
    hr_data_path = os.path.join(os.path.dirname(__file__), "hr_mock_data.json")

    with open(hr_data_path, "r") as f:
        hr_data = json.load(f)

    notifications = hr_data.get("notifications", [])
    departments = list({emp["department"] for emp in hr_data.get("employees", [])})

    prompt = f"""
        You are an intelligent HR Task Distributor.
        You will read management notifications and convert them into clear HR task assignments.

        ### Inputs:
        Notifications:
        {json.dumps(notifications, indent=2)}

        Departments available:
        {departments}

        ### Your job:
        1. Understand the intent behind each notification (hiring, reporting, survey, etc.).
        2. Suggest department-wise task distribution — assign tasks to relevant HR or departmental units.
        3. Keep Agent ID as 3 in all tasks.
        4. Ensure the output is well-organized and directly actionable.

        ### Output Format (STRICT JSON):
        {{
        "Analysis": "Brief overall analysis of the notifications and intent.",
        "Notifications": [...],
        "tasks": [
            {{
            "Agent_ID": 3,
            "task_description": "Department: <Dept> → <Task details>"
            }},
            ...
        ]
        }}
            """

    # Call the LLM (using Model.py’s unified HF client)
    response = ask_hf_model(prompt).strip("`").strip()

    if response.startswith("json"):
        response = response.replace("json", "", 1).strip()

    try:
        result = json.loads(response)
    except json.JSONDecodeError:
        print("⚠️ Model returned invalid JSON. Returning raw text.\n")
        result = {"Analysis": response, "tasks": []}

    return result

