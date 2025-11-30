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
import { Textarea } from "@/components/ui/textarea";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface AssessmentDialogProps {
  applicationId: string;
  jobTitle?: string;
  triggerClassName?: string;
}

interface Question {
  id: number | string;
  type: string;
  question: string;
  options?: string[];
}

export const AssessmentDialog = ({
  applicationId,
  jobTitle,
  triggerClassName,
}: AssessmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  // 🔹 When dialog opens, call your Agent4 backend to generate questions
  const handleOpenChange = async (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen && questions.length === 0 && !loadingQuestions) {
      try {
        setLoadingQuestions(true);
        setResult(null);

        // Backend (Agent4) – implement later:
        // POST /applications/{applicationId}/assessment/start
        const res = await fetch(
          `${API_BASE_URL}/applications/${applicationId}/assessment/start`,
          {
            method: "POST",
          }
        );

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          console.error("Failed to start assessment:", err || res.statusText);
          alert("Could not start test. Please try again later.");
          return;
        }

       const data = await res.json();
console.log("Assessment start response:", data); // optional but very helpful

let raw: any = [];

// 1️⃣ If backend already sends an array in `questions`
if (Array.isArray(data.questions)) {
  raw = data.questions;
}
// 2️⃣ If backend sends { questions: [...] }
else if (data.questions && Array.isArray(data.questions.questions)) {
  raw = data.questions.questions;
}

// 3️⃣ Now safely normalize to Question[]
const q: Question[] = Array.isArray(raw) ? raw : [];
setQuestions(q);
;
      } catch (err) {
        console.error("Error fetching questions:", err);
        alert("Something went wrong while loading the test.");
      } finally {
        setLoadingQuestions(false);
      }
    }
  };

  const handleAnswerChange = (id: number | string, value: string) => {
    setAnswers((prev) => ({ ...prev, [String(id)]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questions.length) return;

    try {
      setSubmitting(true);

      const payload = {
        answers: questions.map((q) => ({
          id: q.id,
          answer: answers[String(q.id)] || "",
        })),
      };

      // Backend (Agent4) – implement later:
      // POST /applications/{applicationId}/assessment/submit
      const res = await fetch(
        `${API_BASE_URL}/applications/${applicationId}/assessment/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error("Failed to submit assessment:", err || res.statusText);
        alert("Could not submit test. Please try again.");
        return;
      }

      const data = await res.json();
      setResult(data.result || data);
      alert("Test submitted! Your result has been recorded.");
    } catch (err) {
      console.error("Error submitting assessment:", err);
      alert("Something went wrong while submitting the test.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className={triggerClassName}>
          Take the Test
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {jobTitle ? `Assessment for ${jobTitle}` : "Assessment Test"}
          </DialogTitle>
          <DialogDescription>
            Answer the questions below. The AI agent (Agent 4) will evaluate
            your responses automatically.
          </DialogDescription>
        </DialogHeader>

        {loadingQuestions ? (
          <p className="text-sm text-muted-foreground">Generating test…</p>
        ) : !questions.length ? (
          <p className="text-sm text-muted-foreground">
            No questions loaded yet.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {questions.map((q, index) => (
              <div key={q.id} className="space-y-2">
                <p className="font-medium">
                  {index + 1}. {q.question}
                </p>

                {q.options && q.options.length > 0 ? (
                  <div className="space-y-2">
                    {q.options.map((opt, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt}
                          className="w-4 h-4"
                          onChange={(e) =>
                            handleAnswerChange(q.id, e.target.value)
                          }
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <Textarea
                    placeholder="Type your answer here..."
                    value={answers[String(q.id)] || ""}
                    onChange={(e) =>
                      handleAnswerChange(q.id, e.target.value)
                    }
                    required
                  />
                )}
              </div>
            ))}

            <DialogFooter className="mt-4">
              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Test"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {result && (
          <div className="mt-4 rounded-md border p-3 text-sm space-y-1">
            <p className="font-semibold">Result</p>
            {"score" in result && (
              <p>
                Score: <span className="font-semibold">{result.score}</span>
              </p>
            )}
            {result.feedback && <p>{result.feedback}</p>}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
