import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import VITE_DATA from "../config/config";

function Feedbacks() {
  const [feedbackuser_name, setFeedbackUserName] = useState("");
  const [feedbackuser_email, setFeedbackUserEmail] = useState("");
  const [feedbackuser_mobile, setFeedbackUserMobile] = useState("");
  const [feedbackuser_query, setFeedbackUserQuery] = useState("");
  const [feedbackuser_upload, setFeedbackUserUpload] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("feedbackuser_name", feedbackuser_name);
      formData.append("feedbackuser_email", feedbackuser_email);
      formData.append("feedbackuser_mobile", feedbackuser_mobile);
      formData.append("feedbackuser_query", feedbackuser_query);
      formData.append("feedbackuser_upload", feedbackuser_upload);

      await axios.post(`${VITE_DATA}/users/feedback`, formData);

      // Clear form fields after successful submission
      setFeedbackUserName("");
      setFeedbackUserEmail("");
      setFeedbackUserMobile("");
      setFeedbackUserQuery("");
      setFeedbackUserUpload(null);
      toast.success("Feedback submitted successfully!");
    } catch (error) {
      toast.error("Error submitting feedback");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setFeedbackUserUpload(selectedImage);
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-center bg-blue-600 shadow-lg">
        <div className="w-[80%] py-12 md:py-25">
          <div className="pl-2 border-l-4 border-white">
            <div className="flex items-center gap-2 ml-4">
              <span className="text-2xl">📝</span> {/* Emoji before text */}
              <h3 className="text-white font-bold text-2xl ">Feedback</h3>
            </div>
            <h3 className="text-white font-bold text-lg ml-4 ">
              Home / <span className="text-white font-light text-sm">Feedback</span>
            </h3>
          </div>
        </div>
      </div>
      

      {/* Feedback Form Section */}
      <div className="flex justify-center bg-gray-50 py-12">
        <div className="w-[80%] bg-white shadow-xl rounded-2xl p-8 animate-fadeIn">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-2">
              <span role="img" aria-label="thumbs-up">👍</span> {/* Emoji before text */}
              We Value Your Feedback!
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <span role="img" aria-label="person">👤</span> {/* Emoji before text */}
                Full Name
              </label>
              <input
                type="text"
                value={feedbackuser_name}
                onChange={(e) => setFeedbackUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <span role="img" aria-label="email">📧</span> {/* Emoji before text */}
                Email Address
              </label>
              <input
                type="email"
                value={feedbackuser_email}
                onChange={(e) => setFeedbackUserEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <span role="img" aria-label="telephone">📞</span> {/* Emoji before text */}
                Contact Number
              </label>
              <input
                type="tel"
                value={feedbackuser_mobile}
                onChange={(e) => setFeedbackUserMobile(e.target.value)}
                placeholder="Enter your contact number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <span role="img" aria-label="image">🖼️</span> {/* Emoji before text */}
                Upload Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg px-4 file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
              />
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <span role="img" aria-label="memo">📝</span> {/* Emoji before text */}
                Your Message
              </label>
              <textarea
                value={feedbackuser_query}
                onChange={(e) => setFeedbackUserQuery(e.target.value)}
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
                disabled={loading}
                className={`bg-blue-600 text-white font-semibold px-10 py-3 rounded-full transition-transform duration-300 ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-800 hover:scale-105'
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <>
                    <span role="img" aria-label="paper-plane">🚀</span> {/* Emoji before text */}
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Feedbacks;
