import { useUser } from '@clerk/clerk-react'

import React  from 'react'
import { Card, CardFooter, CardTitle } from './ui/card'
import { CardHeader } from '@/components/ui/card';
import { Heart, MapPin, Trash2Icon } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom'
import { Button } from './ui/button';
import useFetch from '@/hooks/usefetch';
import { saveJob } from '@/api/apiJobs';
import { useState, useEffect } from 'react';
import { deleteJob } from '@/api/apiJobs';
import { BarLoader } from 'react-spinners';




//curly braces are used to destructure the job object passed as a prop 
//     Why use destructuring?
// Cleaner and shorter code: You can use job directly instead of props.job.

// Function to format date as dd.mm.yy
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
};

const JobCard = ({
    job,
    isMyJob = false, //this prop is used to check whether the job is posted by the current user or not which means hes the recruiter or not
    savedInit = false, //this prop is used to check whether the job is saved or not
    onJobSaved = () => { }, //what function will be perfomred when the job is saved
}) => {
    const [saved, setSaved] = useState(savedInit);

    const { fn: fnsavedJob, data: savedJob, loading: loadingSavedJob } = useFetch(saveJob, { alreadySaved: saved });
    //alreadySaved is an option that will be passed to the saveJob api
    
    

    //here we are using useFetch to create a function fnsavedJob that will call the saveJob api
    //and we are passing the job id and user id to the api to save the job for the user
    //the data returned from the api will be saved in the savedJob variable and loadingSavedJob
    const { user } = useUser();
    const handleSaveJob = async () => {
        await fnsavedJob({ user_id: user.id, job_id: job.id });
        
        onJobSaved();
        //onJobSaved is the function that will be called when the job is saved
        //it will be passed as a prop to the JobCard component
        //it will be used to update the UI or perform any other action after the job is saved

        
        //this will call the onJobSaved function passed as a prop to the JobCard component
        //this function can be used to update the UI or perform any other action after the job
    };
    //handleSaveJob is a function that will be called when the user clicks on the save job button
    //it will call the fnsavedJob function which will call the saveJob api with
    //the user id and job id to save the job for the user

    const {fn: fnDeleteJob, loading: loadingDeleteJob } = useFetch(deleteJob, {job_id: job.id});
    const handleDeleteJob = async () => {
        await fnDeleteJob({ job_id: job.id });
        onJobSaved();
        //onjobsaved is a function that will be called when the job is deleted
        //it used for delete and also saved
    };
     
    useEffect(() => {
        // This useEffect will run whenever the savedJob changes
        if (savedJob !== undefined) {
            //this will check if the savedJob is not undefined
            //if the savedJob is undefined then it means the job is not saved
            //if the savedJob is not undefined then it means the job is saved
            //so we will set the saved state to true or false based on the length of the savedJob array
            setSaved(savedJob?.length > 0);
            // This will update the saved state based on the length of the savedJob array
            // If savedJob has items, set saved to true; otherwise, set it to false
            // This is useful to reflect the saved state in the UI
            // This will also trigger a re-render of the component to reflect the updated saved state
        }
    }, [savedJob]);







    return (
        <Card className="flex flex-col justify-between mx-3">
            {loadingDeleteJob && <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />}
            {/* //this get disabled once trash icon complete its process , time between clicking trashicon and delete */}
            <CardHeader>
                <CardTitle className="flex justify-between font-bold text-xl" >
                    {job.title}
                    {isMyJob && (
                        <Trash2Icon
                         fill="grey"
                          size={28}
                           className='text-white cursor-pointer'
                           onClick={handleDeleteJob}
                           disabled={loadingDeleteJob}
                           />
                    )}

                </CardTitle>
            </CardHeader>

            <CardContent>
                {/* First row: Company logo and name */}
                <div className='flex justify-between items-center gap-2 mb-3'>
                    {job.company && (
                        <>
                            <img src={job.company.logo_url} alt={job.company.name} loading="lazy" className="max-h-6 lg:h-6 flex-shrink-0 max-w-[100px]" />
                            <span className="text-lg lg:text-sm font-medium truncate">{job.company.name}</span>
                        </>
                    )}
                </div>
                
                {/* Second row: Location and Posted date - 50/50 split */}
                <div className='flex items-center mb-3 gap-2'>
                    <div className='flex items-center gap-1 text-xs lg:text-sm text-gray-50 w-1/2'>
                        <MapPin size={14} className="flex-shrink-0" /> 
                        <span className="truncate">{job.location || 'Remote'}</span>
                    </div>
                    <div className='text-xs lg:text-sm text-gray-50 font-medium w-1/2 text-right'>
                        Posted: {formatDate(job.created_at)}
                    </div>
                </div>
                
                <hr className="border-t-2 border-white my-5 p-0" />
                {job.description.split(' ').slice(0, 15).join(' ') + '...'}
                 
            </CardContent>

            <CardFooter className="flex gap-7">
                <Link to={`/job/${job.id}`} className="w-full ">
                    <Button variant="green" className="w-full rounded-b-lg p-4">
                        More Details
                    </Button>
                </Link>

                {/* // If the job is not posted by the current user, show the save/unsave button
                // If the job is posted by the current user, do not show the save/unsave button
                // This is to prevent the user from saving their own job */}
                {!isMyJob && (
                    <Button
                        variant=""
                        className="p-4 rounded-b-lg"
                        onClick={handleSaveJob}
                        disabled={loadingSavedJob}
                    >
                        {saved ? (
                            <Heart size={28} fill='red' stroke='red' className='cursor-pointer' />)
                            : (
                                <Heart size={28} stroke='black' className='cursor-pointer' />
                            )
                        }
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
//for saved job create  a policies in supabase to allow only the user to save itfor current user using reuresting_user_id to save or unsave for them only , for jobs and companies policies auth user is eno8ugh for all user to see the job and company details
//create a api savedjob to fetch and store
export default JobCard