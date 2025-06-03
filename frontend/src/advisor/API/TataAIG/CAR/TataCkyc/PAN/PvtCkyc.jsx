import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAppContext } from "../../../../../../context/Context";
// import AadhaarKyc from "../Aadhaar/AadhaarKyc";
// import OvdForm from "../../CarOVD/OvdForm";
import PropTypes from "prop-types";

function PvtCkyc({ onSubmit, setFormSixtyState }) {
  const { state } = useAppContext();
  const [errors, setErrors] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const proposal = state.tata.privateCar.proposer;
  const ckyc = state.tata.privateCar.ckyc;
  const sixty = state.tata.privateCar.form60.req_id;
  const inspStatus = state?.tata?.privateCar?.vInsStatus;
  
  const [formData, setFormData] = useState({
    proposal_no: proposal?.proposal_no || "",
    id_type: "PAN",
    id_num: "",
    req_id: "",
    gender: "",
    dob: "",
  });

  // const isOvd = ckyc?.req_id?.split("_")[0] === "ovd";
  // const isServer = ckyc?.req_id?.split("_")[0] === "server";
  // const isServerDown = ckyc?.message_txt === "Server down";

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) {
      setErrors("Invalid PAN format");
      return false;
    }
    setErrors("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "id_num") {
      const updatedValue = value.toUpperCase();
      validatePAN(updatedValue);
      setFormData((prevData) => ({
        ...prevData,
        [name]: updatedValue,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    if (!validatePAN(formData.id_num)) {
      return;
    }
    onSubmit(formData);
  };

  const handleConvert = () => {
    if (!validatePAN(formData.id_num)) {
      return;
    }
    setShowConfirmation(true);
  };

  const confirmFinalize = () => {
    handleSubmit();
    setShowConfirmation(false);
  };

  const RenderStep = () => {
    if (!ckyc?.req_id || !ckyc?.data?.req_id) {
      return (
        <div className="w-full max-w-md mx-auto p-4">
          <label htmlFor="id_num" className="font-semibold ">PAN No <span className="text-red-600">*</span></label>
          <div className="flex flex-wrap space-x-4 space-y">
            <input
              type="text"
              name="id_num"
              value={formData.id_num}
              onChange={handleChange}
              placeholder="Enter PAN No."
              className={`${
                ckyc?.verified
                  ? "bg-slate-100 text-black"
                  : "bg-gray-200 text-black"
              } items-center text-base md:text-inherit shadow-inner p-1.5 font-medium rounded border-none`}
              disabled={ckyc?.verified || ckyc?.req_id}
            />
            <button
              onClick={handleConvert}
              className={`${
                ckyc?.verified || ckyc?.req_id || !formData.id_num
                  ? "bg-gray-600 text-gray-50 border-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-slate-100 active:border-b-[2px] border-green-700 active:translate-y-[2px] hover:text-gray-50"
              } justify-center border-b-[4px] items-center shadow-xl text-base backdrop-blur-md lg:font-semibold relative md:py-2 px-3 py-1 overflow-hidden rounded group`}
              type="submit"
              disabled={ckyc?.verified || !formData.id_num || ckyc?.req_id}
            >
              {ckyc?.verified ? "Verified" : "Submit"}
            </button>
          </div>
          {(ckyc?.verified || ckyc?.req_id) && (
            <span className="text-red-600 text-start">Please Go with Form60</span>
          )}
          {errors && (
            <span className="text-red-600 text-start">{errors}</span>
          )}
        </div>
      );
    } 
    // else if (ckyc?.req_id.split("_")[0] === "ckyc") {
    //   return <AadhaarKyc />;
    // } else if (isOvd || isServer || isServerDown) {
    //   return <OvdForm />;
    // } else {
    //   return null;
    // }
  };

  return (
    <>
      {(sixty?.split("_")[0] !== "form60" || !ckyc?.verified) &&
        (!proposal?.payment_id || !inspStatus?.data?.policy?.payment_id) && (
          <>
            <div className="max-w-full border shadow-inner p-2 tracking-wide bg-slate-100 isolation-auto border-none relative rounded group mx-4">
              {RenderStep()}
              {(ckyc?.req_id || ckyc?.data?.req_id) ? (
                <div className="flex flex-col text-center mt-4">
                  <span>
                    Don&apos;t have a PAN?{" "}
                   
                  </span>
                  <button
                      onClick={() => setFormSixtyState(true)}
                      className="text-blue-800 font-semibold tracking-wide"
                    >
                      Upload Form60
                    </button>
                </div>
              ) : null}
            </div>
          </>
        )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-md flex items-center justify-center">
          <AnimatePresence>
            <motion.div
              className="bg-white p-4 rounded shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h3 className="text-lg font-semibold mb-8 text-start">
                {`Are you sure, you want to proceed`} {`to complete cKYC?`}
              </h3>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-300 cursor-pointer transition-all text-black font-mono font-bold px-6 py-1 rounded border-gray-400 border-b-[4px] hover:brightness-110 active:border-b-[2px] active:brightness-90 active:translate-y-[1px]"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 transition-all text-white font-mono font-bold px-6 py-1 rounded border-green-700 border-b-[4px] hover:brightness-110 active:border-b-[2px] active:brightness-90 active:translate-y-[1px]"
                  onClick={confirmFinalize}
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

PvtCkyc.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  setFormSixtyState: PropTypes.func.isRequired
};

export default PvtCkyc;
