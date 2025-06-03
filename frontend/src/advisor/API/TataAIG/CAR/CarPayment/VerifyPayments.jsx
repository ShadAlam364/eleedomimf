import { useState, useEffect } from "react";
import axios from "axios";
import VITE_DATA from "../../../../../config/config.jsx";
import { toast } from "react-toastify";
import TataLoader from "../../Loader/TataLoader.jsx";
import { OctagonAlert } from "lucide-react";

function VerifyPayments() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // Added for download loading state
  const [popupOpen, setPopupOpen] = useState(true); // Popup should be open by default
  const [encryptedPolicyId, setEncryptedPolicyId] = useState(null);
  const [download, setDownload] = useState(false);
  const baseUrl = window.location.origin;
  const access_token = sessionStorage.getItem("tokens");
  const payment_id = sessionStorage.getItem("payid");

  const verifyPayment = async () => {
    setIsLoading(true);
    try {
      const headers = {
        Authorization: `${access_token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        `${VITE_DATA}/taig/motor/verif/pay`,
        { payment_id },
        { headers }
      );

      if (response.data.status === 200) {
        const encryptedId = response?.data?.data?.encrypted_policy_id;
        setEncryptedPolicyId(encryptedId);
        toast.success(response?.data?.message); // Changed to `toast.success` for successful verification
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        window.location.href = `${baseUrl}/login`;
      } else {
        toast.error(`${error?.response?.data?.message_txt || error?.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []); // No dependencies needed here

  const downloadPolicy = async () => {
    if (!encryptedPolicyId || isDownloading) return; // Prevent multiple clicks
    setIsDownloading(true);
    try {
      const headers = {
        Authorization: `${access_token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        `${VITE_DATA}/taig/motor/download/policy/${encryptedPolicyId}`,
        { headers }
      );
      const { data } = response;
      const binaryData = atob(data?.byteStream);
      const arrayBuffer = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        arrayBuffer[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "policy.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownload(true);
      toast.success("Policy downloaded successfully!");
    } catch (error) {
      console.error("Error downloading policy:", error);
      toast.error("Failed to download policy. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const closeHandler = (e) => {
    e.preventDefault();
    setPopupOpen(false);
    handleHomepage();
  };

  const handleHomepage = () => {
    window.location.href = `${baseUrl}/advisor/home/insurance`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {isLoading ? (
        <TataLoader />
      ) : (
        popupOpen && ( // Popup should be displayed when `popupOpen` is true
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="flex flex-col bg-white rounded shadow-lg w-1/4 p-4">
              {!encryptedPolicyId ? (
                <div className="flex justify-center flex-col text-center text-red-600 items-center m-4 space-y-2">
                  <OctagonAlert />
                  <h2 className="text-xl font-semibold font-sans text-center tracking-wider ">
                    Payment Verification Failed!
                  </h2>
                  <div className="tracking-wider space-x-16 space-y-5">
                    <button
                      className="transition-all bg-red-600 text-white font-mono font-bold px-3 py-1 mr-5 rounded border-red-700 border-b-[4px]"
                      onClick={closeHandler}
                    >
                      Close
                    </button>
                    <button
                      className="transition-all bg-green-600 text-white font-mono font-bold px-3 py-1 mr-5 rounded border-green-700 border-b-[4px]"
                      onClick={() => window.location.reload()}
                    >
                      Reload
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center flex-col text-center">
                  <h2 className="text-xl font-semibold tracking-wider text-green-600">
                    Payment Verified!
                  </h2>
                  <span className=" text-gray-600  tracking-wide">
                    Your policy is ready to download.
                  </span>
                  <div className="mt-8 flex justify-center space-x-4">
                    <button
                      className={`${
                        download || isDownloading
                          ? "bg-gray-500  border-gray-700"
                          : "bg-green-600 hover:bg-green-700 cursor-pointer border-green-700"
                      }  transition-all   text-white  text-base tracking-wider px-3 py-1 rounded border-b-[4px] font-mono font-bold shadow-inner hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed active:border-b-[2px] active:translate-y-[2px]`}
                      onClick={downloadPolicy}
                      disabled={download || isDownloading} // Disable button while downloading
                    >
                      {download
                        ? "Downloaded"
                        : isDownloading
                        ? "Downloading..."
                        : "Download Policy"}
                    </button>
                    {download && (
                      <button
                        className="transition-all bg-red-600 text-white border-red-700 text-base tracking-wider px-3 py-1 rounded border-b-[4px] font-mono font-bold shadow-inner hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed active:border-b-[2px] active:translate-y-[2px]"
                        onClick={handleHomepage}
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default VerifyPayments;
