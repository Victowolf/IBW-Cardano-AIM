import React, { useState } from "react";
import { Plus, Edit2, Trash2, Eye, Search, Users } from "lucide-react";

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  level: string;
  type: string;
  description: string;
}

interface Application {
  id: number;
  name: string;
  email: string;
  status: string;
}

const API_BASE = "http://127.0.0.1:8000";

// ======= Demo Applications Data =======
const mockApplications: Record<number, Application[]> = {
  1: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      status: "Shortlisted",
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya@example.com",
      status: "Pending",
    },
  ],
  2: [
    {
      id: 3,
      name: "Rahul Mehta",
      email: "rahul@example.com",
      status: "Interview Scheduled",
    },
    { id: 4, name: "Anna Lee", email: "anna@example.com", status: "Rejected" },
  ],
};

// ====================================================
//  REGULAR JOB LISTING (User View Only)
// ====================================================
const Job_Listing = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/getjobs`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch jobs");
        return res.json();
      })
      .then((data) => {
        setJobs(data.jobs || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto p-6 bg-transparent text-left">
      {/* Job Cards */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading data...</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500 text-sm">No jobs available.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <p className="text-xs text-gray-500">{job.department}</p>
              <h3 className="text-[16px] font-medium text-gray-900">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600">{job.location}</p>
              <p className="text-sm text-gray-500 mt-1">
                {job.level} · {job.type}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[900px] h-[600px] overflow-y-auto shadow-xl p-8 relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>

            <button
              onClick={() => setSelectedJob(null)}
              className="text-sm text-blue-600 hover:underline mb-2"
            >
              ← Back to all jobs
            </button>

            <h2 className="text-2xl font-semibold text-gray-900">
              {selectedJob.department}
            </h2>
            <h3 className="text-lg text-gray-800">{selectedJob.title}</h3>
            <p className="text-gray-600 text-sm">
              {selectedJob.location} • {selectedJob.level} • {selectedJob.type}
            </p>

            <div className="mt-4">
              <h4 className="text-base font-semibold text-gray-900 mb-2">
                Job Description
              </h4>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {selectedJob.description}
              </pre>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="px-5 py-2 bg-black text-white hover:bg-gray-800 transition">
                View Applications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ====================================================
//  EXPANDED JOB LISTING (Admin/HR View)
// ====================================================
const Job_Listing_Expanded = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const [viewApplicationsFor, setViewApplicationsFor] = useState<Job | null>(
    null
  );

  React.useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/getjobs`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch jobs");
        return res.json();
      })
      .then((data) => {
        setJobs(data.jobs || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs.");
      })
      .finally(() => setLoading(false));
  }, []);

  // === Handlers ===
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

      if (!response.ok) throw new Error("Failed to save job");

      // ✅ Refresh jobs after successful add/update
      const updated = await fetch(`${API_BASE}/getjobs`).then((res) =>
        res.json()
      );
      setJobs(updated.jobs || []);

      setShowForm(false);
      setEditingJob(null);
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Error saving job. Check console for details.");
    }
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      const response = await fetch(`${API_BASE}/deletejob/${jobToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete job");

      // Refresh updated list
      const updated = await fetch(`${API_BASE}/getjobs`).then((res) =>
        res.json()
      );
      setJobs(updated.jobs || []);

      setSelectedJob(null);
      setViewApplicationsFor(null);
      setShowDeleteDialog(false);
      setJobToDelete(null);
    } catch (err) {
      console.error(err);
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

  // === Main Render ===
  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto bg-white border border-gray-300 p-6 text-left">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1 text-gray-900">
            Job Listings & Applications
          </h2>
          <p className="text-gray-700 text-sm">
            Manage open roles, edit listings, and review candidate applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
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

      {/* Add/Edit Form */}
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

      {/* Job Details */}
      {selectedJob && !showForm && !viewApplicationsFor && (
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

      {/* Applications View */}
      {viewApplicationsFor && (
        <div className="mt-6 border border-gray-200 p-6 rounded-md shadow-sm">
          <button
            onClick={resetView}
            className="text-sm text-blue-600 hover:underline mb-4"
          >
            ← Back to all jobs
          </button>
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Applications for {viewApplicationsFor.title}
          </h3>

          <div className="space-y-3">
            {mockApplications[viewApplicationsFor.id]?.map((app) => (
              <div
                key={app.id}
                className="p-3 border rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{app.name}</p>
                  <p className="text-sm text-gray-600">{app.email}</p>
                </div>
                <span className="text-sm px-3 py-1 bg-gray-100 border rounded">
                  {app.status}
                </span>
              </div>
            )) || <p>No applications yet.</p>}
          </div>
        </div>
      )}

      {/* Job List */}
      {!showForm && !selectedJob && !viewApplicationsFor && (
        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500">{job.department}</p>
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

                {/* View Applications */}
                <div className="mt-3 text-right">
                  <button
                    onClick={() => setViewApplicationsFor(job)}
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

      {/* Delete Confirmation Dialog */}
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
    </div>
  );
};

// Export both
export default Job_Listing;
export { Job_Listing_Expanded };
