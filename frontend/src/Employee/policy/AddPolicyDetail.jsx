/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { State, City } from "country-state-city";
import axios from "axios";
import VITE_DATA from "../../config/config.jsx";
import { X } from "lucide-react";
import JsonData from "../../utils/JsonData.jsx";
import { AnimatePresence, motion } from "motion/react";

function AddPolicyDetail({ insurance, fetchData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  // Utility functions
  const getFormattedTime = useCallback(() => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }, []);

  // State initialization
  const [formData, setFormData] = useState({
    ...insurance,
    empTime: getFormattedTime(),
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data states from backend
  const [apiData, setApiData] = useState({
    companyTypes: [],
    odDiscounts: [],
    advisors: [],
  });

  // Location data
  const [states] = useState(State.getStatesOfCountry("IN"));
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState(insurance.states || "");

  // Constants
  const BIHAR_CITIES = useMemo(
    () => [
      "Araria",
      "Arwal",
      "Aurangabad",
      "Banka",
      "Begusarai",
      "Bhagalpur",
      "Bhojpur",
      "Buxar",
      "Darbhanga",
      "Gaya",
      "Gopalganj",
      "Jamui",
      "Jehanabad",
      "Kaimur District",
      "Katihar",
      "Khagaria",
      "Kishanganj",
      "Lakhisarai",
      "Munger",
      "Madhepura",
      "Madhubani",
      "Muzaffarpur",
      "Nalanda",
      "Nawada",
      "Patna",
      "Purnia",
      "Pashchim Champaran",
      "Purba Champaran",
      "Rohtas",
      "Saharsa",
      "Samastipur",
      "Saran",
      "Sheikhpura",
      "Sheohar",
      "Sitamarhi",
      "Siwan",
      "Supaul",
      "Vaishali",
      "West Champaran",
    ],
    []
  );

  // Fetch all required data in one call
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${VITE_DATA}/alldetails/emp/policy`, {
          headers: { Authorization: token },
          params: {
            branch: insurance.branch || sessionStorage.getItem("branch"),
          },
        });

        setApiData({
          companyTypes: response.data.companyTypes || [],
          odDiscounts: response.data.odDiscounts || [],
          advisors: response.data.advisors || [],
          ccList: response.data.ccList || [],
          SitCapacity: response.data.SitCapacity || [],
          ncbList: response.data.ncbList || [],
        });

        // Initialize cities if state exists in insurance data
        if (insurance.states) {
          const stateCities = City.getCitiesOfState("IN", insurance.states);
          setCities(
            stateCities.filter((city) => BIHAR_CITIES.includes(city.name))
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to load data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, [insurance.branch, insurance.states, BIHAR_CITIES]);

  // Update cities when state changes
  useEffect(() => {
    if (selectedState) {
      try {
        const stateCities = City.getCitiesOfState("IN", selectedState);
        setCities(
          stateCities.filter((city) => BIHAR_CITIES.includes(city.name))
        );
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }
  }, [selectedState, BIHAR_CITIES]);

  // Filter advisors based on branch
  const filteredAdvisors = useMemo(() => {
    if (!formData.branch || apiData.advisors.length === 0) return [];
    return apiData.advisors
      .filter((adv) =>
        adv.branch.some(
          (b) => b.toUpperCase() === formData.branch.toUpperCase()
        )
      )
      .sort((a, b) => a.advisorname.localeCompare(b.advisorname));
  }, [formData.branch, apiData.advisors]);

  // Calculate derived values
  const { netPremium, finalAmount } = useMemo(() => {
    const odPremium = parseFloat(formData.odPremium) || 0;
    const liabilityPremium = parseFloat(formData.liabilityPremium) || 0;
    const taxes = parseFloat(formData.taxes) || 0;
    const rsa = parseFloat(formData.rsa) || 0;

    const netPremium = odPremium + liabilityPremium;
    const finalAmount = netPremium + taxes + rsa;

    return {
      netPremium: netPremium.toFixed(2),
      finalAmount:
        formData.company === "GO-DIGIT"
          ? finalAmount.toFixed(2)
          : finalAmount.toFixed(0),
    };
  }, [
    formData.odPremium,
    formData.liabilityPremium,
    formData.taxes,
    formData.rsa,
    formData.company,
  ]);

  // Get categories for selected company
  const companyCategories = useMemo(() => {
    if (!formData.company) return [];
    const company = apiData.companyTypes.find(
      (c) => c.c_type === formData.company
    );
    return company?.category || [];
  }, [formData.company, apiData.companyTypes]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "selectedState") {
      setSelectedState(value);
      setFormData((prev) => ({
        ...prev,
        states: value,
        district: "", // Reset district when state changes
      }));
      return;
    }

    if (name === "advId") {
      const selectedAdvisor = filteredAdvisors.find(
        (a) => a.uniqueId === value
      );
      setFormData((prev) => ({
        ...prev,
        advId: value,
        advisorName: selectedAdvisor?.advisorname || "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePolicyStartDateChange = (e) => {
    const startDate = e.target.value;
    const policyStartDate = new Date(startDate);
    const policyEndDate = new Date(startDate);

    // Set OD Expiry to one day before the policy start date
    const odExpiryDate = new Date(policyStartDate);
    odExpiryDate.setMonth(odExpiryDate.getMonth() + 12);
    odExpiryDate.setDate(policyStartDate.getDate() - 1);
    const odExpiry = odExpiryDate.toISOString().split("T")[0];

    // Set TP Expiry to one day before the policy start date
    const tpExpiryDate = new Date(policyStartDate);
    tpExpiryDate.setMonth(tpExpiryDate.getMonth() + 12);
    tpExpiryDate.setDate(policyStartDate.getDate() - 1);
    const tpExpiry = tpExpiryDate.toISOString().split("T")[0];

    // Set Policy End Date to one day before the policy start date
    policyEndDate.setMonth(policyEndDate.getMonth() + 12);
    policyEndDate.setDate(policyStartDate.getDate() - 1);
    const policyEnd = policyEndDate.toISOString().split("T")[0];

    setFormData((prevDetails) => ({
      ...prevDetails,
      odExpiry,
      tpExpiry,
      policyEndDate: policyEnd,
      policyStartDate: startDate,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `${VITE_DATA}/alldetails/updatedata/${insurance._id}`,
        {
          ...formData,
          netPremium,
          finalEntryFields: finalAmount,
        },
        { headers: { Authorization: token } }
      );

      fetchData();
      toast.success(response.data.status);
      toggleModal();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update policy");
    } finally {
      setSubmitting(false);
    }
  };

  // if (!loading) {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center backdrop:blur-lg z-50 bg-black bg-opacity-60">
  //       <div className="bg-white p-6 rounded shadow-lg">
  //         <div className="flex items-center justify-center">
  //           <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-t-blue-600 border-b-red-600 mr-3"></div>
  //           <span>Loading policy details...</span>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <button
        onClick={toggleModal}
        type="button"
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 dark:shadow-lg font-medium rounded text-sm px-2 py-1 text-center"
      >
        Update
      </button>

      {isModalOpen && (
        <AnimatePresence>
          <div className="fixed flex justify-center items-center inset-0 z-50 bg-black bg-opacity-60 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative bg-gradient-to-r from-blue-700 to-blue-700 rounded-lg shadow-xl w-full max-w-7xl"
            >
           
              {loading ? (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-60">
                  <div className="bg-white p-6 rounded shadow-lg">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-t-blue-600 border-b-red-600 mr-3"></div>
                      <span>Loading policy details...</span>
                    </div>
                  </div>
                </div>
              ) : (<>
                  
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-100">
                Update Policy Details
              </h3>
              <button
                onClick={toggleModal}
                className="text-gray-200 hover:text-white bg-red-500 hover:bg-red-600 rounded-full p-1"
              >
                <X size={24} />
              </button>
            </div>
                <form onSubmit={handleSubmit}>
                  <div className="p-1 max-h-[80vh] overflow-y-auto bg-gradient-to-r from-blue-700 to-blue-700">
                    <div className="bg-white rounded p-6 shadow-inner">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Company <span className="text-red-600">*</span>
                          </label>
                          <select
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">Select Company</option>
                            {apiData.companyTypes.map((company) => (
                              <option key={company._id} value={company.c_type}>
                                {company.c_type}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* Category Selection */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Category <span className="text-red-600">*</span>
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={!formData.company}
                          >
                            <option value="">Select Category</option>

                            {companyCategories.map((category, idx) => (
                              <option key={idx} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* Policy Number */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Policy No <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            name="policyNo"
                            value={formData.policyNo}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Policy Start Date{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            type="date"
                            name="policyStartDate"
                            value={formData.policyStartDate}
                            onChange={handlePolicyStartDateChange}
                          />
                        </div>

                        {/* FIELD - 11 */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Policy End Date{" "}
                            <span className="text-red-600"></span>
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            type="date"
                            value={formData.policyEndDate}
                            onChange={handleChange}
                            name="policyEndDate"
                            placeholder="Select Policy End Date"
                          />
                        </div>

                        {/* FIELD - 12 */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            OD Expiry <span className="text-red-600"></span>
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            type="date"
                            value={formData.odExpiry}
                            onChange={handleChange}
                            name="odExpiry"
                            placeholder="Select OD Expiry"
                            min="2025-01-01"
                          />
                        </div>

                        {/* FIELD - 13 */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            TP Expiry <span className="text-red-600"></span>
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            type="date"
                            value={formData.tpExpiry}
                            onChange={handleChange}
                            name="tpExpiry"
                            min="2025-01-01"
                          />
                        </div>
                        {/* State Selection */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            State <span className="text-red-600">*</span>
                          </label>
                          <select
                            name="selectedState"
                            value={formData.states}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">Select State</option>
                            {states.map((state) => (
                              <option key={state.isoCode} value={state.isoCode}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* RTO Selection */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            RTO <span className="text-red-600">*</span>
                          </label>
                          <select
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={!formData.states}
                          >
                            <option value="">Select RTO</option>
                            <option value="All">All</option>
                            {cities.map((city, index) => (
                              <option key={index} value={city.name}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          {" "}
                          <label className="block text-sm font-medium text-black">
                            {" "}
                            Engine No <span className="text-red-600">*</span>
                          </label>{" "}
                          <input
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            type="text"
                            value={formData.engNo}
                            onChange={handleChange}
                            name="engNo"
                            placeholder="Engine Number"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Chassis No <span className="text-red-600">*</span>
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            type="text"
                            value={formData.chsNo}
                            onChange={handleChange}
                            name="chsNo"
                            placeholder="Chassis Number"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black">
                            IDV
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            type="text"
                            value={formData.idv}
                            onChange={handleChange}
                            name="idv"
                            placeholder="Enter IDV"
                          />
                        </div>
                        {/* FIELD - 15 */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Body Type <span className="text-red-600">*</span>
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            type="text"
                            value={formData.bodyType}
                            onChange={handleChange}
                            name="bodyType"
                            placeholder="Enter Body Type"
                          />
                        </div>
                        {/* FIELD - 16 */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Make & Model{" "}
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            type="text"
                            value={formData.makeModel}
                            onChange={handleChange}
                            name="makeModel"
                          />
                        </div>
                        {formData.segment === "C V" && (
                          <div>
                            <label className="block text-sm font-medium text-black">
                              GVW (kg){" "}
                              <span className="text-red-600 text-xs">
                                {formData.segment === "C V" ? "*" : "Disabled"}{" "}
                              </span>
                            </label>
                            <input
                              className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              type="text"
                              value={formData.gvw}
                              onChange={handleChange}
                              placeholder="Enter GVW"
                              name="gvw"
                              disabled={formData.segment !== "C V"}
                            />
                          </div>
                        )}
                        {formData.segment === "C V" && (
                          <div>
                            <label className="block text-sm font-medium text-black">
                              Seating Capacity{" "}
                              <span className="text-red-600 text-xs">
                                {formData.segment === "C V" &&
                                (formData.productCode === "SCHOOL BUS" ||
                                  formData.productCode === "ROUTE BUS" ||
                                  formData.productCode === "TAXI")
                                  ? "*"
                                  : "Disabled"}
                              </span>
                            </label>
                            <select
                              className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              type="text"
                              value={formData.sitcapacity}
                              onChange={handleChange}
                              name="sitcapacity"
                              placeholder="Sitting Capacity"
                            >
                              <option value="">Select Seating</option>
                              {apiData.SitCapacity.map((data) => (
                                <option key={data._id} value={data.sitcapacity}>
                                  {data.sitcapacity}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {(formData.segment === "PVT-CAR" ||
                          formData.segment === "TW") && (
                          <div>
                            <label className="block text-sm font-medium text-black">
                              CC{" "}
                              <span className="text-red-600 text-xs">
                                {formData.segment === "PVT-CAR" ||
                                formData.segment === "TW"
                                  ? "*"
                                  : "Disabled"}
                              </span>
                            </label>
                            <select
                              className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              type="text"
                              name="cc"
                              value={formData.cc}
                              onChange={handleChange}
                              placeholder="Enter CC"
                            >
                              <option className="w-1" value="">
                                {" "}
                                Select CC{" "}
                              </option>
                              {apiData.ccList.map((data) => (
                                <option key={data._id} value={data.cc}>
                                  {data.cc}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        {formData.segment === "PVT-CAR" && (
                          <div>
                            <label className="block text-sm font-medium text-black">
                              NCB{" "}
                              <span className="text-red-600 text-xs">*</span>
                            </label>
                            <select
                              className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              type="text"
                              value={formData.ncb}
                              name="ncb"
                              onChange={handleChange}
                            >
                              <option className="w-1" value="">
                                {" "}
                                Select NCB{" "}
                              </option>
                              {apiData.ncbList.map((data) => (
                                <option key={data._id} value={data.ncb}>
                                  {data.ncb}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* OD Premium */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            OD Premium <span className="text-red-600">*</span>
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            type="number"
                            value={formData.odPremium}
                            onChange={handleChange}
                            name="odPremium"
                            placeholder="OD Premium"
                            required
                            disabled={formData.policyType === "SATP"}
                          />
                        </div>
                        {/* Liability Premium */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Liability Premium{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            type="number"
                            value={formData.liabilityPremium}
                            onChange={handleChange}
                            name="liabilityPremium"
                            placeholder="Liability Premium"
                            required
                          />
                        </div>
                        {/* Net Premium */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Net Premium <span className="text-red-600">*</span>
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                            type="number"
                            value={netPremium}
                            readOnly
                          />
                        </div>
                        {/* GST */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            GST <span className="text-red-600">*</span>
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            type="number"
                            value={formData.taxes}
                            onChange={handleChange}
                            name="taxes"
                            placeholder="GST Amount"
                            required
                          />
                        </div>
                        {/* RSA */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            RSA <span className="text-red-600">*</span>
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            type="number"
                            value={formData.rsa}
                            onChange={handleChange}
                            name="rsa"
                            placeholder="RSA Amount"
                            required
                          />
                        </div>
                        {/* Final Amount */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Final Amount <span className="text-red-600">*</span>
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                            type="number"
                            value={finalAmount}
                            readOnly
                          />
                        </div>
                        {/* OD Discount */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            OD Discount <span className="text-red-600">*</span>
                          </label>
                          <select
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            name="odDiscount"
                            value={formData.odDiscount}
                            onChange={handleChange}
                          >
                            <option value="">Select OD Discount</option>
                            {apiData.odDiscounts.map((data) => (
                              <option key={data._id} value={data.odDiscount}>
                                {data.odDiscount}%
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* Policy Payment Mode */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Payment Mode <span className="text-red-600">*</span>
                          </label>
                          <select
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={formData.policyPaymentMode}
                            name="policyPaymentMode"
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Payment Mode</option>
                            <option value="insta payment">Insta Payment</option>
                            <option value="customer link">Customer Link</option>
                            <option value="customer cheque">
                              Customer Cheque
                            </option>
                            <option value="eleedom single cheque">
                              Eleedom Single Cheque
                            </option>
                          </select>
                        </div>
                        {/* Advisor Name */}
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Advisor Name
                          </label>
                          <select
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={formData.advId}
                            onChange={handleChange}
                            name="advId"
                          >
                            <option value="">Select Advisor</option>
                            {filteredAdvisors.map((data) => (
                              <option key={data._id} value={data.uniqueId}>
                                {`${data.advisorname} (${data.branch[0]})`}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black">
                            Sub Advisor
                          </label>
                          <input
                            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            type="text"
                            value={formData.subAdvisor}
                            onChange={handleChange}
                            name="subAdvisor"
                            placeholder="Sub Advisor"
                          />
                        </div>
                        {/* Inspection fields (conditionally rendered) */}
                        {["C V", "PVT-CAR"].includes(formData?.segment) && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-black">
                                Inspection By{" "}
                                <span className="text-red-600">*</span>
                              </label>
                              <select
                                className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                name="inspectionBy"
                                value={formData.inspectionBy}
                                onChange={handleChange}
                              >
                                <option value="">Select Inspection By</option>
                                {JsonData.InspectionBy.map((data) => (
                                  <option key={data.id} value={data.type}>
                                    {data.nameType}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {formData.inspectionBy !== "NA" && (
                              <>
                                <div>
                                  <label className="block text-sm font-medium text-black">
                                    Inspection ID{" "}
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <input
                                    className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    type="text"
                                    value={formData.inspectionID}
                                    onChange={handleChange}
                                    name="inspectionID"
                                    placeholder="Inspection ID"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-black">
                                    Inspection Date{" "}
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <input
                                    className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    type="date"
                                    value={formData.inspectionDate}
                                    onChange={handleChange}
                                    name="inspectionDate"
                                  />
                                </div>{" "}
                              </>
                            )}
                          </>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="mt-16 flex justify-center">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {submitting ? (
                            <>
                              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                              Updating...
                            </>
                          ) : (
                            "Update Policy"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                </>   )}
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </>
  );
}

export default AddPolicyDetail;
