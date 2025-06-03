// src/pages/Home.jsx
import ImageSlider from "../components/Imageslider";
import { Link } from "react-router-dom";

// src/components/ImageSlider.jsx

import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";

import "swiper/css/navigation";
import "swiper/css/pagination";

// Import required modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import axios from "axios";
import VITE_DATA from "../config/config";

// const logos = [
//   "/slider/1.png",
//   "/slider/2.png",
//   "/slider/3.png",
//   "/slider/4.png",
//   "/slider/5.png",
// ];

const generalinsurance = [
  "/bottomlogo/1.png",
  "/bottomlogo/2.png",
  "/bottomlogo/3.png",
  "/bottomlogo/4.png",
  "/bottomlogo/5.png",
  "/bottomlogo/6.png",
  "/bottomlogo/7.png",
  "/life insurance/1.png",
  "/life insurance/2.png",
  "/life insurance/3.png",
];

// const lifeinsurance = [
//   "/life insurance/1.png",
//   "/life insurance/2.png",
//   "/life insurance/3.png",
// ];

function Home() {
  const [APIData, setAPIData] = useState([]);

  useEffect(() => {
    axios
      .get(`${VITE_DATA}/users/activeusers`)
      .then((response) => {
        setAPIData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <>
      <div className="flex justify-center">
        <div className=" w-[100%]  z-1 shadow-2xl shadow-gray-200">
          <ImageSlider />
        </div>
      </div>

      <div className="flex justify-center items-center my-12">
        <div className="container-fluid w-[80%] ">
          <div className="flex flex-wrap items-center justify-center  ">
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 items-center ">
              {/* Column 1 */}
              <div className="w-full ">
                <Link to="/apply/life-insurance">
                  <img
                    src="/assets/home 1st section/insurance.png"
                    alt="Pic 1"
                    className=" object-cover  transition-transform duration-100 ease-in-out  hover:shadow-lg  rounded-lg bg-blue-200 h-30 w-full  "
                  />
                  <p className="text-base text-center pt-1">Life Insurance</p>
                </Link>
              </div>
              {/* Column 2 */}
              <div className="w-full ">
                <Link to="/apply/health-insurance">
                  <img
                    src="/assets/home 1st section/healthcare.png"
                    alt="Pic 1"
                    className=" object-cover  transition-transform duration-100 ease-in-out  hover:shadow-lg  rounded-lg bg-blue-200 h-30 w-full  "
                  />
                  <p className="text-base text-center pt-1">Health Insurance</p>
                </Link>
              </div>

              <div className="w-full ">
                <Link to="/apply/family-Health-insurance">
                  <img
                    src="/assets/home 1st section/family insurance.png"
                    alt="Pic 1"
                    className=" object-cover  transition-transform duration-100 ease-in-out  hover:shadow-lg  rounded-lg bg-blue-200 h-30 w-full  "
                  />
                  <p className="text-base text-center pt-1">
                    Family Health Insurance
                  </p>
                </Link>
              </div>

              <div className="w-full ">
                <Link to="/apply/employee-group-health insurance">
                  <img
                    src="/assets/home 1st section/employee group.png"
                    alt="Pic 1"
                    className=" object-cover  transition-transform duration-100 ease-in-out  hover:shadow-lg  rounded-lg bg-blue-200 h-30 w-full  "
                  />
                  <p className="text-base text-center pt-1">
                    Employee Group Health
                  </p>
                </Link>
              </div>

              <div className="w-full ">
                <Link to="/apply/2-wheeler-insurance">
                  <img
                    src="/assets/home 1st section/2 wheeler.png"
                    alt="Pic 1"
                    className=" object-cover  transition-transform duration-100 ease-in-out  hover:shadow-lg  rounded-lg bg-blue-200 h-30 w-full  "
                  />
                  <p className="text-base text-center pt-1">
                    2 Wheeler Insurance
                  </p>
                </Link>
              </div>

              {/* <div className="w-full ">
                <Link to="/apply/investment-plan">
                  <img
                    src="/assets/home 1st section/investment.png"
                    alt="Pic 1"
                    className=" object-cover  transition-transform duration-100 ease-in-out  hover:shadow-lg  rounded-lg bg-blue-200 h-30 w-full  "
                  />
                  <p className="text-base text-center pt-1">Investment Plan</p>
                </Link>
              </div> */}

              {/* Column 4 */}
              <div className="w-full ">
                <Link to="/apply/car-insurance">
                  <img
                    src="/assets/home 1st section/car insurance.png"
                    alt="Pic 1"
                    className=" object-cover  transition-transform duration-100 ease-in-out  hover:shadow-lg  rounded-lg bg-blue-200 h-30 w-full  "
                  />
                  <p className="text-base text-center pt-1">Car Insurance</p>
                </Link>
              </div>

              <div className="w-full ">
                <Link to="/apply/comercial-vehicle-insurance">
                  <img
                    src="/assets/home 1st section/comercialvehicle.png"
                    alt="Pic 1"
                    className=" object-cover  transition-transform duration-100 ease-in-out  hover:shadow-lg  rounded-lg bg-blue-200 h-30 w-full  "
                  />
                  <p className="text-base text-center pt-1">
                    Comercial Vehicle Insurance
                  </p>
                </Link>
              </div>

              {/* Column 5 */}

              {/* Column 6 */}

              {/* Column 7 */}
              <div className="w-full ">
                <Link to="/apply/travel-insurance">
                  <img
                    src="/assets/home 1st section/travel insurance.png"
                    alt="Pic 1"
                    className=" object-cover  transition-transform duration-100 ease-in-out  hover:shadow-lg  rounded-lg bg-blue-200 h-30 w-full  "
                  />
                  <p className="text-base text-center pt-1">Travel Insurance</p>
                </Link>
              </div>
              {/* Column 8 */}
              <div className="w-full ">
                <Link to="/apply/term-insurance-women">
                  <img
                    src="/assets/home 1st section/Term Insurance women.png"
                    alt="Pic 1"
                    className=" object-cover  transition-transform duration-100 ease-in-out  hover:shadow-lg  rounded-lg bg-blue-200 h-30 w-full  "
                  />
                  <p className="text-base text-center pt-1">
                    Term Insurance (women)
                  </p>
                </Link>
              </div>

              <div className="w-full ">
                <Link to="/apply/home-insurance">
                  <img
                    src="/assets/home 1st section/home insurance.png"
                    alt="Pic 1"
                    className=" object-cover  transition-transform duration-100 ease-in-out  hover:shadow-lg  rounded-lg bg-blue-200 h-30 w-full  "
                  />
                  <p className="text-base text-center pt-1">Home Insurance</p>
                </Link>
              </div>

              <div className="w-full ">
                <Link to="/apply/business-insurance">
                  <img
                    src="/assets/home 1st section/business.png"
                    alt="Pic 1"
                    className=" object-cover  transition-transform duration-100 ease-in-out  hover:shadow-lg  rounded-lg bg-blue-200 h-30 w-full  "
                  />
                  <p className="text-base text-center pt-1">
                    Business Insurance
                  </p>
                </Link>
              </div>

              <div className="w-full ">
                <Link to="/apply/marine-insurance">
                  <img
                    src="/assets/home 1st section/marine.png"
                    alt="Pic 1"
                    className=" object-cover  transition-transform duration-100 ease-in-out  hover:shadow-lg  rounded-lg bg-blue-200 h-30 w-full  "
                  />
                  <p className="text-base text-center pt-1">Marine Insurance</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Also buy section */}
      <div className="flex justify-center mt-12 mb-15">
        <div className="w-[80%] text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug">
            Also <span className="text-blue-600">Buy</span>
          </h2>
          <div className="h-1 w-16 bg-blue-600 mt-2 mx-auto rounded-full"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6  gap-4 mt-6">
            {/* Service Card 1 */}
            <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50">
              <div className="flex justify-center mb-2">
                {/* Replace this emoji with an actual icon if needed */}
                <div className="w-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl">
                  <img src="/assets/alsobuysection/insuranceplan.png" alt="" />
                </div>
              </div>
              <h3 className="text-center text-base font-semibold text-black ">
                Insurance Plan
              </h3>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50">
              <div className="flex justify-center mb-2">
                {/* Replace this emoji with an actual icon if needed */}
                <div className="w-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl">
                  <img
                    src="/assets/alsobuysection/returnofpremium.png"
                    alt=""
                  />
                </div>
              </div>
              <h3 className="text-center text-base font-semibold text-black ">
                Rerunt Of Premium
              </h3>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50">
              <div className="flex justify-center mb-2">
                {/* Replace this emoji with an actual icon if needed */}
                <div className="w-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl">
                  <img src="/assets/alsobuysection/lifeinsurance.png" alt="" />
                </div>
              </div>
              <h3 className="text-center text-base font-semibold text-black ">
                Life Insurance
              </h3>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50">
              <div className="flex justify-center mb-2">
                {/* Replace this emoji with an actual icon if needed */}
                <div className="w-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl">
                  <img src="/assets/alsobuysection/day1coverage.png" alt="" />
                </div>
              </div>
              <h3 className="text-center text-base font-semibold text-black ">
                Day 1 Coverage
              </h3>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50">
              <div className="flex justify-center mb-2">
                {/* Replace this emoji with an actual icon if needed */}
                <div className="w-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl">
                  <img
                    src="/assets/alsobuysection/1crorehealthinsurance.png"
                    alt=""
                  />
                </div>
              </div>
              <h3 className="text-center text-base font-semibold text-black ">
                1 Crore Health Insurance
              </h3>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50">
              <div className="flex justify-center mb-2">
                {/* Replace this emoji with an actual icon if needed */}
                <div className="w-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl">
                  <img
                    src="/assets/alsobuysection/unlimitedrestoration.png"
                    alt=""
                  />
                </div>
              </div>
              <h3 className="text-center text-base font-semibold text-black ">
                Unlimited Restoration
              </h3>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50">
              <div className="flex justify-center mb-2">
                {/* Replace this emoji with an actual icon if needed */}
                <div className="w-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl">
                  <img
                    src="/assets/alsobuysection/marineinsurance.png"
                    alt=""
                  />
                </div>
              </div>
              <h3 className="text-center text-base font-semibold text-black ">
                Marine Insurance
              </h3>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50">
              <div className="flex justify-center mb-2">
                {/* Replace this emoji with an actual icon if needed */}
                <div className="w-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl">
                  <img
                    src="/assets/alsobuysection/professionalidentityfordoctor.png"
                    alt=""
                  />
                </div>
              </div>
              <h3 className="text-center text-base font-semibold text-black ">
                Professional Identity For Doctors
              </h3>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50">
              <div className="flex justify-center mb-2">
                {/* Replace this emoji with an actual icon if needed */}
                <div className="w-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl">
                  <img
                    src="/assets/alsobuysection/directorandofficerliability.png"
                    alt=""
                  />
                </div>
              </div>
              <h3 className="text-center text-base font-semibold text-black ">
                Director and Officer Liability
              </h3>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50">
              <div className="flex justify-center mb-2">
                {/* Replace this emoji with an actual icon if needed */}
                <div className="w-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl">
                  <img src="/assets/alsobuysection/compansation.png" alt="" />
                </div>
              </div>
              <h3 className="text-center text-base font-semibold text-black ">
                Workmen Compansation
              </h3>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50">
              <div className="flex justify-center mb-2">
                {/* Replace this emoji with an actual icon if needed */}
                <div className="w-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl">
                  <img src="/assets/alsobuysection/petinsurance.png" alt="" />
                </div>
              </div>
              <h3 className="text-center text-base font-semibold text-black ">
                Pet Insurance
              </h3>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50">
              <div className="flex justify-center mb-2">
                {/* Replace this emoji with an actual icon if needed */}
                <div className="w-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl">
                  <img
                    src="/assets/alsobuysection/comercialinsurance.png"
                    alt=""
                  />
                </div>
              </div>
              <h3 className="text-center text-base font-semibold text-black ">
                Comercial Insurance
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center bg-gray-100 py-10 mb-10">
        <div className="w-[100%] ">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug">
              Our <br className="sm:hidden" />
              <span className="text-blue-600">Highlights</span>
            </h2>
            <div className="h-1 w-16 bg-blue-600 mt-2 mx-auto rounded-full"></div>
          </div>{" "}
          <div className="flex flex-wrap justify-center">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              pagination={{ clickable: true }}
              loop={true}
              autoplay={{ delay: 2500 }}
              className="mySwiper"
            >
              <SwiperSlide>
                <img
                  src="/our highlight/1.png"
                  alt="Slide 1"
                  className="rounded-xl hover:shadow-xl shadow-lg shadow-blue-100"
                />
              </SwiperSlide>

              <SwiperSlide>
                <img
                  src="/our highlight/2.png"
                  alt="Slide 2"
                  className="rounded-xl hover:shadow-xl shadow-lg shadow-blue-100"
                />
              </SwiperSlide>

              <SwiperSlide>
                <img
                  src="/our highlight/3.png"
                  alt="Slide 3"
                  className="rounded-xl hover:shadow-xl shadow-lg shadow-blue-100"
                />
              </SwiperSlide>

              <SwiperSlide>
                <img
                  src="/our highlight/4.png"
                  alt="Slide 4"
                  className="rounded-xl hover:shadow-xl shadow-lg shadow-blue-100"
                />
              </SwiperSlide>

              <SwiperSlide>
                <img
                  src="/our highlight/5.png"
                  alt="Slide 5"
                  className="rounded-xl hover:shadow-xl shadow-lg shadow-blue-100"
                />
              </SwiperSlide>

              <SwiperSlide>
                <img
                  src="/our highlight/6.png"
                  alt="Slide 6"
                  className="rounded-xl hover:shadow-xl shadow-lg shadow-blue-100"
                />
              </SwiperSlide>

              <SwiperSlide>
                <img
                  src="/our highlight/7.png"
                  alt="Slide 7"
                  className="rounded-xl hover:shadow-xl shadow-lg shadow-blue-100"
                />
              </SwiperSlide>

              <SwiperSlide>
                <img
                  src="/our highlight/8.png"
                  alt="Slide 8"
                  className="rounded-xl hover:shadow-xl shadow-lg shadow-blue-100"
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>

      <div className=" bg-cover bg-center bg-no-repeat flex justify-center items-center py-20 mb-10">
        <div className="w-[80%] max-w-screen-xl ">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Left Side Text */}
            <div className="w-full md:w-1/2 border-l-4 border-blue-600 pl-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                What makes
              </h2>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 leading-snug mt-1">
                Eleedom Imf Private Limited
              </h2>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug mt-1">
                one of India’s favourite places
              </h2>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                to <span className="text-blue-600">buy insurance?</span>
              </h2>
            </div>

            {/* Right Side Feature Grid */}
            <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { text: "Fast & Transparent Process", color: "text-blue-600" },
                { text: "Expert Assistance Anytime", color: "text-green-600" },
                { text: "Multiple Insurance Options", color: "text-amber-700" },
                { text: "Trusted by Thousands", color: "text-black" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white bg-opacity-90 h-40 md:h-48 flex items-center justify-center text-center px-4 border-l-4 border-blue-600 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
                >
                  <p
                    className={`font-semibold ${item.color} text-lg sm:text-xl`}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* slider */}

      <div className="bg-gray-100  mb-8 flex justify-center">
        <div className="w-[100%] ">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop={true}
            pagination={{ clickable: true }}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="mySwiper"
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <SwiperSlide key={i} className="flex justify-center">
                <img
                  src={`/slider/${i}.png`}
                  alt={`Slide ${i}`}
                  className="h-full w-full object-contain rounded-xl shadow-md   bg-white "
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="flex justify-center my-16">
        <div className="w-[80%] max-w-screen-xl">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug">
              EleedomIMF <br className="sm:hidden" />
              <span className="text-blue-600">Benefits</span>
            </h2>
            <div className="h-1 w-16 bg-blue-600 mt-2 mx-auto rounded-full mb-4"></div>
            <p>
              When you buy insurance from us, you get more than just financial
              safety. You also get our promise of simplifying complex insurance
              terms and conditions, quick stress-free claims, instant quotes
              from top insurers and being present for you in the toughest of
              times.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-12  place-items-center">
            {[
              { icon: "/best-price.png", title: "Affordable Pricing" },
              { icon: "/discount.png", title: "Best Discount" },
              { icon: "/doctor.png", title: "Unbiased Advice" },
              { icon: "/repair.png", title: "Claims Support" },
              { icon: "/help-desk.png", title: "Happy to Help" },
            ].map((item, i) => (
              <div
                key={i}
                className="w-52 h-52  sm:w-60 sm:h-60 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 flex flex-col overflow-hidden"
              >
                <div className="flex-1 flex items-center justify-center p-4 bg-white">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-32 h-32 object-fit"
                  />
                </div>
                <div className="bg-blue-100 py-3 px-2 text-center">
                  <p className="text-gray-700 text-base font-semibold">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What our customer are saying section */}

      {/* What our customer are saying section */}
      {APIData && APIData.length > 0 && (
        <div className="flex justify-center bg-gray-100 py-16">
          <div className="container w-[80%] max-w-screen-xl">
            {/* Section Heading */}
            <div className="text-center mb-12 ">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug">
                What Our Customers <br className="sm:hidden" />
                <span className="text-blue-600">Are Saying</span>
              </h2>
              <div className="h-1 w-16 bg-blue-600 mt-2 mx-auto rounded-full"></div>
            </div>

            {/* Swiper Section */}
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              loop={true}
              autoplay={true}
              pagination={{ clickable: true }}
              navigation
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="mySwiper w-full"
            >
              {APIData.map((feedback, i) => (
                <SwiperSlide key={i}>
                  <div className="bg-white rounded-2xl shadow-md p-6 h-64 flex flex-col justify-between">
                    <div>
                      <div className="text-blue-500 text-3xl mb-4"></div>
                      <p className="text-gray-700 text-base leading-relaxed">
                        {feedback.feedbackuser_query}
                      </p>
                    </div>
                    <div className="mt-6 text-base text-blue-500 font-semibold tracking-wider">
                      — {feedback.feedbackuser_name}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* Our partners section */}
      <div className="flex justify-center bg-gray-100">
        <div className="w-full py-4 overflow-hidden ">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug">
              Our <br className="sm:hidden" />
              <span className="text-blue-600">Partners</span>
            </h2>
            <div className="h-1 w-16 bg-blue-600 mt-2 mx-auto rounded-full"></div>
          </div>

          {/* <div>
            <p className="text-black text-2xl font-bold text-center mb-2">
              Life <span className="text-blue-700">Insurance</span>
            </p>
            <div className="h-1 w-16 bg-blue-600 mx-auto rounded-full mb-5"></div>

            <div className="relative overflow-hidden">
              <div className="mx-5 lg:mx-0 md:flex justify-center ">
                {lifeinsurance.map((logos, index) => (
                  <div
                    key={index}
                    className="flex mx-8 items-center justify-center bg-white rounded-md shadow px-2 my-4"
                  >
                    <img
                      src={logos}
                      alt={`life-${index}`}
                      className=" items-center justify-center bg-white rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div> */}

          <div className="my-10">
            {/* <p className="text-black text-2xl font-bold text-center mb-2">
              General <span className="text-blue-700">Insurance</span>
            </p> */}
            {/* <div className="h-1 w-16 bg-blue-600 mx-auto rounded-full mb-5"></div> */}
            <div className="relative overflow-hidden">
              <div className="flex w-max gap-10 animate-slideLeft justify-center mx-auto">
                {[...generalinsurance, ...generalinsurance].map(
                  (logo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center bg-white rounded-xl shadow p-4"
                    >
                      <img
                        src={logo}
                        alt={`general-${index}`}
                        className="w-full flex items-center justify-center bg-white "
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <style>
            {`
        @keyframes slideLeft {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-slideLeft {
          animation: slideLeft 40s linear infinite ;
        }
      `}
          </style>
        </div>
      </div>
    </>
  );
}

export default Home;
