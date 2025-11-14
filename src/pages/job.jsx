import useFetch from "@/hooks/usefetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import { BarLoader } from "react-spinners";
import {
  Briefcase,
  DoorClosedLockedIcon,
  DoorOpenIcon,
  MapPin,
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {ApplyJobDrawer} from "@/components/apply-job";
import ApplicationCard from "@/components/ApplicationCard";


const Jobpage = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();
  // useparam is used for getting the url parameter
  //now usefetch an beused
  const {
    loading: loadingJob,
    data: job,
    fn: fnjob,
  } = useFetch(getSingleJob, { job_id: id }); //providing the job id as id from params get to equalise and give single job bck
  // loading comes from usefetch and in loadingJobz A boolean that is true while the job data is being fetched, and false when loading is done.
  // Use it to show a loading spinner or message while waiting for data.
  // job: The actual job data returned from your API (getSingleJob).
  // Use this to display the job details on the page.
  // fnjob: A function you can call to manually re-fetch the job data (for example, after an update or refresh).
  // Call fnjob() if you want to reload the job data.
  const {  fn: fnHiringStatus } = useFetch( updateHiringStatus,{ job_id: id } );
  //this is a custom hook

const handleHiringStatusChange = (value) => {
  const isopen = value === "open";
  fnHiringStatus(isopen).then(() => {
    fnjob();
  });
};

  useEffect(() => {
    if (isLoaded) {
      fnjob();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingJob) {
    return (
      <div className="flex w-full justify-center items-center py-10 min-h-[200px]">
        <BarLoader width="90%" color="#36d7b7" />
      </div>
    );
  }
  //kuch  bhi error aaye to return se pehle console.log krke deklhlena

  return (
    <div className="flex flex-col gap-7 mt-8 mx-7 lg:mr-12 lg:mt-2 ">
      <div className="flex flex-col-reverse gap-6 sm:flex-row justify-between items-center">
        <h1 className="gradient-title text-lg font-extrabold pb-3 sm:text-3xl lg:text-4xl">
          {job?.title} at {job?.company?.name}
        </h1>
        <img
          src={job?.company?.logo_url}
          alt={job?.company?.name}
          loading="lazy"
          className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
        />
        {job?.recruiter_id !== user?.id && (
          <ApplyJobDrawer job={job} user={user} fetchJob={fnjob} 
          applied={job?.applications?.find((app) => app.candidate_id === user.id)} />
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm md:text-base">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="flex-shrink-0" />
          <span className="truncate">{job?.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase size={16} className="flex-shrink-0" /> 
          <span>{job?.applications?.length} Applicants</span>
        </div>
        <div className="flex items-center gap-2">
          {job?.isopen === true ? (
            <>
              <DoorOpenIcon size={16} className="flex-shrink-0" />
              <span>Open</span>
            </>
          ) : (
            <>
              <DoorClosedLockedIcon size={16} className="flex-shrink-0" />
              <span>Closed</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span>Posted: {new Date(job?.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* hiring status */}
      {/* // will have to create a api jobs fpr this*/}
      {/* after api, use useFetch hook to run the api call when needed and getr the data and use it  */}
      {job?.recruiter_id === user?.id && (
        <Select  onValueChange={(value) => handleHiringStatusChange(value)}>
          <SelectTrigger className="border border-slate-300 focus:border-slate-500">
            <SelectValue placeholder={"Hiring Status" + ( job?.isopen ? " (open)" : " (closed)" ) } />
          </SelectTrigger>
          <SelectContent>
             {/* key is only used when mapping over an array */}
                  <SelectItem  value="open">Open</SelectItem>
                  <SelectItem  value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <div className="flex flex-col gap-y-6">
        <div className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold sm:text-2xl mb-3">About the job</h2>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap lg:w-full m-0 p-0">
            {job?.description}
          </p>
        </div>

        <div className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold sm:text-2xl mb-3">What we're looking for</h2>
          <div className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 lg:w-full m-0 p-0">
            <MDEditor.Markdown
              source={job?.requirements}
              className={"bg-transparent m-0 p-0 [&_ul]:pl-4 [&_ul]:ml-0 [&_ul]:list-inside [&_ul]:bg-transparent [&_ul]:m-0 [&_li]:mb-2 [&_li]:ml-0"}
            />
          </div>
        </div>
      </div>

     {/* /for recruiter view application */}
     {/* //job.applications aarha h due to getsinglejob mai data :job h and getsinglejob also takes data or compantyname url and application from other table and returns */}
     {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
      <div className="space-y-3 lg:space-y-7 flex flex-col">
        <h2 className="text-2xl font-bold sm:text-3xl "> Applications </h2>
          {job?.applications?.map((app) => {
            return  <ApplicationCard key={app.id} application={app} />
          }
          )}
        
      </div> )}  
      



    </div>
  );
};

export default Jobpage;
