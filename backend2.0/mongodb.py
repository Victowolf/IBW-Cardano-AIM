# mongodb.py
from datetime import datetime
from typing import List, Dict, Any

import os
from dotenv import load_dotenv
from pymongo import MongoClient, ReturnDocument

from bson import ObjectId

load_dotenv()

# e.g. mongodb+srv://user:pass@cluster/db?retryWrites=true&w=majority
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB_NAME", "orbit1_jobs_db")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is not set in .env")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

# Collection where we store job applications
applications_collection = db["job_applications"]


def serialize_application(doc: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert MongoDB document to JSON-serializable dict.
    Used for listing applications by job_id.
    """
    if not doc:
        return {}

    return {
        "id": str(doc.get("_id")),
        "job_id": doc.get("job_id"),
        "job_title": doc.get("job_title"),
        "full_name": doc.get("full_name"),
        "phone": doc.get("phone"),
        "years_exp": doc.get("years_exp"),
        "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None,
        "resume": {
            "filename": doc.get("resume", {}).get("filename"),
            "content_type": doc.get("resume", {}).get("content_type"),
        },
        "resume_text": doc.get("resume_text"),  # ✅ extracted text

        # ✅ NEW: include status so UI can see it on refresh
        "status": doc.get("status"),

        # (Optional) surface assessment fields if you ever need them on the API side
        "assessment_questions": doc.get("assessment_questions"),
        "assessment_answers": doc.get("assessment_answers"),
        "assessment_result": doc.get("assessment_result"),
    }


def create_application(
    job_id: str,
    job_title: str | None,
    full_name: str,
    phone: str,
    years_exp: int,
    resume_text: str,          # ✅ extracted text instead of bytes
    resume_filename: str,
    resume_content_type: str,
) -> str:
    """
    Insert a new application into MongoDB, storing the extracted resume text.
    """
    doc = {
        "job_id": job_id,
        "job_title": job_title,
        "full_name": full_name,
        "phone": phone,
        "years_exp": years_exp,
        "resume": {
            "filename": resume_filename,
            "content_type": resume_content_type,
        },
        "resume_text": resume_text,          # ✅ text from extracttext.py
        "created_at": datetime.utcnow(),
    }

    result = applications_collection.insert_one(doc)
    return str(result.inserted_id)


def get_applications_by_job_id(job_id: str) -> List[Dict[str, Any]]:
    """
    Fetch all applications for a given job_id.
    """
    docs = applications_collection.find({"job_id": job_id}).sort("created_at", -1)
    return [serialize_application(d) for d in docs]


def get_application_file(application_id: str) -> Dict[str, Any] | None:
    """
    Get stored resume metadata + text for a given application.
    (We don't store raw file bytes, only text + basic metadata.)
    """
    try:
        oid = ObjectId(application_id)
    except Exception:
        return None

    doc = applications_collection.find_one({"_id": oid})
    if not doc:
        return None

    resume = doc.get("resume", {})
    return {
        "filename": resume.get("filename"),
        "content_type": resume.get("content_type"),
        "text": doc.get("resume_text"),  # ✅ return extracted text
    }


# =========================
# 🔹 NEW: Helpers for Agent 4
# =========================

def get_application_by_id(application_id: str) -> Dict[str, Any] | None:
    """
    Fetch a single application document by its MongoDB _id.
    This is what /applications/{application_id}/assessment/start uses.
    """
    try:
        oid = ObjectId(application_id)
    except Exception:
        return None

    return applications_collection.find_one({"_id": oid})


def save_assessment_for_application(
    application_id: str,
    questions: Dict[str, Any] | list,
    answers: list | None = None,
    result: Dict[str, Any] | None = None,
) -> None:
    """
    Attach assessment data to an existing application document.

    We do NOT modify old fields (job_id, full_name, resume_text, etc.).
    We only add/update these:
      - assessment_questions
      - assessment_answers
      - assessment_result
    """
    try:
        oid = ObjectId(application_id)
    except Exception:
        # Invalid ObjectId string – nothing to update
        return

    update_fields: Dict[str, Any] = {
        "assessment_questions": questions,
    }

    if answers is not None:
        update_fields["assessment_answers"] = answers

    if result is not None:
        update_fields["assessment_result"] = result

    applications_collection.update_one(
        {"_id": oid},
        {"$set": update_fields},
    )


def update_application_status(application_id: str, status: str):
    """
    Update the hiring status of an application.
    Allowed values: Pending, Onboarding, Rejected
    """
    try:
        oid = ObjectId(application_id)
    except Exception:
        # invalid ObjectId string
        return None

    result = applications_collection.find_one_and_update(
        {"_id": oid},
        {"$set": {"status": status}},
        return_document=ReturnDocument.AFTER,
    )

    if not result:
        return None

    # ✅ convert MongoDB doc → JSON-safe dict
    return serialize_application(result)
