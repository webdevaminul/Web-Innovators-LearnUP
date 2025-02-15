import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineEmail, MdOutlineLock } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import Heading from "../../utils/Heading";
import TitleLeft from "../../components/Titles/TitleLeft";
import InputField from "../../components/Form/InputField";
import SubmitButton from "../../components/Form/SubmitButton";
import FeedbackMessage from "../../components/Form/FeedbackMessage";
import GoogleLogIn from "../../components/GoogleLogIn/GoogleLogIn";
import axiosPublic from "../../api/axiosPublic";
import {
  emailLoginSuccess,
  loginFailure,
  requestStart,
  resetError,
} from "../../redux/authUsersSlice";

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

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.authUsers);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const signInMutation = useMutation({
    mutationFn: async (formData) => {
      dispatch(requestStart());
      const { data } = await axiosPublic.post("/auth/signin", formData);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        dispatch(emailLoginSuccess(data));
        localStorage.setItem("learnupAccessToken", data.token);
        navigate("/");
        reset();
      } else {
        dispatch(loginFailure(data.message));
      }
    },
    onError: (err) => {
      dispatch(
        loginFailure(err.response?.data?.message || "Something went wrong. Please try again")
      );
    },
  });

  const handleFormSubmit = useCallback(
    (formData) => {
      signInMutation.mutate(formData);
    },
    [signInMutation]
  );

  const handleInputChange = useCallback(() => {
    dispatch(resetError(null));
  }, [dispatch]);

  const handlePasswordChange = useCallback(
    (e) => {
      setPasswordValue(e.target.value);
      handleInputChange();
    },
    [handleInputChange]
  );

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  return (
    <main className="max-w-xs mx-auto flex items-center justify-center">
      <Heading heading="Sign In" />
      <section className="my-10 w-full">
        <TitleLeft title={"Sign in"} subTitle={"Fill in the form to access your account"} />

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-5 md:gap-6 my-5 md:my-6"
        >
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
            isAutoComplete="on"
          />

          <InputField
            icon={<MdOutlineLock />}
            type={"password"}
            placeholder={"Password*"}
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

          {error && <FeedbackMessage message={error} type={"error"} />}

          <Link to="/forget-password" className="text-sm text-blue-500 hover:underline">
            Forget password?
          </Link>

          <SubmitButton isLoading={loading} loadingLabel={"Signing in..."} label={"Sign in"} />
        </form>

        <GoogleLogIn />

        <p className="text-sm text-center">
          <span>Don&apos;t have an acoount?</span>
          <Link to="/sign-up" className="text-blue-500 hover:underline ml-1">
            Sign up here
          </Link>
        </p>
      </section>
    </main>
  );
}
