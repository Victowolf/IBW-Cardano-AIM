import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_URL = "http://127.0.0.1:8000/outputs/Agent1";

interface HRData {
  Analysis?: string;
  Recruits?: string;
  Resigned?: string;
  Fired?: string;
  tasks?: { Agent_ID: number; task_description: string }[];
}

const Hr_Analytics: React.FC = () => {
  const [data, setData] = useState<HRData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching HR data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchHRData();
  }, []);

  const recruits = parseInt(data?.Recruits || "0");
  const resigned = parseInt(data?.Resigned || "0");
  const fired = parseInt(data?.Fired || "0");
  const total = recruits + resigned + fired;

  const layers = [
    {
      label: "Recruits",
      value: recruits || "No value",
      percentage: total ? Math.round((recruits / total) * 100) : 0,
      color: "#22c55e",
    },
    {
      label: "Resigned",
      value: resigned || "No value",
      percentage: total ? Math.round((resigned / total) * 100) : 0,
      color: "#3b82f6",
    },
    {
      label: "Fired",
      value: fired || "No value",
      percentage: total ? Math.round((fired / total) * 100) : 0,
      color: "#ef4444",
    },
  ];

  return (
    <div className="font-[IBM Plex Sans] text-gray-900 flex flex-col items-center text-center">
      <p className="text-sm text-gray-700 mb-6">
        Workforce overview — recruits, fired, and resigned employees
      </p>

      {loading ? (
        <p className="text-gray-500">Loading data...</p>
      ) : (
        <>
          {/* Dial Container */}
          <div className="relative w-[180px] h-[180px] flex items-center justify-center">
            {layers.map((layer, index) => (
              <div
                key={index}
                className="absolute rounded-full"
                style={{
                  width: `${180 - index * 40}px`,
                  height: `${180 - index * 40}px`,
                  background: `conic-gradient(${layer.color} ${layer.percentage}%, #e5e7eb ${layer.percentage}%)`,
                }}
              ></div>
            ))}

            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-semibold">
                {total || "No value"}
              </span>
              <span className="text-[10px] text-gray-500">Total Employees</span>
            </div>
          </div>

          {/* Labels */}
          <div className="mt-6 space-y-2 text-sm">
            {layers.map((l, i) => (
              <div key={i} className="flex items-center justify-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: l.color }}
                ></span>
                <span className="font-normal">
                  {l.label}: {l.value} (
                  {l.percentage ? `${l.percentage}%` : "No value"})
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Hr_Analytics_Expanded: React.FC = () => {
  const [data, setData] = useState<HRData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching HR data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchHRData();
  }, []);

  const recruits = parseInt(data?.Recruits || "0");
  const resigned = parseInt(data?.Resigned || "0");
  const fired = parseInt(data?.Fired || "0");
  const total = recruits + resigned + fired;

  const layers = [
    {
      label: "Recruits",
      value: recruits || "No value",
      percentage: total ? Math.round((recruits / total) * 100) : 0,
      color: "#22c55e",
    },
    {
      label: "Resigned",
      value: resigned || "No value",
      percentage: total ? Math.round((resigned / total) * 100) : 0,
      color: "#3b82f6",
    },
    {
      label: "Fired",
      value: fired || "No value",
      percentage: total ? Math.round((fired / total) * 100) : 0,
      color: "#ef4444",
    },
  ];

  const exitReasons = [
    { reason: "Better opportunity", count: 15 },
    { reason: "Relocation", count: 8 },
    { reason: "Work-life balance", count: 12 },
    { reason: "Performance issues", count: 6 },
  ];

  const recommendedTasks =
    data?.tasks?.map((task) => task.task_description) || [];

  return (
    <div className="font-[IBM Plex Sans] text-gray-900 w-full h-full p-8 grid grid-cols-4 gap-6">
      {loading ? (
        <div className="col-span-4 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Loading data...</p>
        </div>
      ) : (
        <>
          {/* LEFT SECTION */}
          <div className="col-span-1 flex flex-col justify-between">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              HR Analytics
            </h2>

            {/* Dial */}
            <div className="flex flex-col items-center text-center">
              <p className="text-sm text-gray-700 mb-6">
                Workforce composition overview
              </p>
              <div className="relative w-[160px] h-[160px] flex items-center justify-center">
                {layers.map((layer, index) => (
                  <div
                    key={index}
                    className="absolute rounded-full"
                    style={{
                      width: `${160 - index * 40}px`,
                      height: `${160 - index * 40}px`,
                      background: `conic-gradient(${layer.color} ${layer.percentage}%, #e5e7eb ${layer.percentage}%)`,
                    }}
                  ></div>
                ))}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold">
                    {total || "No value"}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Total Employees
                  </span>
                </div>
              </div>

              {/* Labels */}
              <div className="mt-4 space-y-2 text-sm">
                {layers.map((l, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center gap-2"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: l.color }}
                    ></span>
                    <span>
                      {l.label}: {l.value} (
                      {l.percentage ? `${l.percentage}%` : "No value"})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exit Reasons Chart */}
            <div className="mt-10">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 text-center">
                Common Reasons for Exit
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={exitReasons}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="reason"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-15}
                    dy={10}
                  />
                  <YAxis hide={true} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="col-span-3 grid grid-rows-2 gap-6">
            {/* AI Analysis */}
            <div className="bg-white/80 backdrop-blur-lg shadow p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">A.I Analysis</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {data?.Analysis || "No value"}
              </p>
            </div>

            {/* Recommended Tasks */}
            <div className="bg-white/80 backdrop-blur-lg shadow p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">
                Recommended HR Tasks
              </h2>
              {recommendedTasks.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  {recommendedTasks.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No value</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { Hr_Analytics_Expanded };
export default Hr_Analytics;
