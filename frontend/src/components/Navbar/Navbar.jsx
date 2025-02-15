import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RiMenuFold2Line } from "react-icons/ri";
import { RiMenuFoldLine } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { MdArrowBackIosNew } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Darkmode from "../Darkmode/Darkmode";
import { requestFailure, requestStart, userClearSuccess } from "../../redux/authUsersSlice";
import axiosSecure from "../../api/axiosSecure";
import useAllUser from "../../api/useAllUser";
import logo from "../../assets/logo.png";
import Loader from "../../utils/Loader";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.authUsers);
  const [profileMenu, setProfileMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  const { isLoading } = useAllUser();
  const profileMenuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const linkClass = ({ isActive }) =>
    `text-nowrap p-1 lg:p-2 hover:text-textBlue ${isActive ? "text-textBlue" : ""}`;

  // const role = "Admin";
  // const role = "Teacher";
  const role = user?.userInfo?.userRole;

  // Toggle Profile Menu
  const toggleProfileMenu = () => {
    setProfileMenu(!profileMenu);
    // setMobileMenu(false);
  };

  // Handle Click Outside Mobile Menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      dispatch(requestStart());
      const res = await axiosSecure.get("/auth/sign-out");
      if (res.data.success) {
        dispatch(userClearSuccess());
        localStorage.removeItem("learnupAccessToken");
        setProfileMenu(false);
        navigate("/");
      }
    } catch (error) {
      dispatch(
        requestFailure(error.response?.data?.message || "Something went wrong. Please try again.")
      );
    }
  };

  const links = (
    <>
      <li onClick={() => setOpenMenu(false)}>
        <NavLink to="/all-courses" className={linkClass}>
          Our Courses
        </NavLink>
      </li>
      {/* <li onClick={() => setOpenMenu(false)}>
        <NavLink to="/blog" className={linkClass}>
          Blogs
        </NavLink>
      </li> */}
      <li onClick={() => setOpenMenu(false)}>
        <NavLink to="/become-instructor" className={linkClass}>
          Become Instructor
        </NavLink>
      </li>
      <li onClick={() => setOpenMenu(false)}>
        <NavLink to="/contact-us" className={linkClass}>
          About Us
        </NavLink>
      </li>
    </>
  );

  if (isLoading) return <Loader />;

  return (
    <header className="fixed h-[3.8rem] border-b border-borderLight w-full top-0 left-0 z-50 bg-backgroundPrimary">
      <nav className="gap-2 h-full p-2 md:p-4 lg:p-5 flex justify-between items-center relative w-full">
        {/* Logo and Search bar */}
        <div className="flex items-center gap-12">
          {/* Logo and Menu button for small devices */}
          <div className="flex items-center">
            {/* Menu button for small devices */}
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="md:hidden w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center"
            >
              {openMenu ? (
                <RiMenuFoldLine className="m-auto text-2xl text-textBlue w-full h-full" />
              ) : (
                <RiMenuFold2Line className="m-auto text-2xl text-textBlue w-full h-full" />
              )}
            </button>

            {/* Logo */}
            <Link to="/">
              <div className="flex items-center">
                <img src={logo} alt="LearnUP" className="w-7" />
                <h1 className="font-bold text-2xl md:text-3xl font-ubuntu text-textBlue">
                  Learn<span className="text-textOrange">UP</span>
                </h1>
              </div>
            </Link>
          </div>

          {/* search bar for large device */}
          <div className="px-4 border border-borderLight rounded-3xl w-full max-w-md justify-between sm:flex md:hidden lg:flex hidden">
            <input
              className="outline-none w-full placeholder:text-text/70 text-text py-2 bg-transparent"
              type="text"
              placeholder="Search program..."
            />
            <button className="text-xl">
              <IoSearchOutline />
            </button>
          </div>
        </div>

        {/* search bar for small device */}
        <div
          className={`px-3 absolute z-10 top-0 h-[3.8rem] flex gap-3 bg-backgroundPrimary transition-all duration-400 ease-in-out ${
            searchBarOpen ? "w-full left-0" : "w-0 left-[-300px]"
          }`}
        >
          {/* Close button for search bar */}
          <button
            onClick={() => setSearchBarOpen(false)}
            className="absolute left-4 top-1/2 transform translate-y-[-50%] text-textWhite bg-backgroundBlue hover:bg-backgroundBlueHover shadow-sm rounded-full p-3"
          >
            <MdArrowBackIosNew />
          </button>

          {/* Search bar and search button*/}
          <div className="flex absolute left-16 right-4 top-1/2 transform translate-y-[-50%] bg-backgroundPrimary border border-borderLight rounded-full overflow-hidden">
            <input
              className="outline-none bg-transparent w-full placeholder:text-textPrimary my-auto p-2 px-4"
              type="text"
              placeholder="Search program..."
            />

            <button className="text-2xl p-2 my-auto bg-backgroundBlue text-textWhite rounded-full">
              <IoSearchOutline />
            </button>
          </div>
        </div>

        {/* nav links for small device */}
        <div
          className={`transition-all duration-400 ease-in-out md:hidden absolute top-[3.8rem] flex flex-col gap-5 list-none bg-backgroundPrimary h-screen ${
            openMenu ? "left-0 right-0" : "left-[-150%] right-[100%]"
          } font-semibold p-3 text-textPrimary text-center`}
        >
          {links}
        </div>

        {/* nav links for large device and buttons*/}
        <div className="flex items-center gap-1">
          {/* nav links for large device */}
          <div className="list-none hidden md:flex flex-nowrap font-semibold text-textPrimary">
            {links}
          </div>

          {/* buttons */}
          <div className="flex w-full items-center gap-2">
            {/* Profile or Sign in */}
            {user && isAuthenticated ? (
              <div ref={profileMenuRef} className="relative rounded-full">
                <div
                  onClick={toggleProfileMenu}
                  className="bg-blue-500 rounded-full m-auto h-8 w-8 sm:h-9 sm:w-9 cursor-pointer"
                >
                  <img
                    src={user?.userInfo?.userPhoto}
                    className="rounded-full object-center object-cover"
                    loading="lazy"
                  />
                </div>

                {profileMenu && (
                  <div className="absolute top-[3.2rem] sm:right-0 right-[-4.5rem] z-40 bg-backgroundShadeOne p-4 shadow-sm border border-borderDark rounded-xl flex flex-col gap-4">
                    <div className="">
                      <p className="whitespace-nowrap">Hi, {user?.userInfo?.userName}</p>
                      <p className="text-xs ">{user?.userInfo?.userEmail}</p>
                    </div>

                    {role === "student" ? (
                      <Link
                        onClick={() => setProfileMenu(false)}
                        to="dashboard/home"
                        className="text-nowrap text-textWhite text-sm bg-backgroundBlue hover:bg-backgroundBlueHover border border-borderLight whitespace-nowrap w-full rounded-xl p-2 flex items-center  gap-2"
                      >
                        <span className="text-2xl">{/* <BiCreditCardFront /> */}</span>
                        <span>Dashboard</span>
                      </Link>
                    ) : (
                      <>
                        {role === "Teacher" ? (
                          <Link
                            onClick={() => setProfileMenu(false)}
                            to="/teacher-dashboard"
                            className="text-nowrap text-textWhite text-sm bg-backgroundBlue hover:bg-backgroundBlueHover border border-borderLight whitespace-nowrap w-full rounded-xl p-2 flex items-center  gap-2"
                          >
                            <span className="text-2xl">{/* <BiCreditCardFront /> */}</span>
                            <span>Dashboard</span>
                          </Link>
                        ) : (
                          <Link
                            onClick={() => setProfileMenu(false)}
                            to="/admin-dashboard"
                            className="text-nowrap text-textWhite text-sm bg-backgroundBlue hover:bg-backgroundBlueHover border border-borderLight whitespace-nowrap w-full rounded-xl p-2 flex items-center  gap-2"
                          >
                            <span className="text-2xl">{/* <BiCreditCardFront /> */}</span>
                            <span>Dashboard</span>
                          </Link>
                        )}
                      </>
                    )}

                    <Link
                      onClick={() => setProfileMenu(false)}
                      to="/manage-account/overview"
                      className="text-nowrap text-textWhite text-sm bg-backgroundBlue hover:bg-backgroundBlueHover border border-borderLight whitespace-nowrap w-full rounded-xl p-2 flex items-center  gap-2"
                    >
                      <span className="text-2xl">{/* <IoOptions /> */}</span>
                      <span>Manage account</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-sm bg-red-500 hover:bg-red-600 text-textWhite border border-border whitespace-nowrap w-full rounded-xl p-2 flex items-center  gap-2"
                    >
                      <span className="text-2xl">{/* <IoExitOutline /> */}</span>
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="sign-in"
                className="text-nowrap w-fit bg-backgroundBlue hover:bg-backgroundBlueHover text-textWhite p-1 sm:p-2 rounded-md font-medium flex gap-1 items-center justify-center"
              >
                <span className="text-2xl">{/* <IoEnterOutline /> */}</span>
                <span>Sign In</span>
              </Link>
            )}

            {/* Search button  */}
            <button
              onClick={() => setSearchBarOpen(true)}
              className="h-8 w-8 sm:h-9 sm:w-9 m-auto p-1 sm:hidden md:flex lg:hidden bg-blue-500 hover:bg-blue-600 border border-borderLight rounded-full"
            >
              <IoSearchOutline className="text-2xl text-textWhite w-full m-auto" />
            </button>

            {/* Theme Switch */}
            <Darkmode />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
