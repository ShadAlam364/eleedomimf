import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import VITE_DATA from "../../../config/config.jsx";
function Ledger1() {
  let balance = 0;
  const [data, setData] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    advisorName: "",
    policyNo: "",
    insuredName: "",
    fromDate: "",
    toDate: ""
  });
  // console.log(data);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${VITE_DATA}/alldetails/view/policies`);
      const responseData = response.data; // Assuming data is stored in response.data
      setData(responseData.allList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get(`${VITE_DATA}/alldetails/view/policies`);
    //     const responseData = response.data; // Assuming data is stored in response.data
    //     setData(responseData.allList);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
    fetchData();
  }, []);

 

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    // const branch = sessionStorage.getItem("name");
    if (!token) {
      toast.error("Not Authorized yet.. Try again! ");
    } else {
      // The user is authenticated, so you can make your API request here.
      axios
        .get(`${VITE_DATA}/advisor/lists`, {
          headers: {
            Authorization: `${token}`, // Send the token in the Authorization header
          },
        })
        .then((response) => {
          const adv = response.data.filter((advisr)=> advisr.advisortype === "DAILY")
          setAdvisors(adv);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const handleFilter = () => {
    let filteredData = data.filter((item) => {
     
      let match = true;
      if (
        filterOptions.advisorName &&
        !item.advisorName?.includes(filterOptions.advisorName)
      ) {
        match = false;

      }
      else if (
        filterOptions.policyNo &&
        !item.policyNo?.includes(filterOptions.policyNo)
      ) {
        match = false;
      }
      else if (
        filterOptions.insuredName &&
        !item.insuredName.toLowerCase().includes(filterOptions.insuredName.toLowerCase())
      ) {
        match = false;
      }
      else if (
        filterOptions.fromDate &&
        new Date(item.entryDate) < new Date(filterOptions.fromDate)
      ) {
        match = false;
      }
      if (
        filterOptions.toDate &&
        new Date(item.entryDate) > new Date(filterOptions.toDate)
      ) {
        match = false;
      }
      return match;
    });
    setFilteredData(filteredData);
  };
  

  const clearFilters = () => {
    setFilterOptions({
      advisorName: "",
      policyNo: "",
      insuredName: "",
      fromDate: "",
      toDate: ""
    });
    setFilteredData([]);
  };

  // Function to handle credit input change for a specific item
  const handleCreditChange = (itemId, value) => {
    setFilteredData(prevData =>
      prevData.map(item =>
        item._id === itemId ? { ...item, creditAmount: value, } : item
      )
    );
  };

  // Function to handle credit input change for a specific item
  const handleDatesChange = (itemId, value) => {
    setFilteredData(prevData =>
      prevData.map(item =>
        item._id === itemId ? { ...item, paymentDate: value, } : item
      )
    );
  };

  const handlePayTypeChange = (itemId, value) => {
    setFilteredData(prevData =>
      prevData.map(item =>
        item._id === itemId ? { ...item, paymentType: value, } : item
      )
    );
  };

  const handlePayRefChange = (itemId, value) => {
    setFilteredData(prevData =>
      prevData.map(item =>
        item._id === itemId ? { ...item, paymentRefNo: value, } : item
      )
    );
  };

  const uniqueNames = [...new Set(data.map(api => api.insuredName))];

  // const uniqueAdvisor = [...new Set(data.map(data=> data.advisorName))];

  const isFilterApplied = () => {
    return Object.values(filterOptions).some(option => option !== "");
  };

  const handleSubmit = async () => {
    try {
      const modifiedData = filteredData.filter(item => (
        item.paymentDate || item.paymentType || item.paymentRefNo || item.creditAmount
      ));

      if (modifiedData.length === 0) {
        toast.info("Please make changes to submit.");
        return;
      }

      let totalBalance = 0; // Initialize totalBalance outside of the loop
      let debitAmount = 0;
      const dataToSave = modifiedData.map(item => {
        // Calculate debitAmount for each item
        const currentYear = new Date().getFullYear();
        const startDate = new Date(`${currentYear}-01-01`);
        const endDate = new Date(`${currentYear}-12-31`);
        const entryDate = new Date(item.entryDate);
        if (entryDate >= startDate && entryDate <= endDate ) {
          debitAmount = parseFloat(item.finalEntryFields - (item.advisorPayoutAmount || 0)).toFixed(0);
        }
        // Get paymentDate, paymentType, paymentRefNo, and creditAmount from item
        const paymentDate = item.paymentDate || '';
        const paymentType = item.paymentType || '';
        const paymentRefNo = item.paymentRefNo || '';
        const creditAmount = parseFloat(item.creditAmount) || 0;
        const debit = parseFloat(debitAmount);
        // Calculate balance for each item
        const balance = (totalBalance + parseInt(debitAmount, 10) - parseInt(creditAmount, 10)).toFixed(0);
        // Update totalBalance for the next iteration
        totalBalance = parseInt(balance, 10);

        // Return the modified item with updated fields
        return {
          _id: item._id,
          advId: item.advId,
          insuredName: item.insuredName,
          advisorName: item.advisorName,
          policyNo: item.policyNo,
          entryDate: item.entryDate,
          debitAmount: debit,
          paymentDate,
          paymentType,
          paymentRefNo,
          creditAmount:parseFloat(item.creditAmount) || 0,
          balance: totalBalance,
        };
      });

      // Send POST request to backend API
      const response = await axios.put(`${VITE_DATA}/leger/daily/update`, dataToSave);
     
      // Check if the response status is 200
      if (response.status === 200) {
        // console.log(response.data);
        toast.success(`${response.data.message}`);
        fetchData();
      }
      // Optionally, you can clear filtered data after submission
      setFilteredData([]);
    } catch (error) {
      console.error('Error saving data:', error.response.data.message);
      // Display an error toast message
      toast.error(`${error.response ? error.response.data.message : error.message}`);
    }
  }

  function getCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
  
    return dd + '-' + mm + '-' + yyyy;
  }
  
  const currentDate = getCurrentDate();

  const exportToExcel = () => {
    try {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      const fileName = `${currentDate}_Daily_Leger`;
      // Map all data without filtering by current date
      const dataToExport = filteredData.map((row) => {
        return [
          row.entryDate,
          row.policyNo,
          row.company,
          row.insuredName,
          row.finalEntryFields,
          row.advisorPayoutAmount,
          row.debitAmount,
          row.paymentDate,
          row.paymentType,
          row.paymentRefNo,
          row.creditAmount,
          row.balance
        ];
      });
      // Get all table headers in the same order
      const tableHeaders = [
        "Entry Date",
        "Policy No",
        "Company",
        "Insured Name",
        "Final Premium",
        "Payout",
        "DR",
        "Payment Date",
        "Payment Type",
        "Payment Ref. No",
        "CR",
        "Balance"
      ];
      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet([tableHeaders, ...dataToExport]);
      // Create workbook and export
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], { type: fileType });
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName + fileExtension);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Error exporting to Excel");
    }
  };
  const handleExportClick = () => {
    exportToExcel();
  };

// console.log(filterOptions.advisorName);
  return (
    <section className="container-fluid relative  p-0 sm:ml-48 bg-white">
      <div className="container-fluid flex justify-center flex-col border-gray-200 border-dashed rounded dark:border-gray-700 bg-white">
        <div className="flex justify-between">
          <h1></h1>
        <h1 className="font-semibold my-auto text-3xl mb-2 text-blue-700">Daily Leger</h1>
        <button
          className=" text-white my-auto font-medium rounded-full text-base px-3 py-1 text-center"
          onClick={handleExportClick}
          type="button"
        >
         <img src="/excel.png" alt="download" className="w-12" />
        </button></div> 
        <div className="relative w-full lg:w-full p-0 rounded shadow-xl text-2xl items-center bg-slate-200">
          <div className="flex justify-between flex-col">
            <div className="flex  justify-evenly my-4">
              <input
                type="date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-1/6 ps-2 p-1"
                placeholder="From Date"
                value={filterOptions.fromDate}
                onChange={(e) =>
                  setFilterOptions({ ...filterOptions, fromDate: e.target.value })
                }
              />
              <input
                type="date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-1/6 ps-2 p-1"
                placeholder="To Date"
                value={filterOptions.toDate}
                onChange={(e) =>
                  setFilterOptions({ ...filterOptions, toDate: e.target.value })
                }
              /><span className="text-sm my-auto">OR</span>
              <select
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-1/6 ps-2 p-1"
                placeholder="Advisor Name"
                value={filterOptions.advisorName}
                onChange={(e) => {
                  clearFilters(); // Clear other filters
                  setFilterOptions({ ...filterOptions, advisorName: e.target.value });
                }}
              >
                <option value="">-------- Select Advisor ----------</option>
                {advisors
                  .sort((a, b) => {
                    // Check if both a.branch and b.branch are strings before comparing
                    if (typeof a.branch === 'string' && typeof b.branch === 'string') {
                      return a.branch.localeCompare(b.branch);
                    } else {
                      // If one or both of them are not strings, return 0 to maintain the order
                      return 0;
                    }
                  })
                  .map((api, index) => (
                    <option
                      className={`${api.branch ? "font-semibold" : ""}`}
                      key={index}
                      value={api.advisorname}
                    >{`${api.branch} --  -- ${api.advisorname}`}</option>
                  ))}

              </select> <span className="text-sm my-auto">OR</span>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-1/6 ps-2 p-1"
                placeholder="Policy Number"
                value={filterOptions.policyNo}
                onChange={(e) => setFilterOptions({ ...filterOptions, policyNo: e.target.value })}
              /><span className="text-sm my-auto">OR</span>
              <select
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-1/6 ps-2 p-1"
                placeholder="Insured Name"
                value={filterOptions.insuredName}
                onChange={(e) => {
                  clearFilters(); // Clear other filters
                  setFilterOptions({ ...filterOptions, insuredName: e.target.value });
                }}
              > <option value="">---- Select Insured Name -------</option>
                {
                  uniqueNames.sort().map((api, idx) => (
                    <option    className={`${api ? "font-semibold" : ""}`} key={idx} value={api}>{api}</option>
                  ))} </select>
              <button className="text-white  mx-4 bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 font-medium rounded text-base px-3 py-1 text-center  " onClick={handleFilter}>Filter</button>
              <button className="text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-300 font-medium rounded text-base px-3 py-1 text-center  " onClick={clearFilters}>Clear</button>
            </div>
          </div>
          {isFilterApplied() && filteredData.length > 0 && (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-xs  text-center text-black border">
                <thead className="text-xs uppercase bg-blue-700 text-white">
                  <tr>
                    <th scope="col" className="px-0 whitespace-nowrap py-3">Entry Date</th>
                    <th scope="col" className="px-0 whitespace-nowrap py-3">Policy Number</th>
                    <th scope="col" className="px-0 whitespace-nowrap py-3">Company</th>
                    <th scope="col" className="px-0 whitespace-nowrap py-3">Insured Name</th>
                    <th scope="col" className="px-0 whitespace-nowrap py-3">Final Prem.</th>
                    <th scope="col" className="px-4 whitespace-nowrap py-3 ">Payout</th>
                    <th scope="col" className="px-0 whitespace-nowrap py-3">Debit Amount</th>
                    <th scope="col" className="px-0 whitespace-nowrap py-3">Payment Date</th>
                    <th scope="col" className="px-0 whitespace-nowrap py-3">Payment Type</th>
                    <th scope="col" className="px-0 whitespace-nowrap py-3">Payment Ref. No.</th>
                    <th scope="col" className="px-0 whitespace-nowrap py-3">Credit Amount</th>
                    <th scope="col" className="px-0 whitespace-nowrap py-3">Balance</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((item) => {
                    
                    if (item.advisorName === filterOptions.advisorName || filterOptions.insuredName || filterOptions.policyNo || filterOptions.fromDate || filterOptions.toDate) {
                      let debitAmount;
                      const currentYear = new Date().getFullYear();
                    const startDate = new Date(`${currentYear}-01-01`);
                    const endDate = new Date(`${currentYear}-12-31`);
                      const entryDate = new Date(item.entryDate);
                      if (entryDate >= startDate && entryDate <= endDate) {
                        // Calculate the debitAmount
                        debitAmount = parseFloat(item.finalEntryFields - (item.advisorPayoutAmount || 0));
                        // Update the balance
                        if (debitAmount === item.creditAmount) {
                          balance -= debitAmount - (item.creditAmount || 0);
                        } else {
                          balance += debitAmount - (item.creditAmount || 0);
                        }
                        return (
                          <tr key={item._id} className="odd:bg-white text-sm even:bg-gray-100 border-b  hover:bg-orange-200">
                            <td className="whitespace-nowrap">{item.entryDate}</td>

                            <td className="whitespace-wrap w-1/12">{item.policyNo}</td>
                            <td className="whitespace-wrap w-1/12">{item.company}</td>
                            <td >{item.insuredName}</td>
                            <td >{`₹ ${item.finalEntryFields}`}</td>
                            <td>{`₹ ${item.advisorPayoutAmount}`}</td>
                            <td>{`₹ ${debitAmount.toFixed(0)}`}</td>
                            <td className="">
                              <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-32 ps-2 p-1"
                                type="date"
                                value={item.paymentDate}
                                onChange={(e) => handleDatesChange(item._id, e.target.value)}
                              />
                            </td>
                            <td className="">
                              <select
                                className="bg-gray-50 mx-4 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-40 ps-2 p-1"
                                type="text"
                                value={item.paymentType}
                                onChange={(e) => handlePayTypeChange(item._id, e.target.value)}>
                                <option value="">Select Payment Mode</option>
                                <option value="CUSTOMER_LINK">CUSTOMER LINK</option>
                                {/* <option value="ADVISOR_LINK">Advisor Link</option> */}
                                <option value="BRANCH_LINK">BRANCH LINK</option>
                                <option value="CUSTOMER_CHQ">CUSTOMER CHQ</option>
                                <option value="FLOAT_PAYMENT">FLOAT PAYMENT</option>
                                <option value="NEFT">NEFT</option>
                                <option value="UPI">UPI</option>
                                <option value="IMPS">IMPS</option>
                                <option value="RTGS">RTGS</option>
                              </select>
                            </td>
                            <td>
                              <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-32 ps-2 p-1"
                                type="text"
                                value={item.paymentRefNo}
                                onChange={(e) => handlePayRefChange(item._id, e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                className="bg-gray-50 border mx-4 border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-32 ps-2 p-1"
                                type="number"
                                min="0"
                                value={item.creditAmount}
                                onChange={(e) => handleCreditChange(item._id, e.target.value)}
                              />
                            </td>
                            <td className={`whitespace-nowrap px-1 ${balance > 0 ? 'text-green-600 font-bold' : (balance < 0 ? 'text-red-600 font-bold' : 'text-black font-bold')}`}>{`₹ ${balance.toFixed(0)}`}</td>

                          </tr>
                        );
                      }
                    }
                  })}
                </tbody>

              </table>
            </div>
          )}
        </div>
        <button className="text-white mx-auto my-5 bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 font-medium rounded text-base px-3 py-1 text-center" onClick={handleSubmit} type="submit">Submit</button>
      </div>
    </section>
  );
}
export default Ledger1;