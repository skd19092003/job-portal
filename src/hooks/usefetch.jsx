import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = (cb, options = {}) => {

  // This custom hook is used to fetch data from an API
  // It takes a callback function (cb) that performs the fetch operation
  // and an optional options object that can contain additional parameters.
  // It returns an object with data, loading, error, and a function to call the fetch operation (fn).


  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
// What does loading do?
// loading is true when a fetch is in progress, and false when it’s done.
// You can use it in your component to show a loader/spinner while data is being fetched.

  const { session } = useSession();

  const fn = async (...args) => {
    // This function will be called to fetch data
    // It takes any number of arguments and passes them to the callback function (cb)
    // It will set the data state to the response from the callback function (cb)
 

    setLoading(true);
    // This sets the loading state to true, indicating that a fetch operation is in progress
    setError(null);

    try {
      const supabaseAccessToken = await session.getToken({
        template: "supabase",
      });
      const response = await cb(supabaseAccessToken, options, ...args);
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;



//why usefetch is needed 
// Great question!
// Your apiJobs.js file contains functions that fetch or update data from Supabase (like getSingleJob, updateHiringStatus).
// However, these functions are just plain async functions—they don’t manage loading state, errors, or automatically trigger re-renders in your React components.

// Why do you need the useFetch hook?
// State Management:
// useFetch manages the loading, error, and data state for you.
// It tells your component when data is loading, when it’s done, and if there was an error.

// Reactivity:
// When you call useFetch, it can automatically re-fetch data when dependencies change (like a job ID or user token), and it will re-render your component with the new data.
// Separation of Concerns:
// Your API functions only handle the API call.
// useFetch handles how and when to call them, and how to update your UI based on the result.

// Example
// loading: true/false, so you can show a spinner.
// data: the job data, once loaded.
// fn: a function to manually re-fetch (e.g., after updating hiring status).
// Summary
// API functions: Only fetch/update data.
// useFetch: Manages state, triggers re-renders, and makes your UI reactive and user-friendly.
// You need both:

// API functions to talk to Supabase.
// useFetch to make your React components work smoothly with async data.
