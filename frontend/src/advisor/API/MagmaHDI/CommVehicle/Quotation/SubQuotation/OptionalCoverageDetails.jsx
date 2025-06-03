import { useFormContext } from "react-hook-form";
import Data from "../../../../Data";
import useConditionalFields from "../../../../../utils/useConditionalFields";
import { useDispatch, useSelector } from "react-redux";
import { magmaOptionalCoverageDetails } from "../../../../../../store/features/quoteMagmaSlice";

const OptionalCoverageDetails = () => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext();
  const dispatch = useDispatch();
  const quote = useSelector((state) => state.magmaquote);
  
  const modifiedFields = useConditionalFields(
    Data?.OptionalCoverageDetails,
    control,
    quote.BusinessType,
    quote.PolicyProductType
  );

  const handleChange = (e, fieldId) => {
    const { value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setValue(`OptionalCoverageDetails.${fieldId}`, fieldValue);
    dispatch(
      magmaOptionalCoverageDetails({ field: fieldId, value: fieldValue })
    );
  };

  // Only show if OptionalCoverage is applicable and BusinessType is not "Roll Over"
  if (!quote.OptionalCoverageApplicable || quote.BusinessType === "Roll Over") {
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
                  {...register(`OptionalCoverageDetails.${field.id}`)}
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
                    {...register(`OptionalCoverageDetails.${field.id}`, {
                      required: field.required
                        ? `${field.label} is required`
                        : false,
                    })}
                    onChange={(e) => handleChange(e, field.id)}
                    className={`w-full p-2 border rounded ${
                      errors.OptionalCoverageDetails?.[field.id]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.id}
                    type={field.type}
                    {...register(`OptionalCoverageDetails.${field.id}`, {
                      required: field.required
                        ? `${field.label} is required`
                        : false,
                    })}
                    onChange={(e) => handleChange(e, field.id)}
                    className={`w-full p-2 border rounded ${
                      errors.OptionalCoverageDetails?.[field.id]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                )}
              </>
            )}
            {errors.OptionalCoverageDetails?.[field.id] && (
              <p className="text-sm text-red-500">
                {errors.OptionalCoverageDetails[field.id].message}
              </p>
            )}
          </div>
        ))}
    </div>
  );
};

export default OptionalCoverageDetails;