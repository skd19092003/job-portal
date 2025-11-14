import {  getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/usefetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
   
import { State } from "country-state-city";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";


const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a Location" }),
  company_id: z.string().min(1, { message: "Select or Add a Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const Postjob = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    fn: fnCompanies,
    data: Companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);
  useEffect(() => {
    if (isLoaded) fnCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  //so basically we creating a job by these onsubmit and passing form data and rowpolicycheck userid to insert job in database jobs
  //then we get datacreatejob as return
  const {
    loading: loadingCreateJob,
    fn: fnCreateJob,
    data: dataCreateJob,
    error: errorCreateJob,
  } = useFetch(addNewJob);
  const onSubmit = (data) => {
    fnCreateJob({ ...data, recruiter_id: user?.id, isopen: true });
  };
  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/job-listing");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingCreateJob]);

  if (!isLoaded && loadingCompanies) {
    return <BarLoader color="#36d7b7" width={"100%"} />;
  }




  return (
    <div className="flex flex-col items-center justify-center mt-10 lg:mb-8 lg:mt-0 gap-4 ">
      <h2 className="gradient-title text-4xl font-extrabold   sm:text-5xl lg:text-7xl">
        Post a Job
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[83%] space-y-4 ">
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-4  ">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map((State) => {
                      return (
                        <SelectItem key={State.name} value={State.name}>
                          {" "}
                          {State.name}{" "}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Company">
                    {field.value
                      ? Companies?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Company"}
                    {/* //this here means that if the field value is not null, then the company name will be displayed */}
                    {/* //but login works likeif field.value is equals to company id then return that company and .name use to get name ELSE just render the "company" */}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Companies?.map(({ name, id }) => (
                      <SelectItem key={id} value={id}>
                         (ID : {id})- {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {/* //for adding company after creating insert policy in insert in applicaitons table and storage companylogo
          // then adding api in api companies for adding companies firstly add company logo then addcompany  */}
          <AddCompanyDrawer fetchCompanies={fnCompanies} companies={Companies} />
          {/* //it needs fncompanies as after adding company we need to refresh and add in existing companies and show in drawer company filter */}
          
        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <div className="w-full">
              <MDEditor
                value={field.value || ""}
                onChange={field.onChange}
                className="custom-mdeditor rounded-lg border min-h-[120px] shadow-sm"
                previewOptions={{
                  className: "custom-mdeditor-preview",
                }}
                textareaProps={{
                  placeholder: "Enter requirements here...",
                  title: "Requirements",
                }}
              />
            </div>
          )}
        />

        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
        )}
        {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}
        <Button type="submit" variant="blue" size="lg" className="mt-2 w-full">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Postjob;
