/* eslint-disable react-refresh/only-export-components */
import React, { useState, useRef } from "react";
import {
  CalendarDays,
  ClipboardList,
  Search,
  CheckCircle,
  Clock,
  FileText,
  ChevronRight,
} from "lucide-react";

// ====================== INTERFACES ======================
interface Meeting {
  id: number;
  title: string;
  date: string; // yyyy-mm-dd
  time: string;
  participants: string[];
  summary: string;
  tasks: string[];
}

interface Task {
  id: number;
  title: string;
  status: "Recommended" | "Confirmed" | "Completed";
  assignedTo: string;
}

// ====================== DEMO DATA ======================
const initialMeetings: Meeting[] = [
  {
    id: 1,
    title: "Q4 Strategy Planning",
    date: "2025-11-12",
    time: "10:00 AM",
    participants: ["Aditi Sharma", "Rohit Verma", "Megha Singh"],
    summary:
      "Discussed Q4 goals, performance strategies, and training requirements for new interns.",
    tasks: [
      "Prepare Q4 hiring plan",
      "Update training materials",
      "Assign mentors to new interns",
    ],
  },
  {
    id: 2,
    title: "Payroll Review Session",
    date: "2025-12-03",
    time: "2:30 PM",
    participants: ["HR Admin", "Finance Officer", "Payroll Assistant Agent"],
    summary:
      "Reviewed monthly payroll summary and flagged anomalies for review.",
    tasks: [
      "Verify tax deductions",
      "Generate payroll report",
      "Notify employees",
    ],
  },
  {
    id: 3,
    title: "Annual Budget Meeting",
    date: "2026-01-05",
    time: "11:00 AM",
    participants: ["CEO", "CFO", "HR Head"],
    summary: "Planning for next fiscal year's HR allocations and budgets.",
    tasks: ["Draft HR budget proposal", "Review salary increment plan"],
  },
];

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Verify tax deductions",
    status: "Recommended",
    assignedTo: "Finance",
  },
  {
    id: 2,
    title: "Update training materials",
    status: "Confirmed",
    assignedTo: "L&D",
  },
  {
    id: 3,
    title: "Prepare HR monthly report",
    status: "Completed",
    assignedTo: "HR Admin",
  },
];

// ========================================================
// =============== REGULAR VIEW (EMPLOYEE) ================
// ========================================================
const Meet = () => {
  const [meetings] = useState<Meeting[]>(initialMeetings);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto bg-transparent p-6 text-left">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Meetings & Task Dashboard
        </h2>
      </div>

      {!selectedMeeting ? (
        <div className="space-y-4">
          {meetings.map((meet) => (
            <div
              key={meet.id}
              onClick={() => setSelectedMeeting(meet)}
              className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">
                    {meet.date} • {meet.time}
                  </p>
                  <h3 className="text-[16px] font-medium text-gray-900">
                    {meet.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Participants: {meet.participants.join(", ")}
                  </p>
                </div>
                <ChevronRight size={18} className="text-gray-500" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-md">
          <button
            onClick={() => setSelectedMeeting(null)}
            className="text-sm text-blue-600 hover:underline mb-4"
          >
            ← Back to all meetings
          </button>

          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {selectedMeeting.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {selectedMeeting.date} • {selectedMeeting.time}
          </p>
          <p className="text-sm text-gray-700 mb-4">
            Participants: {selectedMeeting.participants.join(", ")}
          </p>

          <div className="mb-4">
            <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileText size={16} className="text-blue-600" /> Meeting Summary
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {selectedMeeting.summary}
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <ClipboardList size={16} className="text-green-600" /> Actionable
              Tasks
            </h4>
            <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
              {selectedMeeting.tasks.map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================================
// =============== EXPANDED VIEW (ADMIN) ==================
// ========================================================
const Meet_Expanded = () => {
  const [meetings] = useState<Meeting[]>(initialMeetings);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedDates, setHighlightedDates] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    "Recommended" | "Confirmed" | "Completed"
  >("Recommended");

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const filteredTasks = tasks.filter((t) => t.status === selectedTab);

  // ===== Search with auto calendar jump =====
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setHighlightedDates([]);
      return;
    }

    const matched = meetings.filter(
      (m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.participants.some((p) =>
          p.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    if (matched.length > 0) {
      const firstMatch = new Date(matched[0].date);
      setMonth(firstMatch.getMonth());
      setYear(firstMatch.getFullYear());
      setHighlightedDates(matched.map((m) => m.date));

      // Smooth scroll into view
      setTimeout(() => {
        calendarRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    } else {
      setHighlightedDates([]);
    }
  };

  // ===== Calendar Component =====
  const Calendar = () => (
    <div
      ref={calendarRef}
      className="grid grid-cols-7 gap-3 p-4 bg-gray-50 border rounded-lg transition-all duration-300"
    >
      {Array.from({ length: daysInMonth }).map((_, i) => {
        const day = i + 1;
        const dateString = `${year}-${String(month + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`;
        const dayMeetings = meetings.filter((m) => m.date === dateString);
        const isHighlighted = highlightedDates.includes(dateString);

        return (
          <div
            key={i}
            className={`border p-3 h-[120px] rounded-md shadow-sm text-sm transition-all duration-300 ${
              isHighlighted
                ? "bg-blue-100 border-blue-400 scale-[1.02]"
                : "bg-white border-gray-200"
            }`}
          >
            <p className="font-semibold text-gray-700 mb-1">
              {months[month].slice(0, 3)} {day}
            </p>
            {dayMeetings.length > 0 ? (
              dayMeetings.map((m) => (
                <div
                  key={m.id}
                  className="bg-blue-50 border border-blue-200 p-1 mb-1 rounded"
                >
                  <p className="text-xs font-medium text-blue-700">{m.title}</p>
                  <p className="text-[10px] text-gray-600">{m.time}</p>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-gray-400 italic">No meetings</p>
            )}
          </div>
        );
      })}
    </div>
  );

  // ======= Main Render =======
  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto bg-white border border-gray-300 p-6 text-left">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1 text-gray-900">
            Meetings & Task Generation
          </h2>
          <p className="text-gray-700 text-sm">
            Manage meeting schedules, extract actionable items, and track HR
            tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-3 py-2 bg-[#0565FF] hover:bg-[#0453d9] text-white text-sm rounded-md transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CalendarDays size={18} className="text-blue-600" /> Meeting
            Calendar
          </h3>

          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="border text-sm py-1.5 px-2 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {months.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-20 border text-sm py-1.5 px-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <Calendar />
      </div>

      {/* Task Dashboard */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <ClipboardList size={18} className="text-green-600" /> Centralized
          Task Dashboard
        </h3>

        <div className="flex gap-4 mb-4">
          {["Recommended", "Confirmed", "Completed"].map((tab) => (
            <button
              key={tab}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setSelectedTab(tab as any)}
              className={`px-4 py-2 text-sm rounded-md border transition ${
                selectedTab === tab
                  ? "bg-[#0565FF] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-gray-200 rounded-md p-4 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-900">{t.title}</p>
                  <p className="text-xs text-gray-500">
                    Assigned to: {t.assignedTo}
                  </p>
                </div>
                {t.status === "Recommended" && (
                  <button
                    onClick={() =>
                      setTasks((prev) =>
                        prev.map((x) =>
                          x.id === t.id ? { ...x, status: "Confirmed" } : x
                        )
                      )
                    }
                    className="text-sm px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded"
                  >
                    Confirm
                  </button>
                )}
                {t.status === "Confirmed" && (
                  <button
                    onClick={() =>
                      setTasks((prev) =>
                        prev.map((x) =>
                          x.id === t.id ? { ...x, status: "Completed" } : x
                        )
                      )
                    }
                    className="text-sm px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
                  >
                    Mark Completed
                  </button>
                )}
                {t.status === "Completed" && (
                  <CheckCircle size={18} className="text-green-600" />
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No tasks found in this category.
            </p>
          )}
        </div>
      </div>

      {/* HR Report Section */}
      <div className="mt-8 border-t pt-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Clock size={18} className="text-gray-600" /> HR Reports Summary
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Generate reports summarizing all meetings, tasks, and HR activities
          over specific intervals.
        </p>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition text-sm">
          <FileText size={14} /> Generate Report
        </button>
      </div>
    </div>
  );
};

// Export both
export default Meet;
export { Meet_Expanded };
