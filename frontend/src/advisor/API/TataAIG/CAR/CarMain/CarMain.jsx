/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { useState, useEffect, memo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import VITE_DATA from "../../../../../config/config.jsx";
import PvtCkyc from "../TataCkyc/PAN/PvtCkyc.jsx";
import FormSixty from "../CarForm60/FormSixty.jsx";
import { useAppContext } from "../../../../../context/Context.jsx";
import PopupAllKyc from "../TataCkyc/PopupAllKyc.jsx";
import TextLoader from "../../../../../loader/TextLoader.jsx";
import CarQuotes from "../CarQuoteform/CarQuotes.jsx";
import CarProposer from "../CarProposer/CarProposer.jsx";
import InsMessage from "../CarVerifyInspection/InsMessage.jsx";
import PropInsMessage from "../CarVerifyInspection/PropInsMessage.jsx";
import InspectionStatus from "../CarVerifyInspection/InspectionStatus.jsx";
import CqIdv from "../CarQuoteform/CqIdv.jsx";
import { Repeat2 } from "lucide-react";
import PaymentTaig from "../CarPayment/PaymentTaig.jsx";
// import PolicyLists from "../CarPolicyLists/PolicyLists.jsx";

const CarMain = memo(({ selectedOption, setSelectedSubOption, menuItems }) => {
  const { state, dispatch } = useAppContext();
  const [showProposer, setShowProposer] = useState(false);
  const [showCkyc, setShowCkyc] = useState(false);
  const [uatToken, setUatToken] = useState("");
  const [showQuoteForm, setShowQuoteForm] = useState(true);
  const [vehMake, setVehMake] = useState([]);
  const [model, setModel] = useState([]);
  const [variant, setVariant] = useState([]);
  const [rtolist, setRtoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [loadingProposer, setLoadingProposer] = useState(false);
  const [loadingCkyc, setLoadingCkyc] = useState(false);
  const [financier, setFinancier] = useState([]);
  const [formSixtyState, setFormSixtyState] = useState(false);
  const [isPopupKycOpen, setIsPopupKycOpen] = useState(true);
  const { access_token } = state?.tata?.tokens?.authTokens || {};
  const [isOpenInsMsg, setIsOpenInsMsg] = useState(true);
  const [isOpenInspection, setIsOpenInspection] = useState(true);
  const [showInsApi, setShowInsApi] = useState(false);
  const [idvClose, setIdvClose] = useState(true);
  const quote = state?.tata?.privateCar?.quotes || {};
  const proposals = state?.tata?.privateCar?.proposer || {};
  const isInspection = proposals?.ticket_number && proposals?.inspectionFlag;
  const inspStatus = state?.tata?.privateCar?.vInsStatus || {};
  const ckyc = state.tata.privateCar.ckyc || {};

  const handleBackToQuote = () => {
    setShowQuoteForm(true);
    setShowProposer(false);
    setFormSixtyState(false);
  };

  const handleBackToProposal = () => {
    setShowProposer(true);
    setShowCkyc(false);
    setFormSixtyState(false);
  };
  const handleForwardToProposal = () => {
    setShowProposer(true);
    setShowQuoteForm(false);
  };

  const handleForwardToCkyc = () => {
    setShowProposer(false);
    setShowCkyc(true);
  };

  // RTO LISTS => REG PLACE & CODE
  useEffect(() => {
    const fetchData = async () => {
      if (!uatToken) {
        return; // Exit if token is not present
      }
      try {
        const response = await axios.get(`${VITE_DATA}/taig/pc/rto`, {
          headers: {
            Authorization: `${uatToken}`, // Send the token in the Authorization header
          },
        });

        if (response.data.status === 0) {
          setRtoList(response.data?.data);
        } else {
          toast.error(response.data?.txt);
        }
      } catch (error) {
        console.error(error);
        toast.error(`${error.response?.data?.txt}`);
      }
    };
    fetchData();
  }, [uatToken]);

  //FINANCIER
  // RTO LISTS => REG PLACE & CODE
  useEffect(() => {
    const fetchData = async () => {
      if (!uatToken) {
        // toast.error("Not Authorized yet.. Try again!");
        return; // Exit if token is not present
      }
      try {
        const response = await axios.get(`${VITE_DATA}/taig/pc/financier`, {
          headers: {
            Authorization: `${uatToken}`, // Send the token in the Authorization header
          },
        });

        if (response.data.status === 0) {
          setFinancier(response.data?.data);
        } else {
          toast.error(response.data?.txt);
        }
      } catch (error) {
        console.error(error);
        toast.error(`${error.response?.data?.txt}`);
      }
    };
    fetchData();
  }, [uatToken]);

  // all 12 lists
  // 1. VEHICLE_MAKE
  useEffect(() => {
    const fetchData = async () => {
      if (!uatToken) {
        // toast.error("Not Authorized yet.. Try again!");
        return; // Exit if token is not present
      }
      try {
        const response = await axios.get(`${VITE_DATA}/taig/pc/mfg`, {
          headers: {
            Authorization: `${uatToken}`, // Send the token in the Authorization header
          },
        });
        if (response.data.status === 0) {
          setVehMake(response.data?.data);
        } else {
          toast.error(response.data?.txt);
        }
      } catch (error) {
        console.error(error);
        toast.error(`${error.response?.data?.txt}`);
      }
    };
    fetchData();
  }, [uatToken]);

  const handleSubOptionChange = (index) => {
    const selectedOption = menuItems[index];
    sessionStorage.setItem("selectedSubOption", selectedOption?.name);
    setSelectedSubOption(selectedOption?.name);
    const authLink = selectedOption?.authLink;
    console.log(authLink);

    // Make API call if needed
    if (authLink) {
      fetch(authLink)
        ?.then((response) => response.json())
        ?.then((data) => {
          const uatMaster = data.uatLists.data;
          if (uatMaster?.token) {
            setUatToken(uatMaster?.token);
            sessionStorage.setItem("uat_token_received_at", uatMaster?.u_ts);
          }
          // handleSetAuthTokenToQuote();
          toast.success(`${data?.message}`);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  // Vehicle Model
  const handleSelectedModel = async (data) => {
    if (!uatToken) {
      // toast.error("Not Authorized yet.. Try again!");
      return; // Exit if token is not present
    }
    try {
      // send this data to variant data to get prices
      const response = await axios.get(
        `${VITE_DATA}/taig/pc/mfg/model/${data.code}/${data.name}`,
        {
          headers: {
            Authorization: `${uatToken}`, // Send the token in the Authorization header
          },
        }
      );
      if (response.data.status === 0) {
        setModel(response.data?.data);
      } else {
        toast.error(response.data?.txt);
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error.response?.data?.txt || "An error occurred"}`);
    }
  };

  // vehicle model variant
  const handleSelectedVariant = async (data) => {
    if (!uatToken) {
      // toast.error("Not Authorized yet.. Try again!");
      return; // Exit if token is not present
    }
    try {
      // setVariantToVariantData(data);
      const response = await axios.get(
        `${VITE_DATA}/taig/pc/mfg/model/variant/${data.code}/${data.name}`,
        {
          headers: {
            Authorization: `${uatToken}`, // Send the token in the Authorization header
          },
        }
      );
      if (response.data.status === 0) {
        setVariant(response.data?.data);
      } else {
        toast.error(response.data?.txt);
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error.response?.data?.txt || "An error occurred"}`);
    }
  };

  const handleRtoData = async (data) => {
    if (!uatToken) {
      toast.error("Not Authorized yet.. Try again!");
      return; // Exit if token is not present
    }
    try {
      const response = await axios.get(
        `${VITE_DATA}/taig/pc/rto/${data.code}/${data.name}`,
        {
          headers: {
            Authorization: `${uatToken}`, // Send the token in the Authorization header
          },
        }
      );
      if (response.data.status === 0) {
        // setRtoData(response.data?.data);
        return response.data?.data;
      } else {
        toast.error(response.data?.txt);
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error.response?.data?.txt || "An error occurred"}`);
    }
  };

  useEffect(() => {
    // Simulate data
    const loadData = async () => {
      try {
        // Simulate an async operation, such as an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // When data is ready, set  to false
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // Fetch data and handle sessionStorage for state persistence
  useEffect(() => {
    const storedSubOption = sessionStorage.getItem("selectedSubOption");
    if (storedSubOption) {
      setSelectedSubOption(storedSubOption);
    }
  }, [setSelectedSubOption]);

  const handleSetAuthTokenToQuote = async (formData) => {
    const headers = {
      Authorization: `${access_token}`,
      "Content-Type": "application/json",
    };
    setLoadingQuotes(true);
    try {
      const response = await axios.post(
        `${VITE_DATA}/taig/motor/quote`,
        formData,
        {
          headers,
        }
      );
      if (response.data.status === 200) {
        toast.success(`${response.data.message_txt}`);
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_QUOTES",
          payload: response.data.data[0],
        });
        // Move to Proposer component on success
        if (
          response.data.message_txt ===
            "Quotation converted to proposal successfully" &&
          response.data.status === 200
        ) {
          setShowQuoteForm(false);
          setShowProposer(true);
        }
      } else if (response.data.status === -102) {
        // Stay on QuoteForm for error status -102
        toast.error(response.data.message_txt);
        setShowQuoteForm(true);
        setShowProposer(false);
      } else {
        toast.error(`${response.data.message_txt || response.data.message}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message_txt || "Error to fetching quote response"
      );
    } finally {
      setLoadingQuotes(false);
    }
  };

  const handleSetAuthTokenToProposal = async (formData) => {
    const headers = {
      Authorization: `${access_token}`,
      "Content-Type": "application/json",
    };
    setLoadingProposer(true);
    try {
      const response = await axios.post(
        `${VITE_DATA}/taig/motor/proposal`,
        formData,
        {
          headers,
        }
      );
      if (response.data.status === 200) {
        toast.success(`${response.data.message_txt}`);
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_PROPOSER",
          payload: response.data.data[0],
        });
        if (
          (response.data.message_txt === "Proposal submitted successfully" ||
            response.data.message_txt === "Success") &&
          response.data.status === 200
        ) {
          setShowProposer(false);
          setShowCkyc(true);
        }
      } else {
        toast.error(`${response.data.message_txt || response.data.message}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message_txt ||
          "Error to fetching proposal response"
      );
    } finally {
      setLoadingProposer(false);
    }
  };

  const handleSetAuthTokenToCkyc = async (formData) => {
    const newFormData = structuredClone(formData);
    if (formData.id_type === "PAN") {
      delete newFormData.req_id;
      delete newFormData.dob;
      delete newFormData.gender;
      const headers = {
        Authorization: `${access_token}`,
        "Content-Type": "application/json",
      };
      setLoadingCkyc(true);
      try {
        const response = await axios.post(
          `${VITE_DATA}/taig/motor/ckyc`,
          newFormData,
          {
            headers,
          }
        );
        if (response.data.status === 200) {
          toast.success(`${response.data.message_txt}`);
          dispatch({
            type: "SET_TATA_PRIVATE_CAR_CKYC",
            payload: response.data.data,
          });
        } else if (
          response.data.status === 400 &&
          response.data.message_txt ===
            "CKYC not completed. Please retry with another id"
        ) {
          toast.error(`${response.data.message_txt}`);
        } else {
          toast.error(`${response.data.message_txt || response.data.message}`);
        }
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_CKYC",
          payload: response.data.data,
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message_txt || "Error to complete cKYC"
        );
      } finally {
        setLoadingCkyc(false);
      }
    }
  };

  const handleFormSixty = async (formData) => {
    const headers = {
      Authorization: `${access_token}`,
      "Content-Type": "application/json",
    };
    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_DATA}/taig/motor/form/sixty`,
        formData,
        {
          headers,
        }
      );
      if (
        response.data.status === 200 &&
        response.data.message_txt === "Succesfully uploaded"
      ) {
        toast.success(`${response.data.message_txt}`);

        dispatch({
          type: "SET_TATA_PRIVATE_CAR_FORM60",
          payload: response.data.data,
        });
        // setIsPopupKycOpen(true);
      } else {
        toast.error(`${response.data.message_txt || response.data.message}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message_txt || "Error to upload Form60"
      );
      // handleSessionExpiry();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mt-1 flex flex-col">
      {/* QUOTES */}
      {loadingQuotes ? (
        <TextLoader />
      ) : (
        selectedOption &&
        showQuoteForm && (
          <>
            {state.tata.privateCar.proposer.verified && (
              <button
                onClick={handleForwardToProposal}
                type="button"
                className="flex overflow-hidden text-white bg-blue-600 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-2.5 text-center items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <span className="px-2">Forward to Proposal</span>
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
            <CarQuotes
              onSubmit={(data) => {
                setLoadingQuotes(true);
                handleSetAuthTokenToQuote(data);
              }}
              handle={handleSubOptionChange}
              vehMake={vehMake}
              model={model}
              variant={variant}
              rtolist={rtolist}
              onSelectedVeh={handleSelectedModel}
              onSelectedModel={handleSelectedVariant}
              handleRtoData={handleRtoData}
            />
          </>
        )
      )}
      {idvClose && quote?.quote_stage && <CqIdv setIdvClose={setIdvClose} />}

      {isOpenInsMsg && quote?.pol_dlts?.inspectionFlag === "true" && (
        <InsMessage setIsOpenInsMsg={setIsOpenInsMsg} quote={quote} />
      )}

      {/* Proposer */}
      {loadingProposer ? (
        <TextLoader />
      ) : (
        showProposer && (
          <>
            <div className="flex justify-between mx-2 ">
              <button
                onClick={handleBackToQuote}
                type="button"
                className="flex text-white bg-blue-600 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-2.5 text-center items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
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
                    d="M13 5H1m0 0l4-4M1 5l4 4"
                  />
                </svg>
                <span className="px-2">Back to Quote</span>
              </button>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIdvClose((prev) => !prev)}
                  className="my-auto items-center transition-all tracking-wider text-lg px-2 py-1 rounded border-b-[4px] font-mono font-bold shadow-inner bg-rose-500 text-white border-rose-600 active:border-b-[2px] active:translate-y-[2px]"
                >
                  <Repeat2 size={16} />
                </button>
                {state.tata.privateCar.ckyc.verified && (
                  <button
                    onClick={handleForwardToCkyc}
                    type="button"
                    className="flex text-white bg-blue-600 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-2.5 text-center items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    {" "}
                    <span className="px-2">Payment</span>
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
            </div>
            <CarProposer
              // onSubmit={handleSetAuthTokenToProposal}
              onSubmit={(data) => {
                setLoadingProposer(true); // Set loading state for Proposer
                handleSetAuthTokenToProposal(data);
              }}
              financier={financier}
            />
          </>
        )
      )}

      {isOpenInspection && proposals?.inspectionFlag === "true" && (
        <PropInsMessage
          setIsOpenInspection={setIsOpenInspection}
          proposals={proposals}
          setShowInsApi={setShowInsApi}
        />
      )}
      {showInsApi && isInspection && (
        <InspectionStatus setShowInsApi={setShowInsApi} />
      )}

      {/* PVT-CAR */}
      {loadingCkyc ? (
        <TextLoader />
      ) : (
        showCkyc && (
          <>
            <div className="flex justify-between mx-2 my-2">
              <button
                onClick={handleBackToProposal}
                type="button"
                className="flex text-white bg-blue-600 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-2.5 text-center items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
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
                    d="M13 5H1m0 0l4-4M1 5l4 4"
                  />
                </svg>
                <span className="px-2">Back to Proposal</span>
              </button>
            </div>
            <PvtCkyc
              // onSubmit={handleSetAuthTokenToCkyc}
              onSubmit={(data) => {
                setLoadingCkyc(true); // Set loading state for CKYC
                handleSetAuthTokenToCkyc(data);
              }}
              setFormSixtyState={setFormSixtyState}
              setIsOpenInspection={setIsOpenInspection}
            />
          </>
        )
      )}


      {/* payment page */}
      {!showQuoteForm &&
        (proposals?.payment_id || inspStatus?.data?.policy?.payment_id) &&
        ckyc?.verified && <PaymentTaig />}


      {/* form 60 */}
      {loading ? (
        <div className="w-auto mx-auto fixed inset-0 backdrop-blur-sm">
          <TextLoader />
        </div>
      ) : (
        formSixtyState && (
          <FormSixty
            onSubmitFormSixty={(data) => {
              setLoading(true); // Set loading state for Form 60
              handleFormSixty(data);
            }}
            setFormSixtyState={setFormSixtyState}
            setIsPopupKycOpen={setIsPopupKycOpen}
          />
        )
      )}
      {/* on successful responses form60 context get open popup */}
      <PopupAllKyc
        isOpen={state.tata.privateCar.form60.success && isPopupKycOpen}
        toggleModal={() => setIsPopupKycOpen(false)}
      />
      {/* <PolicyLists/> */}
    </main>
  );
});
export default CarMain;
