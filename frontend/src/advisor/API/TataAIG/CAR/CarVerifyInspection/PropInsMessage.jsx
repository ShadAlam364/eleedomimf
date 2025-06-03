/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, X } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";

function PropInsMessage({ setIsOpenInspection, proposals, setShowInsApi }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  if (!proposals || proposals?.inspectionFlag !== "true" && proposals?.ticket_number) return null;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(proposals?.self_inspection_link);
      setCopySuccess(true);
      toast({
        title: "Copied",
        description: "Inspection link copied to clipboard",
      });
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy Inspection link",
        variant: "destructive",
      });
    }
  };

  
  return (
    <AnimatePresence>
      <div className="z-10 fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 overflow-hidden backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl m-4 sm:m-0 relative"
        >
          <button
            onClick={() => {setIsOpenInspection(false); setShowInsApi(true)}}
            className="absolute -top-2 -right-2 px-1 py-1 text-white bg-red-500 rounded hover:bg-red-600 tracking-wider text-xl font-semibold"
          >
            <X size={20} />
          </button>

          <h2 className="tracking-wide text-2xl font-bold mb-4 text-blue-700">
            Self Inspection Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base tracking-wider">
            {[
              ["Policy ID", proposals?.policy_id],
              ["Nstp ID", proposals?.nstp_id],
              ["Quote ID", proposals?.quote_id],
              ["Proposal ID", proposals?.proposal_id],
              ["Document ID", proposals?.document_id],
              ["Proposal No", proposals?.proposal_no],
              ["Quote No", proposals?.quote_no],
              ["Stage", proposals?.stage],
              ["Ticket No", proposals?.ticket_number],
              ["Premium", `₹${proposals?.premium_value}`],
            ].map(([label, value], index) => (
              <div key={index}>
                <span className="font-semibold">{label}:</span>
                <p className="bg-slate-100 px-3 py-1 rounded">{value}</p>
              </div>
            ))}

            <div>
              <p className="font-semibold">Ticket Status:</p>
              <p
                className={`inline-block rounded-full px-3 mt-1 py-1 text-sm font-medium ${
                  proposals?.ticket_status === "InProgress"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {proposals?.ticket_status === "InProgress"
                  ? "In Progress"
                  : "Completed"}
              </p>
            </div>

            <div>
              <p className="font-semibold">Proposal Stage:</p>
              <p
                className={`inline-block rounded-full px-3 mt-1 py-1 text-sm font-medium ${
                  proposals?.proposal_stage === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {proposals?.proposal_stage === "completed"
                  ? "Completed"
                  : "In Progress"}
              </p>
            </div>
          </div>
          {proposals?.self_inspection_link && (
            <div className="tracking-wider mt-16 flex justify-center items-center text-center">
              <button
                onClick={() => {
                  if (proposals?.self_inspection_link) {
                    window.open(proposals?.self_inspection_link, "_blank");
                    setIsCheck(true); // Update state after opening link
                  }
                }}
                disabled={isCheck || !proposals?.self_inspection_link} // Correct logic
                className={`transition-all text-lg font-mono font-bold px-4 py-1 rounded border-b-[4px] tracking-wider mr-8
    ${
      isCheck
        ? "cursor-not-allowed opacity-50 bg-slate-100 border-blue-400 text-blue-800"
        : "bg-green-600 text-white border-green-700 active:border-b-[2px] active:translate-y-[2px]"
    }`}
              >
                {isCheck ? "Self Verify" : "Self Verify"}
              </button>
              <button
                onClick={copyToClipboard}
                className={`transition-all text-lg px-2 py-1 rounded border-b-[4px] font-mono font-bold shadow-inner ${
                  copySuccess
                    ? "bg-green-600 text-white border-green-700"
                    : "bg-gray-100 text-blue-500 border-blue-300  hover:bg-blue-100"
                } disabled:opacity-50 disabled:cursor-not-allowed active:border-b-[2px] active:translate-y-[2px]`}
                disabled={!proposals?.self_inspection_link}
              >
                {copySuccess ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default PropInsMessage;
