import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineLock } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Heading from "../../utils/Heading";
import TitleLeft from "../../components/Titles/TitleLeft";
import InputField from "../../components/Form/InputField";
import SubmitButton from "../../components/Form/SubmitButton";
import FeedbackMessage from "../../components/Form/FeedbackMessage";
import axiosPublic from "../../api/axiosPublic";
import {
  emailLoginSuccess,
  loginFailure,
  requestStart,
  resetError,
} from "../../redux/authUsersSlice";
import { toast } from "react-toastify";

const VALIDATION_MESSAGES = {
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Min 8 characters",
  PASSWORD_MAX_LENGTH: "Max 24 characters",
  PASSWORD_PATTERN: "Must contain letters and numbers",
};

export default function PasswordRecovery() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { loading, error } = useSelector((state) => state.authUsers);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const token = new URLSearchParams(search).get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const recoverPasswordMutation = useMutation({
    mutationFn: async (formData) => {
      dispatch(requestStart());
      const { data } = await axiosPublic.post(`/auth/recover-password?token=${token}`, formData);
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.success) {
        dispatch(emailLoginSuccess(data));
        localStorage.setItem("learnupAccessToken", data.token);
        navigate("/");
        reset();
        toast.success("Your password has been updated");
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
      recoverPasswordMutation.mutate(formData);
    },
    [recoverPasswordMutation]
  );

  const handlePasswordChange = useCallback(
    (e) => {
      setPasswordValue(e.target.value);
      dispatch(resetError(null));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  return (
    <main className="max-w-xs mx-auto flex items-center justify-center">
      <Heading heading="Password Recovery" />
      <section className="my-10 w-full">
        <TitleLeft title={"Password Recovery"} subTitle={"Set a new password for your account"} />

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-5 md:gap-6 my-5 md:my-6"
        >
          <InputField
            icon={<MdOutlineLock />}
            type={"password"}
            placeholder={"Password*"}
            name={"newPassword"}
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

          <SubmitButton
            isLoading={loading}
            loadingLabel={"Changing password..."}
            label={"Change password"}
          />
        </form>
      </section>
    </main>
  );
}
