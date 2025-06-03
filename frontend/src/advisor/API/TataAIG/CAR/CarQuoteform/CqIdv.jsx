/* eslint-disable react/prop-types */
// import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import CqPremBreakup from "./CqPremBreakup";
import { useAppContext } from "../../../../../context/Context";
import { X } from "lucide-react";

function CqIdv({ setIdvClose }) {
  const { state } = useAppContext();
  const quotes = state.tata.privateCar.quotes;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AnimatePresence>
      
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-50 overflow-hidden backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white px-4 py-3 rounded shadow-lg w-full max-w-2xl relative mx-4 md:mx-0"
        >
          <button
            onClick={() => {
              setIdvClose((prev) => !prev);
            }}
            className="absolute -top-3 -right-3 px-1 py-1 text-white bg-red-500 rounded hover:bg-red-600 tracking-wider text-xl font-semibold"
          >
            <X size={20} />
          </button>
          <h2 className="pb-6 md:text-2xl text-lg text-transparent text-center bg-gradient-to-l bg-clip-text from-indigo-600 via-indigo-600 to-blue-500 font-bold">
            IDV
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base tracking-wider">
            {[
              ["Policy ID", quotes?.pol_dlts?.policy_id],
              ["Vehicle Price", `₹ ${quotes?.pol_dlts?.vehicle_price || 0}`],
              ["Min IDV", quotes?.pol_dlts?.min_idv],
              ["Max IDV", quotes?.pol_dlts?.max_idv],
              ["Final IDV", quotes?.pol_dlts?.total_idv],
              ["Plan Opted", quotes?.pol_dlts?.motor_plan_opted],
              ["Net Premium", `₹ ${quotes?.pol_dlts?.net_premium || 0}`],
            ].map(([label, value], index) => (
              <div key={index}>
                <span className="font-semibold">{label}:</span>
                <p className="bg-slate-100 px-3 py-1 rounded">{value}</p>
              </div>
            ))}
          </div>
          <div className="justify-center text-center mt-5 py-5 ">
            <button
              onClick={() => setIsOpen(true)}
              className="transition-all tracking-wider md:text-lg text-sm px-2 md:px-4 md:py-1 py-2 rounded border-b-[4px] font-mono font-bold shadow-inner bg-slate-700 text-white border-black active:border-b-[2px] active:translate-y-[2px]"
            >
              View Premium Breakup
            </button>
          </div>
          {/* <div className="flex justify-end text-center mt-2">
            <button className="flex items-center transition-all tracking-wider text-lg px-2 py-1 rounded border-b-[4px] font-mono font-bold shadow-inner bg-blue-600 text-white border-blue-700 active:border-b-[2px] active:translate-y-[2px]">
              Proceed
              <ChevronRight strokeWidth={4} size={16} />
            </button>
          </div> */}
        </motion.div>
      </div>
      {isOpen && <CqPremBreakup setIsOpen={setIsOpen} quotes={quotes} />}
    </AnimatePresence>
  );
}
export default CqIdv;
