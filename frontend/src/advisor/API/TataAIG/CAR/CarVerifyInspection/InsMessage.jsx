/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "motion/react";
const InsMessage = ({ quote, setIsOpenInsMsg }) => {
  if (quote?.pol_dlts?.inspectionFlag !== "true") return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 overflow-hidden backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          {quote?.pol_dlts?.inspectionData?.map((data, index) => (
            <h2
              className="tracking-wide text-2xl font-bold mb-4 text-blue-700"
              key={index}
            >
              {data.code.replace(/([a-z])([A-Z])/g, "$1 $2")}
            </h2>
          ))}
          <div className="grid grid-cols-2 gap-4 text-base tracking-wider">
          {[
              ["Policy ID", quote?.data?.policy_id],
              ["Proposal ID", quote?.data?.proposal_id],
              ["Document ID", quote?.data?.document_id],
              ["Quote No", quote?.data?.quote_no]
            ].map(([label, value], index) => (
              <div key={index}>
                <span className="font-semibold">{label}:</span>
                <p className="bg-slate-100 px-3 py-1 rounded">{value}</p>
              </div>
            ))}
            <div>
              <div>
                <p className="font-semibold">Quote Stage:</p>
                <p
                  className={`inline-block rounded-full px-3 mt-1 py-1 text-sm font-medium ${
                    quote?.quote_stage === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {quote?.quote_stage === "completed"
                    ? "Completed"
                    : "In Progress"}
                </p>
              </div>
            </div>

            {quote?.pol_dlts?.inspectionData?.map((data, index) => (
              <div
                key={index}
                className="col-span-2 tracking-wider bg-gray-200 p-2 rounded-md text-center my-4 mb-8"
              >
                <p>{data.message}.</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center">
            <button
              onClick={() => setIsOpenInsMsg(false)}
              className="px-4 py-1 text-white bg-red-500 rounded hover:bg-red-600 tracking-wider text-xl font-semibold">
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InsMessage;
