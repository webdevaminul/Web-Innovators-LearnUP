import { useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axiosSecure from "../../../api/axiosSecure";

const CreateCourse = () => {
  const [category, setCategory] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [freePreviewIndex, setFreePreviewIndex] = useState(null);
  const { user } = useSelector((state) => state.authUsers);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoCount, setVideoCount] = useState(1);
  const name = user?.userInfo?.userName;
  const email = user?.userInfo?.userEmail;

  // Handle image file selection and generate preview URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const previewURL = URL.createObjectURL(file);
    setPreviewUrl(previewURL);
  };

  // Handler to set free preview
  const handleFreePreviewChange = (index) => {
    setFreePreviewIndex(index); // Allow only one video as free preview
  };

  // Function to add more video input fields
  const addMoreVideos = () => {
    setVideoCount((prevCount) => prevCount + 1);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    // FormData object to handle file and other data
    const form = e.target;
    const title = form.title.value;
    const price = parseFloat(form.price.value);
    const oldPrice = parseFloat(form.oldPrice.value);
    const detailsCourse = form.textarea.value;
    const status = "pending";
    const file = e.target.image.files[0];

    // Price validation
    if (price > oldPrice) {
      toast.warning("Old price should be greater than or equal to the price.");
      setLoading(false);
      return; // Exit the function if the validation fails
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("title", title);
    formData.append("price", price);
    formData.append("oldPrice", oldPrice);
    formData.append("status", status);
    formData.append("category", category);
    formData.append("detailsCourse", detailsCourse);

    if (file) {
      formData.append("image", file);
    }

    // Loop through video inputs
    for (let i = 0; i < videoCount; i++) {
      const videoFile = e.target[`video${i}`].files[0]; // Access video inputs dynamically
      if (videoFile) {
        formData.append("video", videoFile);
      }
    }

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file upload
        },
        onUploadProgress: (event) => {
          const percentComplete = Math.round((event.loaded * 100) / event.total);
          setProgress(percentComplete); // Update progress
        },
      };

      const response = await axiosSecure.post("/course/create", formData, config);
      console.log("response", response);
      if (response?.data?.courseId) {
        toast.success(response?.data?.message);
        setLoading(false);
        setProgress(100);
        setTimeout(() => setProgress(0), 500);
        setVideoCount(1);
        setPreviewUrl("");
        e.target.reset();
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 border-2 border-blue-400 rounded-lg">
      <form onSubmit={handleCreateCourse} className="p-8">
        {/* Progress bar */}
        {loading && (
          <>
            <h1>Depend on your network</h1>
            <div className="relative h-2 bg-gray-300 rounded-full overflow-hidden mt-2">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-blue-600 transition-all duration-150"
              ></div>
            </div>
          </>
        )}

        <div className="my-3 flex justify-between">
          <h1 className="text-center text-4xl text-text font-bold">Create a new course</h1>
          <button
            disabled={loading}
            type="submit"
            className={`cursor-pointer rounded-lg px-8 py-3 text-sm font-semibold text-white ${loading ? "bg-gray-400 !cursor-not-allowed" : "bg-backgroundBlue"}`}
          >
            {loading ? "loading..." : "Submit"}
          </button>
        </div>

        {/* Name and Email */}
        <div className="md:flex gap-4">
          <input
            readOnly
            className="mt-1 block md:w-1/2 w-full rounded-md border border-slate-300 bg-backgroundPrimary px-3 py-2 placeholder-placeholder shadow-sm placeholder:font-semibold focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
            placeholder={name}
          />
          <input
            readOnly
            className="mt-1 block md:w-1/2 w-full rounded-md border border-slate-300 bg-backgroundPrimary px-3 py-2 placeholder-placeholder shadow-sm placeholder:font-semibold focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
            placeholder={email}
          />
        </div>

        {/* Title and Category */}
        <div className="md:flex gap-4 my-4">
          <input
            // required
            type="text"
            name="title"
            className="mt-1 block md:w-1/2 w-full rounded-md border border-slate-300 bg-backgroundPrimary px-3 py-2 placeholder-placeholder shadow-sm placeholder:font-semibold focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
            placeholder="Your course title"
          />
          <select
            name="select"
            id="select"
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block md:w-1/2 w-full rounded-md border border-slate-300 bg-backgroundPrimary px-3 text-text py-2 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
          >
            <option className="font-semibold text-text">Please Select</option>
            <option className="font-semibold text-text">Language</option>
            <option className="font-semibold text-text">Marketing</option>
            <option className="font-semibold text-text">Photography</option>
            <option className="font-semibold text-text">Business</option>
            <option className="font-semibold text-text">Videography</option>
            <option className="font-semibold text-text">Design</option>
            <option className="font-semibold text-text">Fitness</option>
            <option className="font-semibold text-text">Development</option>
          </select>
        </div>

        {/* Discount Price and Regular Price */}
        <div className="md:my-6 md:flex gap-4">
          <input
            type="number"
            name="price"
            className="mt-1 block md:w-1/2 w-full rounded-md border border-slate-300 bg-backgroundPrimary px-3 py-2 placeholder-placeholder shadow-sm placeholder:font-semibold focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
            placeholder="Your course discount price"
          />
          <input
            type="number"
            name="oldPrice"
            className="mt-1 block md:w-1/2 w-full rounded-md border border-slate-300 bg-backgroundPrimary px-3 py-2 placeholder-placeholder shadow-sm placeholder:font-semibold focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
            placeholder="Your course regular price"
          />
        </div>

        {/* Cover Picture */}
        <div className="md:my-6 relative">
          <label className="form-control text-text">
            Course cover picture
            <input
              // required
              onChange={handleFileChange}
              type="file"
              accept="image/*"
              name="image"
              className="border-2 border-border md:w-1/2"
            />
          </label>

          <div className="absolute bottom-0 right-0 ">
            <div className="text-left text-text">
              {previewUrl === "" ? (
                "image preview"
              ) : (
                <img className="w-20 border rounded-sm" src={previewUrl} alt="" />
              )}
            </div>
          </div>
        </div>

        {/* Video For Courses */}
        <div className="morevideo">
          <label className="block text-text font-medium">Upload Videos</label>

          {/* Render video inputs based on videoCount */}
          {Array.from({ length: videoCount }).map((_, index) => (
            <div key={index} className="mb-4 w-full">
              <input
                type="file"
                name={`video${index}`} // Name for each video input
                accept="video/*"
                className="border-2 border-border w-full mb-2"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={freePreviewIndex === index} // Checked if this video is free preview
                  onChange={() => handleFreePreviewChange(index)} // Update free preview selection
                  className="mr-2"
                />
                <label className="text-text">Set as Free Preview</label>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMoreVideos}
            className="mb-4 text-blue-600 hover:underline block"
          >
            Add More Lecture
          </button>
        </div>

        {/* Text area */}
        <div>
          <textarea
            name="textarea"
            id="text"
            cols={5}
            rows={5}
            className="mb-10 mt-5 w-full rounded-md border border-slate-300 p-5 text-text bg-backgroundPrimary placeholder-placeholder "
            placeholder="Details about this..."
          />
        </div>

        <div className="text-center">
          <button
            disabled={loading}
            type="submit"
            className={`cursor-pointer rounded-lg px-8 py-3 text-sm font-semibold text-white ${loading ? "bg-gray-400 !cursor-not-allowed" : "bg-backgroundBlue"}`}
          >
            {loading ? "loading..." : "Submit"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateCourse;
