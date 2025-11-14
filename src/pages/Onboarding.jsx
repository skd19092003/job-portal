import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners'; //importing barloader for loading state
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const {user,isLoaded} = useUser();  
  //install npm i react-spinners for loading state
  //instead of daving it in another table at supabase for user that will be repeating as already clerk has one user storing so do it in clerk property 
  //by storing in metadata property of clerk user
  const navigate = useNavigate();
  const handleroleselection   = async(role) => {
    await user.update({
      unsafeMetadata: {role},
    }).then(() => {
      navigate(role === "recruiter"? "/post-job" : "/job-listing");
    }).catch((error) =>{
      console.error("Error updating user metadata:", error);    
    })
  };

  //user should not be able to change role once selected so we can use clerk hooks to check if user is already onboarded or not
useEffect(() => {
  if(user?.unsafeMetadata.role) {
   navigate(
    user?.unsafeMetadata.role === "recruiter"? "/post-job" : "/job-listing");
  }}, 
 ),[user]
 //so onbording is selected you cant visit onboard anymore you willbe redirect based on your role to job-listing or post-job page and only work if user is chsnged
  


  if(!isLoaded) {
    return <BarLoader className="mb-4 mt-4 lg:mt-0" width={"100%"} color="#36d7b7"  />
  }


  return (
    <div className='min-h-screen w-full flex flex-col items-center '>
      <h2 className=' gradient-title text-[20px] sm:text-[50px] lg:text-[69px] font-extrabold  mt-12'>
      Welcome {user.firstName} to HIRELY!
    </h2>
      <h3 className='gradient-title text-[16px] sm:text-[40px]   lg:text-[49px] font-bold '>
         Choose your role to continue...
    </h3>
    <div className='flex  mt-14   gap-4 sm:flex-row justify-evenly'>
      
                <Button
                 variant="green" 
                 className="p-5 text:xl sm:p-16 sm:text-2xl lg:px-20 " 
                 onClick={() => {handleroleselection("candidate")}}>
                  CANDIDATE
                  </Button>

                <Button 
                variant="ghostblue"
                 className="p-5 text:xl sm:p-16 sm:text-2xl lg:px-20"
                 onClick={() => {handleroleselection("recruiter")}}>
                  RECRUITER</Button>
            
    </div>
    </div>
  )
}
export default Onboarding