/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import VITE_DATA from "../../../../../config/config.jsx";
import { toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAppContext } from "../../../../../context/Context.jsx";
import { Check, Copy, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
function PaymentTaig() {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const baseUrl = window.location.origin;
  const { state } = useAppContext();
  const { access_token } = state?.tata?.tokens?.authTokens || sessionStorage.getItem("token");
  const proposal = state?.tata?.privateCar?.proposer;
  const ownResponse = state?.tata?.privateCar?.ckyc;
  const ckyc = state.tata.privateCar.ckyc;
  const inspStatus = state?.tata?.privateCar?.vInsStatus ;
  const quoteName =
    state?.tata?.privateCar?.quotes?.pol_dlts?.banca_product_name?.replace(
      /([a-z])([A-Z])/g,
      "$1 $2"
    );
  sessionStorage.setItem("payid", proposal?.payment_id);
  sessionStorage.setItem("tokens", access_token);
  const formData = {
    payment_mode: "onlinePayment",
    deposit_in: "Bank",
    online_payment_mode: "UPI",
    payer_type: "Customer",
    payer_id: "",
    payer_relationship: "",
    payer_pan_no: ownResponse?.id_num || "",
    payer_name:
      ownResponse?.result?.customer_name ||
      ownResponse?.result?.registered_name,
    email: "eleedomimf@gmail.com",
    mobile_no: proposal?.mobile_no || "",
    pan_no: ownResponse?.id_num || "",
    payment_id: [proposal?.payment_id] || [],
    returnurl: `${baseUrl}/advisor/verify/pay/policy`,
  };

  useEffect(() => {
    if (ckyc?.verified && (proposal?.payment_id || inspStatus?.data?.policy?.payment_id)) {
      // Automatically display the popup
      setShowPopup(true);
      // Auto-close popup after 5 seconds
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 10000);

      // Cleanup the timer when the component unmounts or dependencies change
      return () => clearTimeout(timer);
    }
  }, [ckyc, proposal?.payment_id, inspStatus?.data?.policy?.payment_id]);

  const initialState = {
    isChecked: false,
    paymentLink: "",
    copySuccess: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "TOGGLE_CHECKBOX":
        return { ...state, isChecked: !state.isChecked };
      case "SET_PAYMENT_LINK":
        return { ...state, paymentLink: action.payload };
      case "CLEAR_PAYMENT_LINK":
        return { ...state, paymentLink: "" };
      case "COPY_SUCCESS":
        return { ...state, copySuccess: true };
      case "RESET_COPY_SUCCESS":
        return { ...state, copySuccess: false };
      default:
        return state;
    }
  };
  const [formState, dispatch] = useReducer(reducer, initialState);

  const handleCheckboxChange = async () => {
    if (!formState?.isChecked) {
      setLoading(true);
      dispatch({ type: "TOGGLE_CHECKBOX" });

      try {
        const headers = {
          Authorization: access_token,
          "Content-Type": "application/json",
        };
        const response = await axios.post(
          `${VITE_DATA}/taig/motor/initiate/pay`,
          {
            ...formData,
            pan_no: ownResponse?.id_type !== "PAN" ? "" : formData?.pan_no,
            payer_pan_no:
              ownResponse?.id_type !== "PAN" ? "" : formData?.payer_pan_no,
          },
          { headers }
        );

        const { data } = response;

        if (data?.status === 200 && data?.message_txt === "Success") {
          const parsedData = JSON.parse(data?.data);
          const paymentUrl = parsedData?.url;

          dispatch({ type: "SET_PAYMENT_LINK", payload: paymentUrl });
          toast.success("Payment Link Generated Successfully!");
        } else {
          toast.error(`${"Inspection Status Pending!" || data?.message_txt || data?.message}`);
          setLoading(false);
          dispatch({ type: "CLEAR_PAYMENT_LINK" });
        }
      } catch (error) {
        console.error("Payment error:", error?.response || error?.message);
        toast.warn(`${error}`);
        dispatch({ type: "CLEAR_PAYMENT_LINK" });
      } finally {
        setLoading(false); // Stop loading after response
      }
    } else {
      dispatch({ type: "CLEAR_PAYMENT_LINK" });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formState?.paymentLink);
      dispatch({ type: "COPY_SUCCESS" });
      toast({
        title: "Copied",
        description: "Payment link copied to clipboard",
      });
      setTimeout(() => dispatch({ type: "RESET_COPY_SUCCESS" }), 3000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy payment link",
        variant: "destructive",
      });
    }
  };
  
  const PaymentLinkButton = () => (
    <CopyToClipboard text={formState?.paymentLink} onCopy={copyToClipboard}>
      <button
        className={`transition-all text-lg px-4 py-1.5 rounded-md border-b-[4px] font-mono font-bold shadow-inner
          ${
            formState?.copySuccess
              ? "bg-green-600 text-white border-green-700 active:border-b-[2px] active:translate-y-[2px]"
              : "bg-gray-100 text-gray-500 border-gray-400"
          }
          hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed `}
        disabled={!formState?.paymentLink}
      >
        {formState?.copySuccess ? <Check size={20} /> : <Copy size={20} />}
      </button>
    </CopyToClipboard>
  );

  return (
    <div className="flex flex-col ">
        {/* kyc successful message */}
        {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <AnimatePresence>
            <motion.div
              className="bg-white p-4 rounded flex justify-center flex-col shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h2 className="text-lg text-center font-bold tracking-wider mb-4">
                KYC Successful!
              </h2>
              <p>
                Thank you,{" "}
                <strong className="tracking-wider">
                  {ckyc?.result?.registered_name}
                </strong>
                . Your KYC process has been completed!
              </p>
              <button
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                onClick={() => setShowPopup(false)}
              >
                PROCEED
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      {ownResponse?.verified && (
        <div className="my-4 flex flex-col max-w-2xl mx-3 bg-white border border-gray-200 rounded-t-lg shadow text-slate-500">
          <h1 className="text-2xl my-2 tracking-wider text-transparent bg-gradient-to-l bg-clip-text from-indigo-600 to-blue-500 font-bold">
            Make Payment
          </h1>
          <span className="text-lg flex text-start text-white p-3 bg-blue-600 tracking-wider font-medium space-x-2 mb-2">
            {quoteName || sessionStorage.getItem("selectedOption")}
          </span>
          <div className="p-3 flex justify-between">
            <div>
              <h1 className="text-sm text-center tracking-wider font-medium space-x-2 mb-2">
                Premium (Including GST)
              </h1>
              <h1 className="text-lg tracking-wide text-center text-black font-semibold">
                ₹{proposal?.premium_value}
              </h1>
            </div>
            <hr className="my-4" />
            <div className="flex flex-col">
              <h1 className="text-sm text-start tracking-wider font-medium mb-2">
                Insured Name:{" "}
                <span className="text-black font-bold">
                  {ownResponse?.result?.customer_name ||
                    ownResponse?.result?.registered_name}
                </span>
              </h1>
              <h1 className="text-sm text-start tracking-wider font-medium mb-2">
                Proposal No:{" "}
                <span className="text-black font-bold">
                  {proposal?.proposal_no}
                </span>
              </h1>
              <h1 className="text-sm text-start tracking-wider font-medium mb-2">
                Quotation No:{" "}
                <span className="text-black font-bold">
                  {proposal?.quote_no}
                </span>
              </h1>
            </div>
          </div>
          <div className=" items-center p-3">
            {loading ? (
              <Loader2 className="animate-spin"/>
            ) : (
              <div className="flex flex-col  justify-start m-4 mx-0 items-start mt-4">
                <label
                  htmlFor="default-checkbox"
                  className="flex justify-center items-center text-lg tracking-wider font-medium text-gray-900"
                >
                  <input
                    id="pay-checkbox"
                    type="checkbox"
                    className="w-5 h-5 mr-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-0"
                    checked={formState?.isChecked}
                    onChange={handleCheckboxChange}
                    disabled={loading || formState?.isChecked}
                  />
                  I confirm the payment details.
                </label>
              </div>
            )}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => {
                  if (formState?.paymentLink) {
                    window.open(formState?.paymentLink, "_self");
                  }
                }}
                disabled={loading || !formState?.isChecked }
                className={`${
                  !formState?.isChecked
                    ? "cursor-not-allowed opacity-3"
                    : " bg-green-600 text-white border-green-700 active:border-b-[2px] active:translate-y-[2px]"
                } transition-all text-lg font-mono font-bold px-4 py-1.5 rounded border-b-[4px] tracking-wider mr-8`}
              >
                {/* {loading ? (
                          <Loader2 size={16} className="spin" />
                        ) :  */}
                {formState?.isChecked
                  ? "Make Payment"
                  : "Generate Payment Link"}
              </button>
              <PaymentLinkButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentTaig;
