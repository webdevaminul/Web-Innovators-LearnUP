// BlogPostCreation.js
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axiosSecure from "../../../api/axiosSecure";

const BlogCreation = () => {
  const { user } = useSelector((state) => state.authUsers);
  const [category, setCategory] = useState("General");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const name = user?.userInfo?.userName;
  const email = user?.userInfo?.userEmail;
  const userPhoto = user?.userInfo?.userPhoto;
  const status = "pending";

  const categories = ["General", "Technology", "Health", "Education", "Entertainment"];

  //  Here image preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // Generate a preview URL
    const previewURL = URL.createObjectURL(file);
    setPreviewUrl(previewURL);
  };

  //   Form Data here
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const form = event.target;

    const title = form.title.value;
    const description = form.description.value;
    const time = form.time.value;
    const image = form.image.files[0];

    // name, email, title, descrip, category, time, image, userPhoto, time
    const formData = new FormData();
    formData.append("title", title || " ");
    formData.append("description", description || " ");
    formData.append("category", category || " ");
    formData.append("blogImage", image || " ");
    formData.append("userPicture", userPhoto || " ");
    formData.append("userName", name || " ");
    formData.append("userEmail", email || " ");
    formData.append("time", time || " ");
    formData.append("status", status || " ");

    try {
      // Sending POST request with Axios
      axiosSecure
        .post("/blog/createBlog", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file upload
          },
        })
        .then((response) => {
          if (response?.data?.postId) {
            toast.success(response.data.message);
            toast.success(response.data.message2);
            form.reset();
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error Creating Blog:", error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create New Blog Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="shadow-md appearance-none border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="shadow-md appearance-none border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="shadow-md appearance-none border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 relative">
            <label className="form-control text-text">
              Blog cover picture
              <input
                required
                onChange={handleImageChange}
                type="file"
                accept="image/*"
                name="image"
                className="border-2 border-border"
              />
            </label>

            <div className="absolute bottom-0 right-0 ">
              <div className="text-left">
                {previewUrl === "" ? (
                  "image preview"
                ) : (
                  <img className="w-20 border rounded-sm" src={previewUrl} alt="" />
                )}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="time">
              Time
            </label>
            <input
              type="text"
              id="time"
              name="time"
              className="shadow-md appearance-none border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`${
                loading ? "bg-gray-400 !cursor-not-allowed " : "bg-violet-600 hover:bg-violet-700"
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Blog Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogCreation;
