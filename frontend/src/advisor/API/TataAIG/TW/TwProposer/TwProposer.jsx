import { useReducer, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "react-toastify";
const initialState = {
  proposal_id: "",
  proposer_salutation: "",
  proposer_fname: "",
  proposer_mname: "",
  proposer_lname: "",
  proposer_email: "",
  proposer_mobile: "",
  proposer_dob: "",
  proposer_gender: "",
  proposer_gstin: "",
  proposer_marital: "",
  proposer_occupation: "",
  proposer_pan: "",
  proposer_add1: "",
  proposer_add2: "",
  proposer_add3: "",
  financier_name: "",
  financier_type: "",
  vehicle_engine: "",
  vehicle_chassis: "",
  vehicle_puc_declaration: true,
  vehicle_puc: "",
  vehicle_puc_expiry: "",
  nominee_age: "",
  nominee_name: "",
  nominee_relation: "",
  appointee_name: "",
  appointee_relation: "",
  bund_od_pol_number: "",
  bund_od_add: "",
  bund_od_insurer_name: "",
  bund_tp_pol_number: "",
  bund_tp_add: "",
  bund_tp_insurer_name: "",
  pre_od_insurer_code: "",
  pre_od_insurer_name: "",
  pre_od_policy_no: "",
  pre_tp_insurer_code: "",
  pre_tp_insurer_name: "",
  pre_tp_pol_no: "",
  pre_insurer_name: "",
  pre_insurer_no: "",
  _finalize: "",
};

function formReducer(state, action) {
  return { ...state, [action.field]: action.value };
}

const TwProposal = () => {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const keysPerPage = 30;
  // Filter and prepare the keys
  const visiblekeys = Object.entries(initialState).filter(
    ([key]) => !["_finalize"].includes(key)
  );
  const [isSecondDivVisible, setIsSecondDivVisible] = useState(false);

  const toggleSecondDiv = () => {
    setIsSecondDivVisible(!isSecondDivVisible);
  };

  // Auto-hide the second div when on page 1
  useEffect(() => {
    if (currentPage === 1) {
      setIsSecondDivVisible(true); // Hide second div when on page 1
    }
  }, []);

  const startIndex = (currentPage - 1) * keysPerPage;
  const paginatedkeys = visiblekeys.slice(startIndex, startIndex + keysPerPage);
  const totalPages = Math.ceil(visiblekeys.length / keysPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleConvert = () => {
    dispatch({ key: "_finalize", value: "1" }); // Set finalize for proposal
    setShowConfirmation(true);
  };

  const handleSave = () => {
    dispatch({ key: "_finalize", value: "0" }); // Set finalize for save
    setShowConfirmSave(true);
  };

  const confirmSave = () => {
    handleSubmit(); // Submit with __finalize = 0
    setShowConfirmSave(false);
  };

  const confirmFinalize = () => {
    handleSubmit(); // Submit with __finalize = 1
    setShowConfirmation(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch({
      field: name,
      value: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formState.proposal_id)
      newErrors.proposal_id = "Proposal ID is required.";
    if (!formState.proposer_salutation)
      newErrors.proposer_salutation = "Salutation is required.";
    if (!formState.proposer_fname)
      newErrors.proposer_fname = "First Name is required.";
    if (!formState.proposer_lname)
      newErrors.proposer_lname = "Last Name is required.";
    if (
      !formState.proposer_email ||
      !/\S+@\S+\.\S+/.test(formState.proposer_email)
    )
      newErrors.proposer_email = "Valid email is required.";
    if (
      !formState.proposer_mobile ||
      !/^\d{10}$/.test(formState.proposer_mobile)
    )
      newErrors.proposer_mobile = "Valid 10-digit mobile number is required.";
    if (!formState.proposer_dob)
      newErrors.proposer_dob = "Date of Birth is required.";
    if (!formState.proposer_gender)
      newErrors.proposer_gender = "Gender is required.";
    if (!formState.proposer_add1)
      newErrors.proposer_add1 = "Address 1 is required.";
    if (!formState.proposer_add2)
      newErrors.proposer_add2 = "Address 2 is required.";
    if (!formState.proposer_add3)
      newErrors.proposer_add3 = "Address 3 is required.";
    if (
      !formState.vehicle_engine ||
      formState.vehicle_engine.length < 6 ||
      formState.vehicle_engine.length > 25
    )
      newErrors.vehicle_engine =
        "Engine number must be between 6 and 25 characters.";
    if (
      !formState.vehicle_chassis ||
      formState.vehicle_chassis.length < 6 ||
      formState.vehicle_chassis.length > 25
    )
      newErrors.vehicle_chassis =
        "Chassis number must be between 6 and 25 characters.";
    if (
      !formState.vehicle_puc_declaration &&
      (!formState.vehicle_puc || !formState.vehicle_puc_expiry)
    ) {
      newErrors.vehicle_puc =
        "PUC details are required when PUC Declaration is false.";
    }
    if (
      formState.nominee_age &&
      formState.nominee_age < 18 &&
      (!formState.appointee_name || !formState.appointee_relation)
    ) {
      newErrors.appointee_name =
        "Appointee details are required if nominee age is below 18.";
    }
    if (formState.finalize !== "0" && formState.finalize !== "1")
      newErrors.finalize = "Finalize must be 0 or 1.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted", formState);
      toast.success("Form submitted successfully!");
    } else {
      toast.error("Please fix validation errors before submitting.");
    }
  };

  return (
    <AnimatePresence>
      <div className="flex">
        {/* <button
        onClick={toggleSecondDiv}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isSecondDivVisible ? 'Hide Second Div' : 'Show Second Div'}
      </button> */}

        <motion.form
          onSubmit={handleSubmit}
          className="shadow-lg flex flex-col rounded overflow-y-auto"
        >
          <div className={`${currentPage > 1 ? "mb-4" : "mb-4"} px-5`}>
            <div className="flex justify-between items-center">
              <span className="md:text-lg text-base">
                Step <b>{currentPage}</b> of 2
              </span>
              <h2
                onClick={toggleSecondDiv}
                className="cursor-pointer md:text-2xl text-lg text-transparent bg-gradient-to-l bg-clip-text from-indigo-600 to-blue-500 font-bold"
              >
                {currentPage > 1 ? "Proposal Preview" : "Proposal Form"}
              </h2>
              <div className="flex space-x-2">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`md:w-6 w-4 md:h-1.5 h-1  ${
                      s === currentPage
                        ? "bg-blue-600"
                        : currentPage[s - 1]
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap ">
            {paginatedkeys.map(([key, value]) => {
              const isHidden =
                ["vehicle_puc", "vehicle_puc_expiry"].includes(key) &&
                !formState.vehicle_puc_declaration;

              return (
                <div
                  className={`text-start w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 px-4 my-4 mb-16 flex flex-col  ${
                    isHidden ? "hidden" : ""
                  }`}
                  key={key}
                >
                  {typeof value === "boolean" ? (
                    <label
                      htmlFor={key}
                      className="flex justify-center items-center my-auto font-medium text-gray-700 capitalize"
                    >
                      <input
                        type="checkbox"
                        id={key}
                        name={key}
                        checked={formState[key]}
                        onChange={handleChange}
                        className="mt-1 mx-3 w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-0 cursor-pointer"
                      />
                      {key.replace(/_/g, " ")}
                    </label>
                  ) : (
                    <label
                      htmlFor={key}
                      className="block font-medium text-gray-700 capitalize"
                    >
                      {key.replace(/_/g, " ")}
                      <input
                        type={
                          key.includes("dob") ||
                          key.includes("expiry") ||
                          key.includes("date")
                            ? "date"
                            : key.includes("email")
                            ? "email"
                            : key.includes("mobile")
                            ? "tel"
                            : "text"
                        }
                        id={key}
                        name={key}
                        value={formState[key]}
                        onChange={handleChange}
                        className={`w-full mt-1 p-2 border ${
                          errors[key] ? "border-red-500" : "border-gray-300"
                        } rounded`}
                      />
                    </label>
                  )}
                  {errors[key] && (
                    <span className="text-red-500 text-sm">{errors[key]}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="my-5 flex justify-between px-5 tracking-wide ">
            <button
              type="button"
              className={`${currentPage === 1 && "cursor-not-allowed"}
                 
                    flex justify-center gap-2 items-center shadow-xl text-lg z-0 bg-slate-100 backdrop-blur-md lg:font-semibold isolation-auto border-none before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded before:bg-red-700 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative md:py-2 px-3 py-1 overflow-hidden rounded group`}
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {currentPage === totalPages ? (
              <div className="flex justify-between space-x-5">
                <button
                  onClick={handleSave}
                  className="flex justify-center gap-2 items-center shadow-xl text-lg bg-slate-100 active:translate-y-[2px] backdrop-blur-md lg:font-semibold isolation-auto border-none before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded before:bg-blue-700 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative md:py-2 px-3 py-1  overflow-hidden rounded group"
                  type="submit"
                >
                  Save
                </button>
                <button
                  onClick={handleConvert}
                  className="flex justify-center gap-2 border-b-[4px] active:border-b-[2px]  active:translate-y-[2px] items-center shadow-xl text-lg bg-slate-100 backdrop-blur-md lg:font-semibold isolation-auto border-none before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded before:bg-green-800 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative md:py-2 px-3 py-1  overflow-hidden rounded group"
                  type="submit"
                >
                  Convert to Proposal
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="flex justify-center gap-2 items-center shadow-xl text-lg z-0 bg-slate-100 backdrop-blur-md lg:font-semibold isolation-auto border-none before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded before:bg-blue-700 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative md:px-8 md:py-2 px-3 py-1  overflow-hidden rounded group"
                onClick={handleNext}
              >
                Next
              </button>
            )}
          </div>
        </motion.form>

        {isSecondDivVisible && (
          <div className="container-fluid justify-between items-center px-5">
            <h1 className="text-2xl font-semibold text-gray-800 whitespace-nowrap">
              Tata AIG Two Wheeler Proposal
            </h1>
          </div>
        )}

        {showConfirmation && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm flex items-center justify-center">
            <AnimatePresence>
              <motion.div
                className="bg-white p-4 rounded shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h3 className="text-lg font-semibold mb-8">
                  {`Are you sure you want to `}
                  <span className="text-blue-600 font-medium">_finalize</span>
                  {` proposal ?`}
                </h3>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-300  cursor-pointer transition-all text-black font-mono font-bold px-6 py-1 rounded
  border-gray-400
    border-b-[4px] hover:brightness-110  
    active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    onClick={() => setShowConfirmation(false)}
                  >
                    No
                  </button>
                  <button
                    className="cursor-pointer transition-all bg-green-600 text-black font-mono font-bold px-6 py-1 rounded
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
        {showConfirmSave && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-md flex items-center justify-center">
            <AnimatePresence>
              <motion.div
                className="bg-white p-4 rounded shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h3 className="text-lg mb-8">
                  {`Are you sure you want to `}
                  <span className="text-blue-600 font-medium">save</span>
                  {` proposal ?`}
                </h3>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-300 cursor-pointer transition-all text-black font-mono font-bold px-6 py-1 rounded border-gray-400 border-b-[4px] hover:brightness-110 active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    onClick={() => setShowConfirmSave(false)}
                  >
                    No
                  </button>
                  <button
                    className="cursor-pointer transition-all bg-blue-500 text-white font-mono font-bold px-6 py-1 rounded border-blue-600 border-b-[4px] hover:brightness-110 active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    onClick={confirmSave}
                  >
                    Yes
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default TwProposal;
