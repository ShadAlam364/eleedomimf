/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAppContext } from "../../../../../../context/Context.jsx";
import axios from "axios";
import VITE_DATA from "../../../../../../config/config.jsx";
import { toast } from "react-toastify";

function AadhaarKyc({ selectedID }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [direction, setDirection] = useState(0);
  const [timer, setTimer] = useState(600);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const { state, dispatch } = useAppContext();
  const formSixty = state.tata.privateCar.form60;
  const proposal = state.tata.privateCar.proposer;
  const { access_token } = state.tata.tokens.authTokens;
  const ckyc = state.tata.privateCar.ckyc;
  const clientid = state.tata.privateCar.aadhaarOtp;
  const values = ckyc?.req_id?.split("_")[0];
  const [formData, setFormData] = useState({
    proposal_no: proposal?.proposal_no || "", //proposalResponses.proposal_no
    id_type: selectedID || "AADHAAR",
    id_num: "",
    req_id: formSixty?.req_id || ckyc?.req_id,
    gender: "",
    dob: "",
  });

  const isAadhaarValid = formData.id_num.length === 12;
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  // show inside input
  const getDateForInput = () => {
    // Convert DD-MM-YYYY (formData) back to YYYY-MM-DD for input display
    const { dob } = formData;
    if (!dob) return ""; // Return empty if no DOB set
    const [day, month, year] = dob.split("-");
    return `${year}-${month}-${day}`;
  };
  // change yyyy-mm-dd to dd-mm-yyyy
  const dateFormat = (dateString) => {
    if (!dateString) return ""; // Handle empty input
    const [year, month, day] = dateString.split("-");
    if (year && month && day) {
      return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
    }
    return dateString; // Return original if format is invalid
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For id_num, ensure only numeric input
    if (name === "id_num") {
      if (/^\d*$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
    // For dob, format the date
    else if (name === "dob") {
      const formattedDate = dateFormat(value); // Convert to DD-MM-YYYY
      setFormData((prev) => ({
        ...prev,
        [name]: formattedDate,
      }));
    }
    // Default case for other fields
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAadharSubmit = async (formData) => {
    const headers = {
      Authorization: `${access_token}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.post(
        `${VITE_DATA}/taig/motor/ckyc`,
        formData,
        {
          headers,
        }
      );
  
        if ( (response.data.status === 200 &&
          response?.data.message_txt === "OTP Sent") &&
          response?.data?.data.otpSent
        ) {
          dispatch({
            type: "SET_TATA_PRIVATE_CAR_AADHAAR_OTP",
            payload: response?.data.data,
          });
          setDirection(clientid.otpSent ? -1 : 1);
        } else {
          dispatch({
            type: "SET_TATA_PRIVATE_CAR_CKYC",
            payload: response?.data.data,
          });
          setDirection(clientid.otpSent ? -1 : 1);
        }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error to get otp response");
      // handleSessionExpiry();
    }
  };

  const handleConvert = () => {
    setShowConfirmation(true);
  };
  const confirmFinalize = () => {
    handleAadharSubmit(formData);
    // Form conversion is confirmed
    setShowConfirmation(false);
  };

  // #############################################################  OTP VERIFICATION #########################################################################
  useEffect(() => {
    let timerInterval;

    if (clientid.otpSent && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    // Cleanup the interval when timer ends or component unmounts
    if (timer === 0) {
      clearInterval(timerInterval);
    }

    return () => clearInterval(timerInterval);
  }, [clientid.otpSent, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const handleChangeOtp = (value, index) => {
    if (/^\d*$/.test(value)) {
      // Allow only numbers
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1); // Limit input to one character
      setOtp(newOtp);
      // Move focus to the next input if not empty
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleBackspace = (index) => {
    if (index > 0 && otp[index] === "") {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpData = {
      client_id: clientid?.clientId || clientid?.client_id,
      proposal_no: proposal?.proposal_no || "",
      id_type: selectedID || "AADHAAR",
      id_num: formData?.id_num || "",
      otp: otp.join(""),
    };

    try {
      const headers = {
        Authorization: `${access_token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        `${VITE_DATA}/taig/motor/verify/passkey`,
        otpData,
        {
          headers,
        }
      );

      if (response?.data.status === 200 && response?.data.data) {
        toast.success(response.data.message_txt);
        // Dispatch actions or update state based on successful response if required
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_CKYC",
          payload: response.data.data,
        });
      } else {
        toast.error(response.data.message_txt || response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error submitting OTP response"
      );
      // Optional: handle session expiry if needed
    }
  };

  const variants = {
    enter: (direction) => ({
      y: direction > 0 ? "20%" : "-20%",
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "20%",
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col w-full p-1">
      {(values === "pan" || values === "ckyc") && (
        <h1 className="text-xl font-semibold tracking-wider text-white p-2 ">
        AADHAR CARD{" "}
        </h1>
      )}
      <AnimatePresence custom={direction}>
        {!clientid.otpSent ? (
          <motion.div
            key="form"
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
            className="bg-white rounded  grid grid-cols-2 gap-4 justify-between p-4"
          >
            {/* Aadhaar Number */}
            <div className="mb-4 text-start ">
              <label className="block  text-gray-700 font-medium">
                Aadhaar Number:
              </label>
              <input
                type="text"
                name="id_num"
                value={formData.id_num}
                onChange={handleChange}
                maxLength="12"
                placeholder="Enter 12-digit Aadhaar number"
                className={`w-full px-3 py-2  tracking-widest rounded ${
                  isAadhaarValid ? "border-none" : "border border-red-500"
                } shadow-inner bg-slate-100 focus:ring-0   focus:outline-none`}
              />
              {!isAadhaarValid && formData.id_num.length > 0 && (
                <p className="text-red-500 text-xs mt-0.5">
                  Aadhaar No must be 12 digits.
                </p>
              )}
            </div>
            {/* Full Name */}
            <div className="mb-4 text-start">
              <label className="block text-gray-700 font-medium">
                Full Name (as per Aadhaar):
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full px-3 py-2 border-none  tracking-wider capitalize rounded shadow-inner bg-slate-100 focus:ring-0  focus:outline-none"
              />
            </div>

            <div className="mb-4 text-start ">
              <label className="block text-gray-700 font-medium mb-2">
                Gender:
              </label>
              <div className="flex justify-around items-center space-x-4">
                {/* Male */}
                <label className="flex items-center cursor-pointer space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    checked={formData.gender === "M"}
                    onChange={handleChange}
                    className="form-radio text-blue-600 focus:ring-0"
                  />
                  <span className="text-gray-700">Male</span>
                </label>

                {/* Female */}
                <label className="flex items-center cursor-pointer space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="F"
                    checked={formData.gender === "F"}
                    onChange={handleChange}
                    className="form-radio text-blue-600  focus:ring-0"
                  />
                  <span className="text-gray-700">Female</span>
                </label>

                {/* Transgender */}
                <label className="flex items-center cursor-pointer space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="T"
                    checked={formData.gender === "T"}
                    onChange={handleChange}
                    className="form-radio text-blue-600 focus:ring-0"
                  />
                  <span className="text-gray-700">Transgender</span>
                </label>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="mb-4 text-start">
              <label className="block text-gray-700 font-medium">DOB:</label>
              <input
                type="date"
                name="dob"
                max={eighteenYearsAgo}
                value={getDateForInput()}
                onChange={handleChange}
                placeholder="DD-MM-YYYY"
                className="w-full px-3 py-2 border-none rounded shadow-inner tracking-wider bg-slate-100 focus:ring-0  focus:outline-none"
              />
            </div>
            <span className="col-span-2 text-start text-slate-700 italic tracking-wide">
              In case CKYC record is not found, OTP based verification will be
              initated.
            </span>
            <div className="flex justify-center mt-5 col-span-2 ">
              <button
                type="submit"
                onClick={handleConvert}
                className={`  text-base bg-green-500 text-white font-bold px-4 py-2 tracking-widest rounded border-green-600 border-b-[3px] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed active:border-b-[2px] active:brightness-90 active:translate-y-[1px] active:text-slate-400`}
              >
                Submit
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5 }}
            className="bg-gray-100 w-full flex flex-col items-center mx-auto justify-center "
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Enter OTP</h1>
            <p className="text-gray-600 text-sm mb-6">
              We sent a 6-digit OTP to your Aadhaar-linked mobile number.
            </p>
            <div className="space-y-2">
              {/* OTP Inputs */}
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChangeOtp(e.target.value, index)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") handleBackspace(index);
                    }}
                    maxLength="1"
                    className="otp-input w-12 h-12 text-center font-sans text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                ))}
              </div>
              {clientid.otpSent && timer > 0 ? (
                <div className="text-center text-sm text-gray-600 tracking-wider pb-10">
                  <p>
                    OTP will expires in{" "}
                    <span className="font-bold text-red-600">
                      {formatTime(timer)}
                    </span>{" "}
                    minutes!
                  </p>
                </div>
              ) : (
                <div className="text-center flex justify-end text-sm text-gray-600 pb-8">
                  <button
                    onClick={confirmFinalize}
                    className="text-blue-700 text-base font-semibold tracking-wide"
                  >
                    Resend OTP
                  </button>
                </div>
              )}
              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleOtpSubmit}
                className={`transition-all  text-base bg-blue-600 text-white font-bold px-4 py-2 tracking-widest rounded border-blue-700 border-b-[3px] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed active:border-b-[2px] active:brightness-90 active:translate-y-[1px] active:text-slate-400`}
              >
                Verify OTP
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showConfirmation && (
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <AnimatePresence>
            <motion.div
              className="bg-white p-4 rounded shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h3 className="text-lg font-semibold mb-8">
                {`Are you sure you want to send Aadhaar OTP ?`}
              </h3>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-300  cursor-pointer transition-all text-black font-mono font-bold px-6 py-1 rounded-lg
              border-gray-400
                border-b-[4px] hover:brightness-110  
                active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                  onClick={() => setShowConfirmation(false)}
                >
                  No
                </button>
                <button
                  className=" cursor-pointer transition-all bg-green-600 text-black font-mono font-bold px-6 py-1 rounded-lg
              border-green-700
                border-b-[4px] hover:brightness-110 
                active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                  onClick={confirmFinalize} // Set formData.__finalize to "1"
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default AadhaarKyc;
