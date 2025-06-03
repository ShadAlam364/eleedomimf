// import { useState, useEffect } from "react";
// // import VITE_DATA from "../../../config/config";
// import DataTable from "react-data-table-component";
// import axios from "axios";

// const PaginatedDataTable = () => {
//   const [data, setData] = useState([]);
//   const [totalRows, setTotalRows] = useState(0);
//   const [perPage] = useState(100); // Items per page
//   const [loading, setLoading] = useState(false);

//   // Fetch paginated data
//   const fetchData = async (page) => {
    
//     try {
//       setLoading(true);
//       const response = await axios.get(`http://localhost:7000/alldetails/view/onload?page=${page}&limit=${perPage}`);
//       setData(response.data.data);
//       setTotalRows(response.data.totalPages * perPage); // Total rows calculation
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching data", error);
//       setLoading(false);
//     }
//   };

//   // Handle page change
//   const handlePageChange = (page) => {
//     fetchData(page);
//   };

//   useEffect(() => {
//     fetchData(1); // Load the first page on initial render
//   }, []);

//   const columns = [
//     {
//       name: "ID",
//       selector: (row) => row._id, // Adjust based on your data structure
//       sortable: true,
//     },
//     {
//       name: "Name",
//       selector: (row) => row.name, // Replace with your data field
//       sortable: true,
//     },
//     {
//       name: "Description",
//       selector: (row) => row.description, // Replace with your data field
//     },
//     {
//       name: "Created At",
//       selector: (row) => new Date(row.createdAt).toLocaleDateString(), // Example field
//     },
//   ];

//   return (
//     <div className="inline-block min-w-full w-full py-0 relative  sm:ml-48">
//       <h1>Paginated Data Table</h1>
//       <DataTable
//         columns={columns}
//         data={data}
//         progressPending={loading}
//         pagination
//         paginationServer
//         paginationTotalRows={totalRows}
//         paginationPerPage={perPage}
//         onChangePage={handlePageChange}
//       />
//     </div>
//   );
// };

// export default PaginatedDataTable;
