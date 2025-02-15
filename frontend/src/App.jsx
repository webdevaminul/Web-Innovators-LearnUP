import { Outlet, useLocation } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import Loader from "./utils/Loader";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import BottomToTop from "./utils/BottomToTop";
import useAllCourse from "./api/useAllCourse";
import useAllUser from "./api/useAllUser";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();

  // Fetch loading states
  const { isLoading: coursesLoading } = useAllCourse();
  const { isLoading: usersLoading } = useAllUser();

  // Show loader if any data is loading
  if (coursesLoading || usersLoading) return <Loader />;

  const hideFooterPath = ["/sign-up", "/sign-in", "/forget-password", "/password-recovery"];

  return (
    <>
      <Navbar />
      <main className="mt-[3.8rem]">
        <Outlet />
        {!hideFooterPath.includes(location.pathname) && <Footer />}
        <BottomToTop />
      </main>
      <ToastContainer position="top-right" autoClose={2000} pauseOnHover transition={Slide} />
    </>
  );
}

export default App;
