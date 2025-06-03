import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import VITE_DATA from "../../config/config.jsx";
import formatDate from "../../advisor/utils/DateHelpers.jsx";
import JsonData from "../../utils/JsonData.jsx";

const getFormattedTime = () => {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

function AddPolicy() {
  const [formData, setFormData] = useState({
    entryDate: formatDate(new Date(), "yyyy-MM-dd"),
    branch: "",
    insuredName: "",
    contactNo: "",
    vehRegNo: "",
    registrationDate: formatDate(new Date(), "yyyy-MM-dd"),
    mfgYear: "",
    vehicleAge:"",
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
  const [APIData, setAPIData] = useState([]);
  const [branchname, setBranchName] = useState([]);
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [policyTypeList, setPolicyTypeList] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [fuelData, setFuelData] = useState([]);
  const [currentTime, setCurrentTime] = useState(getFormattedTime());
  const currentYear = new Date().getFullYear();
  const fetchData = useCallback(async (url, setter, authRequired = true) => {
    try {
      const token = sessionStorage.getItem("token");
      if (authRequired && !token) {
        toast.error("Not Authorized yet.. Try again!");
        return;
      }

      const config = authRequired ? { headers: { Authorization: token } } : {};
      const response = await axios.get(`${VITE_DATA}${url}`, config);
      setter(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(`Failed to fetch data: ${error.message}`);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await fetchData("/view/company/lists", setCompanyList, false);

        const token = sessionStorage.getItem("token");
        if (token) {
          await Promise.all([
            fetchData("/employees/data", setAPIData),
            fetchData("/api/branch-list", setBranchName),
            fetchData("/view/fuel", setFuelData),
            fetchData("/staff/policy/lists", setPolicyTypeList),
          ]);
        }
      } catch (error) {
        console.error("Initial data loading error:", error);
      }
    };

    fetchInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Handle company change - fetch categories
  const handleCompanyChange = async (e) => {
    const companyNames = e.target.value;
    setFormData((prev) => ({ ...prev, company: companyNames, category: "" }));

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
  const handlePolicyTypeChange = (e) => {
    const selectedPolicyType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      policyType: selectedPolicyType,
      productCode: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "mfgYear"){
      const yearPath = parseInt(value, 10);
      let calculatedAge = currentYear - yearPath;
      calculatedAge = isNaN(calculatedAge) ? 0 : Math.max(0, calculatedAge);
      setFormData((prev) => ({
        ...prev,
        vehicleAge: `${calculatedAge} years`,
      }));
    }
   
    setFormData((prev) => ({
      ...prev,
      [name]: name === "insuredName" ? value.toUpperCase() : value,
    }));
  };

  const handleStaffChange = (e) => {
    const selectedValue = e.target.value;
    const selectedEmployee = APIData.find(
      (emp) => emp.empname === selectedValue
    );

    setFormData((prev) => ({
      ...prev,
      staffName: selectedValue,
      employee_id: selectedEmployee?._id || "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "entryDate",
      "vehRegNo",
      "mfgYear",
      "company",
      "category",
      // "sourcing",
      "policyType",
      "productCode",
      "fuel",
      "insuredName",
      "branch",
      "contactNo",
      "staffName",
      "segment",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formSubmitted || !validateForm()) return;
    setFormSubmitted(true);
    try {
      const response = await axios.post(`${VITE_DATA}/alldetails/adddata`, {
        ...formData,
        currentTime,
      });

      if (response.data) {
        toast.success("Policy Created Successfully!");
        setFormSubmitted(true);
        setFormData({
          contactNo: "",
          vehRegNo: "",
          registrationDate: "",
          branch: "",
          insuredName: "",
          staffName: "",
          employee_id: "",
          mfgYear: "",
          company: "",
          category: "",
          segment: "",
          sourcing: "",
          policyType: "",
          productCode: "",
          fuel: "",
        });
      }
    } catch (error) {
      console.error("Error during Add Policy", error.response);
      toast.error("Error Occurred. Try again...!");
    } finally {
      setFormSubmitted(false);
    }
  };

  const inputFields = [
    {
      label: "Entry Date",
      name: "entryDate",
      type: "date",
      required: true,
      placeholder: "Select Entry Date",
      value: formData.entryDate,
    },
    {
      label: "Branch",
      name: "branch",
      type: "select",
      required: true,
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
      required: true,
      placeholder: "Enter Insured Name",
    },
    {
      label: "Contact No.",
      name: "contactNo",
      type: "text",
      required: false,
      placeholder: "Enter Contact No",
    },
    {
      label: "Vehicle Reg. No.",
      name: "vehRegNo",
      type: "text",
      required: true,
      placeholder: "Enter Reg. Number",
    },
    {
      label: "Reg. Date",
      name: "registrationDate",
      type: "date",
      required: true,
      placeholder: "Select Reg. Date",
      value: formData.registrationDate,
    },
    {
      label: "MFG Year",
      name: "mfgYear",
      type: "select",
      required: true,
      options: JsonData.yearOptions,
    },
    {
      label: "Vehicle Age",
      name: "vehicleAge",
      type: "text",
      placeholder: "Vehicle Age",
      disabled: true,
    },
    {
      label: "Company",
      name: "company",
      type: "select",
      required: true,
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
      required: true,
      disabled: !formData.company,
      options: [
        {
          value: "",
          label: formData.c_type ? "Select Category" : "Select Company First",
          disabled: true,
        },
        ...categoryList,
      ],
    },
    {
      label: "Segment",
      name: "segment",
      type: "select",
      required: true,
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
      required: true,
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
      required: true,
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
      required: true,
      disabled: !formData.policyType,
      options: [
        {
          value: "",
          label: formData.policyType
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
      required: true,
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
      required: true,
      options: APIData.filter(
        (emp) => emp.staffType?.toUpperCase() === "OPS EXECUTIVE"
      ).map((emp) => ({
        value: emp.empname,
        label: `${emp.empname} (${emp.empid})`,
        key: emp._id,
      })),
      onChange: handleStaffChange,
    },
  ];

  return (
    <section className="container-fluid relative sm:ml-40">
      <div className="container-fluid justify-center md:mx-3 md:ml-6 border-gray-200 border-dashed rounded bg-white ">
        <h1 className="font-semibold text-xl md:text-3xl py-2 mb-8 text-blue-700">
          Create Policy
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          {inputFields.map((field, index) => (
            <div
              key={index}>
              <label className="block text-sm font-medium text-black">
                {field.label}{" "}
                {field.required && (
                  <span className="text-red-600 font-bold">*</span>
                )}
              </label>
              {field.type === "select" ? (
                <select
                   className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={field.onChange || handleChange}
                  disabled={field.disabled}
                >
                  <option>Select {field?.label}</option>
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
                 className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || field.value || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                />
              )}
              {errors[field.name] && (
                <span className="text-red-600 text-sm">
                  {errors[field.name]}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center p-2 text-center w-full my-2 mt-10 gap-10">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={formSubmitted}
            className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-medium rounded px-4 py-2 shadow-lg transition-all disabled:opacity-70"
          >
            {formSubmitted ? (
              <>
                <span className="inline-block cursor-not-allowed animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AddPolicy;
