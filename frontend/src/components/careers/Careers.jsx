import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import VITE_DATA from "../../config/config.jsx";

function Careers() {
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
    <section className="container-fluid relative bg-orange-50">
      <div className="container-fluid flex flex-col justify-center ml-2 mr-2 bg-orange-50">
        <p className="text-3xl font-semibold my-3 text-orange-700 uppercase">
          Apply from Here
        </p>
        <div className="relative w-full mx-auto lg:w-1/2 p-6 rounded-xl shadow-xl text-2xl items-center bg-orange-200 mb-10">
          <form className="flex flex-wrap justify-between">
            <div className="flex flex-col p-2 text-start w-full lg:w-1/3">
              <label className="text-base">
                Full Name<span className="text-red-600">*</span>
              </label>
              <input
                className="input-style p-1 rounded"
                type="text"
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/3">
              <label className="text-base">
                Email ID <span className="text-red-600">*</span>
              </label>
              <input
                className="input-style p-1 rounded"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abc@gmail.com"
                required
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/3">
              <label className="text-base">
                Contact No.<span className="text-red-600">*</span>
              </label>
              <input
                className="input-style p-1 rounded"
                type="tel"
                name="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91"
                required
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/3">
              <label className="text-base">Your Address</label>
              <textarea
                className="input-style text-base uppercase p-1 rounded"
                value={address}
                name="address"
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/3">
              <label className="text-base  whitespace-nowrap">
                What position are you applying for?
              </label>
              <select
                className="input-style p-1 text-base rounded"
                value={position}
                name="position"
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="">------- SELECT POSITION --------</option>
                <option value="OT_EXECUTIVE">OT EXECUTIVE</option>
                <option value="BRANCH_EXECUTIVE/ADMIN">
                  BRANCH EXECUTIVE/ADMIN
                </option>
                <option value="FINANCE_EXECUTIVE">FINANCE EXECUTIVE</option>
                <option value="DATA_CALLER">DATA CALLER</option>
              </select>
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/3">
              <label className="text-base  whitespace-nowrap">Branch</label>
              <select
                className="input-style p-1 text-base rounded"
                value={branch}
                name="branch"
                onChange={(e) => setBranch(e.target.value)}
              >
                <option value="">------- SELECT BRANCH --------</option>
                {APIData.map((data) => (
                  <option key={data._id} value={data.branchname}>
                    {data.branchname}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/3">
              <label className="text-base mx-1">Apply Date:</label>
              <input
                className="input-style p-1 rounded"
                type="date"
                name="applyDate"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/3">
              <label className="text-base mx-1">Recent Qualification:</label>
              <input
                className="input-style p-1 rounded"
                type="text"
                value={qualification}
                name="qualification"
                onChange={(e) => setQualification(e.target.value)}
                placeholder="Master's /Bachelor's /12th /10th"
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/3">
              <label className="text-base mx-1">Level</label>
              <select
                className="input-style p-1 text-base rounded"
                value={level}
                name="level"
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">---------- SELECT LEVEL ----------</option>
                <option value="FRESHER">FRESHER</option>
                <option value="1-2 YEARS">1-2 YEAR</option>
                <option value="3-5 YEARS">3-5 YEAR</option>
                <option value=">5 YEARS">MORE THAN 5 YEARS</option>
              </select>
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/3">
              <label className="text-base mx-1">Upload CV/Resume</label>
              <input
                type="file"
                name="pdfs"
                id="pdfs"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="input-style border h-8 text-sm border-black rounded"
              />
            </div>
          </form>
          <div className="mt-10">
            <button
              className="text-white bg-gradient-to-r leading-4 from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded text-base px-3 py-2.5 text-center"
              onClick={handleSubmit}
              type="button"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Careers;
