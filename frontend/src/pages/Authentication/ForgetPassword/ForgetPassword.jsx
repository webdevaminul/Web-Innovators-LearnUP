import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdCheckCircle, MdError, MdOutlineEmail } from "react-icons/md";
import axiosSecure from "../../../api/axiosSecure";

export default function ForgetPassword() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Define the mutation for the forget password process
  const forgetPasswordMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosSecure.post("/auth/forget-password", formData);
      return res.data;
    },
    onSuccess: (data) => {
      setError(null); // Clear any previous error message
      setSuccess(null); // Clear any previous success message
      if (!data.success) {
        setError(data.message);
      } else {
        setSuccess(data.message);
      }
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
      setSuccess(null);
    },
  });

  // Handle form submission
  const onSubmit = async (formData) => {
    console.log(formData);

    // Trigger the mutation to send the forget password email
    forgetPasswordMutation.mutate(formData);
  };

  return (
    <main className="min-h-[calc(100vh-3.8rem)] max-w-xs mx-auto flex items-center justify-center">
      <section className="flex flex-col justify-center p-4 w-full ">
        <p className="text-center text-textPrimary mb-4 font-medium">
          Enter your email address to get a recovery link.
        </p>

        {/* Forget password form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {/* Email address input */}
          <div
            className={`flex items-center border rounded ${
              errors.userEmail ? "border-red-500" : "border-borderLight"
            } mt-4 `}
          >
            <span className="p-2 text-xl text-textPrimary">
              <MdOutlineEmail />
            </span>
            <input
              type="email"
              placeholder="Email address*"
              className={`bg-transparent outline-none placeholder:text-textPrimary p-2 w-full`}
              {...register("userEmail", {
                required: "Email address is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
                onChange: () => {
                  setError(null);
                  setSuccess(null);
                },
              })}
              aria-invalid={errors.userEmail ? "true" : "false"}
            />
          </div>
          {errors.userEmail && (
            <p role="alert" className="text-red-500">
              {errors.userEmail.message}
            </p>
          )}

          {/* Error message */}
          {error && (
            <p className="text-textWhite bg-red-600 rounded p-2 mt-4 flex gap-2">
              <span className="text-xl">
                <MdError className="text-textWhite mt-1" />
              </span>
              <span>{error}</span>
            </p>
          )}

          {/* Success message */}
          {success && (
            <p className="text-textBlack bg-green-400 rounded p-2 mt-4 flex gap-2">
              <span className="text-xl">
                <MdCheckCircle className="text-textBlack mt-1" />
              </span>
              <span>{success}</span>
            </p>
          )}

          {/* Get link button */}
          <button
            disabled={forgetPasswordMutation.isLoading}
            type="submit"
            className="p-2 mt-4 bg-backgroundBlue hover:bg-backgroundBlueHover border-none rounded text-textWhite disabled:bg-primaryWhite disabled:text-primaryBlack disabled:cursor-not-allowed select-none"
          >
            {forgetPasswordMutation.isLoading ? "Loading..." : "Get recovery link"}
          </button>
        </form>
      </section>
    </main>
  );
}
