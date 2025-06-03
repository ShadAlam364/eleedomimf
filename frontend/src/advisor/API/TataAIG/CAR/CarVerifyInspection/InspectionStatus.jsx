/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import VITE_DATA from "../../../../../config/config";
import { useAppContext } from "../../../../../context/Context";
import { toast } from "react-toastify";
import { CircleCheckBig, OctagonAlert, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function InspectionStatus({ setShowInsApi }) {
  const { state, dispatch } = useAppContext();
  const proposal = state.tata.privateCar.proposer;
  const vInsStatus = state.tata.privateCar.vInsStatus;
  const { access_token } = state.tata.tokens.authTokens;
  const policyData = vInsStatus?.data?.[0]?.policy?.[0] || {};
  const vData = vInsStatus?.data?.[0] || {};
  const [loading, setLoading] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const navigate = useNavigate();
  // Trigger API call immediately on component mount
  const VerifyInspectionStatus = async () => {
    const formData = {
      proposal_no: proposal?.proposal_no,
      ticket_no: String(proposal?.ticket_number),
    };
    const headers = {
      Authorization: `${access_token}`,
      "Content-Type": "application/json",
    };
    try {
      setLoading(true); // Start loading
      const response = await axios.post(
        `${VITE_DATA}/taig/motor/verify/inspection`,
        formData,
        {
          headers,
        }
      );
      dispatch({
        type: "SET_TATA_PRIVATE_CAR_INSPECTION_STATUS",
        payload: response?.data,
      });
      // toast.error(response?.data?.message);
      setTokenError(response?.data?.message);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Error verifying inspection status.";
      toast.error(errorMsg);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  useState(() => {
    VerifyInspectionStatus();
  }, []);
  
  const handleClose = () => {
    navigate("/advisor/home/insurance");
  };
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex backdrop-blur-md justify-center items-center z-50">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full relative m-5 md:m-0"
        >
          {loading ? (
            <>
              <h2 className="tracking-wide text-2xl font-bold mb-6 text-blue-700">
                Inspection Status
              </h2>
              <div className="flex flex-col items-center space-y-4">
                <div className="loader border-[0.32rem] border-blue-600 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
                <p className="text-blue-600 md:text-xl text-base tracking-wider font-mono font-semibold">
                  Please Wait...
                </p>
              </div>
            </>
          ) : tokenError ? (
            <div className="flex justify-center">
              <button
                className="absolute -top-2 -right-2 px-1 py-1 text-white bg-red-500 rounded hover:bg-red-600 tracking-wider text-xl font-semibold"
                onClick={handleClose}  
                // onClick={() => setShowInsApi((prev) => !prev)}
              >
                <X size={16} />
              </button>
              <h1 className="text-center italic text-transparent  tracking-wider text-xl bg-gradient-to-l bg-clip-text from-indigo-600 via-indigo-600 to-blue-500 font-bold">
                {tokenError}
              </h1>
            </div>
          ) : (
            <>
              <button
                className="absolute -top-2 -right-2 px-1 py-1 text-white bg-red-500 rounded hover:bg-red-600 tracking-wider text-xl font-semibold"
                onClick={() => setShowInsApi((prev) => !prev)}
              >
                <X size={16} />
              </button>
              <h2 className="tracking-wide text-2xl font-bold mb-3 text-blue-700">
                Inspection Status
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4  text-slate-600 justify-between">
                <div>
                  <span className="font-semibold">Inspection No:</span>
                  <p className="bg-slate-100 px-2 py-1 rounded">
                    {vData?.inspection_no}
                  </p>
                </div>
                {[
                  ["Quote No", policyData?.quote_no],
                  ["Proposal No", policyData?.proposal_no],
                  ["Policy ID", policyData?.policy_id],
                  ["Nstp ID", policyData?.nstp_id],
                  // ["Quote ID", policyData?.quote_id],
                  // ["Proposal ID", policyData?.proposal_id],
                  ["Premium", `₹${policyData?.premium_value || 0}`],
                ].map(([label, value], index) => (
                  <div key={index}>
                    <span className="font-semibold">{label}:</span>
                    <p className="bg-slate-100 px-2 py-1 rounded">{value}</p>
                  </div>
                ))}
                <div>
                  <p className="font-semibold">Inspection Status:</p>
                  <p
                    className={`inline-block rounded-full px-3 mt-0.5 py-0.5 text-base font-medium ${
                      vData?.inspection_status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vData?.inspection_status === "Approved"
                      ? "Approved"
                      : "In Progress"}
                  </p>
                </div>
              </div>

              <div className="flex justify-start items-center flex-col my-8 space-y-3 relative whitespace-wrap overflow-auto">
                <div className="w-10 h-10 flex justify-center mx-auto items-center rounded-full text-center">
                  {vData?.inspection_status === "Approved" ? (
                    <div className="w-20 h-10 flex justify-center items-center bg-green-700 rounded text-center">
                      <CircleCheckBig className="text-green-50" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 flex justify-center mx-auto items-center rounded-full bg-red-500 text-center">
                      <OctagonAlert className="text-white" />
                    </div>
                  )}
                </div>

                {vData.result && (
                  <span className=" bg-gray-200 px-2 py-1  rounded">
                    {vData?.result}
                  </span>
                )}
                {vData?.remark && (
                  <span className=" bg-slate-200 px-2 py-1 rounded">
                    {vData?.remark}
                  </span>
                )}
                {/* <button
                  className=" text-white text-lg flex m-4 justify-center w-12 bg-red-500 px-4 py-1 rounded animate-blink"
                  onClick={() => setShowInsApi((prev) => !prev)}
                >
                  OK
                </button> */}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default InspectionStatus;
