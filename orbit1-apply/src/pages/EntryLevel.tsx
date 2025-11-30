import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Rocket, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const EntryLevel = () => {
  const programs = [
    {
      icon: GraduationCap,
      title: "Graduate Programs",
      description: "Structured rotational programs for recent graduates to explore different roles and teams.",
      duration: "12-24 months",
    },
    {
      icon: Rocket,
      title: "Internships",
      description: "Hands-on experience working on real projects with mentorship from industry experts.",
      duration: "10-12 weeks",
    },
    {
      icon: Users,
      title: "Apprenticeships",
      description: "Learn while you earn with our technical apprenticeship programs.",
      duration: "6-12 months",
    },
    {
      icon: Award,
      title: "Early Career Roles",
      description: "Entry-level positions designed to help you grow your career from day one.",
      duration: "Full-time",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Entry Level Opportunities</h1>
            <p className="text-xl text-muted-foreground">
              Start your career journey with Orbit1
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {programs.map((program) => (
              <Card key={program.title} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <program.icon className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{program.title}</h3>
                    <p className="text-sm text-muted-foreground">{program.duration}</p>
                  </div>
                  <p className="text-muted-foreground">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold">What We Look For</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span>Passion for learning and continuous improvement</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span>Strong problem-solving and analytical skills</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span>Excellent communication and teamwork abilities</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span>Curiosity and willingness to take on new challenges</span>
              </li>
            </ul>
            <Link to="/">
              <Button className="mt-4">
                Browse Entry Level Jobs
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EntryLevel;
