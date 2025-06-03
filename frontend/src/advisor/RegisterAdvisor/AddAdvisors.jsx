import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import VITE_DATA from "../../config/config.jsx";

function AddAdvisors() {
  const [formData, setFormData] = useState({
    uniqueId: "",
    advisorname: "",
    advisoremail: "",
    advisormobile: "",
    advisorpassword: "",
    advisoraddress: "",
    advisortype: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const branchname = sessionStorage.getItem("branchName");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for mobile number to prevent non-digits and limit to 10 characters
    if (name === "advisormobile") {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 10) return;
      setFormData(prev => ({
        ...prev,
        [name]: digitsOnly
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === "advisoremail" ? value.toLowerCase() : value.toUpperCase()
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Mobile number validation
    if (!/^\d{10}$/.test(formData.advisormobile)) {
      newErrors.advisormobile = "Please enter a valid 10-digit mobile number";
    }
    
    // Add other validations as needed
    if (!formData.uniqueId) newErrors.uniqueId = "ID is required";
    if (!formData.advisorname) newErrors.advisorname = "Name is required";
    if (!formData.advisoremail) newErrors.advisoremail = "Email is required";
    if (!formData.advisortype) newErrors.advisortype = "Advisor type is required";
    if (!formData.advisorpassword) newErrors.advisorpassword = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Form Data:", formData);
      
      const response = await axios.post(`${VITE_DATA}/advisor/register`, {
        ...formData,
        branch: branchname
      });

      if (response.data.status) {
        toast.success(response.data.status);
        setFormData({
          uniqueId: "",
          advisorname: "",
          advisoremail: "",
          advisormobile: "",
          advisorpassword: "",
          advisoraddress: "",
          advisortype: "",
        });
        setErrors({});
      } else {
        toast.error("Error Occurred. Try again...!");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data?.message);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: "uniqueId", label: "Advisor ID", placeholder: "HJP, WB, PAT, MUZ", type: "text" },
    { name: "advisorname", label: "Name", placeholder: "Enter Name", type: "text" },
    { name: "advisoremail", label: "Email ID", placeholder: "abc@gmail.com", type: "email" },
    { 
      name: "advisormobile", 
      label: "Mobile No.", 
      placeholder: "10-digit number", 
      type: "tel",
      maxLength: 10,
      pattern: "[0-9]{10}"
    },
    { name: "advisoraddress", label: "Address", placeholder: "Enter Address", type: "text" },
    { 
      name: "advisortype", 
      label: "Advisor Type", 
      type: "select", 
      options: [
        { value: "", label: " Select Payout" },
        { value: "DAILY", label: "Daily Payout" },
        { value: "MONTHLY", label: "Monthly Payout" }
      ]
    },
    { name: "advisorpassword", label: "Password", placeholder: "**********", type: "password" },
  ];

  return (
    <section className="container-fluid p-0 sm:ml-48 bg-white">
      <div className="container-fluid border-gray-200 border-dashed rounded bg-white">
        <h1 className="font-semibold text-3xl my-4 text-blue-700">Register Advisor</h1>
        
       
          <form onSubmit={handleSubmit} className="bg-white  grid grid-cols-2 md:grid-cols-5 gap-10 rounded m-4 mt-8">
            {inputFields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-black">
                  {field.label}
                  <span className="text-red-500 text-xs ml-1">*</span>
                </label>
                
                {field.type === "select" ? (
                  <>
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                         className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {errors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                    )}
                  </>
                ) : (
                  <>
                    <input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={`w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" ${
                        errors[field.name] ? "border-red-500" : ""
                      }`}
                      required
                      maxLength={field.maxLength}
                      pattern={field.pattern}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                    )}
                  </>
                )}
              </div>
            ))}

<div className="block w-full mt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-medium rounded px-4 py-2 shadow-lg transition-all disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                    Submitting...
                  </>
                ) : "Submit"}
              </button>
            </div>
          </form>
         
      </div>
    </section>
  );
}

export default AddAdvisors;
