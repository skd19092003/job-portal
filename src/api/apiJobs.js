import supabaseClient from "@/utils/supabase";

//this __ means options={} ,not providing anything from the custom hook
// only token and ...args can be send thru function()

// Fetch Jobs
export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    //it would use foreign key relationships to fetch related data from the saved_jobs and companies tables.
    .select("*, saved: saved_jobs(id), company: companies(name,logo_url)");
 
  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  // Order by created_at in descending order (newest first)
  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}



// Save or Unsave Job
// This function will handle saving or unsaving a job based on the alreadySaved flag.
// It will either insert a new saved job or delete an existing one.
// The saveData object should contain the job_id and user_id.

// savedata will save into database the savedjob and alreadysaved will check whether the job is already saved or not
export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);
//this was saving the job to the database
  if(alreadySaved){
    const { data, error: deleteerror } = await supabase
     .from("saved_jobs")
     .delete().eq("job_id", saveData.job_id)

      if (deleteerror) {
    console.error("Error failed to delete saved job:", deleteerror);
    return null;}
  
    return data;
  }else{
    const { data, error:inserterror } = await supabase
     .from("saved_jobs")
     .insert([saveData])
     .select();

      if (inserterror) {
    console.error("Error failed to delete saved job:", inserterror);
    return null;}

     return data;

  }

}



// Fetch single job 
export async function getSingleJob(token,{job_id}) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("jobs").select("*,company:companies(name,logo_url), applications: applications(*)").eq("id",job_id).single();
  //here we are fetching the job details along with the company details and the applications details 
  //the applications work here is that it will fetch all the applications for a single job
  //  eq compoares jobs id and applicatin job id AND single fetches only one job

  if (error) {
    console.error("Error fetching jobs:", error);
    return null;
  }

  return data;
} 

//this was updating the hiring status of the job
export async function updateHiringStatus(token,{job_id}, isopen) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("jobs").update({isopen:isopen}).eq("id",job_id).single();
  if (error) {
    console.error("Error fetching jobs:", error);
    return null;
  }
 
  return data;
} 
//this __ means options={} ,not providing anything from the custom hook
// only token and ...args can be send thru function()


//this was creating the new job
export async function addNewJob(token, __ , jobData ) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("jobs")
  .insert([jobData])
  .select();
  
  if (error) {
    console.error("Error Creating Job:", error);
    return null;
  }

  return data;
} 

//this was fetching the saved jobs
export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo_url))");
//(*)only provides jobid and useriud so other things added
  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}

//this was fetching the my jobs
export async function getMyJobs(token, {user_id}) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", user_id);

//(*)only provides jobid and useriud so other things added
  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

  //this is for deleting the job
export async function deleteJob(token, {job_id}) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

//(*)only provides jobid and useriud so other things added
  if (error) {
    console.error("Error deleting Jobs:", error);
    return null;
  }
  return data;
}