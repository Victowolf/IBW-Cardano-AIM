// src/components/ApplyDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface ApplyDialogProps {
  jobId: string; // hidden, passed from JobCard
  jobTitle?: string;
  triggerText?: string;
  triggerClassName?: string;
  // tells parent which application was created (for "Take the Test")
  onApplicationSubmitted?: (applicationId: string) => void;
}

/**
 * NOTE FOR BACKEND / AGENT4 (DB stays SAME):
 * -----------------------------------------
 * This component sends these fields to /applications:
 * - job_id
 * - job_title
 * - full_name
 * - phone
 * - years_exp
 * - resume  (file)
 *
 * You are already saving these to MongoDB in your existing code.
 *
 * 👉 Later, when you want to call Agent 4, you can:
 *   1. Read the same fields from DB for that application (job_id, full_name, etc.)
 *   2. Extract text from the stored resume (resume_text).
 *   3. Build a combined string like:
 *        "Job: <job_title>\nName: <full_name>\nPhone: <phone>\nYears: <years_exp>\n\n<resume_text>"
 *   4. Pass that combined string to Agent4 as applicant_cv along with job description.
 *
 * No change is required in this frontend for DB behaviour — all existing data still goes to DB exactly as before.
 */

export const ApplyDialog = ({
  jobId,
  jobTitle,
  triggerText = "Apply",
  triggerClassName,
  onApplicationSubmitted,
}: ApplyDialogProps) => {
  const [open, setOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [yearsExp, setYearsExp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resume) {
      alert("Please upload your resume before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("job_id", jobId);

      if (jobTitle) {
        formData.append("job_title", jobTitle);
      }

      formData.append("full_name", fullName.trim());
      formData.append("phone", phone.trim());
      formData.append("years_exp", yearsExp.trim());
      formData.append("resume", resume);

      // 🟢 DB + backend contract stays EXACTLY the same
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error(
          "Error submitting application:",
          errorData || response.statusText
        );
        alert("Failed to submit application. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("Application submitted successfully:", data);
      alert("Application submitted successfully!");

      // tell parent the application_id so it can show "Take the Test"
      if (onApplicationSubmitted && data.application_id) {
        onApplicationSubmitted(String(data.application_id));
      }

      // Close dialog and reset
      setOpen(false);
      setFullName("");
      setPhone("");
      setResume(null);
      setYearsExp("");
    } catch (error) {
      console.error("Unexpected error submitting application:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setResume(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className={triggerClassName}>
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle ?? "this role"}</DialogTitle>
          <DialogDescription>
            Fill in your details and upload your resume.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Resume */}
          <div className="space-y-2">
            <Label htmlFor="resume">Resume Upload</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              required
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="yearsExp">Years of Experience</Label>
            <Input
              id="yearsExp"
              type="number"
              min="0"
              max="50"
              placeholder="Enter number of years"
              value={yearsExp}
              onChange={(e) => setYearsExp(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Apply"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
