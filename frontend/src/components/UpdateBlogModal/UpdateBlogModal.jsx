import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import axiosSecure from "../../api/axiosSecure";
import PropTypes from "prop-types";

const UpdateBlogModal = ({ isOpen, onClose, blogData, onUpdate, refetch }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    date: "",
    name: "",
    email: "",
    time: "",
  });

  useEffect(() => {
    if (isOpen && blogData) {
      setFormData(blogData);
    }
  }, [isOpen, blogData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosSecure.put(`/blog/updateBlogPost/${blogData._id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response.data);
      // Check if the response was successful
      if (response.status === 200) {
        const updatedPost = response.data;
        onUpdate(updatedPost);
        toast.success("Blog post updated successfully!");
        onClose();
        refetch();
      } else {
        toast.error("Failed to update the blog post");
      }
    } catch (error) {
      // Catch and handle any errors
      toast.error("Failed to update the blog post: " + error.message);
      console.error("Error while updating the blog post", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded shadow-md w-full max-w-lg md:max-w-2xl lg:max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Update Blog Post</h2>
          <button onClick={onClose} className="focus:outline-none">
            <AiOutlineClose className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
UpdateBlogModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  blogData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    image: PropTypes.string,
    date: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    time: PropTypes.string, // Time is optional
  }),
  onUpdate: PropTypes.func,
  refetch: PropTypes.func,
};
export default UpdateBlogModal;
