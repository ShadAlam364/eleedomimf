import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import TextLoader from "../../loader/TextLoader.jsx";
import VITE_DATA from "../../config/config.jsx";

function MasterView() {
  const [allDetailsData, setAllDetailsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    id: "",
    company: "",
    vehRegNo: "",
    insuredName: "",
    policyMadeBy: "",
    policyNo: "",
    advisorName: "",
  });

  const branch = sessionStorage.getItem("branchName");

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch, currentPage, itemsPerPage]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${VITE_DATA}/alldetails/viewdata/branch/hpur`,
        {
          params: {
            branch,
            page: currentPage,
            limit: itemsPerPage,
          },
        }
      );
      const { data, totalItems } = response.data;
      setAllDetailsData(data);
      setTotalItems(totalItems);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      id: "",
      company: "",
      insuredName: "",
      vehRegNo: "",
      policyMadeBy: "",
      policyNo: "",
      advisorName: "",
    });
  };

  const filteredData = allDetailsData.filter((item) => {
    return (
      (item.policyrefno?.toLowerCase().includes(filters.id.toLowerCase()) ||
        !filters.id) &&
      (item.company?.toLowerCase().includes(filters.company.toLowerCase()) ||
        !filters.company) &&
      (item.insuredName
        ?.toLowerCase()
        .includes(filters.insuredName.toLowerCase()) ||
        !filters.insuredName) &&
      (item.staffName
        ?.toLowerCase()
        .includes(filters.policyMadeBy.toLowerCase()) ||
        !filters.policyMadeBy) &&
      (item.policyNo?.toLowerCase().includes(filters.policyNo.toLowerCase()) ||
        !filters.policyNo) &&
      (item.advisorName
        ?.toLowerCase()
        .includes(filters.advisorName.toLowerCase()) ||
        !filters.advisorName) &&
      (!filters.startDate ||
        new Date(item.entryDate) >= new Date(filters.startDate)) &&
      (!filters.endDate ||
        new Date(item.entryDate) <= new Date(filters.endDate))
    );
  });

  const handleInputChange = async (itemId, value) => {
    try {
      const itemToUpdate = allDetailsData.find((item) => item._id === itemId);
      if (!itemToUpdate) return;

      const parsedPercentage = parseFloat(value) || 0;
      if (parsedPercentage === itemToUpdate.cvpercentage) return;

      let advisorPayout, advisorPayable;

      if (
        itemToUpdate.policyType === "COMP" &&
        itemToUpdate.productCode === "PVT-CAR" &&
        itemToUpdate.payoutOn === "OD"
      ) {
        advisorPayout = itemToUpdate.odPremium * (parsedPercentage / 100).toFixed(2);
        advisorPayable = itemToUpdate.finalEntryFields - advisorPayout;
      } else {
        advisorPayout = itemToUpdate.netPremium * (parsedPercentage / 100).toFixed(2);
        advisorPayable = itemToUpdate.finalEntryFields - advisorPayout;
      }

      const updatedItem = {
        ...itemToUpdate,
        cvpercentage: parsedPercentage,
        advisorPayoutAmount: parseFloat(advisorPayout.toFixed(2)),
        advisorPayableAmount: parseFloat(advisorPayable.toFixed(2)),
      };

      setAllDetailsData((prev) =>
        prev.map((item) => (item._id === itemId ? updatedItem : item))
      );

      await axios.put(`${VITE_DATA}/alldetails/update/adv/payout/${itemId}`, {
        cvpercentage: parsedPercentage,
        advisorPayoutAmount: advisorPayout,
        advisorPayableAmount: advisorPayable,
      });

      toast.success("Update Successfully...😊", {
        position: "top-center",
        autoClose: 1000,
      });
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  const exportToExcel = (isMisReport = false) => {
    try {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      const fileName = isMisReport ? `${branch}_executive` : `${branch}_BRANCH`;

      const headers = isMisReport
        ? [
            "Entry Date",
            "Company Name",
            "Policy No",
            "Insured Name",
            "Vehicle Reg No",
            "Make & Model",
            "GVW",
            "C.C",
            "NCB",
            "OD Discount(%)",
            "Seating Capacity",
            "Fuel Type",
            "Product Code",
            "Policy Type",
            "OD Premium",
            "Liability Premium",
            "Net Premium",
            "Final Amount",
            "Branch Name",
            "Advisor Name",
            "Payout On",
            "Advisor Percentage%",
            "Advisor Payout",
            "Advisor Payable Amount",
            "Branch Percentage%",
            "Branch Payout",
            "Branch Payable Amount",
          ]
        : [
            "Reference ID",
            "Entry Date",
            "Branch",
            "Insured Name",
            "Contact No",
            "Policy Made By",
            "State",
            "District",
            "Vehicle Reg No",
            "Segment",
            "Sourcing",
            "Company",
            "Category",
            "Policy Type",
            "Product Code",
            "Policy No",
            "Engine No",
            "Chassis No",
            "OD Premium",
            "Liability Premium",
            "Net Premium",
            "RSA",
            "GST(in Amount)",
            "Final Amount",
            "OD Discount(%)",
            "NCB",
            "Policy Payment Mode",
            "Policy Start Date",
            "Policy End Date",
            "OD Expiry",
            "TP Expiry",
            "IDV",
            "Body Type",
            "Make & Model",
            "MFG Year",
            "Registration Date",
            "Vehicle Age",
            "Fuel Type",
            "GVW",
            "C.C",
            "Advisor Name",
            "Sub Advisor",
            "Payout On",
            "Adivsor %",
            "Advisor Payout",
            "Advisor Payable Amount",
            "Branch Payout %",
            "Branch Payout",
            "Branch Payable Amount",
          ];

      const dataToExport = filteredData.map((row) => {
        return isMisReport
          ? [
              row.entryDate,
              row.company,
              row.policyNo,
              row.insuredName,
              row.vehRegNo,
              row.makeModel,
              row.gvw,
              row.cc,
              row.ncb,
              row.odDiscount,
              row.sitcapacity,
              row.fuel,
              row.productCode,
              row.policyType,
              row.odPremium,
              row.liabilityPremium,
              row.netPremium,
              row.finalEntryFields,
              row.branch,
              row.advisorName,
              row.payoutOn,
              row.cvpercentage,
              row.advisorPayoutAmount,
              row.advisorPayableAmount,
              row.branchpayoutper,
              row.branchPayout,
              row.branchPayableAmount,
            ]
          : [
              row.policyrefno,
              row.entryDate,
              row.branch,
              row.insuredName,
              row.contactNo,
              row.staffName,
              row.states,
              row.district,
              row.vehRegNo,
              row.segment,
              row.sourcing,
              row.company,
              row.category,
              row.policyType,
              row.productCode,
              row.policyNo,
              row.engNo,
              row.chsNo,
              row.odPremium,
              row.liabilityPremium,
              row.netPremium,
              row.rsa,
              row.taxes,
              row.finalEntryFields,
              row.odDiscount,
              row.ncb,
              row.policyPaymentMode,
              row.policyStartDate,
              row.policyEndDate,
              row.odExpiry,
              row.tpExpiry,
              row.idv,
              row.bodyType,
              row.makeModel,
              row.mfgYear,
              row.registrationDate,
              row.vehicleAge,
              row.fuel,
              row.gvw,
              row.cc,
              row.advisorName,
              row.subAdvisor,
              row.payoutOn,
              row.cvpercentage,
              row.advisorPayoutAmount,
              row.advisorPayableAmount,
              row.branchpayoutper,
              row.branchPayout,
              row.branchPayableAmount,
            ];
      });

      const ws = XLSX.utils.aoa_to_sheet([headers, ...dataToExport]);
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

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <section className="container-fluid relative p-0 sm:ml-48 bg-gray-100">
      <div className="container-fluid flex justify-center ">
        <div className="w-full">
          {/* Header */}
          <div className="flex justify-between items-center my-2 font-semibold tracking-wider">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1 ${
                showFilters
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }  text-white rounded hover:bg-blue-700`}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <h1 className="text-2xl font-bold text-blue-600">View Policies</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => exportToExcel(false)}
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
              <button
                onClick={() => exportToExcel(true)}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center"
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
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                MIS Report
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
                    name: "company",
                    label: "Company",
                    placeholder: "Search Company",
                  },
                  {
                    name: "insuredName",
                    label: "Insured Name",
                    placeholder: "Search Name",
                  },
                  {
                    name: "policyMadeBy",
                    label: "Policy Made By",
                    placeholder: "Search Made By",
                  },
                  {
                    name: "vehRegNo",
                    label: "Veh. Reg. No",
                    placeholder: "Search Vehicle Reg. No.",
                  },
                  {
                    name: "policyNo",
                    label: "Policy No",
                    placeholder: "Search Policy No",
                  },
                  {
                    name: "advisorName",
                    label: "Advisor Name",
                    placeholder: "Search Advisor",
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="500">500</option>
                      <option value="1000">1000</option>
                    </select>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
            ) : filteredData.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No policies found matching your criteria.
              </div>
            ) : (
              <div className="overflow-auto max-h-[calc(100vh-123px)]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white sticky top-0">
                    <tr className="bg-blue-700 whitespace-nowrap">
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Ref ID
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Entry Date
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Branch
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Insured Name
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Contact No
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Policy Made By
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        State
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        District
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Vehicle No
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Policy Type
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Product Code
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Segment
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Policy No
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
                        Liability Premium
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Net Premium
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        RSA
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Taxes
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Total Premium
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
                        Start Date
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        End Date
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
                        MFG Year
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Reg Date
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Vehicle Age
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Fuel
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        GVW
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        CC
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
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Payout On
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Payout %
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Payout Amt
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Payable Amt
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Branch Payout %
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Branch Payout
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Branch Payable
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item) => (
                      <tr key={item._id} className="hover:bg-blue-200 even:bg-slate-200">
                        <td className="px-3 py-2 whitespace-nowrap mx-auto">
                          {item.policyrefno}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.entryDate}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.branch}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.insuredName}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.contactNo}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.staffName}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.states}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.district}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.vehRegNo}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.company}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.category}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.policyType}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.productCode}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.segment}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.policyNo}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.engNo}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.chsNo}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.odPremium}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.liabilityPremium}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.netPremium}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.rsa}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.taxes}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.finalEntryFields}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.odDiscount}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.ncb}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.policyPaymentMode}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.policyStartDate}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.policyEndDate}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.odExpiry}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.tpExpiry}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.idv}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.bodyType}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.makeModel}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.mfgYear}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.registrationDate}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.vehicleAge}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.fuel}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.gvw}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.cc}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.advisorName}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.subAdvisor}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {item.inspectionBy}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {item.inspectionID}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {item.inspectionDate}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.payoutOn}
                        </td>
                        <td
                          contentEditable
                          suppressContentEditableWarning
                          className="px-3 py-2 whitespace-nowrap  focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          onBlur={(e) =>
                            handleInputChange(item._id, e.target.innerText)
                          }
                        >
                          {item.cvpercentage}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          ₹ {item.advisorPayoutAmount?.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          ₹ {item.advisorPayableAmount?.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          {item.branchpayoutper}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap mx-auto">
                          ₹ {item.branchPayout?.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap ">
                          ₹ {item.branchPayableAmount?.toFixed(2)}
                        </td>
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
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-1 border border-gray-300 text-base font-medium rounded bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
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
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{" "}
                  of <span className="font-bold">{totalItems}</span> results
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

export default MasterView;
