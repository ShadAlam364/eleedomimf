/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import VITE_DATA from "../../config/config.jsx";
function ProfileUpdate() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    empname: "",
    empemail: "",
    empmobile: "",
    empgender: "",
    empdob: "",
    permanentempaddress: "",
    currentempaddress: "",
    empaadharno: 0,
    empaadharfile: "",
    panno: "",
    pan: "",
    accNumber: "",
    ifsc: "",
    bankName: "",
  });

  const Id = sessionStorage.getItem("employeeId");
  useEffect(() => {
    axios
      .get(`${VITE_DATA}/api/employee/${Id}`)
      .then((resp) => {
        const employeeData = resp.data;
        // Update the state with employee data
        setData({
          empid: employeeData.empid,
          empname: employeeData.empname,
          empemail: employeeData.empemail,
          empmobile: employeeData.empmobile,
          empgender: employeeData.empgender,
          empdob: employeeData.empdob,
          permanentempaddress: employeeData.permanentempaddress,
          currentempaddress: employeeData.currentempaddress,
          empaadharno: employeeData.empaadharno,
          panno: employeeData.panno,
          pan: employeeData.pan,
          accNumber: employeeData.accNumber,
          ifsc: employeeData.ifsc,
          bankName: employeeData.bankName,
          empjoiningdate: employeeData.empjoiningdate,
          staffType: employeeData.staffType,
          empbranch: employeeData.empbranch,
        });
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, [Id]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "empaadharfile" || name === "panno") {
      setData((prevData) => ({
        ...prevData,
        [name]: files[0], // assuming single file upload
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const updateEmpAPI = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("empaadharfile", data.empaadharfile);
      formData.append("panno", data.panno);
      formData.append("pan", data.pan);
      formData.append("accNumber", data.accNumber);
      formData.append("ifsc", data.ifsc);
      formData.append("empid", data.empid);
      formData.append("bankName", data.bankName);
      formData.append("empname", data.empname);
      formData.append("empemail", data.empemail);
      formData.append("empmobile", data.empmobile);
      formData.append("empgender", data.empgender);
      formData.append("empdob", data.empdob);
      formData.append("permanentempaddress", data.permanentempaddress);
      formData.append("currentempaddress", data.currentempaddress);
      formData.append("empaadharno", data.empaadharno);

      const response = await axios.put(
        `${VITE_DATA}/api/emp/update/${Id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(`${response.data.status}`);
    } catch (error) {
      toast.error(`${error}`);
      console.error("Error updating Employee:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-fluid relative h-screen p-0 sm:ml-48 bg-blue-100">
    <div className="container-fluid flex flex-col justify-center items-center border-gray-200 border-dashed rounded bg-blue-100">
  <h1 className="text-3xl py-5 tracking-wider text-blue-700 font-medium">
    Update Your Profile
  </h1>
  
  <div className="w-full flex flex-col">
    {/* Non-editable fields - arranged in two rows */}
    <div className="flex flex-wrap justify-between mb-6">
      {[
        { label: "Employee ID", name: "empid", type: "text", disabled: true },
        { label: "Employee Name", name: "empname", type: "text", disabled: true },
        { label: "Email ID", name: "empemail", type: "email", placeholder: "abc@gmail.com", disabled: true },
        { label: "Branch", name: "empbranch", type: "text", disabled: true },
        { label: "Joining Date", name: "empjoiningdate", type: "date", disabled: true },
        { label: "Designation", name: "staffType", type: "text", disabled: true },
      ].map((field) => (
        <div key={field.name} className="w-full md:w-[32%] lg:w-[16%] mb-4 px-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            <span className="text-xs text-red-500 ml-1">(Not Editable)</span>
          </label>
          <input
            className="w-full p-2 border rounded bg-gray-100"
            type={field.type}
            value={data[field.name]}
            onChange={handleInputChange}
            name={field.name}
            disabled={field.disabled}
            placeholder={field.placeholder}
          />
        </div>
      ))}
    </div>

    {/* Editable fields - organized in a more structured way */}
    <div className="flex flex-wrap justify-between">
      {/* Personal Info */}
      <div className="w-full md:w-[32%] lg:w-[16%] mb-4 px-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          DOB
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="date"
          value={data.empdob}
          onChange={handleInputChange}
          name="empdob"
        />
      </div>

      <div className="w-full md:w-[32%] lg:w-[16%] mb-4 px-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={data.empgender}
          onChange={handleInputChange}
          name="empgender"
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHERS">Others</option>
        </select>
      </div>

      <div className="w-full md:w-[32%] lg:w-[16%] mb-4 px-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mobile No.
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="number"
          min="1"
          value={data.empmobile}
          onChange={handleInputChange}
          name="empmobile"
          placeholder="+91"
        />
      </div>

      {/* Bank Details */}
      <div className="w-full md:w-[32%] lg:w-[16%] mb-4 px-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Account No.
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="number"
          name="accNumber"
          value={data.accNumber}
          onChange={handleInputChange}
          placeholder="Account Number"
        />
      </div>

      <div className="w-full md:w-[32%] lg:w-[16%] mb-4 px-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          IFSC Code
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="text"
          name="ifsc"
          value={data.ifsc}
          onChange={handleInputChange}
          placeholder="IFSC Code"
        />
      </div>

      <div className="w-full md:w-[32%] lg:w-[16%] mb-4 px-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bank Name
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="text"
          name="bankName"
          value={data.bankName}
          onChange={handleInputChange}
          placeholder="Bank Name"
        />
      </div>

      {/* Identification */}
      <div className="w-full md:w-[32%] lg:w-[16%] mb-4 px-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pan No.
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="text"
          name="pan"
          value={data.pan}
          onChange={handleInputChange}
          placeholder="AKRPD1222Q"
          minLength="10"
        />
      </div>

      <div className="w-full md:w-[32%] lg:w-[16%] mb-4 px-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Aadhar No.
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="text"
          value={data.empaadharno}
          onChange={handleInputChange}
          name="empaadharno"
        />
      </div>

      {/* Addresses */}
      <div className="w-full md:w-[32%] mb-4 px-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Address
        </label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          rows={3}
          name="currentempaddress"
          value={data.currentempaddress}
          onChange={handleInputChange}
          placeholder="Your Address"
        />
      </div>

      <div className="w-full md:w-[32%] mb-4 px-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Permanent Address
        </label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          rows={3}
          value={data.permanentempaddress}
          onChange={handleInputChange}
          name="permanentempaddress"
          placeholder="Your Address"
        />
      </div>
    </div>

    {/* Submit button */}
    <div className="flex justify-center p-2 text-center w-full my-6">
      <button
        type="submit"
        onClick={updateEmpAPI}
        disabled={loading}
        className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-medium rounded px-6 py-2 shadow-lg transition-all disabled:opacity-70"
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
            Updating...
          </>
        ) : (
          "Submit"
        )}
      </button>
    </div>
  </div>
</div>
    </section>
  );
}

export default ProfileUpdate;
