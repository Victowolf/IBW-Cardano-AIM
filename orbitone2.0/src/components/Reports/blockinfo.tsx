import React from "react";
import { GitCommit } from "lucide-react";

interface BlockInfoProps {
  selectedBlock: any | null;
}

const BlockInfo: React.FC<BlockInfoProps> = ({ selectedBlock }) => {
  if (!selectedBlock) {
    return (
      <div className="font-[IBM Plex Sans] w-full h-[600px] overflow-y-auto bg-white border border-gray-300 p-6 text-left">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 flex items-center gap-2">
          <GitCommit size={22} className="text-blue-600" />
          Block Information
        </h2>
        <p className="text-gray-600 italic">No block selected.</p>
      </div>
    );
  }

  /** Format timestamps or nested objects */
  const formatValue = (value: any) => {
    if (
      typeof value === "number" &&
      value > 1000000000 &&
      value < 99999999999
    ) {
      try {
        return new Date(value * 1000).toLocaleString();
      } catch {
        return value;
      }
    }

    if (typeof value === "object" && value !== null) {
      return (
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return String(value);
  };

  /** Render ANY schema dynamically */
  const renderObject = (obj: any) => {
    return Object.entries(obj).map(([key, value]) => (
      <div key={key} className="mb-3">
        <p className="text-sm text-gray-700">
          <strong className="capitalize">{key.replace(/_/g, " ")}:</strong>
        </p>
        <div className="ml-3 text-gray-900">{formatValue(value)}</div>
      </div>
    ));
  };

  return (
    <div className="font-[IBM Plex Sans] w-full h-[600px] overflow-y-auto bg-white border border-gray-300 p-6 text-left">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1 text-gray-900 flex items-center gap-2">
          <GitCommit size={22} className="text-blue-600" />
          Block #{selectedBlock.block_no}
        </h2>
        <p className="text-gray-700 text-sm">
          Full metadata of this blockchain block.
        </p>
      </div>

      {/* MAIN BLOCK */}
      <div className="border border-gray-200 p-6 rounded-md shadow-sm">
        {renderObject(selectedBlock)}
      </div>

      {/* NESTED DATA */}
      {selectedBlock.data && (
        <div className="border border-gray-200 p-6 rounded-md shadow-sm mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Block Data
          </h3>
          {renderObject(selectedBlock.data)}
        </div>
      )}
    </div>
  );
};

export default BlockInfo;
