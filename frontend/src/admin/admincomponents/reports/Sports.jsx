import axios from "axios";
import { useState } from "react";
import VITE_DATA from "../../../config/config";
import { toast } from "react-toastify";

function Sports() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [secret, setSecret] = useState("");
  const [dbtype, setDbtype] = useState("");

  const downloadData = async () => {
    setLoading(true);
    setStatus("Collecting collections for your download...");

    try {
      // Axios request to get the data as a ZIP file
      const response = await axios.get(`${VITE_DATA}/db/api/all/new`, {
        responseType: "blob", // This tells Axios to treat the response as a binary file
        params: {
          secret, // Ensure secret is passed in headers
          dbtype
        },
      });
      if (response.status === 200) {
        // Create a link element to trigger the file download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(response.data); // response.data contains the blob
        link.download = `eleedomimf_collections_${dbtype}.zip`; // Set the download filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setStatus("Download successful!");
      } else {
        setStatus(response.error);
        toast.error(response.error);
      }
    } catch (error) {
      setStatus(`${error.message}`);
      toast.error("Secret Key Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex md:ml-40 justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg text-center w-96">
        <h1 className="text-2xl font-semibold text-gray-800 ">
          Export MongoDB Data
        </h1>
        <div className="flex my-4 flex-col">
          {!loading && status && (
            <p className="text-sm text-green-600 mb-4">{status}</p>
          )}
          <label
            htmlFor="secret-password"
            className="block  text-sm text-start font-medium text-gray-900"
          >
            Secret Key
            <input
              type="secret-password"
              name="secret"
              id="secret-password"
              value={secret}
              onChange={(e) => {
                setSecret(e.target.value);
              }}
              autoComplete="secret-password"
              className="bg-gray-50 border border-gray-300 tracking-wider text-gray-900 rounded block w-full h-12 ps-2"
              placeholder="Enter Secret Key"
              required
            />{" "}
          </label>

          <label
            htmlFor="dbtype"
            className="block mt-4 text-sm text-start font-medium text-gray-900"
          >
           DB Format
            <select
              type="dbtype"
              name="dbtype"
              id="dbtype"
              value={dbtype}
              onChange={(e) => {
                setDbtype(e.target.value);
              }}
              className="bg-gray-50 border border-gray-300 tracking-wider text-gray-900 rounded block w-full h-12 ps-2"
              required
            >
              <option value="">Select DB Format Type</option>
              <option value="json">JSON</option>
              <option value="bson">BSON</option>
            </select>{" "}
          </label>
        </div>
        <button
          onClick={downloadData}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-700 transition duration-200"
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
      </div>
    </div>
  );
}

export default Sports;
