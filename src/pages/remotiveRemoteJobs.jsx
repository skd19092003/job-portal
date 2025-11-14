import React, { useEffect, useState } from "react";
import { getRemotiveJobs } from "@/api/apiRemotive";
import RemoteJobCard from "@/components/remoteJobCard";
import { BarLoader } from "react-spinners";
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import pagination components
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";

const RemotiveRemoteJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");

// Pagination state
const [currentPage, setCurrentPage] = useState(1);
const [jobsPerPage] = useState(9);


//   User A visits → API call to Remotive → Cache stored in User A's browser
// User A visits again → Uses cached data → No API call
  useEffect(() => {
    const cache = localStorage.getItem('remotiveJobs');
    const cacheTime = localStorage.getItem('remotiveJobsTime');
    const now = Date.now();

    // 6 hours in milliseconds
    const maxAge = 6 * 60 * 60 * 1000;

    if (cache && cacheTime && now - cacheTime < maxAge) {
      const cachedJobs = JSON.parse(cache);
      setJobs(cachedJobs);
      setFilteredJobs(cachedJobs);
      setLoading(false);
    } else {
      getRemotiveJobs({ page: 1, limit: 120 }).then((data) => {
        setJobs(data);
        setFilteredJobs(data);
        setLoading(false);
        localStorage.setItem('remotiveJobs', JSON.stringify(data));
        localStorage.setItem('remotiveJobsTime', now);
      });
    }
  }, []);



    // Calculate pagination values
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  
    // Reset to first page when search changes
    useEffect(() => {
      setCurrentPage(1);
    }, [searchQuery]);
  
    // Handle page changes
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
      // Generate page numbers for smart pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    return pages;
  };

  








  // Filter jobs based on search query and filters
  useEffect(() => {
    let filtered = jobs;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "") {
      filtered = filtered.filter(job => job.category === categoryFilter);
    }

    // Apply location filter
    if (locationFilter !== "") {
      if (locationFilter === "Worldwide") {
        filtered = filtered.filter(job => 
          job.candidate_required_location && 
          job.candidate_required_location.toLowerCase().includes("worldwide")
        );
      } else if (locationFilter === "US Only") {
        filtered = filtered.filter(job => 
          job.candidate_required_location && 
          (job.candidate_required_location.toLowerCase().includes("us") || 
           job.candidate_required_location.toLowerCase().includes("united states") ||
           job.candidate_required_location.toLowerCase().includes("america"))
        );
      } else if (locationFilter === "Europe Only") {
        filtered = filtered.filter(job => 
          job.candidate_required_location && 
          job.candidate_required_location.toLowerCase().includes("europe")
        );
      } else if (locationFilter === "India Only") {
        filtered = filtered.filter(job => 
          job.candidate_required_location && 
          job.candidate_required_location.toLowerCase().includes("india")
        );
      }
    }

    // Apply salary filter
    if (salaryFilter !== "") {
      filtered = filtered.filter(job => {
        if (salaryFilter === "Not Specified") {
          return !job.salary || job.salary === "";
        } 
        
        const salary = job.salary?.toLowerCase() || "";
        
        if (salaryFilter === "Hourly Jobs") {
          return salary.includes("/hour") || salary.includes("hour");
        } else if (salaryFilter === "Under $50k Annual") {
          // Check if it's annual (no /hour) and under 50k
          if (salary.includes("/hour") || salary.includes("hour")) return false;
          const match = salary.match(/\$(\d+)k/);
          return match && parseInt(match[1]) < 50;
        } else if (salaryFilter === "$50k-$100k Annual") {
          if (salary.includes("/hour") || salary.includes("hour")) return false;
          const match = salary.match(/\$(\d+)k/);
          return match && parseInt(match[1]) >= 50 && parseInt(match[1]) <= 100;
        } else if (salaryFilter === "Above $100k Annual") {
          if (salary.includes("/hour") || salary.includes("hour")) return false;
          const match = salary.match(/\$(\d+)k/);
          return match && parseInt(match[1]) > 100;
        }
        return true;
      });
    }

    setFilteredJobs(filtered);
  }, [searchQuery, jobs, categoryFilter, locationFilter, salaryFilter]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearAllFilters = () => {
    setCategoryFilter("");
    setLocationFilter("");
    setSalaryFilter("");
    setSearchQuery("");
  };

  // Get unique categories from jobs
  const getUniqueCategories = () => {
    const categories = jobs.map(job => job.category).filter(Boolean);
    return [...new Set(categories)].sort();
  };

  if (loading) return <BarLoader width="100%" color="#36d7b7" className="mt-10" />;

  return (
    <div className="flex flex-col gap-6 items-center justify-center mt-10 lg:mb-8 lg:mt-0 w-full max-w-full overflow-hidden">
      <h2 className="gradient-title text-4xl font-extrabold   sm:text-5xl lg:text-7xl">
        Remote Jobs 
      </h2>
      <div className="text-gray-300 text-sm sm:text-lg lg:text-xl text-center px-4 max-w-4xl">
        <span>Find the latest remote jobs sourced from</span>
        <Link 
          to="https://remotive.com" 
          target="_blank" 
          className="text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md mx-1 hover:bg-blue-500/50 inline-block whitespace-nowrap"
        >
          Remotive.com
        </Link>
      </div>
      
      {/* Filters Section */}
      <div className="flex flex-col gap-3 w-full max-w-6xl px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {getUniqueCategories().map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location Filter */}
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Worldwide">Worldwide</SelectItem>
              <SelectItem value="US Only">US Only</SelectItem>
              <SelectItem value="Europe Only">Europe Only</SelectItem>
              <SelectItem value="India Only">India Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Salary Filter */}
          <Select value={salaryFilter} onValueChange={setSalaryFilter}>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Salary Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not Specified">Not Specified</SelectItem>
              <SelectItem value="Hourly Jobs">Hourly Jobs</SelectItem>
              <SelectItem value="Under $50k Annual">Under $50k Annual</SelectItem>
              <SelectItem value="$50k-$100k Annual">$50k - $100k Annual</SelectItem>
              <SelectItem value="Above $100k Annual">Above $100k Annual</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear All Filters Button - Always visible */}
          <Button 
            variant="outline" 
            onClick={clearAllFilters} 
            className="h-9 text-sm"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    
      {/* Search Filter */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl px-4 justify-center">
        <Input
          type="text"
          placeholder="Search by job title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 h-9 text-sm"
        />
        <Button
          variant="outline"
          onClick={clearSearch}
          className="sm:w-auto h-9 text-sm"
        >
          Clear Search
        </Button>
      </div>

      {/* Results count */}
      {(searchQuery || categoryFilter || locationFilter || salaryFilter) && (
        <div className="text-gray-400 text-sm text-center">
          Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} 
          {searchQuery && ` matching "${searchQuery}"`}
          {(categoryFilter || locationFilter || salaryFilter) && " with applied filters"}
        </div>
      )}
    
       {/* Display current page jobs */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4 max-w-full">
        {currentJobs.map((job) => (
          <RemoteJobCard
            key={job.id}
            job={{
              id: job.id,
              title: job.title,
              description: job.description,
              company: {
                name: job.company_name,
              },
              candidate_required_location: job.candidate_required_location,
              external_url: job.url,
              salary: job.salary,
              publication_date: job.publication_date,
              category: job.category,
              company_logo: job.company_logo,
            }}
          />
        ))}
      </div>
       {/* Pagination component */}
       {totalPages > 1 && (
        <div className="flex justify-center mt-8 mb-8 w-full px-4">
          <div className="w-full max-w-full overflow-x-auto">
            <Pagination className="w-full">
              <PaginationContent className="flex-wrap justify-center">
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {currentPage < totalPages - 3 && totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                  <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      {/* Page info */}
      {filteredJobs.length > 0 && (
        <div className="text-center text-gray-400 text-sm mb-4">
          Showing {indexOfFirstJob + 1} to {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
        </div>
      )}

      {/* No results message */}
      {filteredJobs.length === 0 && searchQuery && (
        <div className="text-gray-400 text-center py-8">
          No jobs found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
};

export default RemotiveRemoteJobs;