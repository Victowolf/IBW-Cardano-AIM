import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { TalentNetworkDialog } from "./TalentNetworkDialog";
import { useState } from "react";

export const HeroSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <section className="bg-hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Let's find you the right job
            </h1>
            <div className="bg-background rounded-lg p-6 shadow-card">
              <p className="text-muted-foreground mb-4">
                Join our Talent Network and get notified about the latest opportunities.
              </p>
              <Button className="group" onClick={() => setDialogOpen(true)}>
                Join Talent Network
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      <TalentNetworkDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};
