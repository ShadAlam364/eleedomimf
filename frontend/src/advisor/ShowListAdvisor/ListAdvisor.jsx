//shad code


import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import TextLoader from "../../loader/TextLoader.jsx";
import AdvisorUpdates from "./AdvisorUpdates.jsx";
import VITE_DATA from "../../config/config.jsx";

function ListAdvisor() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [APIData, setAPIData] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    email: "",
    address: ""
  });
  const [sortByIdNumber, setSortByIdNumber] = useState(true); // Sorting active by default

  const name = sessionStorage.getItem("branchName");

  useEffect(() => {
    fetchAdvisors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAdvisors = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Not Authorized yet.. Try again!");
        return;
      }

      const response = await axios.get(`${VITE_DATA}/advisor/all/lists`, {
        headers: { Authorization: token },
        params: { branch: name }
      });
      setAPIData(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch advisors");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      id: "",
      name: "",
      email: "",
      address: ""
    });
  };

  // Sorting function for the numerical part of uniqueId (e.g., "52" from "EIPLADV-00052")
  const sortByIdNumberValue = (data) => {
    return [...data].sort((a, b) => {
      // Extract numerical part after the hyphen
      const getNumber = (id) => {
        if (!id || typeof id !== "string") return Infinity; // Invalid IDs go to the end
        const parts = id.split("-");
        if (parts.length !== 2) return Infinity; // Invalid format
        const num = parseInt(parts[1], 10);
        return isNaN(num) ? Infinity : num; // Handle non-numeric parts
      };
      const numA = getNumber(a.uniqueId);
      const numB = getNumber(b.uniqueId);
      return numA - numB; // Ascending order
    });
  };

  // Apply filters
  const filteredData = APIData.filter(advisor => {
    return (
      advisor.uniqueId?.toLowerCase().includes(filters.id.toLowerCase()) &&
      advisor.advisorname?.toLowerCase().includes(filters.name.toLowerCase()) &&
      advisor.advisoremail?.toLowerCase().includes(filters.email.toLowerCase()) &&
      advisor.advisoraddress?.toLowerCase().includes(filters.address.toLowerCase())
    );
  });

  // Apply sorting if sortByIdNumber is true
  const sortedData = sortByIdNumber ? sortByIdNumberValue(filteredData) : filteredData;

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const exportToExcel = () => {
    try {
      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      const fileName = `${name}_Advisor_Lists`;
      
      const dataToExport = sortedData.map(advisor => [
        advisor.uniqueId,
        advisor.advisorname,
        advisor.advisoremail,
        advisor.advisormobile,
        advisor.advisoraddress,
        advisor.advisortype
      ]);

      const ws = XLSX.utils.aoa_to_sheet([
        ["ID", "Advisor Name", "Email ID", "Mobile No.", "Address", "Payout Type"],
        ...dataToExport
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

  const onDeleteAdvisor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this advisor?")) return;
    
    try {
      await axios.delete(`${VITE_DATA}/advisor/lists/${id}`);
      toast.success("Advisor deleted successfully");
      setAPIData(prev => prev.filter(advisor => advisor._id !== id));
    } catch (error) {
      console.error("Error deleting advisor:", error);
      toast.error("Failed to delete advisor");
    }
  };

  // Toggle sorting
  const handleSortToggle = () => {
    setSortByIdNumber(prev => !prev);
  };

  return (
    <section className="container-fluid relative p-0 sm:ml-48 bg-gray-100">
      <div className="container-fluid flex justify-center p-0.5">
        <div className="w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-2 font-semibold tracking-wider">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <h1 className="text-2xl font-bold text-blue-600">Advisor List</h1>
            <div className="flex space-x-2">
              <button
                onClick={exportToExcel}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
              <NavLink to="/branches/home/advisor/register">
                <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                  Go Back
                </button>
              </NavLink>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID</label>
                  <input
                    type="text"
                    name="id"
                    value={filters.id}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Search ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Search name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="text"
                    name="email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Search email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={filters.address}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Search address"
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Items per page</label>
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
            ) : sortedData.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No advisors found matching your criteria.
              </div>
            ) : (
              <div className="overflow-auto max-h-[calc(100vh-119.6px)]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white sticky top-0">
                    <tr className="bg-blue-700">
                      <th 
                        className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider cursor-pointer"
                        onClick={handleSortToggle}
                      >
                        ID {sortByIdNumber ? "↑" : "↓"}
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Name</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Email</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Mobile</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Address</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Payout Type</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((advisor) => (
                      <tr key={advisor._id} className="hover:bg-blue-200 even:bg-slate-200">
                        <td className="px-3 py-2 whitespace-nowrap">{advisor.uniqueId || "-"}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{advisor.advisorname || "-"}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{advisor.advisoremail || "-"}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{advisor.advisormobile || "-"}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{advisor.advisoraddress || "-"}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{advisor.advisortype || "-"}</td>
                        <td className="px-3 py-2 whitespace-nowrap space-x-1">
                          <button
                            onClick={() => {
                              setSelectedRowId(advisor);
                              setShowUpdatePopup(true);
                            }}
                            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => onDeleteAdvisor(advisor._id)}
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
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

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-2 bg-blue-700 border-t border-gray-200 sm:px-3 rounded-b">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-1 border border-gray-300 text-base font-medium rounded bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-1 border border-gray-300 text-base font-medium rounded bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-base text-white">
                  Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-bold">
                    {Math.min(currentPage * itemsPerPage, sortedData.length)}
                  </span>{" "}
                  of <span className="font-bold">{sortedData.length}</span> advisors
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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

      {showUpdatePopup && selectedRowId && (
        <AdvisorUpdates 
          advisors={selectedRowId} 
          onUpdates={fetchAdvisors} 
          onClose={() => {
            setSelectedRowId(null);
            setShowUpdatePopup(false);
          }} 
        />
      )}
    </section>
  );
}

export default ListAdvisor;











// gaurav code 

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { NavLink } from "react-router-dom";
// import { toast } from "react-toastify";
// import * as XLSX from "xlsx";
// import TextLoader from "../../loader/TextLoader.jsx";
// import AdvisorUpdates from "./AdvisorUpdates.jsx";
// import VITE_DATA from "../../config/config.jsx";

// function ListAdvisor() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [itemsPerPage, setItemsPerPage] = useState(50);
//   const [APIData, setAPIData] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [showUpdatePopup, setShowUpdatePopup] = useState(false);
//   const [selectedRowId, setSelectedRowId] = useState(null);
//   const [filters, setFilters] = useState({
//     id: "",
//     name: "",
//     email: "",
//     address: ""
//   });

//   const name = sessionStorage.getItem("branchName");

//   useEffect(() => {
//     fetchAdvisors();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fetchAdvisors = async () => {
//     setIsLoading(true);
//     try {
//       const token = sessionStorage.getItem("token");
//       if (!token) {
//         toast.error("Not Authorized yet.. Try again!");
//         return;
//       }

//       const response = await axios.get(`${VITE_DATA}/advisor/all/lists`, {
//         headers: { Authorization: token },
//         params: { branch: name }
//       });
//       setAPIData(response.data);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch advisors");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const resetFilters = () => {
//     setFilters({
//       id: "",
//       name: "",
//       email: "",
//       address: ""
//     });
//   };

//   const filteredData = APIData.filter(advisor => {
//     return (
//       advisor.uniqueId?.toLowerCase().includes(filters.id.toLowerCase()) &&
//       advisor.advisorname?.toLowerCase().includes(filters.name.toLowerCase()) &&
//       advisor.advisoremail?.toLowerCase().includes(filters.email.toLowerCase()) &&
//       advisor.advisoraddress?.toLowerCase().includes(filters.address.toLowerCase())
//     );
//   });

//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const exportToExcel = () => {
//     try {
//       const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
//       const fileExtension = ".xlsx";
//       const fileName = `${name}_Advisor_Lists`;
      
//       const dataToExport = APIData.map(advisor => [
//         advisor.uniqueId,
//         advisor.advisorname,
//         advisor.advisoremail,
//         advisor.advisormobile,
//         advisor.advisoraddress,
//         advisor.advisortype
//       ]);

//       const ws = XLSX.utils.aoa_to_sheet([
//         ["ID", "Advisor Name", "Email ID", "Mobile No.", "Address", "Payout Type"],
//         ...dataToExport
//       ]);
      
//       const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
//       const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//       const data = new Blob([excelBuffer], { type: fileType });
//       const url = URL.createObjectURL(data);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", fileName + fileExtension);
//       document.body.appendChild(link);
//       link.click();
//     } catch (error) {
//       console.error("Error exporting to Excel:", error);
//       toast.error("Error exporting to Excel");
//     }
//   };

//   const onDeleteAdvisor = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this advisor?")) return;
    
//     try {
//       await axios.delete(`${VITE_DATA}/advisor/lists/${id}`);
//       toast.success("Advisor deleted successfully");
//       setAPIData(prev => prev.filter(advisor => advisor._id !== id));
//     } catch (error) {
//       console.error("Error deleting advisor:", error);
//       toast.error("Failed to delete advisor");
//     }
//   };

//   return (
//     <section className="container-fluid relative p-0 sm:ml-48 bg-gray-100">
//       <div className="container-fluid flex justify-center p-0.5">
//         <div className="w-full">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-2 font-semibold tracking-wider">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               {showFilters ? "Hide Filters" : "Show Filters"}
//             </button>
//             <h1 className="text-2xl font-bold text-blue-600">Advisor List</h1>
//             <div className="flex space-x-2">
//               <button
//                 onClick={exportToExcel}
//                 className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
//               >
//                 <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 Export
//               </button>
//               <NavLink to="/branches/home/advisor/register">
//                 <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
//                   Go Back
//                 </button>
//               </NavLink>
//             </div>
//           </div>

//           {/* Filters Panel */}
//           {showFilters && (
//             <div className="bg-white p-4 rounded-lg shadow mb-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">ID</label>
//                   <input
//                     type="text"
//                     name="id"
//                     value={filters.id}
//                     onChange={handleFilterChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                     placeholder="Search ID"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={filters.name}
//                     onChange={handleFilterChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                     placeholder="Search name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <input
//                     type="text"
//                     name="email"
//                     value={filters.email}
//                     onChange={handleFilterChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                     placeholder="Search email"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Address</label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={filters.address}
//                     onChange={handleFilterChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                     placeholder="Search address"
//                   />
//                 </div>
//                 <div className="flex items-end space-x-2">
//                   <div className="flex-1">
//                     <label className="block text-sm font-medium text-gray-700">Items per page</label>
//                     <select
//                       value={itemsPerPage}
//                       onChange={(e) => setItemsPerPage(Number(e.target.value))}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                     >
//                       <option value="50">50</option>
//                       <option value="100">100</option>
//                       <option value="200">200</option>
//                       <option value="500">500</option>
//                       <option value="1000">1000</option>
//                     </select>
//                   </div>
//                   <button
//                     onClick={resetFilters}
//                     className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Data Table */}
//           <div className="bg-white rounded shadow overflow-hidden">
//             {isLoading ? (
//               <TextLoader />
//             ) : filteredData.length === 0 ? (
//               <div className="p-8 text-center text-gray-500">
//                 No advisors found matching your criteria.
//               </div>
//             ) : (
//               <div className="overflow-auto max-h-[calc(100vh-119.6px)]">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-white sticky top-0">
//                     <tr className="bg-blue-700">
//                       <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">ID</th>
//                       <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Name</th>
//                       <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Email</th>
//                       <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Mobile</th>
//                       <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Address</th>
//                       <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Payout Type</th>
//                       <th className="px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {paginatedData.map((advisor) => (
//                       <tr key={advisor._id} className="hover:bg-blue-200 even:bg-slate-200">
//                         <td className="px-3 py-2 whitespace-nowrap">{advisor.uniqueId || "-"}</td>
//                         <td className="px-3 py-2 whitespace-nowrap">{advisor.advisorname || "-"}</td>
//                         <td className="px-3 py-2 whitespace-nowrap">{advisor.advisoremail || "-"}</td>
//                         <td className="px-3 py-2 whitespace-nowrap">{advisor.advisormobile || "-"}</td>
//                         <td className="px-3 py-2 whitespace-nowrap">{advisor.advisoraddress || "-"}</td>
//                         <td className="px-3 py-2 whitespace-nowrap">{advisor.advisortype || "-"}</td>
//                         <td className="px-3 py-2 whitespace-nowrap space-x-1">
//                           <button
//                             onClick={() => {
//                               setSelectedRowId(advisor);
//                               setShowUpdatePopup(true);
//                             }}
//                             className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
//                           >
//                             Update
//                           </button>
//                           <button
//                             onClick={() => onDeleteAdvisor(advisor._id)}
//                             className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-between px-4 py-2 bg-blue-700 border-t border-gray-200 sm:px-3 rounded-b">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="relative inline-flex items-center px-4 py-1 border border-gray-300 text-base font-medium rounded bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages}
//                 className="ml-3 relative inline-flex items-center px-4 py-1 border border-gray-300 text-base font-medium rounded bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-base text-white">
//                   Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
//                   <span className="font-bold">
//                     {Math.min(currentPage * itemsPerPage, filteredData.length)}
//                   </span>{" "}
//                   of <span className="font-bold">{filteredData.length}</span> advisors
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                     disabled={currentPage === 1}
//                     className="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-base font-medium hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">Previous</span>
//                     Previous
//                   </button>
                  
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
                    
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`relative inline-flex items-center px-4 py-1 border text-base font-medium ${
//                           currentPage === pageNum
//                             ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
//                             : "bg-white border-gray-300 hover:bg-gray-50"
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
                  
//                   <button
//                     onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                     disabled={currentPage === totalPages}
//                     className="relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-base font-medium tracking-wider hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">Next</span>
//                     Next
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showUpdatePopup && selectedRowId && (
//         <AdvisorUpdates 
//           advisors={selectedRowId} 
//           onUpdates={fetchAdvisors} 
//           onClose={() => {
//             setSelectedRowId(null);
//             setShowUpdatePopup(false);
//           }} 
//         />
//       )}
//     </section>
//   );
// }

// export default ListAdvisor;