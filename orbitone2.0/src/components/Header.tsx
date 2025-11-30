import React from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface HeaderProps {
  variant?: "default" | "dashboard";
  userName?: string;
  activeTab?: string | undefined;
  onTabChange?: (tab: string) => void;
  availableTabs?: string[];
  profileNode?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  variant = "default",
  userName,
  activeTab,
  onTabChange,
  availableTabs,
  profileNode,
}) => {
  const navigate = useNavigate();

  const allTabs = ["Overview", "Agents", "Finance", "Reports", "Admin", ];

  const tabsToRender =
    variant === "dashboard"
      ? availableTabs ?? allTabs
      : [];

  return (
    <header
      className="bg-header text-header-foreground"
      style={{ backgroundColor: "#F3F4F6", color: "#1F2937" }}
    >
      <div className="container flex mx-auto px-5 py-3 items-center justify-between">
        
        {/* Left: Logo + Tabs */}
        <div className="flex items-center gap-6">
          <img
            src="/logo.png"
            alt="Orbit One Logo"
            className="w-8 h-8 object-contain"
          />
          <Link
            to="/"
            className="text-xl sm:text-2xl font-semibold hover:opacity-80 transition-opacity"
          >
            Orbit 1.
          </Link>

          {variant === "dashboard" && (
            <nav className="hidden md:flex items-center gap-4">
              {tabsToRender.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    if (tab === "Configuration") {
                      navigate("/configuration");
                    } else {
                      onTabChange?.(tab);
                    }
                  }}
                  className={`text-sm hover:opacity-80 transition-opacity pb-1 border-b-2 ${
                    activeTab === tab
                      ? "border-primary text-slate-900"
                      : "border-transparent text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Right: profile or sign in */}
        <div className="ml-auto flex items-center gap-3">
          {variant === "dashboard" && profileNode ? (
            profileNode
          ) : variant === "dashboard" && userName ? (
            <div className="text-sm">{userName}'s account</div>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="gap-2 w-32 h-7 text-sm"
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;