import { useState } from "react";
import Heading from "../../utils/Heading";
import { useSelector } from "react-redux";
import axiosSecure from "../../api/axiosSecure";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../utils/CustomModal";
// import { getMonthName } from "../../utils/GetMontName";
import { categories } from "../../utils/category";

const BeInstructor = () => {
  const { user } = useSelector((state) => state.authUsers);
  const [selectedOption, setSelectedOption] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [text, setText] = useState("");
  const allCategory = categories;

  const email = user?.userInfo.userEmail || "";
  const name = user?.userInfo.userName || "";
  const id = user?.userInfo._id || "";
  const navigate = useNavigate();

  const role = user?.userInfo?.userRole;
  const teacherJoinMonth = "November";

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = e.target;
    const institute = data.instName.value;
    const message = data.message.value;
    const status = "Pending";

    const updateData = {
      name,
      email,
      status,
      institute,
      message,
      selectedOption,
      teacherJoinMonth,
    };

    if (user) {
      if (role === "Admin") {
        setModalMessage("You are is an admin.");
        setText("Do you want to log in?");
        return setModalOpen(true); // Open warning modal
      }

      axiosSecure
        .put(`/be/instructor/${id}`, updateData)
        .then((res) => {
          if (res.status === 200) {
            toast.success(res?.data?.message);
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setModalMessage("You are not logged in.");
      setModalOpen(true); // Open warning modal
    }
  };

  return (
    <div>
      <Heading heading={"Become a teacher"} />

      {/* Breadcumb in here */}
      <div className="bg-black py-14">
        <h1 className="text-white md:text-5xl text-3xl md:mx-12 mx-5 px-4 font-bai font-semibold border-l-[3px] border-secondary ">
          Become a Teacher{" "}
        </h1>
      </div>

      {/* Main section in here */}
      <div>
        <div className="px-8 md:my-10 my-5 mx-auto">
          <h1 className="font-semibold font-bai md:text-4xl text-2xl md:my-10">
            Apply as an Instructor in Learn Up{" "}
          </h1>

          <p>
            Online courses are getting popular really fast. This fact is not only an opportunity for
            the students but also an opportunity for teachers and professionals. Through online
            platform, teachers can get more reach and share their knowledge with the students of the
            world. Professionals can also take this opportunity to share their knowledge and
            expertise with others. GoEdu provides both groups with an online platform and all the
            necessary support to getting started with this trend and become successful.
          </p>
        </div>
      </div>

      {/* Process and guide line */}
      <div className="md:px-8 px-3 md:my-10 my-5">
        <h1 className="font-semibold font-bai md:text-4xl text-2xl md:mt-10 md:mb-4 my-5 py-5">
          Process and Submission Guidelines{" "}
        </h1>

        {/* Apply intructor guide line */}
        <div>
          <h1 className="font-bai my-3">To apply as an instructor, follow the process below:</h1>

          <ol className="ml-5 list-decimal">
            <li className="font-bai text-text">
              {" "}
              Prepare your course contents as per the requirements{" "}
            </li>
            <li className="font-bai text-text">
              {" "}
              Accumulate course title, short description, course requirements, course outline,
              lesson video contents, MCQ-based questions with options and answers, instructor
              profile, digital signature, and instructor photograph under a single Google Drive
              folder.{" "}
            </li>
            <li className="font-bai text-text">
              {" "}
              Make sure the drive folder is shared for public view.{" "}
            </li>
            <li className="font-bai text-text"> Submit the form. </li>
          </ol>
        </div>

        {/* submission checlist */}
        <div className="mt-6 md:ml-3">
          <h1 className="font-bai font-bold text-3xl my-3">Submission Checklist:</h1>

          <ol className="ml-5 list-decimal">
            <li className="font-bai text-text"> Course Title </li>
            <li className="font-bai text-text">
              {" "}
              Course Short Description (Course benefits, Requirements){" "}
            </li>
            <li className="font-bai text-text"> Course Outlines (Units and Lessons) </li>
            <li className="font-bai text-text">
              {" "}
              Lessons Videos (Include separate introduction and conclusion videos)
            </li>
            <li className="font-bai text-text"> Lesson Transcripts (if available). </li>
            <li className="font-bai text-text"> Reference Materials/Exercise Files (optional). </li>
            <li className="font-bai text-text">
              {" "}
              A set of MCQ-based questions with answers and options for the total course assessment
              (Depending on the course’s total lessons. Minimum of 15-20 questions).{" "}
            </li>
            <li className="font-bai text-text"> Instructor Short Profile </li>
            <li className="font-bai text-text"> Instructor’s Digital Signature</li>
            <li className="font-bai text-text">Instructor’s Photograph</li>
          </ol>
        </div>

        {/* Policy */}
        <div className="mt-6 md:ml-3">
          <h1 className="font-bai font-bold text-3xl my-3">
            Policy on the Use of AI Tools for Course-Making
          </h1>
          <h1 className="font-bai font-bold text-2xl my-3">Introduction</h1>
          <p>
            Our platform is dedicated to providing high-quality, original, and personalized
            educational content. We value the hard work and expertise of our instructors. As such,
            we have implemented the following policy to ensure the integrity and authenticity of our
            courses.
          </p>
          <h1 className="font-bai font-bold text-2xl my-3">Use of AI Tools</h1>
          <p>
            We acknowledge the potential of AI tools like ChatGPT in assisting with course creation.
            However, we believe that these tools should be used responsibly to maintain the quality
            and originality of our courses.
          </p>
        </div>

        {/* Permission */}
        <div className="mt-6 md:ml-3">
          <h1 className="font-bai font-bold text-xl my-3">Permitted Use</h1>
          <p>Instructors are allowed to use AI tools for:</p>

          <ol className="ml-5 list-decimal ">
            <li className="font-bai text-text"> Generating ideas for course content. </li>
            <li className="font-bai text-text"> Refining the structure of the course. </li>
            <li className="font-bai text-text"> Preparing course assessment questionnaires.</li>
          </ol>
          <p className="my-3">
            Instructors are expected to personalize AI-generated content with their own experiences
            and perspectives.
          </p>
          <p className="my-3">
            Instructors may use AI-generated voices for narration if the content is not generated by
            AI and they need aid in correct pronunciation and clear audio instructions. In such
            cases, this must be clearly mentioned in the course description and in the content.
          </p>
          <p className="my-3">
            If any visual content is generated with the help of AI, instructors need to make sure
            that the tool provides the right to distribute and use the visuals commercially.
          </p>
        </div>

        {/* Prohibit */}
        <div className="mt-6 md:ml-3">
          <h1 className="font-bai font-bold text-xl my-3">Prohibited Use</h1>
          <p>Instructors are allowed to use AI tools for:</p>

          <ol className="ml-5 list-decimal">
            <li className="font-bai text-text"> Generating ideas for course content. </li>
            <li className="font-bai text-text"> Refining the structure of the course. </li>
            <li className="font-bai text-text"> Preparing course assessment questionnaires.</li>
          </ol>
        </div>
        {/* Approval */}
        <div className="mt-6 md:ml-3">
          <h1 className="font-bai font-bold text-3xl my-3">Course Review and Approval</h1>
          <p>
            All courses will undergo a review process. Courses found to violate this policy will not
            be published.
          </p>
          <h1 className="font-bai font-bold text-2xl my-3">Conclusion</h1>
          <p>
            We believe this policy will help maintain the quality and authenticity of our courses
            while still allowing instructors to benefit from the use of AI tools. We appreciate your
            understanding and cooperation.
          </p>
        </div>
      </div>

      {/* Submission Form */}
      <div className="md:grid grid-cols-2 gap-5 md:mx-12 mx-5">
        <div className="grid-cols-1">
          <aside className="">
            <div className="p-8 rounded">
              <h2 className="text-base">Learn Up</h2>
              <h2 className="font-bold text-4xl my-6 ">Teach. Inspire. Transform.</h2>
              <p>
                Streamline your teaching with <strong>Learn Up</strong> all-in-one platform. Manage
                classrooms efficiently, personalize learning paths, use real-time analytics, and
                motivate students with interactive coding challenges, all in one place. Teach.
                Inspire. Transform.
              </p>
            </div>
          </aside>
        </div>

        {/* Form section */}
        <div className="grid-cols-1 border p-5 my-10 shadow rounded-md">
          <form onSubmit={handleFormSubmit}>
            {/* Name and email part */}
            <div className="md:flex gap-4">
              <div className="md:w-1/2">
                <label className="block text-text font-semibold" htmlFor="name">
                  Name
                </label>
                <input
                  className="w-full shadow-inner bg-inputBg rounded-lg p-2 border-none block mt-1"
                  id="name"
                  type="text"
                  name="name"
                  readOnly={user ? true : false}
                  placeholder={name === "" ? "Your name" : name}
                />
              </div>
              <div className="md:w-1/2">
                <label className="block text-text font-semibold" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow-inner bg-inputBg rounded-lg p-2 border-none mt-1 w-full block"
                  id="email"
                  type="email"
                  name="email"
                  readOnly={user ? true : false}
                  placeholder={email === "" ? "Your Email" : email}
                />
              </div>
            </div>
            {/* Institue and good at part */}
            <div className="md:flex gap-4 md:my-5 ">
              <div className="md:w-1/2">
                <label className="block text-text font-semibold" htmlFor="instName">
                  Institute Name
                </label>
                <input
                  className="w-full shadow-inner bg-inputBg rounded-lg p-2 border-none block mt-1"
                  id="instName"
                  type="text"
                  name="instName"
                  required="required"
                  placeholder="Type Institute Name"
                />
              </div>
              <div className="md:w-1/2">
                <label className="block text-text font-semibold">Effeciency at</label>
                <select
                  className="select select-ghost max-w-xs shadow-inner bg-inputBg rounded-lg p-2 border-none mt-1 w-full block"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  <option value="" disabled>
                    {" "}
                    Select Category{" "}
                  </option>
                  {allCategory.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-text font-semibold" htmlFor="message">
                Message
              </label>
              <textarea
                className="w-full rounded-lg h-20 p-2 bg-inputBg"
                name="message"
                id="message"
                placeholder="write here about you ..."
              ></textarea>
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-text hover:text-white bg-secondary hover:bg-slate-700 md:py-3 md:text-lg md:px-10"
              >
                Submit
              </button>
            </div>
          </form>
          {modalOpen && (
            <CustomModal
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              message={modalMessage}
              text={text}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BeInstructor;
