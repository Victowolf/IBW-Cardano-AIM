import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Lightbulb, Globe } from "lucide-react";

const Life = () => {
  const benefits = [
    {
      icon: Users,
      title: "Collaborative Culture",
      description: "Work with talented professionals in an inclusive environment that values diversity and teamwork.",
    },
    {
      icon: Heart,
      title: "Work-Life Balance",
      description: "Flexible work arrangements, generous PTO, and wellness programs to support your wellbeing.",
    },
    {
      icon: Lightbulb,
      title: "Innovation & Growth",
      description: "Access to learning resources, mentorship programs, and opportunities to work on cutting-edge projects.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Make a difference on projects that shape industries and improve lives around the world.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Life @ Orbit1</h1>
            <p className="text-xl text-muted-foreground">
              Join a community of innovators, problem-solvers, and changemakers
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <benefit.icon className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted rounded-lg p-8 space-y-4">
            <h2 className="text-2xl font-bold">Our Values</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span>Innovation through collaboration and continuous learning</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span>Integrity and transparency in everything we do</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span>Diversity and inclusion as core strengths</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                <span>Excellence and accountability in delivering results</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Life;
