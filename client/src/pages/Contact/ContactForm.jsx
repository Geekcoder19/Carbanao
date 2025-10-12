import React, { useEffect } from "react";
import FormInputField from "../../components/ui/FormInputField";
import FormInputLabel from "../../components/ui/FormInputLabel";
import Button from "../../components/ui/Button";
import AnimButton from "../../components/ui/AnimButton"
import { useForm } from "react-hook-form";

export default function ContactForm() {
  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = useForm({ mode: "onChange" });

  const submitForm = () => {};

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className=" flex-1 px-10 space-y-8 min-w-[calc(100%-384px)]"
    >
      {/* input fields */}
      <div className="grid grid-cols-2 gap-10">
        {/* firstName */}
        <FormInputLabel textNode="First Name">
          <FormInputField
            type="text"
            attribute="firstName"
            errors={errors}
            register={register("firstName", {
              required: { value: true, message: "First name is required" },
              maxLength: { value: 10, message: "Name exceeds the length" },
            })}
          />
        </FormInputLabel>

        {/* lastName */}
        <FormInputLabel textNode="Last Name">
          <FormInputField
            type="text"
            attribute="lastName"
            errors={errors}
            register={register("lastName", {
              required: { value: true, message: "Last name is required" },
              maxLength: { value: 10, message: "Name exceeds the length" },
            })}
          />
        </FormInputLabel>

        {/* email */}
        <FormInputLabel textNode="Email">
          <FormInputField
            type="email"
            attribute="email"
            errors={errors}
            register={register("email", {
              required: { value: true, message: "Email is required" },
            })}
          />
        </FormInputLabel>

        {/* number */}
        <FormInputLabel textNode="Phone Number">
          <FormInputField
            type="number"
            attribute="number"
            errors={errors}
            register={register("number", {
              required: { value: true, message: "Number is required" },
              maxLength: { value: 11, message: "Digits Exceeds" },
            })}
          />
        </FormInputLabel>
      </div>

      <label
        className={`text-[12px]  font-medium pb-1 flex flex-col gap-y-1 ${
          watch("feedback")?.length > 0
            ? "text-medium-black"
            : "text-medium-gray"
        }`}
      >
        Message
        <input
          type="text"
          {...register("feedback", {
            required: "Message is required",
            maxLength: { value: 150, message: "Message length exceeds" },
          })}
          className={`outline-none border-b-[1px]  text-slate-gray ${
            watch("feedback")?.length > 0
              ? "border-b-medium-black"
              : "border-b-slate-gray "
          }`}
        />
        <p role="alert" className="text-red-500 text-xs">
          {errors.feedback?.message}
        </p>
      </label>

<AnimButton text="Send Message" properties="bg-dark-blue"/>
      
    </form>
  );
}
