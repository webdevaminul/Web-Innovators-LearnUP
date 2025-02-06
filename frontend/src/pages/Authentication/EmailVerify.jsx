import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdVerified, MdError } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { emailLoginSuccess, loginFailure, requestStart } from "../../redux/authUsersSlice";
import axiosPublic from "../../api/axiosPublic";
import Heading from "../../utils/Heading";

export default function EmailVerify() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.authUsers);

  useEffect(() => {
    // Extract token from query parameters
    const token = new URLSearchParams(location.search).get("token");

    // Return an error if the token is missing
    if (!token) {
      dispatch(loginFailure("Verification token is missing"));
      return;
    }

    const verifyEmail = async () => {
      // Dispatch request start action before making API call
      dispatch(requestStart());

      try {
        const { data } = await axiosPublic.get(`/auth/email-verify?token=${token}`);
        // Dispatch login success action if login is successful
        dispatch(emailLoginSuccess(data));

        // Store the access token in localStorage
        localStorage.setItem("learnupAccessToken", data.token);
        console.log("Sign up API Response:", data);

        // Navigate to homepage
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (err) {
        console.error("Email verification error:", err);
        dispatch(loginFailure(err.response?.data?.message || "Email verification failed"));
      }
    };

    verifyEmail();
  }, [location.search, navigate, dispatch]);

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
