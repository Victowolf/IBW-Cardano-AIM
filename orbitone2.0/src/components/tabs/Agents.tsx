// orbitone/src/components/tabs/Agents.tsx
import { useState } from "react";
import { Maximize2 } from "lucide-react";
import Chatbot from "../chatbot";

// ✅ Only default export from Job_Listing
import Job_Listing from "@/components/Agents/Job_Listing";

import Onboarding, { Onboarding_Expanded } from "../Agents/Onboarding";
import Performance, { Performance_Expanded } from "../Agents/Performance";

const AgentsTab = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // --- CARD DATA ---
  const cards = [
    {
      title: "JOB LISTINGS & APPLICATIONS",
      // you can later replace desc with a smaller summary component if you want
      desc: <Job_Listing />,
      // 🔁 use the same component in expanded view
      expandedContent: <Job_Listing />,
    },
    {
      title: "ONBOARDING & ORIENTATION",
      desc: <Onboarding />,
      expandedContent: <Onboarding_Expanded />,
    },
    {
      title: "PERFORMANCE MANAGEMENT",
      desc: <Performance />,
      expandedContent: <Performance_Expanded />,
    },
  ];

  return (
    <>
      {/* ---- Main Agents Layout ---- */}
      <div className="h-[597px] w-full flex relative overflow-hidden font-['IBM Plex Sans',sans-serif]">
        {/* BACKGROUND LAYER (same as Overview) */}
        <div className="absolute inset-0 bg-[#E5E5E5]">
          <img
            src="/home_bg.png"
            alt="overlay"
            className="absolute right-0 top-0 w-[75%] h-[75%] object-cover opacity-80"
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="w-full px-10 py-12 flex flex-row justify-between gap-8 relative z-10">
          {cards.map((card) => (
            <div
              key={card.title}
              className="w-1/3 bg-white/60 backdrop-blur-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] 
              hover:shadow-[0_6px_25px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col relative"
              style={{ maxHeight: "520px" }}
            >
              {/* HEADER */}
              <div className="px-6 pt-4 pb-2 bg-[#E5E5E5]/30 backdrop-blur-sm sticky top-0 z-10">
                <h3 className="text-base font-semibold text-gray-900">
                  {card.title}
                </h3>
              </div>

              {/* CONTENT */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="text-sm text-gray-800 leading-snug">
                  {card.desc}
                </div>
                <p className="text-xs text-gray-700 mt-4">with AutoAI</p>
              </div>

              {/* EXPAND BUTTON */}
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
            </div>
          ))}
        </div>
        <Chatbot />
      </div>

      {/* ---- DIALOG ---- */}
      {openDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white shadow-xl p-8 w-[1500px] h-[700px] overflow-y-auto relative">
            {cards.find((c) => c.title === selectedCard)?.expandedContent}

            {/* Close Button */}
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

export default AgentsTab;
