import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/outputs/Agent3";

interface NotificationData {
  Analysis?: string;
  Notifications?: string[];
  tasks?: { Agent_ID: number; task_description: string }[];
}

// ----------------------------------------------------------
// Regular Version: Notification Cards
// ----------------------------------------------------------
const Notification: React.FC = () => {
  const [data, setData] = useState<NotificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const notifications = data?.Notifications || [];

  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto p-4 text-left space-y-4 bg-transparent">
      {loading ? (
        <p className="text-gray-500 text-sm text-center">Loading data...</p>
      ) : notifications.length > 0 ? (
        notifications.map((note, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <p className="text-xs text-gray-500 mb-1">Task</p>
            <h2 className="text-[14px] font-normal leading-snug text-gray-900 mb-2">
              {note}
            </h2>
            <a
              href="#"
              className="text-[13px] text-blue-600 font-normal flex items-center gap-1 hover:underline"
            >
              View details <span className="text-[15px]">→</span>
            </a>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No Value</p>
      )}
    </div>
  );
};

// ----------------------------------------------------------
// Expanded Version: Notifications (Left) + Tasks (Right)
// ----------------------------------------------------------
const Notification_Expanded: React.FC = () => {
  const [data, setData] = useState<NotificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const notifications = data?.Notifications || [];
  const tasks = data?.tasks || [];

  return (
    <div className="font-[IBM Plex Sans] w-full h-full bg-white border border-gray-300 rounded-sm p-6 text-left">
      {loading ? (
        <p className="text-gray-500 text-sm text-center">Loading data...</p>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Notifications & Tasks
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {/* LEFT SIDE: Notifications */}
            <div className="space-y-4 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Notifications
              </h3>
              {notifications.length > 0 ? (
                notifications.map((note, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <h2 className="text-[14px] font-normal leading-snug text-gray-900 mb-2">
                      {note}
                    </h2>
                    <a
                      href="#"
                      className="text-[13px] text-blue-600 font-normal flex items-center gap-1 hover:underline"
                    >
                      View details <span className="text-[15px]">→</span>
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No Value</p>
              )}
            </div>

            {/* RIGHT SIDE: Tasks */}
            <div className="space-y-4 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Task Assignments
              </h3>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 border border-blue-200 rounded-sm p-4 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <p className="text-xs text-blue-500 mb-1">
                      Agent ID: {task.Agent_ID}
                    </p>
                    <p className="text-[14px] font-normal leading-snug text-gray-900">
                      {task.task_description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No Value</p>
              )}
            </div>
          </div>

          {/* Optional: AI Analysis Section */}
          <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-xl shadow p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-3">A.I. Analysis</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {data?.Analysis || "No Value"}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export { Notification_Expanded };
export default Notification;
