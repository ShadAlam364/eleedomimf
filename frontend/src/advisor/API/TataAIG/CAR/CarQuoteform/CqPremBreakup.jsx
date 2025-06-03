/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import fmt from "indian-number-format";
import { AnimatePresence, motion } from "motion/react";
function CqPremBreakup({ setIsOpen, quotes }) {
  const prem = quotes?.data?.premium_break_up;
  const comp_premium =
    (Number(prem?.total_od_premium?.od?.basic_od) || 0) +
    (Number(prem?.total_tp_premium?.basic_tp) || 0) +
    (Number(prem?.total_addOns?.total_addon) || 0);

    const liability =  (Number(prem?.total_tp_premium?.basic_tp) || 0) + (Number(prem?.total_tp_premium?.pa_owner_prem) || 0);
  return (
    <AnimatePresence>
      <div className="z-10 fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 overflow-hidden backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white px-4 py-3 rounded shadow-lg w-full max-w-7xl relative mx-4 md:mx-0"
        >
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="absolute -top-3 -right-3 px-1 py-1 text-white bg-red-500 rounded hover:bg-red-600 tracking-wider text-xl font-semibold"
          >
            <X size={20} />
          </button>
          <h2 className="pb-4 md:text-2xl text-lg text-transparent bg-gradient-to-l bg-clip-text from-indigo-600 via-indigo-700 to-blue-600 font-semibold">
            Vehicle Premium Breakup
          </h2>
          <div className="flex tracking-wider md:text-base text-xs">
            {/* part 1 div */}
            <div className="w-full pe-1 md:pe-2">
              <h1 className="font-bold tracking-wider text-start py-2 pb-4 text-blue-700">
                Section - <span className="me-3">&#8544;</span> OWN DAMAGE (A)
              </h1>
              <p className="font-medium">
                Own Damage Premium On Vehicle & Accessories
              </p>
              <div className="flex justify-between pb-2">
                <p>Basic OD Premium </p>
                <span className="font-medium">{`₹ ${fmt.formatFixed(
                  prem?.total_od_premium?.od?.basic_od
                )}`}</span>
              </div>
              <p className="font-medium border-y border-slate-500 border-dashed py-3">
                Loadings Under Own Damage Section
              </p>
              <p className="font-medium my-2">
                Discounts Under Own Damage Section
              </p>
              <div className="flex justify-between mb-2">
                <p>TOTAL OWN DAMAGE PREMIUM (A)</p>
                <span className="font-medium">{`₹ ${fmt.formatFixed(
                  prem?.total_od_premium?.total_od
                )}`}</span>
              </div>
              <h1 className="font-bold tracking-wider text-start border-t border-slate-500 border-dashed py-2 pb-2 text-blue-700">
                Section - <span className="me-3">&#8544;</span> ADD ON COVERS
                (C)
              </h1>
              <div className="grid grid-rows-4 gap-1 border-b border-dashed border-black pb-4">
                <div className="flex justify-between">
                  <p>Add: Repair of Glass, Rubber & Plastic Parts (TA08)</p>
                  <span className="font-medium">{`₹ ${fmt.formatFixed(
                    prem?.total_od_premium
                  )}`}</span>
                </div>
                <div className="flex justify-between">
                  <p>Add: Emergency Medical Expenses (TA22)</p>
                  <span className="font-medium">{`₹ ${fmt.formatFixed(
                    prem?.total_od_premium
                  )}`}</span>
                </div>

                <div className="flex justify-between">
                  <p>Sum Insured:</p>
                  <span className="font-medium">{`₹ ${fmt.formatFixed(
                    prem?.total_od_premium
                  )}`}</span>
                </div>

                <div className="flex justify-between">
                  <p>TOTAL ADD ON PREMIUM (C)</p>
                  <span className="font-medium">{`₹ ${fmt.formatFixed(
                    prem?.total_addOns?.total_addon
                  )}`}</span>
                </div>
              </div>
            </div>

            <div className="w-full ps-1 md:ps-2">
              <h1 className="font-bold tracking-wider text-start py-2 pb-4 text-blue-700">
                Section - <span className="me-3">&#x2161;</span> LIABILITY (B)
              </h1>
              <p className="font-medium">Third Party Premium</p>
              <div className="flex justify-between pb-2">
                <p>Basic TP Premium </p>
                <span className="font-medium">{`₹ ${fmt.formatFixed(
                  prem?.total_tp_premium?.basic_tp
                )}`}</span>
              </div>
              <div className="py-1 font-medium border-y text-xs md:text-base border-slate-500 border-dashed">
                PA Benefits
                <div className="flex justify-between py-2 font-normal">
                  <p>1Year(s) Compulsory PA cover for Owner Driver</p>
                  <span className="font-medium">{`₹ ${fmt.formatFixed(
                    prem?.total_tp_premium?.pa_owner_prem
                  )}`}</span>
                </div>
              </div>

              <div className="py-1 flex flex-col font-medium text-xs md:text-base gap-1">
                Legal Liability
                <div className="flex justify-between font-normal mt-2">
                  <p>Add: Legal liabilty to paid driver (IMT28)</p>
                  <span className="font-medium">{`₹ ${fmt.formatFixed(
                    50
                  )}`}</span>
                </div>
                <div className="flex justify-between font-normal">
                  <p>Number of Person</p>
                  <span>1</span>{" "}
                </div>
                <div className="flex justify-between font-normal">
                  <p>Total Liability Premium (B)</p>
                  <span className="font-medium">{`₹ ${fmt.formatFixed(
                   liability
                  )}`}</span>
                </div>
              </div>

              <div className="grid grid-rows-4 gap-1 border-y border-dashed border-black py-2 pb-4">
                <div className="flex justify-between">
                  <p>Comprehensive Premium (A+B+C)</p>
                  <span className="font-medium">
                    {" "}
                    {`₹ ${fmt.formatFixed(comp_premium)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <p>Net Premium</p>
                  <span className="font-medium">{`₹ ${fmt.formatFixed(
                    prem?.net_premium
                  )}`}</span>
                </div>

                <div className="flex justify-between">
                  <p>SGST/UGST @9%</p>
                  <span className="font-medium">{`₹ ${fmt.formatFixed(
                    prem?.sgst_prem
                  )}`}</span>
                </div>

                <div className="flex justify-between">
                  <p>CGST @9%</p>
                  <span className="font-medium">{`₹ ${fmt.formatFixed(
                    prem?.cgst_prem
                  )}`}</span>
                </div>
                <div className="flex justify-between">
                  <p>Total Policy Premium</p>
                  <span className="font-medium">{`₹ ${fmt.formatFixed(
                    prem?.final_premium
                  )}`}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default CqPremBreakup;
