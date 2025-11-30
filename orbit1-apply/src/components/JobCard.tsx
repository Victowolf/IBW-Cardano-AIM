// src/components/JobCard.tsx
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplyDialog } from "./ApplyDialog";
import { AssessmentDialog } from "./AssessmentDialog";

export interface Job {
  id: number;
  title: string;
  category: string;
  location: string;
  level: string;
  workType: string;
  description: string;
}

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  // 🔹 When application is submitted, we store ID here
  const [applicationId, setApplicationId] = useState<string | null>(null);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">{job.category}</Badge>
          <Badge variant="outline">{job.location}</Badge>
          <Badge variant="outline">{job.level}</Badge>
          <Badge variant="outline">{job.workType}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-4">
          {job.description}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {/* Apply button */}
        <ApplyDialog
          jobId={String(job.id)}
          jobTitle={job.title}
          triggerText="Apply now"
          triggerClassName="w-full"
          onApplicationSubmitted={(id) => setApplicationId(id)}
        />

        {/* After apply: show Take the Test button just below */}
        {applicationId && (
          <AssessmentDialog
            applicationId={applicationId}
            jobTitle={job.title}
            triggerClassName="w-full"
          />
        )}
      </CardFooter>
    </Card>
  );
};
