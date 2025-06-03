/* eslint-disable react/prop-types */
import { useReducer, useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { z } from "zod";
import Data from "../../../Data.jsx";
import { useAppContext } from "../../../../../context/Context.jsx";

function formReducer(state, action) {
  return { ...state, [action.key]: action.value };
}
// eslint-disable-next-line no-unused-vars
function CarProposer({ onSubmit, financier }) {
  const { state } = useAppContext();
  const quote = state.tata.privateCar.quotes;
  
  // Initialize state with quote data
  const initialState = {
    quote_no: quote?.data?.quote_no || "",
    proposal_id: quote?.data?.proposal_id || "",
    product_id: quote?.data?.product_id || "",
    proposer_salutation: "",
    proposer_fname: "",
    proposer_mname: "",
    proposer_lname: "",
    proposer_fullname: "",
    proposer_dob: "",
    proposer_gender: "",
    proposer_marital: "",
    proposer_email: "",
    proposer_mobile: quote?.data?.mobile_no || "",
    proposer_add1: "",
    proposer_add2: "",
    proposer_add3: "",
    proposer_pincode: quote?.data?.proposer_pincode || "",
    proposer_occupation: "",
    proposer_occupation_other: "",
    proposer_pan: "",
    proposer_annual: "",
    proposer_gstin: quote?.data?.proposer_gstin || "",
    vehicle_puc_expiry: "",
    vehicle_puc: "",
    vehicle_puc_declaration: "",
    vehicle_chassis: "",
    vehicle_engine: "",
    nominee_name: "",
    nominee_relation: "",
    nominee_age: null,
    financier_type: "",
    financier_name: "",
    financier_address: "",
    pre_insurer_name: quote?.data?.prev_insurer || "",
    pre_insurer_no: quote?.data?.prev_pol_no || "",
    pre_insurer_address: "",
    appointee_name: "",
    appointee_relation: "",
    carriedOutBy: "",
    declaration: "",
    __finalize: ""
  };

  const [formState, dispatch1] = useReducer(formReducer, initialState);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const keysPerPage = 36;
  const [isSecondDivVisible, setIsSecondDivVisible] = useState(false);
  const isOrganization = quote?.data?.proposer_type === "Organization";
  const isPucDelhi = quote?.data?.reg_place !== "DELHI";
  const isInsurer = quote?.data?.business_type_no === "01";
  const toggleSecondDiv = () => {
    setIsSecondDivVisible(!isSecondDivVisible);
  };
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  // Filter and prepare the keys
  const visiblekeys = Object.entries(initialState).filter(
    ([key]) =>
      ![
        "quote_no",
        "proposal_id",
        "product_id",
        "proposer_fullname",
        "__finalize",
        ...(isPucDelhi ? [] : ["vehicle_puc_expiry", "vehicle_puc", "vehicle_puc_declaration"]),
      ].includes(key)
  );

  // Auto-hide the second div when on page 1
  useEffect(() => {
    if (currentPage === 1) {
      setIsSecondDivVisible(false); // Hide second div when on page 1
    }
  }, [currentPage]);

  // const validateForm = () => {
  //   const newErrors = {};
  //   if (!formState.business_type)
  //     newErrors.business_type = "Business Type is required.";
  //   if (!formState.pol_start_date)
  //     newErrors.pol_start_date = "Start Date is required.";
  //   if (!formState.plan_type) newErrors.plan_type = "Plan Type is required.";
  //   if (!formState.place_reg) newErrors.place_reg = "Reg. Place is required.";
  //   if (!formState.proposer_pincode)
  //     newErrors.proposer_pincode = "Pincode is required.";
  //   if (!formState.manu_month) newErrors.manu_month = "Manu Month is required.";
  //   if (!formState.man_year) newErrors.man_year = "Man Year is required.";
  //   if (formState.fleet_policy) {
  //     if (!formState.fleet_name) {
  //       newErrors.fleet_name = "Fleet Name is required.";
  //     }
  //     if (!formState.fleet_code) {
  //       newErrors.fleet_code = "Fleet Name is required.";
  //     }
  //   }
  //   if (formState.fleet_policy) {
  //     if (!formState.fleet_name) {
  //       newErrors.fleet_name = "Fleet Name is required.";
  //     }
  //     if (!formState.fleet_code) {
  //       newErrors.fleet_code = "Fleet Name is required.";
  //     }
  //   }
  //   if (formState.pa_owner) {
  //     if (!formState.pa_owner_tenure) {
  //       newErrors.pa_owner_tenure = "Owner Tenure is required.";
  //     }
  //     if (!formState.pa_owner_declaration) {
  //       newErrors.pa_owner_declaration = "Owner Declaration is required.";
  //     }
  //   }
  //   if (formState.claim_last) {
  //     if (!formState.claim_last_count) {
  //       newErrors.claim_last_count = "Last Count is required.";
  //     }
  //     if (!formState.claim_last_amount) {
  //       newErrors.claim_last_amount = "Last Amount is required.";
  //     }
  //   }
  //   if (formState.side_car) {
  //     if (!formState.side_car_idv) {
  //       newErrors.side_car_idv = "IDV is required.";
  //     }
  //   }
  //   if (formState.add_towing) {
  //     if (!formState.add_towing_amount) {
  //       newErrors.add_towing_amount = "Towing Amount is required.";
  //     }
  //   }
  //   if (formState.emg_med_exp) {
  //     if (!formState.emg_med_exp_si) {
  //       newErrors.emg_med_exp_si = "Emg Med Exp SI is required.";
  //     }
  //   }
  //   if (formState.ll_paid) {
  //     if (!formState.ll_paid_no) {
  //       newErrors.ll_paid_no = "LL Paid No. is required.";
  //     }
  //   }
  //   if (formState.ll_emp) {
  //     if (!formState.ll_emp_no) {
  //       newErrors.ll_emp_no = "LL Emp No. is required.";
  //     }
  //   }
  //   if (formState.add_tppd) {
  //     if (!formState.add_tppd_si) {
  //       newErrors.add_tppd_si = "Tppd SI is required.";
  //     }
  //   }
  //   if (formState.add_pa_owner) {
  //     if (!formState.add_pa_owner_si) {
  //       newErrors.add_pa_owner_si = "Pa Owner SI is required.";
  //     }
  //   }
  //   if (formState.add_pa_unnamed) {
  //     if (!formState.add_pa_unnamed_si) {
  //       newErrors.add_pa_unnamed_si = "Pa Unnamed SI is required.";
  //     }
  //   }
  //   if (formState.loss_accessories) {
  //     if (!formState.loss_accessories_idv) {
  //       newErrors.loss_accessories_idv = "Loss Accessories Idv is required.";
  //     }
  //   }

  //   if (formState.geography_extension) {
  //     if (
  //       !formState.geography_extension_bang ||
  //       !formState.geography_extension_bhutan ||
  //       !formState.geography_extension_lanka ||
  //       !formState.geography_extension_maldives ||
  //       !formState.geography_extension_nepal ||
  //       !formState.geography_extension_pak
  //     ) {
  //       newErrors.geography_extension = "Geography Extension is required.";
  //     }
  //   }

  //   if (formState.voluntary_deductibles) {
  //     if (!formState.voluntary_deductibles_amt) {
  //       newErrors.voluntary_deductibles_amt = "VD Amount is required.";
  //     }
  //   }
  //   if (formState.pa_paid) {
  //     if (!formState.pa_paid_si) {
  //       newErrors.pa_paid_si = "Paid Si is required.";
  //     }
  //     // if (!formState.pa_paid_no) {
  //     //   newErrors.pa_paid_no = "Paid No.is required.";
  //     // }
  //   }
  //   if (formState.pa_unnamed) {
  //     if (!formState.pa_unnamed_si) {
  //       newErrors.pa_unnamed_si = "Unnamed Si is required.";
  //     }
  //     // if (!formState.pa_unnamed_no) {
  //     //   newErrors.pa_unnamed_no = "Unnamed No. is required.";
  //     // }
  //   }
  //   if (formState.non_electrical_acc) {
  //     if (!formState.non_electrical_si) {
  //       newErrors.non_electrical_si = "Non Electrical SI is required.";
  //     }
  //     if (!formState.non_electrical_des) {
  //       newErrors.non_electrical_des = "Non Electrical Des is required.";
  //     }
  //   }
  //   if (formState.dep_reimburse) {
  //     if (!formState.dep_reimburse_claims) {
  //       newErrors.dep_reimburse_claims = "Claims is required.";
  //     }
  //     if (!formState.dep_reimburse_deductible) {
  //       newErrors.dep_reimburse_deductible = " Deductible is required.";
  //     }
  //   }
  //   if (formState.non_electrical_acc) {
  //     if (!formState.non_electrical_si) {
  //       newErrors.non_electrical_si = "Non Electrical SI is required.";
  //     }
  //     if (!formState.non_electrical_des) {
  //       newErrors.non_electrical_des = "Non Electrical Des is required.";
  //     }
  //   }
  //   if (formState.electrical_acc) {
  //     if (!formState.electrical_si) {
  //       newErrors.electrical_si = "Electrical SI is required.";
  //     }
  //     if (!formState.electrical_des) {
  //       newErrors.electrical_des = "Electrical Des is required.";
  //     }
  //   }
  //   if (!formState.no_past_pol) {
  //     if (!formState.prev_pol_type) {
  //       newErrors.prev_pol_type = "Prev Pol Type is required.";
  //     }
  //     if (!formState.prev_pol_start_date) {
  //       newErrors.prev_pol_start_date = "Prev Pol Start Date is required.";
  //     }
  //     if (!formState.prev_pol_end_date) {
  //       newErrors.prev_pol_end_date = "Prev Pol End Date is required.";
  //     }
  //   }

  //   if (formState.vehicle_trails_racing) {
  //     if (!formState.event_name) {
  //       newErrors.event_name = "Event Name is required.";
  //     }
  //     if (!formState.promoter_name) {
  //       newErrors.promoter_name = "Promoter Name is required.";
  //     }
  //     if (!formState.event_from_date) {
  //       newErrors.event_from_date = "Event Date is required.";
  //     }
  //     if (!formState.event_to_date) {
  //       newErrors.event_to_date = "Event Date is required.";
  //     }
  //   }

  //   if (!formState.vehicle_make)
  //     newErrors.vehicle_make = "Vehicle Make is required.";
  //   if (!formState.vehicle_model)
  //     newErrors.vehicle_model = "Vehicle Model is required.";
  //   if (!formState.vehicle_variant)
  //     newErrors.vehicle_variant = "Vehicle Variant is required.";

  //   if (formState.__finalize !== "0" && formState.__finalize !== "1")
  //     newErrors.__finalize = "Finalize must be 0 or 1.";

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const validateForm = () => {
    if (currentPage === 1) {
      return z.object({
        proposer_salutation: z.string().min(1, "Salutation is required."),
        proposer_fname: z.string().min(1, "First Name is required."),
        proposer_lname: z.string().min(1, "Last Name is required."),
        proposer_dob: z.string().min(1, "DOB is required."),
        proposer_gender: z.string().min(1, "Gender is required."),
        proposer_marital: z.string().min(1, "Martial Status is required."),
        proposer_email: z.string().min(1, "Email is required."),
        proposer_add1: z.string().min(1, "Address is required."),
        proposer_add2: z.string().min(1, "Address is required."),
        vehicle_chassis: z.string().min(1, "Chassis No. is required.").min(isInsurer ? 17 : 6, isInsurer  ? "Chassis No. must be atleast 17 characters for New Business." : "Chassis No. must be atleast 6 characters."),
        vehicle_engine: z.string().min(1, "Engine No. is required.").min(6, "Engine No. must be atleast 6 characters."),
        nominee_name: z.string().min(1, "Name is required."),
        nominee_age: z.number().min(1, "Age is required."),
        nominee_relation: z.string().min(1, "Relation is required."),
        financier_type: z.string().min(1, "Type is required."),
        financier_name: z.string().min(1, "Name is required."),
        financier_address: z.string().min(1, "Address is required."),
        carriedOutBy: z.string().min(1, "Choose Yes or No!"),
        declaration: z.string().min(1, "Choose Yes or No!"),
        proposer_occupation_other: z
          .string()
          .optional()
          .refine(
            (val) => {
              return (
                formState?.proposer_occupation !== "OTHER" ||
                (val && val.trim().length > 0)
              );
            },
            { message: "Other Occupation is required." }
          ),
      });
    }

    // else if (currentPage === 2) {
    //   return z.object({
    //     motor_plan_opted: z.string().min(1, "Plans is required."),
    //   });
    // }

    // else if (currentPage === 3) {
    //   return z.object({
    //     motor_plan_opted: z.string().min(1, "Motor Plan is required."),
    //     pa_owner: z.boolean().refine((val) => val !== undefined, {
    //       message: "PA Owner is required.",
    //     }),
    //     electrical_si: z.number().max(50000, "Electrical SI cannot exceed 50,000."),
    //     non_electrical_si: z.number().max(50000, "Non-Electrical SI cannot exceed 50,000."),
    //   });
    // }
    return z.object({});
  };
  // Calculate paginated keys
  const startIndex = (currentPage - 1) * keysPerPage;
  const paginatedkeys = visiblekeys.slice(startIndex, startIndex + keysPerPage);
  const totalPages = Math.ceil(visiblekeys?.length / keysPerPage);

  const handleNext = () => {
    try {
      if (currentPage < totalPages) {
        const schema = validateForm();
        schema.parse(formState);
        // If no errors, move to the next page
        setErrors({});
        setCurrentPage((prev) => prev + 1);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };
  // const handleNext = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //     if(validateForm()){
  //       setCurrentPage(currentPage + 1);
  //     }
  //       // Display all error messages
  //   Object.entries(errors).forEach(([key, message]) => {
  //     console.log(`${key}: ${message}`); // Log errors for debugging
  //   });
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Remove errors dynamically
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });

    // Additional logic based on input name
    switch (name) {
      case "man_year": {
        dispatch1({
          key: name,
          value: Number(value),
        });
        break;
      }
      case "nominee_age": {
        dispatch1({
          key: name,
          value: Number(value) || null,
        });
        break;
      }

      default:
        // General form handling
        dispatch1({
          key: name,
          value: value,
        });
        break;
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleConvert = () => {
    try {
      const schema = validateForm();
      schema.parse(formState);
      // If no errors, move to the next
      setErrors({});
      dispatch1({ key: "__finalize", value: "1" }); // Set finalize for proposal
      setShowConfirmation(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const handleSave = () => {
    try {
      const schema = validateForm();
      schema.parse(formState);
      // If no errors, move to the next
      setErrors({});
      dispatch1({ key: "__finalize", value: "0" }); // Set finalize for proposal
      setShowConfirmSave(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  // const handleSubmitCarProposal = (e) => {
  //   if (e) {
  //     e.preventDefault();
  //   }
  //   onSubmit(formState);
  // };

  const handleSubmitCarProposal = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (validateForm()) {
      onSubmit(formState);
    }
  };

  const confirmSave = () => {
    handleSubmitCarProposal(); // Submit with __finalize = 0
    setShowConfirmSave(false);
  };

  const confirmFinalize = () => {
    handleSubmitCarProposal(); // Submit with __finalize = 1
    setShowConfirmation(false);
  };

  // Memoized filtered keys
  const filteredKeys = useMemo(
    () =>
      Object.entries(formState).filter(
        ([key, value]) =>
          value && // Only truthy values
          !["__finalize"].includes(key) // Exclude specific keys
      ),
    [formState] // Recalculate when formState changes
  );

  return (
    <AnimatePresence>
      <div className="flex tracking-wider">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onSubmit={handleSubmitCarProposal}
          className="flex flex-col shadow-lg  rounded overflow-y-auto grow">
          <div className={`${currentPage > 1 ? "mb-3" : "mb-3"} px-5`}>
            <div className="flex justify-between items-center">
              <span className="md:text-lg text-base">
                Step <b>{currentPage}</b> of 1
              </span>
              <h2
                onClick={() => currentPage > 0 && toggleSecondDiv()}
                className={`${
                  currentPage > 0 ? "cursor-pointer" : ""
                } md:text-2xl text-lg text-transparent bg-gradient-to-l bg-clip-text from-indigo-600 to-blue-500 font-bold`}>
                Proposal Form
              </h2>
              <div className="flex space-x-2">
                {[1].map((s) => (
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
            {paginatedkeys.map(([key]) => {
              const isHidden =
                ([
                  "proposer_occupation_other",
                  // "pre_insurer_name",
                  // "pre_insurer_no",
                  // "pre_insurer_address",
                ].includes(key) &&
                  (!formState.proposer_occupation ||
                    formState.proposer_occupation !== "OTHER")) ||
                ([
                  "proposer_gender",
                  "proposer_marital",
                  "proposer_occupation",
                  "proposer_dob",
                ].includes(key) &&
                  isOrganization) ||
                ([
                  "pre_insurer_name",
                  "pre_insurer_no",
                  "pre_insurer_address",
                ].includes(key) &&
                  isInsurer);
              return (
                <div
                  className={`text-start my-6 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 px-4 mb-8 flex justify-center flex-col ${
                    isHidden ? "hidden" : ""
                  }`}
                  key={key}
                >
                  {!isHidden &&
                    ([
                      "proposer_salutation",
                      "proposer_gender",
                      "proposer_marital",
                      "proposer_occupation",
                      "nominee_relation",
                      "financier_type",
                      "financier_name",
                      "appointee_relation",
                      "pre_insurer_name",
                    ].includes(key) ? (
                      <>
                        <label
                          htmlFor={key}
                          className="block font-medium text-gray-700 capitalize"
                        >
                          {key.replace(/_/g, " ")}
                          {Data?.requiredFields?.includes(key) && ( // Add red star for required fields
                            <span className="text-red-500 font-bold"> *</span>
                          )}
                          <select
                            id={key}
                            name={key}
                            value={formState[key]}
                            onChange={handleChange}
                            className={`cursor-pointer w-full p-2 border border-gray-300 my-1 capitalize rounded ${
                              errors[key] ? "border-red-500" : "border-gray-300"
                            }`}>
                            <option value="">
                              Select {key.replace(/_/g, " ")}
                            </option>
                            {key === "proposer_salutation" &&
                              (isOrganization
                                ? [
                                    <option key="ms" value="M/s.">
                                      M/S.
                                    </option>,
                                  ] // Show Only M/S
                                : Data.titles.map((title, idx) => (
                                    <option key={idx} value={title}>
                                      {title}
                                    </option>
                                  )))}
                            {key === "proposer_gender" &&
                              Data.gender.map((plan, idx) => (
                                <option key={idx} value={plan}>
                                  {plan}
                                </option>
                              ))}

                            {key === "pre_insurer_name" &&
                              Data.prevInsurer.map((plan, idx) => (
                                <option key={idx} value={plan}>
                                  {plan}
                                </option>
                              ))}


                            {key === "proposer_marital" &&
                              Data.marital_status.map((plans, idx) => (
                                <option key={idx} value={plans}>
                                  {plans}
                                </option>
                              ))}
                            {key === "proposer_occupation" &&
                              Data.occupation.map((ocp, idx) => (
                                <option key={idx} value={ocp}>
                                  {ocp}
                                </option>
                              ))}
                            {key === "nominee_relation" &&
                              Data.nomineeRelationships.map((ocp, idx) => (
                                <option key={idx} value={ocp}>
                                  {ocp}
                                </option>
                              ))}
                            {key === "financier_type" &&
                              Data.financier_types.map((ocp, idx) => (
                                <option key={idx} value={ocp}>
                                  {ocp}
                                </option>
                              ))}
                            {key === "financier_name" &&
                              Data.banks.map((ocp, idx) => (
                                <option key={idx} value={ocp}>
                                  {ocp}
                                </option>
                              ))}
                            {key === "appointee_relation" &&
                              Data.nomineeRelationships.map((ocp, idx) => (
                                <option key={idx} value={ocp}>
                                  {ocp}
                                </option>
                              ))}
                          </select>
                        </label>
                        {errors[key] && (
                          <span className="text-red-500 text-sm">
                            {errors[key]}
                          </span>
                        )}
                      </>
                    ) : ["vehicle_puc_declaration", "carriedOutBy", "declaration"].includes(key) ? (
                      <div key={key} className="flex flex-col justify-around">
                        <span className=" font-medium text-gray-700 capitalize">
                          {key.replace(/_/g, " ")}
                          {Data?.requiredFields?.includes(key) && ( // Add red star for required fields
                            <span className="text-red-500 font-bold"> *</span>
                          )}
                        </span>
                        <div className="flex flex-col mt-0.5">
                          <div className="flex flex-wrap space-x-8 justify-start ">
                            <label
                              htmlFor={`${key}-yes`}
                              className="flex items-center justify-center cursor-pointer">
                              <input
                                type="radio"
                                id={`${key}-yes`}
                                name={key}
                                value="Yes"
                                checked={formState[key] === "Yes"}
                                onChange={handleChange}
                                className="mr-1 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 focus:ring-0 cursor-pointer focus:outline-none focus:shadow-none rounded"
                              />
                              Yes
                            </label>
                            <label
                              htmlFor={`${key}-no`}
                              className="flex items-center justify-center cursor-pointer"
                            >
                              <input
                                type="radio"
                                id={`${key}-no`}
                                name={key}
                                value="No"
                                checked={formState[key] === "No"}
                                onChange={handleChange}
                                className="mr-1 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-0 cursor-pointer focus:outline-none rounded"
                              />
                              No
                            </label>
                          </div>
                          {errors[key] && (
                            <span className="text-red-500 text-sm text-start px-auto">
                              {errors[key]}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <label
                          htmlFor={key}
                          className="block font-medium text-gray-700 capitalize">
                          {key.replace(/_/g, " ")}
                          {Data?.requiredFields?.includes(key) && ( // Add red star for required fields
                            <span className="text-red-500 font-bold"> *</span>
                          )}
                        </label>
                        <input
                          type={
                            ["proposer_dob", "vehicle_puc_expiry"].includes(key)
                              ? "date"
                              : ["email"].includes(key)
                              ? "email"
                              : "text"
                          }
                          id={key}
                          name={key}
                          value={formState[key]}
                          onChange={handleChange}
                          max={
                            quote?.data?.proposer_type === "Organization" &&
                            key === "proposer_dob"
                              ? ""
                              : eighteenYearsAgo
                          }
                          disabled={[
                            "proposer_pincode",
                            "proposer_mobile",
                          ].includes(key)}
                          className={`${
                            ["proposer_pincode", "proposer_mobile"].includes(
                              key
                            ) && "bg-red-50"
                          } w-full p-2 border border-gray-300 rounded ${
                            errors[key] ? "border-red-500" : "border-gray-300"
                          }`}/>
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

          <div className="my-2 mb-8 flex justify-between px-5 tracking-wide">
            <button
              type="button"
              className={`${currentPage === 1 && "cursor-not-allowed"}
                 
                    flex justify-center gap-2 items-center shadow-xl text-lg  bg-slate-100 backdrop-blur-md lg:font-semibold isolation-auto border-none before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded before:bg-red-700 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative md:py-2 px-3 py-1 overflow-hidden rounded group`}
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
        </motion.div>

        {isSecondDivVisible && (
          <div
            className={`container-fluid max-w-sm w-full justify-between items-center px-2 overflow-y-auto ease-in-out`}
            style={{ maxHeight: "678px" }}
          >
            <h1 className="text-center text-white text-lg font-semibold text-transparent bg-gradient-to-l rounded from-indigo-600 to-blue-500 whitespace-nowrap">
              Pvt Car Proposal
            </h1>
            {filteredKeys.map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between my-1 overflow-hidden"
              >
                <p className="font-medium capitalize whitespace-nowrap">
                  {key.replace(/_/g, " ")}:
                </p>
                <span className="text-start tracking-wider text-blue-700">
                  {value}
                </span>
              </div>
            ))}
          </div>
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
                <h3 className="text-lg font-semibold mb-8">
                  {`Are you sure you want to `}
                  <span className="text-blue-600 font-medium">__finalize</span>
                  {` ${formState?.proposer_fname} ${formState?.proposer_lname} proposal?`}
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
                  <span className="text-blue-600 font-medium">Save</span>
                  {` ${formState?.proposer_fname} ${formState?.proposer_lname} proposal?`}
                </h3>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-300  cursor-pointer transition-all text-black font-mono font-bold px-6 py-1 rounded-lg
              border-gray-400
                border-b-[4px] hover:brightness-110  
                active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    onClick={() => setShowConfirmSave(false)}
                  >
                    No
                  </button>
                  <button
                    className=" cursor-pointer transition-all bg-blue-500 text-white font-mono font-bold px-6 py-1 rounded-lg
              border-blue-600
                border-b-[4px] hover:brightness-110 
                active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    onClick={confirmSave} // Set formData.__finalize to "1"
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
}

export default CarProposer;
