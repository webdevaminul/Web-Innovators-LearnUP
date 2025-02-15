import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { MdOutlineEmail, MdOutlineLock } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import Heading from "../../utils/Heading";
import TitleLeft from "../../components/Titles/TitleLeft";
import InputField from "../../components/Form/InputField";
import SubmitButton from "../../components/Form/SubmitButton";
import FeedbackMessage from "../../components/Form/FeedbackMessage";
import GoogleLogIn from "../../components/GoogleLogIn/GoogleLogIn";
import axiosPublic from "../../api/axiosPublic";

const VALIDATION_MESSAGES = {
  USERNAME_REQUIRED: "User name is required",
  USERNAME_MAX_LENGTH: "Max 24 characters",
  EMAIL_REQUIRED: "Email address is required",
  EMAIL_INVALID: "Invalid email",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Min 8 characters",
  PASSWORD_MAX_LENGTH: "Max 24 characters",
  PASSWORD_PATTERN: "Must contain letters and numbers",
};

export default function SignUp() {
  const [feedback, setFeedback] = useState({ error: null, success: null });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const signUpMutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosPublic.post("/auth/signup", formData);
      return data;
    },
    onSuccess: ({ success, message }) => {
      setFeedback({ error: success ? null : message, success: success ? message : null });
      if (success) {
        reset();
        setShowPassword(false);
        setPasswordValue("");
      }
    },
    onError: ({ response }) => {
      setFeedback({
        error: response?.data?.message || "Something went wrong. Please try again",
        success: null,
      });
    },
  });

  const handleFormSubmit = useCallback(
    (formData) => {
      setFeedback({ error: null, success: null });
      signUpMutation.mutate(formData);
    },
    [signUpMutation]
  );

  const handleInputChange = useCallback(() => {
    if (feedback.success || feedback.error) {
      setFeedback({ error: null, success: null });
    }
  }, [feedback]);

  const handlePasswordChange = useCallback(
    (e) => {
      setPasswordValue(e.target.value);
      handleInputChange();
    },
    [handleInputChange]
  );

  return (
    <main className="max-w-xs mx-auto flex items-center justify-center">
      <Heading heading="Sign Up" />
      <section className="my-10 w-full">
        <TitleLeft title={"Sign up"} subTitle={"Fill in the form to create your account"} />

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-5 md:gap-6 my-5 md:my-6"
        >
          <InputField
            icon={<FiUser />}
            type={"text"}
            placeholder={"Full name*"}
            name={"userName"}
            register={register}
            validationRules={{
              required: VALIDATION_MESSAGES.USERNAME_REQUIRED,
              maxLength: { value: 24, message: VALIDATION_MESSAGES.USERNAME_MAX_LENGTH },
            }}
            errors={errors}
            onInputChange={handleInputChange}
          />

          <InputField
            icon={<MdOutlineEmail />}
            type={"email"}
            placeholder={"Email address*"}
            name={"userEmail"}
            register={register}
            validationRules={{
              required: VALIDATION_MESSAGES.EMAIL_REQUIRED,
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: VALIDATION_MESSAGES.EMAIL_INVALID,
              },
            }}
            errors={errors}
            onInputChange={handleInputChange}
          />

          <InputField
            icon={<MdOutlineLock />}
            type={"password"}
            placeholder={"Create password*"}
            name={"userPassword"}
            register={register}
            validationRules={{
              required: VALIDATION_MESSAGES.PASSWORD_REQUIRED,
              minLength: { value: 8, message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH },
              maxLength: { value: 24, message: VALIDATION_MESSAGES.PASSWORD_MAX_LENGTH },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                message: VALIDATION_MESSAGES.PASSWORD_PATTERN,
              },
            }}
            errors={errors}
            showPassword={showPassword}
            showPasswordToggle={passwordValue.length > 0}
            toggleShowPassword={() => setShowPassword((prev) => !prev)}
            onInputChange={handlePasswordChange}
          />

          {feedback.success && <FeedbackMessage message={feedback.success} type={"success"} />}
          {feedback.error && <FeedbackMessage message={feedback.error} type={"error"} />}

          <SubmitButton
            isLoading={signUpMutation.isPending}
            loadingLabel={"Signing up..."}
            label={"Sign up"}
          />
        </form>

        <GoogleLogIn />

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
