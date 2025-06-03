import { useFormContext } from "react-hook-form";
import Data from "../../../../Data";
import useConditionalFields from "../../../../../utils/useConditionalFields.jsx";
import { useDispatch, useSelector } from "react-redux";
import { magmaAddOnsPlanApplicableDetails } from "../../../../../../store/features/quoteMagmaSlice";

const AddOnsPlanApplicableDetails = () => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext();
  const dispatch = useDispatch();
  const quote = useSelector((state) => state.magmaquote);

  const modifiedFields = useConditionalFields(
    Data?.AddOnsPlanApplicableDetails,
    control,
    quote.BusinessType,
    quote.PolicyProductType
  );

  const handleChange = (e, fieldId) => {
    const { value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setValue(`AddOnsPlanApplicableDetails.${fieldId}`, fieldValue);
    dispatch(
      magmaAddOnsPlanApplicableDetails({ field: fieldId, value: fieldValue })
    );
  };

  // Only show if AddOns are applicable and BusinessType is not "Roll Over"
  if (!quote.AddOnsPlanApplicable || quote.BusinessType === "Roll Over") {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 my-6 text-start mx-8">
      {modifiedFields
        .filter(field => field.show !== false)
        .map((field) => (
          <div key={field.id} className="flex flex-col justify-center">
            {field.type === "checkbox" ? (
              <div className="flex items-center justify-start mt-4">
                <input
                  id={field.id}
                  type="checkbox"
                  {...register(`AddOnsPlanApplicableDetails.${field.id}`)}
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

                <input
                  id={field.id}
                  type={field.type}
                  {...register(`AddOnsPlanApplicableDetails.${field.id}`, {
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                  })}
                  onChange={(e) => handleChange(e, field.id)}
                  className={`w-full p-2 border rounded ${
                    errors.AddOnsPlanApplicableDetails?.[field.id]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </>
            )}
            {errors.AddOnsPlanApplicableDetails?.[field.id] && (
              <p className="text-sm text-red-500">
                {errors.AddOnsPlanApplicableDetails[field.id].message}
              </p>
            )}
          </div>
        ))}
    </div>
  );
};

export default AddOnsPlanApplicableDetails;