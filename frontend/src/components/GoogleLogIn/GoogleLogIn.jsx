import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase.config";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { requestStart, googleLoginSuccess, loginFailure } from "../../redux/authUsersSlice";
import axiosPublic from "../../api/axiosPublic";

export default function GoogleLogIn() {
  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const googleAuthMutation = useMutation({
    mutationFn: async (savedData) => {
      dispatch(requestStart());
      const { data } = await axiosPublic.post("/auth/google", savedData);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        dispatch(googleLoginSuccess(data));
        localStorage.setItem("learnupAccessToken", data.token);
        navigate("/");
      } else {
        dispatch(loginFailure("Google auth error"));
      }
    },
    onError: () => {
      dispatch(loginFailure("Google auth error"));
    },
  });

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const savedData = {
        userName: result?.user?.displayName,
        userEmail: result?.user?.email,
        userPhoto: result?.user?.photoURL,
      };

      googleAuthMutation.mutate(savedData);
    } catch (error) {
      console.error("Google Auth Error", error);
    }
  };
  return (
    <button
      onClick={handleGoogleAuth}
      disabled={googleAuthMutation.isPending}
      className="p-2 my-5 md:my-6 w-full bg-transparent hover:bg-backgroundShadeOne/50 border border-borderLight rounded disabled:bg-gray-300 disabled:text-textBlack disabled:cursor-not-allowed select-none flex items-center justify-center gap-2"
    >
      <span className="text-2xl">
        <FcGoogle />
      </span>
      <span>{googleAuthMutation.isPending ? "Loading..." : "Continue with Google"}</span>
    </button>
  );
}
