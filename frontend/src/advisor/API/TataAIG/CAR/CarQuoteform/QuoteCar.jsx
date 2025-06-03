import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import VITE_DATA from "../../../../../config/config.jsx";
import { useAppContext } from "../../../../../context/Context.jsx";
import TextLoader from "../../../../../loader/TextLoader.jsx";
import CarQuotes from "../CarQuoteform/CarQuotes.jsx";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
// import CqIdv from "./CqIdv.jsx";
import InsMessage from "../CarVerifyInspection/InsMessage.jsx";

function QuoteCar() {
  const { state, dispatch } = useAppContext();
  const [uatToken, setUatToken] = useState("");
  // const [vehMake, setVehMake] = useState([]);
  // const [model, setModel] = useState([]);
  // const [variant, setVariant] = useState([]);
  // const [rtolist, setRtoList] = useState([]);
  const [isOpenInsMsg, setIsOpenInsMsg] = useState(true);
  const { selectedOption, menuItems } = useOutletContext();
  // const [idvClose, setIdvClose] = useState(true);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const { access_token } = state?.tata?.tokens?.authTokens || {};
  const quote = state?.tata?.privateCar?.quotes || {};
  const navigate = useNavigate();
  const { insuranceName, category, formattedSelectedOption } = useParams();

  // RTO LISTS => REG PLACE & CODE
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!uatToken) {
  //       return; // Exit if token is not present
  //     }
  //     try {
  //       const response = await axios.get(`${VITE_DATA}/taig/pc/rto`, {
  //         headers: {
  //           Authorization: `${uatToken}`, // Send the token in the Authorization header
  //         },
  //       });

  //       if (response.data.status === 0) {
  //         setRtoList(response.data?.data);
  //       } else {
  //         toast.error(response.data?.txt);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       toast.error(`${error.response?.data?.txt}`);
  //     }
  //   };
  //   fetchData();
  // }, [uatToken]);

  // VEHICLE_MAKE
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!uatToken) {
  //       return; // Exit if token is not present
  //     }
  //     try {
  //       const response = await axios.get(`${VITE_DATA}/taig/pc/mfg`, {
  //         headers: {
  //           Authorization: `${uatToken}`, // Send the token in the Authorization header
  //         },
  //       });
  //       if (response.data.status === 0) {
  //         setVehMake(response.data?.data);
  //       } else {
  //         toast.error(response.data?.txt);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       toast.error(`${error.response?.data?.txt}`);
  //     }
  //   };
  //   fetchData();
  // }, [uatToken]);

  const handleSubOptionChange = (index) => {
    const selectedOption = menuItems[index];
    sessionStorage.setItem("selectedSubOption", selectedOption?.name);
    const authLink = selectedOption?.authLink;
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
          toast.success(`${data?.message}`);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  // Vehicle Model
  // const handleSelectedModel = async (data) => {
  //   if (!uatToken) {
  //     return; // Exit if token is not present
  //   }
  //   try {
  //     const response = await axios.get(
  //       `${VITE_DATA}/taig/pc/mfg/model/${data.code}/${data.name}`,
  //       {
  //         headers: {
  //           Authorization: `${uatToken}`,
  //         },
  //       }
  //     );
  //     if (response.data.status === 0) {
  //       setModel(response.data?.data);
  //     } else {
  //       toast.error(response.data?.txt);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(`${error.response?.data?.txt || "An error occurred"}`);
  //   }
  // };

  // vehicle model variant
  // const handleSelectedVariant = async (data) => {
  //   if (!uatToken) {
  //     return; // Exit if token is not present
  //   }
  //   try {
  //     const response = await axios.get(
  //       `${VITE_DATA}/taig/pc/mfg/model/variant/${data.code}/${data.name}`,
  //       {
  //         headers: {
  //           Authorization: `${uatToken}`,
  //         },
  //       }
  //     );
  //     if (response.data.status === 0) {
  //       setVariant(response.data?.data);
  //     } else {
  //       toast.error(response.data?.txt);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(`${error.response?.data?.txt || "An error occurred"}`);
  //   }
  // };

  // const handleRtoData = async (data) => {
  //   if (!uatToken) {
  //     toast.error("Not Authorized yet.. Try again!");
  //     return; // Exit if token is not present
  //   }
  //   try {
  //     const response = await axios.get(
  //       `${VITE_DATA}/taig/pc/rto/${data.code}/${data.name}`,
  //       {
  //         headers: {
  //           Authorization: `${uatToken}`,
  //         },
  //       }
  //     );
  //     if (response.data.status === 0) {
  //       return response.data?.data;
  //     } else {
  //       toast.error(response.data?.txt);
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(`${error.response?.data?.txt || "An error occurred"}`);
  //   }
  // };

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
        // Navigate to proposer form on successful quote
        // setIdvClose(false); // Close IDV dialog if open
        navigate(
          `/advisor/home/${insuranceName}/${category}/${formattedSelectedOption}/proposal`,
          { state: { uatToken } } // Passing uatToken as state
        );
      } else if (response.data.status === -102) {
        toast.error(response.data.message_txt);
      } else {
        toast.error(`${response.data.message_txt || response.data.message}`);
      }
    } catch (error) {
      toast.error(error.response?.error?.message_txt);
    } finally {
      setLoadingQuotes(false);
    }
  };

  return (
    <main className="mt-1 flex flex-col">
      {loadingQuotes ? (
        <TextLoader />
      ) : (
        selectedOption && (
          <>
            {quote.quote_stage && (
              <button
                onClick={() => navigate(1)}
                type="button"
                className="flex mx-auto tracking-wider text-white bg-blue-600 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-2.5 text-center items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <span className="px-2">Go to Proposal</span>
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
                    d="M1 5h12m0 0l-4-4m4 4l-4 4"
                  />
                </svg>
              </button>
            )}
            <CarQuotes
              onSubmit={(data) => {
                handleSetAuthTokenToQuote(data);
              }}
              handle={handleSubOptionChange}
              // vehMake={vehMake}
              // model={model}
              // variant={variant}
              // rtolist={rtolist}
              // onSelectedVeh={handleSelectedModel}
              // onSelectedModel={handleSelectedVariant}
              // handleRtoData={handleRtoData}
            />
          </>
        )
      )}
      {/* {idvClose && quote?.quote_stage && <CqIdv setIdvClose={setIdvClose} />} */}

      {isOpenInsMsg && quote?.pol_dlts?.inspectionFlag === "true" && (
        <InsMessage setIsOpenInsMsg={setIsOpenInsMsg} quote={quote} />
      )}
    </main>
  );
}

export default QuoteCar;
