import axios from "axios";
import { useEffect, useState } from "react";
import VITE_DATA from "../config/config";
import { toast } from "react-toastify";

function Career() {
   const [APIData, setAPIData] = useState([]);
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [branch, setBranch] = useState("");
    const [qualification, setQualification] = useState("");
    const [dates, setDates] = useState("");
    const [level, setLevel] = useState("");
    const [position, setPosition] = useState("");
    const [file, setFile] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    useEffect(() => {
      fetchBranchList();
    }, []);
  
    const fetchBranchList = async () => {
      try {
        const response = await axios.get(`${VITE_DATA}/api/branch-list`);
        setAPIData(response.data);
      } catch (error) {
        console.error("Error fetching branch list:", error);
        toast.error("Failed to fetch branch list");
      }
    };
  
    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (!selectedFile) {
        toast.error("No file selected.");
        return;
      }
  
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const base64String = event.target.result; // Get the Base64 string
        setFile(base64String);
      };
      // Read the file as a Data URL (Base64 string)
      reader.readAsDataURL(selectedFile);
    };
    const payload = {
      name,
      email,
      mobile,
      address,
      branch,
      qualification,
      applyDate: dates,
      level,
      position,
      pdfs: file, // Ensure `file` is Base64 or properly processed
    };
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          `${VITE_DATA}/users/career/posts`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) {
          toast.success("Application Submitted Successfully.....!");
          clearForm();
        } else {
          toast.error("Failed to submit application");
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data.message);
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const clearForm = () => {
      setName("");
      setEmail("");
      setMobile("");
      setAddress("");
      setBranch("");
      setQualification("");
      setDates("");
      setLevel("");
      setPosition("");
      setFile("");
    };
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-center bg-blue-600 shadow-lg">
        <div className="w-[80%] py-12 md:py-25">
          <div className="pl-4 border-l-4 border-white">
            <div className="flex items-center gap-2 ml-2">
              <span className="text-2xl">💼</span> {/* Emoji added here */}
              <h3 className="text-white font-bold text-2xl ">Career</h3>
            </div>

            <h3 className="text-white font-bold text-lg ml-2 ">
              Home /{" "}
              <span className="text-white font-light text-sm">Career</span>
            </h3>
          </div>
        </div>
      </div>



      {/* Career Form Section */}
      <div className="flex justify-center bg-gray-100 py-12">
        <div className="w-[80%] bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl text-blue-700 font-bold text-center mb-8">
            📬 Get in Touch
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* Name */}
  <div className="col-span-1">
    <label className="block font-semibold mb-2">👤 Full Name</label>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Enter your name"
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Email */}
  <div className="col-span-1">
    <label className="block font-semibold mb-2">📧 Email</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter your email"
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Phone */}
  <div className="col-span-1">
    <label className="block font-semibold mb-2">📞 Phone Number</label>
    <input
      type="tel"
      value={mobile}
      onChange={(e) => setMobile(e.target.value)}
      placeholder="Enter your phone number"
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Address */}
  <div className="col-span-1">
    <label className="block font-semibold mb-2">🏠 Address</label>
    <textarea
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      placeholder="Enter your address"
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Position Dropdown */}
  <div className="col-span-1">
    <label className="block font-semibold mb-2">💼 What position are you applying for?</label>
    <select
      value={position}
      onChange={(e) => setPosition(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Select a position</option>
      <option value="OT Executive">OT Executive</option>
      <option value="Branch Executive/Admin">Branch Executive/Admin</option>
      <option value="Finance Executive">Finance Executive</option>
      <option value="Data Caller">Data Caller</option>
    </select>
  </div>

  {/* Branch Dropdown */}
  <div className="col-span-1">
    <label className="block font-semibold mb-2">🏢 Select Branch</label>
    <select
      value={branch}
      onChange={(e) => setBranch(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Select a branch</option>
      {APIData.map((branch) => (
        <option key={branch._id} value={branch.branchname}>
          {branch.branchname}
        </option>
      ))}
    </select>
  </div>

  {/* Apply Date */}
  <div className="col-span-1">
    <label className="block font-semibold mb-2">📅 Apply Date</label>
    <input
      type="date"
      value={dates}
      onChange={(e) => setDates(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Qualification */}
  <div className="col-span-1">
    <label className="block font-semibold mb-2">🎓 Recent Qualification</label>
    <input
      type="text"
      value={qualification}
      onChange={(e) => setQualification(e.target.value)}
      placeholder="Enter your recent qualification"
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Experience Dropdown */}
  <div className="col-span-1">
    <label className="block font-semibold mb-2">🧠 Experience</label>
    <select
      value={level}
      onChange={(e) => setLevel(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Select experience level</option>
      <option value="Fresher">Fresher</option>
      <option value="1-2 Years">1-2 Years</option>
      <option value="3-5 Years">3-5 Years</option>
      <option value="More than 5 Years">More than 5 Years</option>
    </select>
  </div>

  {/* Upload CV */}
  <div className="col-span-1">
    <label className="block font-semibold mb-2">📄 Upload Your CV</label>
    <input
      type="file"
      onChange={handleFileChange}
      accept=".pdf,.doc,.docx"
      className="w-full border border-gray-300 rounded-md px-4 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
      required
    />
  </div>

  {/* Submit Button */}
  <div className="md:col-span-2 flex justify-center">
    <button
      type="submit"
      disabled={isSubmitting}
      className={`bg-blue-600 text-white px-10 py-3 rounded-full font-semibold transition duration-300 flex items-center gap-2
        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-800'}`}
    >
      {isSubmitting ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting...
        </>
      ) : (
        <>🚀 Submit Application</>
      )}
    </button>
  </div>

</form>

        </div>
      </div>
    </>
  );
}

export default Career;
