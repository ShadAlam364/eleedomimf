/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import VITE_DATA from "../../config/config";
import TextLoader from "../../loader/TextLoader";
import _ from "lodash"; // Import lodash for debouncing

function BranchPolicyRenewDashboard() {
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
  const [selectedStatus, setSelectedStatus] = useState(""); // For tab filtering

  const years = Array.from(
    { length: currentYear - 2019 + 5 },
    (_, i) => 2020 + i
  );
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

  const fetchPolicyData = async (
    page = 1,
    limit = 10,
    search = searchTerm,
    status = selectedStatus
  ) => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const branchName = sessionStorage.getItem("branchName"); // Retrieve branchName from session
      if (!token) {
        throw new Error("No authentication token found");
      }
      if (!branchName) {
        throw new Error("No branch found in session. Please log in again.");
      }

      const params = {
        page,
        limit,
        branch: branchName, // Add branchName to query parameters
        ...(selectedYear && { year: selectedYear }),
        ...(selectedMonth && { month: selectedMonth }),
        ...(search && { policyNo: search }),
        ...(status && { status }),
      };

      const response = await axios.get(
        `${VITE_DATA}/api/policy/dashboard/get-data`,
        {
          headers: {
            Authorization: `${token}`,
          },
          params,
        }
      );

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
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch policy data"
      );
    } finally {
      setLoading(false);
    }
  };

  const updatePolicyStatus = async (policyId, status) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `${VITE_DATA}/api/policy/update-status`,
        { policyId, status },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      fetchPolicyData(
        pagination.currentPage,
        pagination.itemsPerPage,
        searchTerm,
        selectedStatus
      );
    } catch (err) {
      console.error("Error updating policy status:", err);
      setError(err.response?.data?.message || "Failed to update status");
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
      fetchPolicyData(
        newPage,
        pagination.itemsPerPage,
        searchTerm,
        selectedStatus
      );
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

  const handleStatusChange = (policyId, newStatus) => {
    updatePolicyStatus(policyId, newStatus);
  };

  const renderPolicyRow = (policy) => {
    return (
      <tr
        key={policy._id || Math.random().toString(36).substr(2, 9)}
        className="hover:bg-gray-50"
      >
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
        <td className="py-3 px-4 border">
          {policy.netPremium?.toLocaleString() || "N/A"}
        </td>
        <td className="py-3 px-4 border">
          {policy.idv?.toLocaleString() || "N/A"}
        </td>
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
        <td className="py-3 px-4 border">
          <select
            value={policy.status}
            onChange={(e) => handleStatusChange(policy._id, e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
      <h1 className="text-3xl font-bold text-center mb-8">
        Policy Renewable Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["All", ...statusOptions.map((opt) => opt.value)].map((status) => (
          <button
            key={status}
            onClick={() => {
              setSelectedStatus(status === "All" ? "" : status);
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedStatus === (status === "All" ? "" : status)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
        <p className="text-3xl font-bold mt-2">
          {policyData.totalPolicies.toLocaleString()}
        </p>
        <p className="text-xl text-gray-900 mt-1 font-bold">
          {selectedStatus && `Status: ${selectedStatus} | `}
          Expiring in{" "}
          {selectedMonth
            ? `${months.find((m) => m.value === selectedMonth)?.label} `
            : ""}
          {selectedYear || ""}
          {searchTerm && ` (Filtered by Policy No: ${searchTerm})`}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() =>
              fetchPolicyData(
                pagination.currentPage,
                pagination.itemsPerPage,
                searchTerm,
                selectedStatus
              )
            }
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
            <label
              htmlFor="searchFilter"
              className="mr-2 text-sm text-gray-600"
            >
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
            {(selectedMonth !== currentMonth ||
              selectedYear !== currentYear.toString() ||
              searchTerm ||
              selectedStatus) && (
              <button
                onClick={clearFilters}
                className="text-red-500 hover:text-red-700 text-sm ml-2"
              >
                Reset to Current
              </button>
            )}
          </div>

          <div className="flex items-center">
            <label
              htmlFor="itemsPerPage"
              className="mr-2 text-sm text-gray-600"
            >
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status Update
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policyData.allPolicies.length > 0 ? (
                policyData.allPolicies.map(renderPolicyRow)
              ) : (
                <tr>
                  <td
                    colSpan={15}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No policies found matching the criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (
                  pagination.currentPage >=
                  pagination.totalPages - 2
                ) {
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
                  ${
                    pageNum === Math.min(5, pagination.totalPages)
                      ? "rounded-r-md border-r"
                      : ""
                  }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

export default BranchPolicyRenewDashboard;














//20-05-2025
// import axios from "axios";
// import { useEffect, useState, useCallback } from "react";
// import VITE_DATA from "../../config/config";
// import TextLoader from "../../loader/TextLoader";
// // import UpdateMaster from "../admincomponents/MasterForm/UpdateMaster";
// import _ from "lodash"; // Import lodash for debouncing

// function BranchPolicyRenewDashboard() {
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");

//   const [policyData, setPolicyData] = useState({
//     allPolicies: [],
//     totalPolicies: 0,
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
//   //   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   //   const [selectedPolicy, setSelectedPolicy] = useState(null);
//   const [selectedStatus, setSelectedStatus] = useState(""); // For tab filtering

//   const years = Array.from(
//     { length: currentYear - 2019 + 5 },
//     (_, i) => 2020 + i
//   );
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

//   const statusOptions = [
//     { value: "Active", label: "Active" },
//     { value: "Renewed", label: "Renewed" },
//     { value: "Loss to Competitor", label: "Loss to Competitor" },
//     { value: "Vehicle Sold", label: "Vehicle Sold" },
//   ];

//   const fetchPolicyData = async (
//     page = 1,
//     limit = 10,
//     search = searchTerm,
//     status = selectedStatus
//   ) => {
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
//         ...(status && { status }),
//       };

//       const response = await axios.get(
//         `${VITE_DATA}/api/policy/dashboard/get-data`,
//         {
//           headers: {
//             Authorization: `${token}`,
//           },
//           params,
//         }
//       );

//       setPolicyData({
//         allPolicies: response.data.allPolicies || [],
//         totalPolicies: response.data.totalPolicies || 0,
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
//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to fetch policy data"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updatePolicyStatus = async (policyId, status) => {
//     try {
//       const token = sessionStorage.getItem("token");
//       await axios.post(
//         `${VITE_DATA}/api/policy/update-status`,
//         { policyId, status },
//         {
//           headers: {
//             Authorization: `${token}`,
//           },
//         }
//       );
//       fetchPolicyData(
//         pagination.currentPage,
//         pagination.itemsPerPage,
//         searchTerm,
//         selectedStatus
//       );
//     } catch (err) {
//       console.error("Error updating policy status:", err);
//       setError(err.response?.data?.message || "Failed to update status");
//     }
//   };

//   const debouncedFetchPolicyData = useCallback(
//     _.debounce((search) => {
//       fetchPolicyData(1, pagination.itemsPerPage, search, selectedStatus);
//     }, 1500),
//     [selectedMonth, selectedYear, pagination.itemsPerPage, selectedStatus]
//   );

//   useEffect(() => {
//     fetchPolicyData(1, pagination.itemsPerPage, searchTerm, selectedStatus);
//   }, [selectedMonth, selectedYear, selectedStatus]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchPolicyData(
//         newPage,
//         pagination.itemsPerPage,
//         searchTerm,
//         selectedStatus
//       );
//     }
//   };

//   const handleItemsPerPageChange = (e) => {
//     const newLimit = parseInt(e.target.value);
//     setPagination((prev) => ({ ...prev, itemsPerPage: newLimit }));
//     fetchPolicyData(1, newLimit, searchTerm, selectedStatus);
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
//     setSelectedStatus("");
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//     fetchPolicyData(1, pagination.itemsPerPage, "", "");
//   };

//   //   const handleUpdateClick = (policy) => {
//   //     setSelectedPolicy(policy);
//   //     setShowUpdateModal(true);
//   //   };

//   //   const handleCloseModal = () => {
//   //     setShowUpdateModal(false);
//   //     setSelectedPolicy(null);
//   //   };

//   //   const handleUpdateSuccess = () => {
//   //     fetchPolicyData(pagination.currentPage, pagination.itemsPerPage, searchTerm, selectedStatus);
//   //   };

//   const handleStatusChange = (policyId, newStatus) => {
//     updatePolicyStatus(policyId, newStatus);
//   };

//   const renderPolicyRow = (policy) => {
//     return (
//       <tr
//         key={policy._id || Math.random().toString(36).substr(2, 9)}
//         className="hover:bg-gray-50"
//       >
//         <td className="py-3 px-4 border">{policy.policyNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.insuredName || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.advisorName || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.contactNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.vehRegNo || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.entryDate || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.policyStartDate || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.policyEndDate || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.company || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.branch || "N/A"}</td>
//         <td className="py-3 px-4 border">{policy.segment || "N/A"}</td>
//         <td className="py-3 px-4 border">
//           {policy.netPremium?.toLocaleString() || "N/A"}
//         </td>
//         <td className="py-3 px-4 border">
//           <span
//             className={`px-2 py-1 rounded-full text-xs ${
//               policy.status === "Renewed"
//                 ? "bg-green-100 text-green-800"
//                 : policy.status === "Loss to Competitor"
//                 ? "bg-red-100 text-red-800"
//                 : policy.status === "Vehicle Sold"
//                 ? "bg-yellow-100 text-yellow-800"
//                 : "bg-blue-100 text-blue-800"
//             }`}
//           >
//             {policy.status === "Pending" ? "Renewable" : policy.status}
//           </span>
//         </td>
//         <td className="py-3 px-4 border">
//           <select
//             value={policy.status}
//             onChange={(e) => handleStatusChange(policy._id, e.target.value)}
//             className="border rounded px-2 py-1 text-sm"
//           >
//             {statusOptions.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         </td>
//         {/* <td className="py-3 px-4 border">
//           <button
//             onClick={() => handleUpdateClick(policy)}
//             className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-3 rounded"
//           >
//             Update
//           </button>
//         </td> */}
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
//       <h1 className="text-3xl font-bold text-center mb-8">
//         Policy Renew Dashboard
//       </h1>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-6">
//         {["All", ...statusOptions.map((opt) => opt.value)].map((status) => (
//           <button
//             key={status}
//             onClick={() => {
//               setSelectedStatus(status === "All" ? "" : status);
//               setPagination((prev) => ({ ...prev, currentPage: 1 }));
//             }}
//             className={`px-4 py-2 rounded-md text-sm font-medium ${
//               selectedStatus === (status === "All" ? "" : status)
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             {status}
//           </button>
//         ))}
//       </div>

//       {/* Summary Card */}
//       <div className="bg-white rounded-lg shadow p-6 mb-8">
//         <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
//         <p className="text-3xl font-bold mt-2">
//           {policyData.totalPolicies.toLocaleString()}
//         </p>
//         <p className="text-sm text-gray-500 mt-1">
//           {selectedStatus && `Status: ${selectedStatus} | `}
//           Expiring in{" "}
//           {selectedMonth
//             ? `${months.find((m) => m.value === selectedMonth)?.label} `
//             : ""}
//           {selectedYear || ""}
//           {searchTerm && ` (Filtered by Policy No: ${searchTerm})`}
//         </p>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div className="flex items-center gap-4 flex-wrap">
//           <button
//             onClick={() =>
//               fetchPolicyData(
//                 pagination.currentPage,
//                 pagination.itemsPerPage,
//                 searchTerm,
//                 selectedStatus
//               )
//             }
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
//             <label
//               htmlFor="searchFilter"
//               className="mr-2 text-sm text-gray-600"
//             >
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
//             {(selectedMonth !== currentMonth ||
//               selectedYear !== currentYear.toString() ||
//               searchTerm ||
//               selectedStatus) && (
//               <button
//                 onClick={clearFilters}
//                 className="text-red-500 hover:text-red-700 text-sm ml-2"
//               >
//                 Reset to Current
//               </button>
//             )}
//           </div>

//           <div className="flex items-center">
//             <label
//               htmlFor="itemsPerPage"
//               className="mr-2 text-sm text-gray-600"
//             >
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
//                   Status Update
//                 </th>
//                 {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Action
//                 </th> */}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {policyData.allPolicies.length > 0 ? (
//                 policyData.allPolicies.map(renderPolicyRow)
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={15}
//                     className="px-6 py-4 text-center text-gray-500"
//                   >
//                     No policies found matching the criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* UpdateMaster Modal */}
//       {/* {showUpdateModal && selectedPolicy && (
//         <UpdateMaster
//           insurance={selectedPolicy}
//           onUpdate={handleUpdateSuccess}
//           onClose={handleCloseModal}
//         />
//       )} */}

//       {/* Bottom Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="flex justify-center">
//           <nav className="inline-flex rounded-md shadow">
//             {Array.from(
//               { length: Math.min(5, pagination.totalPages) },
//               (_, i) => {
//                 let pageNum;
//                 if (pagination.totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (pagination.currentPage <= 3) {
//                   pageNum = i + 1;
//                 } else if (
//                   pagination.currentPage >=
//                   pagination.totalPages - 2
//                 ) {
//                   pageNum = pagination.totalPages - 4 + i;
//                 } else {
//                   pageNum = pagination.currentPage - 2 + i;
//                 }
//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => handlePageChange(pageNum)}
//                     className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
//                       pagination.currentPage === pageNum
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "bg-white text-gray-700 hover:bg-gray-50"
//                     } ${pageNum === 1 ? "rounded-l-md border-l" : ""} 
//                   ${
//                     pageNum === Math.min(5, pagination.totalPages)
//                       ? "rounded-r-md border-r"
//                       : ""
//                   }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               }
//             )}
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// }

// export default BranchPolicyRenewDashboard;
