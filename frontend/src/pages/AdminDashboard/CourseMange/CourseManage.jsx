import { MdBlock } from "react-icons/md";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import useAllCourse from "../../../api/useAllCourse";
import axiosSecure from "../../../api/axiosSecure";
import Loader from "../../../utils/Loader";

const CourseManage = () => {
  const status = "pending";
  const { courses, isLoading, refetch } = useAllCourse({ status });

  const updateCourseStatus = async (id, status) => {
    try {
      const res = await axiosSecure.put(`/approve/courses/${id}`, {
        updateStatus: status,
      });

      // Check if the response is acknowledged
      if (res?.data?.data?.acknowledged) {
        toast.success(res?.data?.message);
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update status to ${status}`);
    }
  };

  // For approving a course
  const handleApproved = (id) => {
    updateCourseStatus(id, "approved");
  };

  // For rejecting a course
  const handleRejected = (id) => {
    updateCourseStatus(id, "rejected");
  };

  if (isLoading) return <Loader />;
  if (!courses?.length)
    return (
      <p className="calc(h-screen-[45px]) flex justify-center items-center">No Data available</p>
    );

  return (
    <div className="overflow-x-auto w-full px-2 py-5">
      <table className="w-full">
        <thead>
          <tr className="bg-backgroundPrimary/10">
            <th className="py-4 pr-6 text-left text-text font-bold uppercase">Name</th>
            <th className="py-4 pr-6 text-left text-text font-bold uppercase">Category</th>
            <th className="py-4 pr-6 text-left text-text font-bold uppercase">Price</th>
            <th className="py-4 pr-6 text-left text-text font-bold uppercase">Status</th>
            <th className="py-4 pr-6 text-left text-text font-bold uppercase">Action</th>
          </tr>
        </thead>
        <tbody className="bg-backgroundPrimary overflow-x-auto">
          {courses?.map((course) => (
            <tr key={course._id}>
              <td className="flex items-center gap-3">
                <span className="avatar">
                  <span className="mask mask-squircle h-12 w-12">
                    <img src={course?.coverPicture} alt={course.title} />
                  </span>
                </span>
                <span>{course.title}</span>
              </td>
              <td className="border-b truncate">{course.category}</td>
              <td className="border-b"> {course.price} </td>
              <td className="border-b">{course.status}</td>
              <td className="py-4 px-6 border-b border-gray-200 flex gap-2">
                <span
                  onClick={() => handleApproved(course._id)}
                  className="text-text cursor-pointer rounded-full text-xs tooltip"
                  data-tip="Approved"
                >
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                </span>
                <span
                  onClick={() => handleRejected(course._id)}
                  className="text-text cursor-pointer rounded-full text-xs tooltip"
                  data-tip="Rejected"
                >
                  <MdBlock className="w-5 h-5 text-red-600" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseManage;
