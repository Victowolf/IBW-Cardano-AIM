import { useState } from "react";
import { Maximize2 } from "lucide-react";
import Payroll, { Payroll_Expanded } from "../Finance/Payroll";
import Meet, { Meet_Expanded } from "../Finance/Meet";
import CBID, { CBID_Expanded } from "../Finance/CBID";
import Chatbot from "../chatbot";

const Tasks = () => {
  const [activeTab, setActiveTab] = useState("Recommended");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // --- CARD DATA ---
  const cards = [
    {
      title: "PAYROLL MANAGEMENT",
      desc: <Payroll />,
      showExpand: true,
      expandedContent: <Payroll_Expanded />,
    },
    {
      title: "CAPITAL BUDGETING & INVESTMENT DECISIONS",
      desc: <CBID />,
      showExpand: true,
      expandedContent: <CBID_Expanded />,
    },
  ];

  return (
    <>
      {/* ---- Main Tasks Layout ---- */}
      <div className="h-[597px] w-full flex relative overflow-hidden font-['IBM Plex Sans',sans-serif]">
        {/* BACKGROUND LAYER */}
        <div className="absolute inset-0 bg-[#E5E5E5]">
          <img
            src="/home_bg.png"
            alt="overlay"
            className="absolute right-0 top-0 w-[75%] h-[75%] object-cover opacity-80"
          />
        </div>

        {/* LEFT SECTION */}
        <div className="w-1/3 p-12 flex flex-col border-r border-gray-300 relative z-10 bg-[#E5E5E5]/70 backdrop-blur-sm">
          <h2 className="text-3xl font-light mb-10 text-gray-900">Tasks</h2>

          {/* Tabs */}
          <div className="flex space-x-3 mb-8">
            {["Recommended", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-black text-white"
                    : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="text-gray-700 text-sm leading-relaxed">
            {activeTab === "Recommended"
              ? "These are your AI-recommended payroll and meeting management tasks."
              : "All payroll and meeting-related tasks have been completed successfully."}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-2/3 px-10 py-12 flex flex-row justify-between gap-8 relative z-10">
          {cards.map((card, index) => (
            <div
              key={index}
              className="w-1/2 bg-white/60 backdrop-blur-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] 
             hover:shadow-[0_6px_25px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col relative"
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
        <Chatbot />
      </div>

      {/* ---- Expanded Dialog ---- */}
      {openDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white shadow-xl p-8 w-[1500px] h-[700px] overflow-y-auto relative">
            {cards.find((c) => c.title === selectedCard)?.expandedContent}
            <button
              onClick={() => {
                setOpenDialog(false);
                setSelectedCard(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Tasks;
