import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import * as XLSX from "xlsx";
import VITE_DATA from "../../config/config.jsx";
import TextLoader from "../../loader/TextLoader.jsx";
import UpdateOps from "../updateOPS/UpdateOps.jsx";

function AllOpsDetails() {
  const [APIData, setAPIData] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [deletingStaffId, setDeletingStaffId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    id: "",
    branch: "",
    insuredName: "",
    policyMadeBy: "",
  });

  const name = sessionStorage.getItem("opsName");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.error("Not Authorized yet.. Try again!");
          return;
        }
           // Fetch policy data
           const policyResponse = await axios.get(
            `${VITE_DATA}/alldetails/viewdata`,
            {
              headers: { Authorization: token },
              params: {
                page: currentPage,
                limit: itemsPerPage,
              },
            }
          );
          
        const { allList, totalPages, totalCount } = policyResponse.data;
        setAPIData(allList);
        setTotalPages(totalPages);
        setTotalItems(totalCount);
        // Fetch employee data
        const empResponse = await axios.get(`${VITE_DATA}/employees/data`, {
          headers: { Authorization: token },
        });  
        setEmpData(empResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      id: "",
      branch: "",
      insuredName: "",
      policyMadeBy: "",
    });
  };

  const filteredData = APIData.filter((data) => {
    return (
      (data.policyrefno?.toLowerCase().includes(filters.id.toLowerCase()) ||
        !filters.id) &&
      (data.insuredName
        ?.toLowerCase()
        .includes(filters.insuredName.toLowerCase()) ||
        !filters.insuredName) &&
      (data.branch?.toLowerCase().includes(filters.branch.toLowerCase()) ||
        !filters.branch) &&
      (data.staffName
        ?.toLowerCase()
        .includes(filters.policyMadeBy.toLowerCase()) ||
        !filters.policyMadeBy) &&
      (!filters.startDate ||
        new Date(data.entryDate) >= new Date(filters.startDate)) &&
      (!filters.endDate ||
        new Date(data.entryDate) <= new Date(filters.endDate))
    );
  });

  const onUpdatePolicy = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${VITE_DATA}/alldetails/viewdata`, {
        headers: { Authorization: token },
        params: { page: currentPage, limit: itemsPerPage },
      });
      setAPIData(response.data.allList);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update data");
    }
  };

  const confirmDelPolicy = async (id) => {
    try {
      await axios.delete(`${VITE_DATA}/alldetails/deletedata/${id}`);
      toast.success("Policy deleted successfully");
      setAPIData((prev) => prev.filter((data) => data._id !== id));
      setDeletingStaffId(null);
    } catch (error) {
      console.error("Error deleting policy:", error);
      toast.error("Failed to delete policy");
    }
  };

  const exportToExcel = () => {
    try {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      const fileName = name;

      const dataToExport = filteredData.map((data) => [
        data.policyrefno,
        data.entryDate,
        data.branch,
        data.insuredName,
        data.contactNo,
        data.staffName,
        data.currentTime,
        data.empTime,
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
      ]);

      const ws = XLSX.utils.aoa_to_sheet([
        [
          "Reference ID",
          "Entry Date",
          "Branch",
          "Insured Name",
          "Mobile No.",
          "Policy Made By",
          "Receive Time",
          "Update Time",
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
        ],
        ...dataToExport,
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
      console.error("Export error:", error);
      toast.error("Export failed");
    }
  };
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <section className="container-fluid relative p-0 sm:ml-44 bg-gray-100">
    <div className="container-fluid flex justify-center">
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center py-1.5 font-semibold tracking-wider">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-1 ${
              showFilters
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white rounded`}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <h1 className="text-2xl font-bold text-blue-600 ">Policy Assigned List</h1>
          <div className="flex space-x-2">
            <button
              onClick={exportToExcel}
              className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
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
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
  
              {[
                {
                  name: "id",
                  label: "Reference ID",
                  placeholder: "Search ID",
                },
                {
                  name: "insuredName",
                  label: "Insured Name",
                  placeholder: "Search name",
                },
                {
                  name: "branch",
                  label: "Branch",
                  placeholder: "Search branch",
                },
                {
                  name: "policyMadeBy",
                  label: "Policy Made By",
                  placeholder: "Search staff",
                },
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={filters[field.name]}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
  
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
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                  </select>
                </div>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Data Table */}
        <div className="bg-white rounded shadow overflow-hidden">
          {filteredData.length === 0 ? (
            isLoading ? (
              <TextLoader />
            ) : (
              <div className="p-8 text-center text-gray-500">
                No policies found matching your criteria.
              </div>
            )
          ) : (
            <div className="overflow-auto max-h-[calc(100vh-119.6px)]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white sticky top-0">
                  <tr className="bg-blue-700 whitespace-nowrap">
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Update
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Ref ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Entry Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Insured Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                     Veh. Reg No.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                     Reg. Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      MFG Year
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Veh. Age
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Segment
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Sourcing
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Policy Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Product Code
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Fuel
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Contact No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Pol. Made By
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Sent Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                     Update Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Policy No.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Engine No.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Chassis No.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      OD Premium
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Liability Premium
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Net Premium
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      RSA
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Taxes
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Total Premium
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      OD Discount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      NCB
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Payment Mode
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item._id} className="hover:bg-blue-200 odd:bg-slate-200">
                      <td className="px-4 py-2 whitespace-nowrap">
                        <UpdateOps
                          UpdateOps={item}
                          update={onUpdatePolicy}
                          APIData={empData}
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.policyrefno}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.entryDate}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.branch}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.insuredName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.vehRegNo}
                      </td>
                      
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.registrationDate}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.mfgYear}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.vehicleAge} 
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.company}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.category}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.segment}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.sourcing}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.policyType}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.productCode}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.fuel}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.contactNo}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.staffName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.currentTime}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.empTime}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.policyNo}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.engNo}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.chsNo}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                      {item.odPremium ? `₹ ${item.odPremium}`: ``}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                      {item.liabilityPremium ? `₹ ${item.liabilityPremium}`: ``}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                       {item.netPremium ? `₹ ${item.netPremium}`: ``}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                      {item.rsa ? `₹ ${item.rsa}`: ``}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                      {item.taxes ? `₹ ${item.taxes}`: ``}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                      {item.finalEntryFields ? `₹ ${item.finalEntryFields}`: ``}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.odDiscount}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.ncb}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.policyPaymentMode}
                      </td>
                  
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setDeletingStaffId(item._id)}
                          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded text-sm px-2 py-1 text-center">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
  
        {/* Delete Confirmation Modal */}
        {deletingStaffId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded max-w-md w-full tracking-wider">
              <h3 className="text-lg text-center font-medium text-blue-700 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-800 font-semibold mb-6">
                Are you sure you want to delete policy {" "}
                <span className="font-bold">
                  {APIData.find((d) => d._id === deletingStaffId)?.policyrefno}
                </span>
               {" "} ?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeletingStaffId(null)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelPolicy(deletingStaffId)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-2 bg-blue-700 border-t border-gray-200 sm:px-4 rounded-b">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-1 border border-gray-300 text-base font-medium rounded bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
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
                  {startItem}
                </span>{" "}
                to{" "}
                <span className="font-bold">
                  {endItem}
                </span>{" "}
                of <span className="font-bold">{totalItems}</span> records
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
                  className="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-base font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
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
                      className={`relative inline-flex items-center px-4 py-1 border text-base font-medium ${
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

export default AllOpsDetails;
