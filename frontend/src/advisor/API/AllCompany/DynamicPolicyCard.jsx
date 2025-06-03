import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import Data from "../Data";
import { useAppContext } from "../../../context/Context";

const DynamicPolicyCard = () => {
  const { images } = useOutletContext();
  const { state } = useAppContext();

  const { insuranceName, category, selectedCategory } = useParams();
  const [colorClass, setColorClass] = useState("bg-gray-700");
  const [colorClass1, setColorClass1] = useState("text-slate-100");
  const navigate = useNavigate(); // Add useNavigate

  useEffect(() => {
    switch (insuranceName) {
      case "tata_aig":
        setColorClass("bg-gradient-to-l from-blue-700 to-blue-400");
        setColorClass1("text-slate-100 ");
        break;
      case "magma_hdi":
        setColorClass("bg-gradient-to-t from-green-700 to-green-400");
        setColorClass1("text-slate-100");
        break;
      default:
        setColorClass("bg-gray-700");
        break;
    }
  }, [insuranceName]);

  const handleCardClick = (path) => {
    navigate(
      `/advisor/home/${insuranceName}/${category}/${selectedCategory}/${path}`
    );
  };

  return (
    <AnimatePresence>
      <div className={`md:flex justify-center min-h-screen ${colorClass}`}>
        {/* Left side - Image */}
        <div className="md:w-1/2 h-auto relative flex justify-center items-center ">
          <img
            src={images || state.tata.privateCar.controller.img2}
            alt="logo"
            className="md:w-1/2 object-fitr cover rounded-lg shadow-lg"
          />
        </div>

        {/* Right side - Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:w-1/2 flex flex-col items-center justify-center p-8 text-white"
        >
          <h1 className="capitalize tracking-wider md:text-3xl text-xl font-bold mb-10">
            {selectedCategory.replace(/-/g, " ")}
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {Data?.Dynamic_cards.map((card) => (
              <div
                key={card?.id}
                onClick={() => handleCardClick(card?.path)}
                className={`${colorClass} flex flex-col justify-center items-center p-6 rounded-lg border border-gray-200 bg-slate-100 hover:bg-gray-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
              >
                <span className={`text-3xl mb-4 ${colorClass1}`}>
                  {card?.logo}
                </span>
                <p
                  className={`font-bold tracking-wider text-center ${colorClass1}`}
                >
                  {card?.name}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DynamicPolicyCard;
