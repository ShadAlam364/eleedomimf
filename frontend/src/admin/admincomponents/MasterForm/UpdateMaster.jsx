/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { State, City } from "country-state-city";
import axios from "axios";
import MultiStep from "react-multistep";
// import { SlArrowRightCircle, SlArrowLeftCircle } from "react-icons/sl";
import VITE_DATA from "../../../config/config.jsx";
function UpdateMaster({ insurance, onUpdate, onClose }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sit, setSit] = useState([]);
  const [ncbLists, setNcbLists] = useState([]);
  const [fuelType, setFuelType] = useState([]);
  const [pmade, setPmade] = useState([]);
  const [states, setStates] = useState([]);
  const [advLists, setAdvLists] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [cities, setCities] = useState([]);
  const [odList, setOdList] = useState([]);
  const [ccList, setCCList] = useState([]);
  const [pdata, setPdata] = useState([]);
  const [branchname, setBranchName] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedState, setSelectedState] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [selectedCity, setSelectedCity] = useState("");
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
    // Fetch and set states for India when component mounts
    const fetchStates = () => {
      const indiaStates = State.getStatesOfCountry("IN"); // Assuming "IN" is the country code for India
      setStates(indiaStates);
    };

    fetchStates();
  }, []);

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
  }, []);

  const [allDetails, setAllDetails] = useState({
    entryDate: "",
    states: "",
    district: "",
    company: "",
    category: "",
    segment: "",
    sourcing: "",
    policyNo: "",
    insuredName: "",
    contactNo: "",
    vehRegNo: "",
    policyStartDate: "",
    policyEndDate: "",
    odExpiry: "",
    tpExpiry: "",
    idv: "",
    bodyType: "",
    makeModel: "",
    mfgYear: "",
    registrationDate: "",
    vehicleAge: "",
    fuel: "",
    gvw: "",
    cc: "",
    engNo: "",
    chsNo: "",
    policyType: "",
    productCode: "",
    odPremium: "",
    liabilityPremium: "",
    netPremium: "",
    finalEntryFields: "",
    taxes: "",
    odDiscount: "",
    ncb: "",
    rsa: "",
    advisorName: "",
    advId: "",
    subAdvisor: "",
    policyMadeBy: "",
    branch: "",
    payoutOn: "",
    calculationType: "",
    policyPaymentMode: "",
    paymentDoneBy: "",
    chqNoRefNo: "",
    bankName: "",
    chqPaymentDate: "",
    chqStatus: "",
    advisorPayableAmount: "",
    branchpayoutper: "",
    cvpercentage: "",
    branchPayout: "",
    branchPayableAmount: "",
    companypayoutper: null,
    companyPayout: "",
    profitLoss: null,
  });

  useEffect(() => {
    axios
      .get(`${VITE_DATA}/staff/policy/lists`)
      .then((resp) => {
        const PolicyType = resp.data;

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
  }, []);

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
  }, []);
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
        .get(`${VITE_DATA}/employees/data`, {
          headers: {
            Authorization: `${token}`, // Send the token in the Authorization header
          },
        })
        .then((response) => {
          setPmade(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  // Function to update netPremium when odPremium or liabilityPremium changes
  const calculateAge = (mfgYear) => {
    if (!mfgYear) {
      return "0 years";
    }
  
    const currentYear = new Date().getFullYear();
    const birthYearInt = parseInt(mfgYear.toString(), 10);
  
    if (isNaN(birthYearInt) || birthYearInt > currentYear) {
      return "Invalid year";
    }
  
    let ageYears = currentYear - birthYearInt;
    return `${ageYears} years`;
  };

  const handlePolicyStartDateChange = (e) => {
    const startDate = e.target.value;
    const odExpiryDate = new Date(startDate);
    odExpiryDate.setFullYear(
      odExpiryDate.getFullYear() + 1,
      odExpiryDate.getMonth(),
      odExpiryDate.getDate() - 1
    );
    setAllDetails((prevDetails) => ({
      ...prevDetails,
      odExpiry: odExpiryDate.toISOString().split("T")[0],
    }));

    const policyEndDateValue = new Date(startDate);
    policyEndDateValue.setFullYear(
      policyEndDateValue.getFullYear() + 1,
      policyEndDateValue.getMonth(),
      policyEndDateValue.getDate() - 1
    );
    setAllDetails((prevDetails) => ({
      ...prevDetails,
      policyEndDate: policyEndDateValue.toISOString().split("T")[0],
    }));

    const tpExpiryDate = new Date(startDate);
    tpExpiryDate.setFullYear(
      tpExpiryDate.getFullYear() + 2,
      tpExpiryDate.getMonth(),
      tpExpiryDate.getDate() - 1
    );
    setAllDetails((prevDetails) => ({
      ...prevDetails,
      tpExpiry: tpExpiryDate.toISOString().split("T")[0],
    }));

    setAllDetails((prevDetails) => ({
      ...prevDetails,
      policyStartDate: startDate,
    }));
  };

  // show all data inside input tag
  useEffect(() => {
    setAllDetails(insurance);
  }, [insurance]);


  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    let updatedDetails = { [name]: value };
  
  
    // Return early if it's the first change (i.e., update only the changed field)
    // if (!allDetails || allDetails[name] === undefined) {
    //   setAllDetails((prevDetails) => ({ ...prevDetails, ...updatedDetails }));
    //   return;
    // }
    if (name === "selectedState") {
      if (value) {
        setSelectedState(value); // Update state
        updatedDetails.states = value; // Use value directly instead of selectedState
  
        try {
          const stateCities = City.getCitiesOfState("IN", value);
          setCities(stateCities); // Update cities dropdown
          setSelectedCity(""); // Reset selected city
          updatedDetails.selectedCity = ""; // Also reset in details
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      }
    }
  
    if (name === "selectedCity") {
      setSelectedCity(value);
      updatedDetails.district = value;
    }
  

    // Dependent calculations only after initial input update
    if (["odPremium", "liabilityPremium"].includes(name)) {
      const odPremiumValue = parseFloat(
        name === "odPremium" ? value : allDetails.odPremium
      ) || 0;
      const liabilityPremiumValue = parseFloat(
        name === "liabilityPremium" ? value : allDetails.liabilityPremium
      ) || 0;
  
      const newNetPremium = odPremiumValue + liabilityPremiumValue;
      updatedDetails.netPremium = newNetPremium.toFixed(2);
      
      // Update finalEntryFields when netPremium changes
      const taxesValue = parseFloat(allDetails?.taxes) || 0;
      const rsaValue = parseFloat(allDetails?.rsa) || 0;
      const finalAmountValue = newNetPremium + taxesValue + rsaValue;
  
      updatedDetails.finalEntryFields =
        allDetails?.company === "GO-DIGIT"
          ? finalAmountValue.toFixed(2)
          : finalAmountValue.toFixed(0);
    }
  
    // When netPremium changes, update finalEntryFields accordingly
    if (name === "netPremium") {
      const netPremiumValue = parseFloat(value) || 0;
      const taxesValue = parseFloat(allDetails?.taxes) || 0;
      const rsaValue = parseFloat(allDetails?.rsa) || 0;
      const finalAmountValue = netPremiumValue + taxesValue + rsaValue;
  
      updatedDetails.finalEntryFields =
        allDetails?.company === "GO-DIGIT"
          ? finalAmountValue.toFixed(2)
          : finalAmountValue.toFixed(0);
    }
  
    if (name === "taxes" || name === "rsa") {
      const netPremiumValue = parseFloat(allDetails?.netPremium) || 0;
      const taxesValue = parseFloat(name === "taxes" ? value : allDetails?.taxes) || 0;
      const rsaValue = parseFloat(name === "rsa" ? value : allDetails?.rsa) || 0;
      const finalAmountValue = netPremiumValue + taxesValue + rsaValue;
  
      updatedDetails.finalEntryFields =
        allDetails?.company === "GO-DIGIT"
          ? finalAmountValue.toFixed(2)
          : finalAmountValue.toFixed(0);
    }
  
    if (["branchPayout", "branchpayoutper", "companypayoutper", "companyPayout"].includes(name)) {
      const updatedCompanyPayout =
        name === "companyPayout"
          ? parseFloat(value)
          : parseFloat(allDetails.companyPayout || 0);
  
      const updatedBranchPayout =
        name === "branchPayout"
          ? parseFloat(value)
          : parseFloat(allDetails.branchPayout || 0);
  
      updatedDetails.profitLoss = Number(updatedCompanyPayout - updatedBranchPayout).toFixed(2);
  
      if (name === "companypayoutper") {
        const netPremiumValue = parseFloat(allDetails.netPremium) || 0;
        updatedDetails.companyPayout = Number((parseFloat(value) * netPremiumValue) / 100).toFixed(2);
        
      }
  
      if (name === "branchpayoutper") {
        const netPremiumValue = parseFloat(allDetails.netPremium) || 0;
        const branchPercent = (parseFloat(value) * netPremiumValue) / 100;
        updatedDetails.branchPayout = branchPercent.toFixed(2);
        updatedDetails.branchPayableAmount = (netPremiumValue - branchPercent).toFixed(2);
      }
     
    }
  
    if (name === "advId") {
      const advisorName = advLists.find((advisor) => advisor.uniqueId === value)?.advisorname || "";
      updatedDetails.advisorName = advisorName;
    }
    if(name === "mfgYear"){
      const updateVehAge =
        name === "mfgYear"
          ? parseFloat(value)
          : parseFloat(allDetails.mfgYear || 0);
          const vehAge = calculateAge(updateVehAge)
      updatedDetails.vehicleAge = vehAge;
    }
  
    // Update state with the new values
    setAllDetails((prevDetails) => ({ ...prevDetails, ...updatedDetails, } ));
  };
  
// This effect will recalculate profitLoss whenever branchPayout or companyPayout changes
useEffect(() => {
  if (allDetails?.branchPayout !== undefined && allDetails?.companyPayout !== undefined) {
    setAllDetails((prevDetails) => ({
      ...prevDetails,
      profitLoss: (parseFloat(prevDetails.companyPayout) - parseFloat(prevDetails.branchPayout)).toFixed(2),
    }));
  }
}, [allDetails?.branchPayout, allDetails?.companyPayout]);


  const updateInsuranceAPI = async () => {
    try {
      setLoading(true);
      // Use the selected category ID in the patch method
      const resp = await axios.put(
        `${VITE_DATA}/alldetails/updatedata/${insurance._id}`,
        allDetails
      );
      toast.success(`${resp.data.status}`);
      onClose(); // Close the modal after successful submission
      onUpdate();
    } catch (error) {
      console.error("Error updating insurance details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        id="static-modal"
        data-modal-backdrop="static"
        tabIndex="-1"
        aria-hidden="true"
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div className="relative w-full bg-blue-600 mx-auto rc-table-sticky-scroll-bar-active max-w-8xl rounded-md">
          <div className="flex items-center justify-between p-2 md:p-3">
            <h3 className="text-xl font-semibold text-gray-100">
              Update Policy Details
            </h3>
            <button
              onClick={onClose}
              type="button"
              className=" bg-transparent hover:bg-red-100 text-slate-100  text-sm w-8 h-8 ms-auto inline-flex justify-center items-center  "
            >
              <img
                src="/close.png"
                height={5}
                width={25}
                alt="close"
                className="hover:bg-red-100 rounded-full"
              />
            </button>
          </div>

          {/* <!-- Modal body --> */}
          <section className="p-1">
            <div className="relative w-full lg:w-full p-4 lg:p-1 rounded shadow-xl text-2xl items-center bg-slate-200">
              <MultiStep
                activeStep={0}
                showNavigation={true}
                className="bg-blue-500 rounded shadow-md flex justify-between  overflow-hidden"
                stepCustomStyle={{
                  display: "none",
                  width: "50%",
                  marginBottom: "0",
                }}
                titleCustomStyle={{ fontWeight: "bold", color: "blue" }}
                contentCustomStyle={{ color: "sky" }}
                prevButton={{
                  title: (
                    <span className="flex justify-center my-auto text-xl text-center hover:bg-red-600">
                      Back
                    </span>
                  ),
                  style: {
                    display: "inline",
                    width: "max-content",
                    textAlign: "center",
                    background: "red",
                    color: "white",
                    fontWeight: "",
                    borderRadius: "0.3rem",
                    padding: "0rem 0.6rem",
                    border: "none",
                    cursor: "pointer",
                    boxShadow:
                      "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)",
                    transition: "background 1.3s ease",
                    marginRight: "auto", // Adjusted to marginRight auto
                    marginBottom: "auto",
                    float: "left",
                  },
                }}
                nextButton={{
                  title: <span className="flex justify-end text-xl">Next</span>,
                  style: {
                    display: "inline",
                    width: "max-content",
                    textAlign: "center",
                    background: "green",
                    color: "white",
                    fontWeight: "",
                    borderRadius: "0.3rem",
                    padding: "0rem 0.6rem",
                    border: "none",
                    cursor: "pointer",
                    boxShadow:
                      "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)",
                    transition: "background 1.3s ease",
                    marginRight: "auto", // Adjusted to marginRight auto
                    marginBottom: "auto",
                    float: "right",
                  },
                }}
              >
                <div className="flex flex-wrap justify-between text-lg gap-5 mx-2 mb-12">
                  <label className="flex flex-col">
                    Entry Date
                    <input
                      className="rounded"
                      type="date"
                      value={allDetails.entryDate}
                      onChange={handleInputChange}
                      name="entryDate"
                    />
                  </label>

                  <label className="flex flex-col pb-6">
                    Branch
                    <select
                      id="branch"
                      className=" rounded py-1.5 ps-2"
                      value={allDetails.branch}
                      onChange={handleInputChange}
                      name="branch"
                    >
                      <option className="">Select Branch</option>
                      {branchname.map((item) => (
                        <option value={item.branchname} key={item._id}>
                          {item.branchname}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col">
                    Insured Name
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.insuredName}
                      onChange={handleInputChange}
                      name="insuredName"
                    />
                  </label>

                  <label className="flex flex-col">
                    Contact No
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.contactNo}
                      onChange={handleInputChange}
                      name="contactNo"
                      placeholder="Enter Contact No"
                    />
                  </label>

                  <label className="flex flex-col">
                    Policy Made By
                    <select
                      className="py-1.5 rounded ps-2 w-60"
                      value={allDetails.staffName}
                      onChange={handleInputChange}
                      name="staffName"
                    >
                      <option className="w-1" value="">
                        {" "}
                        Policy Made By{" "}
                      </option>
                      {pmade
                        .filter(
                          (emp) =>
                            (emp.staffType === "OPS Executive") |
                            (emp.staffType === "OPS EXECUTIVE")
                        )
                        .map((emp) => (
                          <option key={emp._id} value={emp.empname}>
                            {emp.empid} - {emp.empname}
                          </option>
                        ))}
                    </select>
                  </label>

                  <label className="flex flex-col">
                    Company Name
                    <select
                      className="ps-2 py-1.5 rounded"
                      value={allDetails.company}
                      onChange={handleInputChange}
                      name="company"
                    >
                      <option className="w-1" value="">
                        {" "}
                        Select Company{" "}
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
                  </label>

                  <label className="flex flex-col mb-6">
                    Category
                    <select
                      className="py-1.5 ps-2 rounded"
                      value={allDetails.category}
                      onChange={handleInputChange}
                      name="category"
                    >
                      {" "}
                      <option className="w-1" value="">
                        {" "}
                        Select Category{" "}
                      </option>
                      <option value="GIC">GIC</option>
                      {/* <option value="LIFE">LIFE</option> */}
                    </select>
                  </label>

                  <label className="flex flex-col">
                    Policy Type
                    <select
                      className="py-1.5 ps-2 rounded"
                      value={allDetails.policyType}
                      name="policyType"
                      // onChange={(e) => setPolicyType(e.target.value)}
                      onChange={handleInputChange}
                    >
                      {" "}
                      <option value=""> Select Policy Type </option>
                      {data.map((prod) => (
                        <option key={prod._id} value={prod.p_type}>
                          {prod.p_type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col">
                    Product Code
                    <select
                      id="productCode"
                      className="py-1.5 ps-2 rounded"
                      value={allDetails.productCode}
                      onChange={handleInputChange}
                      name="productCode"
                    >
                      <option className="w-1" value="">
                        {" "}
                        Select Product Code{" "}
                      </option>

                      {data.map((policy) => {
                        if (policy.p_type === allDetails.policyType) {
                          return policy.products.map((product, idx) => (
                            <option key={idx} value={product}>
                              {product}
                            </option>
                          ));
                        }
                        return null;
                      })}
                    </select>
                  </label>

                  <label className="flex flex-col">
                    Policy No
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.policyNo}
                      onChange={handleInputChange}
                      name="policyNo"
                      placeholder="Enter Policy No"
                    />
                  </label>

                  <label className="flex flex-col">
                    Segment
                    <select
                      className="py-1.5 ps-2 rounded"
                      value={allDetails.segment}
                      onChange={handleInputChange}
                      name="segment"
                    >
                      <option className="w-1" value="">
                        {" "}
                        Select Segment{" "}
                      </option>
                      <option value="C V">C V</option>
                      <option value="PVT-CAR">PVT-CAR</option>
                      <option value="TW">TW</option>
                      <option value="HEALTH">HEALTH</option>
                      <option value="NON-MOTOR">NON-MOTOR</option>
                      {/* <option value="LIFE">LIFE</option> */}
                    </select>
                  </label>

                  <label className="flex flex-col mb-6">
                    State
                    <select
                      className="py-1.5 ps-2 rounded w-60"
                      name="selectedState"
                      value={allDetails.selectedState}
                      onChange={handleInputChange}
                    >
                      <option value=""> Select State </option>
                      {states.map((state) => (
                        <option key={state?.isoCode} value={state?.isoCode}>
                          {state?.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col">
                    District
                    {
                      // selectedCity ? (
                      <select
                        className="p-1.5 ps-2 rounded"
                        name="selectedCity"
                        id="selectedCity"
                        value={allDetails.selectedCity}
                        onChange={handleInputChange}
                        disabled={!allDetails?.states} 
                      >
                        <option value=""> Select District </option>
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
                  </label>

                  <label className="flex flex-col">
                    Vehicle Reg No
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.vehRegNo}
                      onChange={handleInputChange}
                      name="vehRegNo"
                      placeholder="Enter Vehicle Reg No"
                    />
                  </label>

                  {/* FIELD - 20 */}

                  <label className="flex flex-col">
                    Fuel
                    <select
                      className="p-1.5 ps-2 rounded"
                      value={allDetails.fuel}
                      onChange={handleInputChange}
                      name="fuel"
                    >
                      <option className="w-1" value="">
                        {" "}
                        Select Fuel Type{" "}
                      </option>
                      {fuelType.map((fuel) => (
                        <option key={fuel._id} value={fuel.fuels}>
                          {fuel.fuels}
                        </option>
                      ))}
                    </select>
                  </label>
                  {/* <div className="flex flex-col p-1 mt-3 text-start w-full lg:w-1/5">
                          <label className="flex flex-col">CC:<span className="text-red-600 font-bold">*</span></label>
                          <select
                            className="p-1 text-base  rounded-lg"
                            type="text"
                            name="cc"
                            value={allDetails.cc}
                            onChange={handleInputChange}
                            placeholder="Enter CC">
                            <option className="" value="" >-------------- Select CC -------------</option>
                            {
                              ccList.map((data) => (
                                <option key={data._id} value={data.cc}>{data.cc}</option>
                              ))
                            }
                          </select>
                        </div> */}
                  {allDetails.segment === "PVT-CAR" ||
                  allDetails.segment === "TW" ? (
                    <label className="flex flex-col">
                      CC
                      <select
                        className="rounded"
                        type="text"
                        name="cc"
                        value={allDetails.cc}
                        onChange={handleInputChange}
                        placeholder="Enter CC"
                      >
                        <option className="w-1" value="">
                          Select CC{" "}
                        </option>
                        {ccList.map((data) => (
                          <option key={data._id} value={data.cc}>
                            {data.cc}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <label className="flex flex-col">
                      CC
                      <select
                        className="ps-2 rounded"
                        type="text"
                        name="cc"
                        value={allDetails.cc}
                        onChange={handleInputChange}
                        placeholder="Enter CC"
                        disabled
                      >
                        <option className="w-1" value="">
                          {" "}
                          Select CC{" "}
                        </option>
                        {ccList.map((data) => (
                          <option key={data._id} value={data.cc}>
                            {data.cc}
                          </option>
                        ))}
                      </select>
                      <span className="text-red-600 text-sm">Disabled</span>
                    </label>
                  )}

                  <label className="flex flex-col">
                    Engine No
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.engNo}
                      onChange={handleInputChange}
                      name="engNo"
                      placeholder="Enter Engine No"
                    />
                  </label>

                  <label className="flex flex-col mb-6">
                    Chassis No
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.chsNo}
                      onChange={handleInputChange}
                      name="chsNo"
                      placeholder="Enter Chassis No"
                    />
                  </label>
                  {allDetails.segment === "C V" ? (
                    <label className="flex flex-col">
                      GVW (kg)
                      <input
                        className=" rounded"
                        type="text"
                        value={allDetails.gvw}
                        onChange={handleInputChange}
                        placeholder="Enter GVW"
                        name="gvw"
                      />
                    </label>
                  ) : (
                    <label className="flex flex-col">
                      GVW (kg):
                      <input
                        className="rounded"
                        type="text"
                        value={allDetails.gvw}
                        onChange={handleInputChange}
                        name="gvw"
                        placeholder="Disabled"
                        disabled
                      />
                    </label>
                  )}

                  {allDetails.segment === "C V" &&
                  (allDetails.productCode === "SCHOOL BUS" ||
                    allDetails.productCode === "ROUTE BUS" ||
                    allDetails.productCode === "TAXI") ? (
                    <label className="flex flex-col ">
                      Seating Capacity
                      <select
                        className="py-1.5 ps-2 rounded"
                        type="text"
                        value={allDetails.sitcapacity}
                        onChange={handleInputChange}
                        name="sitcapacity"
                        placeholder="Enter Sitting Capacity"
                      >
                        <option value=""> Select Seating Capacity </option>
                        {sit &&
                          sit.map((data) => (
                            <option key={data._id} value={data.sitcapacity}>
                              {data.sitcapacity}
                            </option>
                          ))}
                        {/* <option value="">NOT APPLICABLE</option> */}
                      </select>
                    </label>
                  ) : (
                    <label className="flex flex-col ">
                      Seating Capacity
                      <select
                        className="py-1.5 ps-2 rounded"
                        type="text"
                        value={allDetails.sitcapacity}
                        onChange={handleInputChange}
                        name="sitcapacity"
                        placeholder="Disabled"
                        disabled
                      >
                        <option value=""> Select Seating Capacity </option>
                        {sit &&
                          sit.map((data) => (
                            <option key={data._id} value={data.sitcapacity}>
                              {data.sitcapacity}
                            </option>
                          ))}
                        {/* <option value="">NOT APPLICABLE</option> */}
                      </select>
                    </label>
                  )}
                  <label className="flex flex-col">
                    Sourcing
                    <select
                      className="py-1.5 ps-2 rounded"
                      value={allDetails.sourcing}
                      onChange={handleInputChange}
                      name="sourcing"
                    >
                      <option className="w-1" value="">
                        {" "}
                        Select Sourcing Type{" "}
                      </option>
                      <option value="NEW">NEW</option>
                      <option value="RENEWAL">RENEWAL</option>
                      <option value="ROLL OVER">ROLL OVER</option>
                    </select>
                  </label>
                  <label className="flex flex-col">
                    Policy Start Date
                    <input
                      className="rounded"
                      type="date"
                      name="policyStartDate"
                      value={allDetails.policyStartDate}
                      onChange={handlePolicyStartDateChange}
                    />
                  </label>
                  <label className="flex flex-col ">
                    Policy End Date
                    <input
                      className="rounded"
                      type="date"
                      value={allDetails.policyEndDate}
                      onChange={handleInputChange}
                      name="policyEndDate"
                      placeholder="Select Policy End Date"
                    />
                  </label>
                  <label className="flex flex-col">
                    OD Expiry
                    <input
                      className="rounded"
                      type="date"
                      value={allDetails.odExpiry}
                      onChange={handleInputChange}
                      name="odExpiry"
                      placeholder="Select OD Expiry"
                      min="2025-01-01"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap justify-between text-lg gap-5 mx-2 mb-12">
                  <label className="flex flex-col">
                    TP Expiry
                    <input
                      className="rounded"
                      type="date"
                      value={allDetails.tpExpiry}
                      onChange={handleInputChange}
                      name="tpExpiry"
                      min="2025-01-01"
                    />
                  </label>

                  <label className="flex flex-col">
                    IDV
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.idv}
                      onChange={handleInputChange}
                      name="idv"
                      placeholder="Enter IDV"
                    />
                  </label>

                  <label className="flex flex-col">
                    Body Type
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.bodyType}
                      onChange={handleInputChange}
                      name="bodyType"
                      placeholder="Enter Body Type"
                    />
                  </label>

                  <label className="flex flex-col">
                    Make & Model
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.makeModel}
                      onChange={handleInputChange}
                      name="makeModel"
                    />
                  </label>
                  <label className="flex flex-col mb-4">
                    Manufacturing Year
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.mfgYear}
                      onChange={handleInputChange}
                      name="mfgYear"
                      placeholder="Enter Manufacturing Year"
                    />
                  </label>

                  <label className="flex flex-col">
                    Registration Date
                    <input
                      className="rounded"
                      type="date"
                      value={allDetails.registrationDate}
                      onChange={handleInputChange}
                      name="registrationDate"
                      placeholder="Select Registration Date"
                      min="1950-01-01"
                      // max={getLastDayOfPreviousMonth()}
                    />
                  </label>
                  <label className="flex flex-col">
                    Vehicle Age
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.vehicleAge}
                      name="vehicleAge"
                      readOnly
                    />
                  </label>

                  {insurance.policyType === "SATP" ? (
                    <label className="flex flex-col">
                      OD Premium
                      <input
                        className="rounded"
                        type="number"
                        value={allDetails.odPremium}
                        onChange={handleInputChange}
                        placeholder="Disabled"
                        name="odPremium"
                        // onBlur={updateNetPremium}
                        disabled
                      />
                    </label>
                  ) : (
                    <label className="flex flex-col">
                      OD Premium
                      <input
                        className="rounded"
                        type="number"
                        value={allDetails.odPremium}
                        onChange={handleInputChange}
                        name="odPremium"
                        placeholder="Enter OD Premium"
                        // onBlur={updateNetPremium}
                      />
                    </label>
                  )}

                  {allDetails.policyType === "SAOD" ? (
                    <label className="flex flex-col">
                      Liability Premium:
                      <input
                        className="rounded"
                        type="number"
                        value={allDetails.liabilityPremium}
                        onChange={handleInputChange}
                        placeholder="Disabled"
                        // onBlur={updateNetPremium}
                        name="liabilityPremium"
                        disabled
                      />
                    </label>
                  ) : (
                    <label className="flex flex-col">
                      Liability Premium:
                      <input
                        className="rounded"
                        type="number"
                        value={allDetails.liabilityPremium}
                        onChange={handleInputChange}
                        // onBlur={updateNetPremium}
                        name="liabilityPremium"
                      />
                    </label>
                  )}

                  <label className="flex flex-col mb-4">
                    Net Premium
                    <input
                      className="rounded"
                      type="number"
                      value={allDetails.netPremium}
                      // onBlur={handleNetPremiumBlur}
                      name="netPremium"
                      placeholder="Net Premium"
                      readOnly
                    />
                    <span className="mx-1 text-xs text-green-600">
                      (odPremium + liabilityPremium)
                    </span>
                  </label>

                  <label className="flex flex-col">
                    GST
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.taxes}
                      onChange={handleInputChange}
                      // onBlur={calculateFinalAmount}
                      name="taxes"
                      placeholder="GST"
                    />
                  </label>

                  <label className="flex flex-col">
                    RSA
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.rsa}
                      onChange={handleInputChange}
                      // onBlur={calculateFinalAmount}
                      name="rsa"
                      placeholder="RSA"
                    />
                  </label>

                  <label className="flex flex-col">
                    Final Amount
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.finalEntryFields}
                      onChange={handleInputChange}
                      name="finalEntryFields"
                      placeholder=" Final Amount"
                      readOnly
                    />
                  </label>
                  <label className="flex flex-col">
                    OD Discount%:
                    <select
                      className="py-1.5 ps-2 rounded"
                      type="text"
                      name="odDiscount"
                      value={allDetails.odDiscount}
                      onChange={handleInputChange}
                      placeholder="Enter OD Discount"
                    >
                      <option className="w-1" value="">
                        Select OD Discount
                      </option>
                      {odList.map((data) => (
                        <option key={data._id} value={data.odDiscount}>
                          {data.odDiscount}%{" "}
                        </option>
                      ))}
                    </select>
                  </label>

                  {allDetails.segment === "PVT-CAR" ? (
                    <label className="flex flex-col">
                      NCB%
                      <select
                        className="py-1.5 ps-2 rounded"
                        type="text"
                        name="ncb"
                        value={allDetails.ncb}
                        onChange={handleInputChange}
                      >
                        <option className="w-1" value="">
                          Select NCB
                        </option>
                        {ncbLists.map((data) => (
                          <option key={data._id} value={data.ncb}>
                            {data.ncb}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <label className="flex flex-col">
                      NCB%:
                      <select
                        className="py-1.5 ps-2 rounded"
                        type="text"
                        name="ncb"
                        value={allDetails.ncb}
                        onChange={handleInputChange}
                        disabled
                      >
                        <option className="w-1" value="">
                          Select NCB
                        </option>
                        {ncbLists.map((data) => (
                          <option key={data._id} value={data.ncb}>
                            {data.ncb}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  <label className="flex flex-col">
                    Policy Payment Mode:
                    <select
                      id="policyPaymentMode"
                      className="py-1.5 ps-2 rounded w-60"
                      value={allDetails.policyPaymentMode}
                      onChange={handleInputChange}
                      name="policyPaymentMode"
                    >
                      <option className="w-1" value="">
                        Select Policy Payment Mode
                      </option>
                      <option value="LINK">LINK</option>
                      <option value="ONLINE">ONLINE</option>
                      <option value="CREDIT CARD">CREDIT CARD</option>
                      <option value="NET BANKING">NET BANKING</option>
                      <option value="CHQ">CHQ</option>
                      <option value="CUSTOMER LINK">CUSTOMER LINK</option>
                      <option value="FLOAT PAYMENT">FLOAT PAYMENT</option>
                      <option value="UPI">UPI</option>
                      <option value="QR SCAN">QR SCAN</option>
                      <option value="DD">DD</option>
                      <option value="NEFT">NEFT</option>
                      <option value="RTGS">RTGS</option>
                    </select>
                  </label>
                  <label className="flex flex-col">
                    Advisor Name
                    <select
                      className="py-1.5 ps-2 rounded w-60 mb-6"
                      type="text"
                      value={allDetails.advId}
                      onChange={handleInputChange}
                      name="advId"
                      placeholder="Enter Advisor Name"
                    >
                      <option value="data">Select Advisor</option>
                      {advLists
                        .filter((emp) => emp.branch[0] === allDetails.branch)
                        .sort((a, b) =>
                          a.advisorname.localeCompare(b.advisorname)
                        )
                        .map((data) => (
                          <option
                            key={data._id}
                            value={data.uniqueId}
                          >{`${data.uniqueId} --> ${data.branch[0]}  -->  ${data.advisorname}  --> ${data.advisoraddress}`}</option>
                        ))}
                    </select>
                  </label>
                  {/* <label className="flex flex-col">
                    Advisor Payout %
                    <input
                      className="rounded"
                      type="number"
                      value={allDetails.cvpercentage}
                      onChange={handleInputChange}
                      name="cvpercentage"
                      // onBlur={() => {
                        calculateBranchPayableAmount();
                        calculateProfitLoss();
                      }}
                      placeholder="Advisor Payout %"
                    />
                  </label> */}
                  <label className="flex flex-col">
                    Payout On
                    <select
                      id="payoutOn"
                      className="py-1.5 ps-2 rounded"
                      value={allDetails.payoutOn}
                      onChange={handleInputChange}
                      name="payoutOn"
                    >
                      <option className="w-1" value="">
                        Select Payout on
                      </option>
                      <option value="NET">NET</option>
                      <option value="OD">OD</option>
                      <option value="LIABILITY">LIABILITY</option>
                    </select>
                  </label>
                  <label className="flex flex-col">
                    Advisor Payable Amount:
                    <input
                      className="rounded"
                      type="number"
                      value={allDetails.advisorPayableAmount}
                      onChange={handleInputChange}
                      name="advisorPayableAmount"
                      placeholder="Advisor Payable Amount"
                    />{" "}
                  </label>
                  <label className="flex flex-col">
                    Branch Payout %
                    <input
                      className="rounded"
                      type="number"
                      value={allDetails.branchpayoutper}
                      onChange={handleInputChange}
                      name="branchpayoutper"
                      // onBlur={() => {
                      //   calculateBranchPayableAmount();
                      //   calculateProfitLoss();
                      // }}
                      placeholder="Branch Payout %"
                    />
                  </label>
                  <label className="flex flex-col">
                    Branch Payout
                    <input
                      className="rounded"
                      type="number"
                      value={allDetails.branchPayout}
                      onChange={handleInputChange}
                      name="branchPayout"
                      // onBlur={() => {
                      //   calculateBranchPayableAmount();
                      //   calculateProfitLoss();
                      // }}
                      placeholder="Enter Branch Payout"
                    />
                  </label>
                  <label className="flex flex-col mb-4">
                    Branch Payable Amount:{" "}
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.branchPayableAmount}
                      onChange={handleInputChange}
                      name="branchPayableAmount"
                      placeholder="Branch Payable Amount"
                      readOnly
                    />
                    <span className="text-xs mx-1 text-red-600">
                      (finalAmount - branchpayout)
                    </span>
                  </label>
                </div>

                <div className="flex flex-wrap justify-between text-lg gap-5 mx-2">
                  <label className="flex flex-col">
                    Company Payout %
                    <input
                      className="rounded"
                      type="number"
                      value={allDetails.companypayoutper}
                      onChange={handleInputChange}
                      name="companypayoutper"
                      // onBlur={() => {
                      //   calculateBranchPayableAmount();
                      //   calculateProfitLoss();
                      // }}
                      placeholder="Company Payout %"
                    />
                  </label>
                  <label className="flex flex-col">
                    Company Payout
                    <input
                      className="rounded"
                      type="number"
                      value={allDetails.companyPayout}
                      onChange={handleInputChange}
                      name="companyPayout"
                      // onBlur={calculateProfitLoss}
                      placeholder="Enter Company Payout"
                    />
                  </label>

                  <label className="flex flex-col">
                    Profit/Loss Amount
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.profitLoss}
                      onChange={handleInputChange}
                      name="profitLoss"
                      placeholder="Profit/Loss"
                      readOnly
                    />
                    <span className="text-xs mx-1 text-red-600">
                      (companypayout - branchpayout)
                    </span>
                  </label>
                  {/* FIELD - 40 */}

                  <label className="flex flex-col">
                    Payment Done By
                    <select
                      className="py-1.5 ps-2 rounded"
                      value={allDetails.paymentDoneBy}
                      onChange={handleInputChange}
                      name="paymentDoneBy"
                    >
                      <option className="w-1" value="">
                        Select Payment Done By
                      </option>
                      <option value="ELEEDOM IMF PVT LTD">
                        ELEEDOM IMF PVT LTD
                      </option>
                      <option value="HAJIPUR BRANCH">HAJIPUR BRANCH</option>
                      <option value="SAMASTIPUR BRANCH">
                        SAMASTIPUR BRANCH
                      </option>
                      <option value="PATNA BRANCH">PATNA BRANCH</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                    </select>
                  </label>

                  <label className="flex flex-col">
                    CHQ No / Ref No
                    <input
                      className="rounded"
                      type="text"
                      value={allDetails.chqNoRefNo}
                      onChange={handleInputChange}
                      name="chqNoRefNo"
                      placeholder="Enter CHQ No / Ref No."
                    />
                  </label>

                  <label className="flex flex-col">
                    Bank Name
                    <select
                      id="bankName"
                      className="py-1.5 ps-2 rounded"
                      value={allDetails.bankName}
                      onChange={handleInputChange}
                      name="bankName"
                    >
                      <option className="" value="">
                        Select Bank
                      </option>
                      <option value="HDFC BANK">HDFC BANK</option>
                      <option value="ICICI BANK">ICICI BANK</option>
                      <option value="SBI">SBI</option>
                      <option value="PNB">PNB</option>
                      <option value="CANARA">CANARA</option>
                      <option value="AXIS BANK">AXIS BANK</option>
                      <option value="BOB">BOB</option>
                      <option value="BOI">BOI</option>
                      <option value="IDBI">IDBI</option>
                    </select>
                  </label>
                  {/* FIELD - 43 */}

                  <label className="flex flex-col">
                    CHQ / Payment Date
                    <input
                      className="rounded"
                      type="date"
                      value={allDetails.chqPaymentDate}
                      onChange={handleInputChange}
                      name="chqPaymentDate"
                      placeholder="Select CHQ / Payment Date"
                    />
                  </label>

                  {/* FIELD - 44 */}

                  <label className="flex flex-col">
                    CHQ Status
                    <select
                      className="py-1.5 ps-2 rounded"
                      value={allDetails.chqStatus}
                      onChange={handleInputChange}
                      name="chqStatus"
                    >
                      <option className="w-1" value="">
                        Select CHQ Status
                      </option>
                      <option value="PENDING">PENDING</option>
                      <option value="SUBMITTED TO BRANCH">
                        SUBMITTED TO BRANCH
                      </option>
                      <option value="CLEAR FROM BANK">CLEAR FROM BANK</option>
                      <option value="BCQ">BCQ</option>
                      <option value="SUBMITTED TO BANK">
                        SUBMITTED TO BANK
                      </option>
                    </select>
                  </label>
                  <div className="flex flex-col p-1 text-start w-full lg:w-1/5"></div>
                  <div className="flex flex-col p-1 text-start w-full lg:w-1/5"></div>
                  <div className="flex flex-col p-1 text-start w-full lg:w-1/5"></div>
                  <div className="flex flex-col p-1 text-start w-full lg:w-1/5"></div>

                  <div className="mt-8 p-2 flex justify-center lg:w-full w-full">
                    <button
                      className="text-white  bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded text-sm px-4 py-2 text-center"
                      onClick={updateInsuranceAPI}
                      type="button"
                    >
                      {" "}
                      {loading ? "Submitting..." : "Submit"}{" "}
                    </button>
                  </div>
                </div>
              </MultiStep>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
export default UpdateMaster;
