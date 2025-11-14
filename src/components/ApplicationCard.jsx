import {
  Boxes,
  BriefcaseBusiness,
  Download,
  Eye,
  Mail,
  School2Icon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { updateApplications } from "@/api/apiApplications";
import useFetch from "@/hooks/usefetch";
import { BarLoader } from "react-spinners";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const {  fn: fnHiringStatus, loading:loadingHiringStatus } = useFetch( updateApplications,{ job_id: application?.job_id } );
  const handleStatusChange = (status) =>{
    fnHiringStatus(status);
  }
  
  return (
    <Card>
        {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex items-center font-bold justify-between text-xl ">
          {isCandidate
            ? `${application.job.title} at ${application.job.company.name}`
            : application?.name}

          {/* <Eye size={18} className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer hover:opacity-25 " 
                onClick={() => window.open(application?.resume, "_blank")}/> */}
          {/* //alternate method */}

          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer hover:opacity-25 "
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      {/* flex-1 ensures each block takes equal width. */}
      <CardContent className="flex flex-col gap-4 flex-1">
        {/* Email section - only show for recruiters */}
        {!isCandidate && application?.email && (
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Mail size={16} className="text-blue-500" />
            <span className="text-sm font-medium truncate">{application.email}</span>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <BriefcaseBusiness size={15} />
            <span className="text-sm">{application?.experience} years of experience</span>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <School2Icon size={15} />
            <span className="text-sm">{application?.education}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Boxes size={15} />
            <span className="text-sm font-medium">Skills:</span>
          </div>
          <div className="text-sm break-words">{application?.skills}</div>
        </div>
        
        <hr />
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row  gap-y-2 justify-between">
        <span>{new Date(application?.created_at).toLocaleString()}</span>
       
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status: {application?.status}
          </span>
        ) : (
            //firstly create policy in update of application where we selected requestinguserid to  job recruiter id which is mstched applicstionjobid
          <Select  onValueChange={handleStatusChange} defaultValue={application?.status}>
          <SelectTrigger className="  text-slate-50 w-52">
            <SelectValue placeholder="Select Application Status" />
          </SelectTrigger>
          <SelectContent>
             {/* key is only used when mapping over an array */}
                  <SelectItem  value="applied">Applied</SelectItem>
                  <SelectItem  value="interviewing">Interviewing</SelectItem>
                  <SelectItem  value="hired">Hired</SelectItem>
                  <SelectItem  value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        )
        }

      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
