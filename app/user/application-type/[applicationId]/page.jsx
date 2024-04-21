"use client";

import { useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import WithAuth from "@/components/withAuth";
import FPI from "../../FPI";
import { useParams, useRouter } from "next/navigation";
import useForm from "@/hooks/useForm";
import { useGetSingleFormFieldsQuery } from "@/store/api/applicationApi";
import TextFieldSkeleton from "@/components/skeleton-loaders/TextFieldSkeleton";
import { validator } from "@/utils/validator";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import DatePicker from "./DatePicker";
import { FieldTypes } from ".";

const ApplicationFormFields = () => {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.applicationId;
  const { isLoading, isSuccess, isError, error, data } =
    useGetSingleFormFieldsQuery(applicationId);
  const fields = data?.data?.fields;

  console.log(fields);

  // forms fields are on page one and 2 of fields data
  const formFields = fields?.filter(
    (field) => field.page === 1 || field.page === 2
  );

  // documents are on page 3 of fiels data
  const generatedDocuments = fields?.filter((field) => field.page === 3);
  console.log(generatedDocuments);

  useEffect(() => {
    if (generatedDocuments?.length !== 0) {
      localStorage.setItem(
        "generatedDocuments",
        JSON.stringify(generatedDocuments)
      );
    }
  }, [fields]);

  console.log(data);
  let InitialData = {};
  // let fieldsInitialErrorStates = {};

  // auto generate form Fields object of dynamic form field
  useEffect(() => {
    const createInitialObject = () => {
      if (formFields?.length !== 0) {
        formFields?.forEach((field) => {
          InitialData[field?.name] = "";
          // fieldsInitialErrorStates[field?.name] = false;
        });
        return InitialData;
      }
      return {};
    };
    if (formFields?.length !== 0) {
      const initialData = createInitialObject();
      setFormData(initialData);
    }
  }, [fields]);

  // persist form fields object
  const initializer = () =>
    JSON.parse(localStorage.getItem("formData")) || InitialData;
  const { formData, setFormData, handleChange } = useForm(initializer);
  const allfieldsNotFilled = validator.whiteSpaces(formData);

  const navigateToNextStep = () => {
    console.log(formData);
    router.push(`/user/application-type/${applicationId}/documents`);
  };

  // fetch persisted data from local storage
  useEffect(() => {
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const fieldNotEmpty = validator.notEmpty();

  const validateForm = (type) => {
    // const fieldsInitialErrorStates = {};
    // formFields?.forEach((field) => {
    //   InitialData[field?.name] = false;
    // });
  };

  return (
    <DashboardLayout header="Application Details" icon="">
      <div className="space-y- w-full">
        <div className="space-y-6">
          <div className="flex justify-between items-center w-full">
            <div className="">
              <h1 className="text-black font-bold">
                Personnel certification:{" "}
                <span className="text-[#46B038]">CLEARANCE</span>
              </h1>
              <p className="text-gray-600 text-sm">
                Please fill all information correctly
              </p>
            </div>
          </div>
          <div className="flex justify-auto mx-auto">
            <FPI length={4} shade={3} />
          </div>
          <div className="bg-white w-full shadow-md rounded-md space-y-16 p-6 h-fit">
            <div className="flex items-center gap-2">
              <h1 className="text-[#46B038] font-bold">APPLICATION DETAILS:</h1>
              <span className="">{applicationId}</span>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-y-8 lg:gap-y-10 w-full">
              {isSuccess &&
                formFields?.map((field) => {
                  const fieldNotEmpty = validator.notEmpty(
                    formData[field.name]
                  );
                  return field.type === "SHORT_TEXT" ||
                    field.type === "EMAIL" ||
                    field.type === "PHONE" ? (
                    <TextInput
                      key={field.id}
                      id={field.id}
                      type={FieldTypes[field.type]}
                      name={field.name}
                      onChange={handleChange}
                      value={formData[field.name]}
                      fieldCustomType={field.type}
                      // isValid={isValid}
                      // onFocus={}
                    />
                  ) : field.type === "LONG_TEXT" ? (
                    <TextArea
                      key={field.id}
                      id={field.id}
                      name={field.name}
                      onChange={handleChange}
                      value={formData[field.name]}
                      // isValid={isValid}
                    />
                  ) : field.type === "DATE" ? (
                    <DatePicker
                      key={field.id}
                      id={field.id}
                      name={field.name}
                      onChange={handleChange}
                      value={formData[field.name]}
                      // isValid={isValid}
                    />
                  ) : (
                    ""
                  );
                })}{" "}
              {(isLoading || !data) &&
                [1, 2, 3, 4, 5, 6, 7, 8, 9].map((loader) => (
                  <TextFieldSkeleton key={loader} />
                ))}
            </div>
            <div className="space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:opacity-70"
              >
                Back
              </button>
              <button
                disabled={allfieldsNotFilled}
                type="button"
                onClick={navigateToNextStep}
                className="lg:px-8 px-6 py-2 bg-[#46B038] hover:opacity-70 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WithAuth(ApplicationFormFields);