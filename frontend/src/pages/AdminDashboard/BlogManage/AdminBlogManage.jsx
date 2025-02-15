import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineDelete, AiOutlineCheck } from "react-icons/ai";
import useBlogPost from "../../../api/useBlogPost";
import axiosSecure from "../../../api/axiosSecure";
import Loader from "../../../utils/Loader";

const AdminBlogManage = () => {
  const status = "approved";
  const { blogs, isLoading, refetch } = useBlogPost();

  const handleDelete = async (id) => {
    try {
      // Show confirmation alert before deletion
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this blog !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      // If user confirms, proceed with deletion
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/blog/deleteBlogPost/${id}`);

        // Handle success response from the backend
        if (res.status === 200) {
          // Show success alert
          Swal.fire({
            title: "Deleted!",
            text: res.data.message,
            icon: "success",
          });

          // Show toast notification for deletion success
          toast.success(res.data.message || "Course deleted successfully!");

          // Refetch or update course list
          refetch();
        }
      }
    } catch (error) {
      // Show error toast if deletion fails
      toast.error("Failed to delete course: " + error.message);
    }
  };

  const handleApproval = async (id) => {
    try {
      const res = await axiosSecure.put(`/blog/updateStatus/${id}`, {
        status,
      });

      console.log("res", res);
      // Check if the response is acknowledged
      if (res?.data?.result?.acknowledged) {
        toast.success(res?.data?.message);
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update status`);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="overflow-x-auto h-screen">
      {toast.visible && (
        <div className="fixed top-0 right-0 m-4 p-3 bg-green-500 text-white rounded shadow-lg">
          {toast.message}
        </div>
      )}
      <table className="min-w-full border-collapse border border-border">
        <thead>
          <tr>
            <th className="border border-border text-text px-4 py-2">Image</th>
            <th className="border border-border text-text px-4 py-2">Title</th>
            <th className="border border-border text-text px-4 py-2">Date & Time</th>
            <th className="border border-border text-text px-4 py-2">Status</th>
            <th className="border border-border text-text px-4 py-2">Actions</th>
            <th className="border border-border text-text px-4 py-2">Approval</th>
          </tr>
        </thead>
        <tbody>
          {blogs?.map((post) => (
            <tr key={post._id}>
              <td className="border border-border px-4 py-2">
                <img className="w-16 h-16 object-cover" src={post?.image} alt={post.title} />
              </td>
              <td className="border border-border px-4 py-2"> {post.title} </td>
              <td className="border border-border px-4 py-2">
                {new Date(post.date).toLocaleString()}
              </td>
              <td className="border border-border px-4 py-2">{post.status}</td>
              <td className="border border-border px-4 py-2">
                <span className="flex items-center justify-center space-x-4">
                  <Link to={`/blog-details/${post._id}`}>
                    <AiOutlineEye className="text-2xl text-blue-600" />
                  </Link>
                  <button onClick={() => handleDelete(post._id)}>
                    <AiOutlineDelete className="text-2xl text-red-600" />
                  </button>
                </span>
              </td>
              <td className="border border-border px-4 py-2 justify-center">
                {post.status === "approved" ? (
                  <AiOutlineCheck className="text-green-600 text-2xl" /> // Show approved icon
                ) : (
                  <button
                    onClick={() => handleApproval(post._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBlogManage;
