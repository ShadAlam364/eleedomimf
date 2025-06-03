import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { combinedSchema } from "./Validations/validationSchemas";
import VehicleDetailsForm from "./SubQuotation/VehicleDetailsForm";
import GeneralProposalInformationForm from "./SubQuotation/GeneralProposalInformationForm";
import PAOwnerCoverDetailsForm from "./SubQuotation/PAOwnerCoverDetailsForm";
import {
  fetchToken,
  selectTokenValid,
  selectTokenError,
} from "../../../../../store/features/tokenMagmaSlice";
import {
  magmaQuotes,
  submitMagmaQuote,
} from "../../../../../store/features/quoteMagmaSlice";
import Data from "../../../Data.jsx";
import formatDate, { getCurrentTime } from "../../../../utils/DateHelpers.jsx";
import AddOnsPlanApplicableDetails from "./SubQuotation/AddOnsPlanApplicableDetails.jsx";
import OptionalCoverageDetails from "./SubQuotation/OptionalCoverageDetails.jsx";
import PrevPolicyDetails from "./SubQuotation/PrevPolicyDetails.jsx";

const QuotationForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // const totalPages = 3;
  const dispatch = useDispatch();
  const quote = useSelector((state) => state.magmaquote);
  const tokenValid = useSelector(selectTokenValid);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tokenError = useSelector(selectTokenError);
  const [policyProductTypes, setPolicyProductTypes] = useState([]);
  const [isSecondDivVisible, setIsSecondDivVisible] = useState(false);
  const initialToDate = (() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1); // Adds one year
    date.setDate(date.getDate() - 1); // Subtracts one day
    return date;
  })();
  const currTime = getCurrentTime();

  const [selectedDate, setSelectedDate] = useState(
    formatDate(new Date(), "yyyy-MM-dd")
  );

  const toggleSecondDiv = () => {
    setIsSecondDivVisible(!isSecondDivVisible);
  };

  useEffect(() => {
    setIsSecondDivVisible(false);
  }, []);

  const methods = useForm({
    // resolver: zodResolver(combinedSchema),
    defaultValues: {
      ...quote,
      ProposalDate: formatDate(selectedDate, "dd/MM/yyyy"),
      VehicleDetails: {
        ...quote.VehicleDetails,
        RegistrationDate: formatDate(selectedDate, "dd/MM/yyyy"),
      },
      GeneralProposalInformation: {
        ...quote.GeneralProposalInformation,
        PolicyEffectiveFromDate: formatDate(selectedDate, "dd/MM/yyyy"),
        PolicyEffectiveToDate: formatDate(initialToDate, "dd/MM/yyyy"),
        PolicyEffectiveFromHour: currTime,
      },
    },
  });

  const { handleSubmit, setValue, watch } = methods;
  const businessType = watch("BusinessType");
  const policyProductType = watch("PolicyProductType");

  // Fetch token when BusinessType changes
  useEffect(() => {
    if (businessType) {
      dispatch(fetchToken());
    }
  }, [businessType, dispatch]);

  // Handle token errors
  useEffect(() => {
    if (tokenError) {
      toast.error(tokenError);
    }
  }, [tokenError]);

  // Update policyProductTypes based on BusinessType
  useEffect(() => {
    if (businessType === "New Business") {
      setPolicyProductTypes(
        Data.PolicyProductType.filter((product) => product.pName === "1TP1OD")
      );
    } else if (businessType === "Roll Over") {
      setPolicyProductTypes(Data.PolicyProductType);
    }
  }, [businessType]);

  // Handle field changes and update both Redux and form state
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    dispatch(magmaQuotes({ field: name, value: fieldValue }));
    setValue(name, fieldValue);
  };

  // Handle date changes with proper formatting
  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setSelectedDate(dateValue);
    const formattedDateForRedux = formatDate(dateValue, "dd/MM/yyyy");
    dispatch(
      magmaQuotes({ field: "ProposalDate", value: formattedDateForRedux })
    );
    setValue("ProposalDate", formattedDateForRedux);
  };

  // const onSubmit = (data) => {
  //   if (!tokenValid) {
  //     toast.error(
  //       "Token is invalid. Please check the Business Type and try again."
  //     );
  //     return;
  //   }
  //   dispatch(submitMagmaQuote(data));
  // };

  const onSubmit = async (data) => {
    if (!tokenValid) {
      toast.error(
        "Token is invalid. Please check the Business Type and try again."
      );
      return;
    }

    setIsSubmitting(true); // Start loading
    try {
      await dispatch(submitMagmaQuote(data)); // Wait for the dispatch to complete
      // Optional: Add success toast if needed
      // toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit form");
    } finally {
      setIsSubmitting(false); // End loading regardless of outcome
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Determine if PA Owner Cover should be shown
  const showPAOwnerCover =
    quote.PAOwnerCoverApplicable ||
    ((businessType === "New Business" || businessType === "Roll Over") &&
      policyProductType === "1TP1OD");

  // Determine if AddOns should be shown
  const showAddOns = quote.AddOnsPlanApplicable || businessType !== "Roll Over";

  // Determine if Optional Coverage should be shown
  const showOptionalCoverage =
    quote.OptionalCoverageApplicable || businessType !== "Roll Over";

  // Determine if Previous Policy should be shown
  const showPrevPolicy =
    quote.IsPrevPolicyApplicable || businessType === "Roll Over";
  const showVoluntary = businessType === "New Business";
  const showImposed = businessType === "Roll Over";

  // Calculate which sections should be visible
  const visibleSections = useMemo(() => {
    return {
      basicInfo: true, // Always visible
      vehicleDetails: true, // Always visible
      generalInfo: true, // Always visible
      paOwnerCover: showPAOwnerCover,
      addOns: showAddOns,
      optionalCoverage: showOptionalCoverage,
      prevPolicy: showPrevPolicy,
      excessAmounts: true, // Always visible
    };
  }, [showPAOwnerCover, showAddOns, showOptionalCoverage, showPrevPolicy]);

  // Calculate total pages dynamically based on visible sections
  const totalPages = useMemo(() => {
    let pages = 1; // At least one page

    // Basic info and vehicle details always on page 1
    let page1Sections = ["basicInfo", "vehicleDetails"];

    // Start counting additional pages
    let remainingSections = Object.entries(visibleSections)
      .filter(([key, visible]) => visible && !page1Sections.includes(key))
      .map(([key]) => key);

    // If we have more than 2 major sections left, add more pages
    if (remainingSections.length > 2) {
      pages = 3; // Max 3 pages
    } else if (remainingSections.length > 0) {
      pages = 2;
    }

    return pages;
  }, [visibleSections]);

  // Determine which sections to show on each page
  const getSectionsForPage = (pageNum) => {
    const allSections = [
      { id: "basicInfo", component: null }, // Rendered separately
      { id: "vehicleDetails", component: <VehicleDetailsForm /> },
      { id: "generalInfo", component: <GeneralProposalInformationForm /> },
      { id: "paOwnerCover", component: <PAOwnerCoverDetailsForm /> },
      { id: "addOns", component: <AddOnsPlanApplicableDetails /> },
      { id: "optionalCoverage", component: <OptionalCoverageDetails /> },
      { id: "prevPolicy", component: <PrevPolicyDetails /> },
      { id: "excessAmounts", component: null }, // Rendered separately
    ];

    const visible = allSections.filter(
      (section) => visibleSections[section.id]
    );

    if (pageNum === 1) {
      return visible.filter(
        (section) =>
          section.id === "basicInfo" || section.id === "vehicleDetails"
      );
    } else if (pageNum === 2) {
      return visible.filter(
        (section) =>
          section.id === "generalInfo" ||
          section.id === "paOwnerCover" ||
          section.id === "addOns"
      );
    } else if (pageNum === 3) {
      return visible.filter(
        (section) =>
          section.id === "optionalCoverage" ||
          section.id === "prevPolicy" ||
          section.id === "excessAmounts"
      );
    }
    return [];
  };

  // Render the form sections for the current page
  const renderPageContent = () => {
    const sections = getSectionsForPage(currentPage);

    return (
      <div className="text-center mx-3 my-4">
        {/* Always render basic info on page 1 */}
        {currentPage === 1 && (
          <div className="flex flex-wrap justify-between items-center gap-8 tracking-wider text-start mx-8">
            <label htmlFor="BusinessType">
              Business Type
              <span className="text-red-500 font-bold">*</span>
              <select
                id="BusinessType"
                {...methods.register("BusinessType")}
                onChange={handleChange}
                className={`flex w-full p-2 border cursor-pointer rounded ${
                  methods.formState.errors.BusinessType
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Business Type</option>
                {Data?.magma_business_types.map((data) => (
                  <option key={data?.id} value={data?.name}>
                    {data?.name}
                  </option>
                ))}
              </select>
              {methods.formState.errors.BusinessType && (
                <p className="text-red-500">
                  {methods.formState.errors.BusinessType.message}
                </p>
              )}
            </label>

            <label htmlFor="PolicyProductType">
              Policy Product Type
              <span className="text-red-500 font-bold">*</span>
              <select
                id="PolicyProductType"
                {...methods.register("PolicyProductType")}
                onChange={handleChange}
                className={`flex w-full p-2 border cursor-pointer rounded ${
                  methods.formState.errors.PolicyProductType
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Policy Product Type</option>
                {policyProductTypes.map((product) => (
                  <option key={product?.productId} value={product?.pName}>
                    {product?.pName}
                  </option>
                ))}
              </select>
              {methods.formState.errors.PolicyProductType && (
                <p className="text-red-500">
                  {methods.formState.errors.PolicyProductType.message}
                </p>
              )}
            </label>

            <label htmlFor="default-datepicker">
              Proposal Date
              <span className="text-red-500 font-bold">*</span>
              <div className="flex items-center">
                <input
                  type="date"
                  onChange={handleDateChange}
                  value={selectedDate}
                  className={`flex w-full border rounded ${
                    methods.formState.errors?.ProposalDate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {methods.formState.errors.ProposalDate && (
                <p className="text-red-500">
                  {methods.formState.errors.ProposalDate.message}
                </p>
              )}
            </label>
          </div>
        )}

        {/* Render sections for current page */}
        {sections.map((section) => {
          if (section.id === "basicInfo" || section.id === "excessAmounts") {
            return null; // These are handled separately
          }

          return (
            <div key={section.id}>
              {section.id === "paOwnerCover" && (
                <>
                  <hr />
                  <div className="tracking-wider flex my-4 text-start font-serif font-bold mx-8">
                    <input
                      id="PAOwnerCoverApplicable"
                      type="checkbox"
                      name="PAOwnerCoverApplicable"
                      checked={quote?.PAOwnerCoverApplicable}
                      onChange={(e) => {
                        const { checked } = e.target;
                        dispatch(
                          magmaQuotes({
                            field: "PAOwnerCoverApplicable",
                            value: checked,
                          })
                        );
                        setValue("PAOwnerCoverApplicable", checked);
                      }}
                      className={`w-6 h-6 cursor-pointer text-2xl text-red-600 bg-gray-200 border-gray-300 rounded focus:ring-green-500 focus:ring-0`}
                    />
                    <label
                      htmlFor="PAOwnerCoverApplicable"
                      className="flex ms-3 capitalize"
                    >
                      PA Owner Cover Applicable
                    </label>
                  </div>
                </>
              )}

              {section.id === "addOns" && (
                <>
                  <div className="tracking-wider flex my-4 text-start font-serif font-bold mx-8">
                    <input
                      id="AddOnsPlanApplicable"
                      type="checkbox"
                      name="AddOnsPlanApplicable"
                      checked={quote?.AddOnsPlanApplicable}
                      onChange={(e) => {
                        const { checked } = e.target;
                        dispatch(
                          magmaQuotes({
                            field: "AddOnsPlanApplicable",
                            value: checked,
                          })
                        );
                        setValue("AddOnsPlanApplicable", checked);
                      }}
                      className={`w-6 h-6 cursor-pointer text-2xl text-red-600 bg-gray-200 border-gray-300 rounded focus:ring-green-500 focus:ring-0`}
                    />
                    <label
                      htmlFor="AddOnsPlanApplicable"
                      className="flex ms-3 capitalize"
                    >
                      Add-Ons Plan Applicable
                    </label>
                  </div>
                </>
              )}

              {section.id === "optionalCoverage" && (
                <>
                  <div className="tracking-wider flex text-start my-4 font-serif font-bold mx-8">
                    <input
                      id="OptionalCoverageApplicable"
                      type="checkbox"
                      name="OptionalCoverageApplicable"
                      checked={quote?.OptionalCoverageApplicable}
                      onChange={(e) => {
                        const { checked } = e.target;
                        dispatch(
                          magmaQuotes({
                            field: "OptionalCoverageApplicable",
                            value: checked,
                          })
                        );
                        setValue("OptionalCoverageApplicable", checked);
                      }}
                      className={`w-6 h-6 cursor-pointer text-2xl text-red-600 bg-gray-200 border-gray-300 rounded focus:ring-green-500 focus:ring-0`}
                    />
                    <label
                      htmlFor="OptionalCoverageApplicable"
                      className="flex ms-3 capitalize"
                    >
                      Optional Coverage Applicable
                    </label>
                  </div>
                </>
              )}

              {section.id === "prevPolicy" && (
                <>
                  <div className="tracking-wider flex my-4 text-start font-serif font-bold mx-8">
                    <input
                      id="IsPrevPolicyApplicable"
                      type="checkbox"
                      name="IsPrevPolicyApplicable"
                      checked={quote?.IsPrevPolicyApplicable}
                      onChange={(e) => {
                        const { checked } = e.target;
                        dispatch(
                          magmaQuotes({
                            field: "IsPrevPolicyApplicable",
                            value: checked,
                          })
                        );
                        setValue("IsPrevPolicyApplicable", checked);
                      }}
                      className={`w-6 h-6 cursor-pointer text-2xl text-red-600 bg-gray-200 border-gray-300 rounded focus:ring-green-500 focus:ring-0`}
                    />
                    <label
                      htmlFor="IsPrevPolicyApplicable"
                      className="flex ms-3 capitalize"
                    >
                      Prev Policy Applicable
                    </label>
                  </div>
                  {/* <hr /> */}
                </>
              )}

              {section.component}

              {section.id !== "vehicleDetails" &&
                section.id !== "generalInfo" && <hr />}
            </div>
          );
        })}

        {/* Render excess amounts on last page */}
        {currentPage === totalPages && (
          <div className="flex flex-wrap justify-start my-4 items-center gap-8 tracking-wider text-start mx-8">
            <label
              htmlFor="CompulsoryExcessAmount"
              className="w-60 text-sm font-medium text-gray-700 "
            >
              Compul. Excess Amount
              <span className="text-red-500 font-bold">*</span>
              <input
                id="CompulsoryExcessAmount"
                type="number"
                name="CompulsoryExcessAmount"
                {...methods.register("CompulsoryExcessAmount")}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300"
              />
              {methods.formState.errors.CompulsoryExcessAmount && (
                <p className="text-red-500">
                  {methods.formState.errors.CompulsoryExcessAmount.message}
                </p>
              )}
            </label>
            {showVoluntary && (
              <label
                htmlFor="VoluntaryExcessAmount"
                className="w-60 text-sm font-medium text-gray-700 "
              >
                Voluntary Excess Amount
                <span className="text-red-500 font-bold">*</span>
                <input
                  id="VoluntaryExcessAmount"
                  type="number"
                  name="VoluntaryExcessAmount"
                  {...methods.register("VoluntaryExcessAmount")}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded border-gray-300`}
                />
                {methods.formState.errors.VoluntaryExcessAmount && (
                  <p className="text-red-500">
                    {methods.formState.errors.VoluntaryExcessAmount.message}
                  </p>
                )}
              </label>
            )}

            {showImposed && (
              <label
                htmlFor="ImposedExcessAmount"
                className="w-60 text-sm font-medium text-gray-700 "
              >
                Imposed Excess Amount
                <span className="text-red-500 font-bold">*</span>
                <input
                  id="ImposedExcessAmount"
                  type="number"
                  name="ImposedExcessAmount"
                  {...methods.register("ImposedExcessAmount")}
                  onChange={handleChange}
                  className="w-full p-2 border rounded border-gray-300"
                />
                {methods.formState.errors.ImposedExcessAmount && (
                  <p className="text-red-500">
                    {methods.formState.errors.ImposedExcessAmount.message}
                  </p>
                )}
              </label>
            )}

            {/* Trailer Vehicle Section */}
            <div className="tracking-wider flex mt-5">
              <input
                id="IsTrailerVehicleApplicable"
                type="checkbox"
                name="IsTrailerVehicleApplicable"
                checked={quote?.IsTrailerVehicleApplicable}
                onChange={(e) => {
                  const { checked } = e.target;
                  dispatch(
                    magmaQuotes({
                      field: "IsTrailerVehicleApplicable",
                      value: checked,
                    })
                  );
                  setValue("IsTrailerVehicleApplicable", checked);
                }}
                className="w-6 h-6 cursor-pointer text-2xl text-green-600 bg-gray-200 border-gray-300 rounded-sm focus:ring-green-500 focus:ring-0"
              />
              <label
                htmlFor="IsTrailerVehicleApplicable"
                className="flex ms-3 capitalize"
              >
                Trailer Vehicle Applicable
              </label>
            </div>
            {quote.IsTrailerVehicleApplicable && (
              <label
                htmlFor="TrailersDetails"
                className="w-60 text-sm font-medium text-gray-700 "
              >
                Trailers Details
                <span className="text-red-500 font-bold">*</span>
                <input
                  id="TrailersDetails"
                  type="text"
                  name="TrailersDetails"
                  {...methods.register("TrailersDetails")}
                  onChange={handleChange}
                  className="w-full p-2 border rounded border-gray-300"
                />
                {methods.formState.errors.TrailersDetails && (
                  <p className="text-red-500">
                    {methods.formState.errors.TrailersDetails.message}
                  </p>
                )}
              </label>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="flex">
        <FormProvider {...methods}>
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col shadow-lg rounded overflow-y-auto grow tracking-wider bg-slate-50"
          >
            <h2
              onClick={() => toggleSecondDiv()}
              className={`my-4 mx-auto cursor-pointer text-center md:text-2xl text-lg text-transparent bg-gradient-to-l bg-clip-text from-indigo-600 to-blue-500 font-bold`}
            >
              Quotation Form
            </h2>

            {renderPageContent()}

            {/* Pagination Buttons */}
            <div className="my-6 flex justify-between px-5 tracking-wide ">
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
                <div className="flex justify-between space-x-5 tracking-wider">
                  <button
                    className={`flex justify-center transition-all gap-2 border-b-[4px] active:border-b-[2px] active:translate-y-[2px] items-center shadow-xl md:text-lg text-sm
                    ${
                      isSubmitting
                        ? "bg-green-800 text-white cursor-not-allowed"
                        : "bg-slate-100 hover:text-gray-50 cursor-pointer"
                    } 
                    backdrop-blur-md lg:font-semibold isolation-auto border-none 
                    before:absolute before:w-full before:transition-all before:duration-700 
                    before:hover:w-full before:-left-full before:hover:left-0 before:rounded 
                    ${isSubmitting ? "before:bg-green-900 cursor-not-allowed" : "before:bg-green-800"}
                    before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 
                    relative md:py-2 px-3 py-1 overflow-hidden rounded group`}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-1"></span>
                        Submitting...
                      </>
                    ) : (
                      "Finalize Quotation"
                    )}
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
            <div
              className={`container-fluid max-w-sm w-full justify-between items-center px-0.5 overflow-y-auto ease-in-out`}
              style={{ maxHeight: "678px" }}
            >
              <h1 className="text-center text-white text-lg font-semibold text-transparent bg-gradient-to-l from-indigo-600 to-blue-500 whitespace-nowrap">
                Commercial Vehicle
              </h1>
            </div>
          )}
        </FormProvider>
      </div>
    </AnimatePresence>
  );
};

export default QuotationForm;
