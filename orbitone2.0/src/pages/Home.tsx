import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Network,
  Code,
  RefreshCw,
  Database,
  Shield,
} from "lucide-react";

const tabs = [
  {
    id: "hr-analytics",
    name: "HR Analytics",
    icon: Network,
    description:
      "Compute KPIs, analyze trends in hiring and attrition, and generate AI-based recommendations for new hires and HR tasks.",
  },
  {
    id: "candidate-test",
    name: "Candidate Test & Scoring",
    icon: Code,
    description:
      "Generate customized online tests per job role, auto-score submissions, and track recruitment progress across all stages.",
  },
  {
    id: "task-distribution",
    name: "Task Distribution",
    icon: RefreshCw,
    description:
      "Parse notification intent, suggest department-wise task distribution based on HR workload, and create tasks for review.",
  },
  {
    id: "performance",
    name: "Performance Management",
    icon: Database,
    description:
      "Set individual and team goals, collect and analyze performance appraisals, track attendance and engagement metrics.",
  },
  {
    id: "blockchain",
    name: "Blockchain Task Ledger",
    icon: Shield,
    description:
      "Store task completion events as immutable blocks with timestamp, visualize on time-variant dashboard, and capture HR feedback.",
  },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const navigate = useNavigate();
  const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
          {/* Hero Text */}
          <div>
            <h1 className="text-5xl font-light leading-tight mb-8">
              Drive productivity from
              <br />
              within
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Empower HR teams with AI-Agent driven analytics, automated
              testing, and blockchain-powered transparency.
            </p>
          </div>

          {/* Tabs Section */}
          <div>
            <div className="bg-card max-w-full">
              {/* Tab Headers */}
              <div className="flex flex-wrap border-b border-border pl-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-row items-center gap-3 px-4 py-3 text-sm font-normal transition-colors relative ${
                        activeTab === tab.id
                          ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-primary"
                          : "text-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm whitespace-nowrap">
                        {tab.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <p className="text-foreground leading-relaxed">
                  {activeTabData.description}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-start mt-6">
              <Button onClick={() => navigate("/login")} className="gap-2 w-48">
                Try it
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Section: Video */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gray-200">
          <video
            className="w-full h-[600px] object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/IBMbg.mp4" type="video/mp4" />
            Sorry, your browser does not support the video.
          </video>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
