// orbitone/src/components/Agents/ApplicationsList.tsx
import React from "react";

const API_BASE = "http://127.0.0.1:8000";

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  level: string;
  type: string;
  description: string;
}

export interface Application {
  id: string; // must match `serialize_application` → "id"
  job_id?: string;
  job_title?: string;
  full_name: string;
  phone: string;
  years_exp: number;
  status?: string;
  resume_text?: string;

  assessment_result?: {
    score?: number;
    score_out_of_10?: number;
    overall_score?: number;
    overall_comment?: string;
    [key: string]: any;
  };
  result?: {
    score?: number;
    score_out_of_10?: number;
    overall_score?: number;
    overall_comment?: string;
    [key: string]: any;
  };

  [key: string]: any;
}

interface ApplicationsListProps {
  job: Job;
  onBack: () => void;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({ job, onBack }) => {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `${API_BASE}/applications/${job.id}`;
      console.log("📥 Fetching applications from:", url);

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch applications: ${res.status}`);
      }

      const data = await res.json();
      console.log("📥 Applications response:", data);
      setApplications(data.applications || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchApplications();
  }, [job.id]);

  const getScore = (app: Application): string => {
    const ar = app.assessment_result || app.result || {};
    const score =
      ar.score ??
      ar.score_out_of_10 ??
      ar.overall_score ??
      null;

    if (score == null) return "Not evaluated";
    return `${score} / 10`;
  };

  const handleStatusChange = async (appId: string, status: string) => {
    const url = `${API_BASE}/applications/${appId}/status`;
    console.log("📝 PATCH status URL:", url, "status:", status);

    try {
      setUpdatingId(appId);

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const payload: any = await res.json().catch(() => null);
      console.log("🔁 Status update response:", res.status, payload);

      if (!res.ok) {
        throw new Error(`Failed to update status (status ${res.status})`);
      }

      // ✅ Use backend status if present; otherwise use the status we clicked
      const newStatus =
        payload?.application?.status !== undefined
          ? payload.application.status
          : status;

      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Check console for details.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mt-6 border border-gray-200 p-6 rounded-md shadow-sm">
      <button
        onClick={onBack}
        className="text-sm text-blue-600 hover:underline mb-4"
      >
        ← Back to all jobs
      </button>

      <h3 className="text-xl font-semibold mb-1 text-gray-900">
        Applications for {job.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {job.department} • {job.location}
      </p>

      {loading ? (
        <p className="text-sm text-gray-500">Loading applications...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : applications.length === 0 ? (
        <p className="text-sm text-gray-500">No applications yet.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-3 border rounded-md flex justify-between items-center"
            >
              {/* LEFT: Candidate details + score */}
              <div>
                <p className="font-medium text-gray-800">
                  {app.full_name || "Unnamed Candidate"}
                </p>
                <p className="text-sm text-gray-600">
                  {app.phone} • {app.years_exp} yrs exp
                </p>
                {app.job_title && (
                  <p className="text-xs text-gray-500">
                    Applied for: {app.job_title}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  Test Score:{" "}
                  <span className="font-semibold">{getScore(app)}</span>
                </p>

                {app.assessment_result?.overall_comment && (
                  <p className="text-xs text-gray-500 mt-1">
                    Comment: {app.assessment_result.overall_comment}
                  </p>
                )}

                {app.resume_text && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {app.resume_text.slice(0, 150)}...
                  </p>
                )}
              </div>

              {/* RIGHT: Status buttons */}
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs px-2 py-1 bg-gray-50 border rounded text-gray-700">
                  Status: {app.status || "Pending"}
                </span>

                <div className="flex gap-2">
                  <button
                    disabled={updatingId === app.id}
                    onClick={() => handleStatusChange(app.id, "Pending")}
                    className={`px-3 py-1 text-xs rounded border ${
                      app.status === "Pending"
                        ? "bg-yellow-100 border-yellow-400 text-yellow-800"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    disabled={updatingId === app.id}
                    onClick={() => handleStatusChange(app.id, "Onboarding")}
                    className={`px-3 py-1 text-xs rounded border ${
                      app.status === "Onboarding"
                        ? "bg-green-100 border-green-500 text-green-800"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  >
                    Onboarding
                  </button>
                  <button
                    disabled={updatingId === app.id}
                    onClick={() => handleStatusChange(app.id, "Rejected")}
                    className={`px-3 py-1 text-xs rounded border ${
                      app.status === "Rejected"
                        ? "bg-red-100 border-red-500 text-red-800"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  >
                    Rejected
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
