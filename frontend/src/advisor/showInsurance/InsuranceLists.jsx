import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import TextLoader from "../../loader/TextLoader.jsx";
import VITE_DATA from "../../config/config.jsx";

function InsuranceLists() {
  const [data, setData] = useState({
    policies: [],
    totalCount: 0,
    totalPages: 1,
    policiesLength: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(150);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    policyNo: "",
    insuredName: "",
    vehRegNo: "",
    advisorName: "",
    company: "",
    policyType: "",
  });

  // Table columns configuration
  const tableColumns = [
    { key: "policyrefno", label: "Reference ID" },
    { key: "entryDate", label: "Entry Date" },
    // { key: "branch", label: "Branch" },
    { key: "company", label: "Company" },
    { key: "category", label: "Category" },
    { key: "segment", label: "Segment" },
    { key: "sourcing", label: "Sourcing" },
    { key: "policyNo", label: "Policy No" },
    { key: "insuredName", label: "Insured Name" },
    { key: "contactNo", label: "Contact No" },
    { key: "states", label: "States" },
    { key: "district", label: "District" },
    { key: "vehRegNo", label: "Vehicle Reg No" },
    { key: "policyStartDate", label: "Policy Start" },
    { key: "policyEndDate", label: "Policy End" },
    { key: "odExpiry", label: "OD Expiry" },
    { key: "tpExpiry", label: "TP Expiry" },
    { key: "idv", label: "IDV" },
    { key: "bodyType", label: "Body Type" },
    { key: "makeModel", label: "Make & Model" },
    { key: "mfgYear", label: "MFG Year" },
    { key: "registrationDate", label: "Reg. Date" },
    { key: "vehicleAge", label: "Vehicle Age" },
    { key: "fuel", label: "Fuel Type" },
    { key: "gvw", label: "GVW" },
    { key: "cc", label: "CC" },
    { key: "engNo", label: "Engine No" },
    { key: "chsNo", label: "chassis No" },
    { key: "policyType", label: "Policy Type" },
    { key: "productCode", label: "Product Code" },
    {
      key: "odPremium",
      label: "OD Premium",
      format: (val) => (val ? `₹ ${val}` : ""),
    },
    {
      key: "liabilityPremium",
      label: "Liability Premi.",
      format: (val) => (val ? `₹ ${val}` : ""),
    },
    {
      key: "netPremium",
      label: "Net Premium",
      format: (val) => (val ? `₹ ${val}` : ""),
    },
    {
      key: "finalEntryFields",
      label: "Final Amount",
      format: (val) => (val ? `₹ ${val}` : ""),
    },
    { key: "odDiscount", label: "OD Discount" },
    { key: "ncb", label: "NCB" },
    // { key: "advisorName", label: "Advisor" },
    { key: "subAdvisor", label: "Sub Advisor" },
    { key: "inspectionBy", label: "Insp. By" },
    { key: "inspectionID", label: "Insp. ID" },
    { key: "inspectionDate", label: "Insp. Date" },
    { key: "payoutOn", label: "Payout On" },
    {
      key: "advisorPayoutAmount",
      label: "Adv Payout",
      format: (val) => (val ? `₹ ${val.toFixed(2)}` : ""),
    },
    {
      key: "advisorPayableAmount",
      label: "Adv Pay. Amount",
      format: (val) => (val ? `₹ ${val.toFixed(2)}` : ""),
    },
    // { key: "status", label: "Status" }
  ];

  // Fetch data with pagination and filters
  const fetchData = async (page = 1) => {
    try {
      // setIsLoading(true);
      const token = sessionStorage.getItem("token");
      const advId = sessionStorage.getItem("advId");

      const params = {
        advId,
        page,
        limit: itemsPerPage,
        ...Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== "")
        ),
      };

      const response = await axios.get(`${VITE_DATA}/api/advpolicy`, {
        headers: { Authorization: token },
        params,
      });

      setData(response.data);
      setCurrentPage(page);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
      setIsLoading(false);
      setData({
        policies: [],
        totalCount: 0,
        totalPages: 1,
        policiesLength: 0,
      });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      policyNo: "",
      insuredName: "",
      vehRegNo: "",
      advisorName: "",
      company: "",
      policyType: "",
    });
    setCurrentPage(1);
  };

  const exportToExcel = () => {
    try {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      const fileName = `advisor_policies_${
        new Date().toISOString().split("T")[0]
      }`;

      const dataToExport = data.policies.map((policy) => {
        return tableColumns.map((col) => {
          const value = policy[col.key] || "";
          return col.format ? col.format(value) : value;
        });
      });

      const headers = tableColumns.map((col) => col.label);
      const ws = XLSX.utils.aoa_to_sheet([headers, ...dataToExport]);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: fileType });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName + fileExtension);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Error exporting to Excel");
    }
  };

  // Generate unique values for filter dropdowns
  const uniqueCompanies = [
    ...new Set(data.policies.map((p) => p.company)),
  ].filter(Boolean);
  const uniquePolicyTypes = [
    ...new Set(data.policies.map((p) => p.policyType)),
  ].filter(Boolean);
  const uniqueAdvisors = [
    ...new Set(data.policies.map((p) => p.advisorName)),
  ].filter(Boolean);

  return (
    <section className="container-fluid relative p-0 sm:ml-48 bg-gray-100">
      <div className="container-fluid flex justify-center p-0.5">
        <div className="w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-2 font-semibold tracking-wider">
            <button
              onClick={() => {
                setShowFilters(!showFilters);
                resetFilters();
              }}
              className={`px-3 py-1 ${
                showFilters
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }  text-white rounded `}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <h1 className="text-2xl font-bold text-blue-600">Policy List</h1>
            <div className="flex space-x-2">
              <button
                onClick={exportToExcel}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export
              </button>
              <NavLink to="/advisor/home">
                <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                  Go Back
                </button>
              </NavLink>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Date Range */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={filters.startDate}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                </div>

                {/* Text Search Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Policy No
                  </label>
                  <input
                    type="text"
                    name="policyNo"
                    value={filters.policyNo}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Search policy number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Insured Name
                  </label>
                  <input
                    type="text"
                    name="insuredName"
                    value={filters.insuredName}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Search insured name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle Reg No
                  </label>
                  <input
                    type="text"
                    name="vehRegNo"
                    value={filters.vehRegNo}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Search vehicle number"
                  />
                </div>

                {/* Dropdown Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <select
                    name="company"
                    value={filters.company}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  >
                    <option value="">All Companies</option>
                    {uniqueCompanies.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Policy Type
                  </label>
                  <select
                    name="policyType"
                    value={filters.policyType}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  >
                    <option value="">All Types</option>
                    {uniquePolicyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Advisor
                  </label>
                  <select
                    name="advisorName"
                    value={filters.advisorName}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  >
                    {uniqueAdvisors.map((advisor) => (
                      <option key={advisor} value={advisor}>
                        {advisor}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Items per page and actions */}
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Items per page
                    </label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                      <option value="150">150</option>
                      <option value="200">200</option>
                      <option value="500">500</option>
                      <option value="1000">1000</option>
                    </select>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1.5 text-base tracking-wider bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="bg-white rounded shadow overflow-hidden">
            {isLoading ? (
              <TextLoader />
            ) : data.policies.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No policies found matching your criteria.
              </div>
            ) : (
              <div className="overflow-auto max-h-[calc(100vh-119.6px)]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white sticky top-0">
                    <tr className="bg-blue-700">
                      {tableColumns.map((column) => (
                        <th
                          key={column.key}
                          scope="col"
                          className="px-3 pr-8 py-3 text-left text-sm whitespace-nowrap font-medium text-white uppercase tracking-wider"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-white ">
                    {data.policies.map((policy) => (
                      <tr
                        key={policy._id}
                        className="hover:bg-blue-200 odd:bg-slate-200"
                      >
                        {tableColumns.map((column) => (
                          <td
                            key={`${policy._id}-${column.key}`}
                            className="px-3 pr-8 py-2 whitespace-nowrap "
                          >
                            {column.format
                              ? column.format(policy[column.key] || "")
                              : policy[column.key] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-2 bg-blue-700 border-t border-gray-200 sm:px-3 rounded-b">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => fetchData(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-1 border border-gray-300 text-base font-medium rounded bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchData(currentPage + 1)}
                disabled={currentPage === data.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-1 border border-gray-300 text-base font-medium rounded bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-base text-white">
                  Showing{" "}
                  <span className="font-bold">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold">
                    {Math.min(currentPage * itemsPerPage, data.totalCount)}
                  </span>{" "}
                  of <span className="font-bold">{data.totalCount}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => fetchData(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-base font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    Previous
                  </button>

                  {Array.from(
                    { length: Math.min(5, data.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (data.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= data.totalPages - 2) {
                        pageNum = data.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchData(pageNum)}
                          className={`relative inline-flex items-center px-4 py-1 border text-base font-medium ${
                            currentPage === pageNum
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300  hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() => fetchData(currentPage + 1)}
                    disabled={currentPage === data.totalPages}
                    className="relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-base font-medium tracking-wider hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InsuranceLists;
