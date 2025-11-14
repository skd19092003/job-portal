import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader className="my-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10 lg:mb-8 lg:mt-0">
        <h2 className="gradient-title text-4xl font-extrabold   sm:text-5xl lg:text-7xl ">
        {user?.unsafeMetadata?.role === "candidate"
          ? "My Applications"
          : "My Created Jobs"}
      </h2>
      {user?.unsafeMetadata?.role === "candidate" ? (
        <CreatedApplications />
      ) : (
        <CreatedJobs />
      )}
    </div>
  );
};

export default MyJobs;