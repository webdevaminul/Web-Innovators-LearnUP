import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import SignUp from "../pages/Authentication/SignUp";
import SignIn from "../pages/Authentication/SignIn/SignIn";
import AllCourses from "../pages/AllCourses/AllCourses";
import BlogPosts from "../pages/BlogPosts/BlogPosts";
import ContactPage from "../pages/ContactPage/ContactPage";
import BeInstructor from "../pages/BeInstructor/BeInstructor";
import TeacherDashboard from "../pages/TeacherDashboard/TeacherDashboard";
import TeacherHome from "../pages/TeacherDashboard/TeacherHome/TeacherHome";
import TeacherProfile from "../pages/TeacherDashboard/TeacherProfile/TeacherProfile";
import ManageCourse from "../pages/TeacherDashboard/Course/ManageCourse";
import CreateCourse from "../pages/TeacherDashboard/Course/CreateCourse";
import EmailVerify from "../pages/Authentication/EmailVerify/EmailVerify";
import DashboardLayoutBasic from "../pages/UserDashboard/Dashboard/DashboardLayoutBasic";
import ErrorBoundary from "../pages/UserDashboard/ErrorBoundary/ErrorBoundary";
import CourseDetails from "../pages/CourseDetails/CourseDetails";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import PrivateRouter from "./PrivateRouter";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import AdminHome from "../pages/AdminDashboard/AdminHome/AdminHome";
import ManageAccount from "../pages/AccountManagement/ManageAccount";
import Overview from "../pages/AccountManagement/Overview";
import UpdateProfile from "../pages/AccountManagement/UpdateProfile";
import ChangePassword from "../pages/AccountManagement/ChangePassword";
import DeleteAccount from "../pages/AccountManagement/DeleteAccount";
import BlogCreation from "../pages/TeacherDashboard/TeacherBlog/BlogCreation";
import BlogManagement from "../pages/TeacherDashboard/TeacherBlog/BlogManagement";

import ForgetPassword from "../pages/Authentication/ForgetPassword/ForgetPassword";
import PasswordRecovery from "../pages/Authentication/PasswordRecovery/PasswordRecovery";
import BlogDetails from "../components/BlogDetails/BlogDetails";
import AdminBlogManage from "../pages/AdminDashboard/BlogManage/AdminBlogManage";
import UserManage from "../pages/AdminDashboard/UserManage/UserManage";
import CourseManage from "../pages/AdminDashboard/CourseMange/CourseManage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/sign-in", element: <SignIn /> },
      { path: "/sign-up", element: <SignUp /> },
      { path: "/email-verify", element: <EmailVerify /> },
      {
        path: "/forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "/password-recovery",
        element: <PasswordRecovery />,
      },
      {
        path: "/manage-account",
        element: <ManageAccount />,
        children: [
          { path: "overview", element: <Overview /> },
          { path: "manage-profile", element: <UpdateProfile /> },
          { path: "change-password", element: <ChangePassword /> },
          { path: "delete-account", element: <DeleteAccount /> },
        ],
      },
      {
        path: "/all-courses",
        element: <AllCourses />,
      },
      {
        path: "/all-course/:categoryName",
        element: <AllCourses />,
      },
      {
        path: "/course-details/:id",
        element: <CourseDetails />,
        loader: () => fetch("./courses.json"),
      },
      {
        path: "/blog",
        element: <BlogPosts />,
      },

      { path: "/blog-details/:id", element: <BlogDetails /> },
      {
        path: "/contact-us",
        element: <ContactPage />,
      },
      {
        path: "/become-instructor",
        element: <BeInstructor />,
      },
    ],
  },
  {
    path: "dashboard/home",
    element: (
      <PrivateRouter>
        <DashboardLayoutBasic />
      </PrivateRouter>
    ),
    errorElement: <ErrorPage />,
    // children:
  },
  {
    path: "/teacher-dashboard",
    element: (
      <PrivateRouter>
        <TeacherDashboard />
      </PrivateRouter>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Navigate to="home" />,
      },
      {
        path: "home",
        element: <TeacherHome />,
      },
      {
        path: "profile",
        element: <TeacherProfile />,
      },
      {
        path: "manage-course",
        element: <ManageCourse />,
      },
      {
        path: "create-course",
        element: <CreateCourse />,
      },
      {
        path: "create-post",
        element: <BlogCreation />,
      },
      { path: "blog-management", element: <BlogManagement /> },
    ],
  },

  // Admin dashboard here
  {
    path: "/admin-dashboard",
    element: (
      <PrivateRouter>
        <AdminDashboard />
      </PrivateRouter>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Navigate to="admin-home" />,
      },
      {
        path: "admin-home",
        element: <AdminHome />,
      },
      {
        path: "user-manage",
        element: <UserManage />,
      },
      {
        path: "course-manage",
        element: <CourseManage />,
      },

      {
        path: "adminBlog-management",
        element: <AdminBlogManage />,
      },
    ],
  },

  {
    path: "*", // Catch all for any undefined routes
    element: <ErrorPage />,
  },
]);

export default router;
