import json
import os
from Model import ask_hf_model

def run_agent5(payroll_data_path: str = "hr_mock_data.json"):
    """
    Agent 5 – Payroll Assistant
    Reads employee, salary, attendance, and performance data
    to generate salary breakdowns, detect anomalies, and produce a payroll report.
    """

    # ---------- Load payroll-related data ----------
    abs_path = os.path.join(os.path.dirname(__file__), payroll_data_path)
    with open(abs_path, "r") as f:
        hr_data = json.load(f)

    employees = hr_data.get("employees", [])
    performance = hr_data.get("performance_reports", {})

    # ---------- Prompt for the LLM ----------
    prompt = f"""
You are an advanced AI Payroll Assistant (Agent 5).

### Inputs
Employees:
{json.dumps(employees, indent=2)}

Performance Reports:
{json.dumps(performance, indent=2)}

### Tasks
1. Calculate salaries including:
   - base pay (estimate a realistic figure by role)
   - tax deductions (~10–15%)
   - bonuses (performance-based)
   - benefits (HRA, insurance, etc.)
2. Flag any payroll anomalies (e.g., missing data, very low or high values).
3. Generate sample payslips for each employee (JSON structure).
4. Provide summary analytics: total payroll cost, avg salary, number of employees.

### Output format (STRICT JSON)
{{
  "Payroll_Analysis": "High-level summary of payroll status and anomalies",
  "Payslips": [
    {{
      "Employee": "string",
      "Department": "string",
      "Base_Salary": "number",
      "Tax_Deduction": "number",
      "Bonus": "number",
      "Net_Pay": "number",
      "Remarks": "string"
    }}
  ],
  "Summary": {{
    "Total_Payroll_Cost": "number",
    "Average_Salary": "number",
    "Anomalies": ["..."]
  }}
}}
    """

    # ---------- Call model ----------
    response = ask_hf_model(prompt).strip("`").strip()
    if response.startswith("json"):
        response = response.replace("json", "", 1).strip()

    # ---------- Validate ----------
    try:
        result_json = json.loads(response)
    except json.JSONDecodeError:
        result_json = {"error": "Invalid JSON from model", "raw_output": response}

    return result_json


# ---------- Example on-demand run ----------
if __name__ == "__main__":
    print("[INFO] Running Payroll Assistant (Agent 5)...\n")
    payroll_output = run_agent5()
    print(json.dumps(payroll_output, indent=2))
