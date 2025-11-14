import supabaseClient, { supabaseUrl } from "./../utils/supabase";
//this __ means options={} ,not providing anything from the custom hook
// only token and ...args can be send thru function()


// Fetch Companies
export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  //upload resume
  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`
  //zthis is how we store data in supabase
  const { error: resumeError } = await supabase.storage.from('resumes').upload(fileName, jobData.resume);

  if (resumeError) {
    console.error("Error uploading resume:", resumeError);
    return null;
  }

  //generally yahi path banta h precheck krke pta lagaya thru companylogourl so creating this
  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName} `
  const { data, error } = await supabase.from("applications").insert([{ ...jobData, resume: resume }])
    .select("*");

  if (error) {
    console.error("Error Submitting Application:", error);
    return null;
  }

  return data;
}

//firstly create policy in update of application where we selected requestinguserid to  job recruiter id which is matched with application-jobid who posted it
// here to fetch and update it
export async function updateApplications(token, { job_id }, status) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("applications")
    .update({ status: status }).eq("job_id", job_id).select();

  if (error || data.length === 0) {
    console.error("Error updating Application:", error);
    return null;
  }

  return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("applications")
  //bcoz user_id is stores as candidate id in table applicaitons
  .select("*, job: jobs(*, company: companies(name,logo_url))")
  .eq("candidate_id", user_id)

  if (error) {
    console.error("Error fetching Application:", error);
    return null;
  }
  
  return data;
}


// The ...jobData syntax is called the spread operator in JavaScript.
// In this context:
// It means:
// Take all the key-value pairs from the jobData object and copy them into a new object.
// Then, add or overwrite the resume property with the value of resume.
// So, if jobData is:{ candidate_id: 1, job_id: 2 }
//result will be { candidate_id: 1, job_id: 2, resume: resume }