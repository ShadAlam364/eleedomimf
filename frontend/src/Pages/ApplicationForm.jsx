// pages/ApplicationForm.jsx
import { useParams } from "react-router-dom";

function ApplicationForm() {
  const { position } = useParams();

  // Optional: convert slug to readable format
  const readablePosition = position
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-center bg-blue-600 shadow-lg">
        <div className="w-[80%] py-12 md:py-25">
          <div className="pl-2 border-l-4 border-white">
            <div className="flex items-center gap-2 ml-4">
              <span className="text-2xl">📝</span> {/* Emoji before text */}
              <h3 className="text-white font-bold text-2xl">{readablePosition}</h3>
            </div>
            <h3 className="text-white font-bold text-lg ml-4 ">
              Home /{" "}
              <span className="text-white font-light text-sm">{readablePosition}</span>
            </h3>
          </div>
        </div>
      </div>



      <div className="flex justify-center">
        <div className="w-[80%]">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
              Apply for: {readablePosition}
            </h2>

            {/* You can now use `position` in your form */}
            <form>
              <input type="hidden" name="position" value={readablePosition} />

              {/* Rest of your form fields here */}
            </form>
          </div>
        </div>
      </div>




      {/* Feedback Form Section */}
      <div className="flex justify-center bg-gray-50 py-12">
        <div className="w-[80%] bg-white shadow-xl rounded-2xl p-8 animate-fadeIn">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-2">
              <span role="img" aria-label="thumbs-up">
                
              </span>{" "}
              {/* Emoji before text */}
              We Value Your Information For {readablePosition}
            </h2>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <span role="img" aria-label="person">
                  👤
                </span>{" "}
                {/* Emoji before text */}
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <span role="img" aria-label="email">
                  📧
                </span>{" "}
                {/* Emoji before text */}
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <span role="img" aria-label="telephone">
                  📞
                </span>{" "}
                {/* Emoji before text */}
                Contact Number
              </label>
              <input
                type="tel"
                placeholder="Enter your contact number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <span role="img" aria-label="image">
                  🖼️
                </span>{" "}
                {/* Emoji before text */}
                Age
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
              />
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <span role="img" aria-label="memo">
                  📝
                </span>{" "}
                {/* Emoji before text */}
                Your Message
              </label>
              <textarea
                rows="5"
                placeholder="Write your feedback here..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold px-10 py-3 rounded-full hover:bg-blue-800 transition-transform transform hover:scale-105 duration-300"
              >
                <span role="img" aria-label="paper-plane">
                  🚀
                </span>{" "}
                {/* Emoji before text */}
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ApplicationForm;
