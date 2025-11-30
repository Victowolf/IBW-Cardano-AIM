import { useState, useMemo, useEffect } from "react";
import { JobCard, Job } from "./JobCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FilterValues } from "./JobFilters";

interface JobListProps {
  // jobs is optional – we always fetch from API, but this keeps it flexible
  jobs?: Job[];
  filters: FilterValues;
}

// ✅ Change this if your backend runs elsewhere
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const JobList = ({ filters }: JobListProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState("9");
  const [sortBy, setSortBy] = useState<"name" | "location" | "category">(
    "name"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =========================================================
  // 1. Fetch jobs dynamically from FastAPI
  // =========================================================
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/getjobs`);
        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await res.json();

        // Backend shape: { jobs: [...] }
        const apiJobs = Array.isArray(data.jobs) ? data.jobs : [];

        const mappedJobs: Job[] = apiJobs.map((job: any) => ({
          id: job.id,
          title: job.title ?? "",
          // backend uses "department" → map to category
          category: job.department ?? job.category ?? "",
          location: job.location ?? "",
          level: job.level ?? "",
          // backend uses "type" → map to workType
          workType: job.type ?? job.workType ?? "",
          description: job.description ?? "",
        }));

        setJobs(mappedJobs);
      } catch (err: any) {
        setError(err.message || "Something went wrong while fetching jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // =========================================================
  // 2. Filtering
  // =========================================================
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const keyword = filters.keyword?.toLowerCase() || "";
      const locationFilter = filters.location?.toLowerCase() || "";
      const teamFilter = filters.team?.toLowerCase() || "";
      const levelFilter = filters.experienceLevel?.toLowerCase() || "";
      const workTypeFilter = filters.workType?.toLowerCase() || "";

      const matchesKeyword =
        !keyword ||
        job.title.toLowerCase().includes(keyword) ||
        job.category.toLowerCase().includes(keyword);

      const matchesLocation =
        !locationFilter ||
        filters.location === "all" ||
        job.location.toLowerCase().includes(locationFilter);

      const matchesTeam =
        !teamFilter ||
        filters.team === "all" ||
        job.category.toLowerCase().includes(teamFilter);

      const matchesLevel =
        !levelFilter ||
        filters.experienceLevel === "all" ||
        job.level.toLowerCase().includes(levelFilter);

      const matchesWorkType =
        !workTypeFilter ||
        filters.workType === "all" ||
        job.workType.toLowerCase().includes(workTypeFilter);

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesTeam &&
        matchesLevel &&
        matchesWorkType
      );
    });
  }, [jobs, filters]);

  // =========================================================
  // 3. Sorting
  // =========================================================
  const sortedJobs = useMemo(() => {
    const sorted = [...filteredJobs];

    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "location":
        sorted.sort((a, b) => a.location.localeCompare(b.location));
        break;
      case "category":
        sorted.sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        break;
    }

    return sorted;
  }, [filteredJobs, sortBy]);

  // =========================================================
  // 4. Pagination
  // =========================================================
  const perPage = useMemo(
    () => parseInt(itemsPerPage, 10) || 9,
    [itemsPerPage]
  );

  const totalPages =
    sortedJobs.length === 0 ? 1 : Math.ceil(sortedJobs.length / perPage);

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentJobs = sortedJobs.slice(startIndex, endIndex);

  // =========================================================
  // 5. Loading / Error States
  // =========================================================
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Loading jobs...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <p className="text-sm text-muted-foreground">Please wait…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-red-500">
          Failed to load jobs: {error}
        </p>
      </div>
    );
  }

  // =========================================================
  // 6. Main Render
  // =========================================================
  return (
    <div className="space-y-6">
      {/* Top bar: count + controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {sortedJobs.length === 0
            ? "No results found"
            : `${startIndex + 1}-${Math.min(
                endIndex,
                sortedJobs.length
              )} of ${sortedJobs.length}+ results`}
        </p>

        <div className="flex items-center gap-4">
          {/* Items per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Items per page
            </span>
            <Select
              value={itemsPerPage}
              onValueChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1); // reset to first page when page size changes
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort by */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by</span>
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as "name" | "location" | "category")
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Job cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage((prev) => Math.max(1, prev - 1))
            }
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(totalPages, prev + 1)
              )
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
