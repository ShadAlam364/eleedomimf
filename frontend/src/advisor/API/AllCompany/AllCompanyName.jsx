import CompanyListModals from "./CompanyListModals";
import {NavLink} from "react-router-dom";
import Data from "../Data";
import { useState } from "react";
import { useAppContext } from "../../../context/Context";
function AllCompanyName() {
  const {dispatch} = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState("");
  const toggleModal = (insuranceName, categories, image, img2) => {
    setImages(image);
    dispatch({
      type: "SET_TATA_PRIVATE_CAR_CONTROLLER",
      payload: {
        insuranceName,
        categories,
        image,
        img2
      },
    });
    
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div className="flex sm:ml-48 bg-slate-100  px-5 justify-evenly transition-all duration-500 ease-in-out">
      {/* General Insurance */}
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-lg text-start md:text-2xl lg:text-3xl font-mono font-bold">
          General Insurance
        </h2>
        <div className="flex flex-wrap ml-3 md:gap-16 gap-6">
          {Data.GeneralInsurance.map((item, index) => (
            <button
              onClick={() => toggleModal(item?.name, item?.categories, item?.image, item.img2)}
              key={index}
              className="w-44 h-44 md:w-52 md:h-52 lg:h-64 lg:w-64  bg-white  rounded-md hover:shadow-2xl hover:shadow-black hover:-translate-y-1 active:-translate-y-4 duration-150"
            >
              <img
                className="w-auto rounded-md h-auto hover:shadow-inner"
                src={item.image}
                alt={item.name}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Life Insurance */}
      <div className="flex flex-col items-center space-y-4 mb-4">
        <h2 className="text-lg text-start md:text-2xl lg:text-3xl font-mono font-bold">
          Life Insurance
        </h2>
        <div className="flex flex-wrap justify-center md:gap-10 gap-6">
          {Data.LifeInsurance.map((item, index) => (
            <NavLink
             to= {item.links}
             target="_blank"
              key={index}
              className="w-44 h-44 md:w-52 md:h-52 lg:h-64 lg:w-64  bg-white  border-gray-200 rounded-md hover:shadow-2xl hover:shadow-black  hover:-translate-y-1 active:-translate-y-4 duration-150"
            >
              <img
                className="w-auto h-auto rounded-md hover:shadow-inner"
                src={item.image}
                alt={item.name}
              />
            </NavLink>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <CompanyListModals
          closeModal={() => setIsModalOpen(false) } images = {images}
        />
      )}
    </div>
  );
}

export default AllCompanyName;