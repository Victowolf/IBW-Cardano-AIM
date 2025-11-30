import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, HelpCircle, BookOpen } from "lucide-react";

const Resources = () => {
  const resources = [
    {
      icon: FileText,
      title: "Application Tips",
      description: "Learn how to craft a compelling resume and cover letter that stands out.",
      items: ["Resume writing guide", "Cover letter templates", "Portfolio best practices"],
    },
    {
      icon: Video,
      title: "Interview Preparation",
      description: "Get ready for your interview with our comprehensive preparation resources.",
      items: ["Interview question examples", "Technical interview tips", "Behavioral interview guide"],
    },
    {
      icon: HelpCircle,
      title: "FAQs",
      description: "Find answers to commonly asked questions about our hiring process.",
      items: ["Application process", "Timeline expectations", "Visa sponsorship"],
    },
    {
      icon: BookOpen,
      title: "Career Development",
      description: "Resources to help you grow and advance your career at Orbit1.",
      items: ["Learning programs", "Mentorship opportunities", "Career paths"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Career Resources</h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to succeed in your Orbit1 career journey
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {resources.map((resource) => (
              <Card key={resource.title} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <resource.icon className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-semibold">{resource.title}</h3>
                  <p className="text-muted-foreground">{resource.description}</p>
                  <ul className="space-y-2">
                    {resource.items.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-4">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted rounded-lg p-8 space-y-4">
            <h2 className="text-2xl font-bold">Need Help?</h2>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Our talent acquisition team is here to help.
            </p>
            <Button>Contact Us</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Resources;
