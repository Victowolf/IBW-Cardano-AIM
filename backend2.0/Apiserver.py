from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse
from multiprocessing import Process, Manager, freeze_support
from fastapi.middleware.cors import CORSMiddleware
from Orchestration import run_all_agents_forever, AGENTS
from chatbot import ask_gemini 
from dotenv import load_dotenv
from pydantic import BaseModel
from mongodb import (
    create_application,
    get_applications_by_job_id,
    get_application_by_id,
    save_assessment_for_application,
    # ⬇️ you will add this in mongodb.py
    update_application_status,  
)


from extracttext import extract_text
from Agent4 import generate_assessment, evaluate_responses

import uvicorn
import os
import requests
import json
import base64
import tempfile

# ✅ Load environment variables from .env
load_dotenv()

GITHUB_REPO = os.getenv("GITHUB_REPO")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
FILE_PATH = os.getenv("FILE_PATH")

app = FastAPI(
    title="Agent Output API",
    version="1.1",
    description="Serves live agent outputs."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent_outputs = None


@app.get("/")
def root():
    return {
        "message": "Agent Output API is live 🚀",
        "docs": "/docs",
        "endpoints": [
            "/outputs",
            "/outputs/{agent_name}",
            "/run_once",
            "/addjob",
            "/getjobs",
            "/chain",  
            "/updatejob/{job_id}",
            "/deletejob/{job_id}",
            "/applications",
            "/applications/{job_id}",
            "/applications/{application_id}/assessment/start",   # ✅ NEW
            "/applications/{application_id}/assessment/submit",  # ✅ NEW
            "/agent/assessment/generate",
            "/agent/assessment/evaluate",
        ],
    }


@app.get("/outputs")
def get_all_outputs():
    global agent_outputs
    if not agent_outputs or not len(agent_outputs):
        raise HTTPException(status_code=404, detail="No agent outputs available yet.")
    return JSONResponse(content=dict(agent_outputs))


@app.get("/outputs/{agent_name}")
def get_agent_output(agent_name: str):
    global agent_outputs
    key = f"{agent_name}_Output"
    if not agent_outputs or key not in agent_outputs:
        raise HTTPException(status_code=404, detail=f"No output found for {agent_name}")
    return JSONResponse(content=agent_outputs[key])


class Job(BaseModel):
    title: str
    department: str
    location: str
    level: str
    type: str
    description: str


class AssessmentRequest(BaseModel):
    job_description: str
    applicant_cv: str


class EvaluationRequest(BaseModel):
    questions_with_answers: dict
    user_responses: dict


class AssessmentAnswers(BaseModel):
    # Frontend sends: { "answers": [ { "id": ..., "answer": "..." }, ... ] }
    answers: list

class StatusUpdate(BaseModel):
    status: str  # "Onboarding" | "Pending" | "Rejected"

class ChatRequest(BaseModel):
    message: str

class BlockInput(BaseModel):
    data: dict   # block inner content WITHOUT block_no

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Gemini chatbot endpoint.
    Receives: { "message": "hi" }
    Returns: { "response": "Hello! How can I help?" }
    """
    try:
        reply = ask_gemini(request.message)
        return {"response": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/addjob")
async def add_job(job: Job):
    """
    Adds a new job entry to jobs.json in the GitHub repository.
    Expects a JSON body with job details.
    """
    try:
        new_job = job.dict()  # convert Pydantic model to dict

        headers = {"Authorization": f"token {GITHUB_TOKEN}"}
        url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{FILE_PATH}"
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch jobs.json from GitHub.")

        data = response.json()
        sha = data["sha"]
        file_content = base64.b64decode(data["content"]).decode("utf-8")

        try:
            jobs_data = json.loads(file_content)
            if "jobs" not in jobs_data or not isinstance(jobs_data["jobs"], list):
                jobs_data = {"jobs": []}
        except Exception:
            jobs_data = {"jobs": []}

        new_id = max((job["id"] for job in jobs_data["jobs"]), default=0) + 1
        new_job["id"] = new_id
        jobs_data["jobs"].append(new_job)

        updated_content = json.dumps(jobs_data, indent=2)
        encoded_content = base64.b64encode(updated_content.encode()).decode()

        commit_message = f"Added new job: {new_job.get('title', 'Untitled')}"
        update_data = {
            "message": commit_message,
            "content": encoded_content,
            "sha": sha,
            "branch": "main"
        }

        update_response = requests.put(url, headers=headers, data=json.dumps(update_data))
        if update_response.status_code not in [200, 201]:
            raise HTTPException(status_code=500, detail="Failed to update jobs.json on GitHub.")

        return {"message": "Job added successfully!", "job_id": new_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/getjobs")
def get_jobs():
    """
    Fetch all job listings from the jobs.json file stored in the GitHub repository.
    Returns the JSON content of the file.
    """
    try:
        headers = {"Authorization": f"token {GITHUB_TOKEN}"}
        url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{FILE_PATH}"
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch jobs.json from GitHub.")

        data = response.json()
        file_content = base64.b64decode(data["content"]).decode("utf-8")

        try:
            jobs_data = json.loads(file_content)
        except Exception:
            raise HTTPException(status_code=500, detail="Failed to parse jobs.json content.")

        return JSONResponse(content=jobs_data)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ NEW: helper to get job description from jobs.json (GitHub)
def fetch_job_description(job_id: str) -> str:
    """
    Fetch jobs.json from GitHub and return the description for a given job_id.

    job_id is stored as string in MongoDB (from /applications),
    but jobs.json has numeric id. We convert.
    """
    try:
        job_id_int = int(job_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job_id stored in application")

    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{FILE_PATH}"
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch jobs.json from GitHub.")

    data = response.json()
    file_content = base64.b64decode(data["content"]).decode("utf-8")

    try:
        jobs_data = json.loads(file_content)
        job_list = jobs_data.get("jobs", [])
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to parse jobs.json content.")

    for job in job_list:
        if job.get("id") == job_id_int:
            return job.get("description", "")

    raise HTTPException(status_code=404, detail=f"Job description not found for id {job_id}")

@app.get("/chain")
def get_chain():
    """
    Fetch chain.json from GitHub and return its parsed contents.
    """
    try:
        headers = {"Authorization": f"token {GITHUB_TOKEN}"}
        url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{os.getenv('CHAIN_FILE_PATH')}"

        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail="Failed to fetch chain.json from GitHub."
            )

        data = response.json()

        # GitHub returns base64 encoded file content
        file_content = base64.b64decode(data["content"]).decode("utf-8")

        try:
            chain_data = json.loads(file_content)
        except Exception:
            raise HTTPException(
                status_code=500,
                detail="Failed to parse chain.json content."
            )

        return JSONResponse(content=chain_data)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/addBlock")
def add_block(payload: BlockInput):
    """
    Append a new block to chain.json stored in GitHub.
    Auto-calculates block_no = len(chain).
    """
    try:
        headers = {"Authorization": f"token {GITHUB_TOKEN}"}
        file_path = os.getenv("CHAIN_FILE_PATH")
        url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{file_path}"

        # Step 1 → Fetch existing chain.json
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(500, "Failed to fetch chain.json from GitHub")

        data = response.json()
        sha = data["sha"]
        file_content = base64.b64decode(data["content"]).decode("utf-8")
        
        # Parse JSON
        chain_data = json.loads(file_content)

        if "chain" not in chain_data or not isinstance(chain_data["chain"], list):
            raise HTTPException(500, "Invalid chain.json structure")

        chain = chain_data["chain"]

        # Step 2 → Construct new block
        new_block_no = len(chain)
        new_block = {
            "block_no": new_block_no,
            "data": payload.data
        }

        # Step 3 → Append new block
        chain.append(new_block)

        # Step 4 → Encode & write back
        updated_content = json.dumps({"chain": chain}, indent=2)
        encoded = base64.b64encode(updated_content.encode()).decode()

        commit_msg = f"Added block #{new_block_no}"

        update_body = {
            "message": commit_msg,
            "content": encoded,
            "sha": sha,
            "branch": "main"
        }

        update_res = requests.put(url, headers=headers, data=json.dumps(update_body))
        if update_res.status_code not in [200, 201]:
            raise HTTPException(500, "Failed to update chain.json on GitHub")

        return {
            "message": f"Block #{new_block_no} added!",
            "block": new_block
        }

    except Exception as e:
        raise HTTPException(500, str(e))


@app.put("/updatejob/{job_id}")
async def update_job(job_id: int, updated_job: Job):
    """
    Updates an existing job (by ID) in the jobs.json file.
    The entire job entry is replaced with the new data, preserving the ID.
    """
    try:
        headers = {"Authorization": f"token {GITHUB_TOKEN}"}
        url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{FILE_PATH}"

        # Step 1: Fetch current jobs.json from GitHub
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch jobs.json from GitHub.")

        data = response.json()
        sha = data["sha"]
        file_content = base64.b64decode(data["content"]).decode("utf-8")

        try:
            jobs_data = json.loads(file_content)
            if "jobs" not in jobs_data or not isinstance(jobs_data["jobs"], list):
                raise HTTPException(status_code=500, detail="Invalid jobs.json structure.")
        except Exception:
            raise HTTPException(status_code=500, detail="Failed to parse jobs.json content.")

        # Step 2: Find and replace the job
        job_list = jobs_data["jobs"]
        job_found = False

        for idx, job in enumerate(job_list):
            if job["id"] == job_id:
                # Replace the entire job while keeping the same ID
                new_job = updated_job.dict()
                new_job["id"] = job_id
                job_list[idx] = new_job
                job_found = True
                break

        if not job_found:
            raise HTTPException(status_code=404, detail=f"Job with ID {job_id} not found.")

        # Step 3: Commit updated file back to GitHub
        updated_content = json.dumps(jobs_data, indent=2)
        encoded_content = base64.b64encode(updated_content.encode()).decode()

        commit_message = f"Updated job ID {job_id}: {updated_job.title}"
        update_data = {
            "message": commit_message,
            "content": encoded_content,
            "sha": sha,
            "branch": "main"
        }

        update_response = requests.put(url, headers=headers, data=json.dumps(update_data))
        if update_response.status_code not in [200, 201]:
            raise HTTPException(status_code=500, detail="Failed to update jobs.json on GitHub.")

        return {"message": f"Job ID {job_id} updated successfully!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/deletejob/{job_id}")
def delete_job(job_id: int):
    """
    Deletes a job entry from jobs.json in the GitHub repository using its ID.
    """
    try:
        headers = {"Authorization": f"token {GITHUB_TOKEN}"}
        url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{FILE_PATH}"

        # Step 1: Fetch the existing jobs.json from GitHub
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch jobs.json from GitHub.")

        data = response.json()
        sha = data["sha"]
        file_content = base64.b64decode(data["content"]).decode("utf-8")

        try:
            jobs_data = json.loads(file_content)
            if "jobs" not in jobs_data or not isinstance(jobs_data["jobs"], list):
                raise HTTPException(status_code=500, detail="Invalid jobs.json structure.")
        except Exception:
            raise HTTPException(status_code=500, detail="Failed to parse jobs.json content.")

        # Step 2: Find the job by ID and remove it
        original_len = len(jobs_data["jobs"])
        jobs_data["jobs"] = [job for job in jobs_data["jobs"] if job["id"] != job_id]

        if len(jobs_data["jobs"]) == original_len:
            raise HTTPException(status_code=404, detail=f"Job with ID {job_id} not found.")

        # Step 3: Encode and push the updated file back to GitHub
        updated_content = json.dumps(jobs_data, indent=2)
        encoded_content = base64.b64encode(updated_content.encode()).decode()

        commit_message = f"Deleted job ID {job_id}"
        update_data = {
            "message": commit_message,
            "content": encoded_content,
            "sha": sha,
            "branch": "main"
        }

        update_response = requests.put(url, headers=headers, data=json.dumps(update_data))
        if update_response.status_code not in [200, 201]:
            raise HTTPException(status_code=500, detail="Failed to update jobs.json on GitHub.")

        return {"message": f"Job ID {job_id} deleted successfully!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/applications")
async def submit_application(
    job_id: str = Form(...),
    job_title: str | None = Form(None),
    full_name: str = Form(...),
    phone: str = Form(...),
    years_exp: int = Form(...),
    resume: UploadFile = File(...),
):
    """
    Receive application form + resume file as multipart/form-data,
    extract text using extracttext.py, and store only the text in MongoDB.
    """
    try:
        # 1️⃣ Save uploaded file to a temporary location
        # Keep correct extension so extracttext.py can decide how to parse
        suffix = os.path.splitext(resume.filename)[1] or ".pdf"

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await resume.read())
            tmp_path = tmp.name

        try:
            # 2️⃣ Extract text using your extracttext.py helper
            resume_text = extract_text(tmp_path)
        finally:
            # 3️⃣ Clean up temporary file
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

        # 4️⃣ Store extracted text in MongoDB (matches mongodb.create_application)
        application_id = create_application(
            job_id=job_id,
            job_title=job_title,
            full_name=full_name,
            phone=phone,
            years_exp=years_exp,
            resume_text=resume_text,   # ✅ send text, not bytes
            resume_filename=resume.filename,
            resume_content_type=resume.content_type or "application/octet-stream",
        )

        return {
            "message": "Application submitted successfully!",
            "application_id": application_id,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/applications/{job_id}")
def list_applications(job_id: str):
    """
    List all applications for a particular job_id from MongoDB.
    """
    try:
        apps = get_applications_by_job_id(job_id)
        return {"job_id": job_id, "applications": apps}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/applications/{application_id}/status")
def update_application_status_api(application_id: str, payload: StatusUpdate):
    """
    Update the status of a single application (Onboarding / Pending / Rejected).
    """
    try:
        updated_doc = update_application_status(
            application_id=application_id,
            status=payload.status,
        )
        if not updated_doc:
            # nothing matched that _id in Mongo
            raise HTTPException(status_code=404, detail="Application not found")

        return {"message": "Status updated successfully", "application": updated_doc}
    except HTTPException:
        # re-raise 404 cleanly
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# ✅ NEW: per-application Agent4 integration (generate questions)
@app.post("/applications/{application_id}/assessment/start")
def start_assessment(application_id: str):
    """
    Generate assessment questions for this application using Agent4.

    - Reads application from Mongo (job_id, full_name, years_exp, resume_text)
    - Fetches job description from GitHub (jobs.json)
    - Builds combined applicant_cv text
    - Calls Agent4.generate_assessment(...)
    - Saves questions on this application
    - Returns questions for the frontend to render
    """
    try:
        app_doc = get_application_by_id(application_id)
        if not app_doc:
            raise HTTPException(status_code=404, detail="Application not found")

        job_id = app_doc.get("job_id")
        job_title = app_doc.get("job_title", "")
        full_name = app_doc.get("full_name", "")
        phone = app_doc.get("phone", "")
        years_exp = app_doc.get("years_exp", "")
        resume_text = app_doc.get("resume_text", "")

        if not job_id:
            raise HTTPException(status_code=400, detail="Application has no job_id")

        # 1️⃣ Get job description from GitHub
        job_description = fetch_job_description(job_id)

        # 2️⃣ Build combined applicant_cv text for Agent4
        profile_lines = [
            f"Job ID: {job_id}",
            f"Job Title: {job_title}",
            f"Candidate Name: {full_name}",
            f"Phone: {phone}",
            f"Years of Experience: {years_exp}",
            "",
            "Resume Content:",
            resume_text,
        ]
        applicant_cv_text = "\n".join(line for line in profile_lines if line)

        # 3️⃣ Ask Agent4 to generate questions (returns JSON string)
        questions_json_str = generate_assessment(
            job_description=job_description,
            applicant_cv=applicant_cv_text,
        )

        questions = json.loads(questions_json_str)

        # 4️⃣ Save them in Mongo on this application
        save_assessment_for_application(
            application_id=application_id,
            questions=questions,
        )

        # 5️⃣ Return to frontend
        return {
            "application_id": application_id,
            "questions": questions,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ NEW: per-application Agent4 integration (evaluate answers)
@app.post("/applications/{application_id}/assessment/submit")
def submit_assessment(application_id: str, payload: AssessmentAnswers):
    """
    Receive candidate answers, evaluate using Agent4,
    and save answers + result into the same application document.
    """
    try:
        app_doc = get_application_by_id(application_id)
        if not app_doc:
            raise HTTPException(status_code=404, detail="Application not found")

        questions = app_doc.get("assessment_questions")
        if not questions:
            raise HTTPException(
                status_code=400,
                detail="No assessment questions found for this application",
            )

        # 1️⃣ JSON strings for Agent4
        questions_str = json.dumps(questions)
        answers_str = json.dumps(payload.answers)

        # 2️⃣ Call Agent4 to evaluate
        result_json_str = evaluate_responses(
            questions_with_answers=questions_str,
            user_responses=answers_str,
        )
        result = json.loads(result_json_str)

        # 3️⃣ Save answers + result
        save_assessment_for_application(
            application_id=application_id,
            questions=questions,
            answers=payload.answers,
            result=result,
        )

        # 4️⃣ Return result
        return {
            "application_id": application_id,
            "result": result,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agent/assessment/generate")
async def api_generate_assessment(payload: AssessmentRequest):
    """
    Use Agent4 to generate a 20-question assessment
    from job description + applicant CV.
    """
    try:
        # Agent4 expects plain strings
        questions_json_str = generate_assessment(
            job_description=payload.job_description,
            applicant_cv=payload.applicant_cv,
        )

        # Agent4 returns a JSON string → convert to dict before sending
        questions = json.loads(questions_json_str)
        return JSONResponse(content=questions)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agent/assessment/evaluate")
async def api_evaluate_assessment(payload: EvaluationRequest):
    """
    Use Agent4 to evaluate applicant answers and return a score out of 10.
    """
    try:
        # Convert dicts to JSON strings because Agent4 expects strings
        questions_str = json.dumps(payload.questions_with_answers)
        responses_str = json.dumps(payload.user_responses)

        result_json_str = evaluate_responses(
            questions_with_answers=questions_str,
            user_responses=responses_str,
        )

        result = json.loads(result_json_str)
        return JSONResponse(content=result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    freeze_support()
    manager = Manager()
    agent_outputs = manager.dict()

    orchestrator_process = Process(
        target=run_all_agents_forever, args=(agent_outputs,), daemon=True
    )
    orchestrator_process.start()
    print("[INFO] ✅ Orchestration process started.")
    print("[INFO] 🌐 Swagger UI: http://127.0.0.1:8000/docs")

    uvicorn.Server(
        uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info", reload=False)
    ).run()
