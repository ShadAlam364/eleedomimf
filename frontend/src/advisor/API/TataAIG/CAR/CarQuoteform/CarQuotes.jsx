/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { useReducer, useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAppContext } from "../../../../../context/Context.jsx";
import { format, parse } from "date-fns";
import { z } from "zod";
import Data from "../../../Data";
const initialState = {
  source: "P",
  q_producer_email: "chitra2@gmail.com",
  q_producer_code: "4984727878",
  is_posp: "N",
  product_id: "M300000000001",
  product_name: "Private Car",
  product_code: "3184",
  q_office_location: "",
  sol_id: "",
  business_type_no: "",
  proposer_type: "",
  proposer_gstin: "",
  pol_plan_id: "",
  pol_plan_variant: "",
  place_reg_no: "",
  place_reg: "",
  proposer_pincode: "",
  BH_regno: "",
  special_regno: "",
  regno_1: "",
  regno_2: "",
  regno_3: "",
  regno_4: "",
  prev_pol_type: "",
  prev_pol_start_date: "",
  prev_pol_end_date: "",
  dor: "",
  pol_start_date: "",
  dor_first: "",
  man_year: "",
  no_past_pol: "",
  ble_tp_start: "",
  ble_tp_end: "",
  vehicle_make: "",
  vehicle_model: "",
  vehicle_variant: "",
  vehicle_make_no: "",
  vehicle_model_no: "",
  vehicle_variant_no: "",
  pre_pol_ncb: "",
  pre_pol_protect_ncb: null,
  ncb_protection: "",
  ncb_no_of_claims: "",
  proposer_mobile: "",
  tyre_secure: "",
  tyre_secure_options: "",
  prev_tyre: "",
  engine_secure: "",
  engine_secure_options: "",
  prev_engine: "",
  prev_cnglpg: "",
  cng_lpg_cover: "",
  cng_lpg_si: "",
  electrical_si: "",
  non_electrical_si: "",
  pa_owner: "",
  pa_owner_tenure: "",
  pa_owner_declaration: "",
  prev_dep: "",
  dep_reimburse: "",
  dep_reimburse_claims: "",
  add_towing: "",
  add_towing_amount: "",
  return_invoice: "",
  prev_consumable: "",
  consumbale_expense: "",
  pa_unnamed: "",
  pa_unnamed_no: "",
  pa_unnamed_si: "",
  pa_named: "",
  pa_named_no: "",
  pa_named_si: "",
  pa_paid: "",
  pa_paid_no: "",
  pa_paid_si: "",
  ll_paid: "",
  ll_paid_no: "",
  ll_paid_si: "",
  rsa: "",
  key_replace: "",
  repair_glass: "",
  emergency_expense: "",
  personal_loss: "",
  automobile_association_cover: "",
  vehicle_blind: "",
  antitheft_cover: "",
  tppd_discount: "",
  vintage_car: "",
  own_premises: "",
  load_fibre: "",
  load_imported: "",
  load_tuition: "",
  pa_unnamed_csi: "",
  voluntary_amount: "",
  daily_allowance: "",
  allowance_days_accident: "",
  daily_allowance_limit: "",
  allowance_days_loss: "",
  franchise_days: "",
  claim_last: "",
  claim_last_amount: null,
  claim_last_count: null,
  vehicle_idv: "",
  uw_loading: "",
  uw_remarks: "",
  uw_discount: "",
  motor_plan_opted: "",
  motor_plan_opted_no: "",
  quote_id: "",
  proposer_fname: "",
  proposer_mname: "",
  proposer_lname: "",
  __finalize: "",
};

function formReducer(state, action) {
  return { ...state, [action.key]: action.value };
}

// eslint-disable-next-line no-unused-vars
const CarQuotes = ({ onSubmit }) => {
  const { dispatch } = useAppContext();
  const [formState, dispatch1] = useReducer(formReducer, initialState);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  let keysPerPage;
  const [isSecondDivVisible, setIsSecondDivVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState([]);
  const validateForm = () => {
    const getDateDifferenceInDays = (date1, date2) => {
      const timeDifference = date1.getTime() - date2.getTime();
      return Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    };

    // const isCurrentDate = (date) => {
    //   const today = new Date();
    //   const inputDate = new Date(date);
    //   return (
    //     inputDate.getDate() === today.getDate() &&
    //     inputDate.getMonth() === today.getMonth() &&
    //     inputDate.getFullYear() === today.getFullYear()
    //   );
    // };

    // const isNextDate = (date) => {
    //   const today = new Date();
    //   const tomorrow = new Date(today);
    //   tomorrow.setDate(today.getDate() + 1);
    //   const inputDate = new Date(date);
    //   return (
    //     inputDate.getDate() === tomorrow.getDate() &&
    //     inputDate.getMonth() === tomorrow.getMonth() &&
    //     inputDate.getFullYear() === tomorrow.getFullYear()
    //   );
    // };

    // const isBreakIn = (formState) => {
    //   // Logic to determine if there is a break-in
    //   return formState?.prev_pol_end_date && formState?.prev_pol_start_date;
    // };

    const validatePage1 = () => {
      const baseSchema = z.object({
        business_type_no: z.string().min(1, "Business Type is required."),
        proposer_type: z.string().min(1, "Proposer Type is required."),
        pol_start_date: z.string().min(1, "Start Date is required."),
        // .refine(
        //   (val, ctx) => {
        //     const formState = ctx.parent;

        //     const isLiability = formState.prev_pol_type === "Liability";
        //     const isBusinessType01 = formState?.business_type_no === "01";
        //     const isBusinessType03 = formState?.business_type_no === "03";
        //     const isStandaloneOD = formState?.pol_plan_variant === "Standalone OD";
        //     const isBreakInPolicy = isBreakIn(formState);
        //     const isTPRollover = formState?.is_tp_rollover;

        //     if (isLiability || (isBusinessType03 && !isBreakInPolicy) || (isStandaloneOD && !isBreakInPolicy) || (isBusinessType03 && isTPRollover)) {
        //       return isNextDate(val);
        //     }

        //     if (isBusinessType01 || (isBusinessType03 && isBreakInPolicy) || (isStandaloneOD && isBreakInPolicy)) {
        //       return isCurrentDate(val);
        //     }

        //     return isCurrentDate(val);
        //   },
        //   {
        //     message: "Invalid start date based on business rules.",
        //   }
        // ),

        dor: z
          .string()
          .min(1, "Date of Registration is required.")
          .refine(
            (val) => {
              if (!val) return false;
              const currentDate = new Date();
              const registrationDate = new Date(val);
              const daysDifference = getDateDifferenceInDays(
                currentDate,
                registrationDate
              );
              if (formState?.business_type_no === "01") {
                return daysDifference <= 19;
              }

              return true;
            },
            {
              message:
                formState?.business_type_no === "01"
                  ? "Date of Registration must be within 19 days before the current date."
                  : "Invalid Date of Registration.",
            }
          ),
        pol_plan_id: z.string().min(1, "Plan Type is required."),
        // cng_lpg_cover: z
        //   .string()
        //   .optional()
        //   .refine((val) => val && val.trim().length > 0, {
        //     message: "Choose Yes or No!",
        //   }),
        cng_lpg_si: z
          .string()
          .refine(
            (val) =>
              formState?.cng_lpg_cover !== "Yes" || (val && val.length > 0),
            {
              message: "CNG Si is required when Cover is enabled.",
            }
          ),
        place_reg: z.string().min(1, "Reg. Place is required."),
        man_year: z.number().min(1, "Manufacturing Year is required."),
        vehicle_make: z.string().min(1, "Vehicle Make is required."),
        vehicle_model: z.string().min(1, "Vehicle Model is required."),
        vehicle_variant: z.string().min(1, "Vehicle Variant is required."),
        proposer_mobile: z
          .string()
          .min(1, "Mobile is required.")
          .regex(/^\d{10}$/, "Must be exactly 10 digits."),
        pa_owner_tenure: z
          .string()
          .optional()
          .refine((val) => !formState?.pa_owner || (val && val.length > 0), {
            message: "Owner Tenure is required when PA Owner is enabled.",
          }),
        pa_owner_declaration: z
          .string()
          .optional()
          .refine(
            (val) => formState?.pa_owner || (val && val.trim().length > 0),
            {
              message:
                "PA Owner Declaration is required when PA Owner is not selected.",
            }
          ),
      });

      if (
        formState.business_type_no === "03" ||
        formState.business_type_no === "04"
      ) {
        baseSchema.extend({
          prev_pol_start_date: z
            .string()
            .optional()
            .refine((val) => val && val.trim().length > 0, {
              message: "Prev Start Date is required.",
            }),
          prev_pol_end_date: z
            .string()
            .optional()
            .refine((val) => val && val.trim().length > 0, {
              message: "Prev End Date is required.",
            }),
          ncb_protection: z.boolean().refine((val) => val !== undefined, {
            message: "Choose Yes or No!",
          }),
          ncb_no_of_claims: z.string().min(1, "No. of Claims is required."),
          // claim_last: z.boolean().refine((val) => val !== undefined, {
          //   message: "Choose Yes or No!",
          // }),
        });
      }

      if (
        formState.business_type_no === "01" &&
        formState.proposer_type === "Individual"
      ) {
        baseSchema.extend({
          pa_owner: z.boolean().refine((val) => val === false, {
            message: "PA Owner is required.",
          }),
        });
      }

      return baseSchema;
    };

    const validatePage2 = () => {
      const baseSchema = z.object({
        motor_plan_opted: z.string().min(1, "Motor Plan is required."),
      });

      if (
        formState.business_type_no === "03" ||
        formState.business_type_no === "04"
      ) {
        return baseSchema.extend({
          pa_owner: z.boolean().refine((val) => val === false, {
            message: "PA Owner is required.",
          }),
        });
      }

      return baseSchema;
    };

    const validatePage3 = () => {
      return z.object({
        motor_plan_opted: z.string().min(1, "Motor Plan is required."),
        claim_last: z.boolean().refine((val) => val, {
          message: "Last Claim is required.",
        }),
        // .optional(), // Optional field, but if provided, it must be "true" or "false"
      });
    };

    if (currentPage === 1) {
      return validatePage1();
    } else if (currentPage === 2 && formState?.business_type_no === "01") {
      return validatePage2();
    } else if (currentPage === 3 && formState?.business_type_no !== "01") {
      const data = validatePage3();
      console.log(data);

      return validatePage3();
    }

    return z.object({});
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const parsedValue = name === "man_year" ? Number(value) : value;
    // Remove errors dynamically
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });

    if (name === "electrical_si" || name === "non_electrical_si") {
      const numericValue = Number(value);
      if (numericValue > 50000) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `${name.replace(/_/g, " ")} cannot exceed 50,000`,
        }));
        return;
      }
    }

    const regnoFields = ["regno_1", "regno_2", "regno_3", "regno_4"];
    if (!formState.special_regno && regnoFields.includes(name)) {
      let isValid = false;
      switch (name) {
        case "regno_1":
          isValid = /^[A-Z]{0,2}$/.test(value);
          break;
        case "regno_2":
          isValid = /^[0-9]{0,2}$/.test(value);
          break;
        case "regno_3":
          isValid = /^[A-Z]{0,2}$/.test(value);
          break;
        case "regno_4":
          isValid = /^[0-9]{0,4}$/.test(value);
          break;
        default:
          isValid = true;
      }
      if (!isValid) return;
    }
    // Validate Bharat RegNo if BH_regno is true
    else if (formState.BH_regno && regnoFields.includes(name)) {
      let isValid = false;
      switch (name) {
        case "regno_1":
          isValid = /^[0-9]{2}$/.test(value);
          break;
        case "regno_2":
          isValid = /^BH[0-9]{4}$/.test(value);
          break;
        case "regno_3":
          isValid = /^[0-9]{4}$/.test(value);
          break;
        case "regno_4":
          isValid = /^[A-Z]{1,2}$/.test(value);
          break;
        default:
          isValid = false;
      }
      if (!isValid) return;
    }

    // Additional logic based on input name
    switch (name) {
      case "business_type_no": {
        const businessType = Data?.business_types.find(
          (type) => type?.value === value
        );
        if (businessType?.authLink) {
          fetch(businessType.authLink)
            .then((response) => response.json())
            .then((data) => {
              dispatch({
                type: "SET_TATA_TOKEN1",
                payload: data?.auth,
              });
              dispatch({
                type: "SET_TATA_TOKEN2",
                payload: data?.uatLists?.data,
              });
            });
        }
        dispatch1({
          key: name,
          value: value,
        });

        if (value === "01") {
          const today = new Date().toISOString().split("T")[0];
          dispatch1({ key: "regno_1", value: "NEW" });
          dispatch1({ key: "dor", value: today });
          dispatch1({ key: "pol_start_date", value: today });
        } else {
          dispatch1({ key: "regno_1", value: "" });
        }
        break;
      }

      case "proposer_type": {
        dispatch1({
          key: name,
          value: value,
        });
        break;
      }

      case "man_year": {
        dispatch1({
          key: name,
          value: parsedValue,
        });
        break;
      }

      case "BH_regno": {
        dispatch1({
          key: name,
          value: checked ? true : false,
        });

        if (checked) {
          dispatch1({
            key: "special_regno",
            value: false,
          });
        }
        break;
      }

      case "special_regno": {
        dispatch1({
          key: name,
          value: checked ? true : false,
        });

        if (checked) {
          dispatch1({
            key: "BH_regno",
            value: false,
          });
        }
        break;
      }
      case "pol_plan_id": {
        const selectedPlan = Data?.policyPlans?.find(
          (plan) => plan?.id === value
        );
        if (selectedPlan) {
          // Dispatch the selected plan's related fields
          dispatch1({
            key: "pol_plan_variant",
            value: selectedPlan?.variant,
          });
        }
        dispatch1({
          key: name,
          value: value,
        });
        break;
      }

      case "vehicle_make": {
        const selectedMake = Data?.vehicles?.find(
          (make) => make?.vehMake === value
        );
        if (selectedMake) {
          dispatch1({
            key: "vehicle_make_no",
            value: selectedMake?.vehMake_no,
          });
        }
        dispatch1({ key: name, value: value });
        // Populate models based on the selected make
        setModels(selectedMake?.models || []);
        setVariants([]);
        break;
      }

      case "vehicle_model": {
        const selectedModel = models?.find(
          (model) => model?.vehModel === value
        );
        if (selectedModel) {
          dispatch1({
            key: "vehicle_model_no",
            value: selectedModel?.vehModel_no,
          });
          dispatch1({ key: name, value: value });
          // Populate variants based on the selected model
          setVariants(selectedModel?.variants || []);
        }
        break;
      }
      case "claim_last": {
        dispatch1({
          key: name,
          value: checked ? true : false,
        });
        break;
      }
      case "vehicle_variant": {
        const selectedVariant = variants?.find(
          (variant) => variant?.vehVariant === value
        );
        if (selectedVariant) {
          dispatch1({
            key: "vehicle_variant_no",
            value: selectedVariant?.vehVariant_no,
          });
          dispatch1({
            key: name,
            value: value,
          });
        }
        break;
      }

      case "motor_plan_opted": {
        const lists = Data?.policyBundles?.find(
          (plans) => plans?.motor_plan_opted === value
        );
        formState.business_type_no
          ? dispatch1({
              key: "motor_plan_opted_no",
              value: lists?.motor_plan_opted_no,
            })
          : dispatch1({
              key: "motor_plan_opted_no",
              value: "",
            });
        formState.business_type_no
          ? dispatch1({
              key: name,
              value: value,
            })
          : dispatch1({
              key: name,
              value: "",
            });
        setSelectedPlan(lists?.cover);
        break;
      }

      case "place_reg": {
        const selectedPlace = Data?.regPlace?.find(
          (place) => place?.place_reg === value
        );
        if (selectedPlace) {
          dispatch1({
            key: "place_reg_no",
            value: selectedPlace ? selectedPlace?.id : "",
          });
          dispatch1({
            key: "proposer_pincode",
            value: selectedPlace ? selectedPlace?.proposer_pincode : "",
          });
        }
        dispatch1({
          key: name,
          value: value,
        });
        break;
      }

      case "pre_pol_protect_ncb": {
        dispatch1({
          key: name,
          value: Number(value) || null,
        });
        break;
      }
      case "claim_last_amount": {
        dispatch1({
          key: name,
          value: Number(value) || null,
        });
        break;
      }
      case "claim_last_count": {
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
          // value: value
          value: type === "checkbox" ? (checked ? true : false) : value,
        });
        break;
    }
  };
  const toggleSecondDiv = () => {
    setIsSecondDivVisible(!isSecondDivVisible);
  };
  // Filter and prepare the keys
  const visiblekeys = Object.entries(initialState).filter(
    ([key]) =>
      ![
        "source",
        "q_producer_email",
        "q_producer_code",
        "product_id",
        "product_code",
        "product_name",
        "vehicle_make_no",
        "vehicle_model_no",
        "vehicle_variant_no",
        "is_posp",
        "q_office_location",
        "place_reg_no",
        "regno_2",
        "regno_3",
        "regno_4",
        "quote_id",
        "proposer_fname",
        "proposer_mname",
        "proposer_lname",
        // "proposer_gstin",
        "__finalize",
      ].includes(key)
  );
  // Auto-hide the second div when on page 1
  useEffect(() => {
    if (currentPage === 1) {
      setIsSecondDivVisible(false); // Hide second div when on page 1
    }
  }, [currentPage]);

  keysPerPage =
    formState.business_type_no === "01"
      ? 60
      : formState.business_type_no === "03" &&
        (currentPage === 2 || currentPage === 3)
      ? 42
      : formState.business_type_no === "03"
      ? 46
      : formState.business_type_no === "04" &&
        (currentPage === 2 || currentPage === 3)
      ? 42
      : formState.business_type_no === "04"
      ? 46
      : 46;
  // Calculate paginated keys
  const startIndex = (currentPage - 1) * keysPerPage;
  const paginatedkeys = visiblekeys.slice(startIndex, startIndex + keysPerPage);
  const totalPages = Math.ceil(visiblekeys?.length / keysPerPage);

  const handleNext = () => {
    try {
      if (currentPage < totalPages) {
        const schema = validateForm();
        schema.parse(formState);
        // f no errors, move to the next page
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

  const confirmSave = () => {
    handleSubmitCar(); // Submit with __finalize = 0
    setShowConfirmSave(false);
  };

  const confirmFinalize = () => {
    handleSubmitCar(); // Submit with __finalize = 1
    setShowConfirmation(false);
  };

  // Memoized filtered keys
  const filteredKeys = useMemo(
    () =>
      Object.entries(formState).filter(
        ([key, value]) =>
          value && // Only truthy values
          ![
            "source",
            "q_producer_email",
            "q_producer_code",
            "product_id",
            "product_code",
            // "product_name",
            "is_posp",
            "q_office_location",
            "quote_id",
            "proposer_fname",
            "proposer_mname",
            "proposer_lname",
            // "motor_plan_opted_no",
            "__finalize",
          ].includes(key) // Exclude specific keys
      ),
    [formState] // Recalculate when formState changes
  );
  const handleSubmitCar = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (validateForm()) {
      onSubmit(formState);
    }
  };

  return (
    <AnimatePresence>
      <div className="flex tracking-wider">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          // onSubmit={handleSubmitCar}
          className="flex flex-col shadow-lg rounded overflow-y-auto grow"
        >
          <div className="mb-3 px-5">
            <div className="flex justify-between items-center">
              {/* Step Indicator */}
              <span className="md:text-lg text-base">
                Step <b>{currentPage}</b> of 3
              </span>

              {/* Clickable Quote Form Title */}
              <h2
                onClick={() => currentPage > 0 && toggleSecondDiv()}
                className={`${
                  currentPage > 0 ? "cursor-pointer" : ""
                } md:text-2xl text-lg text-transparent bg-gradient-to-l bg-clip-text from-indigo-600 to-blue-500 font-bold`}
              >
                Quote Form
              </h2>

              {/* Step Progress Indicator */}
              <div className="flex space-x-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`md:w-6 w-4 md:h-1.5 h-1 rounded-full ${
                      s === currentPage
                        ? "bg-blue-600"
                        : s < currentPage
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
                  "dor_first",
                  "prev_pol_start_date",
                  "prev_pol_end_date",
                  "no_past_pol",
                  "ble_tp_start",
                  "ble_tp_end",
                  "prev_pol_type",
                  "prev_tyre",
                  "prev_engine",
                  "prev_cnglpg",
                  "prev_consumable",
                  "prev_dep",
                  "pre_pol_ncb",
                  "pre_pol_protect_ncb",
                  "claim_last",
                  "ncb_protection",
                  "ncb_no_of_claims",
                  "ble_tp_start",
                  "ble_tp_end",
                  "automobile_association_cover",
                  "antitheft_cover",
                  "voluntary_amount",
                  // "proposer_gstin"
                  // "dep_reimburse_claims"
                ].includes(key) &&
                  (!formState.business_type_no ||
                    formState.business_type_no === "01")) ||
                (["pa_unnamed_no", "pa_unnamed_si"].includes(key) &&
                  !formState.pa_unnamed) ||
                (["pa_named_no", "pa_named_si"].includes(key) &&
                  !formState.pa_named) ||
                (["ll_paid_no", "ll_paid_si"].includes(key) &&
                  !formState.ll_paid) ||
                // (["tyre_secure_options"].includes(key) &&
                //   (formState.tyre_secure === "No" || !formState.tyre_secure)) ||
                (["pa_owner_tenure"].includes(key) && !formState.pa_owner) ||
                (["pa_owner_declaration"].includes(key) &&
                  formState.pa_owner) ||
                (formState.proposer_type === "Organization" &&
                  [
                    "pa_owner",
                    "pa_owner_tenure",
                    "pa_owner_declaration",
                  ].includes(key)) ||
                (["ble_tp_start", "ble_tp_end"].includes(key) &&
                  formState.pol_plan_id !== "05") ||
                (["proposer_gstin"].includes(key) &&
                  formState.proposer_type !== "Organization") ||
                (["cng_lpg_si"].includes(key) &&
                  (formState.cng_lpg_cover === "No" ||
                    !formState.cng_lpg_cover)) ||
                (key === "add_towing_amount" &&
                  (formState.add_towing === "No" || !formState.add_towing)) ||
                (["pa_paid_no", "pa_paid_si"].includes(key) &&
                  !formState.pa_paid) ||
                (["pa_unnamed_si", "pa_unnamed_no"].includes(key) &&
                  !formState.pa_unnamed) ||
                (["claim_last_amount", "claim_last_count"].includes(key) &&
                  (!formState.claim_last ||
                    formState?.claim_last === "false" ||
                    formState.business_type_no === "01")) ||
                (["dep_reimburse_claims"].includes(key) &&
                  !formState.dep_reimburse) ||
                ([
                  "allowance_days_accident",
                  "allowance_days_loss",
                  "daily_allowance_limit",
                ].includes(key) &&
                  (formState.daily_allowance === "No" ||
                    !formState.daily_allowance));

              return (
                <div
                  className={`text-start my-4 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 px-3 mb-10 flex justify-center flex-col ${
                    isHidden ? "hidden" : ""
                  }`}
                  key={key}
                >
                  {!isHidden && (
                    <>
                      {/* Checkbox Fields (Inline) */}
                      {["BH_regno"].includes(key) && (
                        <div className="flex flex-wrap gap-4">
                          {["BH_regno"].map((k) => (
                            <div key={k} className="flex flex-col">
                              <label
                                htmlFor={k}
                                className="flex items-center font-medium text-gray-700 capitalize"
                              >
                                <input
                                  type="checkbox"
                                  id={k}
                                  name={k}
                                  checked={formState[k]}
                                  onChange={handleChange}
                                  className={`${
                                    errors[k]
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } mx-2 w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-0 cursor-pointer`}
                                />
                                {k.replace(/_/g, " ")}
                                {Data?.requiredFields?.includes(k) && (
                                  <span className="text-red-500 font-bold">
                                    {" "}
                                    *
                                  </span>
                                )}
                              </label>
                              {errors[k] && (
                                <span className="text-red-500 text-sm">
                                  {errors[k]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {["special_regno"].includes(key) && (
                        <div className="flex flex-wrap gap-4">
                          {["special_regno"].map((k) => (
                            <div key={k} className="flex flex-col">
                              <label
                                htmlFor={k}
                                className="flex items-center font-medium text-gray-700 capitalize"
                              >
                                <input
                                  type="checkbox"
                                  id={k}
                                  name={k}
                                  checked={formState[k]}
                                  onChange={handleChange}
                                  className={`${
                                    errors[k]
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } mx-2 w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-0 cursor-pointer`}
                                />
                                {k.replace(/_/g, " ")}
                                {Data?.requiredFields?.includes(k) && (
                                  <span className="text-red-500 font-bold">
                                    {" "}
                                    *
                                  </span>
                                )}
                              </label>
                              {errors[k] && (
                                <span className="text-red-500 text-sm">
                                  {errors[k]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {["pa_owner"].includes(key) && (
                        <div className="flex flex-wrap gap-4">
                          {["pa_owner"]
                            .filter(
                              (k) =>
                                !(
                                  formState?.proposer_type === "Organization" &&
                                  k === "pa_owner"
                                )
                            )
                            .map((k) => (
                              <div key={k} className="flex flex-col">
                                <label
                                  htmlFor={k}
                                  className="flex items-center font-medium text-gray-700 capitalize"
                                >
                                  <input
                                    type="checkbox"
                                    id={k}
                                    name={k}
                                    checked={formState[k]}
                                    onChange={handleChange}
                                    className={`${
                                      errors[k]
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } mx-2 w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-0 cursor-pointer`}
                                  />
                                  {k.replace(/_/g, " ")}
                                  {Data?.requiredFields?.includes(k) && (
                                    <span className="text-red-500 font-bold">
                                      {" "}
                                      *
                                    </span>
                                  )}
                                </label>
                                {errors[k] && (
                                  <span className="text-red-500 text-sm">
                                    {errors[k]}
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                      {["claim_last"].includes(key) && (
                        <div className="flex flex-wrap gap-4">
                          {["claim_last"].map((k) => (
                            <div key={k} className="flex flex-col">
                              <label
                                htmlFor={k}
                                className="flex  items-center font-medium text-gray-700 capitalize"
                              >
                                <input
                                  type="checkbox"
                                  id={k}
                                  name={k}
                                  checked={formState[k]}
                                  onChange={handleChange}
                                  className={`${
                                    errors[k]
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } mx-2 w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-0 cursor-pointer`}
                                />
                                {k.replace(/_/g, " ")}
                                {Data?.requiredFields?.includes(k) && (
                                  <span className="text-red-500 font-bold">
                                    {" "}
                                    *
                                  </span>
                                )}
                              </label>
                              {errors[k] && (
                                <span className="text-red-500 text-sm">
                                  {errors[k]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Dropdown Fields */}
                      {[
                        "business_type_no",
                        "proposer_type",
                        "pol_plan_id",
                        "place_reg",
                        "no_past_pol",
                        "manu_month",
                        "man_year",
                        "prev_pol_type",
                        "vehicle_make",
                        "vehicle_model",
                        "vehicle_variant",
                        "pre_pol_ncb",
                        "pre_pol_protect_ncb",
                        "tyre_secure_options",
                        "engine_secure_options",
                        "pa_owner_tenure",
                        "pa_owner_declaration",
                        "motor_plan_opted",
                        "ncb_no_of_claims",
                        "pa_unnamed_no",
                      ].includes(key) && (
                        <>
                          <label
                            htmlFor={key}
                            className="block font-medium text-gray-700 capitalize"
                          >
                            {key.replace(/_/g, " ")}
                            {Data?.requiredFields?.includes(key) && (
                              <span className="text-red-500 font-bold"> *</span>
                            )}
                          </label>
                          <select
                            id={key}
                            name={key}
                            value={formState[key]}
                            onChange={handleChange}
                            disabled={
                              (key === "vehicle_model" && !models.length) ||
                              (key === "vehicle_variant" && !variants.length) ||
                              ((key === "pol_plan_id" ||
                                key === "proposer_type") &&
                                !formState?.business_type_no.length) ||
                              (key === "pre_pol_protect_ncb" &&
                                !formState?.pre_pol_ncb.length)
                            }
                            className={`cursor-pointer w-full p-2 border border-gray-300 capitalize rounded ${
                              errors[key] ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <option value="">
                              Select {key.replace(/_/g, " ")}
                            </option>
                            {key === "business_type_no" &&
                              Data?.business_types?.map(({ value, name }) => {
                                return (
                                  <option key={value} value={value}>
                                    {name}
                                  </option>
                                );
                              })}
                            {key === "proposer_type" && (
                              <>
                                <option value="Individual">Individual</option>
                                <option value="Organization">
                                  Organization
                                </option>
                              </>
                            )}
                            {key === "pa_unnamed_no" && (
                              <option value="5">Always 5</option>
                            )}
                            {key === "pol_plan_id" &&
                              Data?.policyPlans
                                ?.filter((plan) => {
                                  if (formState.business_type_no === "01") {
                                    // Show only the plan with id: "04"
                                    return plan.id === "04";
                                  } else if (
                                    ["03", "04"].includes(
                                      formState.business_type_no
                                    )
                                  ) {
                                    // Hide the plan with id: "04"
                                    return plan.id !== "04";
                                  } else {
                                    // Show all plans
                                    return true;
                                  }
                                })
                                .map(({ id, name }) => (
                                  <option key={id} value={id}>
                                    {name}
                                  </option>
                                ))}
                            {key === "pre_pol_ncb" &&
                              Data?.ncbvalues?.map(({ id, ncb }) => (
                                <option key={id} value={ncb}>
                                  {ncb}
                                </option>
                              ))}
                            {key === "pre_pol_protect_ncb" &&
                              Data?.ncbvalues?.map(({ id, ncb }) => (
                                <option key={id} value={ncb}>
                                  {ncb}
                                </option>
                              ))}

                            {key === "vehicle_make" &&
                              Data?.vehicles?.map(({ vehMake, vehMake_no }) => (
                                <option key={vehMake_no} value={vehMake}>
                                  {vehMake}
                                </option>
                              ))}
                            {key === "vehicle_model" &&
                              models?.map(({ vehModel, vehModel_no }) => (
                                <option key={vehModel_no} value={vehModel}>
                                  {vehModel}
                                </option>
                              ))}

                            {key === "vehicle_variant" &&
                              variants?.map(({ vehVariant, vehVariant_no }) => (
                                <option key={vehVariant_no} value={vehVariant}>
                                  {vehVariant}
                                </option>
                              ))}

                            {key === "tyre_secure_options" &&
                              Data?.tyre_secure_options?.map(
                                (tyreOption, idx) => (
                                  <option key={idx} value={tyreOption}>
                                    {tyreOption}
                                  </option>
                                )
                              )}

                            {key === "engine_secure_options" &&
                              Data?.engine_secure_options?.map(
                                (engineOptions, idx) => (
                                  <option key={idx} value={engineOptions}>
                                    {engineOptions}
                                  </option>
                                )
                              )}

                            {key === "ncb_no_of_claims" &&
                              Data?.ncb_no_of_claims?.map((no, idx) => (
                                <option key={idx} value={no}>
                                  {no}
                                </option>
                              ))}

                            {key === "pa_owner_declaration" &&
                              Data?.pa_owner_declaration?.map((no, idx) => (
                                <option key={idx} value={no}>
                                  {no}
                                </option>
                              ))}
                            {key === "pa_owner_tenure" &&
                              Data?.ownerTenure?.map((no, idx) => (
                                <option key={idx} value={no}>
                                  {no}
                                </option>
                              ))}

                            {key === "motor_plan_opted" &&
                              Data?.policyBundles
                                ?.filter(
                                  (plan) =>
                                    formState?.business_type_no === "01"
                                      ? true // Show all plans if business_type_no is "01"
                                      : plan?.motor_plan_opted_no !== "P12" // Show only P12 if business_type_no is not "01"
                                )
                                ?.map((plan) => (
                                  <option
                                    key={plan?.motor_plan_opted_no}
                                    value={plan?.motor_plan_opted}
                                    className="whitespace-nowrap"
                                  >
                                    {plan?.motor_plan_opted}
                                  </option>
                                ))}

                            {key === "no_past_pol" && (
                              <>
                                <option value="Y">Yes</option>
                                <option value="N">No</option>
                              </>
                            )}

                            {key === "place_reg" &&
                              Data?.regPlace?.map(({ id, place_reg }) => {
                                return (
                                  <option key={id} value={place_reg}>
                                    {place_reg}
                                  </option>
                                );
                              })}
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
                              Array.from({ length: 55 }, (_, i) => {
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
                            {key === "prev_pol_type" && (
                              <>
                                {formState.pol_plan_variant ===
                                "Standalone TP" ? (
                                  <>
                                    <option value="Package">Package</option>
                                    <option value="Third Party">
                                      Third Party
                                    </option>
                                    <option value="SAOD">SAOD</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="Package">Package</option>
                                    <option value="Liability">Liability</option>
                                  </>
                                )}
                              </>
                            )}
                          </select>
                          {errors[key] && (
                            <span className="text-red-500 text-sm">
                              {errors[key]}
                            </span>
                          )}
                        </>
                      )}

                      {/* Vehicle Registration Fields */}
                      {key === "regno_1" && (
                        <>
                          <label
                            htmlFor={key}
                            className="block font-medium text-gray-700 capitalize"
                          >
                            {key
                              .replace(/regno_1/g, "Vehicle Reg. No.")
                              .replace(/_/g, " ")}
                            {Data?.requiredFields?.includes(
                              "Vehicle Reg. No."
                            ) && (
                              <span className="text-red-500 font-bold"> *</span>
                            )}
                          </label>
                          <div className="flex gap-2 flex-auto">
                            {["regno_1", "regno_2", "regno_3", "regno_4"].map(
                              (field) => (
                                <input
                                  key={field}
                                  type="text"
                                  name={field}
                                  maxLength={field === "regno_4" ? 4 : 2}
                                  value={
                                    field === "regno_1"
                                      ? formState?.regno_1 ||
                                        (formState?.business_type_no === "01"
                                          ? "NEW"
                                          : "")
                                      : formState[field]
                                  }
                                  disabled={
                                    formState.business_type_no === "01" &&
                                    [
                                      "regno_1",
                                      "regno_2",
                                      "regno_3",
                                      "regno_4",
                                    ].includes(field)
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
                                      ? "w-[4.6rem] h-10"
                                      : field === "regno_1"
                                      ? "w-[3.5rem] h-10"
                                      : "w-[3rem] h-10"
                                  } ${
                                    errors[field]
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } p-1 border border-gray-600 font-mono font-extrabold tracking-wider text-lg md:text-2xl rounded text-center uppercase ${
                                    formState.business_type_no === "01" &&
                                    [
                                      "regno_1",
                                      "regno_2",
                                      "regno_3",
                                      "regno_4",
                                    ].includes(field)
                                      ? "bg-gray-100 cursor-not-allowed"
                                      : ""
                                  }`}
                                />
                              )
                            )}
                          </div>
                          {errors[key] && (
                            <span className="text-red-500 text-sm">
                              {errors[key]}
                            </span>
                          )}
                        </>
                      )}

                      {/* Radio Fields */}
                      {/* {[
                        "tyre_secure",
                        "prev_tyre",
                        "engine_secure",
                        "prev_engine",
                        "prev_cnglpg",
                        "cng_lpg_cover",
                        "prev_dep",
                        "dep_reimburse",
                        "add_towing",
                        "return_invoice",
                        "prev_consumable",
                        "consumbale_expense",
                        "pa_unnamed",
                        "pa_named",
                        "pa_paid",
                        "ll_paid",
                        "rsa",
                        "key_replace",
                        "repair_glass",
                        "emergency_expense",
                        "personal_loss",
                        "automobile_association_cover",
                        "vehicle_blind",
                        "antitheft_cover",
                        "tppd_discount",
                        "vintage_car",
                        "own_premises",
                        "load_fibre",
                        "load_imported",
                        "load_tuition",
                        "daily_allowance",
                        "ncb_protection",
                      ].includes(key) && (
                        <div className="flex flex-col justify-around mb-2">
                          <span className="font-medium text-gray-700 capitalize">
                            {key.replace(/_/g, " ")}
                            {Data?.requiredFields?.includes(key) && (
                              <span className="text-red-500 font-bold"> *</span>
                            )}
                          </span>
                          <div className="mt-0.5">
                            <div className="flex space-x-8 justify-start">
                              <label
                                htmlFor={`${key}-yes`}
                                className="flex items-center justify-center cursor-pointer"
                              >
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
                      )} */}

                      {[
                        "tyre_secure",
                        "prev_tyre",
                        "engine_secure",
                        "prev_engine",
                        "prev_cnglpg",
                        "cng_lpg_cover",
                        "prev_dep",
                        "dep_reimburse",
                        "add_towing",
                        "return_invoice",
                        "prev_consumable",
                        "consumbale_expense",
                        "pa_named",
                        "rsa",
                        "key_replace",
                        "repair_glass",
                        "emergency_expense",
                        "personal_loss",
                        "automobile_association_cover",
                        "vehicle_blind",
                        "antitheft_cover",
                        "tppd_discount",
                        "vintage_car",
                        "own_premises",
                        "load_fibre",
                        "load_imported",
                        "load_tuition",
                        "daily_allowance",
                        "ncb_protection",
                        "pa_unnamed",
                        "pa_paid",
                        "ll_paid",
                      ]
                        .filter((k) => {
                          // Exclude these fields if pol_plan_variant is "Standalone OD"
                          if (formState.pol_plan_variant === "Standalone OD") {
                            return ![
                              "pa_paid",
                              "ll_paid",
                              "pa_unnamed",
                              "tppd_discount",
                            ].includes(k);
                          }
                          return true; // Include all fields otherwise
                        })
                        .includes(key) && (
                        <div className="flex flex-col justify-around mb-2">
                          <span className="font-medium text-gray-700 capitalize">
                            {key.replace(/_/g, " ")}
                            {Data?.requiredFields?.includes(key) && (
                              <span className="text-red-500 font-bold"> *</span>
                            )}
                          </span>
                          <div className="mt-0.5">
                            <div className="flex space-x-8 justify-start">
                              <label
                                htmlFor={`${key}-yes`}
                                className="flex items-center justify-center cursor-pointer"
                              >
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
                      )}
                      {key === "motor_plan_opted_no" && (
                        <div className="relative w-full">
                          <ul className="absolute -top-8 list-none list-inside text-start text-sm text-gray-600 overflow-hidden transition-all duration-300">
                            <span className="font-bold text-lg tracking-wider">
                              AddOns
                            </span>{" "}
                            {selectedPlan?.map((item, index) => (
                              <li key={index} className="mt-1 font-mono">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* Input Fields */}
                      {![
                        "BH_regno",
                        "special_regno",
                        "claim_last",
                        "pa_owner",
                      ].includes(key) &&
                        ![
                          "business_type_no",
                          "proposer_type",
                          "pol_plan_id",
                          "place_reg",
                          "no_past_pol",
                          "manu_month",
                          "man_year",
                          "prev_pol_type",
                          "vehicle_make",
                          "vehicle_model",
                          "vehicle_variant",
                          "pre_pol_ncb",
                          "pre_pol_protect_ncb",
                          "tyre_secure_options",
                          "engine_secure_options",
                          "pa_owner_tenure",
                          "pa_owner_declaration",
                          "motor_plan_opted",
                          "ncb_no_of_claims",
                          "pa_unnamed_no",
                          "regno_1",
                          "tyre_secure",
                          "prev_tyre",
                          "engine_secure",
                          "prev_engine",
                          "prev_cnglpg",
                          "cng_lpg_cover",
                          "prev_dep",
                          "dep_reimburse",
                          "add_towing",
                          "return_invoice",
                          "prev_consumable",
                          "consumbale_expense",
                          "pa_named",
                          "rsa",
                          "key_replace",
                          "repair_glass",
                          "emergency_expense",
                          "personal_loss",
                          "automobile_association_cover",
                          "vehicle_blind",
                          "antitheft_cover",
                          "tppd_discount",
                          "vintage_car",
                          "own_premises",
                          "load_fibre",
                          "load_imported",
                          "load_tuition",
                          "daily_allowance",
                          "ncb_protection",
                          "pa_unnamed",
                          "pa_paid",
                          "ll_paid",
                          "motor_plan_opted_no",
                        ].includes(key) && (
                          <>
                            <label
                              htmlFor={key}
                              className="block font-medium text-gray-700 capitalize"
                            >
                              {key.replace(/_/g, " ")}
                              {Data?.requiredFields?.includes(key) && (
                                <span className="text-red-500 font-bold">
                                  {" "}
                                  *
                                </span>
                              )}
                            </label>
                            <input
                              type={
                                [
                                  "date",
                                  "dor",
                                  "dor_first",
                                  "prev_pol_start_date",
                                  "prev_pol_end_date",
                                  "pol_start_date",
                                  ...(formState?.pol_plan_id === "05"
                                    ? ["ble_tp_start", "ble_tp_end"]
                                    : []),
                                ].includes(key)
                                  ? "date"
                                  : [
                                      "proposer_mobile",
                                      "electrical_si",
                                      "non_electrical_si",
                                    ].includes(key)
                                  ? "number"
                                  : ["email"].includes(key)
                                  ? "email"
                                  : "text"
                              }
                              id={key}
                              name={key}
                              value={formState[key]}
                              onChange={handleChange}
                              disabled={[
                                "pol_plan_variant",
                                "proposer_pincode",
                              ].includes(key)}
                              className={`${
                                [
                                  "pol_plan_variant",
                                  "proposer_pincode",
                                ].includes(key) && "bg-red-50"
                              } w-full p-2 border border-gray-300 rounded ${
                                errors[key]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {errors[key] && (
                              <span className="text-red-500 text-sm">
                                {errors[key]}
                              </span>
                            )}
                          </>
                        )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="my-2 mb-4 flex justify-between px-3 tracking-wide ">
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
        </motion.div>

        {isSecondDivVisible && (
          <div
            className={`container-fluid max-w-sm w-full justify-between items-center px-2 overflow-y-auto ease-in-out`}
            style={{ maxHeight: "678px" }}
          >
            <h1 className="text-center text-white text-lg font-semibold text-transparent bg-gradient-to-l rounded from-indigo-600 to-blue-500 whitespace-nowrap">
              Pvt Car Quotation
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
                  <span className="text-blue-600 font-medium">__finalize</span>
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
                    onClick={confirmFinalize} // Set formState.__finalize to "1"
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

export default CarQuotes;



// const initialState = {
//   source: "P",
//   q_producer_email: "chitra2@gmail.com",
//   q_producer_code: "4984727878",
//   is_posp: "N",
//   sol_id: "",
//   q_office_location: "",
//   pol_plan_id: "02",
//   place_reg: "MUMBAI",
//   vehicle_make: "TATA MOTORS",
//   vehicle_model: "HARRIER",
//   vehicle_variant: "XT",
//   vehicle_make_no: 140,
//   vehicle_model_no: 10361,
//   vehicle_variant_no: "103912",
//   proposer_type: "Individual",
//   proposer_pincode: "400001",
//   proposer_gstin: "",
//   proposer_salutation: "Ms",
//   proposer_email: "abcd@gmail.com",
//   proposer_mobile: "9999999999",
//   business_type_no: "03",
//   dor: "2018-10-08",
//   dor_first: "",
//   prev_pol_start_date: "2024-02-03",
//   prev_pol_end_date: "2025-02-02",
//   ble_tp_end: "",
//   ble_tp_start: "",
//   man_year: 2018,
//   pol_start_date: "2025-03-12",
//   prev_pol_type: "Package",
//   claim_last: "false",
//   pre_pol_ncb: "0",
//   regno_1: "MH",
//   regno_2: "01",
//   regno_3: "MK",
//   regno_4: "1376",
//   prev_cnglpg: "No",
//   cng_lpg_cover: "No",
//   cng_lpg_si: "",
//   electrical_si: "",
//   non_electrical_si: "",
//   uw_loading: "",
//   uw_remarks: "",
//   uw_discount: "",
//   prev_tyre: "No",
//   tyre_secure: "No",
//   tyre_secure_options: "DEPRECIATION BASIS",
//   prev_engine: "No",
//   engine_secure: "No",
//   engine_secure_options: "WITH DEDUCTIBLE",
//   prev_dep: "No",
//   dep_reimburse: "No",
//   dep_reimburse_claims: "2",
//   add_towing: "No",
//   add_towing_amount: "",
//   emergency_expense: "No",
//   return_invoice: "No",
//   prev_consumable: "No",
//   consumable_expense: "No",
//   rsa: "No",
//   key_replace: "No",
//   repair_glass: "No",
//   emergency_medical_expenses: "No",
//   emergency_medical_exp_si: "",
//   personal_loss: "No",
//   daily_allowance: "No",
//   allowance_days_accident: "",
//   daily_allowance_limit: "",
//   allowance_days_loss: "",
//   franchise_days: "",
//   pa_owner: "true",
//   pa_owner_tenure: "1",
//   pa_owner_declaration: "None",
//   pa_unnamed: "No",
//   pa_unnamed_no: "5",
//   pa_unnamed_si: "",
//   pa_named: "No",
//   pa_named_no: "1",
//   pa_named_si: "100000",
//   pa_paid: "No",
//   pa_paid_no: "1",
//   pa_paid_si: "100000",
//   ll_paid: "No",
//   ll_paid_no: "1",
//   ll_paid_si: "10000",
//   automobile_association_cover: "No",
//   vehicle_blind: "No",
//   antitheft_cover: "No",
//   voluntary_amount: "",
//   tppd_discount: "No",
//   vintage_car: "No",
//   own_premises: "No",
//   load_fibre: "No",
//   load_imported: "No",
//   load_tuition: "No",
//   pa_unnamed_csi: "",
//   place_reg_no: "99",
//   pol_plan_variant: "PackagePolicy",
//   proposer_fname: "",
//   proposer_mname: "",
//   proposer_lname: "",
//   pre_pol_protect_ncb: null,
//   claim_last_amount: null,
//   product_id: "M300000000001",
//   product_code: "3184",
//   product_name: "Private Car",
//   ncb_protection: "No",
//   ncb_no_of_claims: "1",
//   motor_plan_opted: "Silver",
//   motor_plan_opted_no: "P1",
//   vehicle_idv: "",
//   no_past_pol: "N",
//   quote_id: "",
//   __finalize: "1",
// };