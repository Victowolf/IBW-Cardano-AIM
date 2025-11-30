import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/outputs/Agent2";

interface CompanyData {
  Analysis?: string;
  Company_news?: string[];
  tasks?: { Agent_ID: number; task_description: string }[];
}

const Company_News: React.FC = () => {
  const [data, setData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching company news:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, []);

  const companyNews = data?.Company_news || [];

  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto p-4 text-left space-y-4 bg-transparent">
      {loading ? (
        <p className="text-gray-500 text-sm text-center">Loading data...</p>
      ) : companyNews.length > 0 ? (
        companyNews.map((news, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <p className="text-xs text-gray-500 mb-1">Announcement</p>
            <h2 className="text-[14px] font-normal leading-snug text-gray-900 mb-2">
              {news}
            </h2>
            <a
              href="#"
              className="text-[13px] text-blue-600 font-normal flex items-center gap-1 hover:underline"
            >
              Read more <span className="text-[15px]">→</span>
            </a>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No Value</p>
      )}
    </div>
  );
};

const Company_News_Expanded: React.FC = () => {
  const [data, setData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching company news:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, []);

  const companyNews = data?.Company_news || [];
  const analysis = data?.Analysis || "No Value";

  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto bg-white border border-gray-300 rounded-sm p-6 text-left">
      {loading ? (
        <p className="text-gray-500 text-sm text-center">Loading data...</p>
      ) : (
        <>
          {/* Company News Section */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Company News
          </h2>

          {companyNews.length > 0 ? (
            <div className="grid grid-cols-4 grid-rows-2 border border-gray-200">
              {companyNews.slice(0, 8).map((news, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between border border-gray-200 p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-[15px] text-gray-800 font-normal leading-snug">
                      {news}
                    </h3>
                    <span className="text-blue-600 text-[18px]">→</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-gray-200 p-6 text-gray-500 text-center rounded-md">
              No Value
            </div>
          )}

          {/* A.I. Analysis Section */}
          <div className="mt-8 bg-white/80 backdrop-blur-lg shadow p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-3">A.I. Analysis</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{analysis}</p>
          </div>
        </>
      )}
    </div>
  );
};

export { Company_News_Expanded };
export default Company_News;
