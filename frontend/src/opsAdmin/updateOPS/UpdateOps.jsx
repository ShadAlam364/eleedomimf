/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import VITE_DATA from "../../config/config.jsx";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import JsonData from "../../utils/JsonData.jsx";

function UpdateOps({ UpdateOps, update, APIData }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(getFormattedTime());
  const [allDetails, setAllDetails] = useState({
    entryDate: "",
    branch: "",
    insuredName: "",
    contactNo: "",
    vehRegNo: "",
    registrationDate: "",
    mfgYear: "",
    company: "",
    category: "",
    sourcing: "",
    segment: "",
    policyType: "",
    productCode: "",
    fuel: "",
    staffName: "",
    employee_id: "",
  });

  useEffect(() => {
    setAllDetails(UpdateOps);
  }, [UpdateOps]);

  useEffect(() => {
    if (isModalOpen) {
      const fetchData = async () => {
        try {
          const token = sessionStorage.getItem("token");
          const config = { headers: { Authorization: token } };

          const [branches, companies, policyTypes, fuels] = await Promise.all([
            axios.get(`${VITE_DATA}/api/branch-list`, config),
            axios.get(`${VITE_DATA}/view/company/lists`, config),
            axios.get(`${VITE_DATA}/staff/policy/lists`, config),
            axios.get(`${VITE_DATA}/view/fuel`, config),
          ]);

          setBranchName(branches.data);
          setCompanyList(companies.data);
          setPolicyTypeList(policyTypes.data);
          setFuelData(fuels.data);

          // Initialize category and product options after data is loaded
          if (UpdateOps.company) {
            const selectedCompany = companies.data.find(
              (policy) => policy.c_type === UpdateOps.company
            );

            if (selectedCompany?.category) {
              setCategoryList(
                selectedCompany.category.map((category) => ({
                  value: category,
                  label: category,
                  key: category,
                }))
              );
            }
          }

          if (UpdateOps.policyType) {
            const selectedPolicy = policyTypes.data.find(
              (policy) => policy.p_type === UpdateOps.policyType
            );

            if (selectedPolicy?.products) {
              setProductOptions(
                selectedPolicy.products.map((product) => ({
                  value: product,
                  label: product,
                  key: product,
                }))
              );
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [isModalOpen, UpdateOps]); // Add UpdateOps to dependencies
  const updateInsuranceAPI = async () => {
    try {
      setFormSubmitted(true);
      const resp = await axios.put(
        `${VITE_DATA}/alldetails/updatedata/${UpdateOps._id}`,
        allDetails
      );
      toast.success(`${resp.data.status}`);
      update();
      toggleModal();
    } catch (error) {
      console.error("Error updating policy details:", error);
      toast.error("Failed to update policy details");
    } finally {
      setFormSubmitted(false);
    }
  };

  const [branchname, setBranchName] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [policyTypeList, setPolicyTypeList] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [fuelData, setFuelData] = useState([]);
  const currentYear = new Date().getFullYear();
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  function getFormattedTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedDetails = {
      ...allDetails,
      currentTime: currentTime,
      [name]: name === "insuredName" ? value.toUpperCase() : value,
    };

    if (name === "staffName") {
      const selectedEmployee =
        APIData.find((emp) => emp.empname === value) || {};
      updatedDetails.employee_id = selectedEmployee._id || "";
    }
    if(name === "mfgYear"){
      const yearPath = parseInt(value, 10);
      let calculatedAge = currentYear - yearPath;
      calculatedAge = isNaN(calculatedAge) ? 0 : Math.max(0, calculatedAge);
      updatedDetails = {
        ...updatedDetails,
        vehicleAge: `${calculatedAge} years` // Convert to string if needed
      };
    }
    setAllDetails(updatedDetails);
  };

  // Handle company change - fetch categories
  const handleCompanyChange = async (e, isInitialLoad = false) => {
    const companyNames = isInitialLoad ? e : e.target.value;
    setAllDetails((prev) => ({
      ...prev,
      company: companyNames,
      category: isInitialLoad ? prev.category : "",
    }));

    if (!companyNames) {
      setCategoryList([]);
      return;
    }

    const selectedCompany = companyList.find(
      (policy) => policy.c_type === companyNames
    );

    if (selectedCompany && selectedCompany.category) {
      setCategoryList(
        selectedCompany.category.map((category) => ({
          value: category,
          label: category,
          key: category,
        }))
      );
    }
  };

  // Handle policy type change - update product options
  const handlePolicyTypeChange = (e, isInitialLoad = false) => {
    const selectedPolicyType = isInitialLoad ? e : e.target.value;
    setAllDetails((prev) => ({
      ...prev,
      policyType: selectedPolicyType,
      productCode: isInitialLoad ? prev.productCode : "",
    }));

    if (!selectedPolicyType) {
      setProductOptions([]);
      return;
    }

    const selectedPolicy = policyTypeList.find(
      (policy) => policy.p_type === selectedPolicyType
    );

    if (selectedPolicy && selectedPolicy.products) {
      setProductOptions(
        selectedPolicy.products.map((product) => ({
          value: product,
          label: product,
          key: product,
        }))
      );
    }
  };

  const inputFields = [
    {
      label: "Entry Date",
      name: "entryDate",
      type: "date",
      value: allDetails.entryDate,
    },
    {
      label: "Branch",
      name: "branch",
      type: "select",
      options: branchname.map((item) => ({
        value: item.branchname,
        label: item.branchname,
        key: item._id,
      })),
    },
    {
      label: "Insured Name",
      name: "insuredName",
      type: "text",
    },
    {
      label: "Contact No.",
      name: "contactNo",
      type: "text",
    },
    {
      label: "Vehicle Reg. No.",
      name: "vehRegNo",
      type: "text",
    },
    {
      label: "Reg. Date",
      name: "registrationDate",
      type: "date",
      value: allDetails.registrationDate,
    },
    {
      label: "MFG Year",
      name: "mfgYear",
      type: "select",
      options: JsonData.yearOptions,
    },
    {
      label: "Vehicle Age",
      name: "vehicleAge",
      type: "text",
    },
    {
      label: "Company",
      name: "company",
      type: "select",
      options: companyList.map((company) => ({
        value: company.c_type,
        label: company.c_type,
        key: company._id,
      })),
      onChange: handleCompanyChange,
    },
    {
      label: "Category",
      name: "category",
      type: "select",
      disabled: !allDetails.company,
      options: [
        {
          value: "",
          label: allDetails.company
            ? "Select Category"
            : "Select Company First",
          disabled: true,
        },
        ...categoryList,
      ],
    },
    {
      label: "Segment",
      name: "segment",
      type: "select",
      options: JsonData.segmentOptions.map((item) => ({
        value: item.value,
        label: item.label,
        key: item.label,
      })),
    },
    {
      label: "Sourcing",
      name: "sourcing",
      type: "select",
      options: JsonData.sourcings.map((item) => ({
        value: item.value,
        label: item.label,
        key: item.label,
      })),
    },
    {
      label: "Policy Type",
      name: "policyType",
      type: "select",
      options: policyTypeList.map((item) => ({
        value: item.p_type,
        label: item.p_type,
        key: item._id,
      })),
      onChange: handlePolicyTypeChange,
    },
    {
      label: "Product Code",
      name: "productCode",
      type: "select",
      disabled: !allDetails.policyType,
      options: [
        {
          value: "",
          label: allDetails.policyType
            ? "Select Product"
            : "Select Policy Type First",
          disabled: true,
        },
        ...productOptions,
      ],
    },
    {
      label: "Fuel Type",
      name: "fuel",
      type: "select",
      options: fuelData.map((item) => ({
        value: item.fuels,
        label: item.fuels,
        key: item._id,
      })),
    },
    {
      label: "Policy Made By",
      name: "staffName",
      type: "select",
      options: APIData.filter(
        (emp) => emp.staffType?.toUpperCase() === "OPS EXECUTIVE"
      ).map((emp) => ({
        value: emp.empname,
        label: `${emp.empname} (${emp.empid})`,
        key: emp._id,
      })),
    },
  ];

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
              <div className="bg-white m-1 grid grid-cols-2 md:grid-cols-6 gap-6 rounded p-4 shadow-inner">
                {inputFields.map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-black">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        name={field.name}
                        value={allDetails[field.name] || ""}
                        onChange={field.onChange || handleInputChange}
                        disabled={field.disabled}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option, idx) => (
                          <option
                            value={option.value}
                            key={idx}
                            disabled={option.disabled}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        type={field.type}
                        name={field.name}
                        value={allDetails[field.name] || field.value || ""}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
                <div className="col-span-5 my-4 mt-8 flex justify-center">
                  <button
                    type="submit"
                    onClick={updateInsuranceAPI}
                    disabled={formSubmitted}
                    className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-medium rounded px-4 py-2 shadow-lg transition-all disabled:opacity-70"
                  >
                    {formSubmitted ? (
                      <>
                        <span className="inline-block cursor-not-allowed animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                        Updating...
                      </>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </>
  );
}

export default UpdateOps;
