import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import TextLoader from "../../../loader/TextLoader.jsx";
import SeparateLetter from "./SeparateLetter.jsx";
import UpdateOfLetter from "./UpdateOfLetter.jsx";
import VITE_DATA from "../../../config/config.jsx";

function ViewOfferLetter() {
  const [APIData, setAPIData] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [showLetter, setshowLetter] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [sendStaffId, setSendStaffId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState();
  const [searchId, setSearchId] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [searchInsuredName, setSearchInsuredName] = useState("");
  const name = sessionStorage.getItem("hrName");
  // popup
  const staffSend = (_id) => {
    setSendStaffId(_id);
  };

  const handleViewClick = (data) => {
    setSelectedRowId(data);
    setshowLetter(true);
    setShowEditPopup(false);
  };

  const handleEditClick = (data) => {
    setSelectedRowId(data);
    setShowEditPopup(true);
    setshowLetter(false);
  };

  const handleClosePopup = () => {
    setSelectedRowId(null);
    setshowLetter(false);
    setShowEditPopup(false);
    // Refresh the data after update
    fetchData();
  };

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Not Authorized yet.. Try again!");
        return;
      }
      const response = await axios.get(`${VITE_DATA}/letters/view/offer`, {
        headers: { Authorization: token }
      });
      setAPIData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setItemsPerPage(20);
  }, []);

  // Handle date range filter change
  const handleDateRangeChange = (event, type) => {
    if (type === "start") {
      setStartDate(event.target.value);
    } else if (type === "end") {
      setEndDate(event.target.value);
    }
  };

  const filteredData = APIData.filter((data) => {
    // Check if data is defined
    if (!data) return false;
    // Filter conditions
    const idLower = data.referenceno?.toLowerCase() || "";
    const designation = data.ofdesignation?.toLowerCase() || "";
    const empnameLower = data.ofname?.toLowerCase() || "";
    return (
      // Filter conditions using optional chaining and nullish coalescing
      (idLower.includes(searchId.toLowerCase()) || searchId === "") &&
      (designation.includes(searchInsuredName.toLowerCase()) ||
        searchInsuredName === "") &&
      (empnameLower.includes(searchBranch.toLowerCase()) ||
        searchBranch === "") &&
      (startDate === "" ||
        new Date(data.empjoiningdate) >= new Date(startDate)) &&
      (endDate === "" || new Date(data.empjoiningdate) <= new Date(endDate))
    );
  });

  // Calculate total number of pages
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate starting and ending indexes of items to be displayed on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const exportToExcel = () => {
    try {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      const fileName = name;
      // Include all sorted data
      const rowsToInclude = APIData.map((data) => [
        data.referenceno,
        data.ofname,
        data.ofemail,
        data.ofmobile,
        data.ofaddress,
        data.ofdesignation,
        data.ofgrosalary,
        data.ofsalaryWords,
        data.ofvalidDate,
      ]);

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet([
        [
          "Reference No",
          "Name",
          "Email ID",
          "Mobile No.",
          "Address",
          "Designation",
          "Gross Salary",
          "Salary in Words",
          "Valid Date",
        ],
        ...rowsToInclude,
      ]);

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
    // exportToPDF();
  };

  // ******************** Delete Functions *************************************/
  const onDeleteOffers = async (_id) => {
    try {
      await axios.delete(`${VITE_DATA}/letters/delete/offer/${_id}`);
      toast.warn("Offer Letter Deleted Successfully...!", {
        theme: "dark",
        position: "top-right",
      });
      setAPIData((prevData) => prevData.filter((data) => data._id !== _id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <section className="container-fluid relative p-0 sm:ml-64 bg-slate-200">
      <div className="container-fluid flex justify-center p-2  border-gray-200 border-dashed rounded  bg-blue-100">
        <div className="inline-block min-w-full w-full py-0">
          <div className="overflow-x-none flex justify-between text-blue-700 pb-4">
            <button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className={`my-auto ${
                isFilterVisible
                  ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700 focus:ring-red-300"
                  : "focus:ring-blue-300 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
              } text-white  hover:bg-gradient-to-br focus:ring-1 focus:outline-none  shadow-lg font-medium rounded tracking-wider text-sm px-3 py-1.5 text-center`}
            >
              {isFilterVisible ? "Hide Filters" : "Show Filters"}
            </button>

            <h1 className="text-3xl font-semibold">Offer Letters</h1>

            <div className="flex">
              <button className="" onClick={handleExportClick}>
                <img src="/excel.png" alt="download" className="w-10" />
              </button>
              <NavLink to="/hr/home/add/offer/letter" className="my-auto ml-2">
                <button
                  type="button"
                  className="text-white whitespace-nowrap justify-end bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded text-sm px-3 py-1 text-center"
                >
                  Go Back
                </button>
              </NavLink>
            </div>
          </div>

          {isFilterVisible && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 p-5 bg-white shadow-md rounded-md text-blue-500 ">
              <div className="flex flex-col relative">
                <label className="text-base text-start font-medium text-blue-700">
                  Date Range:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleDateRangeChange(e, "start")}
                    className="input-style w-full"
                    placeholder="From Date"
                  />
                  <span className="text-sm">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleDateRangeChange(e, "end")}
                    className="input-style w-full"
                    placeholder="To Date"
                  />
                </div>
              </div>

              {[
                {
                  label: "ID",
                  placeholder: "EMPID",
                  onChange: setSearchId,
                  value: searchId,
                },
                {
                  label: "Emp Name",
                  placeholder: "Emp Name",
                  onChange: setSearchBranch,
                  value: searchBranch,
                },
                {
                  label: "Designation",
                  placeholder: "Designation",
                  onChange: setSearchInsuredName,
                  value: searchInsuredName,
                },
              ].map((input, index) => (
                <div className="flex flex-col" key={index}>
                  <label className="text-base text-start font-medium text-blue-700">
                    {input.label}:
                  </label>
                  <input
                    type="search"
                    value={input.value}
                    onChange={(e) => input.onChange(e.target.value)}
                    className="input-style w-full"
                    placeholder={input.placeholder}
                  />
                </div>
              ))}
              <button
                className="absolute top-16 right-2 bg-red-500 text-white px-4 hover:bg-red-700 rounded"
                onClick={() => setIsFilterVisible(false)}
              >
                X
              </button>
            </div>
          )}

          <table className="min-w-full text-center text-sm font-light table bg-blue-200 ">
            {filteredData.length === 0 ? (
              <TextLoader />
            ) : (
              <>
                <thead className="border-b whitespace-nowrap py-4 font-medium bg-slate-200 border border-black  top-16">
                  <tr className="text-blue-700 top-16 my-4 py-4">
                    <th
                      scope="col"
                      className="px-1 py-0 border border-black"
                    >
                      Reference No
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-0 border border-black"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-0 border border-black"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-0 border border-black"
                    >
                      Email ID
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-0 border border-black"
                    >
                      Mobile No.
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-0 border border-black"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-0 border border-black"
                    >
                      Designation
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-0 border border-black"
                    >
                      Gross Salary
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-0 border border-black"
                    >
                      Salary in Words
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-0 border border-black"
                    >
                      Valid Upto
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-0 border border-black"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-0 border border-black"
                    >
                      View Letter
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-0 border border-black"
                    >
                      Update
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-0 border border-black"
                    >
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 overflow-y-hidden">
                  {filteredData
                    .reverse()
                    .slice(startIndex, endIndex)
                    .map((data) => {
                      return (
                        <tr
                          className=":border-neutral-200 text-sm font-medium"
                          key={data._id}
                        >
                          <td className="px-1 py-0 border border-black">
                            {data.referenceno}
                          </td>
                          <td className="px-1 py-0 border border-black">
                            {data.ofdate}
                          </td>
                          <td className="px-1 py-0 whitespace-nowrap border border-black">
                            {data.ofname}
                          </td>
                          <td className="px-1 py-0 border border-black">
                            {data.ofemail}
                          </td>
                          <td className="px-1 py-0 border border-black">
                            {data.ofmobile}
                          </td>
                          <td className="px-1 py-0 whitespace-wrap border border-black">
                            {data.ofaddress}
                          </td>
                          <td className="px-1 py-0 border border-black">
                            {data.ofdesignation}
                          </td>
                          <td className="px-1 py-0 border border-black">
                            {data.ofgrosalary}
                          </td>
                          <td className="px-1 py-0 border border-black">
                            {data.ofsalaryWords}
                          </td>
                          <td className="px-1 py-0 border border-black">
                            {data.ofvalidDate}
                          </td>
                          <td className="px-1 py-0 border border-black">
                            {data.oflocation}
                          </td>
                          <td className="px-1 py-0 border border-black">
                            
                              <button
                                onClick={() => handleViewClick(data)}
                                type="button"
                                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded text-base px-3 py-1 text-center"
                              >
                                View
                              </button>
                              </td>
                              <td className="px-1 py-0 border border-black">
                              <button
                                onClick={() => handleEditClick(data)}
                                type="button"
                                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded text-base px-3 py-1 text-center"
                              >
                                Update
                              </button>
                           
                          </td>
                          <td className="px-1 py-0 border border-black">
                            {/* to enable delete from here */}
                            <button
                              type="button"
                              onClick={() => staffSend(data._id)}
                              className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 font-medium rounded text-base px-2 py-1 my-1 text-center"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </>
            )}
          </table>
          {showLetter && selectedRowId && (
            <SeparateLetter offers={selectedRowId} onClose={handleClosePopup} />
          )}

          {showEditPopup && selectedRowId && (
            <UpdateOfLetter letterId={selectedRowId} onClose={handleClosePopup} />
          )}

          {sendStaffId && (
            <div
              id="popup-modal"
              tabIndex="-1"
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white p-4 rounded-lg ">
                <h2 className="text-lg font-semibold text-gray-800">
                  {" "}
                  {`Are you sure you want to delete `}
                  <span className="text-red-600">
                    {APIData.find((data) => data._id === sendStaffId)?.name}
                  </span>
                  {`?`}
                </h2>
                <div className="flex justify-end mt-10">
                  <button
                    onClick={() => {
                      onDeleteOffers(sendStaffId);
                      setSendStaffId(null);
                    }}
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-1 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-base px-4 mr-2"
                  >
                    Yes, I&apos;m sure
                  </button>
                  <button
                    onClick={() => setSendStaffId(null)}
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-1 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-base font-medium px-4 py-2 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Pagination */}
      <nav aria-label="Page navigation flex example   ">
        <ul className="flex space-x-2 justify-end">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-blue-600 border border-blue-600 bg rounded-l hover:bg-blue-400 hover:text-white"
            >
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => {
            // Display buttons for currentPage and a few surrounding pages
            const showPage =
              i + 1 === 1 ||
              i + 1 === currentPage ||
              i + 1 === totalPages ||
              Math.abs(i + 1 - currentPage) <= 2;
            if (showPage) {
              return (
                <li key={i}>
                  <button
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 ${
                      i + 1 === currentPage
                        ? "bg-green-700 text-white font-bold"
                        : "text-blue-600 hover:bg-blue-400 hover:text-white"
                    } border border-blue-600`}
                  >
                    {i + 1}
                  </button>
                </li>
              );
            }
            return null;
          })}
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-blue-600 border border-blue-600 rounded-r hover:bg-blue-400 hover:text-white"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </section>
  );
}

export default ViewOfferLetter;
