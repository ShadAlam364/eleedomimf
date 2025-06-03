import axios from "axios";
import VITE_DATA from "../../../../../../config/config";
import { toast } from "react-toastify";
import { useAppContext } from "../../../../../../context/Context";
import { useState } from "react";
import PopupAllKyc from "../PopupAllKyc";
import FormSixty from "../../CarForm60/FormSixty";
import TextLoader from "../../../../../../loader/TextLoader";
import PaymentTaig from "../../CarPayment/PaymentTaig";
import { useNavigate } from "react-router-dom";
import PvtCkyc from "../PAN/PvtCkyc";
import OvdForm from "../../CarOVD/OvdForm";
import AadhaarKyc from "../Aadhaar/AadhaarKyc";

const KycMethods = {
  PAN: "PAN",
  FORM60: "FORM60",
  AADHAAR: "AADHAAR",
  OTP: "OTP",
  OVD: "OVD",
};

function KycParent() {
  const { state, dispatch } = useAppContext();
  const { access_token } = state?.tata?.tokens?.authTokens || {};
  const [loadingCkyc, setLoadingCkyc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPopupKycOpen, setIsPopupKycOpen] = useState(false);
  const [activeKycMethod, setActiveKycMethod] = useState(KycMethods.PAN);
  const [kycResponse, setKycResponse] = useState(null);

  const navigate = useNavigate();
  const ckyc = state?.tata?.privateCar?.ckyc;
  const proposals = state?.tata?.privateCar?.proposer;
  const inspStatus = state?.tata?.privateCar?.vInsStatus;
  const showCkyc = !ckyc?.ckycSuccess;
  const showPayment =
    ckyc?.verified &&
    (proposals?.payment_id || inspStatus?.data?.policy?.payment_id);

  // Handle PAN KYC submission
  const handleSetAuthTokenToCkyc = async (formData) => {
    const newFormData = structuredClone(formData);
    if (formData.id_type === "PAN") {
      delete newFormData.req_id;
      delete newFormData.dob;
      delete newFormData.gender;

      try {
        setLoadingCkyc(true);
        const response = await axios.post(
          `${VITE_DATA}/taig/motor/ckyc`,
          newFormData,
          {
            headers: {
              Authorization: `${access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setKycResponse(response.data);

        if (response.data.status === 200 ) {
          if (
           ckyc?.nameVerification &&
            !ckyc?.ckycSuccess &&
            ckyc?.message_txt ===
              "Please proceed with Aadhaar OTP verification or upload an OVD."
          ) {
            console.log(response.data);
            dispatch({
              type: "SET_TATA_PRIVATE_CAR_CKYC",
              payload: response.data,
            });
            setActiveKycMethod(KycMethods.AADHAAR);
          } else {
            toast.success(`${response.data.message_txt}`);
            dispatch({
              type: "SET_TATA_PRIVATE_CAR_CKYC",
              payload: response.data.data,
            });
          }
        } else {
          toast.error(`${response.data.message_txt || response.data.message}`);
          dispatch({
            type: "SET_TATA_PRIVATE_CAR_CKYC",
            payload: response.data.data,
          });
        }
      } catch (error) {
        console.log(error);
        
        toast.error(
          error.response?.data?.message_txt || error 
        );
      } finally {
        setLoadingCkyc(false);
      }
    }
  };

  // Handle Form 60 submission
  const handleFormSixty = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${VITE_DATA}/taig/motor/form/sixty`,
        formData,
        {
          headers: {
            Authorization: `${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.data.status === 200 &&
        response.data.message_txt === "Successfully uploaded"
      ) {
        toast.success(`${response.data.error}`);
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_FORM60",
          payload: response.data.data,
        });
        // Direct to payment page on successful Form 60 upload
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_CKYC",
          payload: { ...response.data.data, verified: true },
        });
      } else {
        toast.error(`${response.data.message_txt || response.data.error}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message_txt || error.response?.data?.error
      );
      console.log(error);
      
    } finally {
      setLoading(false);
    }
  };

  // Handle Aadhaar verification response
  const handleAadhaarResponse = (response) => {
    if (response.data.status === 200) {
      if (response.data.verified) {
        // Direct Aadhaar verification successful - go to payment
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_CKYC",
          payload: { ...response.data.data, verified: true },
        });
      } else if (response.data.otpRequired) {
        // OTP needed
        setActiveKycMethod(KycMethods.OTP);
      } else {
        // Verification failed - show OVD option
        setActiveKycMethod(KycMethods.OVD);
      }
    } else {
      toast.error(response.data.message_txt || "Aadhaar verification failed");
      setActiveKycMethod(KycMethods.OVD);
    }
  };

  // Handle OVD form submission
  const handleOvdSubmit = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${VITE_DATA}/taig/motor/form/sixty`,
        formData,
        {
          headers: {
            Authorization: `${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 400) {
        toast.error(`${response.data.message_txt || response.data.message}`);
      } else {
        toast.success(`${response.data.message_txt || response.data.message}`);
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_CKYC",
          payload: { ...response.data.data, verified: true },
        });
      }
    } catch (error) {
        
      toast.error(error.response?.data?.message_txt || "Error uploading OVD");
    } finally {
      setLoading(false);
    }
  };

  const renderKycMethod = () => {
    switch (activeKycMethod) {
      case KycMethods.FORM60:
        return (
          <FormSixty
            onSubmitFormSixty={(data) => {
              setLoading(true);
              handleFormSixty(data);
            }}
            setFormSixtyState={() => {}} // No-op since we don't use this anymore
            setIsPopupKycOpen={setIsPopupKycOpen}
          />
        );
      case KycMethods.AADHAAR:
        return (
          <div className="flex flex-col items-center rounded justify-center bg-blue-600 mx-4">
          <AadhaarKyc
            onSubmit={handleAadhaarResponse}
            reqId={kycResponse?.req_id}
          />
          </div>
        );
      case KycMethods.OVD:
        return <OvdForm onSubmit={handleOvdSubmit} />;
      default:
        return (
          <PvtCkyc
            onSubmit={(data) => {
              setLoadingCkyc(true);
              handleSetAuthTokenToCkyc(data);
            }}
            setFormSixtyState={() => setActiveKycMethod(KycMethods.FORM60)}
          />
        );
    }
  };

  return (
    <>
      <div className="flex flex-col m-2">
        <h2 className="md:text-2xl my-2 tracking-wide text-transparent bg-gradient-to-l bg-clip-text from-indigo-600 to-blue-500 text-base font-bold text-center">
          KYC
        </h2>
        <div className="flex justify-between mx-2 my-2 tracking-wider">
          {proposals.proposal_stage && (
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="flex text-white bg-blue-600 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-2.5 text-center items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5H1m0 0l4-4M1 5l4 4"
                />
              </svg>
              <span className="px-2">Back to Proposal</span>
            </button>
          )}

          {showCkyc && !kycResponse && (
            <div className="flex gap-2">
              <button
                onClick={() => setActiveKycMethod(KycMethods.PAN)}
                disabled={loading || loadingCkyc}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  activeKycMethod === KycMethods.PAN
                    ? "bg-blue-600 font-semibold text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } ${
                  (loading || loadingCkyc) && "opacity-50 cursor-not-allowed"
                }`}
              >
                PAN KYC
              </button>
              <button
                onClick={() => setActiveKycMethod(KycMethods.FORM60)}
                disabled={loading || loadingCkyc}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  activeKycMethod === KycMethods.FORM60
                    ? "bg-blue-600 font-semibold text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } ${
                  (loading || loadingCkyc) && "opacity-50 cursor-not-allowed"
                }`}
              >
                Form 60
              </button>
            </div>
          )}
          {proposals.proposal_stage && (
            <button
              onClick={() => navigate(1)}
              type="button"
              className="flex text-white  bg-blue-600 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-2.5 text-center items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {" "}
              <span className="px-2">Go to Payment</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0l-4 4m4-4l-4-4"
                />
              </svg>
            </button>
          )}
        </div>

        {loadingCkyc || loading ? (
          <div className="flex items-center justify-center p-8">
            <TextLoader />
          </div>
        ) : (
          showCkyc && renderKycMethod()
        )}

        {/* Show payment page if KYC is verified */}
        {showPayment && <PaymentTaig />}

        {/* Show KYC popup on successful Form 60 submission */}
        <PopupAllKyc
          isOpen={state.tata.privateCar.form60.success && isPopupKycOpen}
          toggleModal={() => setIsPopupKycOpen(false)}
        />
      </div>
    </>
  );
}

export default KycParent;
