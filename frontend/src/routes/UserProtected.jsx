import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function UserProtected({ children }) {
  const { isAuthenticated } = useSelector((state) => state.authUsers);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
