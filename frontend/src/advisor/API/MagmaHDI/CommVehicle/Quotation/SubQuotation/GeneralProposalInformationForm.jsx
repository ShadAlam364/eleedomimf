import { useFormContext } from "react-hook-form";
import Data from "../../../../Data";
import useConditionalFields from "../../../../../utils/useConditionalFields";
import { useDispatch } from "react-redux";
import { magmaGeneralProposalInformation } from "../../../../../../store/features/quoteMagmaSlice";
import { useState } from "react";
import formatDate from "../../../../../utils/DateHelpers";

const GeneralProposalInformation = () => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const dispatch = useDispatch();

  const [selectedFromDate, setSelectedFromDate] = useState(
    formatDate(new Date(), "yyyy-MM-dd")
  );

  const initialToDate = (() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1); // Adds one year
    date.setDate(date.getDate() - 1); // Subtracts one day
    return date;
  })();

  const [selectedToDate, setSelectedToDate] = useState(
    formatDate(initialToDate, "yyyy-MM-dd")
  );

  // Get values needed for conditional logic
  const businessType = watch("BusinessType");
  const policyProductType = watch("PolicyProductType");
  const paOwnerCoverApplicable = watch("PAOwnerCoverApplicable");

  const modifiedFields = useConditionalFields(
    Data?.GeneralProposalInformation,
    control,
    businessType,
    policyProductType
  );

  const validateTime = (time) => {
    // Time format HH:MM:SS
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleChange = (e, fieldId) => {
    const { value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    // Special handling for time fields
    if (fieldId === "PolicyEffectiveFromHour" || fieldId === "PolicyEffectiveToHour") {
      if (!validateTime(value)) {
        // If invalid time format, don't update
        return;
      }
    }

    dispatch(
      magmaGeneralProposalInformation({ field: fieldId, value: fieldValue })
    );
    setValue(`GeneralProposalInformation.${fieldId}`, fieldValue, {
      shouldValidate: true,
    });
  };

  const handleDateChange = (e, fieldId) => {
    const dateValue = e.target.value;
    // Calculate one year ahead
    const fromDate = new Date(dateValue);
    fromDate.setFullYear(fromDate.getFullYear() + 1);
    fromDate.setDate(fromDate.getDate() - 1);
    const toDate = new Date(fromDate);
    const formattedToDate = formatDate(toDate, "yyyy-MM-dd");
    console.log(formattedToDate);

    if (fieldId === "PolicyEffectiveFromDate") {
      setSelectedFromDate(dateValue);
      setSelectedToDate(formattedToDate);

      // Format dates for Redux and form
      const formattedFromDate = formatDate(dateValue, "dd/MM/yyyy");
      const formattedToDateForStore = formatDate(toDate, "dd/MM/yyyy");

      // Update both dates in Redux and form
      dispatch(
        magmaGeneralProposalInformation({
          field: "PolicyEffectiveFromDate",
          value: formattedFromDate,
        })
      );
      dispatch(
        magmaGeneralProposalInformation({
          field: "PolicyEffectiveToDate",
          value: formattedToDateForStore,
        })
      );

      setValue(
        "GeneralProposalInformation.PolicyEffectiveFromDate",
        formattedFromDate
      );
      setValue(
        "GeneralProposalInformation.PolicyEffectiveToDate",
        formattedToDateForStore
      );

      // Set default time values when date changes
      const currentTime = new Date().toTimeString().split(' ')[0];
      setValue(
        "GeneralProposalInformation.PolicyEffectiveFromHour",
        currentTime
      );
      setValue(
        "GeneralProposalInformation.PolicyEffectiveToHour",
        "23:59:59"
      );
    } else if (fieldId === "PolicyEffectiveToDate") {
      // Only update the to date if manually changed
      setSelectedToDate(toDate);
      const formattedDate = formatDate(toDate, "dd/MM/yyyy");
      dispatch(
        magmaGeneralProposalInformation({
          field: "PolicyEffectiveToDate",
          value: formattedDate,
        })
      );
      setValue(
        "GeneralProposalInformation.PolicyEffectiveToDate",
        formattedDate
      );
    }
  };

  // Filter fields based on conditions
  const filteredFields = modifiedFields.filter((field) => {
    if (!field.CustomerType && field.show !== false) {
      if (
        ["SentPreInspectionLinkTo", "PreInspectionMobileNo"].includes(field.id)
      ) {
        return (
          !(!paOwnerCoverApplicable || businessType === "New Business") ||
          policyProductType !== "1TP1OD"
        );
      }
      return true;
    }
    return false;
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 my-6 text-start mx-8">
      {filteredFields.map((field) => (
        <div key={field.id} className="flex flex-col justify-center">
          {field.type === "checkbox" ? (
            <div className="flex items-center justify-start mt-4">
              <input
                id={field.id}
                type="checkbox"
                {...register(`GeneralProposalInformation.${field.id}`)}
                onChange={(e) => handleChange(e, field.id)}
                className="flex w-6 h-6 cursor-pointer text-2xl text-green-600 bg-gray-200 border-gray-300 rounded-sm focus:ring-green-500 focus:ring-0"
              />
              <label
                htmlFor={field.id}
                className="ml-2 text-sm font-medium text-gray-700"
              >
                {field.label}{" "}
                {field.required && (
                  <span className="text-red-500 font-bold">*</span>
                )}
              </label>
            </div>
          ) : (
            <>
              <label
                htmlFor={field.id}
                className="text-sm font-medium text-gray-700"
              >
                {field.label}{" "}
                {field.required && (
                  <span className="text-red-500 font-bold">*</span>
                )}
              </label>

              {field.type === "select" ? (
                <select
                  id={field.id}
                  {...register(`GeneralProposalInformation.${field.id}`, {
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                  })}
                  onChange={(e) => handleChange(e, field.id)}
                  className={`w-full p-2 border rounded ${
                    errors.GeneralProposalInformation?.[field.id]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "date" ? (
                <input
                  id={field.id}
                  type="date"
                  {...register(`GeneralProposalInformation.${field.id}`, {
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                  })}
                  onChange={(e) => handleDateChange(e, field.id)}
                  value={
                    field.id === "PolicyEffectiveFromDate"
                      ? selectedFromDate
                      : field.id === "PolicyEffectiveToDate"
                      ? selectedToDate
                      : ""
                  }
                  className={`w-full p-2 border rounded ${
                    errors.GeneralProposalInformation?.[field.id]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              ) : field.id.includes("Hour") ? (
                <input
                  id={field.id}
                  type="time"
                  step="1"
                  {...register(`GeneralProposalInformation.${field.id}`, {
                    required: field.required ? `${field.label} is required` : false,
                    pattern: {
                      value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
                      message: "Invalid time format (HH:MM:SS)",
                    },
                  })}
                  onChange={(e) => handleChange(e, field.id)}
                  className={`w-full p-2 border rounded ${
                    errors.GeneralProposalInformation?.[field.id]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              ) : (
                <input
                  id={field.id}
                  type={field.type}
                  {...register(`GeneralProposalInformation.${field.id}`, {
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                  })}
                  onChange={(e) => handleChange(e, field.id)}
                  className={`w-full p-2 border rounded ${
                    errors.GeneralProposalInformation?.[field.id]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              )}
            </>
          )}
          {errors.GeneralProposalInformation?.[field.id] && (
            <p className="text-sm text-red-500">
              {errors.GeneralProposalInformation[field.id].message}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default GeneralProposalInformation;
