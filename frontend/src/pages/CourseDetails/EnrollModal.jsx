import React from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axiosSecure from "../../api/axiosSecure";

const EnrollModal = ({ toggleModal, courseId, courseTitle }) => {
  const { user } = useSelector((state) => state.authUsers);
  const email = user.userInfo?.userEmail;
  const studentId = user.userInfo?._id;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    data.courseId = courseId;
    data.studentEmail = email;
    data.courseTitle = courseTitle;
    console.log(email, studentId);
    try {
      // Sending POST request with Axios
      axiosSecure
        .post("/enroll", data, {})
        .then((res) => {
          const url = res.data?.url;
          window.location.replace(url);
        })
        .catch((error) => {
          console.error("Error Creating Course:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-10 mt-[3.8rem]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Enroll in the Course</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Your Full Name</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter your full name"
              defaultValue={user.userInfo.userName}
              {...register("name", { required: true })}
            />
            {errors.name && <span className="text-red-500">Name is required</span>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Your Phone</label>
            <input
              type="number"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter your phone"
              {...register("phone", { required: true })}
            />
            {errors.phone && <span className="text-red-500">Phone is required</span>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Your address"
              {...register("address", { required: true })}
            />
            {errors.address && <span className="text-red-500">Address is required</span>}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            Confirm Enrollment
          </button>
        </form>

        <button
          onClick={toggleModal}
          className="mt-4 w-full text-gray-600 py-2 rounded-md border hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EnrollModal;
