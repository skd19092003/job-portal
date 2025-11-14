export async function getRemotiveJobs({ page = 1, limit = 10 } = {}) {
  const response = await fetch(`https://remotive.com/api/remote-jobs?limit=${limit}&page=${page}`);
  const data = await response.json();
  return data.jobs; // array of jobs
}
  