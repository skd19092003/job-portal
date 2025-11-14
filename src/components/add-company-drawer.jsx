import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerHeader,
  DrawerClose,
} from "./ui/drawer";
import { addNewCompany } from "@/api/apiCompanies";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/usefetch";
import { Input } from "./ui/input";
import { BarLoader } from "react-spinners";


// React Hook Form (RHF): RHF is a library that helps manage forms in React applications.
//  It provides a simple and efficient way to handle form state{ values, errors, and touched fields.},
//  validation{allows you to define validation rules for each field.}, and
//  form submission{, including preventing default behavior and calling a submit function.}

// Zod: Zod is a TypeScript-first schema validation library.
//  It allows you to define schemas for your data, including forms, and
//  validates the data against those schemas. Zod's main features include:

//Using RHF with Zod: When you use RHF with Zod, you get the benefits of both libraries. Here's how they work together:

// Schema definition: You define a schema for your form data using Zod.
// Form creation: You create a form using RHF, passing the Zod schema as a resolver.
// Validation: RHF uses the Zod schema to validate the form data, providing detailed error messages.
// Submission handling: RHF handles form submission, using the validated data
const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      {
        message: "Only Images are allowed",
      }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies, companies   }) => {
    const [open, setOpen] = useState(false);
    const [FailAdd, setFailAdd] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  //frontend logic is great as it prevents unneccesary add companylog in storage buckets
 const onSubmit = async (data) => {
  // Check for duplicate name (case-insensitive)
  const exists = companies?.some(
    (c) => c.name.trim().toLowerCase() === data.name.trim().toLowerCase()
  );
  if (exists) {
    console.error("Company name already exists");
    setFailAdd(true);
    return;
  }
  fnAddCompany({
    ...data,
    logo: data.logo[0],
  })
};


  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
      setOpen(false);
      setFailAdd(false);
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingAddCompany, dataAddCompany]);

  return (
    <Drawer  open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
          {/* //jab company name same ho toh apicompany se error return krao and show krdo duplication or frontend mai already fetched data pe conditoon check kro */}
          {/* {dataAddCompany?.message && (
            <p>Company name already exists , Use already Existing Company or try a different name</p>
          )} */}
          {/* this was googd but creating unneccesary companylog instorage buckets so use frontned approach */}
            {FailAdd && <p>Company name already exists , Use already Existing Company or try a different name</p>}
        </DrawerHeader>
        <form className="flex gap-4 p-4 pb-0 flex-col items-center">
          {/* Company Name */}
          <div className="flex flex-col gap-2 w-full sm:flex-row">
            <Input className="p-8 border border-slate-50" placeholder="Company name" {...register("name")} />

            {/* Company Logo */}
            <Input
              type="file"
              accept="image/*"
              className=" border border-slate-50  file:text-gray-500 file:bg-gray-200 file:border-0 file:hover:opacity-75  file:cursor-pointer h-auto file:p-3"
              {...register("logo")}
            />
          </div>
          {/* Add Button */}
          <Button
            //reason for keeping type button andnot submit bcoz at type submit will refresh page and we dont want that
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="blue"
            className="w-full p-5"
          >
            Add
          </Button>
        </form>
        <DrawerFooter className="flex flex-col gap-2">
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
          {errorAddCompany?.message && (
            <p className="text-red-500">{errorAddCompany?.message}</p>
          )}
          {loadingAddCompany && <BarLoader width={"100%"} color="#36d7b7" />}
          <DrawerClose asChild>
            <Button type="button" variant="secondary" className="p-4 hover:bg-gray-500">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
