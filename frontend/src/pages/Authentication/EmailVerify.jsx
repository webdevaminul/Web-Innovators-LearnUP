import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdVerified, MdError } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { emailLoginSuccess, loginFailure, requestStart } from "../../redux/authUsersSlice";
import axiosPublic from "../../api/axiosPublic";
import Heading from "../../utils/Heading";

export default function EmailVerify() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { loading, error } = useSelector((state) => state.authUsers);

  useEffect(() => {
    const token = new URLSearchParams(search).get("token");

    if (!token) {
      dispatch(loginFailure("Verification token is missing"));
      return;
    }

    const verifyEmail = async () => {
      dispatch(requestStart());

      try {
        const { data } = await axiosPublic.get(`/auth/email-verify?token=${token}`);
        dispatch(emailLoginSuccess(data));
        localStorage.setItem("learnupAccessToken", data.token);

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (err) {
        dispatch(
          loginFailure(
            err.response?.data?.message || "Email verification failed. Please try again."
          )
        );
      }
    };

    verifyEmail();
  }, [search, navigate, dispatch]);

  return (
    <main className="min-h-[calc(100vh-3.8rem)] flex flex-col items-center justify-center bg-backgroundPrimary">
      <Heading heading={"Email Verify"} />
      {loading ? (
        <>
          <h2 className="text-2xl">Verifying your email</h2>
          <span className="loading loading-ring loading-lg"></span>
        </>
      ) : (
        <>
          <h2 className={`text-2xl ${error ? "text-red-500" : "text-green-600"}`}>
            {error ? "Email verification failed" : "Email verified successfully"}
          </h2>
          <span className={`text-4xl ${error ? "text-red-500" : "text-green-600"}`}>
            {error ? <MdError /> : <MdVerified />}
          </span>
        </>
      )}
    </main>
  );
}
