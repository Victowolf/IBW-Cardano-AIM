from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from multiprocessing import Process, Manager, freeze_support
from fastapi.middleware.cors import CORSMiddleware
from Orchestration import run_all_agents_forever, AGENTS
from dotenv import load_dotenv
from pydantic import BaseModel
import uvicorn
import os
import requests
import json
import base64

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
        "endpoints": ["/outputs", "/outputs/{agent_name}", "/run_once", "/addjob"],
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
