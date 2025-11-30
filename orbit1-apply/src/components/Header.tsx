import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "./LoginDialog";
import { useState } from "react";

export const Header = () => {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-primary">
                Orbit1
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                  Orbit1 Careers
                </Link>
                <Link to="/life" className="text-sm font-medium hover:text-primary transition-colors">
                  Life @ Orbit1
                </Link>
                <Link to="/teams" className="text-sm font-medium hover:text-primary transition-colors">
                  Teams
                </Link>
                <Link to="/entry-level" className="text-sm font-medium hover:text-primary transition-colors">
                  Entry Level
                </Link>
                <Link to="/resources" className="text-sm font-medium hover:text-primary transition-colors">
                  Resources
                </Link>
              </nav>
            </div>
            <Button variant="outline" size="sm" onClick={() => setLoginOpen(true)}>
              Login
            </Button>
          </div>
        </div>
      </header>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
};
