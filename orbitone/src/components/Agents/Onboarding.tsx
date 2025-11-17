import React, { useState } from "react";
import { UserPlus, Search, BarChart3, Brain, Users } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  skills: string[];
  progress: number; // percentage of onboarding completion
}

interface Mentor {
  id: number;
  name: string;
  skills: string[];
  available: boolean;
}

interface TrainingRecommendation {
  employeeId: number;
  suggestions: string[];
}

// ======= Demo Data =======
const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Arjun Patel",
    role: "Frontend Developer",
    department: "UI/UX",
    skills: ["React", "TypeScript", "CSS"],
    progress: 45,
  },
  {
    id: 2,
    name: "Sara Khan",
    role: "Data Analyst",
    department: "Data Science",
    skills: ["Python", "SQL", "PowerBI"],
    progress: 70,
  },
  {
    id: 3,
    name: "Rohan Mehta",
    role: "Cloud Engineer",
    department: "Infrastructure",
    skills: ["Azure", "Kubernetes", "CI/CD"],
    progress: 30,
  },
];

const availableMentors: Mentor[] = [
  {
    id: 1,
    name: "Ravi Sharma",
    skills: ["React", "TypeScript"],
    available: true,
  },
  {
    id: 2,
    name: "Emily Zhang",
    skills: ["Python", "Data Analysis"],
    available: true,
  },
  {
    id: 3,
    name: "Kiran Patel",
    skills: ["Azure", "Cloud Architecture"],
    available: true,
  },
];

const aiRecommendations: TrainingRecommendation[] = [
  {
    employeeId: 1,
    suggestions: ["Advanced React Patterns", "UI Accessibility Training"],
  },
  {
    employeeId: 2,
    suggestions: [
      "SQL Optimization Workshop",
      "Data Visualization Masterclass",
    ],
  },
  {
    employeeId: 3,
    suggestions: ["Cloud Security Essentials", "Advanced Kubernetes Setup"],
  },
];

// ======= Utility =======
const findBestMentor = (employee: Employee): Mentor | null => {
  const matching = availableMentors.filter(
    (m) => m.available && m.skills.some((s) => employee.skills.includes(s))
  );
  return matching.length > 0 ? matching[0] : null;
};

// ====================================================
// REGULAR ONBOARDING (Employee/General View)
// ====================================================
const Onboarding = () => {
  const [employees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto bg-transparent text-left p-6">
      {/* Employee List */}
      {!selectedEmployee ? (
        <div className="space-y-4">
          {employees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <p className="text-xs text-gray-500">{emp.department}</p>
              <h3 className="text-[16px] font-medium text-gray-900">
                {emp.name}
              </h3>
              <p className="text-sm text-gray-600">{emp.role}</p>
              <div className="flex items-center gap-3 mt-2">
                <BarChart3 size={16} className="text-green-600" />
                <p className="text-sm text-gray-700">
                  Onboarding Progress:{" "}
                  <span className="font-medium">{emp.progress}%</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-md">
          <button
            onClick={() => setSelectedEmployee(null)}
            className="text-sm text-blue-600 hover:underline mb-4"
          >
            ← Back to all employees
          </button>

          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {selectedEmployee.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {selectedEmployee.role} • {selectedEmployee.department}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Skills: {selectedEmployee.skills.join(", ")}
          </p>

          <div className="flex items-center gap-3 mb-4">
            <BarChart3 size={18} className="text-green-600" />
            <p className="text-sm text-gray-700">
              Onboarding Progress:{" "}
              <span className="font-medium">{selectedEmployee.progress}%</span>
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Brain size={16} className="text-purple-600" /> Training
              Recommendations
            </h4>
            <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
              {aiRecommendations
                .find((r) => r.employeeId === selectedEmployee.id)
                ?.suggestions.map((s, i) => <li key={i}>{s}</li>) || (
                <li>No recommendations available.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// ====================================================
// EXPANDED ONBOARDING (HR/Admin View)
// ====================================================
const Onboarding_Expanded = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignedMentors, setAssignedMentors] = useState<
    Record<number, Mentor | null>
  >({});
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const assignMentors = () => {
    const assignments: Record<number, Mentor | null> = {};
    employees.forEach((emp) => {
      assignments[emp.id] = findBestMentor(emp);
    });
    setAssignedMentors(assignments);
  };

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto bg-white border border-gray-300 p-6 text-left">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1 text-gray-900">
            Onboarding & Orientation
          </h2>
          <p className="text-gray-700 text-sm">
            Manage mentors, monitor onboarding progress, and provide training
            insights.
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
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            onClick={assignMentors}
            className="flex items-center gap-2 px-4 py-2 bg-[#0565FF] text-white text-sm hover:bg-[#0453d9] transition-all"
          >
            <Users size={16} /> Auto Assign Mentors
          </button>
        </div>
      </div>

      {/* Employee Details View */}
      {selectedEmployee ? (
        <div className="mt-6 border border-gray-200 p-6 rounded-md shadow-sm">
          <button
            onClick={() => setSelectedEmployee(null)}
            className="text-sm text-blue-600 hover:underline mb-4"
          >
            ← Back to all employees
          </button>

          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {selectedEmployee.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {selectedEmployee.role} • {selectedEmployee.department}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Skills: {selectedEmployee.skills.join(", ")}
          </p>

          <div className="flex items-center gap-3 mb-4">
            <BarChart3 size={18} className="text-green-600" />
            <p className="text-sm text-gray-700">
              Onboarding Progress:{" "}
              <span className="font-medium">{selectedEmployee.progress}%</span>
            </p>
          </div>

          <div className="mb-4">
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              Assigned Mentor
            </h4>
            {assignedMentors[selectedEmployee.id] ? (
              <p className="text-sm text-gray-700">
                {assignedMentors[selectedEmployee.id]?.name} (
                {assignedMentors[selectedEmployee.id]?.skills.join(", ")})
              </p>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No mentor assigned yet. Click “Auto Assign Mentors”.
              </p>
            )}
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Brain size={16} className="text-purple-600" /> AI Training
              Recommendations
            </h4>
            <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
              {aiRecommendations
                .find((r) => r.employeeId === selectedEmployee.id)
                ?.suggestions.map((s, i) => <li key={i}>{s}</li>) || (
                <li>No recommendations available.</li>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500">{emp.department}</p>
                    <h3 className="text-[16px] font-medium text-gray-900">
                      {emp.name}
                    </h3>
                    <p className="text-sm text-gray-600">{emp.role}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Skills: {emp.skills.join(", ")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-700 mb-2">
                      Progress:{" "}
                      <span className="font-medium">{emp.progress}%</span>
                    </p>
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-700 border-t pt-2">
                  Mentor:{" "}
                  {assignedMentors[emp.id] ? (
                    <span className="font-medium">
                      {assignedMentors[emp.id]?.name}
                    </span>
                  ) : (
                    <span className="italic text-gray-500">
                      Not assigned yet
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No employees found.</p>
          )}
        </div>
      )}
    </div>
  );
};

// Export both
export default Onboarding;
export { Onboarding_Expanded };
