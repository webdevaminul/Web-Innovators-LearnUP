import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { MdError, MdCheckCircle, MdOutlineEmail, MdOutlineLock } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import Heading from "../../utils/Heading";
import axiosPublic from "../../api/axiosPublic";
import GoogleLogIn from "../../components/GoogleLogIn/GoogleLogIn";

export default function SignUp() {
  // State for form feedback and password visibility
  const [feedback, setFeedback] = useState({ error: null, success: null });
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Mutation for sign-up request
  const signUpMutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosPublic.post("/auth/signup", formData);
      return data;
    },
    onSuccess: ({ success, message }) => {
      setFeedback({ error: success ? null : message, success: success ? message : null });
      if (success) reset();
    },
    onError: ({ response }) => {
      setFeedback({ error: response?.data?.message || "Something went wrong.", success: null });
    },
  });

  // Handle form submission
  const handleFormSubmit = (formData) => {
    setFeedback({ error: null, success: null });
    signUpMutation.mutate(formData);
  };

  // Reset feedback on input change
  const handleInputChange = () => {
    if (feedback.error || feedback.success) {
      setFeedback({ error: null, success: null });
    }
  };

  // Render input fields with validation
  const renderInputField = (icon, type, placeholder, name, validationRules) => (
    <div
      className={`flex items-center border rounded ${errors[name] ? "border-red-500" : "border-border"} mt-4`}
    >
      <span className="p-2 text-xl text-text/75">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-transparent outline-none placeholder:text-text/75 p-2 w-full"
        {...register(name, { ...validationRules, onChange: handleInputChange })}
        aria-invalid={!!errors[name]}
        autoComplete="off"
      />
    </div>
  );

  return (
    <main className="min-h-[calc(100vh-3.8rem)] max-w-xs mx-auto flex items-center justify-center">
      <Heading heading="Sign Up" />
      <section className="flex flex-col gap-3 justify-center p-4 w-full">
        <div>
          <p className="text-2xl sm:text-3xl my-1">Sign up</p>
          <p className="text-sm">Fill in the form to create your account</p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col">
          {/* Render Username, Email, and Password fields */}
          {renderInputField(<FiUser />, "text", "User name*", "userName", {
            required: "User name is required",
            maxLength: { value: 24, message: "Max 24 characters" },
          })}
          {errors.userName && (
            <p role="alert" className="text-red-500">
              {errors.userName.message}
            </p>
          )}

          {renderInputField(<MdOutlineEmail />, "email", "Email address*", "userEmail", {
            required: "Email address is required",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
          })}
          {errors.userEmail && (
            <p role="alert" className="text-red-500">
              {errors.userEmail.message}
            </p>
          )}

          {/* Password input with show/hide toggle */}
          <div
            className={`flex items-center border rounded ${errors.userPassword ? "border-red-500" : "border-border"} mt-4`}
          >
            <span className="p-2 text-xl text-text/75">
              <MdOutlineLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password*"
              className="bg-transparent outline-none placeholder:text-text/75 p-2 w-full"
              {...register("userPassword", {
                required: "Password is required",
                minLength: { value: 8, message: "Min 8 characters" },
                maxLength: { value: 24, message: "Max 24 characters" },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                  message: "Must contain letters and numbers",
                },
                onChange: handleInputChange,
              })}
              aria-invalid={!!errors.userPassword}
              autoComplete="off"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-xl text-text/75 cursor-pointer"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>
          {errors.userPassword && (
            <p role="alert" className="text-red-500">
              {errors.userPassword.message}
            </p>
          )}

          {/* Feedback messages */}
          {feedback.error && (
            <p className="text-white bg-red-600 rounded p-2 mt-4 flex  gap-2">
              <MdError className="text-white text-xl mt-[2px]" />
              {feedback.error}
            </p>
          )}
          {feedback.success && (
            <p className="text-black bg-green-400 rounded p-2 mt-4 flex  gap-2">
              <MdCheckCircle className="text-black text-xl mt-[2px]" />
              {feedback.success}
            </p>
          )}

          {/* Submit Button */}
          <button
            disabled={signUpMutation.isLoading}
            type="submit"
            className="p-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {signUpMutation.isLoading ? "Loading..." : "Sign up"}
          </button>
        </form>

        {/* Google Login */}
        <GoogleLogIn />

        {/* Sign-in Link */}
        <p className="text-sm text-center">
          Already have an account?
          <Link to="/sign-in" className="text-blue-500 hover:underline ml-1">
            Sign in here
          </Link>
        </p>
      </section>
    </main>
  );
}
