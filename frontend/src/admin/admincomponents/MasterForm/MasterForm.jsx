import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import MultiStep from "react-multistep";
import VITE_DATA from "../../../config/config.jsx";
function MasterForm() {
  const [states, setStates] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [cities, setCities] = useState([]);
  const [ncbList, setNcbLists] = useState([]);
  // const [productCode, setProductCode] = useState("");
  const [ccList, setCCList] = useState([]);
  const [branchname, setBranchName] = useState([]);
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [pdata, setPdata] = useState([]);
  const [APIData, setAPIData] = useState([]);
  const [catTypesForSelectedPolicy, setCatTypesForSelectedPolicy] = useState(
    []
  );
  const [fuelType, setFuelType] = useState([]);
  const [payoutOnList, setPayoutOnList] = useState([]);
  const [payMode, setPayMode] = useState([]);
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [cslab, setCslab] = useState([]);
  const [odList, setOdList] = useState([]);
  const [advLists, setAdvLists] = useState([]);
  const [sit, setSit] = useState([]);
  const [createPolicy, setCreatePolicy] = useState({});
  const citiesToShow = [
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
  ];

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized yet.. Try again! ");
    } else {
      // The user is authenticated, so you can make your API request here.
      axios
        .get(`${VITE_DATA}/sit/show`, {
          headers: {
            Authorization: `${token}`, // Send the token in the Authorization header
          },
        })
        .then((response) => {
          setSit(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [formSubmitted]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized yet.. Try again! ");
    } else {
      // The user is authenticated, so you can make your API request here.
      axios
        .get(`${VITE_DATA}/commission/slab/view`, {
          headers: {
            Authorization: `${token}`, // Send the token in the Authorization header
          },
        })
        .then((response) => {
          setCslab(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized yet.. Try again! ");
    } else {
      // The user is authenticated, so you can make your API request here.
      axios
        .get(`${VITE_DATA}/ncb/show`, {
          headers: {
            Authorization: `${token}`, // Send the token in the Authorization header
          },
        })
        .then((response) => {
          setNcbLists(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [formSubmitted]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    // const branch = sessionStorage.getItem("name");
    if (!token) {
      toast.error("Not Authorized yet.. Try again! ");
    } else {
      // The user is authenticated, so you can make your API request here.
      axios
        .get(`${VITE_DATA}/advisor/all/lists`, {
          headers: {
            Authorization: `${token}`, // Send the token in the Authorization header
          },
        })
        .then((response) => {
          setAdvLists(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    // The user is authenticated, so you can make your API request here.
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized yet.. Try again! ");
    } else {
      axios
        .get(`${VITE_DATA}/od/list`, {
          headers: {
            Authorization: `${token}`, // Send the token in the Authorization header
          },
        })
        .then((response) => {
          setOdList(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized yet.. Try again! ");
    } else {
      // The user is authenticated, so you can make your API request here.
      axios
        .get(`${VITE_DATA}/view/payouton`, {
          headers: {
            Authorization: `${token}`, // Send the token in the Authorization header
          },
        })
        .then((response) => {
          setPayoutOnList(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized yet.. Try again! ");
    } else {
      // The user is authenticated, so you can make your API request here.
      axios
        .get(`${VITE_DATA}/view/payment/mode`, {
          headers: {
            Authorization: `${token}`, // Send the token in the Authorization header
          },
        })
        .then((response) => {
          setPayMode(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized yet.. Try again! ");
    } else {
      // The user is authenticated, so you can make your API request here.
      axios
        .get(`${VITE_DATA}/employees/data`, {
          headers: {
            Authorization: `${token}`, // Send the token in the Authorization header
          },
        })
        .then((response) => {
          setAPIData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [formSubmitted]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized yet.. Try again! ");
    } else {
      // The user is authenticated, so you can make your API request here.
      axios
        .get(`${VITE_DATA}/view/fuel`, {
          headers: {
            Authorization: `${token}`, // Send the token in the Authorization header
          },
        })
        .then((response) => {
          setFuelType(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized yet.. Try again! ");
    } else {
      // The user is authenticated, so you can make your API request here.
      axios
        .get(`${VITE_DATA}/cc/show`, {
          headers: {
            Authorization: `${token}`, // Send the token in the Authorization header
          },
        })
        .then((response) => {
          setCCList(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [formSubmitted]);

  useEffect(() => {
    axios
      .get(`${VITE_DATA}/staff/policy/lists`)
      .then((resp) => {
        const PolicyType = resp?.data;

        setData(PolicyType);
      })
      .catch((error) => {
        console.error("Error fetching policy types:", error);
      });
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized yet.. Try again! ");
    } else {
      // The user is authenticated, so you can make your API request here.
      axios
        .get(`${VITE_DATA}/api/branch-list`, {
          headers: {
            Authorization: `${token}`, // Send the token in the Authorization header
          },
        })
        .then((response) => {
          setBranchName(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${VITE_DATA}/view/company/lists`)
      .then((resp) => {
        const cType = resp.data;

        setPdata(cType);
      })
      .catch((error) => {
        console.error("Error fetching company names:", error);
      });
  }, []);

  useEffect(() => {
    // Load states asynchronously when the component mounts
    const fetchStates = async () => {
      try {
        const { State } = await import("country-state-city").then(
          (module) => module
        );
        const fetchedStates = State.getStatesOfCountry("IN");
        setStates(fetchedStates);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  const calculateFinalAmount = (updatedPolicy) => {
    // Ensure all values are numbers; default to 0 if undefined
    const odPremiumValue = parseFloat(updatedPolicy.odPremium) || 0;
    const liabilityPremiumValue =
      parseFloat(updatedPolicy.liabilityPremium) || 0;
    const taxesValue = parseFloat(updatedPolicy.taxes) || 0;
    const rsaValue = parseFloat(updatedPolicy.rsa) || 0;
    // Recalculate net premium (sum of odPremium and liabilityPremium)
    const netPremiumValue = odPremiumValue + liabilityPremiumValue;
    // Final amount calculation: netPremium + taxes + rsa
    const finalAmountValue = netPremiumValue + taxesValue + rsaValue;
    // Set the final value based on the company rule
    setCreatePolicy((prevPolicy) => ({
      ...prevPolicy,
      finalEntryFields:
        createPolicy.company === "GO-DIGIT"
          ? Number(finalAmountValue.toFixed(2))
          : Number(finalAmountValue.toFixed(0)),
    }));
    return netPremiumValue; // Return netPremium if needed
  };

  // *************************************************************************************************************//
  const calculateAdvisorPayableAmount = (finalEntryFields, percentage) => {
    const deduction = finalEntryFields * (percentage / 100);
    return finalEntryFields - deduction;
  };
  const calculateAdvisorPayoutAmount = (finalEntryFields, percentage) => {
    const deduction = finalEntryFields * (percentage / 100);
    return deduction;
  };

  const calculateBranchPayableAmount = (finalEntryFields, branchpayoutper) => {
    const deduction = finalEntryFields * (branchpayoutper / 100);
    return finalEntryFields - deduction;
  };
  const calculateBranchPayoutAmount = (finalEntryFields, branchpayoutper) => {
    const deduction = finalEntryFields * (branchpayoutper / 100);
    return deduction;
  };

  const calculateCompanyPayableAmount = (
    finalEntryFields,
    companypayoutper
  ) => {
    const deduction = finalEntryFields * (companypayoutper / 100);
    return deduction;
  };

  //calculation  profit/loss
  const calculateProfitLoss = (branchPayout, companyPayout) => {
    const profitLossValue = branchPayout - companyPayout;
    return profitLossValue.toFixed(2); // Assuming you want to display the result with two decimal places
  };

  const matchingCSLab = cslab.find(
    (cslabItem) =>
      String(cslabItem.catnames) === String(createPolicy.category) &&
      String(cslabItem.policytypes) === String(createPolicy.policyType) &&
      String(cslabItem.pcodes) === String(createPolicy.productCode) &&
      String(cslabItem.vfuels) === String(createPolicy.fuel) &&
      String(cslabItem.payoutons) === String(createPolicy.payoutOn)
  );


  useEffect(() => {
    const calculateAmounts = () => {
      if (matchingCSLab) {
        // Calculate advisor payable amount based on matching CSLab data
        const percentage = matchingCSLab.cvpercentage || 0;
        const branchpercent = matchingCSLab.branchpayoutper || 0;
        const companypercent = matchingCSLab.companypayoutper || 0;
        // const cvPercentage = matchingCSLab.cvpercentage || 0;
        const advisorPayout = calculateAdvisorPayoutAmount(
          parseFloat(createPolicy?.finalEntryFields),
          percentage
        );
        const advisorPayable = calculateAdvisorPayableAmount(
          parseFloat(createPolicy.finalEntryFields),
          percentage
        );
        const branchPayables = calculateBranchPayableAmount(
          parseFloat(createPolicy?.finalEntryFields),
          branchpercent
        );
        const branchPayout = calculateBranchPayoutAmount(
          parseFloat(createPolicy?.finalEntryFields),
          branchpercent
        );
        const companyPayables = calculateCompanyPayableAmount(
          parseFloat(createPolicy?.finalEntryFields),
          companypercent
        );
        setCreatePolicy({
          ...createPolicy,
          advisorPayableAmount: advisorPayable,
          advisorPayoutAmount: advisorPayout,
          branchPayout: branchPayout,
          branchPayableAmount: branchPayables,
          companyPayout: companyPayables,
          profitLoss: calculateProfitLoss(branchPayout, companyPayables),
        });
      }
    };
    if (createPolicy?.finalEntryFields) {
      calculateAmounts();
    }
    [createPolicy.finalEntryFields, matchingCSLab];
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === "policyStartDate") {
      // Update policyStartDate
      const startDate = value;

      // Calculate OD Expiry Date (1 Year Ahead)
      const odExpiryDate = new Date(startDate);
      odExpiryDate.setFullYear(odExpiryDate.getFullYear() + 1);
      const formattedOdExpiry = odExpiryDate.toISOString().split("T")[0];

      // Calculate Policy End Date (1 Year Ahead Minus 1 Day)
      const policyEndDateValue = new Date(startDate);
      policyEndDateValue.setFullYear(policyEndDateValue.getFullYear() + 1);
      policyEndDateValue.setDate(policyEndDateValue.getDate() - 1);
      const formattedPolicyEndDate = policyEndDateValue
        .toISOString()
        .split("T")[0];

      // Calculate TP Expiry Date (3 Years Ahead Minus 1 Day)
      const tpExpiryDate = new Date(startDate);
      tpExpiryDate.setFullYear(tpExpiryDate.getFullYear() + 3);
      tpExpiryDate.setDate(tpExpiryDate.getDate() - 1);
      const formattedTpExpiry = tpExpiryDate.toISOString().split("T")[0];

      // Update all related states
      setCreatePolicy({
        ...createPolicy,
        [name]: startDate,
        policyEndDate: formattedPolicyEndDate,
        odExpiry: formattedOdExpiry,
        tpExpiry: formattedTpExpiry,
      });
    } else if (name === "company") {
      const selectedCatId = e.target.selectedOptions[0].getAttribute("data-id");
      setCatTypesForSelectedPolicy(selectedCatId);
      setCreatePolicy({
        ...createPolicy,
        [name]: value,
      });
    } else if (name === "selectedState") {
      if (value) {
        try {
          const { City } = await import("country-state-city").then(
            (module) => module
          );
          const stateCities = City.getCitiesOfState("IN", value);
          setCities(stateCities);
        } catch (error) {
          console.error("Error fetching cities:", error);
          setCities([]);
        }
      } else {
        setCities([]);
      }
      setCreatePolicy({
        ...createPolicy,
        [name]: value,
        selectedCity: value,
      });
    } else if (name === "mfgYear") {
      const currentYear = new Date().getFullYear();
      const birthYearInt = parseInt(value, 10);
      let calculatedAge = currentYear - birthYearInt;
      setCreatePolicy({
        ...createPolicy,
        [name]: value,
        vehicleAge: isNaN(birthYearInt) ? 0 : `${calculatedAge} years`,
      });
    } else if (name === "policyType") {
      const filteredProducts = data.find(
        (prod) => prod?.p_type === value
      )?.products;
      setProducts(filteredProducts);
      // setProductCode("");
      setCreatePolicy({
        ...createPolicy,
        [name]: value,
      });
    } else if (
      ["liabilityPremium", "odPremium", "taxes", "rsa"].includes(name)
    ) {
      setCreatePolicy((prevPolicy) => {
        const updatedPolicy = {
          ...prevPolicy,
          [name]: Number(value), // Update premium fields
        };
        // Recalculate netPremium
        const newNetPremium = calculateFinalAmount(updatedPolicy);
        return {
          ...updatedPolicy,
          netPremium: newNetPremium,
        };
      });
    } else if (name === "advId") {
      const selectedAdvisor = advLists.find((adv) => adv.uniqueId === value);
      setCreatePolicy({
        ...createPolicy,
        [name]: value,
        advisorName: selectedAdvisor.advisorname || "",
      });
    } else if (name === "branchPayout" || name === "companyPayout" || name === "idv") {
      setCreatePolicy({
        ...createPolicy,
        [name]: Number(value),
      });
    } else {
      setCreatePolicy({
        ...createPolicy,
        [name]: value,
      });
    }
  };

  // Handle form submission logic here
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formSubmitted) return;
    setFormSubmitted(true);
    setErrors({}); // Clear previous errors

    const requiredFields = [
      { field: createPolicy.entryDate, key: "entryDate" },
      { field: createPolicy.insuredName, key: "insuredName" },
      { field: createPolicy.company, key: "company" },
      { field: createPolicy.branch, key: "branch" },
      { field: createPolicy.policyNo, key: "policyNo" },
      // { field: createPolicy.engNo, key: "engNo" },
      // { field: createPolicy.chsNo, key: "chsNo" },
      { field: createPolicy.policyType, key: "policyType" },
      // { field: createPolicy.odPremium, key: "odPremium" },
      // { field: createPolicy.liabilityPremium, key: "liabilityPremium" },
      // { field: createPolicy.rsa, key: "rsa" },
      // { field: createPolicy.taxes, key: "taxes" },
      { field: createPolicy.segment, key: "segment" },
      // { field: createPolicy.sourcing, key: "sourcing" },
      // { field: createPolicy.policyPaymentMode, key: "policyPaymentMode" },
      // { field: createPolicy.vehRegNo, key: "vehRegNo" },
      { field: createPolicy.policyStartDate, key: "policyStartDate" },
      { field: createPolicy.policyEndDate, key: "policyEndDate" },
      // { field: createPolicy.odDiscount, key: "odDiscount" },
      // { field: createPolicy.ncb, key: "ncb" },
      { field: createPolicy.contactNo, key: "contactNo" },
      // { field: createPolicy.idv, key: "idv" },
      // { field: createPolicy.bodyType, key: "bodyType" },
      // { field: createPolicy.makeModel, key: "makeModel" },
      { field: createPolicy.mfgYear, key: "mfgYear" },
      // { field: createPolicy.gvw, key: "gvw" },
      // { field: createPolicy.cc, key: "cc" },
      { field: createPolicy.payoutOn, key: "payoutOn" },
      { field: createPolicy.productCode, key: "productCode" },
      { field: createPolicy.advId, key: "advId" },
      // { field: createPolicy.staffName, key: "staffName" },
    ];

    const errors = requiredFields.reduce((acc, { field, key }) => {
      if (!field) acc[key] = "required*";
      return acc;
    }, {});

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setFormSubmitted(false);
      return;
    }
    try {
      const response = await axios.post(
        `${VITE_DATA}/alldetails/adddata`,
        createPolicy
      );

      if (response.data) {
        toast.success("Data Added Successfully!");
        setCreatePolicy("");
        setFormSubmitted(false);
      } else {
        toast.error(response.data.message);
        setFormSubmitted(false);
      }
    } catch (error) {
      console.error(error.response.data.error.message);
      toast.error(error.response.data.error.message);
    } finally {
      setFormSubmitted(false);
    }
  };

  return (
    <section className="container-fluid relative  p-0 sm:ml-48 bg-white">
      <div className="container-fluid  justify-center p-2 border-gray-200 border-dashed rounded dark:border-gray-700 bg-white">
        <h1 className="font-semibold text-3xl my-2 text-blue-700">
          Create Policy
        </h1>
        <div className="relative w-full lg:w-full p-0 lg:p-4 rounded-xl shadow-xl text-2xl items-center bg-slate-200">
          <MultiStep
            activeStep={0}
            showNavigation={true}
            className="bg-blue-500 rounded shadow-md flex justify-between mt-0 overflow-hidden"
            stepCustomStyle={{
              display: "inline",
              width: "30%",
              marginBottom: "0",
              // justifyContent: "center", // Center align the steps
              // alignItems: "center", // Center align vertically
            }}
            titleCustomStyle={{ fontWeight: "bold", color: "#2D3748" }}
            contentCustomStyle={{ color: "#2D3748" }}
            prevButton={{
              title: (
                <span className="flex justify-start text-base">
                  <img
                    src="/left.png"
                    height={5}
                    width={20}
                    alt="report"
                    className="mr-1 mx-auto mt-auto rounded-xl"
                  />
                  {/* <SlArrowLeftCircle className="mr-2 mx-auto my-auto" /> */}
                  Back
                </span>
              ),
              style: {
                display: "inline",
                width: "max-content",
                background: "red",
                color: "white",
                fontWeight: "",
                borderRadius: "12rem",
                padding: "0.2rem 0.6rem",
                border: "none",
                cursor: "pointer",
                boxShadow:
                  "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)",
                transition: "background 1.3s ease",
                marginRight: "auto", // Adjusted to marginRight auto
                marginBottom: "0.5rem",
                float: "left",
              },
            }}
            nextButton={{
              title: (
                <span className="flex justify-end text-base">
                  Next
                  <img
                    src="/right.png"
                    height={5}
                    width={20}
                    alt="report"
                    className=" mx-auto ml-1 mt-auto rounded-xl"
                  />
                </span>
              ),
              style: {
                display: "inline",
                width: "max-content",
                background: "green",
                color: "white",
                fontWeight: "",
                borderRadius: "12rem",
                padding: "0.2rem 0.6rem",
                border: "none",
                cursor: "pointer",
                boxShadow:
                  "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)",
                transition: "background 1.3s ease",
                marginLeft: "auto", // Adjusted to marginLeft auto
                marginBottom: "0.5rem",
                float: "right",
              },
            }}
          >
            <div className="flex flex-wrap mb-12 justify-between">
              {/* FIELD - 1 */}
              <div className="flex flex-col p-1 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Entry Date:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="date"
                  name="entryDate"
                  value={createPolicy.entryDate}
                  onChange={handleChange}
                  placeholder="Select Entry Date"
                />
                {errors.entryDate && (
                  <span className="text-red-600 text-sm ">
                    {errors.entryDate}
                  </span>
                )}
              </div>
              {/* FIELD - 2 */}
              <div className="flex flex-col p-1 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Branch:<span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  id="branch"
                  name="branch"
                  className="input-style py-1.5 text-lg rounded"
                  value={createPolicy.branch}
                  onChange={handleChange}
                >
                  <option className="w-1" value="">
                    ---------------- Select Branch --------------
                  </option>
                  {branchname.map((item) => (
                    <option value={item.branchname} key={item._id}>
                      {item.branchname}
                    </option>
                  ))}
                </select>
                {errors.branch && (
                  <span className="text-red-600 text-sm ">{errors.branch}</span>
                )}
              </div>
              {/* FIELD - 3 */}
              <div className="flex flex-col p-1 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Insured Name:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded capitalize"
                  type="text"
                  name="insuredName"
                  value={createPolicy.insuredName}
                  onChange={handleChange}
                  placeholder="Enter Insured Name"
                />
                {errors.insuredName && (
                  <span className="text-red-600 text-sm">
                    {errors.insuredName}
                  </span>
                )}
              </div>

              {/* FIELD - 4 */}
              <div className="flex flex-col p-1 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">Contact No:</label>
                <input
                  className="input-style rounded"
                  type="text"
                  value={createPolicy.contactNo}
                  name="contactNo"
                  onChange={handleChange}
                  placeholder="Enter Contact No"
                />
              </div>

              {/* FIELD - 5 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Policy Made By:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  id="staffName"
                  name="staffName"
                  className="input-style py-1.5 text-lg rounded"
                  value={createPolicy.staffName}
                  onChange={handleChange}
                >
                  <option className="w-1" value="">
                    --------------- Policy Made By --------------
                  </option>
                  {APIData.filter(
                    (emp) =>
                      (emp.staffType === "OPS Executive") |
                      (emp.staffType === "OPS EXECUTIVE")
                  ).map((emp) => (
                    <option key={emp._id} value={emp.empname}>
                      {emp.empid} - {emp.empname}
                    </option>
                  ))}
                  {errors.staffName && (
                    <span className="text-red-600 text-sm ">
                      {errors.staffName}
                    </span>
                  )}
                </select>
              </div>

              {/* FIELD - 6 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base  mx-1">
                  Company Name:<span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  id="company"
                  name="company"
                  className="input-style py-1.5 text-lg rounded"
                  value={createPolicy.company}
                  onChange={handleChange}
                >
                  <option className="w-1" value="">
                    ------------- Select Company --------------
                  </option>
                  {pdata.map((comp) => (
                    <option
                      key={comp._id}
                      value={comp.c_type}
                      data-id={comp._id}
                    >
                      {comp.c_type}
                    </option>
                  ))}
                </select>
                {errors.company && (
                  <span className="text-red-600 text-sm">{errors.company}</span>
                )}
              </div>

              {/* FIELD - 7 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Category:<span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  className="input-style w-full py-1.5 text-lg rounded"
                  value={createPolicy.category}
                  name="category"
                  onChange={handleChange}
                >
                  <option value="">
                    ------------ Select Product Type ------------
                  </option>
                  {pdata.map(
                    (cat) =>
                      cat._id === catTypesForSelectedPolicy &&
                      cat.category.map((product, idx) => (
                        <option key={idx} value={product}>
                          {product}
                        </option>
                      ))
                  )}
                </select>
                {/* {errors.category && <span className="text-red-600 text-sm ">{errors.category}</span>} */}
              </div>

              {/* FIELD - 8 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Policy Type:<span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  className="input-style py-1.5 text-lg rounded"
                  value={createPolicy.policyType}
                  name="policyType"
                  onChange={handleChange}
                >
                  <option value="">
                    ------------ Select Policy Type --------------
                  </option>
                  {data?.map((prod) => (
                    <option key={prod._id} value={prod.p_type}>
                      {prod.p_type}
                    </option>
                  ))}
                </select>
                {errors.policyType && (
                  <span className="text-red-600 text-sm ">
                    {errors.policyType}
                  </span>
                )}
              </div>

              {/* FIELD - 9 */}
              <div className="flex flex-col  p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Policy No:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  value={createPolicy.policyNo}
                  name="policyNo"
                  onChange={handleChange}
                  placeholder="Enter Policy No"
                />
                {errors.policyNo && (
                  <span className="text-red-600 text-sm ">
                    {errors.policyNo}
                  </span>
                )}
              </div>

              {/* FIELD - 10 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Engine No:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  name="engNo"
                  value={createPolicy.engNo}
                  onChange={handleChange}
                  placeholder="Enter Engine No"
                />
                {errors.engNo && (
                  <span className="text-red-600 text-sm ">{errors.engNo}</span>
                )}
              </div>
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Chassis No:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  value={createPolicy.chsNo}
                  name="chsNo"
                  onChange={handleChange}
                  placeholder="Enter Chassis No"
                />
                {errors.chsNo && (
                  <span className="text-red-600 text-sm ">{errors.chsNo}</span>
                )}
              </div>

              {createPolicy.policyType === "SATP" ? (
                <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                  <label className="text-base mx-1">
                    OD Premium:<span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    className="input-style rounded"
                    type="number"
                    value={createPolicy.odPremium}
                    name="odPremium"
                    onChange={handleChange}
                    placeholder="Disabled"
                    disabled
                  />
                </div>
              ) : (
                <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                  <label className="text-base mx-1">
                    OD Premium:<span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    className="input-style rounded"
                    type="number"
                    value={createPolicy.odPremium}
                    name="odPremium"
                    onChange={handleChange}
                    placeholder="Enter OD Premium"
                  />
                  {errors.odPremium && (
                    <span className="text-red-600 text-sm ">
                      {errors.odPremium}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap mb-12 justify-between">
              {createPolicy.policyType === "SAOD" ? (
                <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                  <label className="text-base mx-1">
                    Liability Premium:
                    <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    className="input-style rounded"
                    type="number"
                    name="liabilityPremium"
                    value={createPolicy.liabilityPremium}
                    onChange={handleChange}
                    placeholder="Disabled"
                    disabled
                  />
                </div>
              ) : (
                <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                  <label className="text-base mx-1">
                    Liability Premium:
                    <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    className="input-style rounded"
                    type="number"
                    name="liabilityPremium"
                    value={createPolicy.liabilityPremium}
                    onChange={handleChange}
                    placeholder="Enter Liability Premium"
                  />
                  {errors.liabilityPremium && (
                    <span className="text-red-600 text-sm ">
                      {errors.liabilityPremium}
                    </span>
                  )}
                </div>
              )}

              {/* FIELD - 14 */}
              <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Net Premium:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="number"
                  name="netPremium"
                  value={createPolicy.netPremium}
                  placeholder="Net Premium"
                  readOnly
                />
              </div>

              {/* FIELD - 15 */}
              <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  GST(Amount):<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  value={createPolicy.taxes}
                  name="taxes"
                  onChange={handleChange}
                  placeholder="GST"
                />
                {errors.taxes && (
                  <span className="text-red-600 text-sm ">{errors.taxes}</span>
                )}
              </div>

              <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  RSA:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  value={createPolicy.rsa}
                  name="rsa"
                  onChange={handleChange}
                  placeholder="RSA"
                />
                {errors.rsa && (
                  <span className="text-red-600 text-sm ">{errors.rsa}</span>
                )}
              </div>

              {/* FIELD - 16 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Final Amount:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  value={createPolicy.finalEntryFields}
                  name="finalEntryFields"
                  placeholder=" Final Amount"
                  readOnly
                />
              </div>

              {/* FIELD - 17 */}
              {/* <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">OD Discount%:<span className="text-red-600 font-bold">*</span></label>
                <input
                  className="input-style rounded"
                  type="text"
                  name="odDiscount"
                  value={odDiscount}
                  onChange={(e) => setOdDiscount(e.target.value)}
                  placeholder="Enter OD Discount"
                />
                {errors.odDiscount && <span className="text-red-600 text-sm ">{errors.odDiscount}</span>}
              </div> */}

              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  OD Discount%:<span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  className="input-style text-base rounded"
                  type="text"
                  name="odDiscount"
                  value={createPolicy.odDiscount}
                  onChange={handleChange}
                  placeholder="Enter OD Discount"
                >
                  <option className="w-1" value="">
                    -------------- Select OD Discount -------------
                  </option>
                  {odList.map((data) => (
                    <option key={data._id} value={data.odDiscount}>
                      {" "}
                      {data.odDiscount}%{" "}
                    </option>
                  ))}
                </select>
                {errors.odDiscount && (
                  <span className="text-red-600 text-sm ">
                    {errors.odDiscount}
                  </span>
                )}
              </div>

              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Segment:<span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  className="input-style py-1.5 text-lg rounded"
                  name="segment"
                  value={createPolicy.segment}
                  onChange={handleChange}
                >
                  <option className="w-1" value="">
                    -------------- Select Segment --------------
                  </option>
                  <option value="C V">CV</option>
                  <option value="PVT-CAR">PVT-CAR</option>
                  <option value="TW">TW</option>
                  <option value="HEALTH">HEALTH</option>
                  <option value="NON-MOTOR">NON-MOTOR</option>
                  {/* <option value="LIFE">LIFE</option> */}
                </select>
                {errors.segment && (
                  <span className="text-red-600 text-sm ">
                    {errors.segment}
                  </span>
                )}
              </div>

              {createPolicy.segment === "PVT-CAR" ? (
                <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                  <label className="text-base mx-1">
                    NCB%:<span className="text-red-600 font-bold">*</span>
                  </label>
                  <select
                    className="input-style text-base rounded"
                    type="text"
                    name="ncb"
                    value={createPolicy.ncb}
                    onChange={handleChange}
                  >
                    <option className="w-1" value="">
                      ------------------- Select NCB -------------------
                    </option>
                    {ncbList.map((data) => (
                      <option key={data._id} value={data.ncb}>
                        {data.ncb}
                      </option>
                    ))}
                  </select>
                  {errors.ncb && (
                    <span className="text-red-600 text-sm ">{errors.ncb}</span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col p-1 mt-4 text-start w-full  lg:w-1/4">
                  <label className="text-base mx-1">
                    NCB%:<span className="text-red-600 text-sm">Disabled</span>
                  </label>
                  <select
                    className="input-style text-base rounded"
                    type="text"
                    name="ncb"
                    value={createPolicy.ncb}
                    onChange={handleChange}
                    disabled
                  >
                    <option className="w-1" value="">
                      -------------------- Select NCB ---------------------
                    </option>
                    {ncbList.map((data) => (
                      <option key={data._id} value={data.ncb}>
                        {data.ncb}
                      </option>
                    ))}
                  </select>
                  {errors.ncb && (
                    <span className="text-red-600 text-sm ">{errors.ncb}</span>
                  )}
                </div>
              )}

              {/* FIELD - 19 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Policy Payment Mode:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  id="policyPaymentMode"
                  className="input-style py-1.5 text-lg rounded"
                  value={createPolicy.policyPaymentMode}
                  name="policyPaymentMode"
                  onChange={handleChange}
                >
                  <option className="w-1" value="">
                    ------- Select Policy Payment Mode -------
                  </option>
                  {payMode.map((mode) => (
                    <option key={mode._id} value={mode.paymentmode}>
                      {mode.paymentmode}
                    </option>
                  ))}
                </select>
                {errors.policyPaymentMode && (
                  <span className="text-red-600 text-sm ">
                    {errors.policyPaymentMode}
                  </span>
                )}
              </div>
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  State:<span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  className="input-style text-lg py-1.5 rounded"
                  name="selectedState"
                  value={createPolicy.selectedState}
                  onChange={handleChange}
                >
                  <option value="">
                    ---------------- Select State -----------------{" "}
                  </option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  RTO:<span className="text-red-600 font-bold">*</span>
                </label>
                {
                  // selectedCity ? (
                  <select
                    className="input-style py-2 text-base rounded"
                    name="selectedCity"
                    value={createPolicy.selectedCity}
                    onChange={handleChange}
                    disabled={!createPolicy.selectedState} // Disable city dropdown until a state is selected
                  >
                    <option value="">
                      ------------------- Select RTO --------------
                    </option>
                    <option value="All">All</option>
                    {/* Render other city options here if needed */}
                    {cities
                      .filter((data) => citiesToShow.includes(data.name))
                      .map((data, index) => (
                        <option key={index} value={data.name}>
                          {data.name}
                        </option>
                      ))}
                  </select>
                }
              </div>

              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Vehicle Reg No:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  value={createPolicy.vehRegNo}
                  name="vehRegNo"
                  onChange={handleChange}
                  placeholder="Enter Vehicle Reg No"
                />
                {errors.vehRegNo && (
                  <span className="text-red-600 text-sm ">
                    {errors.vehRegNo}
                  </span>
                )}
              </div>
            </div>

            {/* part-3 */}
            <div className="flex flex-wrap mb-12 justify-between">
              {/* FIELD - 22 */}
              <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Sourcing:<span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  className="input-style py-1.5 text-lg rounded"
                  value={createPolicy.sourcing}
                  name="sourcing"
                  onChange={handleChange}
                >
                  <option className="w-1" value="">
                    ------------ Select Sourcing Type -----------
                  </option>
                  <option value="NEW">NEW</option>
                  <option value="RENEWAL">RENEWAL</option>
                  <option value="ROLL OVER">ROLL OVER</option>
                </select>
                {errors.sourcing && (
                  <span className="text-red-600 text-sm ">
                    {errors.sourcing}
                  </span>
                )}
              </div>

              {/* FIELD - 23 */}
              <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Policy Start Date:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="date"
                  name="policyStartDate"
                  value={createPolicy.policyStartDate}
                  onChange={handleChange}
                  placeholder="Select Policy Start Date"
                />
                {errors.policyStartDate && (
                  <span className="text-red-600 text-sm ">
                    {errors.policyStartDate}
                  </span>
                )}
              </div>
              {/* FIELD - 24 */}
              <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Policy End Date:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="date"
                  name="policyEndDate"
                  value={createPolicy.policyEndDate}
                  onChange={handleChange}
                  placeholder="Select Policy End Date"
                />
                {errors.policyEndDate && (
                  <span className="text-red-600 text-sm ">
                    {errors.policyEndDate}
                  </span>
                )}
              </div>

              {/* FIELD - 25 */}
              <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  OD Expiry:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="date"
                  name="odExpiry"
                  value={createPolicy.odExpiry}
                  onChange={handleChange}
                  placeholder="Select OD Expiry"
                  min="2025-01-01"
                />
              </div>
              {/* FIELD - 26 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  TP Expiry:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="date"
                  name="tpExpiry"
                  value={createPolicy.tpExpiry}
                  onChange={handleChange}
                  placeholder="TP Expiry"
                  min="2025-01-01"
                />
              </div>

              {/* FIELD - 27 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  IDV:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  name="idv"
                  value={createPolicy.idv}
                  onChange={handleChange}
                  placeholder="Enter IDV"
                />
                {errors.idv && (
                  <span className="text-red-600 text-sm ">{errors.idv}</span>
                )}
              </div>

              {/* FIELD - 28 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Body Type:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  value={createPolicy.bodyType}
                  name="bodyType"
                  onChange={handleChange}
                  placeholder="Enter Body Type"
                />
                {errors.bodyType && (
                  <span className="text-red-600 text-sm ">
                    {errors.bodyType}
                  </span>
                )}
              </div>

              {/* FIELD - 29 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Make & Model:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  name="makeModel"
                  value={createPolicy.makeModel}
                  onChange={handleChange}
                  placeholder="Enter Make & Model"
                />
                {errors.makeModel && (
                  <span className="text-red-600 text-sm ">
                    {errors.makeModel}
                  </span>
                )}
              </div>
              {/* FIELD - 30 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Manufacturing Year:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  name="mfgYear"
                  value={createPolicy.mfgYear}
                  onChange={handleChange}
                  placeholder="Enter Manufacturing Year"
                />
                {errors.mfgYear && (
                  <span className="text-red-600 text-sm ">
                    {errors.mfgYear}
                  </span>
                )}
              </div>

              {/* FIELD - 31 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Reg. Date:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="date"
                  value={createPolicy.registrationDate}
                  name="registrationDate"
                  onChange={handleChange}
                  placeholder="Enter Reg. Date"
                />
                {errors.registrationDate && (
                  <span className="text-red-600 text-sm">
                    {errors.registrationDate}
                  </span>
                )}
              </div>

              {/* FIELD - 32 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Vehicle Age:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  name="vehicleAge"
                  value={createPolicy.vehicleAge}
                  placeholder="Vehicle Age"
                  readOnly
                />
              </div>

              {/* FIELD - 33 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Fuel:<span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  className="input-style py-1.5 text-lg rounded"
                  value={createPolicy.fuel}
                  name="fuel"
                  onChange={handleChange}
                >
                  <option className="w-1" value="">
                    ------------- Select Fuel Type -------------
                  </option>
                  {fuelType.map((fuel) => (
                    <option key={fuel._id} value={fuel.fuels}>
                      {fuel.fuels}
                    </option>
                  ))}
                </select>
              </div>
              {/* FIELD - 34 */}
            </div>

            <div className="flex flex-wrap mb-12 justify-between">
              <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Product Code:<span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  id="productCode"
                  name="productCode"
                  className="input-style py-1.5 text-lg rounded"
                  value={createPolicy.productCode}
                  onChange={handleChange}
                >
                  <option className="w-1" value="">
                    ----------- Select Product Code ------------
                  </option>

                  {products.map((product, idx) => (
                    <option key={idx} value={product}>
                      {product}
                    </option>
                  ))}
                </select>
                {errors.productCode && (
                  <span className="text-red-600 text-sm ">
                    {errors.productCode}
                  </span>
                )}
              </div>

              {createPolicy.segment === "C V" ? (
                <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                  <label className="text-base mx-1">GVW (kg):</label>
                  <input
                    className="input-style rounded"
                    type="text"
                    value={createPolicy.gvw}
                    onChange={handleChange}
                    placeholder="Enter GVW"
                    name="gvw"
                  />
                </div>
              ) : (
                <div className="flex flex-col p-1 text-start w-full mt-0 lg:w-1/4">
                  <label className="text-base mx-1">
                    GVW (kg):
                    <span className="text-red-600 text-sm">Disabled</span>
                  </label>
                  <input
                    className="input-style rounded"
                    type="text"
                    value={createPolicy.gvw}
                    onChange={handleChange}
                    name="gvw"
                    placeholder="Disabled"
                    disabled
                  />
                </div>
              )}

              {createPolicy.segment === "C V" &&
              (createPolicy.productCode === "SCHOOL BUS" ||
                createPolicy.productCode === "ROUTE BUS" ||
                createPolicy.productCode === "TAXI") ? (
                <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                  <label className="text-base mx-1 ">Seating Capacity:</label>
                  <select
                    className="input-style text-base rounded"
                    type="text"
                    value={createPolicy.sitcapacity}
                    onChange={handleChange}
                    name="sitcapacity"
                    placeholder="Enter Sitting Capacity"
                  >
                    <option value="">
                      ----------------- Select Seating -----------------
                    </option>
                    {sit &&
                      sit.map((data) => (
                        <option key={data._id} value={data.sitcapacity}>
                          {data.sitcapacity}
                        </option>
                      ))}
                    {/* <option value="">NOT APPLICABLE</option> */}
                  </select>
                </div>
              ) : (
                <div className="flex flex-col p-1 text-start w-full mt-0 lg:w-1/4">
                  <label className="text-base mx-1">
                    Seating Capacity:
                    <span className="text-red-600 text-sm">Disabled</span>
                  </label>
                  <select
                    className="input-style text-base rounded"
                    type="text"
                    value={createPolicy.sitcapacity}
                    onChange={handleChange}
                    name="sitcapacity"
                    placeholder="Disabled"
                    disabled
                  >
                    <option value="">
                      ------------------ Select Seating --------------
                    </option>
                    {sit &&
                      sit.map((data) => (
                        <option key={data._id} value={data.sitcapacity}>
                          {data.sitcapacity}
                        </option>
                      ))}
                    {/* <option value="">NOT APPLICABLE</option> */}
                  </select>
                </div>
              )}

              {/* 
              <div className="flex flex-col p-1  text-start w-full lg:w-1/4">
                <label className="text-base mx-1">CC:<span className="text-red-600 font-bold">*</span></label>
                <select
                  className="input-style rounded"
                  type="text"
                  name="cc"
                  value={cc}
                  onChange={(e) => setCc(e.target.value.toUpperCase())}
                  placeholder="Enter CC"
                >
                  <option className="w-1" value="" >-------------------- Select CC -------------------</option>
                  {
                    ccList.map((data) => (
                      <option key={data._id} value={data.cc}>{data.cc}</option>
                    ))
                  }
                </select>
              </div> */}

              {createPolicy.segment === "PVT-CAR" ||
              createPolicy.segment === "TW" ? (
                <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                  <label className="text-base mx-1">
                    CC:<span className="text-red-600 font-bold">*</span>
                  </label>
                  <select
                    className="input-style rounded"
                    type="text"
                    name="cc"
                    value={createPolicy.cc}
                    onChange={handleChange}
                    placeholder="Enter CC"
                  >
                    <option className="w-1" value="">
                      -------------------- Select CC ------------------
                    </option>
                    {ccList.map((data) => (
                      <option key={data._id} value={data.cc}>
                        {data.cc}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex flex-col p-1 text-start w-full mt-0 lg:w-1/4">
                  <label className="text-base mx-1">
                    CC:<span className="text-red-600 text-sm">Disabled</span>
                  </label>
                  <select
                    className="input-style rounded"
                    type="text"
                    name="cc"
                    value={createPolicy.cc}
                    onChange={handleChange}
                    placeholder="Enter CC"
                    disabled
                  >
                    <option className="w-1" value="">
                      -------------------- Select CC -----------
                    </option>
                    {ccList.map((data) => (
                      <option key={data._id} value={data.cc}>
                        {data.cc}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* FIELD - 36 */}

              {/* FIELD - 37*/}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Advisor Name:<span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  className="input-style rounded"
                  type="text"
                  value={createPolicy.advId}
                  name="advId"
                  onChange={handleChange}
                  placeholder="Enter Advisor Name"
                >
                  <option value="">
                    ----------------- Select Advisor -----------------
                  </option>
                  {advLists
                    .filter((emp) => emp.branch[0] === createPolicy.branch)
                    .sort((a, b) => a.advisorname.localeCompare(b.advisorname))
                    .map((data) => (
                      <option
                        key={data._id}
                        value={data.uniqueId}
                      >{`${data.uniqueId} --> ${data.branch[0]}  -->  ${data.advisorname} --> ${data.advisoraddress}`}</option>
                    ))}
                </select>
                {errors.advisorName && (
                  <span className="text-red-600 text-sm ">
                    {errors.advisorName}
                  </span>
                )}
              </div>

              {/* FIELD - 38 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Sub-Advisor Name:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  name="subAdvisor"
                  value={createPolicy.subAdvisor}
                  onChange={handleChange}
                  placeholder="Enter Sub Advisor"
                />
              </div>

              {/* FIELD - 39 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Payout On:<span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  id="payoutOn"
                  name="payoutOn"
                  className="input-style py-1.5 text-lg rounded"
                  value={createPolicy.payoutOn}
                  onChange={handleChange}
                >
                  <option className="w-1" value="">
                    -------------- Select Payout on -------------
                  </option>
                  {payoutOnList.map((pay) => (
                    <option key={pay._id} value={pay.payouton}>
                      {pay.payouton}
                    </option>
                  ))}
                </select>
                {errors.payoutOn && (
                  <span className="text-red-600 text-sm">
                    {errors.payoutOn}
                  </span>
                )}
              </div>
              {/* FIELD - 40 */}
              <div className="flex flex-col  p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Payment Done By:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  className="input-style py-1.5 text-lg rounded"
                  value={createPolicy.paymentDoneBy}
                  name="paymentDoneBy"
                  onChange={handleChange}
                >
                  <option className="w-1" value="">
                    --------- Select Payment Done By ------------
                  </option>
                  <option value="ELEEDOM IMF PVT LTD">
                    ELEEDOM IMF PVT LTD
                  </option>
                  <option value="HAJIPUR BRANCH">HAJIPUR BRANCH</option>
                  <option value="SAMASTIPUR BRANCH">SAMASTIPUR BRANCH</option>
                  <option value="PATNA BRANCH">PATNA BRANCH</option>
                  <option value="CUSTOMER">CUSTOMER</option>
                </select>
              </div>
              {/* FIELD - 41 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  CHQ No / Ref No:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  value={createPolicy.chqNoRefNo}
                  name="chqNoRefNo"
                  onChange={handleChange}
                  placeholder="Enter CHQ No / Ref No."
                />
              </div>
              {/* FIELD - 42 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Bank Name:<span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  id="bankName"
                  type="text"
                  name="bankName"
                  className="input-style rounded"
                  value={createPolicy.bankName}
                  placeholder="Enter Bank Name"
                  onChange={handleChange}
                ></input>
              </div>
              {/* FIELD - 43 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Endorshment Date:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="date"
                  name="chqPaymentDate"
                  value={createPolicy.chqPaymentDate}
                  onChange={handleChange}
                  placeholder="Select CHQ / Payment Date"
                />
              </div>
              {/* FIELD - 44 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">CHQ Status:</label>
                <select
                  className="input-style py-1.5 text-lg rounded"
                  value={createPolicy.chqStatus}
                  name="chqStatus"
                  onChange={handleChange}
                >
                  <option className="w-1" value="">
                    --- Select CHQ Status ---
                  </option>
                  <option value="PENDING">PENDING</option>
                  <option value="SUBMITTED TO BRANCH">
                    SUBMITTED TO BRANCH
                  </option>
                  <option value="CLEAR FROM BANK">CLEAR FROM BANK</option>
                  <option value="BCQ">BCQ</option>
                  <option value="SUBMITTED TO BANK">SUBMITTED TO BANK</option>
                </select>
              </div>

              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Advisor Payout Amount:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="bg-slate-200 rounded"
                  type="number"
                  value={createPolicy.advisorPayoutAmount}
                  name="advisorPayoutAmount"
                  onChange={handleChange}
                  placeholder="Advisor Payout Amount"
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-wrap mb-10 justify-between">
              {/* FIELD - 45 */}
              <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Advisor Payable Amount:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="rounded"
                  type="number"
                  value={createPolicy.advisorPayableAmount}
                  name="advisorPayableAmount"
                  onChange={handleChange}
                  placeholder="Advisor Payable Amount"
                  readOnly
                />
              </div>

              {/* FIELD - 46 */}
              <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Branch Payout:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="number"
                  name="branchPayout"
                  value={createPolicy.branchPayout}
                  onChange={handleChange}
                  placeholder="Enter Branch Payout"
                  // readOnly
                />
              </div>

              {/* FIELD - 47 */}
              <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Branch Payable Amount:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  value={createPolicy.branchPayableAmount}
                  name="branchPayableAmount"
                  onChange={handleChange}
                  placeholder="Branch Payable Amount"
                  readOnly
                />
              </div>

              {/* FIELD - 48 */}
              <div className="flex flex-col p-1 mt-0 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Company Payout:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="number"
                  value={createPolicy.companyPayout}
                  name="companyPayout"
                  onChange={handleChange}
                />
              </div>
              {/* FIELD - 49 */}
              <div className="flex flex-col p-1 mt-4 text-start w-full lg:w-1/4">
                <label className="text-base mx-1">
                  Profit/Loss Amount:
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className="input-style rounded"
                  type="text"
                  name="profitLoss"
                  value={createPolicy.profitLoss}
                  onChange={handleChange}
                  placeholder="Profit/Loss Amount"
                  readOnly
                />
              </div>

              <div className="flex flex-col p-1 mt-2 text-start w-full lg:w-1/4"></div>
              <div className="flex flex-col p-1 mt-2 text-start w-full lg:w-1/4"></div>
              <div className="mt-8 p-2 flex justify-center lg:w-full w-full">
                <button
                  className="text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-green-300 shadow-lg shadow-green-500/50 dark:shadow-lg font-medium rounded text-base px-4 py-2 text-center "
                  onClick={handleSubmit}
                  disabled={formSubmitted}
                  type="button"
                >
                  {formSubmitted ? "Submitted" : "Submit"}
                </button>
              </div>
            </div>
          </MultiStep>
        </div>
      </div>
    </section>
  );
}

export default MasterForm;
