/* eslint-disable react/prop-types */
import { useState } from "react";
import { useAppContext } from "../../../../../context/Context.jsx";
import TextLoader from "../../../../../loader/TextLoader.jsx";
import CarProposer from "../CarProposer/CarProposer.jsx";
import axios from "axios";
import VITE_DATA from "../../../../../config/config.jsx";
import { toast } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PropInsMessage from "../CarVerifyInspection/PropInsMessage.jsx";
import InspectionStatus from "../CarVerifyInspection/InspectionStatus.jsx";
import { Repeat2 } from "lucide-react";
import CqIdv from "../CarQuoteform/CqIdv.jsx";

function Proposer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { uatToken } = location.state || {};
  const { state, dispatch } = useAppContext();
  const [loadingProposer, setLoadingProposer] = useState(false);
  const [idvClose, setIdvClose] = useState(true); // Initialize as false
  const proposals = state?.tata?.privateCar?.proposer || {};
  const isInspection = proposals?.ticket_number && proposals?.inspectionFlag;
  const { access_token } = state?.tata?.tokens?.authTokens || {};
  const { insuranceName, category, formattedSelectedOption } = useParams();
  const quote = state?.tata?.privateCar?.quotes || {};
  const ckyc = state?.tata?.privateCar?.ckyc || {};
  const [isOpenInspection, setIsOpenInspection] = useState(true);
  const [showInsApi, setShowInsApi] = useState(false);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!uatToken) {
  //       toast.error("Authorization token not found");
  //       return;
  //     }
  //     try {
  //       const response = await axios.get(`${VITE_DATA}/taig/pc/financier`, {
  //         headers: {
  //           Authorization: `${uatToken}`,
  //         },
  //       });

  //       if (response.data.status === 0) {
  //         setFinancier(response.data?.data);
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
        { headers }
      );

      if (response.data.status === 200) {
        toast.success(`${response.data.message_txt}`);
        dispatch({
          type: "SET_TATA_PRIVATE_CAR_PROPOSER",
          payload: response.data.data[0],
        });

        navigate(
          `/advisor/home/${insuranceName}/${category}/${formattedSelectedOption}/kyc`,
          { state: { uatToken } } // Passing uatToken as state
        );
      } else {
        toast.error(`${response.data.message_txt || response.data.message}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message_txt || error.response?.data?.error
      );
    } finally {
      setLoadingProposer(false);
    }
  };

  if (loadingProposer) {
    return <TextLoader />;
  }

  return (
    <>
      <div className="flex justify-between mx-2 my-2 tracking-wider">
        {quote.quote_stage && (
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="flex my-auto text-white tracking-wider bg-blue-600 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-2.5 text-center items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
        )}
        <div className="flex justify-between space-x-2 my-2 tracking-wider">
        { quote.quote_stage && (
          <button
            onClick={() => setIdvClose((prev) => !prev)}
            className="mx-auto flex items-center transition-all tracking-wider text-lg px-2 py-1 rounded border-b-[4px] font-mono font-bold shadow-inner bg-rose-500 text-white border-rose-600 active:border-b-[2px] active:translate-y-[2px]"
          >
            <Repeat2 size={16} />
          </button>
        )}
        {proposals.proposal_stage && (
          <button
            onClick={() => navigate(1)}
            type="button"
            className="flex text-white  bg-blue-600 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-2.5 text-center items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {" "}
            <span className="px-2">Go to KYC</span>
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
        {ckyc?.verified && (
          <button
            // onClick={onForwardToCkyc}
            type="button"
            className="flex text-white bg-blue-600 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-2.5 text-center items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
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

      {idvClose && quote?.quote_stage && <CqIdv setIdvClose={setIdvClose} />}

      <CarProposer
        onSubmit={(data) => {
          setLoadingProposer(true);
          handleSetAuthTokenToProposal(data);
        }}
        // financier={financier}
      />
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
    </>
  );
}

export default Proposer;
