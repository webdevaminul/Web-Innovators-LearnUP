import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../utils/Loader";
import axiosSecure from "../../../api/axiosSecure";
import useAllUser from "../../../api/useAllUser";
import useAllTeacher from "../../../api/useAllTeacher";

const UserManage = () => {
  const { users } = useAllUser();
  const allStudents = users.filter((std) => std.userRole === "student");
  // console.table(users);
  const [activeTab, setActiveTab] = useState(1);
  const [status, setStatus] = useState("Pending");
  const { teachers, isLoading, refetch } = useAllTeacher(status);
  // user role update
  const handleUpdateRole = async (id) => {
    const status = "Approved"; // Fixed typo from "Aproved" to "Approved"
    const userNewRole = "Teacher";
    const updateData = { status, userNewRole };

    try {
      const res = await axiosSecure.put(`/approved/teacher/${id}`, updateData);

      // Check if the response is acknowledged
      if (res?.data?.result?.acknowledged) {
        toast.success(res?.data?.message);
        refetch();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update role");
    }
  };

  const teacherState = (index) => {
    setActiveTab(index);
    if (index === 1) {
      setStatus("Pending");
    } else if (index === 2) {
      setStatus("Approved");
    } else if (index === 3) {
      // all user
    }
  };

  const handleDeclineRole = () => {
    toast.warn("Not yet done");
  };
  // console.log("status",status)
  if (isLoading) {
    return <Loader />;
  }
  if (!teachers.length) {
    return <p className="flex h-screen justify-center items-center"> No User Yet </p>;
  }
  return (
    <>
      <div className="p-8 mb-4 flex items-center gap-5 justify-start ">
        <ul className="flex items-center ">
          <li
            className={`${
              activeTab === 1 &&
              " !border-border !border-t-2 !border-l-2 !border-r-2 !border-b-transparent rounded-tr rounded-tl"
            } px-6 py-2 !border-[#d1d1d1] border-b text-xl text-text transition duration-300 border-transparent cursor-pointer`}
            onClick={() => teacherState(1)}
          >
            Pending Request
          </li>
          <li
            className={`${
              activeTab === 2 &&
              " !border-border !border-t-2 !border-l-2 !border-r-2 !border-b-transparent rounded-tr rounded-tl"
            } px-6 py-2 !border-border border-b text-xl text-text transition duration-300 cursor-pointer`}
            onClick={() => teacherState(2)}
          >
            Already Teacher
          </li>
          <li
            className={`${
              activeTab === 3 &&
              " !border-border !border-t-2 !border-l-2 !border-r-2 !border-b-transparent rounded-tr rounded-tl"
            } px-6 py-2 !border-border border-b text-xl text-text transition duration-300 cursor-pointer`}
            onClick={() => teacherState(3)}
          >
            All Students
          </li>
        </ul>
      </div>

      {/* Teacher list here */}

      {activeTab === 3 ? (
        <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
          <thead className="bg-backgroundPrimary">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider"
              >
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {allStudents?.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center">
                    <span className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={user.userPhoto} />
                    </span>
                    <span className="ml-4">
                      <span className="text-sm flex flex-col font-medium text-text">
                        {user.userName}
                      </span>
                      <span className="text-sm text-text">{user.userEmail}</span>
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text">{user.userEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Learning process
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text">{user.userRole}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
          <thead className="bg-backgroundPrimary">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider"
              >
                Name and Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider"
              >
                Institute
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-backgroundPrimary divide-y divide-gray-200">
            {teachers?.map((teacher) => (
              <tr key={teacher._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center">
                    <span className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={teacher.userPhoto} />
                    </span>
                    <span className="ml-4">
                      <span className="text-sm flex flex-col font-medium text-gray-900">
                        {teacher.userName}
                      </span>
                      <span className="text-sm text-text">{teacher.userEmail}</span>
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text">
                  Regional Paradigm Technician
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {teacher.status ? teacher.status : "student yet"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                  {teacher.userRole}
                </td>
                <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                  {teacher.status && teacher.status === "Pending" ? (
                    <>
                      <button
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 hover:bg-green-400 text-green-800"
                        onClick={() => handleUpdateRole(teacher._id)}
                      >
                        {" "}
                        Accept{" "}
                      </button>

                      <button
                        className="ml-2 text-red-600 hover:text-red-900"
                        onClick={handleDeclineRole}
                      >
                        {" "}
                        Reject{" "}
                      </button>
                    </>
                  ) : teacher.status === "Approved" ? (
                    "Approved"
                  ) : (
                    "Pending"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default UserManage;
