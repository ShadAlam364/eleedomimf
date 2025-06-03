/* eslint-disable react-hooks/exhaustive-deps */
// 888
import axios from "axios";
import { useEffect, useState } from "react";
import VITE_DATA from "../../config/config";
import TextLoader from "../../loader/TextLoader";

function NewDashboard() {
  const [policyData, setPolicyData] = useState({
    monthlyExpiring: [],
    weeklyExpiring: [],
    allPolicies: [],
    totalPolicies: 0,
    monthlyExpiringCount: 0,
    weeklyExpiringCount: 0,
    currentMonthRange: { start: "", end: "" },
    nextWeekRange: { start: "", end: "" },
    segments: [],
    yearlyNetPremium: 0,
    monthlyNetPremium: 0,
    totalNetPremium: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [selectedSegment, setSelectedSegment] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Generate years from 2020 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);
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

  const isPolicyExpiring = (policy, expiryList) => {
    if (!policy || !policy._id || !expiryList) return false;
    try {
      const policyId = policy._id.toString();
      return expiryList.some((p) => p?._id?.toString() === policyId);
    } catch (error) {
      console.error("Error comparing policy IDs:", error);
      return false;
    }
  };

  const fetchPolicyData = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const params = {
        page,
        limit,
        segment: selectedSegment,
        ...(dateRange.startDate && { startDate: dateRange.startDate }),
        ...(dateRange.endDate && { endDate: dateRange.endDate }),
        ...(selectedYear && { year: selectedYear }),
        ...(selectedMonth && { month: selectedMonth }),
      };

      const response = await axios.get(`${VITE_DATA}/new/dashboard/getnewdashboarddata`, {
        headers: {
          Authorization: `${token}`,
        },
        params,
      });

      setPolicyData({
        monthlyExpiring: response.data.monthlyExpiring || [],
        weeklyExpiring: response.data.weeklyExpiring || [],
        allPolicies: response.data.allPolicies || [],
        totalPolicies: response.data.totalPolicies || 0,
        monthlyExpiringCount: response.data.monthlyExpiringCount || 0,
        weeklyExpiringCount: response.data.weeklyExpiringCount || 0,
        currentMonthRange: response.data.currentMonthRange || { start: "", end: "" },
        nextWeekRange: response.data.nextWeekRange || { start: "", end: "" },
        segments: response.data.segments || [],
        yearlyNetPremium: response.data.yearlyNetPremium || 0,
        monthlyNetPremium: response.data.monthlyNetPremium || 0,
        totalNetPremium: response.data.totalNetPremium || 0,
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

  useEffect(() => {
    fetchPolicyData(1, pagination.itemsPerPage);
  }, [selectedSegment, dateRange, selectedYear, selectedMonth]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPolicyData(newPage, pagination.itemsPerPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setPagination((prev) => ({ ...prev, itemsPerPage: newLimit }));
    fetchPolicyData(1, newLimit);
  };

  const handleSegmentChange = (e) => {
    setSelectedSegment(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearDateFilters = () => {
    setDateRange({ startDate: "", endDate: "" });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearYearMonthFilters = () => {
    setSelectedYear("");
    setSelectedMonth("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const renderPolicyRow = (policy) => {
    const isMonthlyExpiring = isPolicyExpiring(policy, policyData.monthlyExpiring);
    const isWeeklyExpiring = isPolicyExpiring(policy, policyData.weeklyExpiring);
    const isExpiring =
      (activeTab === "monthly" && isMonthlyExpiring) || (activeTab === "weekly" && isWeeklyExpiring);

    return (
      <tr key={policy._id || Math.random().toString(36).substr(2, 9)} className="hover:bg-gray-50">
        <td className="py-3 px小さくするために4 border">{policy.policyNo || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.insuredName || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.contactNo || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.vehRegNo || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.policyStartDate || "N/A"}</td>
        <td className={`py-3 px-4 border font-semibold ${isExpiring ? "text-red-600" : ""}`}>
          {policy.policyEndDate || "N/A"}
        </td>
        <td className="py-3 px-4 border">{policy.company || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.branch || "N/A"}</td>
        <td className="py-3 px-4 border">{policy.segment || "N/A"}</td>
        {activeTab === "all" && (
          <td className="py-3 px-4 border">{policy.netPremium?.toLocaleString() || "N/A"}</td>
        )}
        <td className="py-3 px-4 border">
          {isMonthlyExpiring ? (
            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">This Month</span>
          ) : isWeeklyExpiring ? (
            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Next 7 Days</span>
          ) : (
            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>
          )}
        </td>
      </tr>
    );
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case "monthly":
        return policyData.monthlyExpiring;
      case "weekly":
        return policyData.weeklyExpiring;
      default:
        return policyData.allPolicies;
    }
  };

  const currentData = getCurrentData();

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
      <h1 className="text-3xl font-bold text-center mb-8">Policy Expiry Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Policies</h3>
          <p className="text-3xl font-bold mt-2">{policyData.totalPolicies.toLocaleString()}</p>
          {selectedSegment && <p className="text-sm text-gray-500 mt-1">Filtered by: {selectedSegment}</p>}
          {(selectedYear || selectedMonth) && (
            <p className="text-sm text-gray-500 mt-1">
              {selectedMonth ? `${months.find((m) => m.value === selectedMonth)?.label} ` : ""}
              {selectedYear || ""}
            </p>
          )}
        </div>

        <div
          className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
            activeTab === "monthly" ? "ring-2 ring-yellow-400" : ""
          }`}
          onClick={() => setActiveTab("monthly")}
        >
          <h3 className="text-lg font-semibold text-gray-700">Expiring This Month</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-600">
            {policyData.monthlyExpiringCount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {policyData.currentMonthRange.start} to {policyData.currentMonthRange.end}
          </p>
        </div>

        <div
          className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
            activeTab === "weekly" ? "ring-2 ring-red-400" : ""
          }`}
          onClick={() => setActiveTab("weekly")}
        >
          <h3 className="text-lg font-semibold text-gray-700">Expiring Next 7 Days</h3>
          <p className="text-3xl font-bold mt-2 text-red-600">{policyData.weeklyExpiringCount.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">
            {policyData.nextWeekRange.start} to {policyData.nextWeekRange.end}
          </p>
        </div>

        <div
          className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
            activeTab === "all" ? "ring-2 ring-blue-400" : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          <h3 className="text-lg font-semibold text-gray-700">All Policies</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">{policyData.allPolicies.length.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Total Net Premium: {policyData.totalNetPremium.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Yearly Net Premium</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{policyData.yearlyNetPremium.toLocaleString()}</p>
          {selectedYear && <p className="text-sm text-gray-500 mt-1">Year: {selectedYear}</p>}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Monthly Net Premium</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{policyData.monthlyNetPremium.toLocaleString()}</p>
          {selectedYear && selectedMonth && (
            <p className="text-sm text-gray-500 mt-1">
              {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
            </p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => fetchPolicyData(pagination.currentPage, pagination.itemsPerPage)}
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
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 규모의 SVG 아이콘을 표시합니다.0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Refresh
          </button>

          <div className="flex items-center">
            <label htmlFor="segmentFilter" className="mr-2 text-sm text-gray-600">
              Segment:
            </label>
            <select
              id="segmentFilter"
              value={selectedSegment}
              onChange={handleSegmentChange}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="">All Segments</option>
              {policyData.segments.map((segment) => (
                <option key={segment} value={segment}>
                  {segment}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label htmlFor="yearFilter" className="mr-2 text-sm text-gray-600">
              Year:
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
          </div>

          <div className="flex items-center">
            <label htmlFor="monthFilter" className="mr-2 text-sm text-gray-600">
              Month:
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
            {(selectedYear || selectedMonth) && (
              <button
                onClick={clearYearMonthFilters}
                className="text-red-500 hover:text-red-700 text-sm ml-2"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="startDate" className="text-sm text-gray-600">
              From:
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="border rounded px-3 py-1 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="endDate" className="text-sm text-gray-600">
              To:
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="border rounded px-3 py-1 text-sm"
            />
            {dateRange.startDate || dateRange.endDate ? (
              <button
                onClick={clearDateFilters}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Clear
              </button>
            ) : null}
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
              {[10, 20, 50, 100, 200, 250].map((num) => (
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
                  Contact No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Reg No
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
                {activeTab === "all" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Premium
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.length > 0 ? (
                currentData.map(renderPolicyRow)
              ) : (
                <tr>
                  <td
                    colSpan={activeTab === "all" ? 11 : 10}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No policies found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Pagination */}
      {pagination.totalPages > 1 && activeTab === "all" && (
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

export default NewDashboard;
