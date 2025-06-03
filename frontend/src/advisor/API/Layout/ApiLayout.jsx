/* eslint-disable react/display-name */
import { useLocation, useParams, useNavigate, Outlet } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { useAppContext } from "../../../context/Context.jsx";
import { AnimatePresence, motion } from "motion/react";
const ApiLayout = memo(() => {
  const { state } = useAppContext();
  const [selectedOption, setSelectedOption] = useState("");
  const { insuranceName, category } = useParams();
  const [menuItems, setMenuItems] = useState({});
  const location = useLocation();
  const { subCats, images } = location.state || {};
  const [colorClass, setColorClass] = useState("bg-gray-700");
  const navigate = useNavigate(); // Add useNavigate for programmatic navigation

  useEffect(() => {
    switch (insuranceName) {
      case "tata_aig":
        setColorClass("bg-gradient-to-l from-blue-700 to-blue-400");
        break;
      case "magma_hdi":
        setColorClass("bg-gradient-to-b from-green-700 to-green-400");
        break;
      default:
        setColorClass("bg-gray-700");
        break;
    }
  }, [insuranceName]);

  useEffect(() => {
    const savedOption = sessionStorage.getItem("selectedOption");
    if (savedOption) {
      setSelectedOption(savedOption);
      if (subCats && subCats[savedOption]) {
        const items = Object.values(subCats[savedOption]);
        setMenuItems(items);
      }
    }
  }, [subCats]);

  const handleSelectChange = (event) => {
    const selectedCategory = event.target.value;
    setSelectedOption(selectedCategory);
    sessionStorage.setItem("selectedOption", selectedCategory);

    // Navigate to the new URL with the selectedOption as a parameter
    navigate(
      `/advisor/home/${insuranceName}/${category}/${selectedCategory
        .toLowerCase()
        .replace(/\s+/g, "-")}`
    );

    if (subCats && subCats[selectedCategory]) {
      const items = Object.values(subCats[selectedCategory]);
      setMenuItems(items);
    } else {
      setMenuItems([]);
    }
  };

  return (
    <AnimatePresence>
      {subCats && (
        <div
          className={`${colorClass} container-fluid h-screen items-center p-1`}
        >
          {/* part-1 */}
          <div className={`flex justify-between items-center py-1`}>
            <img
              className="w-20 h-20 shadow-inner z-10"
              src={images || state.tata.privateCar.controller.image}
              alt={state.tata.privateCar.controller.insuranceName}
            />

            <h1 className="font-semibold text-xl md:text-2xl text-center text-white uppercase">
              {insuranceName
                .replace(/_+/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </h1>
            <h1></h1>
          </div>

          {/* part -2 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 4 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="grid grid-cols-3 gap-4 my-auto">
            {Object.keys(subCats).map((subCat, index) => (
              <div
                key={index}
                onClick={() =>
                  handleSelectChange({ target: { value: subCat } })
                }
                className={`flex justify-center items-center cursor-pointer border rounded-lg md:p-4 mx-2 h-32 md:h-96 my-40 text-center shadow-md transition-all duration-300 ${
                  selectedOption === subCat
                    ? `${colorClass} text-white`
                    : "bg-slate-200 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
                }`}>
                <p className="capitalize text-xl md:text-4xl font-semibold tracking-wider">
                  {subCat.replace(/-/g, " ")}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      )}
      {/* Render DynamicPolicyCard based on URL */}
      <Outlet context={{ selectedOption, menuItems, images }} />
    </AnimatePresence>
  );
});

export default ApiLayout;
