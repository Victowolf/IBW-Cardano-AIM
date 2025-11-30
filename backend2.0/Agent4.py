import json
import os
from Model import ask_hf_model

def generate_assessment(job_description: str, applicant_cv: str) -> str:
    """
    Generates a 20-question technical/aptitude test based on the job description and applicant's CV.
    Output: JSON string containing structured questions.
    """
    prompt = f"""
        You are an AI Recruitment Test Generator.
        Given the following inputs:

        Job Description:
        {job_description}

        Applicant CV:
        {applicant_cv}

        Generate 20 interview-style questions (mixed types):
        - 10 aptitude / logical reasoning / quantitative
        - 10 domain-specific (based on job role & CV skills)
        - Include mix of: multiple choice (MCQ), short answer, and fill-in-the-blank.
        - Questions should simulate the style used by companies like Google or Amazon.

        Return output STRICTLY in JSON format:
        {{
        "questions": [
            {{
            "id": 1,
            "type": "MCQ / ShortAnswer / FillBlank",
            "question": "string",
            "options": ["A", "B", "C", "D"] (only for MCQs),
            "correct_answer": "string"
            }},
            ...
        ]
        }}
        """

    response = ask_hf_model(prompt).strip("`").strip()
    if response.startswith("json"):
        response = response.replace("json", "", 1).strip()

    # Validate and return JSON
    try:
        questions_json = json.loads(response)
    except json.JSONDecodeError:
        questions_json = {"error": "Failed to parse JSON", "raw_output": response}

    return json.dumps(questions_json, indent=2)


def evaluate_responses(questions_with_answers: str, user_responses: str) -> str:
    """
    Evaluates applicant's responses to the generated test and gives a score out of 10.
    Input:
        - questions_with_answers: JSON string from generate_assessment (including correct answers)
        - user_responses: JSON or text list of user's answers
    Output:
        - JSON string with total_score and feedback
    """

    prompt = f"""
        You are an AI HR Evaluation Assistant.
        You will evaluate the applicant's answers to the given test questions.

        Questions with correct answers:
        {questions_with_answers}

        Applicant responses:
        {user_responses}

        Instructions:
        - Compare responses carefully.
        - Assign partial credit if answer is close.
        - Scale the total score out of 10.
        - Include short feedback (strengths, weak areas).
        - Output STRICTLY in JSON:
        {{
        "score": "<float from 0.0 to 10.0>",
        }}
        """

    response = ask_hf_model(prompt).strip("`").strip()
    if response.startswith("json"):
        response = response.replace("json", "", 1).strip()

    try:
        result_json = json.loads(response)
    except json.JSONDecodeError:
        result_json = {"error": "Failed to parse JSON", "raw_output": response}

    return json.dumps(result_json, indent=2)
