import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignIn,
  UserButton,
  SignUp,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox, HouseIcon, Joystick, House } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
// useUser is a hook that provides information about the currently signed-in user, such as their profile and authentication status.

window.openGuestAccessModal = () => { };
//this is used to open the guest access modal
//for interview react context or global sstate manager could aklso be used

const Header = () => {
  //this is used to open the guest access modal
  //for interview react context or global sstate manager could aklso be used

  //for preventing candidate to visit postjob .
  const { user } = useUser();

  //to create a modal for login and signup instead of new page would be use state
  const [showsignin, setshowsignin] = useState(false);
  //for demo account
  const [showsignin2, setshowsignin2] = useState(false);
  //signup
  const [showsignup3, setshowsignup3] = useState(false);

  //to hide guestaccess and only provide it in url
  const [search2] = useSearchParams();
  const showGuestButton = search2.get("recruiter") === "true"; //it gets true which will make button visible
  useEffect(() => {
    window.openGuestAccessModal = () => setshowsignin2(true);
  }, []);
  //this useeffect is used to make the buttons in landing page to open the guest access modal instead of normal signup

  
  const [search, setsearch] = useSearchParams();
  // useSearchParams is a hook that allows you to read and modify the query parameters in the URL.
  useEffect(() => {
    if (search.get("sign-in")) {
      setshowsignin(true);
      //this is when we we are not login and tey to visit other pages
    }
  }, [search]);
  

  const navigate = useNavigate();
  //use navigate is a hook from react-router-dom that allows us to programmatically navigate to different routes in our application.
  useEffect(() => {
    // If user is logged in and recruiter=true is in the URL, redirect to homepage without params
    if (user && search.get("recruiter") === "true") {
      navigate("/", { replace: true });
    }
  }, [user, search, navigate]);


  const handleoverlayclick = (e) => {
    //currenttarget is the div on which onclick is present and target is where we clicked
    if (e.target === e.currentTarget) {
      setshowsignin(false);
      setshowsignin2(false);
      setshowsignup3(false);
      // Preserve recruiter param if present
      const recruiter = search.get("recruiter");
      const newParams = {};
      if (recruiter) newParams.recruiter = recruiter;
      //if there is no recruiter true then set search will get empty and modal closes
      setsearch(newParams);
      //here we are preserving the recruiter param if present by adding it to the newParams object and setting the search params to the newParams object
    }
  }; //to preserve the guess acces button even after clicking on sign in and signup wrongly

  return (
    <>
      <nav className="mt-5 ml-1 sm:ml-3 sm:p-4  sm:m-5 flex justify-between items-center">
        <Link
          to="/"
          className="bg-slate-300 hover:bg-slate-700 rounded-lg p-2 gap-x-2 px-4 flex items-center justify-center sm:gap-5"
        >
          <img src="/logo.png" className="h-7 sm:h-10 lg:h-12" alt="Logo" />
          <span className="text-[15px] sm:text-[20px] md:text-[20px] lg:text-2xl font-bold text-slate-900 flex flex-row justify-center items-center">
            <HouseIcon size={20} />
          </span>
        </Link>

        <div className="flex  pr-1 sm:pr-3 sm:gap-5 md:gap-8  sm:flex-row">
          <SignedOut>
            {showGuestButton && (
              <Button
                variant="outline"
                onClick={() => {
                  setshowsignin2(true);
                }}
                className="text-[12px] p-2 sm:text-[14px] md:text-[15px] lg:text-[20px] font-semibold text-white bg-green-700  hover:bg-green-800 py-6  md-px-6"
              >
                Guest Access
              </Button>
            )}

            <Button
              variant="gray"
              onClick={() => setshowsignup3(true)}
              className="text-[12px] p-2 sm:text-[14px]  md:text-[15px] lg:text-[20px] py-6 font-semibold md:px-6"
            >
              Signup
            </Button>
            <Button
              variant="blue"
              onClick={() => setshowsignin(true)}
              className="text-[12px] p-2 sm:text-[14px] md:text-[15px] lg:text-[20px]  py-6 font-semibold md:px-6"
            >
              Login
            </Button>
          </SignedOut>

          <SignedIn>
            {/* //add a c0nditional  post job button using the optional chaining */}
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button
                  variant="blue"
                  className="text-[12px] p-2 sm:text-[14px]  md:text-[15px] lg:text-[20px] bg-blue-900 text-white hover:bg-blue-400 py-6 font-semibold  md:px-6"
                >
                  <PenBox size={20} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            )}

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            >
              <UserButton.MenuItems>
                {user?.unsafeMetadata?.role === "recruiter" && (<UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />)}
                {user?.unsafeMetadata?.role === "candidate" && (<UserButton.Link
                  label="My Applications"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />)}
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} fill="red" />}
                  href="/saved-job"
                />
                <UserButton.Link
                  label="Job Listings"
                  labelIcon={<House size={15} />}
                  href="/job-listing"
                />
                <UserButton.Link
                  label="Remote Job Listings"
                  labelIcon={<House size={15} />}
                  href="/remotiveRemoteJobs"
                />
                {user?.unsafeMetadata?.role === "recruiter" && (<UserButton.Link
                  label="Post a Job (For Recruiters)"
                  labelIcon={<PenBox size={15} />}
                  href={user?.unsafeMetadata?.role === "recruiter" ? "/post-job" : "/job-listing"}
                />)}
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>
 
      {/* fixed: The element is positioned fixed relative to the viewport (stays in place when scrolling).
inset-0: Sets top: 0; right: 0; bottom: 0; left: 0; — It makes the element stretch to cover the entire parent (or screen, if fixed or absolute), touching all edges.
bg-black/50: Sets the background color to black with 50% opacity (a semi-transparent black overlay).
z-50: Sets a high z-index (50), so the element appears above most other conten */}
      {/* //login button modal */}
      {showsignin && (
        <div
          //ok so this is the outside area of modal which we can click and disappear the modal
          className="fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={handleoverlayclick}
        >
          {/* simple onlcick div par lagNE SE due to inset pure screen se kahi bhii click krne par band hoga will not be able to use handle signin email google github button so use a function handleoverlay*/}
          <SignIn
            //signin ke baad force krega to onboarding page pe
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
      {/* //signup button modal */}
      {showsignup3 && (
        <div
          //ok so this is the outside area of modal which we can click and disappear the modal
          className="fixed top-0  right-0 bottom-0 left-0 bg-black/50 z-50 flex items-center justify-center "
          onClick={handleoverlayclick}
        >

          {/* simple onlcick div par lagNE SE due to inset pure screen se kahi bhii click krne par band hoga will not be able to use handle signin email google github button so use a function handleoverlay*/}
          <SignUp
            appearance={{
              elements: {
                card: "p-1 pt-6", // tightest padding for modal
                formField: "mb-1", // reduce space between fields
                formFieldLabel: "text-[8px] mb-0 pb-0", // smallest label, no margin/padding
                formFieldInput: "text-[8px] py-1 px-2", // smallest input
                formButtonPrimary: "text-[8px] py-1 px-2 mt-1", // smallest button, tight top margin
                headerTitle: "text-xs mb-1", // smallest title, tight bottom margin
                headerSubtitle: "text-[8px] mb-1", // smallest subtitle, tight bottom margin
                footerAction: "text-[8px] mt-1", // smallest footer, tight top margin
                socialButtonsBlockButton: "text-[8px] py-1 px-2 mb-1", // smallest social button, tight bottom margin
                dividerText: "text-[8px] my-1", // smallest divider, tight vertical margin
              },
            }}
            //signin ke baad force krega to onboarding page pe
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>

      )}
      {/* //guest access modal */}
      {showsignin2 && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={handleoverlayclick}
        >

          <div
            className="fixed top-2 right-2 z-[999] bg-white text-black rounded shadow-lg w-[50vw] max-w-xs p-2sm:w-[320px] sm:max-w-sm sm:p-3lg:w-[400px] lg:max-w-md lg:p-6 flex flex-col items-center justify-center"
          >
            <div className="font-bold mb-1 text-xs sm:text-base lg:text-2xl text-center">
              Demo Account
            </div>

            <div className="bg-slate-200 p-1 sm:p-2 mb-2 rounded flex flex-col items-center justify-center w-[161px] sm:w-full">
              <p className="font-extrabold py-1 text-[10px] sm:text-xs lg:text-base text-center">
                -USE THIS if your ROLE= JOB SEEKER
              </p>
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2 text-[10px] sm:text-xs lg:text-base flex-wrap">
                Email:
                <span className="font-mono break-all">demo@yourapp.com</span>
                <button
                  className="text-[10px] sm:text-xs lg:text-base px-1 py-1 sm:px-2 bg-slate-300 rounded hover:bg-green-500"
                  onClick={() => navigator.clipboard.writeText("demo@yourapp.com")}
                >
                  Copy
                </button>
              </div>
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2 text-[10px] sm:text-xs lg:text-base flex-wrap">
                Password:
                <span className="font-mono break-all">demopassword</span>
                <button
                  className="text-[10px] sm:text-xs lg:text-base px-1 py-1 sm:px-2 bg-slate-300 rounded hover:bg-green-500"
                  onClick={() => navigator.clipboard.writeText("demopassword")}
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-slate-200 p-1 sm:p-2 mb-2 rounded flex flex-col items-center justify-center w-[161px] sm:w-full">
              <p className="font-extrabold py-1 text-[10px] sm:text-xs lg:text-base text-center">
                -USE THIS if your ROLE= EMPLOYER
              </p>
              <div className="flex items-center w-[190px] sm:w-auto justify-center gap-1 sm:gap-2 mb-1 sm:mb-2 text-[10px] sm:text-xs lg:text-base flex-wrap">
                Email:
                <span className="font-mono break-all">demo2@yourapp.com</span>
                <button
                  className="text-[10px] sm:text-xs lg:text-base px-1 py-1 sm:px-2 bg-slate-300 rounded hover:bg-green-500"
                  onClick={() => navigator.clipboard.writeText("demo2@yourapp.com")}
                >
                  Copy
                </button>
              </div>
              <div className="flex items-center w-[190px] sm:w-auto justify-center gap-1 sm:gap-2 mb-1 sm:mb-2 text-[10px] sm:text-xs lg:text-base flex-wrap">
                Password:
                <span className="font-mono break-all">demo2password</span>
                <button
                  className="text-[10px] sm:text-xs lg:text-base px-1 py-1 sm:px-2 bg-slate-300 rounded hover:bg-green-500"
                  onClick={() => navigator.clipboard.writeText("demo2password")}
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="text-[8px] sm:text-xs lg:text-base text-slate-700 text-center font-semibold">
              Copy & paste these to sign in instantly!
            </div>
          </div>

          <div className="relative top-16">
            <SignIn
              initialValues={{ emailAddress: "demo@yourapp.com" }}
              signUpForceRedirectUrl="/onboarding"
              fallbackRedirectUrl="/onboarding"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;


