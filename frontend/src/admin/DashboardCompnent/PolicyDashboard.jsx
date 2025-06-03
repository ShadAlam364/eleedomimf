/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import VITE_DATA from "../../config/config";
import TextLoader from "../../loader/TextLoader";
import UpdateMaster from "../admincomponents/MasterForm/UpdateMaster";
import _ from "lodash";

function PolicyDashboard() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");

  const [policyData, setPolicyData] = useState({
    allPolicies: [],
    totalPolicies: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [searchTerm, setSearchTerm] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const years = Array.from({ length: currentYear - 2019 + 5 }, (_, i) => 2020 + i);
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];


  
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Renewed", label: "Renewed" },
    { value: "Loss to Competitor", label: "Loss to Competitor" },
    { value: "Vehicle Sold", label: "Vehicle Sold" },
  ];

  const fetchPolicyData = async (page = 1, limit = 10, search = searchTerm, status = selectedStatus) => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const params = {
        page,
        limit,
        ...(selectedYear && { year: selectedYear }),
        ...(selectedMonth && { month: selectedMonth }),
        ...(search && { policyNo: search }),
        ...(status && { status }),
      };

      const response = await axios.get(`${VITE_DATA}/api/policy/dashboard/get-data`, {
        headers: {
          Authorization: `${token}`,
        },
        params,
      });

      setPolicyData({
        allPolicies: response.data.allPolicies || [],
        totalPolicies: response.data.totalPolicies || 0,
      });

      setPagination({
        currentPage: response.data.pagination?.currentPage || 1,
        totalPages: response.data.pagination?.totalPages || 1,
        itemsPerPage: response.data.pagination?.itemsPerPage || limit,
        totalItems: response.data.totalPolicies || 0,
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching policy data:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch policy data");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchPolicyData = useCallback(
    _.debounce((search) => {
      fetchPolicyData(1, pagination.itemsPerPage, search, selectedStatus);
    }, 1500),
    [selectedMonth, selectedYear, pagination.itemsPerPage, selectedStatus]
  );

  useEffect(() => {
    fetchPolicyData(1, pagination.itemsPerPage, searchTerm, selectedStatus);
  }, [selectedMonth, selectedYear, selectedStatus]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPolicyData(newPage, pagination.itemsPerPage, searchTerm, selectedStatus);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setPagination((prev) => ({ ...prev, itemsPerPage: newLimit }));
    fetchPolicyData(1, newLimit, searchTerm, selectedStatus);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    debouncedFetchPolicyData(value);
  };



  const clearFilters = () => {
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear.toString());
    setSearchTerm("");
    setSelectedStatus("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchPolicyData(1, pagination.itemsPerPage, "", "");
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedPolicy(null);
  };

  const handleUpdateSuccess = () => {
    fetchPolicyData(pagination.currentPage, pagination.itemsPerPage, searchTerm, selectedStatus);
  };

  const renderPolicyRow = (policy) => {
    return (
      <tr key={policy._id || Math.random().toString(36).substr(2, 9)} className="hover:bg-gray-50">
        <td className="py-3 px-4 border">{policy.policyNo || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.insuredName || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.advisorName || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.contactNo || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.vehRegNo || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.entryDate || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.policyStartDate || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.policyEndDate || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.company || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.branch || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.segment || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.netPremium?.toLocaleString() || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.idv?.toLocaleString() || "N/A"}</td>
        <td className="py-3 px-4 border">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              policy.status === "Renewed"
                ? "bg-green-100 text-green-800"
                : policy.status === "Loss to Competitor"
                ? "bg-red-100 text-red-800"
                : policy.status === "Vehicle Sold"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {policy.status === "Pending" ? "Renewable" : policy.status}
          </span>
        </td>
      </tr>
    );
  };

  if (loading) {
    return <TextLoader />;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <p className="text-red-500 text-center">{error}</p>
        <button
          onClick={() => fetchPolicyData()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:ml-48">
      <h1 className="text-3xl font-bold text-center mb-8">Policy Renewable Dashboard</h1>

      {/* Tabs */}
      <nav
        className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6 justify-center sm:justify-start"
        role="tablist"
        aria-label="Policy Status Tabs"
      >
        {["All", ...statusOptions.map((opt) => opt.value)].map((status) => (
          <button
            key={status}
            onClick={() => {
              setSelectedStatus(status === "All" ? "" : status);
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setSelectedStatus(status === "All" ? "" : status);
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }
            }}
            className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-center ${
              selectedStatus === (status === "All" ? "" : status)
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            role="tab"
            aria-selected={selectedStatus === (status === "All" ? "" : status)}
            aria-current={selectedStatus === (status === "All" ? "" : status) ? "true" : "false"}
            tabIndex={selectedStatus === (status === "All" ? "" : status) ? 0 : -1}
          >
            {status}
            <span
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transition-transform duration-200 ${
                selectedStatus === (status === "All" ? "" : status) ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
        <p className="text-3xl font-bold mt-2">{policyData.totalPolicies.toLocaleString()}</p>
        <p className="text-xl text-gray-900 mt-1 font-bold ">
          {selectedStatus && `Status: ${selectedStatus} | `}
          Expiring in{" "}
          {selectedMonth ? `${months.find((m) => m.value === selectedMonth)?.label} ` : ""}
          {selectedYear || ""}
          {searchTerm && ` (Filtered by Policy No: ${searchTerm})`}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => fetchPolicyData(pagination.currentPage, pagination.itemsPerPage, searchTerm, selectedStatus)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Refresh
          </button>

          <div className="flex items-center">
            <label htmlFor="searchFilter" className="mr-2 text-sm text-gray-600">
              Search Policy No:
            </label>
            <input
              id="searchFilter"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Enter Policy No"
              className="border rounded px-3 py-1 text-sm"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="monthFilter" className="mr-2 text-sm text-gray-600">
              Expiry Month:
            </label>
            <select
              id="monthFilter"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label htmlFor="yearFilter" className="mr-2 text-sm text-gray-600">
              Expiry Year:
            </label>
            <select
              id="yearFilter"
              value={selectedYear}
              onChange={handleYearChange}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {(selectedMonth !== currentMonth || selectedYear !== currentYear.toString() || searchTerm || selectedStatus) && (
              <button
                onClick={clearFilters}
                className="text-red-500 hover:text-red-700 text-sm ml-2"
              >
                Reset to Current
              </button>
            )}
          </div>

          <div className="flex items-center">
            <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              value={pagination.itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border rounded px-3 py-1 text-sm"
            >
              {[10, 20, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            « First
          </button>
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ‹ Previous
          </button>
          <span className="px-3 py-1 text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next ›
          </button>
          <button
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Last »
          </button>
        </div>
      </div>

      {/* Policy Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insured Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Advisor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Reg No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Premium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IDV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policyData.allPolicies.length > 0 ? (
                policyData.allPolicies.map(renderPolicyRow)
              ) : (
                <tr>
                  <td colSpan={15} className="px-6 py-4 text-center text-gray-500">
                    No policies found matching the criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UpdateMaster Modal */}
      {showUpdateModal && selectedPolicy && (
        <UpdateMaster
          insurance={selectedPolicy}
          onUpdate={handleUpdateSuccess}
          onClose={handleCloseModal}
        />
      )}

      {/* Bottom Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.currentPage <= 3) {
                pageNum = i + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
                    pagination.currentPage === pageNum
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } ${pageNum === 1 ? "rounded-l-md border-l" : ""} 
                  ${pageNum === Math.min(5, pagination.totalPages) ? "rounded-r-md border-r" : ""}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}

export default PolicyDashboard;





// shad code server pe update hua hai
// import axios from "axios";
// import { useEffect, useState, useCallback } from "react";
// import VITE_DATA from "../../config/config";
// import TextLoader from "../../loader/TextLoader";
// import UpdateMaster from "../admincomponents/MasterForm/UpdateMaster";
// import _ from "lodash"; // Import lodash for debouncing

// function PolicyDashboard() {
//   // Initialize selectedMonth and selectedYear to current month/year
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");

//   const [policyData, setPolicyData] = useState({
//     allPolicies: [],
//     totalPolicies: 0,
//     renewableCount: 0,
//   });

  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     itemsPerPage: 10,
//     totalItems: 0,
//   });
//   const [selectedMonth, setSelectedMonth] = useState(currentMonth);
//   const [selectedYear, setSelectedYear] = useState(currentYear.toString());
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [selectedPolicy, setSelectedPolicy] = useState(null);

//   // Generate years from 2020 to current year + 5 years for future expiries
//   const years = Array.from({ length: currentYear - 2019 + 5 }, (_, i) => 2020 + i);
//   const months = [
//     { value: "01", label: "January" },
//     { value: "02", label: "February" },
//     { value: "03", label: "March" },
//     { value: "04", label: "April" },
//     { value: "05", label: "May" },
//     { value: "06", label: "June" },
//     { value: "07", label: "July" },
//     { value: "08", label: "August" },
//     { value: "09", label: "September" },
//     { value: "10", label: "October" },
//     { value: "11", label: "November" },
//     { value: "12", label: "December" },
//   ];

//   const isPolicyRenewable = (policy) => {
//     if (!policy || !policy.policyEndDate) return false;
//     try {
//       const endDate = new Date(policy.policyEndDate);
//       const displayYear = selectedYear || endDate.getFullYear();
//       const displayMonth = selectedMonth || (endDate.getMonth() + 1).toString().padStart(2, "0");
//       const lastDayOfMonth = new Date(
//         parseInt(displayYear),
//         parseInt(displayMonth),
//         1
//       );
//       return endDate <= lastDayOfMonth;
//     } catch (error) {
//       console.error("Error checking renewable status:", error);
//       return false;
//     }
//   };

//   const fetchPolicyData = async (page = 1, limit = 10, search = searchTerm) => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const params = {
//         page,
//         limit,
//         ...(selectedYear && { year: selectedYear }),
//         ...(selectedMonth && { month: selectedMonth }),
//         ...(search && { policyNo: search }),
//       };

//       const response = await axios.get(`${VITE_DATA}/api/policy/dashboard/get-data`, {
//         headers: {
//           Authorization: `${token}`,
//         },
//         params,
//       });

//       const renewableCount = response.data.allPolicies.filter(isPolicyRenewable).length;

//       setPolicyData({
//         allPolicies: response.data.allPolicies || [],
//         totalPolicies: response.data.totalPolicies || 0,
//         renewableCount,
//       });

//       setPagination({
//         currentPage: response.data.pagination?.currentPage || 1,
//         totalPages: response.data.pagination?.totalPages || 1,
//         itemsPerPage: response.data.pagination?.itemsPerPage || limit,
//         totalItems: response.data.totalPolicies || 0,
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error fetching policy data:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch policy data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Debounced search handler
//   const debouncedFetchPolicyData = useCallback(
//     _.debounce((search) => {
//       fetchPolicyData(1, pagination.itemsPerPage, search);
//     }, 1500),
//     [selectedMonth, selectedYear, pagination.itemsPerPage]
//   );

//   useEffect(() => {
//     fetchPolicyData(1, pagination.itemsPerPage);
//   }, [selectedMonth, selectedYear]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchPolicyData(newPage, pagination.itemsPerPage);
//     }
//   };

  
//   const handleItemsPerPageChange = (e) => {
//     const newLimit = parseInt(e.target.value);
//     setPagination((prev) => ({ ...prev, itemsPerPage: newLimit }));
//     fetchPolicyData(1, newLimit);
//   };

//   const handleMonthChange = (e) => {
//     setSelectedMonth(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleYearChange = (e) => {
//     setSelectedYear(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//     debouncedFetchPolicyData(value);
//   };

//   const clearFilters = () => {
//     setSelectedMonth(currentMonth);
//     setSelectedYear(currentYear.toString());
//     setSearchTerm("");
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//     fetchPolicyData(1, pagination.itemsPerPage, "");
//   };

//   const handleUpdateClick = (policy) => {
//     setSelectedPolicy(policy);
//     setShowUpdateModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowUpdateModal(false);
//     setSelectedPolicy(null);
//   };

//   const handleUpdateSuccess = () => {
//     fetchPolicyData(pagination.currentPage, pagination.itemsPerPage);
//   };

//   const renderPolicyRow = (policy) => {
//     const isRenewable = isPolicyRenewable(policy);

//     return (
//       <tr key={policy._id || Math.random().toString(36).substr(2, 9)} className="hover:bg-gray-50">
//         <td className="py-3 px-4 border">{policy.policyNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.insuredName || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.advisorName || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.contactNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.vehRegNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.entryDate || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.policyStartDate || "N/A"}</td>
//         <td className={`py-3 px-4 border font-semibold ${isRenewable ? "text-red-600" : ""}`}>
//           {policy.policyEndDate || "N/A"}
//         </td>
//         <td className="py-3 px-4 border">{policy.company || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.branch || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.segment || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.netPremium?.toLocaleString() || "N/A"}</td>
//         <td className="py-3 px-4 border">
//           {isRenewable ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Renewable</span>
//           ) : (
//             <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>
//           )}
//         </td>
//         <td className="py-3 px-4 border">
//           <button
//             onClick={() => handleUpdateClick(policy)}
//             className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-3 rounded"
//           >
//             Update
//           </button>
//         </td>
//       </tr>
//     );
//   };

//   if (loading) {
//     return <TextLoader />;
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64 gap-4">
//         <p className="text-red-500 text-center">{error}</p>
//         <button
//           onClick={() => fetchPolicyData()}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 sm:ml-48">
//       <h1 className="text-3xl font-bold text-center mb-8">Policy Renew Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
//           <p className="text-3xl font-bold mt-2">{policyData.totalPolicies.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Expiring in{" "}
//             {selectedMonth ? `${months.find((m) => m.value === selectedMonth)?.label} ` : ""}
//             {selectedYear || ""}
//             {searchTerm && ` (Filtered by Policy No: ${searchTerm})`}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Renewable Policies</h3>
//           <p className="text-3xl font-bold mt-2 text-red-600">{policyData.renewableCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Expiring by end of{" "}
//             {selectedMonth ? `${months.find((m) => m.value === selectedMonth)?.label} ` : ""}
//             {selectedYear || ""}
//             {searchTerm && ` (Filtered by Policy No: ${searchTerm})`}
//           </p>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div className="flex items-center gap-4 flex-wrap">
//           <button
//             onClick={() => fetchPolicyData(pagination.currentPage, pagination.itemsPerPage)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-2"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Refresh
//           </button>

//           <div className="flex items-center">
//             <label htmlFor="searchFilter" className="mr-2 text-sm text-gray-600">
//               Search Policy No:
//             </label>
//             <input
//               id="searchFilter"
//               type="text"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               placeholder="Enter Policy No"
//               className="border rounded px-3 py-1 text-sm"
//             />
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="monthFilter" className="mr-2 text-sm text-gray-600">
//               Expiry Month:
//             </label>
//             <select
//               id="monthFilter"
//               value={selectedMonth}
//               onChange={handleMonthChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Months</option>
//               {months.map((month) => (
//                 <option key={month.value} value={month.value}>
//                   {month.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="yearFilter" className="mr-2 text-sm text-gray-600">
//               Expiry Year:
//             </label>
//             <select
//               id="yearFilter"
//               value={selectedYear}
//               onChange={handleYearChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Years</option>
//               {years.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//             {(selectedMonth !== currentMonth || selectedYear !== currentYear.toString() || searchTerm) && (
//               <button
//                 onClick={clearFilters}
//                 className="text-red-500 hover:text-red-700 text-sm ml-2"
//               >
//                 Reset to Current
//               </button>
//             )}
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">
//               Items per page:
//             </label>
//             <select
//               id="itemsPerPage"
//               value={pagination.itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               {[10, 20, 50, 100].map((num) => (
//                 <option key={num} value={num}>
//                   {num}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             « First
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage - 1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             ‹ Previous
//           </button>
//           <span className="px-3 py-1 text-sm">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </span>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage + 1)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next ›
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.totalPages)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Last »
//           </button>
//         </div>
//       </div>

//       {/* Policy Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Policy No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Insured Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Advisor Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Vehicle Reg No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Entry Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Start Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   End Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Company
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Branch
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Segment
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Net Premium
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {policyData.allPolicies.length > 0 ? (
//                 policyData.allPolicies.map(renderPolicyRow)
//               ) : (
//                 <tr>
//                   <td colSpan={13} className="px-6 py-4 text-center text-gray-500">
//                     No policies found matching the criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* UpdateMaster Modal */}
//       {showUpdateModal && selectedPolicy && (
//         <UpdateMaster
//           insurance={selectedPolicy}
//           onUpdate={handleUpdateSuccess}
//           onClose={handleCloseModal}
//         />
//       )}

//       {/* Bottom Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="flex justify-center">
//           <nav className="inline-flex rounded-md shadow">
//             {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//               let pageNum;
//               if (pagination.totalPages <= 5) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage <= 3) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                 pageNum = pagination.totalPages - 4 + i;
//               } else {
//                 pageNum = pagination.currentPage - 2 + i;
//               }
//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => handlePageChange(pageNum)}
//                   className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
//                     pagination.currentPage === pageNum
//                       ? "bg-blue-500 text-white border-blue-500"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   } ${pageNum === 1 ? "rounded-l-md border-l" : ""} 
//                   ${pageNum === Math.min(5, pagination.totalPages) ? "rounded-r-md border-r" : ""}`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PolicyDashboard;

















// problem with search input unpoint server

// import axios from "axios";
// import { useEffect, useState } from "react";
// import VITE_DATA from "../../config/config";
// import TextLoader from "../../loader/TextLoader";
// import UpdateMaster from "../admincomponents/MasterForm/UpdateMaster";

// function PolicyDashboard() {
//   // Initialize selectedMonth and selectedYear to current month/year
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");

//   const [policyData, setPolicyData] = useState({
//     allPolicies: [],
//     totalPolicies: 0,
//     renewableCount: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     itemsPerPage: 10,
//     totalItems: 0,
//   });
//   const [selectedMonth, setSelectedMonth] = useState(currentMonth);
//   const [selectedYear, setSelectedYear] = useState(currentYear.toString());
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showUpdateModal, setShowUpdateModal] = useState(false); // State for modal visibility
//   const [selectedPolicy, setSelectedPolicy] = useState(null); // State for selected policy

//   // Generate years from 2020 to current year + 5 years for future expiries
//   const years = Array.from({ length: currentYear - 2019 + 5 }, (_, i) => 2020 + i);
//   const months = [
//     { value: "01", label: "January" },
//     { value: "02", label: "February" },
//     { value: "03", label: "March" },
//     { value: "04", label: "April" },
//     { value: "05", label: "May" },
//     { value: "06", label: "June" },
//     { value: "07", label: "July" },
//     { value: "08", label: "August" },
//     { value: "09", label: "September" },
//     { value: "10", label: "October" },
//     { value: "11", label: "November" },
//     { value: "12", label: "December" },
//   ];

//   const isPolicyRenewable = (policy) => {
//     if (!policy || !policy.policyEndDate) return false;
//     try {
//       const endDate = new Date(policy.policyEndDate);
//       // Use selected month/year if available, otherwise use policy's endDate month/year
//       const displayYear = selectedYear || endDate.getFullYear();
//       const displayMonth = selectedMonth || (endDate.getMonth() + 1).toString().padStart(2, "0");
//       // Get the last day of the display month/year
//       const lastDayOfMonth = new Date(
//         parseInt(displayYear),
//         parseInt(displayMonth),
//         1
//       );
//       // Policy is renewable if its endDate is on or before the last day of the display month
//       return endDate <= lastDayOfMonth;
//     } catch (error) {
//       console.error("Error checking renewable status:", error);
//       return false;
//     }
//   };

//   const fetchPolicyData = async (page = 1, limit = 10) => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const params = {
//         page,
//         limit,
//         ...(selectedYear && { year: selectedYear }),
//         ...(selectedMonth && { month: selectedMonth }),
//         ...(searchTerm && { policyNo: searchTerm }),
//       };

//       const response = await axios.get(`${VITE_DATA}/api/policy/dashboard/get-data`, {
//         headers: {
//           Authorization: `${token}`,
//         },
//         params,
//       });

//       // Calculate renewable count
//       const renewableCount = response.data.allPolicies.filter(isPolicyRenewable).length;

//       setPolicyData({
//         allPolicies: response.data.allPolicies || [],
//         totalPolicies: response.data.totalPolicies || 0,
//         renewableCount,
//       });

//       setPagination({
//         currentPage: response.data.pagination?.currentPage || 1,
//         totalPages: response.data.pagination?.totalPages || 1,
//         itemsPerPage: response.data.pagination?.itemsPerPage || limit,
//         totalItems: response.data.totalPolicies || 0,
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error fetching policy data:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch policy data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPolicyData(1, pagination.itemsPerPage);
//   }, [selectedMonth, selectedYear, searchTerm]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchPolicyData(newPage, pagination.itemsPerPage);
//     }
//   };

//   const handleItemsPerPageChange = (e) => {
//     const newLimit = parseInt(e.target.value);
//     setPagination((prev) => ({ ...prev, itemsPerPage: newLimit }));
//     fetchPolicyData(1, newLimit);
//   };

//   const handleMonthChange = (e) => {
//     setSelectedMonth(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleYearChange = (e) => {
//     setSelectedYear(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const clearFilters = () => {
//     // Reset to current month/year and clear search term
//     setSelectedMonth(currentMonth);
//     setSelectedYear(currentYear.toString());
//     setSearchTerm("");
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   // Handler for opening the UpdateMaster modal
//   const handleUpdateClick = (policy) => {
//     setSelectedPolicy(policy);
//     setShowUpdateModal(true);
//   };

//   // Handler for closing the UpdateMaster modal
//   const handleCloseModal = () => {
//     setShowUpdateModal(false);
//     setSelectedPolicy(null);
//   };

//   // Handler for successful update
//   const handleUpdateSuccess = () => {
//     fetchPolicyData(pagination.currentPage, pagination.itemsPerPage); // Refresh the table
//   };

//   const renderPolicyRow = (policy) => {
//     const isRenewable = isPolicyRenewable(policy);

//     return (
//       <tr key={policy._id || Math.random().toString(36).substr(2, 9)} className="hover:bg-gray-50">
//         <td className="py-3 px-4 border">{policy.policyNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.insuredName || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.contactNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.vehRegNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.entryDate || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.policyStartDate || "N/A"}</td>
//         <td className={`py-3 px-4 border font-semibold ${isRenewable ? "text-red-600" : ""}`}>
//           {policy.policyEndDate || "N/A"}
//         </td>
//         <td className="py-3 px-4 border">{policy.company || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.branch || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.segment || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.netPremium?.toLocaleString() || "N/A"}</td>
//         <td className="py-3 px-4 border">
//           {isRenewable ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Renewable</span>
//           ) : (
//             <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>
//           )}
//         </td>
//         <td className="py-3 px-4 border">
//           <button
//             onClick={() => handleUpdateClick(policy)}
//             className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-3 rounded"
//           >
//             Update
//           </button>
//         </td>
//       </tr>
//     );
//   };

//   if (loading) {
//     return <TextLoader />;
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64 gap-4">
//         <p className="text-red-500 text-center">{error}</p>
//         <button
//           onClick={() => fetchPolicyData()}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 sm:ml-48">
//       <h1 className="text-3xl font-bold text-center mb-8">Policy Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
//           <p className="text-3xl font-bold mt-2">{policyData.totalPolicies.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Expiring in{" "}
//             {selectedMonth ? `${months.find((m) => m.value === selectedMonth)?.label} ` : ""}
//             {selectedYear || ""}
//             {searchTerm && ` (Filtered by Policy No: ${searchTerm})`}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Renewable Policies</h3>
//           <p className="text-3xl font-bold mt-2 text-red-600">{policyData.renewableCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Expiring by end of{" "}
//             {selectedMonth ? `${months.find((m) => m.value === selectedMonth)?.label} ` : ""}
//             {selectedYear || ""}
//             {searchTerm && ` (Filtered by Policy No: ${searchTerm})`}
//           </p>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div className="flex items-center gap-4 flex-wrap">
//           <button
//             onClick={() => fetchPolicyData(pagination.currentPage, pagination.itemsPerPage)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-2"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Refresh
//           </button>

//           <div className="flex items-center">
//             <label htmlFor="searchFilter" className="mr-2 text-sm text-gray-600">
//               Search Policy No:
//             </label>
//             <input
//               id="searchFilter"
//               type="text"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               placeholder="Enter Policy No"
//               className="border rounded px-3 py-1 text-sm"
//             />
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="monthFilter" className="mr-2 text-sm text-gray-600">
//               Expiry Month:
//             </label>
//             <select
//               id="monthFilter"
//               value={selectedMonth}
//               onChange={handleMonthChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Months</option>
//               {months.map((month) => (
//                 <option key={month.value} value={month.value}>
//                   {month.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="yearFilter" className="mr-2 text-sm text-gray-600">
//               Expiry Year:
//             </label>
//             <select
//               id="yearFilter"
//               value={selectedYear}
//               onChange={handleYearChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Years</option>
//               {years.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//             {(selectedMonth !== currentMonth || selectedYear !== currentYear.toString() || searchTerm) && (
//               <button
//                 onClick={clearFilters}
//                 className="text-red-500 hover:text-red-700 text-sm ml-2"
//               >
//                 Reset to Current
//               </button>
//             )}
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">
//               Items per page:
//             </label>
//             <select
//               id="itemsPerPage"
//               value={pagination.itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               {[10, 20, 50, 100].map((num) => (
//                 <option key={num} value={num}>
//                   {num}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             « First
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage - 1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             ‹ Previous
//           </button>
//           <span className="px-3 py-1 text-sm">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </span>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage + 1)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next ›
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.totalPages)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Last »
//           </button>
//         </div>
//       </div>

//       {/* Policy Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Policy No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Insured Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Vehicle Reg No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Entry Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Start Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   End Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Company
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Branch
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Segment
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Net Premium
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {policyData.allPolicies.length > 0 ? (
//                 policyData.allPolicies.map(renderPolicyRow)
//               ) : (
//                 <tr>
//                   <td colSpan={13} className="px-6 py-4 text-center text-gray-500">
//                     No policies found matching the criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* UpdateMaster Modal */}
//       {showUpdateModal && selectedPolicy && (
//         <UpdateMaster
//           insurance={selectedPolicy}
//           onUpdate={handleUpdateSuccess}
//           onClose={handleCloseModal}
//         />
//       )}

//       {/* Bottom Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="flex justify-center">
//           <nav className="inline-flex rounded-md shadow">
//             {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//               let pageNum;
//               if (pagination.totalPages <= 5) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage <= 3) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                 pageNum = pagination.totalPages - 4 + i;
//               } else {
//                 pageNum = pagination.currentPage - 2 + i;
//               }
//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => handlePageChange(pageNum)}
//                   className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
//                     pagination.currentPage === pageNum
//                       ? "bg-blue-500 text-white border-blue-500"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   } ${pageNum === 1 ? "rounded-l-md border-l" : ""} 
//                   ${pageNum === Math.min(5, pagination.totalPages) ? "rounded-r-md border-r" : ""}`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PolicyDashboard;

















// perfect working code shad

// import axios from "axios";
// import { useEffect, useState } from "react";
// import VITE_DATA from "../../config/config";
// import TextLoader from "../../loader/TextLoader";

// function PolicyDashboard() {
//   // Initialize selectedMonth and selectedYear to current month/year
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");

//   const [policyData, setPolicyData] = useState({
//     allPolicies: [],
//     totalPolicies: 0,
//     renewableCount: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     itemsPerPage: 10,
//     totalItems: 0,
//   });
//   const [selectedMonth, setSelectedMonth] = useState(currentMonth);
//   const [selectedYear, setSelectedYear] = useState(currentYear.toString());
//   const [searchTerm, setSearchTerm] = useState("");

//   // Generate years from 2020 to current year + 5 years for future expiries
//   const years = Array.from({ length: currentYear - 2019 + 5 }, (_, i) => 2020 + i);
//   const months = [
//     { value: "01", label: "January" },
//     { value: "02", label: "February" },
//     { value: "03", label: "March" },
//     { value: "04", label: "April" },
//     { value: "05", label: "May" },
//     { value: "06", label: "June" },
//     { value: "07", label: "July" },
//     { value: "08", label: "August" },
//     { value: "09", label: "September" },
//     { value: "10", label: "October" },
//     { value: "11", label: "November" },
//     { value: "12", label: "December" },
//   ];

//   const isPolicyRenewable = (policy) => {
//     if (!policy || !policy.policyEndDate) return false;
//     try {
//       const endDate = new Date(policy.policyEndDate);
//       // Use selected month/year if available, otherwise use policy's endDate month/year
//       const displayYear = selectedYear || endDate.getFullYear();
//       const displayMonth = selectedMonth || (endDate.getMonth() + 1).toString().padStart(2, "0");
//       // Get the last day of the display month/year
//       const lastDayOfMonth = new Date(
//         parseInt(displayYear),
//         parseInt(displayMonth),
//         1
//       );
//       // Policy is renewable if its endDate is on or before the last day of the display month
//       return endDate <= lastDayOfMonth;
//     } catch (error) {
//       console.error("Error checking renewable status:", error);
//       return false;
//     }
//   };

//   const fetchPolicyData = async (page = 1, limit = 10) => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const params = {
//         page,
//         limit,
//         ...(selectedYear && { year: selectedYear }),
//         ...(selectedMonth && { month: selectedMonth }),
//         ...(searchTerm && { policyNo: searchTerm }),
//       };

//       const response = await axios.get(`${VITE_DATA}/api/policy/dashboard/get-data`, {
//         headers: {
//           Authorization: `${token}`,
//         },
//         params,
//       });

//       // Calculate renewable count
//       const renewableCount = response.data.allPolicies.filter(isPolicyRenewable).length;

//       setPolicyData({
//         allPolicies: response.data.allPolicies || [],
//         totalPolicies: response.data.totalPolicies || 0,
//         renewableCount,
//       });

//       setPagination({
//         currentPage: response.data.pagination?.currentPage || 1,
//         totalPages: response.data.pagination?.totalPages || 1,
//         itemsPerPage: response.data.pagination?.itemsPerPage || limit,
//         totalItems: response.data.totalPolicies || 0,
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error fetching policy data:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch policy data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPolicyData(1, pagination.itemsPerPage);
//   }, [selectedMonth, selectedYear, searchTerm]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchPolicyData(newPage, pagination.itemsPerPage);
//     }
//   };

//   const handleItemsPerPageChange = (e) => {
//     const newLimit = parseInt(e.target.value);
//     setPagination((prev) => ({ ...prev, itemsPerPage: newLimit }));
//     fetchPolicyData(1, newLimit);
//   };

//   const handleMonthChange = (e) => {
//     setSelectedMonth(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleYearChange = (e) => {
//     setSelectedYear(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const clearFilters = () => {
//     // Reset to current month/year and clear search term
//     setSelectedMonth(currentMonth);
//     setSelectedYear(currentYear.toString());
//     setSearchTerm("");
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const renderPolicyRow = (policy) => {
//     const isRenewable = isPolicyRenewable(policy);

//     return (
//       <tr key={policy._id || Math.random().toString(36).substr(2, 9)} className="hover:bg-gray-50">
//         <td className="py-3 px-4 border">{policy.policyNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.insuredName || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.contactNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.vehRegNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.entryDate || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.policyStartDate || "N/A"}</td>
//         <td className={`py-3 px-4 border font-semibold ${isRenewable ? "text-red-600" : ""}`}>
//           {policy.policyEndDate || "N/A"}
//         </td>
//         <td className="py-3 px-4 border">{policy.company || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.branch || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.segment || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.netPremium?.toLocaleString() || "N/A"}</td>
//         <td className="py-3 px-4 border">
//           {isRenewable ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Renewable</span>
//           ) : (
//             <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>
//           )}
//         </td>
//       </tr>
//     );
//   };

//   if (loading) {
//     return <TextLoader />;
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64 gap-4">
//         <p className="text-red-500 text-center">{error}</p>
//         <button
//           onClick={() => fetchPolicyData()}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 sm:ml-48">
//       <h1 className="text-3xl font-bold text-center mb-8">Policy Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
//           <p className="text-3xl font-bold mt-2">{policyData.totalPolicies.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Expiring in{" "}
//             {selectedMonth ? `${months.find((m) => m.value === selectedMonth)?.label} ` : ""}
//             {selectedYear || ""}
//             {searchTerm && ` (Filtered by Policy No: ${searchTerm})`}
//           </p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Renewable Policies</h3>
//           <p className="text-3xl font-bold mt-2 text-red-600">{policyData.renewableCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Expiring by end of{" "}
//             {selectedMonth ? `${months.find((m) => m.value === selectedMonth)?.label} ` : ""}
//             {selectedYear || ""}
//             {searchTerm && ` (Filtered by Policy No: ${searchTerm})`}
//           </p>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div className="flex items-center gap-4 flex-wrap">
//           <button
//             onClick={() => fetchPolicyData(pagination.currentPage, pagination.itemsPerPage)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-2"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Refresh
//           </button>

//           <div className="flex items-center">
//             <label htmlFor="searchFilter" className="mr-2 text-sm text-gray-600">
//               Search Policy No:
//             </label>
//             <input
//               id="searchFilter"
//               type="text"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               placeholder="Enter Policy No"
//               className="border rounded px-3 py-1 text-sm"
//             />
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="monthFilter" className="mr-2 text-sm text-gray-600">
//               Expiry Month:
//             </label>
//             <select
//               id="monthFilter"
//               value={selectedMonth}
//               onChange={handleMonthChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Months</option>
//               {months.map((month) => (
//                 <option key={month.value} value={month.value}>
//                   {month.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="yearFilter" className="mr-2 text-sm text-gray-600">
//               Expiry Year:
//             </label>
//             <select
//               id="yearFilter"
//               value={selectedYear}
//               onChange={handleYearChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Years</option>
//               {years.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//             {(selectedMonth !== currentMonth || selectedYear !== currentYear.toString() || searchTerm) && (
//               <button
//                 onClick={clearFilters}
//                 className="text-red-500 hover:text-red-700 text-sm ml-2"
//               >
//                 Reset to Current
//               </button>
//             )}
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">
//               Items per page:
//             </label>
//             <select
//               id="itemsPerPage"
//               value={pagination.itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               {[10, 20, 50, 100].map((num) => (
//                 <option key={num} value={num}>
//                   {num}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             « First
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage - 1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             ‹ Previous
//           </button>
//           <span className="px-3 py-1 text-sm">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </span>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage + 1)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next ›
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.totalPages)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Last »
//           </button>
//         </div>
//       </div>

//       {/* Policy Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Policy No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Insured Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Vehicle Reg No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Entry Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Start Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   End Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Company
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Branch
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Segment
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Net Premium
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {policyData.allPolicies.length > 0 ? (
//                 policyData.allPolicies.map(renderPolicyRow)
//               ) : (
//                 <tr>
//                   <td colSpan={12} className="px-6 py-4 text-center text-gray-500">
//                     No policies found matching the criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Bottom Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="flex justify-center">
//           <nav className="inline-flex rounded-md shadow">
//             {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//               let pageNum;
//               if (pagination.totalPages <= 5) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage <= 3) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                 pageNum = pagination.totalPages - 4 + i;
//               } else {
//                 pageNum = pagination.currentPage - 2 + i;
//               }
//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => handlePageChange(pageNum)}
//                   className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
//                     pagination.currentPage === pageNum
//                       ? "bg-blue-500 text-white border-blue-500"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   } ${pageNum === 1 ? "rounded-l-md border-l" : ""} 
//                   ${pageNum === Math.min(5, pagination.totalPages) ? "rounded-r-md border-r" : ""}`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PolicyDashboard;





























//333
// import axios from "axios";
// import { useEffect, useState } from "react";
// import VITE_DATA from "../../config/config";
// import TextLoader from "../../loader/TextLoader";

// function PolicyDashboard() {
//   const [policyData, setPolicyData] = useState({
//     allPolicies: [],
//     totalPolicies: 0,
//     renewableCount: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     itemsPerPage: 10,
//     totalItems: 0,
//   });
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");

//   // Generate years from 2020 to current year + 5 years for future expiries
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: currentYear - 2019 + 5 }, (_, i) => 2020 + i);
//   const months = [
//     { value: "01", label: "January" },
//     { value: "02", label: "February" },
//     { value: "03", label: "March" },
//     { value: "04", label: "April" },
//     { value: "05", label: "May" },
//     { value: "06", label: "June" },
//     { value: "07", label: "July" },
//     { value: "08", label: "August" },
//     { value: "09", label: "September" },
//     { value: "10", label: "October" },
//     { value: "11", label: "November" },
//     { value: "12", label: "December" },
//   ];

//   const isPolicyRenewable = (policy) => {
//     if (!policy || !policy.policyEndDate || !selectedMonth) return false;
//     try {
//       const endDate = new Date(policy.policyEndDate);
//       // Get the last day of the selected month/year
//       const lastDayOfMonth = new Date(
//         parseInt(selectedYear) || endDate.getFullYear(),
//         parseInt(selectedMonth),
//         0
//       );
//       // Policy is renewable if its endDate is on or before the last day of the selected month
//       return endDate <= lastDayOfMonth;
//     } catch (error) {
//       console.error("Error checking renewable status:", error);
//       return false;
//     }
//   };

//   const fetchPolicyData = async (page = 1, limit = 10) => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const params = {
//         page,
//         limit,
//         ...(selectedYear && { year: selectedYear }),
//         ...(selectedMonth && { month: selectedMonth }),
//       };

//       const response = await axios.get(`${VITE_DATA}/api/policy/dashboard/get-data`, {
//         headers: {
//           Authorization: `${token}`,
//         },
//         params,
//       });

//       // Calculate renewable count
//       const renewableCount = response.data.allPolicies.filter(isPolicyRenewable).length;

//       setPolicyData({
//         allPolicies: response.data.allPolicies || [],
//         totalPolicies: response.data.totalPolicies || 0,
//         renewableCount,
//       });

//       setPagination({
//         currentPage: response.data.pagination?.currentPage || 1,
//         totalPages: response.data.pagination?.totalPages || 1,
//         itemsPerPage: response.data.pagination?.itemsPerPage || limit,
//         totalItems: response.data.totalPolicies || 0,
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error fetching policy data:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch policy data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPolicyData(1, pagination.itemsPerPage);
//   }, [selectedMonth, selectedYear]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchPolicyData(newPage, pagination.itemsPerPage);
//     }
//   };

//   const handleItemsPerPageChange = (e) => {
//     const newLimit = parseInt(e.target.value);
//     setPagination((prev) => ({ ...prev, itemsPerPage: newLimit }));
//     fetchPolicyData(1, newLimit);
//   };

//   const handleMonthChange = (e) => {
//     setSelectedMonth(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleYearChange = (e) => {
//     setSelectedYear(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const clearFilters = () => {
//     setSelectedMonth("");
//     setSelectedYear("");
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const renderPolicyRow = (policy) => {
//     const isRenewable = isPolicyRenewable(policy);

//     return (
//       <tr key={policy._id || Math.random().toString(36).substr(2, 9)} className="hover:bg-gray-50">
//         <td className="py-3 px-4 border">{policy.policyNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.insuredName || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.contactNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.vehRegNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.entryDate || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.policyStartDate || "N/A"}</td>
//         <td className={`py-3 px-4 border font-semibold ${isRenewable ? "text-red-600" : ""}`}>
//           {policy.policyEndDate || "N/A"}
//         </td>
//         <td className="py-3 px-4 border">{policy.company || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.branch || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.segment || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.netPremium?.toLocaleString() || "N/A"}</td>
//         <td className="py-3 px-4 border">
//           {isRenewable ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Renewable</span>
//           ) : (
//             <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>
//           )}
//         </td>
//       </tr>
//     );
//   };

//   if (loading) {
//     return <TextLoader />;
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64 gap-4">
//         <p className="text-red-500 text-center">{error}</p>
//         <button
//           onClick={() => fetchPolicyData()}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 sm:ml-48">
//       <h1 className="text-3xl font-bold text-center mb-8">Policy Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
//           <p className="text-3xl font-bold mt-2">{policyData.totalPolicies.toLocaleString()}</p>
//           {(selectedMonth || selectedYear) && (
//             <p className="text-sm text-gray-500 mt-1">
//               Expiring in{" "}
//               {selectedMonth ? `${months.find((m) => m.value === selectedMonth)?.label} ` : ""}
//               {selectedYear || ""}
//             </p>
//           )}
//         </div>
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Renewable Policies</h3>
//           <p className="text-3xl font-bold mt-2 text-red-600">{policyData.renewableCount.toLocaleString()}</p>
//           {(selectedMonth || selectedYear) && (
//             <p className="text-sm text-gray-500 mt-1">
//               Expiring by end of{" "}
//               {selectedMonth ? `${months.find((m) => m.value === selectedMonth)?.label} ` : ""}
//               {selectedYear || ""}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div className="flex items-center gap-4 flex-wrap">
//           <button
//             onClick={() => fetchPolicyData(pagination.currentPage, pagination.itemsPerPage)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-2"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Refresh
//           </button>

//           <div className="flex items-center">
//             <label htmlFor="monthFilter" className="mr-2 text-sm text-gray-600">
//               Expiry Month:
//             </label>
//             <select
//               id="monthFilter"
//               value={selectedMonth}
//               onChange={handleMonthChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Months</option>
//               {months.map((month) => (
//                 <option key={month.value} value={month.value}>
//                   {month.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="yearFilter" className="mr-2 text-sm text-gray-600">
//               Expiry Year:
//             </label>
//             <select
//               id="yearFilter"
//               value={selectedYear}
//               onChange={handleYearChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Years</option>
//               {years.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//             {(selectedMonth || selectedYear) && (
//               <button
//                 onClick={clearFilters}
//                 className="text-red-500 hover:text-red-700 text-sm ml-2"
//               >
//                 Clear
//               </button>
//             )}
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">
//               Items per page:
//             </label>
//             <select
//               id="itemsPerPage"
//               value={pagination.itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               {[10, 20, 50, 100].map((num) => (
//                 <option key={num} value={num}>
//                   {num}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             « First
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage - 1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             ‹ Previous
//           </button>
//           <span className="px-3 py-1 text-sm">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </span>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage + 1)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next ›
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.totalPages)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Last »
//           </button>
//         </div>
//       </div>

//       {/* Policy Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Policy No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Insured Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Vehicle Reg No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Entry Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Start Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   End Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Company
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Branch
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Segment
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Net Premium
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {policyData.allPolicies.length > 0 ? (
//                 policyData.allPolicies.map(renderPolicyRow)
//               ) : (
//                 <tr>
//                   <td colSpan={12} className="px-6 py-4 text-center text-gray-500">
//                     No policies found expiring in the selected month
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Bottom Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="flex justify-center">
//           <nav className="inline-flex rounded-md shadow">
//             {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//               let pageNum;
//               if (pagination.totalPages <= 5) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage <= 3) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                 pageNum = pagination.totalPages - 4 + i;
//               } else {
//                 pageNum = pagination.currentPage - 2 + i;
//               }
//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => handlePageChange(pageNum)}
//                   className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
//                     pagination.currentPage === pageNum
//                       ? "bg-blue-500 text-white border-blue-500"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   } ${pageNum === 1 ? "rounded-l-md border-l" : ""}
//                   ${pageNum === Math.min(5, pagination.totalPages) ? "rounded-r-md border-r" : ""}`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PolicyDashboard;








//888
// import axios from "axios";
// import { useEffect, useState } from "react";
// import VITE_DATA from "../../config/config";
// import TextLoader from "../../loader/TextLoader";

// function PolicyDashboard() {
//   const [policyData, setPolicyData] = useState({
//     monthlyExpiring: [],
//     weeklyExpiring: [],
//     allPolicies: [],
//     totalPolicies: 0,
//     monthlyExpiringCount: 0,
//     weeklyExpiringCount: 0,
//     currentMonthRange: { start: "", end: "" },
//     nextWeekRange: { start: "", end: "" },
//     segments: [],
//     yearlyNetPremium: 0,
//     monthlyNetPremium: 0,
//     totalNetPremium: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     itemsPerPage: 10,
//     totalItems: 0,
//   });
//   const [selectedSegment, setSelectedSegment] = useState("");
//   const [dateRange, setDateRange] = useState({
//     startDate: "",
//     endDate: "",
//   });
//   const [selectedYear, setSelectedYear] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState("");

//   // Generate years from 2020 to current year
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);
//   const months = [
//     { value: "01", label: "January" },
//     { value: "02", label: "February" },
//     { value: "03", label: "March" },
//     { value: "04", label: "April" },
//     { value: "05", label: "May" },
//     { value: "06", label: "June" },
//     { value: "07", label: "July" },
//     { value: "08", label: "August" },
//     { value: "09", label: "September" },
//     { value: "10", label: "October" },
//     { value: "11", label: "November" },
//     { value: "12", label: "December" },
//   ];

//   const isPolicyExpiring = (policy, expiryList) => {
//     if (!policy || !policy._id || !expiryList) return false;
//     try {
//       const policyId = policy._id.toString();
//       return expiryList.some((p) => p?._id?.toString() === policyId);
//     } catch (error) {
//       console.error("Error comparing policy IDs:", error);
//       return false;
//     }
//   };

//   const fetchPolicyData = async (page = 1, limit = 10) => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const params = {
//         page,
//         limit,
//         segment: selectedSegment,
//         ...(dateRange.startDate && { startDate: dateRange.startDate }),
//         ...(dateRange.endDate && { endDate: dateRange.endDate }),
//         ...(selectedYear && { year: selectedYear }),
//         ...(selectedMonth && { month: selectedMonth }),
//       };

//       const response = await axios.get(`${VITE_DATA}/api/policy/dashboard/get-data`, {
//         headers: {
//           Authorization: `${token}`,
//         },
//         params,
//       });

//       setPolicyData({
//         monthlyExpiring: response.data.monthlyExpiring || [],
//         weeklyExpiring: response.data.weeklyExpiring || [],
//         allPolicies: response.data.allPolicies || [],
//         totalPolicies: response.data.totalPolicies || 0,
//         monthlyExpiringCount: response.data.monthlyExpiringCount || 0,
//         weeklyExpiringCount: response.data.weeklyExpiringCount || 0,
//         currentMonthRange: response.data.currentMonthRange || { start: "", end: "" },
//         nextWeekRange: response.data.nextWeekRange || { start: "", end: "" },
//         segments: response.data.segments || [],
//         yearlyNetPremium: response.data.yearlyNetPremium || 0,
//         monthlyNetPremium: response.data.monthlyNetPremium || 0,
//         totalNetPremium: response.data.totalNetPremium || 0,
//       });

//       setPagination({
//         currentPage: response.data.pagination?.currentPage || 1,
//         totalPages: response.data.pagination?.totalPages || 1,
//         itemsPerPage: response.data.pagination?.itemsPerPage || limit,
//         totalItems: response.data.totalPolicies || 0,
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error fetching policy data:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch policy data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPolicyData(1, pagination.itemsPerPage);
//   }, [selectedSegment, dateRange, selectedYear, selectedMonth]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchPolicyData(newPage, pagination.itemsPerPage);
//     }
//   };

//   const handleItemsPerPageChange = (e) => {
//     const newLimit = parseInt(e.target.value);
//     setPagination((prev) => ({ ...prev, itemsPerPage: newLimit }));
//     fetchPolicyData(1, newLimit);
//   };

//   const handleSegmentChange = (e) => {
//     setSelectedSegment(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleDateChange = (e) => {
//     const { name, value } = e.target;
//     setDateRange((prev) => ({ ...prev, [name]: value }));
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleYearChange = (e) => {
//     setSelectedYear(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleMonthChange = (e) => {
//     setSelectedMonth(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const clearDateFilters = () => {
//     setDateRange({ startDate: "", endDate: "" });
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const clearYearMonthFilters = () => {
//     setSelectedYear("");
//     setSelectedMonth("");
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const renderPolicyRow = (policy) => {
//     const isMonthlyExpiring = isPolicyExpiring(policy, policyData.monthlyExpiring);
//     const isWeeklyExpiring = isPolicyExpiring(policy, policyData.weeklyExpiring);
//     const isExpiring =
//       (activeTab === "monthly" && isMonthlyExpiring) || (activeTab === "weekly" && isWeeklyExpiring);

//     return (
//       <tr key={policy._id || Math.random().toString(36).substr(2, 9)} className="hover:bg-gray-50">
//         <td className="py-3 px小さくするために4 border">{policy.policyNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.insuredName || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.contactNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.vehRegNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.policyStartDate || "N/A"}</td>
//         <td className={`py-3 px-4 border font-semibold ${isExpiring ? "text-red-600" : ""}`}>
//           {policy.policyEndDate || "N/A"}
//         </td>
//         <td className="py-3 px-4 border">{policy.company || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.branch || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.segment || "N/A"}</td>
//         {activeTab === "all" && (
//           <td className="py-3 px-4 border">{policy.netPremium?.toLocaleString() || "N/A"}</td>
//         )}
//         <td className="py-3 px-4 border">
//           {isMonthlyExpiring ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">This Month</span>
//           ) : isWeeklyExpiring ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Next 7 Days</span>
//           ) : (
//             <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>
//           )}
//         </td>
//       </tr>
//     );
//   };

//   const getCurrentData = () => {
//     switch (activeTab) {
//       case "monthly":
//         return policyData.monthlyExpiring;
//       case "weekly":
//         return policyData.weeklyExpiring;
//       default:
//         return policyData.allPolicies;
//     }
//   };

//   const currentData = getCurrentData();

//   if (loading) {
//     return <TextLoader />;
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64 gap-4">
//         <p className="text-red-500 text-center">{error}</p>
//         <button
//           onClick={() => fetchPolicyData()}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 sm:ml-48">
//       <h1 className="text-3xl font-bold text-center mb-8">Policy Expiry Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
//           <p className="text-3xl font-bold mt-2">{policyData.totalPolicies.toLocaleString()}</p>
//           {selectedSegment && <p className="text-sm text-gray-500 mt-1">Filtered by: {selectedSegment}</p>}
//           {(selectedYear || selectedMonth) && (
//             <p className="text-sm text-gray-500 mt-1">
//               {selectedMonth ? `${months.find((m) => m.value === selectedMonth)?.label} ` : ""}
//               {selectedYear || ""}
//             </p>
//           )}
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
//             activeTab === "monthly" ? "ring-2 ring-yellow-400" : ""
//           }`}
//           onClick={() => setActiveTab("monthly")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Expiring This Month</h3>
//           <p className="text-3xl font-bold mt-2 text-yellow-600">
//             {policyData.monthlyExpiringCount.toLocaleString()}
//           </p>
//           <p className="text-sm text-gray-500 mt-1">
//             {policyData.currentMonthRange.start} to {policyData.currentMonthRange.end}
//           </p>
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
//             activeTab === "weekly" ? "ring-2 ring-red-400" : ""
//           }`}
//           onClick={() => setActiveTab("weekly")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Expiring Next 7 Days</h3>
//           <p className="text-3xl font-bold mt-2 text-red-600">{policyData.weeklyExpiringCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             {policyData.nextWeekRange.start} to {policyData.nextWeekRange.end}
//           </p>
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
//             activeTab === "all" ? "ring-2 ring-blue-400" : ""
//           }`}
//           onClick={() => setActiveTab("all")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">All Policies</h3>
//           <p className="text-3xl font-bold mt-2 text-blue-600">{policyData.allPolicies.length.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">Total Net Premium: {policyData.totalNetPremium.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </p>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Yearly Net Premium</h3>
//           <p className="text-3xl font-bold mt-2 text-green-600">{policyData.yearlyNetPremium.toLocaleString()}</p>
//           {selectedYear && <p className="text-sm text-gray-500 mt-1">Year: {selectedYear}</p>}
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Monthly Net Premium</h3>
//           <p className="text-3xl font-bold mt-2 text-green-600">{policyData.monthlyNetPremium.toLocaleString()}</p>
//           {selectedYear && selectedMonth && (
//             <p className="text-sm text-gray-500 mt-1">
//               {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div className="flex items-center gap-4 flex-wrap">
//           <button
//             onClick={() => fetchPolicyData(pagination.currentPage, pagination.itemsPerPage)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-2"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M4 2a1 1 0 011 1v2.101a7.002 7.002 규모의 SVG 아이콘을 표시합니다.0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Refresh
//           </button>

//           <div className="flex items-center">
//             <label htmlFor="segmentFilter" className="mr-2 text-sm text-gray-600">
//               Segment:
//             </label>
//             <select
//               id="segmentFilter"
//               value={selectedSegment}
//               onChange={handleSegmentChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Segments</option>
//               {policyData.segments.map((segment) => (
//                 <option key={segment} value={segment}>
//                   {segment}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="yearFilter" className="mr-2 text-sm text-gray-600">
//               Year:
//             </label>
//             <select
//               id="yearFilter"
//               value={selectedYear}
//               onChange={handleYearChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Years</option>
//               {years.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="monthFilter" className="mr-2 text-sm text-gray-600">
//               Month:
//             </label>
//             <select
//               id="monthFilter"
//               value={selectedMonth}
//               onChange={handleMonthChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Months</option>
//               {months.map((month) => (
//                 <option key={month.value} value={month.value}>
//                   {month.label}
//                 </option>
//               ))}
//             </select>
//             {(selectedYear || selectedMonth) && (
//               <button
//                 onClick={clearYearMonthFilters}
//                 className="text-red-500 hover:text-red-700 text-sm ml-2"
//               >
//                 Clear
//               </button>
//             )}
//           </div>

//           <div className="flex items-center gap-2">
//             <label htmlFor="startDate" className="text-sm text-gray-600">
//               From:
//             </label>
//             <input
//               type="date"
//               id="startDate"
//               name="startDate"
//               value={dateRange.startDate}
//               onChange={handleDateChange}
//               className="border rounded px-3 py-1 text-sm"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <label htmlFor="endDate" className="text-sm text-gray-600">
//               To:
//             </label>
//             <input
//               type="date"
//               id="endDate"
//               name="endDate"
//               value={dateRange.endDate}
//               onChange={handleDateChange}
//               className="border rounded px-3 py-1 text-sm"
//             />
//             {dateRange.startDate || dateRange.endDate ? (
//               <button
//                 onClick={clearDateFilters}
//                 className="text-red-500 hover:text-red-700 text-sm"
//               >
//                 Clear
//               </button>
//             ) : null}
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">
//               Items per page:
//             </label>
//             <select
//               id="itemsPerPage"
//               value={pagination.itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               {[10, 20, 50, 100, 200, 250].map((num) => (
//                 <option key={num} value={num}>
//                   {num}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             « First
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage - 1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             ‹ Previous
//           </button>

//           <span className="px-3 py-1 text-sm">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </span>

//           <button
//             onClick={() => handlePageChange(pagination.currentPage + 1)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next ›
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.totalPages)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Last »
//           </button>
//         </div>
//       </div>

//       {/* Policy Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Policy No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Insured Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Vehicle Reg No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Start Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   End Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Company
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Branch
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Segment
//                 </th>
//                 {activeTab === "all" && (
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Net Premium
//                   </th>
//                 )}
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentData.length > 0 ? (
//                 currentData.map(renderPolicyRow)
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={activeTab === "all" ? 11 : 10}
//                     className="px-6 py-4 text-center text-gray-500"
//                   >
//                     No policies found matching your criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Bottom Pagination */}
//       {pagination.totalPages > 1 && activeTab === "all" && (
//         <div className="flex justify-center">
//           <nav className="inline-flex rounded-md shadow">
//             {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//               let pageNum;
//               if (pagination.totalPages <= 5) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage <= 3) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                 pageNum = pagination.totalPages - 4 + i;
//               } else {
//                 pageNum = pagination.currentPage - 2 + i;
//               }

//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => handlePageChange(pageNum)}
//                   className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
//                     pagination.currentPage === pageNum
//                       ? "bg-blue-500 text-white border-blue-500"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   } ${pageNum === 1 ? "rounded-l-md border-l" : ""}
//                   ${pageNum === Math.min(5, pagination.totalPages) ? "rounded-r-md border-r" : ""}`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PolicyDashboard;

//999
// import axios from "axios";
// import { useEffect, useState } from "react";
// import VITE_DATA from "../../config/config";
// import TextLoader from "../../loader/TextLoader";

// function PolicyDashboard() {
//   const [policyData, setPolicyData] = useState({
//     monthlyExpiring: [],
//     weeklyExpiring: [],
//     allPolicies: [],
//     totalPolicies: 0,
//     monthlyExpiringCount: 0,
//     weeklyExpiringCount: 0,
//     currentMonthRange: { start: "", end: "" },
//     nextWeekRange: { start: "", end: "" },
//     segments: [],
//     yearlyNetPremium: 0,
//     monthlyNetPremium: 0,
//     totalNetPremium: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     itemsPerPage: 10,
//     totalItems: 0,
//   });
//   const [selectedSegment, setSelectedSegment] = useState("");
//   const [dateRange, setDateRange] = useState({
//     startDate: "",
//     endDate: "",
//   });
//   const [selectedYear, setSelectedYear] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState("");

//   // Generate years from 2020 to current year
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);
//   const months = [
//     { value: "01", label: "January" },
//     { value: "02", label: "February" },
//     { value: "03", label: "March" },
//     { value: "04", label: "April" },
//     { value: "05", label: "May" },
//     { value: "06", label: "June" },
//     { value: "07", label: "July" },
//     { value: "08", label: "August" },
//     { value: "09", label: "September" },
//     { value: "10", label: "October" },
//     { value: "11", label: "November" },
//     { value: "12", label: "December" },
//   ];

//   const isPolicyExpiring = (policy, expiryList) => {
//     if (!policy || !policy._id || !expiryList) return false;
//     try {
//       const policyId = policy._id.toString();
//       return expiryList.some((p) => p?._id?.toString() === policyId);
//     } catch (error) {
//       console.error("Error comparing policy IDs:", error);
//       return false;
//     }
//   };

//   const fetchPolicyData = async (page = 1, limit = 10, tab = activeTab) => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const params = {
//         page,
//         limit,
//         segment: selectedSegment,
//         ...(dateRange.startDate && { startDate: dateRange.startDate }),
//         ...(dateRange.endDate && { endDate: dateRange.endDate }),
//         ...(selectedYear && { year: selectedYear }),
//         ...(selectedMonth && { month: selectedMonth }),
//         tab,
//       };

//       const response = await axios.get(`${VITE_DATA}/api/policy/dashboard/get-data`, {
//         headers: {
//           Authorization: `${token}`,
//         },
//         params,
//       });

//       setPolicyData({
//         monthlyExpiring: response.data.monthlyExpiring || [],
//         weeklyExpiring: response.data.weeklyExpiring || [],
//         allPolicies: response.data.allPolicies || [],
//         totalPolicies: response.data.totalPolicies || 0,
//         monthlyExpiringCount: response.data.monthlyExpiringCount || 0,
//         weeklyExpiringCount: response.data.weeklyExpiringCount || 0,
//         currentMonthRange: response.data.currentMonthRange || { start: "", end: "" },
//         nextWeekRange: response.data.nextWeekRange || { start: "", end: "" },
//         segments: response.data.segments || [],
//         yearlyNetPremium: response.data.yearlyNetPremium || 0,
//         monthlyNetPremium: response.data.monthlyNetPremium || 0,
//         totalNetPremium: response.data.totalNetPremium || 0,
//       });

//       setPagination({
//         currentPage: response.data.pagination?.currentPage || 1,
//         totalPages: response.data.pagination?.totalPages || 1,
//         itemsPerPage: response.data.pagination?.itemsPerPage || limit,
//         totalItems:
//           tab === "monthly"
//             ? response.data.monthlyExpiringCount
//             : tab === "weekly"
//             ? response.data.weeklyExpiringCount
//             : response.data.totalPolicies || 0,
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error fetching policy data:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch policy data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPolicyData(1, pagination.itemsPerPage, activeTab);
//   }, [selectedSegment, dateRange, selectedYear, selectedMonth, activeTab]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchPolicyData(newPage, pagination.itemsPerPage, activeTab);
//     }
//   };

//   const handleItemsPerPageChange = (e) => {
//     const newLimit = parseInt(e.target.value);
//     setPagination((prev) => ({ ...prev, itemsPerPage: newLimit }));
//     fetchPolicyData(1, newLimit, activeTab);
//   };

//   const handleSegmentChange = (e) => {
//     setSelectedSegment(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleDateChange = (e) => {
//     const { name, value } = e.target;
//     setDateRange((prev) => ({ ...prev, [name]: value }));
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleYearChange = (e) => {
//     setSelectedYear(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const handleMonthChange = (e) => {
//     setSelectedMonth(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const clearDateFilters = () => {
//     setDateRange({ startDate: "", endDate: "" });
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const clearYearMonthFilters = () => {
//     setSelectedYear("");
//     setSelectedMonth("");
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const renderPolicyRow = (policy) => {
//     const isMonthlyExpiring = isPolicyExpiring(policy, policyData.monthlyExpiring);
//     const isWeeklyExpiring = isPolicyExpiring(policy, policyData.weeklyExpiring);
//     const isExpiring =
//       (activeTab === "monthly" && isMonthlyExpiring) || (activeTab === "weekly" && isWeeklyExpiring);

//     return (
//       <tr key={policy._id || Math.random().toString(36).substr(2, 9)} className="hover:bg-gray-50">
//         <td className="py-3 px-4 border">{policy.policyNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.insuredName || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.contactNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.vehRegNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.policyStartDate || "N/A"}</td>
//         <td className={`py-3 px-4 border font-semibold ${isExpiring ? "text-red-600" : ""}`}>
//           {policy.policyEndDate || "N/A"}
//         </td>
//         <td className="py-3 px-4 border">{policy.company || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.branch || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.segment || "N/A"}</td>
//         {activeTab === "all" && (
//           <td className="py-3 px-4 border">{policy.netPremium?.toLocaleString() || "N/A"}</td>
//         )}
//         <td className="py-3 px-4 border">
//           {isMonthlyExpiring ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">This Month</span>
//           ) : isWeeklyExpiring ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Next 7 Days</span>
//           ) : (
//             <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>
//           )}
//         </td>
//       </tr>
//     );
//   };

//   const getCurrentData = () => {
//     switch (activeTab) {
//       case "monthly":
//         return policyData.monthlyExpiring;
//       case "weekly":
//         return policyData.weeklyExpiring;
//       default:
//         return policyData.allPolicies;
//     }
//   };

//   const currentData = getCurrentData();

//   if (loading) {
//     return <TextLoader />;
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64 gap-4">
//         <p className="text-red-500 text-center">{error}</p>
//         <button
//           onClick={() => fetchPolicyData()}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 sm:ml-48">
//       <h1 className="text-3xl font-bold text-center mb-8">Policy Expiry Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
//           <p className="text-3xl font-bold mt-2">{policyData.totalPolicies.toLocaleString()}</p>
//           {selectedSegment && <p className="text-sm text-gray-500 mt-1">Filtered by: {selectedSegment}</p>}
//           {(selectedYear || selectedMonth) && (
//             <p className="text-sm text-gray-500 mt-1">
//               {selectedMonth ? `${months.find((m) => m.value === selectedMonth)?.label} ` : ""}
//               {selectedYear || ""}
//             </p>
//           )}
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
//             activeTab === "monthly" ? "ring-2 ring-yellow-400" : ""
//           }`}
//           onClick={() => setActiveTab("monthly")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Expiring This Month</h3>
//           <p className="text-3xl font-bold mt-2 text-yellow-600">
//             {policyData.monthlyExpiringCount.toLocaleString()}
//           </p>
//           <p className="text-sm text-gray-500 mt-1">
//             {policyData.currentMonthRange.start} to {policyData.currentMonthRange.end}
//           </p>
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
//             activeTab === "weekly" ? "ring-2 ring-red-400" : ""
//           }`}
//           onClick={() => setActiveTab("weekly")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Expiring Next 7 Days</h3>
//           <p className="text-3xl font-bold mt-2 text-red-600">{policyData.weeklyExpiringCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             {policyData.nextWeekRange.start} to {policyData.nextWeekRange.end}
//           </p>
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
//             activeTab === "all" ? "ring-2 ring-blue-400" : ""
//           }`}
//           onClick={() => setActiveTab("all")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">All Policies</h3>
//           <p className="text-3xl font-bold mt-2 text-blue-600">{policyData.allPolicies.length.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">Total Net Premium: {policyData.totalNetPremium.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </p>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Yearly Net Premium</h3>
//           <p className="text-3xl font-bold mt-2 text-green-600">{policyData.yearlyNetPremium.toLocaleString()}</p>
//           {selectedYear && <p className="text-sm text-gray-500 mt-1">Year: {selectedYear}</p>}
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Monthly Net Premium</h3>
//           <p className="text-3xl font-bold mt-2 text-green-600">{policyData.monthlyNetPremium.toLocaleString()}</p>
//           {selectedYear && selectedMonth && (
//             <p className="text-sm text-gray-500 mt-1">
//               {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div className="flex items-center gap-4 flex-wrap">
//           <button
//             onClick={() => fetchPolicyData(pagination.currentPage, pagination.itemsPerPage, activeTab)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-2"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Refresh
//           </button>

//           <div className="flex items-center">
//             <label htmlFor="segmentFilter" className="mr-2 text-sm text-gray-600">
//               Segment:
//             </label>
//             <select
//               id="segmentFilter"
//               value={selectedSegment}
//               onChange={handleSegmentChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Segments</option>
//               {policyData.segments.map((segment) => (
//                 <option key={segment} value={segment}>
//                   {segment}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="yearFilter" className="mr-2 text-sm text-gray-600">
//               Year:
//             </label>
//             <select
//               id="yearFilter"
//               value={selectedYear}
//               onChange={handleYearChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Years</option>
//               {years.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="monthFilter" className="mr-2 text-sm text-gray-600">
//               Month:
//             </label>
//             <select
//               id="monthFilter"
//               value={selectedMonth}
//               onChange={handleMonthChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Months</option>
//               {months.map((month) => (
//                 <option key={month.value} value={month.value}>
//                   {month.label}
//                 </option>
//               ))}
//             </select>
//             {(selectedYear || selectedMonth) && (
//               <button
//                 onClick={clearYearMonthFilters}
//                 className="text-red-500 hover:text-red-700 text-sm ml-2"
//               >
//                 Clear
//               </button>
//             )}
//           </div>

//           <div className="flex items-center gap-2">
//             <label htmlFor="startDate" className="text-sm text-gray-600">
//               From:
//             </label>
//             <input
//               type="date"
//               id="startDate"
//               name="startDate"
//               value={dateRange.startDate}
//               onChange={handleDateChange}
//               className="border rounded px-3 py-1 text-sm"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <label htmlFor="endDate" className="text-sm text-gray-600">
//               To:
//             </label>
//             <input
//               type="date"
//               id="endDate"
//               name="endDate"
//               value={dateRange.endDate}
//               onChange={handleDateChange}
//               className="border rounded px-3 py-1 text-sm"
//             />
//             {dateRange.startDate || dateRange.endDate ? (
//               <button
//                 onClick={clearDateFilters}
//                 className="text-red-500 hover:text-red-700 text-sm"
//               >
//                 Clear
//               </button>
//             ) : null}
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">
//               Items per page:
//             </label>
//             <select
//               id="itemsPerPage"
//               value={pagination.itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               {[10, 20, 50, 100, 200, 250].map((num) => (
//                 <option key={num} value={num}>
//                   {num}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             « First
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage - 1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             ‹ Previous
//           </button>

//           <span className="px-3 py-1 text-sm">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </span>

//           <button
//             onClick={() => handlePageChange(pagination.currentPage + 1)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next ›
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.totalPages)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Last »
//           </button>
//         </div>
//       </div>

//       {/* Policy Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Policy No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Insured Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Vehicle Reg No
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Start Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   End Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Company
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Branch
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Segment
//                 </th>
//                 {activeTab === "all" && (
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Net Premium
//                   </th>
//                 )}
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentData.length > 0 ? (
//                 currentData.map(renderPolicyRow)
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={activeTab === "all" ? 11 : 10}
//                     className="px-6 py-4 text-center text-gray-500"
//                   >
//                     No policies found matching your criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Bottom Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="flex justify-center">
//           <nav className="inline-flex rounded-md shadow">
//             {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//               let pageNum;
//               if (pagination.totalPages <= 5) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage <= 3) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                 pageNum = pagination.totalPages - 4 + i;
//               } else {
//                 pageNum = pagination.currentPage - 2 + i;
//               }

//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => handlePageChange(pageNum)}
//                   className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
//                     pagination.currentPage === pageNum
//                       ? "bg-blue-500 text-white border-blue-500"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   } ${pageNum === 1 ? "rounded-l-md border-l" : ""}
//                   ${pageNum === Math.min(5, pagination.totalPages) ? "rounded-r-md border-r" : ""}`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PolicyDashboard;

//444
// import axios from "axios";
// port { useEffect, useState } from "react";
// imporimt VITE_DATA from "../../config/config";
// import TextLoader from "../../loader/TextLoader";

// function PolicyDashboard() {
//   const [policyData, setPolicyData] = useState({
//     monthlyExpiring: [],
//     weeklyExpiring: [],
//     allPolicies: [],
//     totalPolicies: 0,
//     monthlyExpiringCount: 0,
//     weeklyExpiringCount: 0,
//     currentMonthRange: { start: '', end: '' },
//     nextWeekRange: { start: '', end: '' },
//     segments: [],
//     yearlyNetPremium: 0,
//     monthlyNetPremium: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     itemsPerPage: 10,
//     totalItems: 0
//   });
//   const [selectedSegment, setSelectedSegment] = useState("");
//   const [dateRange, setDateRange] = useState({
//     startDate: "",
//     endDate: ""
//   });
//   const [selectedYear, setSelectedYear] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState("");

//   // Generate years from 2020 to current year
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);
//   const months = [
//     { value: "01", label: "January" },
//     { value: "02", label: "February" },
//     { value: "03", label: "March" },
//     { value: "04", label: "April" },
//     { value: "05", label: "May" },
//     { value: "06", label: "June" },
//     { value: "07", label: "July" },
//     { value: "08", label: "August" },
//     { value: "09", label: "September" },
//     { value: "10", label: "October" },
//     { value: "11", label: "November" },
//     { value: "12", label: "December" }
//   ];

//   const isPolicyExpiring = (policy, expiryList) => {
//     if (!policy || !policy._id || !expiryList) return false;
//     try {
//       const policyId = policy._id.toString();
//       return expiryList.some(p => p?._id?.toString() === policyId);
//     } catch (error) {
//       console.error("Error comparing policy IDs:", error);
//       return false;
//     }
//   };

//   const fetchPolicyData = async (page = 1, limit = 10) => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const params = {
//         page,
//         limit,
//         segment: selectedSegment,
//         ...(dateRange.startDate && { startDate: dateRange.startDate }),
//         ...(dateRange.endDate && { endDate: dateRange.endDate }),
//         ...(selectedYear && { year: selectedYear }),
//         ...(selectedMonth && { month: selectedMonth })
//       };

//       const response = await axios.get(`${VITE_DATA}/api/policy/dashboard/get-data`, {
//         headers: {
//           Authorization: `${token}`,
//         },
//         params
//       });

//       setPolicyData({
//         monthlyExpiring: response.data.monthlyExpiring || [],
//         weeklyExpiring: response.data.weeklyExpiring || [],
//         allPolicies: response.data.allPolicies || [],
//         totalPolicies: response.data.totalPolicies || 0,
//         monthlyExpiringCount: response.data.monthlyExpiringCount || 0,
//         weeklyExpiringCount: response.data.weeklyExpiringCount || 0,
//         currentMonthRange: response.data.currentMonthRange || { start: '', end: '' },
//         nextWeekRange: response.data.nextWeekRange || { start: '', end: '' },
//         segments: response.data.segments || [],
//         yearlyNetPremium: response.data.yearlyNetPremium || 0,
//         monthlyNetPremium: response.data.monthlyNetPremium || 0
//       });

//       setPagination({
//         currentPage: response.data.pagination?.currentPage || 1,
//         totalPages: response.data.pagination?.totalPages || 1,
//         itemsPerPage: response.data.pagination?.itemsPerPage || limit,
//         totalItems: response.data.pagination?.totalItems || 0
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error fetching policy data:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch policy data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPolicyData();
//   }, [selectedSegment, dateRange, selectedYear, selectedMonth]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchPolicyData(newPage, pagination.itemsPerPage);
//     }
//   };

//   const handleItemsPerPageChange = (e) => {
//     const newLimit = parseInt(e.target.value);
//     setPagination(prev => ({ ...prev, itemsPerPage: newLimit }));
//     fetchPolicyData(1, newLimit);
//   };

//   const handleSegmentChange = (e) => {
//     setSelectedSegment(e.target.value);
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const handleDateChange = (e) => {
//     const { name, value } = e.target;
//     setDateRange(prev => ({ ...prev, [name]: value }));
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const handleYearChange = (e) => {
//     setSelectedYear(e.target.value);
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const handleMonthChange = (e) => {
//     setSelectedMonth(e.target.value);
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const clearDateFilters = () => {
//     setDateRange({ startDate: "", endDate: "" });
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const clearYearMonthFilters = () => {
//     setSelectedYear("");
//     setSelectedMonth("");
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const renderPolicyRow = (policy) => {
//     const isMonthlyExpiring = isPolicyExpiring(policy, policyData.monthlyExpiring);
//     const isWeeklyExpiring = isPolicyExpiring(policy, policyData.weeklyExpiring);
//     const isExpiring = (activeTab === "monthly" && isMonthlyExpiring) ||
//                       (activeTab === "weekly" && isWeeklyExpiring);

//     return (
//       <tr key={policy._id || Math.random().toString(36).substr(2, 9)} className="hover:bg-gray-50">
//         <td className="py-3 px-4 border">{policy.policyNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.insuredName || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.contactNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.vehRegNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.policyStartDate || "N/A"}</td>
//         <td className={`py-3 px-4 border font-semibold ${isExpiring ? 'text-red-600' : ''}`}>
//           {policy.policyEndDate || "N/A"}
//         </td>
//         <td className="py-3 px-4 border">{policy.company || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.branch || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.segment || "N/A"}</td>
//         {activeTab === "all" && (
//           <td className="py-3 px-4 border">{policy.netPremium?.toLocaleString() || "N/A"}</td>
//         )}
//         <td className="py-3 px-4 border">
//           {isMonthlyExpiring ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
//               This Month
//             </span>
//           ) : isWeeklyExpiring ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
//               Next 7 Days
//             </span>
//           ) : (
//             <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
//               Active
//             </span>
//           )}
//         </td>
//       </tr>
//     );
//   };

//   const getCurrentData = () => {
//     switch (activeTab) {
//       case "monthly":
//         return policyData.monthlyExpiring;
//       case "weekly":
//         return policyData.weeklyExpiring;
//       default:
//         return policyData.allPolicies;
//     }
//   };

//   const currentData = getCurrentData();

//   if (loading) {
//     return <TextLoader />;
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64 gap-4">
//         <p className="text-red-500 text-center">{error}</p>
//         <button
//           onClick={() => fetchPolicyData()}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 sm:ml-48">
//       <h1 className="text-3xl font-bold text-center mb-8">Policy Expiry Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
//           <p className="text-3xl font-bold mt-2">{policyData.totalPolicies.toLocaleString()}</p>
//           {selectedSegment && <p className="text-sm text-gray-500 mt-1">Filtered by: {selectedSegment}</p>}
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "monthly" ? "ring-2 ring-yellow-400" : ""}`}
//           onClick={() => setActiveTab("monthly")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Expiring This Month</h3>
//           <p className="text-3xl font-bold mt-2 text-yellow-600">{policyData.monthlyExpiringCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             {policyData.currentMonthRange.start} to {policyData.currentMonthRange.end}
//           </p>
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "weekly" ? "ring-2 ring-red-400" : ""}`}
//           onClick={() => setActiveTab("weekly")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Expiring Next 7 Days</h3>
//           <p className="text-3xl font-bold mt-2 text-red-600">{policyData.weeklyExpiringCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             {policyData.nextWeekRange.start} to {policyData.nextWeekRange.end}
//           </p>
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "all" ? "ring-2 ring-blue-400" : ""}`}
//           onClick={() => setActiveTab("all")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">All Policies</h3>
//           <p className="text-3xl font-bold mt-2 text-blue-600">{policyData.allPolicies.length.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </p>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Yearly Net Premium</h3>
//           <p className="text-3xl font-bold mt-2 text-green-600">{policyData.yearlyNetPremium.toLocaleString()}</p>
//           {selectedYear && <p className="text-sm text-gray-500 mt-1">Year: {selectedYear}</p>}
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Monthly Net Premium</h3>
//           <p className="text-3xl font-bold mt-2 text-green-600">{policyData.monthlyNetPremium.toLocaleString()}</p>
//           {selectedYear && selectedMonth && (
//             <p className="text-sm text-gray-500 mt-1">
//               {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div className="flex items-center gap-4 flex-wrap">
//           <button
//             onClick={() => fetchPolicyData(pagination.currentPage, pagination.itemsPerPage)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
//             </svg>
//             Refresh
//           </button>

//           <div className="flex items-center">
//             <label htmlFor="segmentFilter" className="mr-2 text-sm text-gray-600">Segment:</label>
//             <select
//               id="segmentFilter"
//               value={selectedSegment}
//               onChange={handleSegmentChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Segments</option>
//               {policyData.segments.map(segment => (
//                 <option key={segment} value={segment}>{segment}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="yearFilter" className="mr-2 text-sm text-gray-600">Year:</label>
//             <select
//               id="yearFilter"
//               value={selectedYear}
//               onChange={handleYearChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Years</option>
//               {years.map(year => (
//                 <option key={year} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="monthFilter" className="mr-2 text-sm text-gray-600">Month:</label>
//             <select
//               id="monthFilter"
//               value={selectedMonth}
//               onChange={handleMonthChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Months</option>
//               {months.map(month => (
//                 <option key={month.value} value={month.value}>{month.label}</option>
//               ))}
//             </select>
//             {(selectedYear || selectedMonth) && (
//               <button
//                 onClick={clearYearMonthFilters}
//                 className="text-red-500 hover:text-red-700 text-sm ml-2"
//               >
//                 Clear
//               </button>
//             )}
//           </div>

//           <div className="flex items-center gap-2">
//             <label htmlFor="startDate" className="text-sm text-gray-600">From:</label>
//             <input
//               type="date"
//               id="startDate"
//               name="startDate"
//               value={dateRange.startDate}
//               onChange={handleDateChange}
//               className="border rounded px-3 py-1 text-sm"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <label htmlFor="endDate" className="text-sm text-gray-600">To:</label>
//             <input
//               type="date"
//               id="endDate"
//               name="endDate"
//               value={dateRange.endDate}
//               onChange={handleDateChange}
//               className="border rounded px-3 py-1 text-sm"
//             />
//             {dateRange.startDate || dateRange.endDate ? (
//               <button
//                 onClick={clearDateFilters}
//                 className="text-red-500 hover:text-red-700 text-sm"
//               >
//                 Clear
//               </button>
//             ) : null}
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">Items per page:</label>
//             <select
//               id="itemsPerPage"
//               value={pagination.itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               {[10, 20, 50, 100, 200, 250].map(num => (
//                 <option key={num} value={num}>{num}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             « First
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage - 1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             ‹ Previous
//           </button>

//           <span className="px-3 py-1 text-sm">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </span>

//           <button
//             onClick={() => handlePageChange(pagination.currentPage + 1)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next ›
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.totalPages)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Last »
//           </button>
//         </div>
//       </div>

//       {/* Policy Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insured Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Reg No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
//                 {activeTab === "all" && (
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Premium</th>
//                 )}
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentData.length > 0 ? (
//                 currentData.map(renderPolicyRow)
//               ) : (
//                 <tr>
//                   <td colSpan={activeTab === "all" ? 11 : 10} className="px-6 py-4 text-center text-gray-500">
//                     No policies found matching your criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Bottom Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="flex justify-center">
//           <nav className="inline-flex rounded-md shadow">
//             {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//               let pageNum;
//               if (pagination.totalPages <= 5) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage <= 3) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                 pageNum = pagination.totalPages - 4 + i;
//               } else {
//                 pageNum = pagination.currentPage - 2 + i;
//               }

//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => handlePageChange(pageNum)}
//                   className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
//                     pagination.currentPage === pageNum
//                       ? 'bg-blue-500 text-white border-blue-500'
//                       : 'bg-white text-gray-700 hover:bg-gray-50'
//                   } ${pageNum === 1 ? 'rounded-l-md border-l' : ''}
//                   ${pageNum === Math.min(5, pagination.totalPages) ? 'rounded-r-md border-r' : ''}`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PolicyDashboard;

// import axios from "axios";
// import { useEffect, useState } from "react";
// import VITE_DATA from "../../config/config";
// import TextLoader from "../../loader/TextLoader";

// function PolicyDashboard() {
//   const [policyData, setPolicyData] = useState({
//     monthlyExpiring: [],
//     weeklyExpiring: [],
//     allPolicies: [],
//     totalPolicies: 0,
//     monthlyExpiringCount: 0,
//     weeklyExpiringCount: 0,
//     currentMonthRange: { start: '', end: '' },
//     nextWeekRange: { start: '', end: '' },
//     segments: [],
//     yearlyNetPremium: 0,
//     monthlyNetPremium: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     itemsPerPage: 10,
//     totalItems: 0
//   });
//   const [selectedSegment, setSelectedSegment] = useState("");
//   const [dateRange, setDateRange] = useState({
//     startDate: "",
//     endDate: ""
//   });
//   const [selectedYear, setSelectedYear] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState("");

//   // Generate years from 2020 to current year
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);
//   const months = [
//     { value: "01", label: "January" },
//     { value: "02", label: "February" },
//     { value: "03", label: "March" },
//     { value: "04", label: "April" },
//     { value: "05", label: "May" },
//     { value: "06", label: "June" },
//     { value: "07", label: "July" },
//     { value: "08", label: "August" },
//     { value: "09", label: "September" },
//     { value: "10", label: "October" },
//     { value: "11", label: "November" },
//     { value: "12", label: "December" }
//   ];

//   const isPolicyExpiring = (policy, expiryList) => {
//     if (!policy || !policy._id || !expiryList) return false;
//     try {
//       const policyId = policy._id.toString();
//       return expiryList.some(p => p?._id?.toString() === policyId);
//     } catch (error) {
//       console.error("Error comparing policy IDs:", error);
//       return false;
//     }
//   };

//   const fetchPolicyData = async (page = 1, limit = 10) => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const params = {
//         page,
//         limit,
//         segment: selectedSegment,
//         ...(dateRange.startDate && { startDate: dateRange.startDate }),
//         ...(dateRange.endDate && { endDate: dateRange.endDate }),
//         ...(selectedYear && { year: selectedYear }),
//         ...(selectedMonth && { month: selectedMonth })
//       };

//       const response = await axios.get(`${VITE_DATA}/api/policy/dashboard/get-data`, {
//         headers: {
//           Authorization: `${token}`,
//         },
//         params
//       });

//       setPolicyData({
//         monthlyExpiring: response.data.monthlyExpiring || [],
//         weeklyExpiring: response.data.weeklyExpiring || [],
//         allPolicies: response.data.allPolicies || [],
//         totalPolicies: response.data.totalPolicies || 0,
//         monthlyExpiringCount: response.data.monthlyExpiringCount || 0,
//         weeklyExpiringCount: response.data.weeklyExpiringCount || 0,
//         currentMonthRange: response.data.currentMonthRange || { start: '', end: '' },
//         nextWeekRange: response.data.nextWeekRange || { start: '', end: '' },
//         segments: response.data.segments || [],
//         yearlyNetPremium: response.data.yearlyNetPremium || 0,
//         monthlyNetPremium: response.data.monthlyNetPremium || 0
//       });

//       setPagination({
//         currentPage: response.data.pagination?.currentPage || 1,
//         totalPages: response.data.pagination?.totalPages || 1,
//         itemsPerPage: response.data.pagination?.itemsPerPage || limit,
//         totalItems: response.data.pagination?.totalItems || 0
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error fetching policy data:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch policy data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPolicyData();
//   }, [selectedSegment, dateRange, selectedYear, selectedMonth]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchPolicyData(newPage, pagination.itemsPerPage);
//     }
//   };

//   const handleItemsPerPageChange = (e) => {
//     const newLimit = parseInt(e.target.value);
//     setPagination(prev => ({ ...prev, itemsPerPage: newLimit }));
//     fetchPolicyData(1, newLimit);
//   };

//   const handleSegmentChange = (e) => {
//     setSelectedSegment(e.target.value);
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const handleDateChange = (e) => {
//     const { name, value } = e.target;
//     setDateRange(prev => ({ ...prev, [name]: value }));
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const handleYearChange = (e) => {
//     setSelectedYear(e.target.value);
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const handleMonthChange = (e) => {
//     setSelectedMonth(e.target.value);
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const clearDateFilters = () => {
//     setDateRange({ startDate: "", endDate: "" });
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const clearYearMonthFilters = () => {
//     setSelectedYear("");
//     setSelectedMonth("");
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const renderPolicyRow = (policy) => {
//     const isMonthlyExpiring = isPolicyExpiring(policy, policyData.monthlyExpiring);
//     const isWeeklyExpiring = isPolicyExpiring(policy, policyData.weeklyExpiring);
//     const isExpiring = (activeTab === "monthly" && isMonthlyExpiring) ||
//                       (activeTab === "weekly" && isWeeklyExpiring);

//     return (
//       <tr key={policy._id || Math.random().toString(36).substr(2, 9)} className="hover:bg-gray-50">
//         <td className="py-3 px-4 border">{policy.policyNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.insuredName || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.contactNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.vehRegNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.policyStartDate || "N/A"}</td>
//         <td className={`py-3 px-4 border font-semibold ${isExpiring ? 'text-red-600' : ''}`}>
//           {policy.policyEndDate || "N/A"}
//         </td>
//         <td className="py-3 px-4 border">{policy.company || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.branch || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.segment || "N/A"}</td>
//         {activeTab === "all" && (
//           <td className="py-3 px-4 border">{policy.netPremium?.toLocaleString() || "N/A"}</td>
//         )}
//         <td className="py-3 px-4 border">
//           {isMonthlyExpiring ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
//               This Month
//             </span>
//           ) : isWeeklyExpiring ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
//               Next 7 Days
//             </span>
//           ) : (
//             <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
//               Active
//             </span>
//           )}
//         </td>
//       </tr>
//     );
//   };

//   const getCurrentData = () => {
//     switch (activeTab) {
//       case "monthly":
//         return policyData.monthlyExpiring;
//       case "weekly":
//         return policyData.weeklyExpiring;
//       default:
//         return policyData.allPolicies;
//     }
//   };

//   const currentData = getCurrentData();

//   if (loading) {
//     return <TextLoader />;
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64 gap-4">
//         <p className="text-red-500 text-center">{error}</p>
//         <button
//           onClick={() => fetchPolicyData()}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 sm:ml-48">
//       <h1 className="text-3xl font-bold text-center mb-8">Policy Expiry Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
//           <p className="text-3xl font-bold mt-2">{policyData.totalPolicies.toLocaleString()}</p>
//           {selectedSegment && <p className="text-sm text-gray-500 mt-1">Filtered by: {selectedSegment}</p>}
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "monthly" ? "ring-2 ring-yellow-400" : ""}`}
//           onClick={() => setActiveTab("monthly")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Expiring This Month</h3>
//           <p className="text-3xl font-bold mt-2 text-yellow-600">{policyData.monthlyExpiringCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             {policyData.currentMonthRange.start} to {policyData.currentMonthRange.end}
//           </p>
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "weekly" ? "ring-2 ring-red-400" : ""}`}
//           onClick={() => setActiveTab("weekly")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Expiring Next 7 Days</h3>
//           <p className="text-3xl font-bold mt-2 text-red-600">{policyData.weeklyExpiringCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             {policyData.nextWeekRange.start} to {policyData.nextWeekRange.end}
//           </p>
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "all" ? "ring-2 ring-blue-400" : ""}`}
//           onClick={() => setActiveTab("all")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">All Policies</h3>
//           <p className="text-3xl font-bold mt-2 text-blue-600">{policyData.allPolicies.length.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </p>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Yearly Net Premium</h3>
//           <p className="text-3xl font-bold mt-2 text-green-600">{policyData.yearlyNetPremium.toLocaleString()}</p>
//           {selectedYear && <p className="text-sm text-gray-500 mt-1">Year: {selectedYear}</p>}
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Monthly Net Premium</h3>
//           <p className="text-3xl font-bold mt-2 text-green-600">{policyData.monthlyNetPremium.toLocaleString()}</p>
//           {selectedYear && selectedMonth && (
//             <p className="text-sm text-gray-500 mt-1">
//               {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div className="flex items-center gap-4 flex-wrap">
//           <button
//             onClick={() => fetchPolicyData(pagination.currentPage, pagination.itemsPerPage)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
//             </svg>
//             Refresh
//           </button>

//           <div className="flex items-center">
//             <label htmlFor="segmentFilter" className="mr-2 text-sm text-gray-600">Segment:</label>
//             <select
//               id="segmentFilter"
//               value={selectedSegment}
//               onChange={handleSegmentChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Segments</option>
//               {policyData.segments.map(segment => (
//                 <option key={segment} value={segment}>{segment}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="yearFilter" className="mr-2 text-sm text-gray-600">Year:</label>
//             <select
//               id="yearFilter"
//               value={selectedYear}
//               onChange={handleYearChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Years</option>
//               {years.map(year => (
//                 <option key={year} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="monthFilter" className="mr-2 text-sm text-gray-600">Month:</label>
//             <select
//               id="monthFilter"
//               value={selectedMonth}
//               onChange={handleMonthChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Months</option>
//               {months.map(month => (
//                 <option key={month.value} value={month.value}>{month.label}</option>
//               ))}
//             </select>
//             {(selectedYear || selectedMonth) && (
//               <button
//                 onClick={clearYearMonthFilters}
//                 className="text-red-500 hover:text-red-700 text-sm ml-2"
//               >
//                 Clear
//               </button>
//             )}
//           </div>

//           <div className="flex items-center gap-2">
//             <label htmlFor="startDate" className="text-sm text-gray-600">From:</label>
//             <input
//               type="date"
//               id="startDate"
//               name="startDate"
//               value={dateRange.startDate}
//               onChange={handleDateChange}
//               className="border rounded px-3 py-1 text-sm"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <label htmlFor="endDate" className="text-sm text-gray-600">To:</label>
//             <input
//               type="date"
//               id="endDate"
//               name="endDate"
//               value={dateRange.endDate}
//               onChange={handleDateChange}
//               className="border rounded px-3 py-1 text-sm"
//             />
//             {dateRange.startDate || dateRange.endDate ? (
//               <button
//                 onClick={clearDateFilters}
//                 className="text-red-500 hover:text-red-700 text-sm"
//               >
//                 Clear
//               </button>
//             ) : null}
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">Items per page:</label>
//             <select
//               id="itemsPerPage"
//               value={pagination.itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               {[10, 20, 50, 100, 200, 250].map(num => (
//                 <option key={num} value={num}>{num}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             « First
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage - 1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             ‹ Previous
//           </button>

//           <span className="px-3 py-1 text-sm">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </span>

//           <button
//             onClick={() => handlePageChange(pagination.currentPage + 1)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next ›
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.totalPages)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Last »
//           </button>
//         </div>
//       </div>

//       {/* Policy Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insured Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Reg No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
//                 {activeTab === "all" && (
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Premium</th>
//                 )}
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentData.length > 0 ? (
//                 currentData.map(renderPolicyRow)
//               ) : (
//                 <tr>
//                   <td colSpan={activeTab === "all" ? 11 : 10} className="px-6 py-4 text-center text-gray-500">
//                     No policies found matching your criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Bottom Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="flex justify-center">
//           <nav className="inline-flex rounded-md shadow">
//             {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//               let pageNum;
//               if (pagination.totalPages <= 5) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage <= 3) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                 pageNum = pagination.totalPages - 4 + i;
//               } else {
//                 pageNum = pagination.currentPage - 2 + i;
//               }

//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => handlePageChange(pageNum)}
//                   className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
//                     pagination.currentPage === pageNum
//                       ? 'bg-blue-500 text-white border-blue-500'
//                       : 'bg-white text-gray-700 hover:bg-gray-50'
//                   } ${pageNum === 1 ? 'rounded-l-md border-l' : ''}
//                   ${pageNum === Math.min(5, pagination.totalPages) ? 'rounded-r-md border-r' : ''}`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PolicyDashboard;

// 111

// import axios from "axios";
// import { useEffect, useState } from "react";
// import VITE_DATA from "../../config/config";
// import TextLoader from "../../loader/TextLoader";

// function PolicyDashboard() {
//   const [policyData, setPolicyData] = useState({
//     monthlyExpiring: [],
//     weeklyExpiring: [],
//     allPolicies: [],
//     totalPolicies: 0,
//     monthlyExpiringCount: 0,
//     weeklyExpiringCount: 0,
//     currentMonthRange: { start: '', end: '' },
//     nextWeekRange: { start: '', end: '' },
//     segments: [],
//     yearlyNetPremium: 0,
//     monthlyNetPremium: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     itemsPerPage: 10,
//     totalItems: 0
//   });
//   const [selectedSegment, setSelectedSegment] = useState("");
//   const [dateRange, setDateRange] = useState({
//     startDate: "",
//     endDate: ""
//   });
//   const [selectedYear, setSelectedYear] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState("");

//   // Generate years from 2020 to current year
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);
//   const months = [
//     { value: "01", label: "January" },
//     { value: "02", label: "February" },
//     { value: "03", label: "March" },
//     { value: "04", label: "April" },
//     { value: "05", label: "May" },
//     { value: "06", label: "June" },
//     { value: "07", label: "July" },
//     { value: "08", label: "August" },
//     { value: "09", label: "September" },
//     { value: "10", label: "October" },
//     { value: "11", label: "November" },
//     { value: "12", label: "December" }
//   ];

//   const isPolicyExpiring = (policy, expiryList) => {
//     if (!policy || !policy._id || !expiryList) return false;
//     try {
//       const policyId = policy._id.toString();
//       return expiryList.some(p => p?._id?.toString() === policyId);
//     } catch (error) {
//       console.error("Error comparing policy IDs:", error);
//       return false;
//     }
//   };

//   const fetchPolicyData = async (page = 1, limit = 10) => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const params = {
//         page,
//         limit,
//         segment: selectedSegment,
//         ...(dateRange.startDate && { startDate: dateRange.startDate }),
//         ...(dateRange.endDate && { endDate: dateRange.endDate }),
//         ...(selectedYear && { year: selectedYear }),
//         ...(selectedMonth && { month: selectedMonth })
//       };

//       const response = await axios.get(`${VITE_DATA}/api/policy/dashboard/get-data`, {
//         headers: {
//           Authorization: `${token}`,
//         },
//         params
//       });

//       setPolicyData({
//         monthlyExpiring: response.data.monthlyExpiring || [],
//         weeklyExpiring: response.data.weeklyExpiring || [],
//         allPolicies: response.data.allPolicies || [],
//         totalPolicies: response.data.totalPolicies || 0,
//         monthlyExpiringCount: response.data.monthlyExpiringCount || 0,
//         weeklyExpiringCount: response.data.weeklyExpiringCount || 0,
//         currentMonthRange: response.data.currentMonthRange || { start: '', end: '' },
//         nextWeekRange: response.data.nextWeekRange || { start: '', end: '' },
//         segments: response.data.segments || [],
//         yearlyNetPremium: response.data.yearlyNetPremium || 0,
//         monthlyNetPremium: response.data.monthlyNetPremium || 0
//       });

//       setPagination({
//         currentPage: response.data.pagination?.currentPage || 1,
//         totalPages: response.data.pagination?.totalPages || 1,
//         itemsPerPage: response.data.pagination?.itemsPerPage || limit,
//         totalItems: response.data.pagination?.totalItems || 0
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error fetching policy data:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch policy data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPolicyData();
//   }, [selectedSegment, dateRange, selectedYear, selectedMonth]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchPolicyData(newPage, pagination.itemsPerPage);
//     }
//   };

//   const handleItemsPerPageChange = (e) => {
//     const newLimit = parseInt(e.target.value);
//     setPagination(prev => ({ ...prev, itemsPerPage: newLimit }));
//     fetchPolicyData(1, newLimit);
//   };

//   const handleSegmentChange = (e) => {
//     setSelectedSegment(e.target.value);
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const handleDateChange = (e) => {
//     const { name, value } = e.target;
//     setDateRange(prev => ({ ...prev, [name]: value }));
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const handleYearChange = (e) => {
//     setSelectedYear(e.target.value);
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const handleMonthChange = (e) => {
//     setSelectedMonth(e.target.value);
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const clearDateFilters = () => {
//     setDateRange({ startDate: "", endDate: "" });
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const clearYearMonthFilters = () => {
//     setSelectedYear("");
//     setSelectedMonth("");
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const renderPolicyRow = (policy) => {
//     const isMonthlyExpiring = isPolicyExpiring(policy, policyData.monthlyExpiring);
//     const isWeeklyExpiring = isPolicyExpiring(policy, policyData.weeklyExpiring);
//     const isExpiring = (activeTab === "monthly" && isMonthlyExpiring) ||
//                       (activeTab === "weekly" && isWeeklyExpiring);

//     return (
//       <tr key={policy._id || Math.random().toString(36).substr(2, 9)} className="hover:bg-gray-50">
//         <td className="py-3 px-4 border">{policy.policyNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.insuredName || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.contactNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.vehRegNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.policyStartDate || "N/A"}</td>
//         <td className={`py-3 px-4 border font-semibold ${isExpiring ? 'text-red-600' : ''}`}>
//           {policy.policyEndDate || "N/A"}
//         </td>
//         <td className="py-3 px-4 border">{policy.company || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.branch || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.segment || "N/A"}</td>
//         <td className="py-3 px-4 border">
//           {isMonthlyExpiring ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
//               This Month
//             </span>
//           ) : isWeeklyExpiring ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
//               Next 7 Days
//             </span>
//           ) : (
//             <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
//               Active
//             </span>
//           )}
//         </td>
//       </tr>
//     );
//   };

//   const getCurrentData = () => {
//     switch (activeTab) {
//       case "monthly":
//         return policyData.monthlyExpiring;
//       case "weekly":
//         return policyData.weeklyExpiring;
//       default:
//         return policyData.allPolicies;
//     }
//   };

//   const currentData = getCurrentData();

//   if (loading) {
//     return <TextLoader />;
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64 gap-4">
//         <p className="text-red-500 text-center">{error}</p>
//         <button
//           onClick={() => fetchPolicyData()}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 sm:ml-48">
//       <h1 className="text-3xl font-bold text-center mb-8">Policy Expiry Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
//           <p className="text-3xl font-bold mt-2">{policyData.totalPolicies.toLocaleString()}</p>
//           {selectedSegment && <p className="text-sm text-gray-500 mt-1">Filtered by: {selectedSegment}</p>}
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "monthly" ? "ring-2 ring-yellow-400" : ""}`}
//           onClick={() => setActiveTab("monthly")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Expiring This Month</h3>
//           <p className="text-3xl font-bold mt-2 text-yellow-600">{policyData.monthlyExpiringCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             {policyData.currentMonthRange.start} to {policyData.currentMonthRange.end}
//           </p>
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "weekly" ? "ring-2 ring-red-400" : ""}`}
//           onClick={() => setActiveTab("weekly")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Expiring Next 7 Days</h3>
//           <p className="text-3xl font-bold mt-2 text-red-600">{policyData.weeklyExpiringCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             {policyData.nextWeekRange.start} to {policyData.nextWeekRange.end}
//           </p>
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "all" ? "ring-2 ring-blue-400" : ""}`}
//           onClick={() => setActiveTab("all")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">All Policies</h3>
//           <p className="text-3xl font-bold mt-2 text-blue-600">{policyData.allPolicies.length.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </p>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Yearly Net Premium</h3>
//           <p className="text-3xl font-bold mt-2 text-green-600">{policyData.yearlyNetPremium.toLocaleString()}</p>
//           {selectedYear && <p className="text-sm text-gray-500 mt-1">Year: {selectedYear}</p>}
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Monthly Net Premium</h3>
//           <p className="text-3xl font-bold mt-2 text-green-600">{policyData.monthlyNetPremium.toLocaleString()}</p>
//           {selectedYear && selectedMonth && (
//             <p className="text-sm text-gray-500 mt-1">
//               {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div className="flex items-center gap-4 flex-wrap">
//           <button
//             onClick={() => fetchPolicyData(pagination.currentPage, pagination.itemsPerPage)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
//             </svg>
//             Refresh
//           </button>

//           <div className="flex items-center">
//             <label htmlFor="segmentFilter" className="mr-2 text-sm text-gray-600">Segment:</label>
//             <select
//               id="segmentFilter"
//               value={selectedSegment}
//               onChange={handleSegmentChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Segments</option>
//               {policyData.segments.map(segment => (
//                 <option key={segment} value={segment}>{segment}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="yearFilter" className="mr-2 text-sm text-gray-600">Year:</label>
//             <select
//               id="yearFilter"
//               value={selectedYear}
//               onChange={handleYearChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Years</option>
//               {years.map(year => (
//                 <option key={year} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="monthFilter" className="mr-2 text-sm text-gray-600">Month:</label>
//             <select
//               id="monthFilter"
//               value={selectedMonth}
//               onChange={handleMonthChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Months</option>
//               {months.map(month => (
//                 <option key={month.value} value={month.value}>{month.label}</option>
//               ))}
//             </select>
//             {(selectedYear || selectedMonth) && (
//               <button
//                 onClick={clearYearMonthFilters}
//                 className="text-red-500 hover:text-red-700 text-sm ml-2"
//               >
//                 Clear
//               </button>
//             )}
//           </div>

//           <div className="flex items-center gap-2">
//             <label htmlFor="startDate" className="text-sm text-gray-600">From:</label>
//             <input
//               type="date"
//               id="startDate"
//               name="startDate"
//               value={dateRange.startDate}
//               onChange={handleDateChange}
//               className="border rounded px-3 py-1 text-sm"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <label htmlFor="endDate" className="text-sm text-gray-600">To:</label>
//             <input
//               type="date"
//               id="endDate"
//               name="endDate"
//               value={dateRange.endDate}
//               onChange={handleDateChange}
//               className="border rounded px-3 py-1 text-sm"
//             />
//             {dateRange.startDate || dateRange.endDate ? (
//               <button
//                 onClick={clearDateFilters}
//                 className="text-red-500 hover:text-red-700 text-sm"
//               >
//                 Clear
//               </button>
//             ) : null}
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">Items per page:</label>
//             <select
//               id="itemsPerPage"
//               value={pagination.itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               {[10, 20, 50, 100, 200, 250].map(num => (
//                 <option key={num} value={num}>{num}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             « First
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage - 1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             ‹ Previous
//           </button>

//           <span className="px-3 py-1 text-sm">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </span>

//           <button
//             onClick={() => handlePageChange(pagination.currentPage + 1)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next ›
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.totalPages)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Last »
//           </button>
//         </div>
//       </div>

//       {/* Policy Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insured Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Reg No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentData.length > 0 ? (
//                 currentData.map(renderPolicyRow)
//               ) : (
//                 <tr>
//                   <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
//                     No policies found matching your criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Bottom Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="flex justify-center">
//           <nav className="inline-flex rounded-md shadow">
//             {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//               let pageNum;
//               if (pagination.totalPages <= 5) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage <= 3) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                 pageNum = pagination.totalPages - 4 + i;
//               } else {
//                 pageNum = pagination.currentPage - 2 + i;
//               }

//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => handlePageChange(pageNum)}
//                   className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
//                     pagination.currentPage === pageNum
//                       ? 'bg-blue-500 text-white border-blue-500'
//                       : 'bg-white text-gray-700 hover:bg-gray-50'
//                   } ${pageNum === 1 ? 'rounded-l-md border-l' : ''}
//                   ${pageNum === Math.min(5, pagination.totalPages) ? 'rounded-r-md border-r' : ''}`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PolicyDashboard;

//222

// import axios from "axios";
// import { useEffect, useState } from "react";
// import VITE_DATA from "../../config/config";
// import TextLoader from "../../loader/TextLoader";

// function PolicyDashboard() {
//   const [policyData, setPolicyData] = useState({
//     monthlyExpiring: [],
//     weeklyExpiring: [],
//     allPolicies: [],
//     totalPolicies: 0,
//     monthlyExpiringCount: 0,
//     weeklyExpiringCount: 0,
//     currentMonthRange: { start: '', end: '' },
//     nextWeekRange: { start: '', end: '' },
//     segments: []
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     itemsPerPage: 10,
//     totalItems: 0
//   });
//   const [selectedSegment, setSelectedSegment] = useState("");
//   const [dateRange, setDateRange] = useState({
//     startDate: "",
//     endDate: ""
//   });

//   const isPolicyExpiring = (policy, expiryList) => {
//     if (!policy || !policy._id || !expiryList) return false;
//     try {
//       const policyId = policy._id.toString();
//       return expiryList.some(p => p?._id?.toString() === policyId);
//     } catch (error) {
//       console.error("Error comparing policy IDs:", error);
//       return false;
//     }
//   };

//   const fetchPolicyData = async (page = 1, limit = 10) => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const params = {
//         page,
//         limit,
//         segment: selectedSegment,
//         ...(dateRange.startDate && { startDate: dateRange.startDate }),
//         ...(dateRange.endDate && { endDate: dateRange.endDate })
//       };

//       const response = await axios.get(`${VITE_DATA}/api/policy/dashboard/get-data`, {
//         headers: {
//           Authorization: `${token}`,
//         },
//         params
//       });

//       setPolicyData({
//         monthlyExpiring: response.data.monthlyExpiring || [],
//         weeklyExpiring: response.data.weeklyExpiring || [],
//         allPolicies: response.data.allPolicies || [],
//         totalPolicies: response.data.totalPolicies || 0,
//         monthlyExpiringCount: response.data.monthlyExpiringCount || 0,
//         weeklyExpiringCount: response.data.weeklyExpiringCount || 0,
//         currentMonthRange: response.data.currentMonthRange || { start: '', end: '' },
//         nextWeekRange: response.data.nextWeekRange || { start: '', end: '' },
//         segments: response.data.segments || []
//       });

//       setPagination({
//         currentPage: response.data.pagination?.currentPage || 1,
//         totalPages: response.data.pagination?.totalPages || 1,
//         itemsPerPage: response.data.pagination?.itemsPerPage || limit,
//         totalItems: response.data.pagination?.totalItems || 0
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error fetching policy data:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch policy data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPolicyData();
//   }, [selectedSegment, dateRange]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchPolicyData(newPage, pagination.itemsPerPage);
//     }
//   };

//   const handleItemsPerPageChange = (e) => {
//     const newLimit = parseInt(e.target.value);
//     setPagination(prev => ({ ...prev, itemsPerPage: newLimit }));
//     fetchPolicyData(1, newLimit);
//   };

//   const handleSegmentChange = (e) => {
//     setSelectedSegment(e.target.value);
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const handleDateChange = (e) => {
//     const { name, value } = e.target;
//     setDateRange(prev => ({ ...prev, [name]: value }));
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const clearDateFilters = () => {
//     setDateRange({ startDate: "", endDate: "" });
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const renderPolicyRow = (policy) => {
//     const isMonthlyExpiring = isPolicyExpiring(policy, policyData.monthlyExpiring);
//     const isWeeklyExpiring = isPolicyExpiring(policy, policyData.weeklyExpiring);
//     const isExpiring = (activeTab === "monthly" && isMonthlyExpiring) ||
//                       (activeTab === "weekly" && isWeeklyExpiring);

//     return (
//       <tr key={policy._id || Math.random().toString(36).substr(2, 9)} className="hover:bg-gray-50">
//         <td className="py-3 px-4 border">{policy.policyNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.insuredName || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.contactNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.vehRegNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.policyStartDate || "N/A"}</td>
//         <td className={`py-3 px-4 border font-semibold ${isExpiring ? 'text-red-600' : ''}`}>
//           {policy.policyEndDate || "N/A"}
//         </td>
//         <td className="py-3 px-4 border">{policy.company || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.branch || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.segment || "N/A"}</td>
//         <td className="py-3 px-4 border">
//           {isMonthlyExpiring ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
//               This Month
//             </span>
//           ) : isWeeklyExpiring ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
//               Next 7 Days
//             </span>
//           ) : (
//             <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
//               Active
//             </span>
//           )}
//         </td>
//       </tr>
//     );
//   };

//   const getCurrentData = () => {
//     switch (activeTab) {
//       case "monthly":
//         return policyData.monthlyExpiring;
//       case "weekly":
//         return policyData.weeklyExpiring;
//       default:
//         return policyData.allPolicies;
//     }
//   };

//   const currentData = getCurrentData();

//   if (loading) {
//     return (
//       // <div className="flex justify-center items-center h-64">
//       //   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       // </div>
//       <TextLoader/>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64 gap-4">
//         <p className="text-red-500 text-center">{error}</p>
//         <button
//           onClick={() => fetchPolicyData()}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 sm:ml-48">
//       <h1 className="text-3xl font-bold text-center mb-8">Policy Expiry Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
//           <p className="text-3xl font-bold mt-2">{policyData.totalPolicies.toLocaleString()}</p>
//           {selectedSegment && <p className="text-sm text-gray-500 mt-1">Filtered by: {selectedSegment}</p>}
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "monthly" ? "ring-2 ring-yellow-400" : ""}`}
//           onClick={() => setActiveTab("monthly")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Expiring This Month</h3>
//           <p className="text-3xl font-bold mt-2 text-yellow-600">{policyData.monthlyExpiringCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             {policyData.currentMonthRange.start} to {policyData.currentMonthRange.end}
//           </p>
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "weekly" ? "ring-2 ring-red-400" : ""}`}
//           onClick={() => setActiveTab("weekly")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Expiring Next 7 Days</h3>
//           <p className="text-3xl font-bold mt-2 text-red-600">{policyData.weeklyExpiringCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             {policyData.nextWeekRange.start} to {policyData.nextWeekRange.end}
//           </p>
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "all" ? "ring-2 ring-blue-400" : ""}`}
//           onClick={() => setActiveTab("all")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">All Policies</h3>
//           <p className="text-3xl font-bold mt-2 text-blue-600">{policyData.allPolicies.length.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </p>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div className="flex items-center gap-4 flex-wrap">
//           <button
//             onClick={() => fetchPolicyData(pagination.currentPage, pagination.itemsPerPage)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
//             </svg>
//             Refresh
//           </button>

//           <div className="flex items-center">
//             <label htmlFor="segmentFilter" className="mr-2 text-sm text-gray-600">Segment:</label>
//             <select
//               id="segmentFilter"
//               value={selectedSegment}
//               onChange={handleSegmentChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Segments</option>
//               {policyData.segments.map(segment => (
//                 <option key={segment} value={segment}>{segment}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center gap-2">
//             <label htmlFor="startDate" className="text-sm text-gray-600">From:</label>
//             <input
//               type="date"
//               id="startDate"
//               name="startDate"
//               value={dateRange.startDate}
//               onChange={handleDateChange}
//               className="border rounded px-3 py-1 text-sm"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <label htmlFor="endDate" className="text-sm text-gray-600">To:</label>
//             <input
//               type="date"
//               id="endDate"
//               name="endDate"
//               value={dateRange.endDate}
//               onChange={handleDateChange}
//               className="border rounded px-3 py-1 text-sm"
//             />
//             {dateRange.startDate || dateRange.endDate ? (
//               <button
//                 onClick={clearDateFilters}
//                 className="text-red-500 hover:text-red-700 text-sm"
//               >
//                 Clear
//               </button>
//             ) : null}
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">Items per page:</label>
//             <select
//               id="itemsPerPage"
//               value={pagination.itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               {[10, 20, 50,100,200,250].map(num => (
//                 <option key={num} value={num}>{num}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             « First
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage - 1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             ‹ Previous
//           </button>

//           <span className="px-3 py-1 text-sm">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </span>

//           <button
//             onClick={() => handlePageChange(pagination.currentPage + 1)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next ›
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.totalPages)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Last »
//           </button>
//         </div>
//       </div>

//       {/* Policy Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insured Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Reg No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentData.length > 0 ? (
//                 currentData.map(renderPolicyRow)
//               ) : (
//                 <tr>
//                   <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
//                     No policies found matching your criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Bottom Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="flex justify-center">
//           <nav className="inline-flex rounded-md shadow">
//             {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//               let pageNum;
//               if (pagination.totalPages <= 5) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage <= 3) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                 pageNum = pagination.totalPages - 4 + i;
//               } else {
//                 pageNum = pagination.currentPage - 2 + i;
//               }

//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => handlePageChange(pageNum)}
//                   className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
//                     pagination.currentPage === pageNum
//                       ? 'bg-blue-500 text-white border-blue-500'
//                       : 'bg-white text-gray-700 hover:bg-gray-50'
//                   } ${pageNum === 1 ? 'rounded-l-md border-l' : ''}
//                   ${pageNum === Math.min(5, pagination.totalPages) ? 'rounded-r-md border-r' : ''}`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PolicyDashboard;

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import VITE_DATA from "../../config/config";


// function PolicyDashboard() {
//   const [policyData, setPolicyData] = useState({
//     monthlyExpiring: [],
//     weeklyExpiring: [],
//     allPolicies: [],
//     totalPolicies: 0,
//     monthlyExpiringCount: 0,
//     weeklyExpiringCount: 0,
//     currentMonthRange: { start: '', end: '' },
//     nextWeekRange: { start: '', end: '' },
//     segments: []
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     itemsPerPage: 10,
//     totalItems: 0
//   });
//   const [selectedSegment, setSelectedSegment] = useState("");

//   // Helper function to safely compare policy IDs
//   const isPolicyExpiring = (policy, expiryList) => {
//     if (!policy || !policy._id || !expiryList) return false;
//     try {
//       const policyId = policy._id.toString();
//       return expiryList.some(p => p?._id?.toString() === policyId);
//     } catch (error) {
//       console.error("Error comparing policy IDs:", error);
//       return false;
//     }
//   };

//   const fetchPolicyData = async (page = 1, limit = 10) => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       // Create params object with all possible parameters
//       const params = {
//         page,
//         limit,
//         segment: selectedSegment,
//       };

//       const response = await axios.get(`${VITE_DATA}/api/policy/dashboard/get-data`, {
//         headers: {
//           Authorization: `${token}`,
//         },
//         params
//       });

//       setPolicyData({
//         monthlyExpiring: response.data.monthlyExpiring || [],
//         weeklyExpiring: response.data.weeklyExpiring || [],
//         allPolicies: response.data.allPolicies || [],
//         totalPolicies: response.data.totalPolicies || 0,
//         monthlyExpiringCount: response.data.monthlyExpiringCount || 0,
//         weeklyExpiringCount: response.data.weeklyExpiringCount || 0,
//         currentMonthRange: response.data.currentMonthRange || { start: '', end: '' },
//         nextWeekRange: response.data.nextWeekRange || { start: '', end: '' },
//         segments: response.data.segments || []
//       });

//       setPagination({
//         currentPage: response.data.pagination?.currentPage || 1,
//         totalPages: response.data.pagination?.totalPages || 1,
//         itemsPerPage: response.data.pagination?.itemsPerPage || limit,
//         totalItems: response.data.pagination?.totalItems || 0
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error fetching policy data:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch policy data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPolicyData();
//   }, [selectedSegment]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchPolicyData(newPage, pagination.itemsPerPage);
//     }
//   };

//   const handleItemsPerPageChange = (e) => {
//     const newLimit = parseInt(e.target.value);
//     setPagination(prev => ({ ...prev, itemsPerPage: newLimit }));
//     fetchPolicyData(1, newLimit);
//   };

//   const handleSegmentChange = (e) => {
//     setSelectedSegment(e.target.value);
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   const renderPolicyRow = (policy) => {
//     const isMonthlyExpiring = isPolicyExpiring(policy, policyData.monthlyExpiring);
//     const isWeeklyExpiring = isPolicyExpiring(policy, policyData.weeklyExpiring);
//     const isExpiring = (activeTab === "monthly" && isMonthlyExpiring) ||
//                       (activeTab === "weekly" && isWeeklyExpiring);

//     return (
//       <tr key={policy._id || Math.random().toString(36).substr(2, 9)} className="hover:bg-gray-50">
//         <td className="py-3 px-4 border">{policy.policyNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.insuredName || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.contactNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.vehRegNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.policyStartDate || "N/A"}</td>
//         <td className={`py-3 px-4 border font-semibold ${isExpiring ? 'text-red-600' : ''}`}>
//           {policy.policyEndDate || "N/A"}
//         </td>
//         <td className="py-3 px-4 border">{policy.company || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.branch || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.segment || "N/A"}</td>
//         <td className="py-3 px-4 border">
//           {isMonthlyExpiring ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
//               This Month
//             </span>
//           ) : isWeeklyExpiring ? (
//             <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
//               Next 7 Days
//             </span>
//           ) : (
//             <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
//               Active
//             </span>
//           )}
//         </td>
//       </tr>
//     );
//   };

//   const getCurrentData = () => {
//     switch (activeTab) {
//       case "monthly":
//         return policyData.monthlyExpiring;
//       case "weekly":
//         return policyData.weeklyExpiring;
//       default:
//         return policyData.allPolicies;
//     }
//   };

//   const currentData = getCurrentData();

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64 gap-4">
//         <p className="text-red-500 text-center">{error}</p>
//         <button
//           onClick={() => fetchPolicyData()}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 sm:ml-48">
//       <h1 className="text-3xl font-bold text-center mb-8">Policy Expiry Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
//           <p className="text-3xl font-bold mt-2">{policyData.totalPolicies.toLocaleString()}</p>
//           {selectedSegment && <p className="text-sm text-gray-500 mt-1">Filtered by: {selectedSegment}</p>}
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "monthly" ? "ring-2 ring-yellow-400" : ""}`}
//           onClick={() => setActiveTab("monthly")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Expiring This Month</h3>
//           <p className="text-3xl font-bold mt-2 text-yellow-600">{policyData.monthlyExpiringCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             {policyData.currentMonthRange.start} to {policyData.currentMonthRange.end}
//           </p>
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "weekly" ? "ring-2 ring-red-400" : ""}`}
//           onClick={() => setActiveTab("weekly")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Expiring Next 7 Days</h3>
//           <p className="text-3xl font-bold mt-2 text-red-600">{policyData.weeklyExpiringCount.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             {policyData.nextWeekRange.start} to {policyData.nextWeekRange.end}
//           </p>
//         </div>

//         <div
//           className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${activeTab === "all" ? "ring-2 ring-blue-400" : ""}`}
//           onClick={() => setActiveTab("all")}
//         >
//           <h3 className="text-lg font-semibold text-gray-700">All Policies</h3>
//           <p className="text-3xl font-bold mt-2 text-blue-600">{policyData.allPolicies.length.toLocaleString()}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </p>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div className="flex items-center gap-4 flex-wrap">
//           <button
//             onClick={() => fetchPolicyData(pagination.currentPage, pagination.itemsPerPage)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
//             </svg>
//             Refresh
//           </button>

//           <div className="flex items-center">
//             <label htmlFor="segmentFilter" className="mr-2 text-sm text-gray-600">Segment:</label>
//             <select
//               id="segmentFilter"
//               value={selectedSegment}
//               onChange={handleSegmentChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="">All Segments</option>
//               {policyData.segments.map(segment => (
//                 <option key={segment} value={segment}>{segment}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center">
//             <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">Items per page:</label>
//             <select
//               id="itemsPerPage"
//               value={pagination.itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               {[5, 10, 20, 50].map(num => (
//                 <option key={num} value={num}>{num}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handlePageChange(1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             « First
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.currentPage - 1)}
//             disabled={pagination.currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             ‹ Previous
//           </button>

//           <span className="px-3 py-1 text-sm">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </span>

//           <button
//             onClick={() => handlePageChange(pagination.currentPage + 1)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next ›
//           </button>
//           <button
//             onClick={() => handlePageChange(pagination.totalPages)}
//             disabled={pagination.currentPage === pagination.totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Last »
//           </button>
//         </div>
//       </div>

//       {/* Policy Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insured Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Reg No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentData.length > 0 ? (
//                 currentData.map(renderPolicyRow)
//               ) : (
//                 <tr>
//                   <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
//                     No policies found matching your criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Bottom Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="flex justify-center">
//           <nav className="inline-flex rounded-md shadow">
//             {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//               let pageNum;
//               if (pagination.totalPages <= 5) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage <= 3) {
//                 pageNum = i + 1;
//               } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                 pageNum = pagination.totalPages - 4 + i;
//               } else {
//                 pageNum = pagination.currentPage - 2 + i;
//               }

//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => handlePageChange(pageNum)}
//                   className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
//                     pagination.currentPage === pageNum
//                       ? 'bg-blue-500 text-white border-blue-500'
//                       : 'bg-white text-gray-700 hover:bg-gray-50'
//                   } ${pageNum === 1 ? 'rounded-l-md border-l' : ''}
//                   ${pageNum === Math.min(5, pagination.totalPages) ? 'rounded-r-md border-r' : ''}`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PolicyDashboard;
