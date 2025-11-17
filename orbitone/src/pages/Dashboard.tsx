import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OverviewTab from "@/components/tabs/Overveiw";
import AgentsTab from "@/components/tabs/Agents";
import TasksTab from "@/components/tabs/Tasks";
import ReportsTab from "@/components/tabs/Reports";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  const renderTab = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab />;
      case "Agents":
        return <AgentsTab />;
      case "Tasks":
        return <TasksTab />;
      case "Reports":
        return <ReportsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        variant="dashboard"
        userName="Peter"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="bg-secondary/20">
        <div className="px-0 py-0">{renderTab()}</div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
