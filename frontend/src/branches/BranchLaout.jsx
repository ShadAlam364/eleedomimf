import axios from "axios";
import { useState } from "react";
import VITE_DATA from "../config/config";
import { toast } from "react-toastify";
function BranchLaout() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    
    const downloadData = async () => {
      setLoading(true);
      setStatus("Collecting collections for your download...");
  
      try {
        // Axios request to get the data as a ZIP file
        const response = await axios.get(`${VITE_DATA}/api/policy/collection`, {
          responseType: "blob", // This tells Axios to treat the response as a binary file
        });
  
        // Create a link element to trigger the file download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(response.data); // response.data contains the blob
        link.download = "mongoose.zip"; // Set the download filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        setStatus("Download successful!");
      } catch (error) {
        setStatus("Error during the export. Please try again.");
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Export MongoDB Data
          </h1>
          <p className="text-gray-600 mb-6">
            Click the button below to download the MongoDB data as a ZIP file.
          </p>
  
          <button
            onClick={downloadData}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? "Processing..." : "Download Data"}
          </button>
  
          {loading && (
            <div className="mt-4">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid border-blue-500 border-t-transparent rounded-full"></div>
              <p className="text-sm text-gray-600 mt-2">{status}</p>
            </div>
          )}
  
          {!loading && status && (
            <p className="text-sm text-green-600 mt-4">{status}</p>
          )}
        </div>
      </div>
    );
}

export default BranchLaout;
