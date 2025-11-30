/* eslint-disable react-refresh/only-export-components */

import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import {
  Search,
  FileText,
  ChevronRight,
  TrendingUp,
  BarChart3,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

/* ============================================
   INTERFACES
===============================================*/

interface Investment {
  id: number;
  name: string;
  category: string;
  cost: number;
  expectedROI: number;
  description: string;
  approvalStatus: "Pending" | "Approved" | "Rejected";
}

interface PortfolioSummary {
  category: string;
  total: number;
}

/* ============================================
   DEMO DATA
===============================================*/

const initialInvestments: Investment[] = [
  {
    id: 1,
    name: "New Manufacturing Plant – Pune",
    category: "Infrastructure",
    cost: 45_00_00_000,
    expectedROI: 18,
    description:
      "A new auto-components manufacturing unit to increase production capacity by 32%.",
    approvalStatus: "Pending",
  },
  {
    id: 2,
    name: "Acquisition of SoftTech Analytics",
    category: "Mergers & Acquisitions",
    cost: 28_00_00_000,
    expectedROI: 26,
    description:
      "Acquiring a fast-growing AI analytics startup to expand into enterprise intelligence.",
    approvalStatus: "Pending",
  },
  {
    id: 3,
    name: "New Retail Branch – Hyderabad",
    category: "Expansion",
    cost: 8_00_00_000,
    expectedROI: 14,
    description:
      "Opening a new branch in Hyderabad due to high regional demand.",
    approvalStatus: "Approved",
  },
  {
    id: 4,
    name: "IT Infrastructure Upgrade",
    category: "Digital Transformation",
    cost: 12_50_00_000,
    expectedROI: 10,
    description:
      "Complete modernization of servers, cloud infra and cybersecurity systems.",
    approvalStatus: "Approved",
  },
];

/* ============================================
   PIE CHART COLORS
===============================================*/

const COLORS = ["#4F46E5", "#22C55E", "#F97316", "#EF4444"];

/* Helper: Format to ₹ with Indian Commas */
const formatINR = (amount: number) => "₹" + amount.toLocaleString("en-IN");

/* ============================================
   REGULAR VIEW
===============================================*/

const CBID = () => {
  const [selected, setSelected] = useState<Investment | null>(null);

  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto p-6 bg-transparent text-left">
      {!selected ? (
        <div className="space-y-4">
          {initialInvestments.map((inv) => (
            <div
              key={inv.id}
              onClick={() => setSelected(inv)}
              className="bg-white border border-gray-200 p-5 rounded-md shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500">{inv.category}</p>
                  <h3 className="text-[16px] font-medium text-gray-900">
                    {inv.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cost: {formatINR(inv.cost)}
                  </p>
                </div>
                <ChevronRight size={18} className="text-gray-500" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-6 rounded-md shadow-sm">
          <button
            onClick={() => setSelected(null)}
            className="text-sm text-blue-600 hover:underline mb-4"
          >
            ← Back to investments
          </button>

          <h3 className="text-xl font-semibold">{selected.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{selected.category}</p>
          <p className="text-sm text-gray-700 mb-4">{selected.description}</p>

          <p className="text-sm text-gray-700">
            <strong>Investment Cost:</strong> {formatINR(selected.cost)}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Expected ROI:</strong> {selected.expectedROI}%
          </p>
        </div>
      )}
    </div>
  );
};

/* ============================================
   ADMIN VIEW (ANALYTICS)
===============================================*/

const CBID_Expanded = () => {
  const [investments, setInvestments] = useState(initialInvestments);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = investments.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const portfolioSummary: PortfolioSummary[] = (() => {
    const map: Record<string, number> = {};
    investments.forEach((i) => {
      map[i.category] = (map[i.category] || 0) + i.cost;
    });
    return Object.entries(map).map(([category, total]) => ({
      category,
      total,
    }));
  })();

  const approveInvestment = (id: number) => {
    setInvestments((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, approvalStatus: "Approved" } : inv
      )
    );
  };

  const rejectInvestment = (id: number) => {
    setInvestments((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, approvalStatus: "Rejected" } : inv
      )
    );
  };

  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto bg-white border border-gray-300 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Capital Budgeting — Admin Analytics
          </h2>
          <p className="text-gray-700 text-sm">
            Evaluate long-term investments & analyze ROI.
          </p>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            placeholder="Search investments..."
            className="pl-9 pr-3 py-2 border text-sm rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* PIE CHART */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <BarChart3 size={18} className="text-blue-600" />
          Investment Distribution
        </h3>

        <div className="w-full h-72 bg-gray-50 border rounded-md p-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioSummary}
                dataKey="total"
                nameKey="category"
                outerRadius={100}
                labelLine={false}
                label={false}
              >
                {portfolioSummary.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value: number, name: string) => [
                  formatINR(value),
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* CLEAN LEGEND (COLOUR + CATEGORY + ₹ VALUE) */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {portfolioSummary.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              ></div>
              <span className="text-sm text-gray-800">
                {item.category}: {formatINR(item.total)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* INVESTMENT LIST */}
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <TrendingUp size={18} className="text-green-600" />
        All Investment Proposals
      </h3>

      <div className="space-y-4">
        {filtered.map((inv) => (
          <div
            key={inv.id}
            className="p-5 bg-white border border-gray-200 rounded-md shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500">{inv.category}</p>
                <h4 className="text-[16px] font-semibold text-gray-900">
                  {inv.name}
                </h4>

                <p className="text-sm text-gray-700 mb-2">{inv.description}</p>

                <p className="text-sm text-gray-700">
                  <strong>Cost:</strong> {formatINR(inv.cost)}
                </p>

                <p className="text-sm text-gray-700">
                  <strong>Expected ROI:</strong> {inv.expectedROI}%
                </p>

                <p className="text-sm mt-2">
                  <strong>Status:</strong>{" "}
                  {inv.approvalStatus === "Approved" ? (
                    <span className="text-green-600">Approved</span>
                  ) : inv.approvalStatus === "Rejected" ? (
                    <span className="text-red-600">Rejected</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {inv.approvalStatus === "Pending" ? (
                  <>
                    <button
                      onClick={() => approveInvestment(inv.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm flex items-center gap-1"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>

                    <button
                      onClick={() => rejectInvestment(inv.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm flex items-center gap-1"
                    >
                      <AlertTriangle size={14} /> Reject
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray-400 italic">
                    Decision recorded
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* REPORT */}
      <div className="mt-8 border-t pt-5">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FileText size={18} className="text-gray-600" /> Investment Report
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Generate consolidated insights across all investment proposals.
        </p>
        <button className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800 flex items-center gap-2">
          <FileText size={16} /> Generate Report
        </button>
      </div>
    </div>
  );
};

/* ============================================
   EXPORTS
===============================================*/

export default CBID;
export { CBID_Expanded };
