import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, TrendingUp, Palette, Database, Megaphone, Package } from "lucide-react";
import { Link } from "react-router-dom";

const Teams = () => {
  const teams = [
    {
      icon: Code,
      name: "Software Engineering",
      description: "Build innovative solutions and cutting-edge technology that powers our products.",
      openings: 12,
    },
    {
      icon: Database,
      name: "Data Science",
      description: "Turn data into insights and drive decision-making through advanced analytics.",
      openings: 8,
    },
    {
      icon: Palette,
      name: "Design",
      description: "Create beautiful, intuitive experiences that delight our users.",
      openings: 5,
    },
    {
      icon: Package,
      name: "Product Management",
      description: "Define product vision and strategy to deliver value to customers.",
      openings: 6,
    },
    {
      icon: TrendingUp,
      name: "Sales",
      description: "Build relationships and help customers succeed with our solutions.",
      openings: 10,
    },
    {
      icon: Megaphone,
      name: "Marketing",
      description: "Tell our story and connect with audiences across the globe.",
      openings: 7,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Our Teams</h1>
            <p className="text-xl text-muted-foreground">
              Discover where you can make an impact at Orbit1
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Card key={team.name} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <team.icon className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-semibold">{team.name}</h3>
                  <p className="text-muted-foreground">{team.description}</p>
                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {team.openings} open positions
                    </span>
                    <Link to="/">
                      <Button variant="outline" size="sm">
                        View Jobs
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Teams;
