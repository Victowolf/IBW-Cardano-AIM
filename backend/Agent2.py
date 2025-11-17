import json
import os
from Model import ask_hf_model

def run_agent2():
    hr_data_path = os.path.join(os.path.dirname(__file__), "hr_mock_data.json")

    with open(hr_data_path, "r") as f:
        hr_data = json.load(f)

    company_news = hr_data.get("company_news", [])

    prompt = f"""
        You are an AI assistant specializing in HR-related company news summarization.
        Given the following company news updates, do the following:
        1. Summarize the key company developments.
        2. Highlight how these affect HR, hiring, employee engagement, or staffing strategy.
        3. Keep Agent ID as 2 in all tasks.
        4. Generate domain-relevant HR tasks — e.g.,
        - plan new job listings,
        - update employee benefits,
        - hire new staff for expanding teams,
        - adjust HR policies or communication.

        Company News:
        {json.dumps(company_news, indent=2)}

        Respond **strictly** in this JSON format:
        {{
        "Analysis": "Detailed summary and HR implications...",
        "Company_news": [...],
        "tasks": [
            {{
            "Agent_ID": 2,
            "task_description": "..."
            }},
            {{
            "Agent_ID": 2,
            "task_description": "..."
            }}
        ]
        }}
            """

    # Call the LLM through Model.py
    response = ask_hf_model(prompt).strip("`").strip()

    if response.startswith("json"):
        response = response.replace("json", "", 1).strip()

    try:
        result = json.loads(response)
    except json.JSONDecodeError:
        print("⚠️ Model returned invalid JSON. Returning raw text.\n")
        result = {"Analysis": response, "tasks": []}

    return result

