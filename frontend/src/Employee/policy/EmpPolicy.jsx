import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import AddPolicyDetail from "./AddPolicyDetail.jsx";
import * as XLSX from "xlsx";
import TextLoader from "../../loader/TextLoader.jsx";
import VITE_DATA from "../../config/config.jsx";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function EmpPolicy() {
  const [APIData, setAPIData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [datasPerPage, setdatasPerPage] = useState(100);
  const [totalPages, setTotalPages] = useState(1);
  const [totaldatas, setTotaldatas] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    policyrefno: "",
    company: "",
    insuredName: "",
    branch: "",
    contactNo: "",
  });

  const debouncedFilters = useDebounce(filters, 600); // 600ms delay
  const empid = sessionStorage.getItem("employeeId");
  const name = sessionStorage.getItem("empname");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Not Authorized yet.. Try again!");
        return;
      }

      // Format dates for API call
      const formattedStartDate = filters.startDate ? filters.startDate : "";
      const formattedEndDate = filters.endDate ? filters.endDate : "";

      const params = {
        page: currentPage,
        limit: datasPerPage,
        ...(filters.startDate && { startDate: formattedStartDate }),
        ...(filters.endDate && { endDate: formattedEndDate }),
        ...(filters.policyrefno && { policyrefno: filters.policyrefno }),
        ...(filters.company && { company: filters.company }),
        ...(filters.insuredName && { insuredName: filters.insuredName }),
        ...(filters.branch && { branch: filters.branch }),
        ...(filters.contactNo && { contactNo: filters.contactNo }),
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === "") {
          delete params[key];
        }
      });

      const response = await axios.get(
        `${VITE_DATA}/alldetails/viewdata/${empid}`,
        {
          headers: { Authorization: token },
          params,
        }
      );

      const { policyBasedonId, totalPages, totalCount } = response.data;
      setAPIData(policyBasedonId);
      setTotalPages(totalPages);
      setTotaldatas(totalCount);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdatePolicy = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const params = {
        page: currentPage,
        limit: datasPerPage,
      };
      const response = await axios.get(
        `${VITE_DATA}/alldetails/viewdata/${empid}`,
        {
          headers: { Authorization: token },
          params,
        }
      );
      const { policyBasedonId, totalPages, totalCount } = response.data;
      setAPIData(policyBasedonId);
      setTotalPages(totalPages);
      setTotaldatas(totalCount);
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update data");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empid, currentPage, datasPerPage, debouncedFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      policyrefno: "",
      company: "",
      insuredName: "",
      branch: "",
      contactNo: "",
    });
    setCurrentPage(1);
  };

  const exportToExcel = () => {
    try {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      const fileName = name || "policy_data";

      const rowsToInclude = APIData.map((data) => [
        data.entryDate,
        data.currentTime,
        data.empTime,
        data.policyrefno,
        data.branch,
        data.insuredName,
        data.contactNo,
        data.staffName,
        data.company,
        data.category,
        data.policyType,
        data.policyNo,
        data.engNo,
        data.chsNo,
        data.odPremium,
        data.liabilityPremium,
        data.netPremium,
        data.taxes,
        data.rsa,
        data.finalEntryFields,
        data.odDiscount,
        data.ncb,
        data.policyPaymentMode,
        data.states,
        data.district,
        data.inspectionBy,
        data.inspectionID,
        data.inspectionDate,
      ]);

      const ws = XLSX.utils.aoa_to_sheet([
        [
          "Entry Date",
          "Receive Time",
          "Update Time",
          "Reference ID",
          "Branch",
          "Insured Name",
          "Mobile No.",
          "Policy Made By",
          "Company",
          "Category",
          "Policy Type",
          "Policy No.",
          "Engine No.",
          "Chassis No",
          "OD Premium",
          "Liability Premium",
          "Net Premium",
          "GST in rupees",
          "RSA",
          "Final Amount",
          "OD Discount(%)",
          "NCB",
          "Policy Payment Mode",
          "State",
          "District",
          "Insp. By",
          "Insp. ID",
          "Insp. Date",
        ],
        ...rowsToInclude,
      ]);

      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
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

  // Calculate the range of datas being displayed
  const startdata = (currentPage - 1) * datasPerPage + 1;
  const enddata = Math.min(currentPage * datasPerPage, totaldatas);

  return (
    <section className="container-fluid relative p-0 sm:ml-48 bg-gray-100">
      <div className="container-fluid flex justify-center">
        <div className="w-full">
          {/* Header */}
          <div className="flex justify-between datas-center pt-1 my-1 font-semibold tracking-wider">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1 ${
                showFilters
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded`}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <h1 className="text-2xl font-bold text-blue-600">
              View All Policies
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={exportToExcel}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex datas-center"
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
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white p-4 rounded shadow mb-4">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {/* Date Range */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      From Date
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
                      To Date
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

                {/* Policy Ref No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reference ID
                  </label>
                  <input
                    type="text"
                    name="policyrefno"
                    value={filters.policyrefno}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Search ID"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={filters.company}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Search company"
                  />
                </div>

                {/* Insured Name */}
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
                    placeholder="Search name"
                  />
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Branch
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={filters.branch}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Search branch"
                  />
                </div>

                {/* Contact No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact No
                  </label>
                  <input
                    type="text"
                    name="contactNo"
                    value={filters.contactNo}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Search contact"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Policy per page
                  </label>
                  <select
                    value={datasPerPage}
                    onChange={(e) => {
                      setdatasPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page when changing datas per page
                    }}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  >
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                    <option value="2000">2000</option>
                  </select>
                </div>
                <div className="flex items-end space-x-2">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="bg-white rounded shadow overflow-hidden">
            {isLoading ? (
              <TextLoader />
            ) : APIData?.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                No records found.
              </div>
            ) : (
              <div className="overflow-auto max-h-[calc(100vh-120px)]">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-white sticky top-0">
                    <tr className="bg-blue-700 whitespace-nowrap">
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Update
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Entry Date
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Received Time
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Updated Time
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Ref ID
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Branch
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Insured Name
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Contact
                      </th>
                      {/* <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Policy Made By
                      </th> */}
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Segment
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Policy Type
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Policy No
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        State
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        RTO
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Reg. No
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Policy Start Date
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Policy End Date
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        OD Expiry
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        TP Expiry
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        IDV
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Body Type
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Make/Model
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        GVW
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Seating Capac.
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        CC
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Fuel Type
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Engine No
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Chassis No
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        OD Premium
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Liability Prem.
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Net Premium
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        GST
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        RSA
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Final Amount
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        OD Discount
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        NCB
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Payment Mode
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Advisor
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Sub Advisor
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Insp. By
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Insp. ID
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Insp. Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {APIData.map((data) => (
                      <tr
                        key={data._id}
                        className="hover:bg-blue-200 even:bg-slate-200"
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                          <AddPolicyDetail
                            insurance={data}
                            fetchData={onUpdatePolicy}
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.entryDate}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.currentTime}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.empTime}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.policyrefno}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.branch}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.insuredName}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.contactNo}
                        </td>
                        {/* <td className="px-3 py-2 whitespace-nowrap">
                          {data.staffName}
                        </td> */}
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.company}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.category}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.segment}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.policyType}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.policyNo}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.states}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.district}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.vehRegNo}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.policyStartDate}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.policyEndDate}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.odExpiry}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.tpExpiry}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.idv}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.bodyType}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.makeModel}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.gvw}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.sitcapacity}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.cc}
                        </td>

                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.fuel}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.engNo}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.chsNo}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.odPremium ? `₹ ${data.odPremium}` : ``}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.liabilityPremium
                            ? `₹ ${data.liabilityPremium}`
                            : ``}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.netPremium ? `₹ ${data.netPremium}` : ``}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.taxes ? `₹ ${data.taxes}` : ``}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.rsa ? `₹ ${data.rsa}` : ``}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.finalEntryFields
                            ? `₹ ${data.finalEntryFields}`
                            : ``}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.odDiscount}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.ncb}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.policyPaymentMode}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.advisorName}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.subAdvisor}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.inspectionBy}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.inspectionID}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {data.inspectionDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex datas-center justify-between px-4 py-2 bg-blue-700 border-t border-gray-200 sm:px-3">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex datas-center px-4 py-1 border border-gray-300 text-base font-medium rounded bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex datas-center px-4 py-1 border border-gray-300 text-base font-medium rounded bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:datas-center sm:justify-between">
              <div>
                <p className="text-base text-white">
                  Showing <span className="font-bold">{startdata}</span> to{" "}
                  <span className="font-bold">{enddata}</span> of{" "}
                  <span className="font-bold">{totaldatas}</span> records
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex datas-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-base font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex datas-center px-4 py-1 border text-base font-medium ${
                          currentPage === pageNum
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex datas-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-base font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
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

export default EmpPolicy;
