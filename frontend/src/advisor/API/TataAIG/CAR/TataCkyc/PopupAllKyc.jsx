import { AiOutlineClose } from "react-icons/ai";
import { AnimatePresence, motion } from "motion/react";
import { useAppContext } from "../../../../../context/Context";
import Data from "../../../Data";
import { useState, useEffect } from "react";
import AadhaarKyc from "./Aadhaar/AadhaarKyc";
import DlKyc from "./DL/DlKyc";
import PassportKyc from "./Passport/PassportKyc";
import VoterKyc from "./VoterID/VoterKyc";
import CinKyc from "./CIN/CinKyc";
import OvdForm from "../CarOVD/OvdForm";
import Ckyc from "./CKYC/Ckyc";

// eslint-disable-next-line react/prop-types
function PopupAllKyc({ isOpen, toggleModal }) {
  const [selectedID, setSelectedID] = useState("");
  const { state } = useAppContext();
  const proposer_type = state?.tata?.privateCar?.quotes?.data?.proposer_type;
  const proposal = state.tata.privateCar.proposer;
  const ckyc = state.tata.privateCar.ckyc;
  const sixty = state.tata.privateCar.form60;
  const reqId = sixty?.req_id?.split("_")[0];
  // const Id = proposal?.req_id?.split("_")[0];
  useEffect(() => {
    // Auto-check whenever `verified` changes
    if (ckyc?.verified) {
      toggleModal(); // Close popup
    }
    
  }, [ckyc?.verified, toggleModal]);


  const handleChange = (event) => {
    setSelectedID(event.target.value); // Update the selected type
  };
  const filteredIdTypes =
    proposer_type === "Individual"
      ? Data.id_type.filter((item) => item !== "CIN")
      : Data.id_type.filter((item) => ["CIN", "CKYC"].includes(item));

  return (
    <div
      className={`fixed ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } inset-0 z-50 flex items-center transition-opacity backdrop-blur-sm justify-center bg-black bg-opacity-50`}
    >
      {ckyc?.message_txt === "OTP Sending Failed" ||
      ckyc?.message_txt === "Server down" ||
      ckyc?.message_txt === "Details not matching. Please enter again" ? (
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`bg-white max-w-3xl w-full p-4 rounded-lg shadow-lg transform transition-transform duration-300 ${
              isOpen ? "scale-100 " : "scale-90 "
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2 mb-2 my-auto">
              <h2 className="text-base text-gray-700 font-semibold">
                Proposal ID : {proposal.proposal_id}{" "}
              </h2>
              <button
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-800"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="text-black justify-between tracking-wide">
              <p className="uppercase font-serif bg-blue-800 bg-clip-text text-transparent">
                Please help us with the following details to accelerate your kyc
                process!
              </p>
              <p className="my-5 font-medium text-slate-600 text-start ml-0.5 uppercase ">
                PAN :{" "}
                <span className="text-blue-800 font-semibold">
                  {ckyc.data.req_id.split("_")[0]}
                </span>
              </p>
              {/* {ckyc.data.req_id.split('_')[0] === "ovd" && (
              <p className="px-3 border text-blue-800 border-blue-600 py-4 border-l-4 rounded-md  font-medium  text-start ml-0.5 captitalize">
                OVD Uploaded Successfully!
              </p>
            )} */}
              <OvdForm />
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`bg-white max-w-3xl w-full p-4 rounded-lg shadow-lg transform transition-transform duration-300 ${
              isOpen ? "scale-100 " : "scale-90 "
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2 mb-2 my-auto">
              <h2 className="text-base text-gray-700 font-semibold">
                Proposal ID : {proposal.proposal_id}{" "}
              </h2>
              <button
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-800"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="text-black justify-between tracking-wide">
              <p className="uppercase font-serif bg-blue-800 bg-clip-text text-transparent">
                Please help us with the following details to accelerate your kyc
                process!
              </p>
              <p className="my-5 font-medium  text-start ml-0.5 capitalize ">
                PAN : {reqId}
              </p>
              {reqId && (
                <p className="px-3 border text-blue-800 border-blue-600 py-4 border-l-4 rounded-md  font-medium  text-start ml-0.5 captitalize">
                  Form60 Uploaded Successfully!
                </p>
              )}
            </div>

            <div className="my-8 text-start">
              <label className="block text-gray-700 font-medium mb-1">
                Choose KYC Type:
              </label>
              <select
                name="id_type"
                value={selectedID}
                onChange={handleChange}
                className="w-full px-3 py-2 border-none cursor-pointer tracking-wider rounded bg-slate-100 shadow-inner focus:ring-0 focus:outline-none"
              >
                <option value="">Select ID Type</option>
                {/* {filteredIdTypes.map((item, idx) => (
                  <option key={idx} value={item}>
                    {item}
                  </option>
                ))} */}
                {(ckyc?.message_txt === "Server down"
                  ? ["AADHAAR"]
                  : filteredIdTypes
                ).map((item, idx) => (
                  <option key={idx} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* ############################################## AADHAAR/PAN/DL/VOTERID/PASSPORT/CIN/CKYC ################################################## */}

            {selectedID === "AADHAAR" && <AadhaarKyc selectedID={selectedID} />}
            {selectedID === "DL" && <DlKyc selectedDLID={selectedID} />}
            {selectedID === "VOTERID" && <VoterKyc selectedID={selectedID} />}
            {selectedID === "PASSPORT" && (
              <PassportKyc selectedID={selectedID} />
            )}
            {selectedID === "CKYC" && <Ckyc selectedID={selectedID} />}
            {selectedID === "CIN" && <CinKyc selectedID={selectedID} />}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default PopupAllKyc;
