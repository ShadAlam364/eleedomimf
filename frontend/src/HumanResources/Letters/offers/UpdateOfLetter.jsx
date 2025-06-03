/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import VITE_DATA from "../../../config/config.jsx";
import { X } from "lucide-react";

function UpdateOfLetter({ letterId, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    ofdate: letterId.ofdate || "",
    ofname: letterId.ofname || "",
    ofmobile: letterId.ofmobile || "",
    ofaddress: letterId.ofaddress || "",
    oflocation: letterId.oflocation || "",
    ofemail: letterId.ofemail || "",
    ofdesignation: letterId.ofdesignation || "",
    ofgrosalary: letterId.ofgrosalary || "",
    ofsalaryWords: letterId.ofsalaryWords || "",
    ofvalidDate: letterId.ofvalidDate || "",
  });
  const [branchList, setBranchList] = useState([]);
  const [empType, setEmpType] = useState([]);

  // Fetch branch list and employee types
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized yet.. Try again!");
      return;
    }

    const fetchData = async () => {
      try {
        const [branchResponse, empTypeResponse] = await Promise.all([
          axios.get(`${VITE_DATA}/api/branch-list`, {
            headers: { Authorization: token },
          }),
          axios.get(`${VITE_DATA}/staff/lists`, {
            headers: { Authorization: token },
          }),
        ]);
        setBranchList(branchResponse.data);
        setEmpType(empTypeResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = sessionStorage.getItem("token");
      await axios.put(
        `${VITE_DATA}/letters/update/letter/${letterId._id}`,
        formData,
        {
          headers: { Authorization: token },
        }
      );
      toast.success("Offer letter updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating letter:", error);
      toast.error("Error updating offer letter");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-blue-600 rounded p-4 px-2 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3 relative">
          <h2 className="text-xl font-bold text-white tracking-wider">
            Update Offer Letter
          </h2>

          <button
            onClick={onClose}
            className="absolute -top-3 -right-1 px-1 py-1 text-white bg-red-500 rounded hover:bg-red-600 tracking-wider text-xl font-semibold"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4"
        >
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Date</label>
            <input
              type="text"
              name="ofdate"
              value={formData.ofdate}
              onChange={handleInputChange}
              className="input-style rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="ofname"
              value={formData.ofname}
              onChange={handleInputChange}
              className="input-style rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="ofemail"
              value={formData.ofemail}
              onChange={handleInputChange}
              className="input-style rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Mobile</label>
            <input
              type="text"
              name="ofmobile"
              value={formData.ofmobile}
              onChange={handleInputChange}
              className="input-style rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Designation</label>
            <select
              name="ofdesignation"
              value={formData.ofdesignation}
              onChange={handleInputChange}
              className="input-style py-2 ps-2 rounded"
            >
              <option value="">Select Designation</option>
              {empType.map((type) => (
                <option key={type._id} value={type.s_type}>
                  {type.s_type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Location</label>
            <select
              name="oflocation"
              value={formData.oflocation}
              onChange={handleInputChange}
              className="input-style py-2 ps-2 rounded"
            >
              <option value="">Select Location</option>
              {branchList.map((branch) => (
                <option key={branch._id} value={branch.branchname}>
                  {branch.branchname}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Gross Salary</label>
            <input
              type="number"
              name="ofgrosalary"
              value={formData.ofgrosalary}
              onChange={handleInputChange}
              className="input-style rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Salary in Words</label>
            <input
              type="text"
              name="ofsalaryWords"
              value={formData.ofsalaryWords}
              onChange={handleInputChange}
              className="input-style rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Address</label>
            <textarea
              name="ofaddress"
              value={formData.ofaddress}
              onChange={handleInputChange}
              className="input-style ps-2 rounded"
              rows="3"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Valid Date</label>
            <input
              type="text"
              name="ofvalidDate"
              value={formData.ofvalidDate}
              onChange={handleInputChange}
              className="input-style rounded"
            />
          </div>

          <div className="col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
             
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${submitting ? "cursor-not-allowed bg-slate-500 text-white": ""} px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700`}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Updating...
                </>
              ) : (
                "Update Letter"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateOfLetter;
