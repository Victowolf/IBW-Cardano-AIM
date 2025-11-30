import React, { useState } from "react";
import {
  Target,
  Users,
  Search,
  Brain,
  BarChart3,
  CalendarDays,
} from "lucide-react";

interface Employee {
  id: number;
  name: string;
  type: "Permanent" | "Intern";
  department: string;
  goals: string[];
  appraisalScore: number; // 0–100
  attendance: number; // % presence
  leavesTaken: number;
  feedback: string;
}

interface AIRecommendation {
  id: number;
  tips: string[];
}

// ======= Demo Data =======
const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Aditi Sharma",
    type: "Permanent",
    department: "Software Engineering",
    goals: ["Complete Project Alpha", "Lead weekly stand-ups"],
    appraisalScore: 88,
    attendance: 95,
    leavesTaken: 2,
    feedback: "Consistent performer with good leadership skills.",
  },
  {
    id: 2,
    name: "Rohit Verma",
    type: "Intern",
    department: "Data Science",
    goals: ["Deliver insights from Q3 dataset", "Learn TensorFlow basics"],
    appraisalScore: 78,
    attendance: 89,
    leavesTaken: 1,
    feedback: "Good analytical skills, needs to improve communication.",
  },
  {
    id: 3,
    name: "Megha Singh",
    type: "Permanent",
    department: "Marketing",
    goals: ["Increase campaign reach by 30%", "Improve engagement metrics"],
    appraisalScore: 91,
    attendance: 98,
    leavesTaken: 0,
    feedback: "Strong initiative and collaboration across teams.",
  },
];

// Mock AI Recommendations
const aiRecommendations: AIRecommendation[] = [
  {
    id: 1,
    tips: [
      "Encourage knowledge sharing within the team.",
      "Enroll in advanced leadership training.",
    ],
  },
  {
    id: 2,
    tips: [
      "Take presentation skills workshops.",
      "Practice weekly self-assessments.",
    ],
  },
  {
    id: 3,
    tips: [
      "Explore cross-functional marketing opportunities.",
      "Continue mentoring interns.",
    ],
  },
];

// ====================================================
// REGULAR VIEW — Employee/Manager Dashboard
// ====================================================
const Performance = () => {
  const [employees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto bg-transparent p-6 text-left">
      {/* Summary Dashboard or Employee Details */}
      {!selectedEmployee ? (
        <div className="space-y-4">
          {employees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">{emp.department}</p>
                  <h3 className="text-[16px] font-medium text-gray-900">
                    {emp.name}
                  </h3>
                  <p className="text-sm text-gray-600">{emp.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-700">
                    Appraisal:{" "}
                    <span className="font-medium">{emp.appraisalScore}%</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Attendance:{" "}
                    <span className="font-medium">{emp.attendance}%</span>
                  </p>
                </div>
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
            {selectedEmployee.type} • {selectedEmployee.department}
          </p>

          <div className="flex items-center gap-3 mb-2">
            <Target size={18} className="text-blue-600" />
            <h4 className="text-base font-semibold text-gray-900">Goals</h4>
          </div>
          <ul className="list-disc ml-6 text-sm text-gray-700 mb-4">
            {selectedEmployee.goals.map((goal, i) => (
              <li key={i}>{goal}</li>
            ))}
          </ul>

          <div className="flex gap-8 mb-4">
            <p className="text-sm text-gray-700">
              Appraisal Score:{" "}
              <span className="font-medium text-green-600">
                {selectedEmployee.appraisalScore}%
              </span>
            </p>
            <p className="text-sm text-gray-700">
              Attendance:{" "}
              <span className="font-medium text-blue-600">
                {selectedEmployee.attendance}%
              </span>
            </p>
            <p className="text-sm text-gray-700">
              Leaves Taken:{" "}
              <span className="font-medium">
                {selectedEmployee.leavesTaken}
              </span>
            </p>
          </div>

          <div className="mb-4">
            <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-1">
              <Users size={16} className="text-gray-700" /> Manager Feedback
            </h4>
            <p className="text-sm text-gray-700 italic">
              “{selectedEmployee.feedback}”
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <Brain size={16} className="text-purple-600" /> AI Recommendations
            </h4>
            <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
              {aiRecommendations
                .find((r) => r.id === selectedEmployee.id)
                ?.tips.map((tip, i) => <li key={i}>{tip}</li>) || (
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
// EXPANDED VIEW — HR/Admin Dashboard
// ====================================================
const Performance_Expanded = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Permanent" | "Intern">(
    "All"
  );
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || emp.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto bg-white border border-gray-300 p-6 text-left">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1 text-gray-900">
            Performance Management (Admin)
          </h2>
          <p className="text-gray-700 text-sm">
            Set goals, analyze appraisals, track attendance, and view AI
            insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
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

          {/* Toggle View Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border text-sm py-2 px-2 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Permanent">Permanent</option>
            <option value="Intern">Intern</option>
          </select>
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
            {selectedEmployee.type} • {selectedEmployee.department}
          </p>

          <div className="flex gap-6 mb-4">
            <p className="text-sm text-gray-700">
              Appraisal:{" "}
              <span className="font-medium text-green-600">
                {selectedEmployee.appraisalScore}%
              </span>
            </p>
            <p className="text-sm text-gray-700">
              Attendance:{" "}
              <span className="font-medium text-blue-600">
                {selectedEmployee.attendance}%
              </span>
            </p>
            <p className="text-sm text-gray-700">
              Leaves:{" "}
              <span className="font-medium">
                {selectedEmployee.leavesTaken}
              </span>
            </p>
          </div>

          <div className="mb-4">
            <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-1">
              <Target size={16} className="text-blue-600" /> Goals
            </h4>
            <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
              {selectedEmployee.goals.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-1">
              <Users size={16} className="text-gray-700" /> Manager Feedback
            </h4>
            <p className="text-sm text-gray-700 italic">
              “{selectedEmployee.feedback}”
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <Brain size={16} className="text-purple-600" /> AI Recommendations
            </h4>
            <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
              {aiRecommendations
                .find((r) => r.id === selectedEmployee.id)
                ?.tips.map((tip, i) => <li key={i}>{tip}</li>) || (
                <li>No recommendations available.</li>
              )}
            </ul>
          </div>
        </div>
      ) : (
        // Employee Summary List
        <div className="space-y-4">
          {filteredEmployees.map((emp) => (
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
                  <p className="text-sm text-gray-600">{emp.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-700 mb-1">
                    Appraisal:{" "}
                    <span className="font-medium text-green-600">
                      {emp.appraisalScore}%
                    </span>
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    Attendance:{" "}
                    <span className="font-medium text-blue-600">
                      {emp.attendance}%
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Leaves:{" "}
                    <span className="font-medium">{emp.leavesTaken}</span>
                  </p>
                </div>
              </div>

              <div className="mt-3 text-right">
                <button
                  onClick={() => setSelectedEmployee(emp)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Export both
export default Performance;
export { Performance_Expanded };
