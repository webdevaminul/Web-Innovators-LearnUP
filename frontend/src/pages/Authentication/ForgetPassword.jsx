import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { MdOutlineEmail } from "react-icons/md";
import Heading from "../../utils/Heading";
import TitleLeft from "../../components/Titles/TitleLeft";
import InputField from "../../components/Form/InputField";
import FeedbackMessage from "../../components/Form/FeedbackMessage";
import SubmitButton from "../../components/Form/SubmitButton";
import axiosPublic from "../../api/axiosPublic";

const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: "Email address is required",
  EMAIL_INVALID: "Invalid email",
};

export default function ForgetPassword() {
  const [feedback, setFeedback] = useState({ error: null, success: null });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const forgetPasswordMutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosPublic.post("/auth/forget-password", formData);
      return data;
    },
    onSuccess: ({ success, message }) => {
      setFeedback({ error: success ? null : message, success: success ? message : null });
      reset();
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
      forgetPasswordMutation.mutate(formData);
    },
    [forgetPasswordMutation]
  );

  const handleInputChange = useCallback(() => {
    if (feedback.success || feedback.error) {
      setFeedback({ error: null, success: null });
    }
  }, [feedback]);

  return (
    <main className="max-w-xs mx-auto flex items-center justify-center">
      <Heading heading="Forget Password" />
      <section className="my-10 w-full">
        <TitleLeft
          title={"Forget Password?"}
          subTitle={"Enter your email to get a recovery link."}
        />

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
          />

          {feedback.success && <FeedbackMessage message={feedback.success} type={"success"} />}
          {feedback.error && <FeedbackMessage message={feedback.error} type={"error"} />}

          <SubmitButton
            isLoading={forgetPasswordMutation.isPending}
            loadingLabel={"Getting recovery link..."}
            label={"Get recovery link"}
          />
        </form>
      </section>
    </main>
  );
}
