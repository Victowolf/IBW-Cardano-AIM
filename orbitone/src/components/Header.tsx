import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface HeaderProps {
  variant?: "default" | "dashboard";
  userName?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Header = ({
  variant = "default",
  userName,
  activeTab,
  onTabChange,
}: HeaderProps) => {
  const tabs = ["Overview", "Agents", "Tasks", "Reports"];
  const navigate = useNavigate();

  return (
    <header
      className="bg-header text-header-foreground"
      style={{ backgroundColor: "#F3F4F6", color: "#1F2937" }}
    >
      <div className="container flex mx-auto px-6 py-4 items-center justify-between">
        {/* Left side: Logo + tabs */}
        <div className="flex items-center gap-8">
          <img
            src="/logo.png"
            alt="Orbit One Logo"
            className="w-10 h-10 object-contain"
          />
          <Link
            to="/"
            className="text-4xl font-semibold hover:opacity-80 transition-opacity"
          >
            Orbit 1.
          </Link>

          {variant === "dashboard" && (
            <nav className="hidden md:flex items-center gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange?.(tab)}
                  className={`text-sm hover:opacity-80 transition-opacity pb-1 border-b-2 ${
                    activeTab === tab ? "border-primary" : "border-transparent"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Right side: user info or Sign In */}
        <div className="ml-auto">
          {variant === "dashboard" && userName && (
            <div className="text-sm">{userName}'s account</div>
          )}
          {variant === "default" && (
            <Button
              onClick={() => navigate("/login")}
              className="gap-2 w-35 h-8"
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
