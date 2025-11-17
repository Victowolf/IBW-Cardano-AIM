import { useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import Blockchain from "../Reports/Blockchain";

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // --- SAMPLE DATA ---
  const reportsData = [
    {
      date: "November 10, 2025",
      files: [
        { name: "Payroll_Report_Q3.pdf" },
        { name: "Attendance_Summary.xlsx" },
        { name: "Performance_Insights.docx" },
      ],
    },
    {
      date: "November 09, 2025",
      files: [
        { name: "AI_Audit_Report.pdf" },
        { name: "Meeting_Summary.txt" },
        { name: "Leave_Analytics.xlsx" },
      ],
    },
  ];

  // --- FILTER LOGIC ---
  const filteredReports = reportsData.map((group) => ({
    ...group,
    files: group.files.filter((file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  return (
    <div className="h-[597px] w-full flex relative overflow-hidden font-['IBM Plex Sans',sans-serif] bg-[#E5E5E5]">
      {/* ---- BACKGROUND IMAGE (VISIBLE) ---- */}
      <div className="absolute inset-0">
        <img
          src="/home_bg.png"
          alt="overlay"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E5E5E5]/20 via-[#E5E5E5]/40 to-[#E5E5E5]/20" />
      </div>

      {/* ---- LEFT SECTION (FILE EXPLORER) ---- */}
      <div className="w-3/4 p-10 flex flex-col relative z-10 bg-white/65 border-r border-gray-300">
        <h2 className="text-3xl font-light mb-8 text-gray-900">
          Reports & File Explorer
        </h2>

        {/* SEARCH BAR + REFRESH BUTTON */}
        <div className="flex items-center space-x-3 mb-8 w-1/2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0565FF] rounded-none bg-white/90"
            />
          </div>
          <button
            onClick={() => setSearchTerm("")}
            className="flex items-center justify-center px-4 py-2 bg-[#0565FF] text-white text-sm font-medium hover:bg-blue-700 transition-all rounded-none"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>

        {/* FILE EXPLORER */}
        <div className="flex flex-col space-y-8 overflow-y-auto pr-2">
          {filteredReports.map((group, index) => (
            <div key={index}>
              {/* DATE HEADER */}
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                {group.date}
              </h3>

              {/* FILE ROW */}
              <div className="flex overflow-x-auto space-x-6 pb-2 border-b border-gray-200">
                {group.files.length > 0 ? (
                  group.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="min-w-[200px] h-[80px] bg-white/80 shadow-sm hover:shadow-md 
                      transition-all duration-300 border border-gray-300 flex items-center justify-center 
                      text-center text-sm text-gray-800 font-medium select-none rounded-none"
                    >
                      {file.name}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No files found for this date.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- RIGHT SECTION (BLOCKCHAIN LEDGER) ---- */}
      <Blockchain />
    </div>
  );
};

export default Reports;
