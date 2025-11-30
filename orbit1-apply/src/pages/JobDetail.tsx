import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Briefcase, Clock } from "lucide-react";
import { mockJobs } from "@/data/jobs";
import { ApplyDialog } from "@/components/ApplyDialog";
import { AssessmentDialog } from "@/components/AssessmentDialog";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 🔹 Convert route param (string) → number to match mockJobs.id type
  const numericId = Number(id);
  const job = mockJobs.find((j) => j.id === numericId);

  // 🔹 After application submit, we store this to show "Take the Test"
  const [applicationId, setApplicationId] = useState<string | null>(null);

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <Button onClick={() => navigate("/")}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all jobs
        </Button>

        <div className="max-w-4xl">
          <div className="space-y-6">
            <div>
              <Badge className="mb-4">{job.category}</Badge>
              <h1 className="text-4xl font-bold mb-4">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {job.level}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {job.workType}
                </div>
              </div>
            </div>

            {/* Apply Now section with popup form + Test button under it */}
            <div className="bg-hero-gradient rounded-lg p-8 space-y-4">
              <h2 className="text-2xl font-semibold">Apply Now</h2>
              <p className="text-muted-foreground">
                Join our team and make an impact at Orbit1. We're looking for
                talented individuals who are passionate about technology and
                innovation.
              </p>

              {/* ✅ jobId must be string; also we capture applicationId */}
              <ApplyDialog
                jobId={String(job.id)}
                jobTitle={job.title}
                triggerText="Submit Application"
                triggerClassName="w-full sm:w-auto"
                onApplicationSubmitted={(id) => setApplicationId(id)}
              />

              {/* ✅ After apply is successful, show Take the Test below */}
              {applicationId && (
                <AssessmentDialog
                  applicationId={applicationId}
                  jobTitle={job.title}
                  triggerClassName="w-full sm:w-auto mt-3"
                />
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Job Description
                </h2>
                <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                  <p>
                    We are seeking a talented {job.title} to join our{" "}
                    {job.category} team in {job.location}. This is an exciting
                    opportunity to work on cutting-edge projects and contribute
                    to innovative solutions.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground">
                    Responsibilities:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Design, develop, and maintain high-quality software
                      solutions
                    </li>
                    <li>
                      Collaborate with cross-functional teams to deliver
                      projects
                    </li>
                    <li>
                      Participate in code reviews and contribute to best
                      practices
                    </li>
                    <li>Troubleshoot and resolve technical issues</li>
                    <li>
                      Stay up-to-date with emerging technologies and industry
                      trends
                    </li>
                  </ul>
                  <h3 className="text-lg font-semibold text-foreground">
                    Requirements:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Bachelor&apos;s degree in Computer Science or related
                      field
                    </li>
                    <li>3+ years of relevant professional experience</li>
                    <li>Strong problem-solving and analytical skills</li>
                    <li>Excellent communication and teamwork abilities</li>
                    <li>Passion for technology and continuous learning</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-foreground">
                    What We Offer:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Competitive salary and benefits package</li>
                    <li>Flexible work arrangements ({job.workType})</li>
                    <li>Professional development opportunities</li>
                    <li>Collaborative and inclusive work environment</li>
                    <li>Opportunity to work on innovative projects</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom card still has simple Apply form (no test needed here) */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-4">Ready to apply?</h3>
              <p className="text-muted-foreground mb-4">
                Take the next step in your career journey with Orbit1.
              </p>
              <ApplyDialog
                jobId={String(job.id)}         // 👈 must be string
                jobTitle={job.title}
                triggerText="Apply for this Position"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
