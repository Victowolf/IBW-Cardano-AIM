// orbitone/src/components/Agents/Job_Listing.tsx

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, Search, Users } from "lucide-react";
import ApplicationsList, { Job } from "./ApplicationsList";

/** Send a blockchain block event */
async function addBlock(eventType: string, job: Job) {
  try {
    await fetch(`${API_BASE}/addBlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          event: eventType,
          job_id: job.id ?? null,
          title: job.title,
          department: job.department,
          location: job.location,
          timestamp: Date.now(),
        },
      }),
    });
  } catch (err) {
    console.warn("⚠ Blockchain block creation failed:", err);
  }
}

const API_BASE = "http://127.0.0.1:8000";

const Job_Listing: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  // When a job is selected for viewing applications
  const [viewApplicationsFor, setViewApplicationsFor] = useState<Job | null>(
    null
  );

  /* ==========================
        FETCH JOBS
  ===========================*/

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/getjobs`);
        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* ==========================
        HANDLERS
  ===========================*/

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const jobData: Omit<Job, "id"> = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      department: (form.elements.namedItem("department") as HTMLInputElement)
        .value,
      location: (form.elements.namedItem("location") as HTMLInputElement).value,
      level: (form.elements.namedItem("level") as HTMLInputElement).value,
      type: (form.elements.namedItem("type") as HTMLInputElement).value,
      description: (
        form.elements.namedItem("description") as HTMLTextAreaElement
      ).value,
    };

    try {
      const endpoint = editingJob
        ? `${API_BASE}/updatejob/${editingJob.id}`
        : `${API_BASE}/addjob`;
      const method = editingJob ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Failed to save job");
      }

      // Refresh jobs list
      // Refresh jobs list
      const updated = await fetch(`${API_BASE}/getjobs`).then((res) =>
        res.json()
      );
      setJobs(updated.jobs || []);

      // Get the new job object
      const newJob = updated.jobs.find((j) => j.title === jobData.title);

      // 🔵 Blockchain block trigger
      if (!editingJob && newJob) {
        addBlock("job_added", newJob);
      }
      if (editingJob) {
        addBlock("job_edited", { ...jobData, id: editingJob.id });
      }

      setShowForm(false);
      setEditingJob(null);
      form.reset();
    } catch (err) {
      console.error("Error saving job:", err);
      alert("Error saving job. Check console for details.");
    }
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      const response = await fetch(`${API_BASE}/deletejob/${jobToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      const updated = await fetch(`${API_BASE}/getjobs`).then((res) =>
        res.json()
      );
      setJobs(updated.jobs || []);

      // 🔴 Blockchain block trigger (DELETE)
      addBlock("job_deleted", jobToDelete);

      setSelectedJob(null);
      setViewApplicationsFor(null);
      setShowDeleteDialog(false);
      setJobToDelete(null);
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Error deleting job. Check console for details.");
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setShowForm(true);
    setSelectedJob(null);
    setViewApplicationsFor(null);
  };

  const resetView = () => {
    setShowForm(false);
    setEditingJob(null);
    setSelectedJob(null);
    setViewApplicationsFor(null);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ==========================
        MAIN RENDER
  ===========================*/

  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto bg-white border border-gray-300 p-6 text-left">
      {/* HEADER: stacked so description is above controls */}
      <div className="mb-6">
        <p className="text-gray-700 text-sm mb-4">
          Manage open roles, edit listings, and review candidate applications.
        </p>

        {/* Controls row — placed under the description */}
        <div className="flex justify-end items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Add Job Button */}
          <button
            onClick={() => {
              setEditingJob(null);
              setShowForm(true);
              setSelectedJob(null);
              setViewApplicationsFor(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#0565FF] text-white text-sm hover:bg-[#0453d9] transition-all"
          >
            <Plus size={16} /> Add Job
          </button>
        </div>
      </div>

      {/* APPLICATIONS PAGE */}
      {viewApplicationsFor ? (
        <ApplicationsList job={viewApplicationsFor} onBack={resetView} />
      ) : (
        <>
          {/* ADD / EDIT JOB FORM */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-gray-200 p-4 shadow-sm mb-6 space-y-3"
            >
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                {editingJob ? "Edit Job" : "Add New Job"}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="title"
                  placeholder="Job Title"
                  defaultValue={editingJob?.title || ""}
                  className="border p-2 text-sm"
                  required
                />

                <input
                  name="department"
                  placeholder="Department"
                  defaultValue={editingJob?.department || ""}
                  className="border p-2 text-sm"
                  required
                />

                <input
                  name="location"
                  placeholder="Location"
                  defaultValue={editingJob?.location || ""}
                  className="border p-2 text-sm"
                  required
                />

                <input
                  name="level"
                  placeholder="Job Level"
                  defaultValue={editingJob?.level || ""}
                  className="border p-2 text-sm"
                />

                <input
                  name="type"
                  placeholder="Work Type"
                  defaultValue={editingJob?.type || ""}
                  className="border p-2 text-sm"
                />
              </div>

              <textarea
                name="description"
                placeholder="Job Description"
                defaultValue={editingJob?.description || ""}
                className="w-full border p-2 text-sm mt-2 h-24"
                required
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={resetView}
                  className="px-4 py-2 text-sm border border-gray-400 hover:bg-gray-100"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-green-600 text-white hover:bg-green-700 transition"
                >
                  {editingJob ? "Update Job" : "Save Job"}
                </button>
              </div>
            </form>
          )}

          {/* SINGLE JOB DETAILS */}
          {selectedJob && !showForm && (
            <div className="mt-4 border border-gray-200 p-6 shadow-sm rounded-md">
              <button
                onClick={resetView}
                className="text-sm text-blue-600 hover:underline mb-4"
              >
                ← Back to all jobs
              </button>

              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {selectedJob.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {selectedJob.department} • {selectedJob.location}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {selectedJob.level} · {selectedJob.type}
              </p>

              <h4 className="text-base font-semibold text-gray-900 mb-2">
                Description
              </h4>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {selectedJob.description}
              </pre>
            </div>
          )}

          {/* JOB LIST */}
          {!showForm && !selectedJob && (
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-gray-500">Loading jobs...</p>
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-500">
                          {job.department}
                        </p>
                        <h3 className="text-[16px] font-medium text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600">{job.location}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {job.level} · {job.type}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="p-2 bg-gray-100 hover:bg-gray-200"
                          title="View"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleEdit(job)}
                          className="p-2 bg-gray-100 hover:bg-gray-200"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => {
                            setJobToDelete(job);
                            setShowDeleteDialog(true);
                          }}
                          className="p-2 bg-gray-100 hover:bg-red-100 text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* View Applications Button */}
                    <div className="mt-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedJob(null);
                          setShowForm(false);
                          setViewApplicationsFor(job);
                        }}
                        className="flex items-center justify-end gap-2 text-sm text-[#0565FF] hover:underline"
                      >
                        <Users size={14} /> View Applications
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 mt-4">
                  No matching jobs found.
                </p>
              )}
            </div>
          )}

          {/* DELETE CONFIRMATION */}
          {showDeleteDialog && jobToDelete && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[380px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Confirm Delete
                </h3>

                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-gray-900">
                    {jobToDelete.title}
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteDialog(false);
                      setJobToDelete(null);
                    }}
                    className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Job_Listing;
