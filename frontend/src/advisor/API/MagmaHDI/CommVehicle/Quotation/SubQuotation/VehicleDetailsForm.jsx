import { useFormContext } from "react-hook-form";
import Data from "../../../../Data";
import useConditionalFields from "../../../../../utils/useConditionalFields";
import { useDispatch, useSelector } from "react-redux";
import { magmaVehicleDetails } from "../../../../../../store/features/quoteMagmaSlice";
import { memo, useState } from "react";
import formatDate from "../../../../../utils/DateHelpers";

// eslint-disable-next-line react/display-name
const VehicleDetailsForm = memo(() => {
  const {
    register,
    formState: { errors },
    control,
    setValue,
    // getValues
  } = useFormContext();
  const dispatch = useDispatch();
  const quote = useSelector((state) => state.magmaquote);


  const [selectedDate, setSelectedDate] = useState(
    formatDate(new Date(), "yyyy-MM-dd")
  );
  // Get all fields and apply conditional logic
  const modifiedFields = useConditionalFields(
    Data?.VehicleDetailsForm,
    control,
    quote.BusinessType,
    quote.PolicyProductType
  );
  
 
 const handleChange = (e, fieldId) => {
    const { value, type, checked } = e.target;
    
    // Special handling for registration number
    if (fieldId === "RegistrationNumber") {
      // Remove spaces and convert to uppercase
      const cleanedValue = value.toUpperCase().replace(/\s/g, '');
      
      // Validate Bharat series format: "00BH0000XX"
      const bharatRegex = /^[0-9]{2}BH[0-9]{4}[A-Z]{1,2}$/;
      // Validate standard format: "XX-00-XX-0000" or "XX-00-XXX-0000"
      const standardRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2,3}[0-9]{4}$/;

      // Check if the value matches either format
      if (cleanedValue && !(bharatRegex.test(cleanedValue) || standardRegex.test(cleanedValue))) {
        return; // Don't update if invalid format
      }
      
      // Format the value with hyphens for display
      const formattedValue = cleanedValue.replace(/^([A-Z]{2})(\d{2})([A-Z]{2,3})(\d{4})$/, '$1-$2-$3-$4');
      
      dispatch(magmaVehicleDetails({ field: fieldId, value: formattedValue }));
      setValue(`VehicleDetails.${fieldId}`, formattedValue, { shouldValidate: true });
      return;
    }

    // Handle other fields normally
    const fieldValue = type === "checkbox" ? checked : value;
    dispatch(magmaVehicleDetails({ field: fieldId, value: fieldValue }));
    setValue(`VehicleDetails.${fieldId}`, fieldValue, { shouldValidate: true });
  };

   const handleDateChange = (e, fieldId) => {
      const dateValue = e.target.value;
      setSelectedDate(dateValue);
      const formattedDateForRedux = formatDate(dateValue, "dd/MM/yyyy");
      dispatch(
        magmaVehicleDetails({ field: `VehicleDetails.${fieldId}`, value: formattedDateForRedux })
      );
      setValue(`VehicleDetails.${fieldId}`, formattedDateForRedux);
    };

  // Apply additional business logic for field visibility
  const shouldShowField = (field) => {
    if (field.id === "TMCMakeCode" || 
        field.id === "MiscTypeOfVehicle" || 
        field.id === "MiscTypeOfVehicleCode") {
      return quote.BusinessType !== "New Business";
    }
    
    if (field.id === "ElectricVehSpeed" || 
        field.id === "TypeOfBus" || 
        field.id === "BodyIDV") {
      return quote.BusinessType !== "Roll Over";
    }
    
    if (field.id === "HigherIDV" || 
        field.id === "LowerIDV" || 
        field.id === "IDVofChassis") {
      return quote.BusinessType === "Roll Over" && 
             quote.PolicyProductType === "1TP";
    }
    
    return true;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 mt-10 text-start mx-8">
      {modifiedFields
        .filter(field => field.show !== false && shouldShowField(field))
        .map((field) => (
          <div key={field.id} className="flex flex-col justify-center my-0.5">
            {field.type === "checkbox" ? (
              <div className="flex items-center mt-4">
                <input
                  id={field.id}
                  type="checkbox"
                  {...register(`VehicleDetails.${field.id}`)}
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
                    {...register(`VehicleDetails.${field.id}`, {
                      required: field.required
                        ? `${field.label} is required`
                        : false,
                    })}
                    onChange={(e) => handleChange(e, field.id)}
                    className={`w-full p-2 border cursor-pointer rounded ${
                      errors.VehicleDetails?.[field.id]
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
                    {...register(`VehicleDetails.${field.id}`, {
                      required: field.required
                        ? `${field.label} is required`
                        : false,
                    })}
                    onChange={(e)=> handleDateChange(e, field.id)}
                    value = {selectedDate}
                    // value={field.id === "RegistrationDate" ? selectedDate : watch(`VehicleDetails.${field.id}`)}
                    className={`w-full p-2 border rounded ${
                      errors.VehicleDetails?.[field.id]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                ) : (
                  <input
                    id={field.id}
                    type={field.type}
                    {...register(`VehicleDetails.${field.id}`, {
                      required: field.required
                        ? `${field.label} is required`
                        : false,
                    })}
                    onChange={(e) => handleChange(e, field.id)}
                    className={`w-full p-2 border rounded ${
                      errors.VehicleDetails?.[field.id]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                )}
              </>
            )}

            {errors.VehicleDetails?.[field.id] && (
              <p className="text-sm text-red-500">
                {errors.VehicleDetails[field.id].message}
              </p>
            )}
          </div>
        ))}
    </div>
  );
});

export default VehicleDetailsForm;