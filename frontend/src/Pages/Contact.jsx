import { useState } from "react";
import VITE_DATA from "../config/config";
import axios from "axios";
import { toast } from "react-toastify";

function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    query: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${VITE_DATA}/users/contactus`, {
        usercontact_name: formData.name,
        usercontact_email: formData.email,
        usercontact_mobile: formData.mobile,
        usercontact_query: formData.query,
      });

      if (response.data) {
        toast.success("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          query: ""
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-center bg-blue-600 shadow-lg">
        <div className="w-[80%] py-12 md:py-25">
          <div className="pl-4 border-l-4 border-white">
            <h3 className="text-white font-bold text-2xl ml-2">
              📞 Contact Us
            </h3>
            <p className="text-white font-bold text-lg ml-4 ">
              Home /{" "}
              <span className="text-white font-light text-sm">Contact Us</span>
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="flex justify-center pt-10 bg-gray-50">
        <div className="w-[80%] grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left: Contact Info */}
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col h-full">
            <h2 className="text-xl font-bold text-blue-700 text-center mb-4">
              📬 Reach Us At
            </h2>
            <div className="space-y-5 flex-grow">
              {/* Contact */}
              <div className="flex items-start gap-3">
                <div className="text-2xl mt-1">📱</div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">
                    Contact
                  </h3>
                  <p className="text-sm text-gray-700">+91 9430608622</p>
                  <p className="text-sm text-gray-700">+91 8252460046</p>
                  <p className="text-sm text-gray-700">+91 9905886633</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="text-2xl mt-1">📧</div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">
                    Mail
                  </h3>
                  <p className="text-sm text-gray-700">
                    support@eleedomimf.com
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="text-2xl mt-1">📍</div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">
                    Location
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    607, 6th Floor, B-block <br />
                    Gagan Apartment, Exhibition Road Chauraha <br />
                    Patna, Bihar - 800001, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
              📝 Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  👤 Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📩 Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📞 Contact Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  💬 Drop Your Query
                </label>
                <textarea
                  name="query"
                  value={formData.query}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Your message here..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                ></textarea>
              </div>

              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-blue-600 hover:bg-blue-800 text-white font-medium px-6 py-2 text-sm rounded-full transition duration-300 ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    '🚀 Send Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-0">
        <div className="w-[100%]  ">
          <div>
            <div style={{ position: "relative" }}>
              <div
              className="rounded-3xl"
                style={{
                  position: "relative",
                  paddingBottom: "40.25%", // 16:9 aspect ratio
                  height: 0,
                  overflow: "hidden",
                }}
              >
                <iframe
                  style={{
                    position: "absolute",
                    top: 35,
                    left: 0,
                    bottom:10,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}

                  
                  loading="lazy"
                  allowFullScreen
                  src="https://maps.google.com/maps?q=Gagan+Apartment+Exhibition+Rd%2C+Old+Jakkanpur%2C+Lodipur%2C+Patna%2C+Bihar+800001&output=embed"
                  title="Google Map"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
