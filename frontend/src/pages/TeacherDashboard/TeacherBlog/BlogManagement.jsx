import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Loader from "../../../utils/Loader";
import useBlogPost from "../../../api/useBlogPost";
import axiosSecure from "../../../api/axiosSecure";
import UpdateBlogModal from "../../../components/UpdateBlogModal/UpdateBlogModal";

const BlogPostTable = () => {
  const { blogs, isLoading, refetch } = useBlogPost();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    refetch();
  };

  if (isLoading) return <Loader />;
  if (!blogs?.length)
    return <p className="flex justify-center items-center h-screen">No Data available</p>;

  return (
    <div className="overflow-x-auto h-screen">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Image</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Date & Time</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs?.map((post) => (
            <tr key={post._id}>
              <td className="border border-gray-300 px-4 py-2">
                <img src={post?.image} alt={post.title} className="w-16 h-16 object-cover" />
              </td>
              <td className="border border-gray-300 px-4 py-2">{post.title}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(post.date).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <span className="flex items-center justify-center space-x-4">
                  <Link to={`/blog-details/${post._id}`}>
                    <AiOutlineEye className="text-2xl text-blue-600" />
                  </Link>
                  <button onClick={() => handleEdit(post)}>
                    <AiOutlineEdit className="text-2xl text-green-600" />
                  </button>
                  <button onClick={() => handleDelete(post._id)}>
                    <AiOutlineDelete className="text-2xl text-red-600" />
                  </button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UpdateBlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        blogData={selectedBlog}
        onUpdate={handleUpdate}
        refetch={refetch}
      />
    </div>
  );
};

export default BlogPostTable;
