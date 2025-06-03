/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import VITE_DATA from "../../config/config.jsx";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";

function AdvisorUpdates({ advisors, onUpdates, onClose }) {
  const [loading, setLoading] = useState(false);
  const [advInfo, setAdvInfo] = useState({
    advisorname: "",
    advisoremail: "",
    advisormobile: "",
    advisorpassword: "",
    advisortype: "",
    advisoraddress: "",
  });
  const toggleModal = () => onClose((prev) => !prev);
  useEffect(() => {
    setAdvInfo(advisors);
  }, [advisors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdvInfo((prev) => ({ ...prev, [name]: value }));
  };

  const updateAdvisorAPI = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${VITE_DATA}/advisor/update/${advisors._id}`,
        advInfo
      );
      toast.success(response.data.status);
      onClose();
      onUpdates();
    } catch (error) {
      toast.error(error.message);
      console.error("Error updating Advisor:", error);
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      label: "Name:",
      name: "advisorname",
      type: "text",
      placeholder: "Enter Name",
    },
    {
      label: "Mobile No:",
      name: "advisormobile",
      type: "number",
      placeholder: "+91",
    },
    {
      label: "Email ID:",
      name: "advisoremail",
      type: "email",
      placeholder: "abc@gmail.com",
    },
    {
      label: "Address:",
      name: "advisoraddress",
      type: "text",
      placeholder: "",
    },
    {
      label: "Adv. Payout Type:",
      name: "advisortype",
      type: "select",
      options: [
        { value: "", label: "Select Payout Type" },
        { value: "DAILY", label: "Daily Payout" },
        { value: "MONTHLY", label: "Monthly Payout" },
      ],
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed flex justify-center items-center inset-0 z-50 bg-black bg-opacity-60 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative bg-gradient-to-r from-blue-700 to-blue-700 rounded-lg shadow-xl w-full max-w-4xl"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-100">
              Update Policy Details
            </h3>
            <button
              onClick={toggleModal}
              className="text-gray-200 hover:text-white bg-red-500 hover:bg-red-600 rounded-full p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="bg-white m-1 grid grid-cols-2 sm:grid-cols-3 gap-6 rounded p-4 shadow-inner">
            {formFields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-black">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={advInfo[field.name]}
                    onChange={handleInputChange}
                    name={field.name}
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    type={field.type}
                    value={advInfo[field.name]}
                    onChange={handleInputChange}
                    name={field.name}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <div className=" my-3 flex justify-center">
                  <button
                    type="submit"
                    onClick={updateAdvisorAPI}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-medium rounded px-4 py-2 shadow-lg transition-all disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <span className="inline-block cursor-not-allowed animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                        Updating...
                      </>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AdvisorUpdates;
