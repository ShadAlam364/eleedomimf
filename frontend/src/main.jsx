import React  from "react";
import ReactDOM from "react-dom/client";
import "flowbite";
import { ToastContainer } from "react-toastify";
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from "react-router-dom";
import { router } from "./App/App.jsx";
import "./index.css";
import { AppProvider } from "./context/Context";
// import { AppProvider } from "./context/Context";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          limit={9}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="colored"
        />
        {/* <State /> */}
      </AppProvider>
      </QueryClientProvider>
      </Provider>
  </React.StrictMode>
);



// Modal Component
//eslint-disable-next-line react/prop-types
// const Modal = ({ isVisible, onClose, contextData }) => {
//   if (!isVisible) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-5 rounded-md shadow-lg max-w-3xl w-full max-h-full overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4">Context Data</h2>
//         <pre className="bg-gray-100 p-3 rounded-md overflow-auto">
//           {JSON.stringify(contextData, null, 2)}
//         </pre>
//         <button
//           onClick={onClose}
//           className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// // Main Component
// function State() {
//   const { state } = useAppContext(); // Accessing the context data
//   const [isModalVisible, setModalVisible] = useState(false);

//   const handleOpenModal = () => setModalVisible(true);
//   const handleCloseModal = () => setModalVisible(false);

//   return (
//     <>
//       {/* Modal */}
//       <Modal
//         isVisible={isModalVisible}
//         onClose={handleCloseModal}
//         contextData={state}
//       />

//       {/* Button */}
//       <div className="fixed right-5 bottom-40">
//         <button
//           onClick={handleOpenModal}
//           className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
//         >
//           Show Data
//         </button>
//       </div>
//     </>
//   );
// }
