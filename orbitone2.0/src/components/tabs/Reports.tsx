import { useState } from "react";
import { Search, RefreshCw, Maximize2 } from "lucide-react";

// Meeting components
import Meet, { Meet_Expanded } from "../Finance/Meet";

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Expand dialog states (same as Tasks.tsx)
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // SAMPLE DATA
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

  // FILTER LOGIC
  const filteredReports = reportsData.map((group) => ({
    ...group,
    files: group.files.filter((file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  // RIGHT SIDE CARD (just like Tasks.tsx)
  const cards = [
    {
      title: "MEETINGS & SCHEDULE GENERATION",
      desc: <Meet />,
      showExpand: true,
      expandedContent: <Meet_Expanded />,
    },
  ];

  return (
    <>
      <div className="h-[597px] w-full flex relative overflow-hidden font-['IBM Plex Sans',sans-serif] bg-[#E5E5E5]">

        {/* BACKGROUND */}
        <div className="absolute inset-0">
          <img
            src="/home_bg.png"
            alt="overlay"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#E5E5E5]/20 via-[#E5E5E5]/40 to-[#E5E5E5]/20" />
        </div>

        {/* LEFT SECTION – FILE EXPLORER */}
        <div className="w-3/4 p-10 flex flex-col relative z-10 bg-white/65 border-r border-gray-300 overflow-y-auto">
          <h2 className="text-3xl font-light mb-8 text-gray-900">
            Reports & File Explorer
          </h2>

          {/* SEARCH BAR */}
          <div className="flex items-center space-x-3 mb-8 w-1/2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0565FF] bg-white/90"
              />
            </div>

            <button
              onClick={() => setSearchTerm("")}
              className="flex items-center justify-center px-4 py-2 bg-[#0565FF] text-white text-sm font-medium hover:bg-blue-700 transition-all"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>

          {/* FILE LIST */}
          <div className="flex flex-col space-y-8 pr-2">
            {filteredReports.map((group, index) => (
              <div key={index}>
                <h3 className="text-base font-semibold text-gray-800 mb-3">
                  {group.date}
                </h3>

                <div className="flex overflow-x-auto space-x-6 pb-2 border-b border-gray-200">
                  {group.files.length > 0 ? (
                    group.files.map((file, idx) => (
                      <div
                        key={idx}
                        className="min-w-[200px] h-[80px] bg-white/80 shadow-sm hover:shadow-md 
                        transition-all duration-300 border border-gray-300 flex items-center justify-center 
                        text-center text-sm text-gray-800 font-medium select-none"
                      >
                        {file.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">No files found</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION – TASKS STYLE CARDS */}
        <div className="w-1/2 h-full relative z-10 px-6 py-10 flex flex-col gap-6 overflow-y-auto">

          {cards.map((card, index) => (
            <div
              key={index}
              className="w-full bg-white/60 backdrop-blur-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)]
              hover:shadow-[0_6px_25px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col relative border rounded"
              style={{ maxHeight: "520px" }}
            >
              {/* Fixed Title */}
              <div className="px-6 pt-4 pb-2 bg-[#E5E5E5]/30 backdrop-blur-sm sticky top-0 z-10">
                <h3 className="text-base font-semibold text-gray-900">
                  {card.title}
                </h3>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="text-sm text-gray-800 leading-snug">
                  {card.desc}
                </div>
                <p className="text-xs text-gray-700 mt-4">with AutoAI</p>
              </div>

              {/* Expand Button */}
              {card.showExpand && (
                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={() => {
                      setSelectedCard(card.title);
                      setOpenDialog(true);
                    }}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm transition-all"
                    title="Expand"
                  >
                    <Maximize2 size={16} className="text-gray-700" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ---- Expanded Dialog Popup (same as Tasks.tsx) ---- */}
      {openDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white shadow-xl p-8 w-[1500px] h-[700px] overflow-y-auto relative rounded">
            {cards.find((c) => c.title === selectedCard)?.expandedContent}

            <button
              onClick={() => {
                setOpenDialog(false);
                setSelectedCard(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Reports;