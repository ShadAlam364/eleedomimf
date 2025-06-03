/* eslint-disable react/prop-types */
import  { useState, useEffect,  Suspense } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import VITE_DATA from '../../config/config.jsx';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';

const Carousel = () => {
  const [APIData, setAPIData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_DATA}/users/first/view`);
        setAPIData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Suspense fallback={null} className="flex mx-auto justify-self-stretch bg-black">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="container-fluid border-0 border-black"
      >
        {APIData.map((obj, idx) => (
        <SwiperSlide key={idx} >
        <NavLink to={obj.usercarousel_link} className="container-fluid justify-self-stretch">
          <img
            src={obj.usercarousel_upload}
            className="brightness-100 flex justify-items-stretch justify-self-stretch contrast-125 w-full h-full object-cover"
            alt={`slide-${idx}`}
            loading="lazy"
          />
        </NavLink>
      </SwiperSlide>
      
        ))}
      </Swiper>
    </Suspense>
  );
};

export default Carousel;
