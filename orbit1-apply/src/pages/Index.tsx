import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { JobFilters, FilterValues } from "@/components/JobFilters";
import { JobList } from "@/components/JobList";
import { mockJobs } from "@/data/jobs";

const Index = () => {
  const [filters, setFilters] = useState<FilterValues>({
    keyword: "",
    location: "",
    team: "",
    experienceLevel: "",
    workType: "",
  });

  const handleSearch = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Search for Open Positions</h2>
          <JobFilters onSearch={handleSearch} />
        </div>
        <JobList jobs={mockJobs} filters={filters} />
      </div>
    </div>
  );
};

export default Index;
