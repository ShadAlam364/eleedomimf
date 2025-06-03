import { useReducer, useState, useEffect } from "react";
import { format, parse } from "date-fns";
// import Data from "../../../Data";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "motion/react";
const initialState = {
  business_type: "",
  q_producer_code: "",
  q_producer_email: "",
  proposer_type: "",
  is_posp: "N",
  q_agent_pan: "",
  pol_start_date: "",
  plan_type: "",
  pol_tenure: "",
  place_reg: "",
  place_reg_no: "",
  proposer_pincode: "",
  dor: "",
  manu_month: "",
  man_year: "",
  pre_pol_ncb: "",
  fleet_policy: false,
  fleet_code: "",
  fleet_name: "",
  pa_owner: false,
  pa_owner_tenure: "",
  pa_owner_declaration: "",
  claim_last: false,
  claim_last_count: "",
  claim_last_amount: "",
  no_past_pol: false,
  prev_pol_type: "",
  prev_pol_start_date: "",
  prev_pol_end_date: "",
  special_regno: false,
  // BH_regno: false,
  regno_1: "",
  regno_2: "",
  regno_3: "",
  regno_4: "",
  vehicle_make: "",
  vehicle_model: "",
  vehicle_variant: "",
  make_code: "",
  model_code: "",
  veh_plying_city: "",
  uw_discount: "",
  uw_loading: "",
  vehicle_idv: "",
  side_car: false,
  side_car_idv: "",
  non_electrical_acc: false,
  non_electrical_si: "",
  non_electrical_des: "",
  electrical_acc: false,
  electrical_si: "",
  electrical_des: "",
  antitheft_cover: false,
  vehicle_blind: false,
  own_premise: false,
  driving_tution: false,
  tppd_discount: false,
  voluntary_deductibles: false,
  voluntary_deductibles_amt: "",
  pa_paid: false,
  pa_paid_no: "",
  pa_paid_si: "",
  pa_unnamed: false,
  pa_unnamed_no: "",
  pa_unnamed_si: "",
  dep_reimburse: false,
  dep_reimburse_claims: "",
  dep_reimburse_deductible: "",
  return_invoice: false,
  consumbale_expense: false,
  add_towing: false,
  add_towing_amount: "",
  rsa: false,
  emg_med_exp: false,
  emg_med_exp_si: "",
  ll_paid: false,
  ll_paid_no: "",
  ll_emp: false,
  ll_emp_no: "",
  add_tppd: false,
  add_tppd_si: "",
  add_pa_owner: false,
  add_pa_owner_si: "",
  add_pa_unnamed: false,
  add_pa_unnamed_si: "",
  vehicle_trails_racing: false,
  event_name: "",
  promoter_name: "",
  event_from_date: "",
  event_to_date: "",
  ext_racing: false,
  imported_veh_without_cus_duty: false,
  fibre_fuel_tank: false,
  loss_accessories: false,
  loss_accessories_idv: "",
  geography_extension: false,
  geography_extension_bang: false,
  geography_extension_bhutan: false,
  geography_extension_lanka: false,
  geography_extension_maldives: false,
  geography_extension_nepal: false,
  geography_extension_pak: false,
  quote_id: "",
  _finalize: "",
};

function formReducer(state, action) {
  return { ...state, [action.key]: action.value };
}

const TwQuote = () => {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const keysPerPage = 36;
  const [isSecondDivVisible, setIsSecondDivVisible] = useState(false);

  const toggleSecondDiv = () => {
    setIsSecondDivVisible(!isSecondDivVisible);
  };

  // Auto-hide the second div when on page 1
  useEffect(() => {
    if (currentPage === 1) {
      setIsSecondDivVisible(false); // Hide second div when on page 1
    }
  }, [currentPage]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Validation for special_regno fields
    if (
      formState.special_regno === false &&
      ["regno_1", "regno_2", "regno_3", "regno_4"].includes(name)
    ) {
      let isValid = false;

      switch (name) {
        case "regno_1": // Uppercase letters only, max 2 characters
          isValid = /^[A-Z]{0,2}$/.test(value);
          break;
        case "regno_2": // Numbers only, max 2 digits
          isValid = /^[0-9]{0,2}$/.test(value);
          break;
        case "regno_3": // Uppercase letters only, max 2 characters
          isValid = /^[A-Z]{0,2}$/.test(value);
          break;
        case "regno_4": // Numbers only, max 4 digits
          isValid = /^[0-9]{0,4}$/.test(value);
          break;
        default:
          isValid = true; // For other inputs
      }
      if (!isValid) return; // Prevent dispatch if validation fails
    }

    dispatch({
      key: name,
      value: type === "checkbox" ? checked : value, // Ensure uppercase where applicable
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formState.business_type)
      newErrors.business_type = "Business Type is required.";
    if (!formState.pol_start_date)
      newErrors.pol_start_date = "Start Date is required.";
    if (!formState.plan_type) newErrors.plan_type = "Plan Type is required.";
    if (!formState.place_reg) newErrors.place_reg = "Reg. Place is required.";
    if (!formState.proposer_pincode)
      newErrors.proposer_pincode = "Pincode is required.";
    if (!formState.manu_month) newErrors.manu_month = "Manu Month is required.";
    if (!formState.man_year) newErrors.man_year = "Man Year is required.";
    if (formState.fleet_policy) {
      if (!formState.fleet_name) {
        newErrors.fleet_name = "Fleet Name is required.";
      }
      if (!formState.fleet_code) {
        newErrors.fleet_code = "Fleet Name is required.";
      }
    }
    if (formState.fleet_policy) {
      if (!formState.fleet_name) {
        newErrors.fleet_name = "Fleet Name is required.";
      }
      if (!formState.fleet_code) {
        newErrors.fleet_code = "Fleet Name is required.";
      }
    }
    if (formState.pa_owner) {
      if (!formState.pa_owner_tenure) {
        newErrors.pa_owner_tenure = "Owner Tenure is required.";
      }
      if (!formState.pa_owner_declaration) {
        newErrors.pa_owner_declaration = "Owner Declaration is required.";
      }
    }
    if (formState.claim_last) {
      if (!formState.claim_last_count) {
        newErrors.claim_last_count = "Last Count is required.";
      }
      if (!formState.claim_last_amount) {
        newErrors.claim_last_amount = "Last Amount is required.";
      }
    }
    if (formState.side_car) {
      if (!formState.side_car_idv) {
        newErrors.side_car_idv = "IDV is required.";
      }
    }
    if (formState.add_towing) {
      if (!formState.add_towing_amount) {
        newErrors.add_towing_amount = "Towing Amount is required.";
      }
    }
    if (formState.emg_med_exp) {
      if (!formState.emg_med_exp_si) {
        newErrors.emg_med_exp_si = "Emg Med Exp SI is required.";
      }
    }
    if (formState.ll_paid) {
      if (!formState.ll_paid_no) {
        newErrors.ll_paid_no = "LL Paid No. is required.";
      }
    }
    if (formState.ll_emp) {
      if (!formState.ll_emp_no) {
        newErrors.ll_emp_no = "LL Emp No. is required.";
      }
    }
    if (formState.add_tppd) {
      if (!formState.add_tppd_si) {
        newErrors.add_tppd_si = "Tppd SI is required.";
      }
    }
    if (formState.add_pa_owner) {
      if (!formState.add_pa_owner_si) {
        newErrors.add_pa_owner_si = "Pa Owner SI is required.";
      }
    }
    if (formState.add_pa_unnamed) {
      if (!formState.add_pa_unnamed_si) {
        newErrors.add_pa_unnamed_si = "Pa Unnamed SI is required.";
      }
    }
    if (formState.loss_accessories) {
      if (!formState.loss_accessories_idv) {
        newErrors.loss_accessories_idv = "Loss Accessories Idv is required.";
      }
    }

    if (formState.geography_extension) {
      if (!formState.geography_extension_bang || !formState.geography_extension_bhutan || !formState.geography_extension_lanka || !formState.geography_extension_maldives || !formState.geography_extension_nepal || !formState.geography_extension_pak) {
        newErrors.geography_extension = "Geography Extension is required.";
      }
    }

    if (formState.voluntary_deductibles) {
      if (!formState.voluntary_deductibles_amt) {
        newErrors.voluntary_deductibles_amt = "VD Amount is required.";
      }
    }
    if (formState.pa_paid) {
      if (!formState.pa_paid_si) {
        newErrors.pa_paid_si = "Paid Si is required.";
      }
      // if (!formState.pa_paid_no) {
      //   newErrors.pa_paid_no = "Paid No.is required.";
      // }
    }
    if (formState.pa_unnamed) {
      if (!formState.pa_unnamed_si) {
        newErrors.pa_unnamed_si = "Unnamed Si is required.";
      }
      // if (!formState.pa_unnamed_no) {
      //   newErrors.pa_unnamed_no = "Unnamed No. is required.";
      // }
    }
    if (formState.non_electrical_acc) {
      if (!formState.non_electrical_si) {
        newErrors.non_electrical_si = "Non Electrical SI is required.";
      }
      if (!formState.non_electrical_des) {
        newErrors.non_electrical_des = "Non Electrical Des is required.";
      }
    }
    if (formState.dep_reimburse) {
      if (!formState.dep_reimburse_claims) {
        newErrors.dep_reimburse_claims = "Claims is required.";
      }
      if (!formState.dep_reimburse_deductible) {
        newErrors.dep_reimburse_deductible = " Deductible is required.";
      }
    }
    if (formState.non_electrical_acc) {
      if (!formState.non_electrical_si) {
        newErrors.non_electrical_si = "Non Electrical SI is required.";
      }
      if (!formState.non_electrical_des) {
        newErrors.non_electrical_des = "Non Electrical Des is required.";
      }
    }
    if (formState.electrical_acc) {
      if (!formState.electrical_si) {
        newErrors.electrical_si = "Electrical SI is required.";
      }
      if (!formState.electrical_des) {
        newErrors.electrical_des = "Electrical Des is required.";
      }
    }
    if (!formState.no_past_pol) {
      if (!formState.prev_pol_type) {
        newErrors.prev_pol_type = "Prev Pol Type is required.";
      }
      if (!formState.prev_pol_start_date) {
        newErrors.prev_pol_start_date = "Prev Pol Start Date is required.";
      }
      if (!formState.prev_pol_end_date) {
        newErrors.prev_pol_end_date = "Prev Pol End Date is required.";
      }
    }

    if (formState.vehicle_trails_racing){
      if (!formState.event_name) {
        newErrors.event_name = "Event Name is required.";
      }
      if (!formState.promoter_name) {
        newErrors.promoter_name = "Promoter Name is required.";
      }
      if (!formState.event_from_date) {
        newErrors.event_from_date = "Event Date is required.";
      }
      if (!formState.event_to_date) {
        newErrors.event_to_date = "Event Date is required.";
      }
    }
    
    if (!formState.vehicle_make)
      newErrors.vehicle_make = "Vehicle Make is required.";
    if (!formState.vehicle_model)
      newErrors.vehicle_model = "Vehicle Model is required.";
    if (!formState.vehicle_variant)
      newErrors.vehicle_variant = "Vehicle Variant is required.";

    if (formState.finalize !== "0" && formState.finalize !== "1")
      newErrors.finalize = "Finalize must be 0 or 1.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Filter and prepare the keys
  const visiblekeys = Object.entries(initialState).filter(
    ([key]) =>
      ![
        "q_producer_code",
        "regno_2",
        "regno_3",
        "regno_4",
        "q_producer_email",
        "proposer_type",
        "is_posp",
        "q_agent_pan",
        "quote_id",
        "_finalize",
        "geography_extension_maldives",
        "geography_extension_lanka",
        "geography_extension_pak",
        "geography_extension_bhutan",
        "geography_extension_bang",
        "geography_extension_nepal",
      ].includes(key)
  );
  // Calculate paginated keys
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
    dispatch({ key: "__finalize", value: "1" }); // Set finalize for proposal
    setShowConfirmation(true);
  };

  const handleSave = () => {
    dispatch({ key: "__finalize", value: "0" }); // Set finalize for save
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
  // console.log("Form Submitted", formState);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // console.log("Form Submitted", formState);
      toast.success("Form submitted successfully!");
    } else {
      toast.error("Please fix validation errors before submitting.");
    }
  };

  return (
    <AnimatePresence>
      <div className="flex">
        <motion.form
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onSubmit={handleSubmit}
          className="flex flex-col shadow-lg rounded overflow-y-auto  grow"
        >
          <div className={`${currentPage > 1 ? "mb-4" : "mb-8"} px-2`}>
            <div className="flex justify-between items-center">
              <span className="md:text-lg text-base">
                Step <b>{currentPage}</b> of 3
              </span>
              <h2
                onClick={() => currentPage > 1 && toggleSecondDiv()}
                className={`${
                  currentPage > 1 ? "cursor-pointer" : ""
                } md:text-2xl text-lg text-transparent bg-gradient-to-l bg-clip-text from-indigo-600 to-blue-500 font-bold`}
              >
                {currentPage > 2 ? "Quote Preview" : "Quote Form"}
              </h2>
              <div className="flex space-x-2">
                {[1, 2, 3].map((s) => (
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

          <div className="flex flex-wrap justify-start">
            {paginatedkeys.map(([key, value]) => {
              const isHidden =
                (["fleet_code", "fleet_name"].includes(key) &&
                  !formState.fleet_policy) ||
                (["pa_owner_tenure", "pa_owner_declaration"].includes(key) &&
                  !formState.pa_owner) ||
                (["claim_last_count", "claim_last_amount"].includes(key) &&
                  !formState.claim_last) ||
                ([
                  "prev_pol_type",
                  "prev_pol_start_date",
                  "prev_pol_end_date",
                ].includes(key) &&
                  formState.no_past_pol) ||
                (["non_electrical_des", "non_electrical_si"].includes(key) &&
                  !formState.non_electrical_acc) ||
                (["electrical_des", "electrical_si"].includes(key) &&
                  !formState.electrical_acc) ||
                ([
                  "event_from_date",
                  "event_to_date",
                  "promoter_name",
                  "event_name",
                ].includes(key) &&
                  !formState.vehicle_trails_racing) ||
                (key === "voluntary_deductibles_amt" &&
                  !formState.voluntary_deductibles) ||
                (["pa_paid_no", "pa_paid_si"].includes(key) &&
                  !formState.pa_paid) ||
                (["pa_unnamed_si", "pa_unnamed_no"].includes(key) &&
                  !formState.pa_unnamed) ||
                (["dep_reimburse_claims", "dep_reimburse_deductible"].includes(
                  key
                ) &&
                  !formState.dep_reimburse) ||
                (key === "side_car_idv" && !formState.side_car) ||
                (key === "add_towing_amount" && !formState.add_towing) ||
                (key === "emg_med_exp_si" && !formState.emg_med_exp) ||
                (key === "ll_paid_no" && !formState.ll_paid) ||
                (key === "ll_emp_no" && !formState.ll_emp) ||
                (key === "add_tppd_si" && !formState.add_tppd) ||
                (key === "add_pa_owner_si" && !formState.add_pa_owner) ||
                (key === "add_pa_unnamed_si" && !formState.add_pa_unnamed) ||
                (key === "loss_accessories_idv" && !formState.loss_accessories);
              // ([
              //   "geography_extension_maldives",
              //   "geography_extension_lanka",
              //   "geography_extension_pak",
              //   "geography_extension_bhutan",
              //   "geography_extension_bang",
              //   "geography_extension_nepal",
              // ].includes(key) &&
              //   !formState.geography_extension);

              return (
                <div
                  className={`text-start w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 px-3 my-4 mb-9 flex justify-center flex-col  ${
                    isHidden ? "hidden" : ""
                  }`}
                  key={key}
                >
                  {!isHidden &&
                    ([
                      "business_type",
                      "plan_type",
                      "manu_month",
                      "man_year",
                    ].includes(key) ? (
                      <>
                        <label
                          htmlFor={key}
                          className="block font-medium text-gray-700 capitalize"
                        >
                          {key.replace(/_/g, " ")}

                          <select
                            id={key}
                            name={key}
                            value={formState[key]}
                            onChange={handleChange}
                            className={`w-full mt-1 p-2 border border-gray-300 capitalize rounded ${
                              errors[key] ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <option value="">
                              Select {key.replace(/_/g, " ")}
                            </option>
                            {key === "business_type" && (
                              <>
                                <option value="New Business">
                                  New Business
                                </option>
                                <option value="Roll Over">Roll Over</option>
                                <option value="Used Vehicle">
                                  Used Vehicle
                                </option>
                              </>
                            )}

                            {key === "manu_month" &&
                              Array.from({ length: 12 }, (_, i) => (
                                <option
                                  key={i + 1}
                                  value={String(i + 1).padStart(2, "0")}
                                >
                                  {format(
                                    parse(
                                      String(i + 1).padStart(2, "0"),
                                      "MM",
                                      new Date()
                                    ),
                                    "MMMM"
                                  )}
                                </option>
                              ))}

                            {key === "man_year" &&
                              Array.from({ length: 30 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                );
                              })}
                            {key === "plan_type" && (
                              <>
                                <option value="comprehensive">
                                  Comprehensive
                                </option>
                                <option value="third_party">Third Party</option>
                              </>
                            )}
                          </select>
                        </label>
                        {errors[key] && (
                          <span className="text-red-500 text-sm">
                            {errors[key]}
                          </span>
                        )}
                      </>
                    ) : typeof value === "boolean" ? (
                      <>
                        <div className="flex space-x-2 justify-start items-center my-auto">
                          <input
                            type="checkbox"
                            id={key}
                            name={key}
                            checked={formState[key]}
                            onChange={handleChange}
                            className={`${
                              errors[key] ? "border-red-500" : "border-gray-300"
                            } w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-0 cursor-pointer`}
                          />
                          <label
                            htmlFor={key}
                            className="block font-medium text-gray-700 capitalize"
                          >
                            {key.replace(/_/g, " ")}
                          </label>
                        </div>

                        {key === "geography_extension" &&
                          formState.geography_extension === true && (
                            <div className="grid grid-cols-2 gap-2 mt-4 justify-items-start items-center">
                              {[
                                "geography_extension_bang",
                                "geography_extension_bhutan",
                                "geography_extension_lanka",
                                "geography_extension_maldives",
                                "geography_extension_nepal",
                                "geography_extension_pak",
                              ].map((field) => (
                                <label
                                  htmlFor={field}
                                  key={field}
                                  className="flex font-medium text-gray-700 capitalize justify-start items-center"
                                >
                                  <input
                                    type="checkbox"
                                    name={field}
                                    checked={formState[field]}
                                    onChange={handleChange}
                                    placeholder={formState[field]}
                                    className={`${
                                      errors[key]
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } w-5 h-5 mx-3 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-0 cursor-pointer`}
                                  />
                                  {field.replace("geography_extension_", "")}
                                </label>
                              ))}
                            </div>
                          )}
                        {errors[key] && (
                          <span className="text-red-500 text-sm">
                            {errors[key]}
                          </span>
                        )}
                      </>
                    ) : //  : key === "geography_extension" &&
                    //   formState.geography_extension === true ? (
                    //   <div className="flex gap-2">
                    //     {["geography_extension_bang", "geography_extension_maldives", "geography_extension_pak", "geography_extension_lanka", "geography_extension_bhutan", "geography_extension_nepal"].map(
                    //       (field) => (
                    //         <input
                    //           key={field}
                    //           type="checkbox"
                    //           name={field}
                    //           value={formState[field]}
                    //           onChange={handleChange}
                    //           placeholder={
                    //             formState[field]
                    //           }
                    //           className={`p-1 mt-1 border border-gray-600 font-mono font-extrabold tracking-wider text-xl md:text-2xl rounded text-center uppercase`}
                    //         />
                    //       )
                    //     )}
                    //   </div>
                    // )
                    key === "regno_1" ? (
                      <>
                        <label
                          htmlFor={key}
                          className="block font-medium text-gray-700 capitalize"
                        >
                          {key.replace(/regno_1/g, "Vehicle Reg. No.")}
                        </label>
                        <div className=" flex gap-2">
                          {["regno_1", "regno_2", "regno_3", "regno_4"].map(
                            (field) => (
                              <input
                                key={field}
                                type="text"
                                name={field}
                                maxLength={field === "regno_4" ? 4 : 2}
                                value={
                                  formState.business_type === "New Business" &&
                                  field === "regno_1"
                                    ? "NEW"
                                    : formState[field]
                                }
                                disabled={
                                  formState.business_type ===
                                    "New Business" && [
                                    field === "regno_1",
                                    field === "regno_2",
                                    field === "regno_3",
                                    field === "regno_4",
                                  ]
                                }
                                onChange={handleChange}
                                placeholder={
                                  field === "regno_4"
                                    ? "0000"
                                    : field === "regno_2"
                                    ? "00"
                                    : "XX"
                                }
                                className={`${
                                  field === "regno_4"
                                    ? "w-20 h-10"
                                    : field === "regno_1"
                                    ? "w-16 h-10"
                                    : "w-12 h-10"
                                } ${
                                  errors[key]
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } p-1 mt-1 border border-gray-600 font-mono font-extrabold tracking-wider text-xl md:text-2xl rounded text-center uppercase ${
                                  formState.business_type ===
                                    "New Business" && [
                                    field === "regno_1",
                                    field === "regno_2",
                                    field === "regno_3",
                                    field === "regno_4",
                                  ] &&
                                  "bg-gray-100 cursor-not-allowed"
                                }`}
                              />
                            )
                          )}
                          {errors[key] && (
                            <span className="text-red-500 text-sm">
                              {errors[key]}
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <label
                          htmlFor={key}
                          className="block font-medium text-gray-700 capitalize"
                        >
                          {key.replace(/_/g, " ")}
                        </label>
                        <input
                          type={
                            [
                              "date",
                              "dor",
                              "prev_pol_start_date",
                              "prev_pol_end_date",
                              "pol_start_date",
                              "event_from_date",
                              "event_to_date",
                            ].includes(key)
                              ? "date"
                              : ["email"].includes(key)
                              ? "email"
                              : "text"
                          }
                          id={key}
                          name={key}
                          value={formState[key]}
                          onChange={handleChange}
                          className={`w-full mt-1 p-2 border border-gray-300 rounded ${
                            errors[key] ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors[key] && (
                          <span className="text-red-500 text-sm">
                            {errors[key]}
                          </span>
                        )}
                      </>
                    ))}
                </div>
              );
            })}
          </div>

          <div className="my-2 mb-8 flex justify-between px-3 tracking-wide ">
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
          {/* </div> */}
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
                  {` quote ?`}
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
                  {` quote ?`}
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

export default TwQuote;
