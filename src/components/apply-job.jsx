//we gonna be creating a form where we can apply from there by aupload data and
//  file this component will be i=used in job.jsx with abutton open it
//npm i react-hook-form zod @hookform/resolvers  for compatibility

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/usefetch";
import { applyToJob } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";

//also remember to create policies for resume storage insert and select and add for companies logourl buckdet too soit can store data

//now lets create the schema for zod react validation library it chdecks whether vslue is correct or not
const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  experience: z
    .number()
    .min(0, { message: "Experience must be atleast 0" })
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post-Graduate"]),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      { message: "Resume must be a PDF or Word document." }
    ),
});

export const ApplyJobDrawer = ({ user, job, applied = false, fetchJob }) => {
  //this was for react hook form using react zod and using register forinternal comp. and control for external
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });
  //handlesubmitis invoked when form submit using onsubmit func

  //now take the api applytojob func and give it to usefetch who will fetch it and give data back
  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);
  //we dont need data as we are uploading the work

  //onsubmit mai react zod handlesubmit se  data bhejega + addito0nal dat jo applicstions tables ko chahiye woh bhi hum add krenge jobid,candidateid
  //then fnapply ke thru data jayega to usefetch applytojob api  usefetch callback use krke api call krke data return krega and errors bhi if any
  const onSubmit = async (data) => {
    fnApply({
      ...data,
      job_id: job?.id,
      candidate_id: user?.id,
      name: `${user?.firstName} ${user?.lastName}`.trim(),
      status: "applied",
      resume: data.resume[0],
      company_id: job?.company_id,
    }).then(() => {
      fetchJob(), reset();
    });
  };
  //fetchob = fnjob we assigned it in job.jsx

  return (
    //this open thing is justa check the user never gets access to this drawer even if he bypass checks
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          variant={job?.isopen ? "blue" : "destructive"}
          disabled={!job?.isopen || applied}
          className="px-6 py-5 lg:px-14 lg:py-6  border-2 border-sky-50"
        >
          {job?.isopen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>

      <DrawerContent className=" sm:min-h-[40%] min-h-[35%] ">
        <DrawerHeader className="space-y-2">
          <DrawerTitle className="sm:text-[25px] font-bold text-xl">
            Apply For {job?.title} at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription className="sm:text-[20px]  text-[14px]">
            Please Fill the Form Below.
          </DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >
          <Input
            type="email"
            placeholder="Email Address"
            className="flex-1 lg:text-[18px]"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
          <Input
            type="number"
            placeholder="Years of Experience"
            className="flex-1 lg:text-[18px]"
            {...register("experience", { valueAsNumber: true })}
          />
          {errors.experience && (
            <p className="text-red-500">{errors.experience.message}</p>
          )}
          <Input
            type="text"
            placeholder="Skills"
            className="flex-1 lg:text-[18px]"
            {...register("skills")}
          />
          {errors.skills && (
            <p className="text-red-500">{errors.skills.message}</p>
          )}

          {/* //now radio group is third party librsry so it wont work as above configuration */}
          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup
                defaultValue="none"
                onValueChange={field.onChange}
                {...field}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label
                    htmlFor="intermediate"
                    className=" lg:text-[16px]"
                  >
                    Intermediate (Ongoing or Completed)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graduate" id="Graduate" />
                  <Label
                    htmlFor="Graduate"
                    className="  lg:text-[16px]"
                  >
                    Graduate (Ongoing or Completed)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Post-Graduate" id="Post-Graduate" />
                  <Label
                    htmlFor="Post-Graduate"
                    className="lg:text-[16px]"
                  >
                    Post-Graduate (Ongoing or Completed)
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.education && (
            <p className="text-red-500">{errors.education.message}</p>
          )}
          {/* //this controller is from react hook form and it is used to control the radio group  */}

          <Input
            type="file"
            placeholder="Resume"
            className="flex-1 lg:text-[18px]"
            accept=".pdf, .doc, .docx"
            {...register("resume")}
          />
          {errors.resume && (
            <p className="text-red-500">{errors.resume.message}</p>
          )}

          {errorApply?.message && (
            <p className="text-red-500">{errorApply?.message}</p>
          )}
          {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}

          <Button variant="blue" type="submit" size="lg" className="w-full ">
            Submit
          </Button>
        </form>

        <DrawerFooter className="gap-4">
          <DrawerClose asChild>
            {/* asChild tells the DrawerClose component to not render its own <button> element */}
            {/* Instead, it passes its props to the child Button component */}
            <Button variant="gray" size="lg" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

// Certainly! Here’s a step-by-step explanation of the full flow in your ApplyJobDrawer component:

// 1. Form Setup with React Hook Form and Zod
// useForm initializes the form and connects it to Zod for validation.
// register is used to connect input fields to the form state.
// handleSubmit wraps your submit handler to perform validation and then call your function if valid.
// control is used for controlled components (like radio groups).
// errors contains validation errors for each field.
// reset can reset the form fields after submission.

// 2. API Call Setup with useFetch
// useFetch(applyToJob) sets up a custom hook to call your applyToJob API.
// fnApply is the function you call to trigger the API request.
// loadingApply and errorApply track the loading and error state of the API call.

// 3. Form Submission Handler
// When the form is submitted:
// handleSubmit(onSubmit) validates the form using Zod.
// If valid, onSubmit is called with the form data.
// fnApply sends the data (including extra fields like job_id, candidate_id, etc.) to the API.
// After the API call, fetchJob() is called to refresh job data, and reset() clears the form.

// 3. Form Submission Handler
// When the form is submitted:
// handleSubmit(onSubmit) validates the form using Zod.
// If valid, onSubmit is called with the form data.
// fnApply sends the data (including extra fields like job_id, candidate_id, etc.) to the API.
// After the API call, fetchJob() is called to refresh job data, and reset() clears the form.

// Summary Flow
// User clicks "Apply" button → Drawer opens.
// User fills out the form (experience, skills, education, resume).
// User submits the form:
// Form is validated by Zod.
// If valid, onSubmit is called.
// fnApply sends data to the API.
// On success, parent job data is refreshed and form is reset.
// UI updates to reflect application status
