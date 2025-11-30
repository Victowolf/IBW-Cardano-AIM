import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface JobFiltersProps {
  onSearch: (filters: FilterValues) => void;
}

export interface FilterValues {
  keyword: string;
  location: string;
  team: string;
  experienceLevel: string;
  workType: string;
}

export const JobFilters = ({ onSearch }: JobFiltersProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    keyword: "",
    location: "",
    team: "",
    experienceLevel: "",
    workType: "",
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="bg-background border rounded-lg p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="keyword">Search jobs by keyword</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="keyword"
            placeholder="Type in to search jobs"
            className="pl-10"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="bucharest">Bucharest, Romania</SelectItem>
              <SelectItem value="manila">Manila, Philippines</SelectItem>
              <SelectItem value="hong-kong">Hong Kong</SelectItem>
              <SelectItem value="new-york">New York, USA</SelectItem>
              <SelectItem value="london">London, UK</SelectItem>
              <SelectItem value="singapore">Singapore</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="team">Team</Label>
          <Select value={filters.team} onValueChange={(value) => setFilters({ ...filters, team: value })}>
            <SelectTrigger id="team">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="software-engineering">Software Engineering</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="data-science">Data Science</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="product">Product Management</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Experience level</Label>
          <Select value={filters.experienceLevel} onValueChange={(value) => setFilters({ ...filters, experienceLevel: value })}>
            <SelectTrigger id="experience">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="senior">Senior Professional</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="worktype">Hybrid and remote jobs</Label>
          <Select value={filters.workType} onValueChange={(value) => setFilters({ ...filters, workType: value })}>
            <SelectTrigger id="worktype">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Work Types</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="onsite">On-site</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleSearch} className="w-full md:w-auto">
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </div>
  );
};
