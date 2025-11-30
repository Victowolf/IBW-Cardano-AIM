import React, { useEffect, useState } from "react";
import Cube_Animation from "./Cube_Animation";

interface BlockchainProps {
  numBlocks: number;
  onCubeClick: (index: number) => void;
}

const Blockchain: React.FC<BlockchainProps> = ({ onCubeClick }) => {
  const [numBlocks, setNumBlocks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChain = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/chain"); // your FastAPI endpoint
        const data = await response.json();

        if (data.chain && Array.isArray(data.chain)) {
          setNumBlocks(data.chain.length); // <-- dynamic count
        }
      } catch (err) {
        console.error("Error fetching chain:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChain();
  }, []);

  return (
    <div className="w-1/4 flex flex-col h-[600px] bg-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-l border-gray-300 relative z-10 rounded-none overflow-hidden">
      {/* --- HEADER --- */}
      <div className="p-10 pb-4 border-b border-gray-200 bg-white/90 sticky top-0 z-20">
        <h2 className="text-2xl font-semibold text-gray-900">
          Blockchain Ledger
        </h2>
      </div>

      {/* --- SCROLLABLE VISUALIZER AREA --- */}
      <div className="flex-1 overflow-y-auto px-10 py-6 flex justify-center items-start">
        {loading ? (
          <div className="text-gray-600 text-sm">Loading blocks...</div>
        ) : (
          <Cube_Animation numBlocks={numBlocks} onBlockClick={onCubeClick} />
        )}
      </div>

      {/* --- FOOTER --- */}
      <div className="px-10 py-4 border-t border-gray-200 bg-white/90 sticky bottom-0 z-20">
        <div className="text-xs text-gray-500">
          Last verified:{" "}
          <span className="font-medium">11 Nov 2025, 09:22 PM</span>
        </div>
      </div>
    </div>
  );
};

export default Blockchain;
