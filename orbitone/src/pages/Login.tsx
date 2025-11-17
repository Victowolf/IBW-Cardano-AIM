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

  const handleGuestLogin = () => {
    navigate("/dashboard");
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
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGuestLogin}
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
