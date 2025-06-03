import { useFormContext } from "react-hook-form";
import Data from "../../../../Data";
import useConditionalFields from "../../../../../utils/useConditionalFields";
import { useDispatch, useSelector } from "react-redux";
import { magmaPrevPolicyDetails } from "../../../../../../store/features/quoteMagmaSlice";

const PrevPolicyDetails = () => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext();
  const dispatch = useDispatch();
  const quote = useSelector((state) => state.magmaquote);
  
  const modifiedFields = useConditionalFields(
    Data?.PrevPolicyDetails,
    control,
    quote.BusinessType,
    quote.PolicyProductType
  );

  const handleChange = (e, fieldId) => {
    const { value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setValue(`PrevPolicyDetails.${fieldId}`, fieldValue);
    dispatch(magmaPrevPolicyDetails({ field: fieldId, value: fieldValue }));
  };

  // Only show if PrevPolicy is applicable and BusinessType is "Roll Over" with PolicyProductType "1TP"
  if (!quote.IsPrevPolicyApplicable || 
      quote.BusinessType !== "Roll Over") {
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
                  {...register(`PrevPolicyDetails.${field.id}`)}
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
                  {...register(`PrevPolicyDetails.${field.id}`, {
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                  })}
                  onChange={(e) => handleChange(e, field.id)}
                  className={`w-full p-2 border rounded ${
                    errors.PrevPolicyDetails?.[field.id]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </>
            )}
            {errors.PrevPolicyDetails?.[field.id] && (
              <p className="text-sm text-red-500">
                {errors.PrevPolicyDetails[field.id].message}
              </p>
            )}
          </div>
        ))}
    </div>
  );
};

export default PrevPolicyDetails;


// import { useFormContext } from "react-hook-form";
// import useConditionalFields from "../../../../../utils/useConditionalFields";
// import Data from "../../../../Data";
// import { useDispatch } from "react-redux";
// import { magmaPrevPolicyDetails } from "../../../../../../store/features/quoteMagmaSlice";

// const PrevPolicyDetails = () => {
//   const {
//     register,
//     control,
//     formState: { errors },
//     setValue,
//   } = useFormContext(); // Access form context from react-hook-form
//   const dispatch = useDispatch();
//   const modifiedFields = useConditionalFields(Data?.PrevPolicyDetails, control);
//   const handleChange = (e, fieldId) => {
//     const { value, type, checked } = e.target;
//     const fieldValue = type === "checkbox" ? checked : value;

//     // Update react-hook-form state
//     setValue(`PrevPolicyDetails.${fieldId}`, fieldValue);

//     // Update Redux state
//     dispatch(magmaPrevPolicyDetails({ field: fieldId, value: fieldValue }));
//   };
//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 my-4 text-start">
//       {modifiedFields.map((field) => {
//         // Skip rendering if field is conditionally hidden
//         if (field.show === false) return null;

//         return (
//           <div key={field.id} className="flex flex-col justify-center">
//             {/* Checkbox aur label ko ek saath inline mein rakhe */}
//             {field.type === "checkbox" ? (
//               <div className="flex items-center justify-start mt-4">
//                 <input
//                   id={field.id}
//                   type="checkbox"
//                   {...register(`PrevPolicyDetails.${field.id}`)}
//                   onChange={(e) => handleChange(e, field.id)}
//                   className="flex w-6 h-6 cursor-pointer text-2xl text-green-600 bg-gray-200 border-gray-300 rounded-sm focus:ring-green-500 focus:ring-0"
//                 />
//                 <label
//                   htmlFor={field.id}
//                   className="ml-2 text-sm font-medium text-gray-700"
//                 >
//                   {field.label}{" "}
//                   {field.required && (
//                     <span className="text-red-500 font-bold">*</span>
//                   )}
//                 </label>
//               </div>
//             ) : (
//               <>
//                 <label
//                   htmlFor={field.id}
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   {field.label}{" "}
//                   {field.required && (
//                     <span className="text-red-500 font-bold">*</span>
//                   )}
//                 </label>
//                 {/* Render input based on type */}
//                 {field.type === "select" ? (
//                   <select
//                     id={field.id}
//                     {...register(`PrevPolicyDetails.${field.id}`, {
//                       required: field.required
//                         ? `${field.label} is required`
//                         : false,
//                     })}
//                     onChange={(e) => handleChange(e, field.id)}
//                     className={`w-full p-2 border rounded ${
//                       errors.PrevPolicyDetails?.[field.id]
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                   >
//                     {field.options.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 ) : (
//                   <input
//                     id={field.id}
//                     type={field.type}
//                     {...register(`PrevPolicyDetails.${field.id}`, {
//                       required: field.required
//                         ? `${field.label} is required`
//                         : false,
//                     })}
//                     onChange={(e) => handleChange(e, field.id)}
//                     className={`w-full p-2 border rounded ${
//                       errors.PrevPolicyDetails?.[field.id]
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                   />
//                 )}
//               </>
//             )}

//             {/* Show error message if required */}
//             {errors.PrevPolicyDetails?.[field.id] && (
//               <p className="text-sm text-red-500">
//                 {errors.PrevPolicyDetails[field.id].message}
//               </p>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default PrevPolicyDetails;
