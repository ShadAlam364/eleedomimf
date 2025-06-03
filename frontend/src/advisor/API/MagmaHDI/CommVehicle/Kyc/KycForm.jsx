import { useState, useEffect } from "react";
import axios from "axios";
import VITE_DATA from "../../../../../config/config";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

const BUSINESS_SOURCE_TYPE = "P_AGENT";

function KycForm() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [kycMethod, setKycMethod] = useState(""); // "ckyc", "ekyc" or "document"
  const [kycStep, setKycStep] = useState(1);
  
  // CKYC Form Data
  const [ckycFormData, setCkycFormData] = useState({
    cKYCType: "CKYC",
    cKYCNumber: "",
    DOB: "",
    Gender: "",
    FullName: "",
    BusinessSourceType: BUSINESS_SOURCE_TYPE
  });

  // eKYC Form Data
  const [ekycFormData, setEkycFormData] = useState({
    UIDNo: "",
    MobileNumber: "",
    DOB: "",
    BusinessSourceType: BUSINESS_SOURCE_TYPE,
    OTP: "",
    ClientID: ""
  });

  // Document Upload Form Data
  const [documentFormData, setDocumentFormData] = useState({
    DocumentName: "AADHAAR",
    DocumentType: "Image",
    Base64DocumentString: "",
    BusinessSourceType: BUSINESS_SOURCE_TYPE
  });

  // Get auth token on component mount
  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get(`${VITE_DATA}/magma/tokens`);
        if (response.data?.access_token) {
          setToken(response.data.access_token);
        }
      } catch (error) {
        toast.error("Failed to get authentication token");
      }
    };
    getToken();
  }, []);

  // Add validation functions
  const validateCKYC = (value) => {
    // CKYC should be alphanumeric and maximum 14 characters
    const ckycRegex = /^[a-zA-Z0-9]{1,14}$/;
    return ckycRegex.test(value);
  };

  const validateAge = (dob) => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  };

  const validateAadhaar = (value) => {
    // Aadhaar should be exactly 12 digits
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(value);
  };

  // Handle CKYC verification with validation
  const handleCkycSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCKYC(ckycFormData.cKYCNumber)) {
      toast.error("CKYC number should be alphanumeric and maximum 14 characters");
      return;
    }

    if (!validateAge(ckycFormData.DOB)) {
      toast.error("Age must be 18 years or above");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_DATA}/magma/kyc/ckyc`,
        ckycFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.ServiceResult === "Success") {
        if (response.data.OutputResult.IsKYCSuccess) {
          toast.success("CKYC verification successful");
        } else {
          toast.warn("CKYC verification failed. Please try eKYC or document upload.");
          setKycMethod("");
        }
      } else {
        toast.error(response.data.ErrorText || "CKYC verification failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.ErrorText || "CKYC verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle eKYC OTP request with validation
  const handleEkycOtpRequest = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(ekycFormData.MobileNumber)) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    if (!validateAadhaar(ekycFormData.UIDNo)) {
      toast.error("Aadhaar number should be exactly 12 digits");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_DATA}/magma/kyc/ekyc/send-otp`,
        {
          UIDNo: ekycFormData.UIDNo,
          MobileNumber: ekycFormData.MobileNumber,
          DOB: ekycFormData.DOB,
          BusinessSourceType: BUSINESS_SOURCE_TYPE
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.ServiceResult === "Success" && response.data.OutputResult.IsOTPSent) {
        toast.success("OTP sent successfully");
        setEkycFormData(prev => ({
          ...prev,
          ClientID: response.data.OutputResult.ClientID
        }));
        setKycStep(2);
      } else {
        toast.error(response.data.ErrorText || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.ErrorText || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle eKYC OTP verification
  const handleEkycVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_DATA}/magma/kyc/ekyc/verify`,
        {
          OTP: ekycFormData.OTP,
          ClientID: ekycFormData.ClientID,
          UIDNo: ekycFormData.UIDNo,
          BusinessSourceType: BUSINESS_SOURCE_TYPE
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.ServiceResult === "Success" && response.data.OutputResult.IsKYCSuccess) {
        toast.success("eKYC verification successful");
      } else {
        toast.error(response.data.ErrorText || "eKYC verification failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.ErrorText || "eKYC verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle document file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set DocumentType based on file type
      const fileType = file.type;
      const documentType = fileType.includes('pdf') ? 'PDF' : 'Image';
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setDocumentFormData(prev => ({
          ...prev,
          Base64DocumentString: base64String,
          DocumentType: documentType
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle document upload
  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_DATA}/magma/kyc/document/upload`,
        documentFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.ServiceResult === "Success" && response.data.OutputResult.IsKYCSuccess) {
        toast.success("Document uploaded successfully");
      } else {
        toast.error(response.data.ErrorText || "Document upload failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.ErrorText || "Error uploading document");
    } finally {
      setLoading(false);
    }
  };

  // Reset form state
  const resetForm = () => {
    setKycMethod("");
    setKycStep(1);
    setCkycFormData({
      cKYCType: "CKYC",
      cKYCNumber: "",
      DOB: "",
      Gender: "",
      FullName: "",
      BusinessSourceType: BUSINESS_SOURCE_TYPE
    });
    setEkycFormData({
      UIDNo: "",
      MobileNumber: "",
      DOB: "",
      BusinessSourceType: BUSINESS_SOURCE_TYPE,
      OTP: "",
      ClientID: ""
    });
    setDocumentFormData({
      DocumentName: "AADHAAR",
      DocumentType: "Image",
      Base64DocumentString: "",
      BusinessSourceType: BUSINESS_SOURCE_TYPE
    });
  };

  return (
    <div className="relative flex justify-center items-center flex-col mx-4 max-w-2xl p-4 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">KYC Verification</h2>
      
      {!token && (
        <div className="text-center text-gray-600">
          Loading...
        </div>
      )}

      {token && !kycMethod && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-700 text-center">Select KYC Method</h3>
          <div className="flex gap-4 text-nowrap justify-between">
            <button
              onClick={() => setKycMethod("ckyc")}
              className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              CKYC
            </button>
            <button
              onClick={() => setKycMethod("ekyc")}
              className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              eKYC (Aadhaar)
            </button>
            <button
              onClick={() => setKycMethod("document")}
              className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              Upload Document
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* CKYC Form */}
        {token && kycMethod === "ckyc" && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleCkycSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-3 text-center">
                <label className=" text-gray-700 font-medium ">
                  CKYC Number
                </label>
                <input
                  type="text"
                  value={ckycFormData.cKYCNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || validateCKYC(value)) {
                      setCkycFormData(prev => ({ ...prev, cKYCNumber: value }));
                    }
                  }}
                  pattern="[A-Za-z0-9]+"
                  title="CKYC number should contain only letters and numbers"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={ckycFormData.FullName}
                  onChange={(e) => setCkycFormData(prev => ({ ...prev, FullName: e.target.value }))}
                  className="w-full px-3 py-2 border capitalize border-gray-300 rounded focus:outline-none focus:ring-0 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={ckycFormData.DOB}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    if (!validateAge(selectedDate)) {
                      toast.warn("Age must be 18 years or above");
                    }
                    setCkycFormData(prev => ({ ...prev, DOB: selectedDate }));
                  }}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-0 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Gender
                </label>
                <select
                  value={ckycFormData.Gender}
                  onChange={(e) => setCkycFormData(prev => ({ ...prev, Gender: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-0 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="T">Other</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify CKYC"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
              >
                Back
              </button>
            </div>
          </motion.form>
        )}

        {/* eKYC Form */}
        {token && kycMethod === "ekyc" && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={kycStep === 1 ? handleEkycOtpRequest : handleEkycVerification}
            className="space-y-6"
          >
            {kycStep === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    value={ekycFormData.UIDNo}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*$/.test(value)) {
                        setEkycFormData(prev => ({ ...prev, UIDNo: value }));
                      }
                    }}
                    maxLength="12"
                    pattern="\d{12}"
                    title="Aadhaar number should be exactly 12 digits"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={ekycFormData.MobileNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (/^\d*$/.test(value) && value.length <= 10)) {
                        setEkycFormData(prev => ({ ...prev, MobileNumber: value }));
                      }
                    }}
                    pattern="\d{10}"
                    maxLength="10"
                    title="Mobile number must be exactly 10 digits"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-0 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={ekycFormData.DOB}
                    onChange={(e) => setEkycFormData(prev => ({ ...prev, DOB: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-0 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={ekycFormData.OTP}
                  onChange={(e) => setEkycFormData(prev => ({ ...prev, OTP: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-0 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300 disabled:opacity-50"
              >
                {loading ? "Processing..." : kycStep === 1 ? "Send OTP" : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => kycStep === 1 ? resetForm() : setKycStep(1)}
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
              >
                {kycStep === 1 ? "Back" : "Resend OTP"}
              </button>
            </div>
          </motion.form>
        )}

        {/* Document Upload Form */}
        {token && kycMethod === "document" && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleDocumentSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Document Type
              </label>
              <select
                value={documentFormData.DocumentName}
                onChange={(e) => setDocumentFormData(prev => ({ ...prev, DocumentName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-0 focus:ring-blue-500"
                required
              >
                <option value="AADHAAR">Aadhaar</option>
                <option value="VOTER">Voter ID</option>
                <option value="DL">Driving License</option>
                <option value="PASSPORT">Passport</option>
                <option value="CIN">CIN</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Upload Document
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="w-full px-3 border border-gray-300 rounded focus:outline-none focus:ring-0 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white font-bold px-4 rounded hover:bg-green-700 transition duration-300 disabled:opacity-50">
                {loading ? "Uploading..." : "Upload Document"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition duration-300">
                Back
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-center text-gray-700">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default KycForm;