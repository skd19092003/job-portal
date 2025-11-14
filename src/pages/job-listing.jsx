import { getJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/usefetch";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/jobcard";
import { getCompanies } from "@/api/apiCompanies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { State } from "country-state-city";

import { useNavigate } from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
//so jobcard is withut curly braces because it is a default export in jobcard.jsx
//if it was a named export const jobcard = {} then we would have to use curly braces like {JobCard}
//because There can be only one default export per file.
// You can name the import whatever you want (but usually match the original name for clarity).

const Joblisting = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded, user } = useUser();
  //useNavigate is used to navigate to the remotiveRemoteJobs page
  const navigate = useNavigate();

  //for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);

  // const {session} = useSession();
  // //session is used to get the user data from clerk basically the token of the user

  // const  fetchjobs = async ()=>{
  //   const supabaseAccessToken = await session?.getToken({
  //     template: 'supabase',
  //   });
  //   const data =  await getJobs(supabaseAccessToken)
  //   console.log("Jobs data:", data);

  //instead of doing  the above thing repreatedly we can create a custom hook to fetch the jobs and use it in the component
  const {
    fn: fnjobs,
    data: jobs,
    loading: loadingjobs,
  } = useFetch(getJobs, { location, company_id, searchQuery });
  // This will fetch the jobs data from the api and store it in the jobs variable
  //fnjobs unllike fncompanies will be called every time the component is re-rendered because we are passing dependencies to the useFetch hook
  //the data will be stored in the jobs variable and we can use it to display the jobs
  //fnjobs is a function that will be called to fetch the jobs data from the api
  //useeffect hook is used to call the fnjobs function when the component is mounted or when the dependencies change

  //useEffect hook is used to fetch the jobs from the api when the component is mounted
  useEffect(() => {
    if (isLoaded) fnjobs();
    // This will call the fnjobs function to fetch jobs when the component mounts
    // The empty dependency array ensures this runs only once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, company_id, searchQuery]);

  const { fn: fnCompanies, data: Companies } = useFetch(getCompanies);
  // This will fetch the companies data from the api and store it in the Companies variable
  // We can use this data to filter the jobs based on the company
  //the data will be stored in the Companies variable and we can use it to filter the jobs based on the company
  //mounted means when the component is rendered for the first time AND fncompanies will be called only once when the component is mounted because we are not passing any dependencies to the useFetch hook
  //the useeffect hook is used to call the fnCompanies function when the component is mounted
  useEffect(() => {
    if (isLoaded) fnCompanies();
    // This will call the fnCompanies function to fetch companies when the component mounts
    // The empty dependency array ensures this runs only once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  //now the handle search buton which could have been done already done with onchange
  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   let formdata = new FormData(e.target);
  //   const query = formdata.get('search-query');
  //   if(query){
  //     setSearchQuery(query);
  //   }
  // }

  // Calculate pagination values
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs?.slice(indexOfFirstJob, indexOfLastJob) || [];
  const totalPages = Math.ceil((jobs?.length || 0) / jobsPerPage);
  //for pagination
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, location, company_id]);
  // Handle page changes and auto scroll to top
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


  //for clearing the filters
  const clearfilters = () => {
    setLocation("");
    setCompany_id("");
  };
  const clearfilterssearch = () => {
    setSearchQuery("");
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   fnjobs();
  // };
  //another way to filter the jobs was by adding a button with onclick event to add this function

  if (!isLoaded) {
    return (
      //this ones for loading jobs previous one was for user loading
      <div className="flex w-full justify-center items-center py-10 min-h-[200px]">
        <BarLoader width="90%" color="#36d7b7" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-10 lg:mb-8 lg:mt-0">
        <h2 className="gradient-title text-4xl font-extrabold   sm:text-5xl lg:text-7xl">
          Latest Jobs
        </h2>

        <Button
          variant="blue"
          onClick={() => navigate("/remotiveRemoteJobs")}
          className="mt-7 p-6 "
        >
          Show Remote Jobs
        </Button>

      </div>

      <form className="m-5 flex flex-row gap-5 ">
        <Input
          type="text"
          placeholder="Search by Title.."
          name={searchQuery}
          value={searchQuery}
          className="h-full flex-1 px-4   text-md border-slate-400"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="blue"
          type="button"
          onClick={() => clearfilterssearch()}
          className="text-base p-[20px] "
        >
          Clear
        </Button>
      </form>
      {/*this thing could also be done by usinng a button with input and fn handlesearch  */}
      {/* <form onSubmit={handleSearch} className='flex'>
      <Input type="text" placeholder="Search by Title.." name="search-query" className=" h-full px-4 m-2 text-md"/>
     <Button variant ="green" type="submit" className="h-full sm:w-28  m-2">Search</Button>
      </form> */}

      <div className="flex flex-col sm:flex-row gap-5 m-5  ">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="border border-slate-300 focus:border-slate-500">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map((State) => {
                return (
                  <SelectItem key={State.name} value={State.name}>
                    {" "}
                    {State.name}{" "}
                  </SelectItem>
                );
              })}
            </SelectGroup> 
          </SelectContent>
        </Select>

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger className="border border-slate-300 focus:border-slate-500">
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {(Companies ?? []).map(({ id, name }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
              {/*Problem
In your component, you use company_Id (with an underscore and capital "I").
In your API (getJobs), you probably expect companyId (camelCase) This mismatch means your API never receives the company filter, so jobs are never filtered by company. 
Use (Companies ?? []) instead of Companies when mapping.
This prevents the .map error and allows your jobs filtering to work. f Companies is undefined (for example, before the data loads), .map will throw an error. */}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="blue"
          onClick={() => clearfilters()}
          className="text-base p-[20px] "
        >
          Clear
        </Button>
      </div>

      {loadingjobs && (
        <div className="flex w-full justify-center items-center py-10 min-h-[200px]">
          <BarLoader width="90%" color="#36d7b7" />
        </div>
      )}
      {/* for loading jobs */}


      {loadingjobs === false && (
        <>
          {/* Display current page jobs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full px-2">
            {currentJobs.length ? (
              currentJobs.map((job) => {
                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    savedInit={job?.saved?.length > 0}
                    isMyJob={job?.recruiter_id === user?.id}
                    onJobSaved={fnjobs}
                  />
                );
              })
            ) : (
              <div className="mx-5">No jobs found.</div>
            )}
          </div>
          {/* Pagination component */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 mb-8">
              <Pagination>
                <PaginationContent>
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
          )}
      {/* Page info */}
      {jobs?.length > 0 && (
            <div className="text-center text-gray-400 text-sm mb-4">
              Showing {indexOfFirstJob + 1} to {Math.min(indexOfLastJob, jobs.length)} of {jobs.length} jobs
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Joblisting;