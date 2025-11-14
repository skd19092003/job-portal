import supabaseClient, { supabaseUrl } from "./../utils/supabase";

//this __ means options={} ,not providing anything from the custom hook
// only token and ...args can be send thru function()

 
// Fetch Companies
export async function getCompanies(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error fetching Companies:", error);
    return null;
  }

  return data;
}
export async function addNewCompany(token, __, companyData) {
  const supabase = await supabaseClient(token);

  //this is for uploading company logo to storage bucket
  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;
  //zthis is how we store data in supabase storage bucket
  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName,companyData.logo);

  if (storageError) {
    console.error("Error uploading Company Logo:", storageError);
    return null;
  }
  //generally yahi path banta h precheck krke pta lagaya thru companylogourl so creating this
  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName} `;
  //now upload the company
  const { data, error } = await supabase.from("companies")
  .insert([{
     name: companyData.name,
     logo_url: logo_url
    }]).select();

  if (error) {
    console.error("Error adding Companies:", error);
    return error;
  }

  return data;
}
