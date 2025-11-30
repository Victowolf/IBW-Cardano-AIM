import React, { useEffect, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import Blockchain from "../Reports/Blockchain";
import BlockInfo from "../Reports/blockinfo";

const Admin = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://127.0.0.1:8000/chain");
      const data = await res.json();
      if (data.chain) setBlocks(data.chain);
    };
    load();
  }, []);

  const handleCubeClick = (index: number) => {
    setSelectedBlock(blocks[index]); // 🎯 show block info on right panel
  };

  return (
    <div className="flex w-full h-[600px] overflow-hidden">
      {/* LEFT: Blockchain cubes */}
      <Blockchain numBlocks={blocks.length} onCubeClick={handleCubeClick} />

      {/* RIGHT: Block information */}
      <div className="flex-1">
        <BlockInfo selectedBlock={selectedBlock} />
      </div>
    </div>
  );
};

export default Admin;
