/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useMemo } from "react";
import VITE_DATA from "../../config/config.jsx";
import axios from "axios";
import SalaryViewPage from "../../HumanResources/GenerateSalary/SalaryViewPage.jsx";
import TextLoader from "../../loader/TextLoader.jsx";
import { format, addMonths } from "date-fns";
import { toast } from "react-toastify";
import Pagination from "./Pagination.jsx";

function ViewSal() {
  const [APIData, setAPIData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [initialMonth, setInitialMonth] = useState(new Date());
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [selectedViewId, setSelectedViewId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    totalCount: 0,
    totalPages: 1,
  });

  const employeeId = sessionStorage.getItem("employeeId");

  useEffect(() => {
    setInitialMonth(new Date());
  }, []);

  const handleViewClick = (id) => {
    setSelectedViewId(id);
    setShowViewPopup(true);
  };

  const handleViewClosePopup = () => {
    setSelectedViewId(null);
    setShowViewPopup(false);
  };

  const fetchSalaries = async (page = 1) => {
    setLoading(true);
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized yet.. Try again!");
      setLoading(false);
      return;
    }

    try {
      // Format selectedMonth for API (e.g., "MM/yyyy")
      const formattedMonth = format(selectedMonth, "M");
      const formattedYear = format(selectedMonth, "yyyy");

      const response = await axios.get(`${VITE_DATA}/api/salaries-list`, {
        headers: { Authorization: token },
        params: {
          page,
          limit: pagination.limit,
          month: formattedMonth, // Pass selected month to API
          year: formattedYear, // Pass selected year to API
        },
      });

      const filteredData = response.data.data.filter(
        (item) => item.empUniqueId === employeeId && item.flags === true
      );

      setAPIData(filteredData);
      setPagination({
        ...pagination,
        page: response.data.currentPage,
        totalCount: response.data.totalCount,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch salary data");
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect to include selectedMonth as a dependency
  useEffect(() => {
    fetchSalaries();
  }, [employeeId, pagination.limit, selectedMonth]); // Add selectedMonth here

  const handleMonthChange = (e) => {
    const [selectedMonthIndex, selectedYear] = e.target.value
      .split("/")
      .map(Number);
    setSelectedMonth(new Date(selectedYear, selectedMonthIndex - 1, 1));
    // Reset pagination to page 1 when month changes
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Client-side filtering (optional, only if API doesn't fully filter)
  const filterDataByMonth = (data, selectedMonth) => {
    const selectedYear = selectedMonth.getFullYear();
    const selectedMonthIndex = selectedMonth.getMonth() + 1;
    const selectedMonthString = `${
      selectedMonthIndex < 10 ? "0" : ""
    }${selectedMonthIndex}/${selectedYear}`;

    return data.filter((item) => {
      const [itemMonth, itemYear] = item.genMonths.split("/").map(Number);
      const formattedItemMonth = `${
        itemMonth < 10 ? "0" : ""
      }${itemMonth}/${itemYear}`;
      return formattedItemMonth === selectedMonthString;
    });
  };

  const filteredData = useMemo(
    () => filterDataByMonth(APIData, selectedMonth),
    [APIData, selectedMonth]
  );

  const handlePageChange = (newPage) => {
    fetchSalaries(newPage);
  };

  return (
    <section className="container-fluid relative p-0 sm:ml-48 bg-blue-50">
      <div className="container-fluid flex justify-center pt-4 border-blue-200 border-dashed rounded bg-blue-50">
        <div className="relative min-w-full w-full">
          <div className="flex flex-col md:flex-row justify-between items-center px-2 mb-4 gap-4">
            <div className="flex items-center justify-between gap-2">
              <select
                className="input-style rounded text-base p-1 border border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                value={format(selectedMonth, "M/yyyy")}
                onChange={handleMonthChange}
              >
                {Array.from({ length: 16 }).map((_, index) => {
                  const monthDate = addMonths(initialMonth, -index);
                  const formattedMonth = format(monthDate, "M/yyyy");
                  return (
                    <option key={index} value={formattedMonth}>
                      {formattedMonth}
                    </option>
                  );
                })}
              </select>
            </div>

            <h1 className="text-blue-700 font-semibold text-2xl md:text-3xl">
              Monthly Salary List
            </h1>

            <div className="flex items-center gap-2">
              <select
                className="input-style rounded text-base p-1 border border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                value={pagination.limit}
                onChange={(e) =>
                  setPagination({
                    ...pagination,
                    limit: parseInt(e.target.value),
                    page: 1,
                  })
                }
              >
                <option value="100">100 per page</option>
                <option value="500">500 per page</option>
                <option value="1000">1000 per page</option>
              </select>
            </div>
          </div>

          <div className="min-w-full flex flex-col overflow-x-auto max-h-[calc(100vh-100px)]">
            {loading ? (
              <TextLoader />
            ) : filteredData.length === 0 ? (
              <div className="flex justify-center text-center py-auto text-blue-800 h-96">
                No salary records found for the selected month
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-blue-200 max-h-[calc(100vh-100px)]">
                  <thead className="bg-blue-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider border">
                        View
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider border">
                        Employee
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider border">
                        Working Month
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider border">
                        Salary Breakup
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider border bg-red-100">
                        Deductions
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider border bg-green-100">
                        Net Salary
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-200">
                    {filteredData.map((data) => {
                      const deductAmount = parseFloat(
                        data.finalAmountSalary -
                          ((data.otherDeduction || 0) +
                            (data.emploanemi || 0) +
                            (data.empesi || 0) +
                            (data.emppf || 0) +
                            (data.fuelExpense || 0) +
                            (data.otherExpense || 0))
                      );

                      return (
                        <tr key={data._id} className="hover:bg-blue-50">
                          <td className="px-4 py-2 whitespace-nowrap border">
                            <button
                              onClick={() => handleViewClick(data)}
                              className="text-white bg-gradient-to-r from-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-2 focus:ring-green-300 font-medium rounded text-sm px-3 py-1 text-center"
                            >
                              View
                            </button>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap border">
                            <div className="font-medium text-lg text-blue-900">{data.empName}</div>
                            <div className="grid grid-cols-1 gap-1 mt-2">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800 mr-1">Monthly Salary:</span>
                                <span className="text-sm text-blue-800 px-2 py-0.5 rounded">
                                  ₹{data.monthsalary?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800 mr-1">Monthly Leave:</span>
                                <span className="text-sm text-blue-800 px-2 py-0.5 rounded">{data.monthleave}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap border">
                            <div className="text-lg font-medium text-blue-900">{data.genMonths}</div>
                            <div className="grid grid-cols-2 gap-1 mt-2">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Working days:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">{data.presentDays}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Half days:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">{data.totalHalfDays}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Absent days:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">{data.totalAbsent}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Sundays:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">{data.sundays}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Holidays:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">{data.holidayCount}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Total days:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">{data.totalDays}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap border">
                            <div className="flex font-medium text-lg items-center">
                              <span className="text-gray-800">Gross Salary:</span>
                              <span className="text-blue-800 px-2 py-0.5 rounded ml-1">
                                ₹{data.empgrossSalary?.toLocaleString() || 0}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-1 mt-2">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Basic:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                  ₹{data.empbasicSalary?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Incentive:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                  ₹{data.incentive?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">HRA:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                  ₹{data.emphra?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">CA:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                  ₹{data.empca?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Medical:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                  ₹{data.empmedical?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Tiffin:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                  ₹{data.emptiffin?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Kit:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                  ₹{data.kit?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Company PF:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                  ₹{data.empcompanyPf?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">ESI:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                  ₹{data.empesi?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Additional:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                  ₹{data.additional?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Fuel:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                  ₹{data.fuelExpense?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Other Expense:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                  ₹{data.otherExpense?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-800">Arrear:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                  ₹{data.arrear?.toLocaleString() || 0}
                                </span>
                              </div>
                              <div className="flex items-center font-medium">
                                <span className="text-sm text-gray-800">Final Amount:</span>
                                <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                  ₹{data.finalAmountSalary?.toLocaleString() || 0}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap border bg-red-50">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-800">PF:</span>
                              <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                ₹{data.emppf?.toLocaleString() || 0}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-800">Loan EMI:</span>
                              <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                ₹{data.emploanemi?.toLocaleString() || 0}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-800">Other:</span>
                              <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">
                                ₹{data.otherDeduction?.toLocaleString() || 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap border bg-green-50">
                            <div className="flex flex-col items-center justify-center h-full text-lg font-medium">
                              <span className="text-gray-800 mb-1">Net Payable</span>
                              <span className="font-bold text-green-700">
                                ₹{deductAmount?.toLocaleString() || 0}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="flex items-center justify-between border-t border-blue-200">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showViewPopup && selectedViewId && (
        <SalaryViewPage data={selectedViewId} onClosed={handleViewClosePopup} />
      )}
    </section>
  );
}

export default ViewSal;

















// import { useState, useEffect } from "react";
// import VITE_DATA from "../../config/config.jsx";
// import axios from "axios";
// import SalaryViewPage from "../../HumanResources/GenerateSalary/SalaryViewPage.jsx";
// import TextLoader from "../../loader/TextLoader.jsx";
// import { useMemo } from "react";
// import { format, addMonths } from "date-fns";
// import { toast } from "react-toastify";
// import Pagination from "./Pagination.jsx"; // You'll need to create this component



// function ViewSal() {
//   const [APIData, setAPIData] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const [initialMonth, setInitialMonth] = useState(new Date());
//   const [showViewPopup, setShowViewPopup] = useState(false);
//   const [selectedViewId, setSelectedViewId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 100,
//     totalCount: 0,
//     totalPages: 1,
//   });

//   const employeeId = sessionStorage.getItem("employeeId");

//   useEffect(() => {
//     setInitialMonth(new Date());
//   }, []);

//   const handleViewClick = (id) => {
//     setSelectedViewId(id);
//     setShowViewPopup(true);
//   };

//   const handleViewClosePopup = () => {
//     setSelectedViewId(null);
//     setShowViewPopup(false);
//   };

//   const fetchSalaries = async (page = 1) => {
//     setLoading(true);
//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       toast.error("Not Authorized yet.. Try again! ");
//       return;
//     }

  
//     try {
//       const response = await axios.get(`${VITE_DATA}/api/salaries-list`, {
//         headers: { Authorization: token },
//         params: {
//           page,
//           limit: pagination.limit,
//         },
//       });

//       const filteredData = response.data.data.filter(
//         (item) => item.empUniqueId === employeeId && item.flags === true
//       );

//       setAPIData(filteredData);
//       setPagination({
//         ...pagination,
//         page: response.data.currentPage,
//         totalCount: response.data.totalCount,
//         totalPages: response.data.totalPages,
//       });
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch salary data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSalaries();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [employeeId, pagination.limit]);

//   const handleMonthChange = (e) => {
//     const [selectedMonthIndex, selectedYear] = e.target.value
//       .split("/")
//       .map(Number);
//     setSelectedMonth(new Date(selectedYear, selectedMonthIndex - 1, 1));
//   };

//   const filterDataByMonth = (data, selectedMonth) => {
//     const selectedYear = selectedMonth.getFullYear();
//     const selectedMonthIndex = selectedMonth.getMonth() + 1;
//     const selectedMonthString = `${
//       selectedMonthIndex < 10 ? "0" : ""
//     }${selectedMonthIndex}/${selectedYear}`;

//     return data.filter((item) => {
//       const [itemMonth, itemYear] = item.genMonths.split("/").map(Number);
//       const formattedItemMonth = `${
//         itemMonth < 10 ? "0" : ""
//       }${itemMonth}/${itemYear}`;
//       return formattedItemMonth === selectedMonthString;
//     });
//   };

//   const filteredData = useMemo(
//     () => filterDataByMonth(APIData, selectedMonth),
//     [APIData, selectedMonth]
//   );

//   const handlePageChange = (newPage) => {
//     fetchSalaries(newPage);
//   };

//   return (
//     <section className="container-fluid relative p-0 sm:ml-48 bg-blue-50">
//       <div className="container-fluid flex justify-center pt-4 border-blue-200 border-dashed rounded bg-blue-50">
//         <div className="relative min-w-full w-full ">
//           <div className="flex flex-col md:flex-row justify-between items-center px-2 mb-4 gap-4 ">
//             <div className="flex items-center justify-between gap-2">
//               <select
//                 className="input-style rounded text-base p-1 border border-blue-300 focus:ring-blue-500 focus:border-blue-500"
//                 value={format(selectedMonth, "M/yyyy")}
//                 onChange={handleMonthChange}
//               >
//                 {Array.from({ length: 16 }).map((_, index) => {
//                   const monthDate = addMonths(initialMonth, -index);
//                   const formattedMonth = format(monthDate, "M/yyyy");
//                   return (
//                     <option key={index} value={formattedMonth}>
//                       {formattedMonth}
//                     </option>
//                   );
//                 })}
//               </select>
//               {/* <span className="text-sm text-blue-600">
//                 Showing {filteredData.length} of {pagination.totalCount} records
//               </span> */}
//             </div>

//             <h1 className="text-blue-700 font-semibold text-2xl md:text-3xl">
//               Monthly Salary List
//             </h1>

//             <div className="flex items-center gap-2">
//               <select
//                 className="input-style rounded text-base p-1 border border-blue-300 focus:ring-blue-500 focus:border-blue-500"
//                 value={pagination.limit}
//                 onChange={(e) =>
//                   setPagination({
//                     ...pagination,
//                     limit: parseInt(e.target.value),
//                     page: 1,
//                   })
//                 }
//               >
//                 <option value="100">100 per page</option>
//                 <option value="500">500 per page</option>
//                 <option value="1000">1000 per page</option>
//               </select>
//             </div>
//           </div>

//           {/* <div className="bg-white rounded shadow-md overflow-x-auto"> */}
//           <div className="min-w-full flex flex-col overflow-x-auto max-h-[calc(100vh-100px)]">
//             {loading ?
//                 <TextLoader />
//             : filteredData.length === 0 ? (
//               <div className="flex justify-center text-center py-auto text-blue-800 h-96">
//                 No salary records found for the selected month
//               </div>
//             ) : (
//               <>
//                <table className="min-w-full divide-y divide-blue-200 max-h-[calc(100vh-100px)]">
//   <thead className="bg-blue-50 sticky top-0">
//     <tr>
//       <th className="px-4 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider border">View</th>
//       <th className="px-4 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider border">Employee</th>
//       <th className="px-4 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider border">Working Month</th>
//       <th className="px-4 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider border">Salary Breakup</th>
//       <th className="px-4 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider border bg-red-100">Deductions</th>
//       <th className="px-4 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider border bg-green-100">Net Salary</th>
//     </tr>
//   </thead>
//   <tbody className="bg-white divide-y divide-blue-200">
//     {filteredData.map((data) => {
//       const deductAmount = parseFloat(
//         data.finalAmountSalary -
//           ((data.otherDeduction || 0) +
//           (data.emploanemi || 0) +
//           (data.empesi || 0) +
//           (data.emppf || 0) +
//           (data.fuelExpense || 0) +
//           (data.otherExpense || 0))
//       );

//       return (
//         <tr key={data._id} className="hover:bg-blue-50">
//           {/* View Button */}
//           <td className="px-4 py-2 whitespace-nowrap border">
//             <button
//               onClick={() => handleViewClick(data)}
//               className="text-white bg-gradient-to-r from-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-2 focus:ring-green-300 font-medium rounded text-sm px-3 py-1 text-center"
//             >
//               View
//             </button>
//           </td>

//           {/* Employee Info */}
//           <td className="px-4 py-2 whitespace-nowrap border">
//             <div className="font-medium text-lg text-blue-900">{data.empName}</div>
//             <div className="grid grid-cols-1 gap-1 mt-2">
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800 mr-1">Monthly Salary:</span>
//                 <span className="text-sm text-blue-800 px-2 py-0.5 rounded">₹{data.monthsalary?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800 mr-1">Monthly Leave:</span>
//                 <span className="text-sm text-blue-800 px-2 py-0.5 rounded">{data.monthleave}</span>
//               </div>
//             </div>
//           </td>

//           {/* Working Month */}
//           <td className="px-4 py-2 whitespace-nowrap border">
//             <div className="text-lg font-medium text-blue-900">{data.genMonths}</div>
//             <div className="grid grid-cols-2 gap-1 mt-2">
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Working days:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">{data.presentDays}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Half days:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">{data.totalHalfDays}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Absent days:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">{data.totalAbsent}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Sundays:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">{data.sundays}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Holidays:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">{data.holidayCount}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Total days:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">{data.totalDays}</span>
//               </div>
//             </div>
//           </td>

//           {/* Salary Breakup */}
//           <td className="px-4 py-2 whitespace-nowrap border">
//             <div className="flex font-medium text-lg items-center">
//               <span className="text-gray-800">Gross Salary:</span>
//               <span className=" text-blue-800 px-2 py-0.5 rounded ml-1">₹ {data.empgrossSalary?.toLocaleString() || 0}</span>
//             </div>
//             <div className="grid grid-cols-4 gap-1 mt-2">
//               {/* <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Gen Salary:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹{data.genSalary?.toLocaleString() || 0}</span>
//               </div> */}
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Basic:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.empbasicSalary?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Incentive:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.incentive?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">HRA:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.emphra?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">CA:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.empca?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Medical:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.empmedical?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Tiffin:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.emptiffin?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Kit:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.kit?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Company PF:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.empcompanyPf?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">ESI:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.empesi?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Additional:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.additional?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Fuel:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.fuelExpense?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Other Expense:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.otherExpense?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Arrear:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.arrear?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center font-medium">
//                 <span className="text-sm text-gray-800">Final Amount:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.finalAmountSalary?.toLocaleString() || 0}</span>
//               </div>
//             </div>
//           </td>

//           {/* Deductions */}
//           <td className="px-4 py-2 whitespace-nowrap border bg-red-50">
//             {/* <div className="flex font-medium text-lg items-center">
//               <span className="text-gray-800">Total Deductions:</span>
//               <span className="text-blue-800 px-2 py-0.5 rounded ml-1">₹ {deductAmount?.toLocaleString() || 0}</span>
//             </div> */}
//             {/* <div className="grid grid-cols-2 gap-1 mt-2"> */}
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">PF:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.emppf?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Loan EMI:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.emploanemi?.toLocaleString() || 0}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-800">Other:</span>
//                 <span className="text-sm text-blue-800 px-1 py-0.5 rounded ml-1">₹ {data.otherDeduction?.toLocaleString() || 0}</span>
//               </div>
//             {/* </div> */}
//           </td>

//           {/* Net Salary */}
//           <td className="px-4 py-2 whitespace-nowrap border bg-green-50">
//             <div className="flex flex-col items-center justify-center h-full text-lg font-medium">
//               <span className=" text-gray-800 mb-1">Net Payable</span>
//               <span className=" font-bold text-green-700">₹{deductAmount?.toLocaleString() || 0}</span>
//             </div>
//           </td>
//         </tr>
//       );
//     })}
//   </tbody>
// </table>

//                 <div className=" flex items-center justify-between border-t border-blue-200">
//                   <Pagination
//                     currentPage={pagination.page}
//                     totalPages={pagination.totalPages}
//                     onPageChange={handlePageChange}
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//           {/* </div> */}
//         </div>
//       </div>

//       {showViewPopup && selectedViewId && (
//         <SalaryViewPage data={selectedViewId} onClosed={handleViewClosePopup} />
//       )}
//     </section>
//   );
// }

// export default ViewSal;
