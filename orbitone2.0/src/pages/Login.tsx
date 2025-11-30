import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const [userType, setUserType] = useState<string>(""); // HR | Legal | Admin

  const handleGuestLogin = () => {
  if (!userType) return; // guard

  // Save role for dashboard pages to read
  localStorage.setItem("userRole", userType);

  // Navigate based on role
  if (userType === "HR") {
    navigate("/dashboard", { state: { role: userType } });
  } else if (userType === "Legal") {
    navigate("/dashboardl", { state: { role: userType } });
  } else if (userType === "Admin") {
    navigate("/dashboarda", { state: { role: userType } });
  }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Section divided into Left (Form) & Right (Image) */}
      <main className="flex-1 flex flex-col md:flex-row items-center">
        {/* Left Section - Login Form */}
        <div className="flex-1 flex items-center justify-center py-16 px-6">
          <div className="max-w-md w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-light mb-2">Log in to Orbit One</h1>
              <div className="h-px bg-border my-4" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-normal">
                  Email -
                </Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  className="bg-muted"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-normal">
                  Password -
                </Label>
                <Input
                  id="password"
                  type="password"
                  disabled
                  className="bg-muted"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
              </div>

              {/* User Type dropdown */}
              <div className="space-y-2">
                <Label htmlFor="userType" className="text-sm font-normal">
                  User Type -
                </Label>
                <select
                  id="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full border rounded-md p-2 text-sm bg-white"
                  aria-label="Select user type"
                >
                  <option value="">Select role</option>
                  <option value="HR">HR</option>
                  <option value="Legal">Legal</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <Button
                className="w-full gap-2"
                disabled
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>

              {showTooltip && (
                <div className="text-xs text-center text-muted-foreground">
                  Use guest login
                </div>
              )}

              <div className="h-px bg-border my-6" />

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Alternative Login -
                </p>

                {/* Login as Guest: disabled until userType selected */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGuestLogin}
                  disabled={!userType}
                  title={!userType ? "Select a user type to continue" : "Login as Guest"}
                >
                  Login as Guest
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <img
            src="/loginbg.png"
            alt="Login Illustration"
            className="w-full h-[605px] object-cover"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;