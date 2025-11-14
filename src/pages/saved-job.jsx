import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/jobcard";
import useFetch from "@/hooks/usefetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10 lg:mb-8 lg:mt-0">
        <h2 className="gradient-title text-4xl font-extrabold   sm:text-5xl lg:text-7xl">
          Saved Jobs
        </h2>

      {loadingSavedJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
          {savedJobs?.length ? (
            savedJobs?.map((saved) => {
              return (
                <JobCard
                  key={saved.id}
                  job={saved?.job}
                  //remember in api getsavedjob we use job inside job: jobs(*, company: companies(name,logo_url))
                  //so we can access the job and company name and logo url and description 
                  //so job is equals to saved?.job ==== the savedtable jobs with reference to job data
                  onJobSaved={fnSavedJobs}
                  //onjobaction is the function to update the saved jobs
                  //fnsavedjobs will update the saved jobs and runs hook to get data again
                  savedInit={true}
                />
              );
            })
          ) : (
            <div className="text-center text-2xl font-bold flex justify-center items-center w-[99vw]">No Saved Jobs 👀</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;