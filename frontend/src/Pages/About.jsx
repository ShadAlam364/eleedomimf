
import { Link } from "react-router-dom";

function About() {
  return (
    <>
    
      <div className="flex justify-center bg-blue-600 shadow-lg">
        <div className="w-[80%] py-6 md:py-6">
          <div className="pl-2 border-l-[5px] border-white">
            {/* Emoji Section */}
            <div className="flex items-center gap-2 ml-4">
              <span className="text-2xl">🏢</span>
              <h3 className="text-white font-bold text-2xl">About Us</h3>
            </div>

            <h3 className="text-white font-bold text-lg ml-4">
              Home / <span className="text-white font-light text-sm">About Us</span>
            </h3>

            {/* Routing Links */}
            <div className="flex gap-4 mt-4 ml-4">
              <Link
                to="/about/about-us"
                className="text-sm text-white border border-blue-600 px-3 py-1 rounded-2xl hover:bg-white hover:text-black transition bg-black"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      


      <section className="flex justify-center mb-[15px] bg-gray-100 mt-5">
        <div className="w-[80%]">
          {/* Part - 1 */}
          <div className="flex flex-col md:flex-row my-auto justify-center">
            <div className="h-auto flex  items-center">
              <img
                src="/logo.webp"
                alt="company img"
                className="w-1/2 md:w-2/3 lg:w-1/1 mt-4 md:mt-0 items-center transition-transform transform hover:scale-105 duration-300 ease-in-out"
              />
            </div>

            <div className="w-full mt-4 flex my-auto flex-col lg:w-1/2  rounded-lg">
              {/* Part-1 */}
              <div className="w-full mx-auto items-center justify-center text-justify">
                <h1 className="text-xl text-center text-blue-800 font-semibold">
                  Welcome to Eleedom IMF PVT. LTD. <br />
                  (Your Trusted Insurance Partner)
                </h1>
                <p className="text-lg my-1 mx-5">
                  Established in 2022, Eleedom IMF PVT. LTD has a rich legacy that
                  spans over 16 years in the insurance industry. What started as
                  an individual agency in Bihar has evolved into a leading
                  insurance marketing firm, proudly serving the region and beyond.
                </p>
              </div>
              {/* Part -2 */}
              <div className="w-full mx-auto items-center justify-center mt-4 text-justify">
                <h1 className="text-xl text-center text-blue-800 font-semibold">
                  Our Journey
                </h1>
                <div className="w-full flex items-center justify-center text-justify">
                  <p className="text-lg my-0.5 mx-5">
                    Rooted in the heart of Bihar, we embarked on our journey in
                    2006 as individual agents dedicated to providing reliable and
                    comprehensive insurance solutions. Over the years, our
                    commitment to excellence and client satisfaction propelled us
                    to the forefront of the industry.
                  </p>
                </div>
              </div>
              {/* Part -3 */}
              <div className="w-full mx-auto items-center justify-center mt-4 text-justify">
                <h1 className="text-xl text-center text-blue-800 font-semibold">
                  Leading the Way
                </h1>
                <div className="w-full flex items-center justify-center text-justify">
                  <p className="text-lg my-0.5 mx-5">
                    For the past five years, we have proudly held the title of the
                    leading insurance agent in our region. This achievement is a
                    testament to our unwavering dedication to our clients and our
                    passion for safeguarding what matters most to them.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section-2: Why Choose Eleedom IMF PVT. LTD. */}
          <div className="my-10 flex justify-center">
            <div className="w-full px-4">
              <h1 className="text-2xl text-center text-blue-800 font-semibold mb-8">
                Why Choose Eleedom IMF PVT. LTD.
              </h1>
              <div className="block md:flex gap-6">
                {/* Card 1: Experience */}
                <div className="w-full bg-white rounded-lg shadow-md p-8 text-center transition-transform transform hover:scale-105 hover:shadow-lg duration-300 min-h-[200px] mb-6 md:mb-0">
                  <h2 className="text-2xl text-blue-800 font-semibold">Experience</h2>
                  <p className="text-lg text-gray-900 mt-4 text-justify space-x-4 tracking-tight">
                    With over a decade of experience, we bring a wealth of knowledge
                    to the table, ensuring you receive expert advice and tailored
                    solutions.
                  </p>
                </div>
                {/* Card 2: Local Expertise */}
                <div className="w-full bg-white rounded-lg shadow-md p-8 text-center transition-transform transform hover:scale-105 hover:shadow-lg duration-300 min-h-[200px] mb-6 md:mb-0">
                  <h2 className="text-2xl text-blue-800 font-semibold">Local Expertise</h2>
                  <p className="text-lg text-gray-900 mt-4 text-justify space-x-4 tracking-tight">
                    As a company deeply rooted in Bihar, we understand the unique
                    challenges and opportunities of our region, allowing us to provide
                    insurance solutions that resonate with the local community.
                  </p>
                </div>



                {/* Card 3: Customer-Centric Approach */}
                <div className="w-full bg-white rounded-lg shadow-md p-8 text-center transition-transform transform hover:scale-105 hover:shadow-lg duration-300 min-h-[200px] mb-6 md:mb-0">
                  <h2 className="text-2xl text-blue-800 font-semibold">Customer-Centric Approach</h2>
                  <p className="text-lg text-gray-900 mt-4 text-justify space-x-4 tracking-tight">
                    Your satisfaction is our priority. We prioritize clear
                    communication, transparency, and personalized service to meet
                    your unique needs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section-3: Our Services */}
          <div className="my-10 flex justify-center">
            <div className="w-full px-4">
              <h1 className="text-2xl text-center text-blue-800 font-semibold mb-8">
                Our Services
              </h1>
              <div className="block md:flex gap-6">
                {/* Card 1: General Insurance */}
                <div className="w-full bg-white rounded-lg shadow-md p-8 text-center transition-transform transform hover:scale-105 hover:shadow-lg duration-300  mb-6 md:mb-0">
                  <h2 className="text-2xl text-blue-800 font-semibold">General Insurance</h2>
                  <p className="text-lg text-gray-900 mt-4 text-justify space-x-4 tracking-tight">
                    Protect your assets, business, and personal belongings with our
                    wide range of general insurance options.
                  </p>
                </div>
                {/* Card 2: Personal Insurance */}
                <div className="w-full bg-white rounded-lg shadow-md p-8 text-center transition-transform transform hover:scale-105 hover:shadow-lg duration-300  mb-6 md:mb-0">
                  <h2 className="text-2xl text-blue-800 font-semibold">Personal Insurance</h2>
                  <p className="text-lg text-gray-900 mt-4 text-justify space-x-4 tracking-tight">
                    Safeguard your health, life, and loved ones with our personalized
                    personal insurance solutions.
                  </p>
                </div>
                {/* Card 3: Business Insurance */}
                <div className="w-full bg-white rounded-lg shadow-md p-8 text-center transition-transform transform hover:scale-105 hover:shadow-lg duration-300  mb-6 md:mb-0">
                  <h2 className="text-2xl text-blue-800 font-semibold">Business Insurance</h2>
                  <p className="text-lg text-gray-900 mt-4 text-justify space-x-4 tracking-tight">
                    We understand the complexities of running a business. Our
                    business insurance plans are designed to mitigate risks and
                    support your growth.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section-4: Join Us */}
          <div className="my-10 flex justify-center">
            <div className="w-full  mx-auto px-4 text-center">
              <h1 className="text-2xl text-blue-800 font-semibold mb-6">
                Join Us in Securing Your Future
              </h1>
              <div className="bg-white rounded-lg shadow-md p-8 transition-transform transform hover:scale-105 hover:shadow-lg duration-300 ">
                <p className="text-lg text-gray-900 text-justify tracking-tight">
                  Whether you are an individual looking for personal protection or a
                  business seeking comprehensive coverage, Eleedom IMF PVT LTD is
                  here for you. Explore our website to discover the perfect insurance
                  solution for your needs. Partner with us for a secure and
                  prosperous future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


export default About;





















// import { Link } from "react-router-dom"; // ✅ Correct import

// function About() {
//   return (
//     <>
//       <div className="flex justify-center bg-blue-600 shadow-lg">
//         <div className="w-[80%] py-6 md:py-6">
//           <div className="pl-2 border-l-[5px] border-white">
//             {/* Emoji Section */}
//             <div className="flex items-center gap-2 ml-4">
//               <span className="text-2xl">🏢</span> {/* Emoji added here */}
//               <h3 className="text-white font-bold text-2xl ">About Us</h3>
//             </div>

//             <h3 className="text-white font-bold text-lg ml-4">
//               Home /{" "}
//               <span className="text-white font-light text-sm">About Us</span>
//             </h3>

//             {/* Routing Links */}
//             <div className="flex gap-4 mt-4 ml-4">
//               <Link
//                 to="/about/about-us"
//                 className="text-sm text-white border border-blue-600 px-3 py-1 rounded-2xl hover:bg-white hover:text-black transition bg-black"
//               >
//                 About Us
//               </Link>
//               {/* <Link
//                 to="/about/service"
//                 className="text-sm text-white border border-blue-600 px-3 py-1 rounded-2xl hover:bg-white hover:text-black transition bg-black"
//               >
//                 Our Services
//               </Link> */}
//               {/* <Link
//                 to="/about/team"
//                 className="text-sm text-white border border-blue-600 px-3 py-1 rounded-2xl hover:bg-white hover:text-black transition bg-black"
//               >
//                 Our Team
//               </Link> */}
//             </div>
//           </div>
//         </div>
//       </div>

//       <section className=" flex justify-center mb-15 bg-gray-100">
//       <div
//         className="w-[80%] container-fluid"
//       >
//         {/* part - 1 */}
//         <div className="flex flex-col md:flex-row my-auto justify-center ">
//           <div className=" h-auto flex justify-center items-center ">
//             <img
//               src="/logo.webp" // Add the actual image source
//               alt="company img"
//               className="w-1/2 md:w-2/3 lg:w-1/2 mt-4 md:mt-0 items-center transition-transform transform hover:scale-105 duration-300 ease-in-out"
//             />
//           </div>

//           <div className="w-full mt-4 flex my-auto flex-col lg:w-1/2 max-w-5xl  rounded-lg  ">
//             {/* part-1 */}
//             <div className="w-full mx-auto items-center justify-center  text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold ">
//                 Welcome to Eleedom IMF PVT. LTD. <br />
//                 (Your Trusted Insurance Partner)
//               </h1>
//               <p className=" text-lg my-1 mx-5">
//                 Established in 2022, Eleedom IMF PVT. LTD has a rich legacy that
//                 spans over 16 years in the insurance industry. What started as
//                 an individual agency in Bihar has evolved into a leading
//                 insurance marketing firm, proudly serving the region and beyond.
//               </p>
//             </div>
//             {/* part -2 */}
//             <div className="w-full mx-auto items-center justify-center mt-4 text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//                 Our Journey
//               </h1>
//               <div className="w-full flex items-center justify-center  text-justify">
//                 <p className=" text-lg my-0.5 mx-5">
//                   Rooted in the heart of Bihar, we embarked on our journey in
//                   2006 as individual agents dedicated to providing reliable and
//                   comprehensive insurance solutions. Over the years, our
//                   commitment to excellence and client satisfaction propelled us
//                   to the forefront of the industry.
//                 </p>
//               </div>
//             </div>
//             {/* part -3 */}
//             <div className="w-full mx-auto items-center justify-center mt-4 text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//                 Leading the Way
//               </h1>
//               <div className="w-full flex items-center justify-center  text-justify">
//                 <p className=" text-lg my-0.5 mx-5">
//                   For the past five years, we have proudly held the title of the
//                   leading insurance agent in our region. This achievement is a
//                   testament to our unwavering dedication to our clients and our
//                   passion for safeguarding what matters most to them.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* section-2 */}
//         <div className=" my-10 flex">
//           <div className="w-full  mx-auto items-center justify-center mt-4 text-justify">
//             <h1 className="text-xl text-center text-blue-800 font-semibold">
//               Why Choose Eleedom IMF PVT. LTD.
//             </h1>
//             <div className="block md:flex">
//             {/* 1 */}
//             <div className="w-full  flex flex-col mt-4 items-center justify-center  text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//                 Experience
//               </h1>
//               <p className=" text-lg my-0.5 mx-5">
//                 With over a decade of experience, we bring a wealth of knowledge
//                 to the table, ensuring you receive expert advice and tailored
//                 solutions.
//               </p>
//             </div>

//             {/* 2 */}
//             <div className="w-full flex flex-col mt-4 items-center justify-center  text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//               Local Expertise
//               </h1>
//               <p className=" text-lg my-0.5 mx-5">
//               As a company deeply rooted in Bihar,
//                 we understand the unique challenges and opportunities of our
//                 region, allowing us to provide insurance solutions that resonate
//                 with the local community.
//               </p>
//             </div>

//              {/* 3 */}
//              <div className="w-full  flex flex-col mt-4 items-center justify-center  text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//               Customer-Centric Approach
//               </h1>
//               <p className=" text-lg my-0.5 mx-5">
//               Your satisfaction is our
//                 priority. We prioritize clear communication, transparency, and
//                 personalized service to meet your unique needs.
//               </p>
//             </div>
//           </div>
//           </div>
//         </div>


//          {/* section-3 */}
//          <div className=" mb-10 flex">
//           <div className="w-full  mx-auto items-center justify-center text-justify">
//             <h1 className="text-xl text-center text-blue-800 font-semibold">
//             Our Services
//             </h1>
//             <div className="block md:flex">
//             {/* 1 */}
//             <div className="w-full  flex flex-col mt-4 items-center justify-center  text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//               General Insurance
//               </h1>
//               <p className=" text-lg my-0.5 mx-5">
//               Protect your assets, business, and
//                 personal belongings with our wide range of general insurance
//                 options.
//               </p>
//             </div>

//             {/* 2 */}
//             <div className="w-full flex flex-col mt-4 items-center justify-center  text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//               Personal Insurance
//               </h1>
//               <p className=" text-lg my-0.5 mx-5">
//               Safeguard your health, life, and
//               loved ones with our personalized personal insurance solutions.
//               </p>
//             </div>

//              {/* 3 */}
//              <div className="w-full  flex flex-col mt-4 items-center justify-center  text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//               Business Insurance
//               </h1>
//               <p className=" text-lg my-0.5 mx-5">
//               We understand the complexities of
//                 running a business. Our business insurance plans are designed to
//                 mitigate risks and support your growth.
//               </p>
//             </div>
//           </div>
//           </div>
//         </div>
      
//         <div className="">
//         <h1 className="text-xl text-center text-blue-800 font-semibold">
//         Join Us in Securing Your Future
//               </h1>
        
//           <div className="flex justify-center text-justify  ">
//           <p className=" text-lg my-0.5 mx-5">
//           Whether you&apos;re an individual looking for personal protection
//               or a business seeking comprehensive coverage, Eleedom IMF PVT LTD
//               is here for you. Explore our website to discover the perfect
//               insurance solution for your needs. Partner with us for a secure
//               and prosperous future.
//               </p>
         
//           </div>
//         </div>
//       </div>
//     </section>
//     </>
//   );
// }


// export default About;













































// src/pages/About.jsx

// import { Link } from "react-router-dom"; // ✅ Correct import

// function About() {
//   return (
//     <>
//       <div className="flex justify-center bg-blue-600 shadow-lg">
//         <div className="w-[80%] py-6 md:py-6">
//           <div className="pl-2 border-l-[5px] border-white">
//             {/* Emoji Section */}
//             <div className="flex items-center gap-2 ml-4">
//               <span className="text-2xl">🏢</span> {/* Emoji added here */}
//               <h3 className="text-white font-bold text-2xl ">About Us</h3>
//             </div>

//             <h3 className="text-white font-bold text-lg ml-4">
//               Home /{" "}
//               <span className="text-white font-light text-sm">About Us</span>
//             </h3>

//             {/* Routing Links */}
//             <div className="flex gap-4 mt-4 ml-4">
//               <Link
//                 to="/about/about-us"
//                 className="text-sm text-white border border-blue-600 px-3 py-1 rounded-2xl hover:bg-white hover:text-black transition bg-black"
//               >
//                 About Us
//               </Link>
//               {/* <Link
//                 to="/about/service"
//                 className="text-sm text-white border border-blue-600 px-3 py-1 rounded-2xl hover:bg-white hover:text-black transition bg-black"
//               >
//                 Our Services
//               </Link> */}
//               {/* <Link
//                 to="/about/team"
//                 className="text-sm text-white border border-blue-600 px-3 py-1 rounded-2xl hover:bg-white hover:text-black transition bg-black"
//               >
//                 Our Team
//               </Link> */}
//             </div>
//           </div>
//         </div>
//       </div>

//       <section className="container-fluid relative bg-gray-100">
//       <div
//         className="container-fluid  
//        "
//       >
//         {/* part - 1 */}
//         <div className="flex flex-col md:flex-row my-auto justify-center ">
//           <div className="   h-auto flex justify-center items-center ">
//             <img
//               src="/logo.webp" // Add the actual image source
//               alt="company img"
//               className="w-1/2 md:w-2/3 lg:w-1/2 mt-4 md:mt-0 items-center transition-transform transform hover:scale-105 duration-300 ease-in-out"
//             />
//           </div>

//           <div className="w-full mt-4 flex my-auto flex-col lg:w-1/2 max-w-5xl  rounded-lg  ">
//             {/* part-1 */}
//             <div className="w-full mx-auto items-center justify-center  text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold ">
//                 Welcome to Eleedom IMF PVT. LTD. <br />
//                 (Your Trusted Insurance Partner)
//               </h1>
//               <p className=" text-lg my-1 mx-5">
//                 Established in 2022, Eleedom IMF PVT. LTD has a rich legacy that
//                 spans over 16 years in the insurance industry. What started as
//                 an individual agency in Bihar has evolved into a leading
//                 insurance marketing firm, proudly serving the region and beyond.
//               </p>
//             </div>
//             {/* part -2 */}
//             <div className="w-full mx-auto items-center justify-center mt-4 text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//                 Our Journey
//               </h1>
//               <div className="w-full flex items-center justify-center  text-justify">
//                 <p className=" text-lg my-0.5 mx-5">
//                   Rooted in the heart of Bihar, we embarked on our journey in
//                   2006 as individual agents dedicated to providing reliable and
//                   comprehensive insurance solutions. Over the years, our
//                   commitment to excellence and client satisfaction propelled us
//                   to the forefront of the industry.
//                 </p>
//               </div>
//             </div>
//             {/* part -3 */}
//             <div className="w-full mx-auto items-center justify-center mt-4 text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//                 Leading the Way
//               </h1>
//               <div className="w-full flex items-center justify-center  text-justify">
//                 <p className=" text-lg my-0.5 mx-5">
//                   For the past five years, we have proudly held the title of the
//                   leading insurance agent in our region. This achievement is a
//                   testament to our unwavering dedication to our clients and our
//                   passion for safeguarding what matters most to them.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* section-2 */}
//         <div className=" my-10 flex">
//           <div className="w-full  mx-auto items-center justify-center mt-4 text-justify">
//             <h1 className="text-xl text-center text-blue-800 font-semibold">
//               Why Choose Eleedom IMF PVT. LTD.
//             </h1>
//             <div className="block md:flex">
//             {/* 1 */}
//             <div className="w-full  flex flex-col mt-4 items-center justify-center  text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//                 Experience
//               </h1>
//               <p className=" text-lg my-0.5 mx-5">
//                 With over a decade of experience, we bring a wealth of knowledge
//                 to the table, ensuring you receive expert advice and tailored
//                 solutions.
//               </p>
//             </div>

//             {/* 2 */}
//             <div className="w-full flex flex-col mt-4 items-center justify-center  text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//               Local Expertise
//               </h1>
//               <p className=" text-lg my-0.5 mx-5">
//               As a company deeply rooted in Bihar,
//                 we understand the unique challenges and opportunities of our
//                 region, allowing us to provide insurance solutions that resonate
//                 with the local community.
//               </p>
//             </div>

//              {/* 3 */}
//              <div className="w-full  flex flex-col mt-4 items-center justify-center  text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//               Customer-Centric Approach
//               </h1>
//               <p className=" text-lg my-0.5 mx-5">
//               Your satisfaction is our
//                 priority. We prioritize clear communication, transparency, and
//                 personalized service to meet your unique needs.
//               </p>
//             </div>
//           </div>
//           </div>
//         </div>


//          {/* section-3 */}
//          <div className=" mb-10 flex">
//           <div className="w-full  mx-auto items-center justify-center text-justify">
//             <h1 className="text-xl text-center text-blue-800 font-semibold">
//             Our Services
//             </h1>
//             <div className="block md:flex">
//             {/* 1 */}
//             <div className="w-full  flex flex-col mt-4 items-center justify-center  text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//               General Insurance
//               </h1>
//               <p className=" text-lg my-0.5 mx-5">
//               Protect your assets, business, and
//                 personal belongings with our wide range of general insurance
//                 options.
//               </p>
//             </div>

//             {/* 2 */}
//             <div className="w-full flex flex-col mt-4 items-center justify-center  text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//               Personal Insurance
//               </h1>
//               <p className=" text-lg my-0.5 mx-5">
//               Safeguard your health, life, and
//               loved ones with our personalized personal insurance solutions.
//               </p>
//             </div>

//              {/* 3 */}
//              <div className="w-full  flex flex-col mt-4 items-center justify-center  text-justify">
//               <h1 className="text-xl text-center text-blue-800 font-semibold">
//               Business Insurance
//               </h1>
//               <p className=" text-lg my-0.5 mx-5">
//               We understand the complexities of
//                 running a business. Our business insurance plans are designed to
//                 mitigate risks and support your growth.
//               </p>
//             </div>
//           </div>
//           </div>
//         </div>

       
      

//         <div className="">
//         <h1 className="text-xl text-center text-blue-800 font-semibold">
//         Join Us in Securing Your Future
//               </h1>
        
//           <div className="flex justify-center text-justify  ">
//           <p className=" text-lg my-0.5 mx-5">
//           Whether you&apos;re an individual looking for personal protection
//               or a business seeking comprehensive coverage, Eleedom IMF PVT LTD
//               is here for you. Explore our website to discover the perfect
//               insurance solution for your needs. Partner with us for a secure
//               and prosperous future.
//               </p>
         
//           </div>
//         </div>
//       </div>
//     </section>
//     </>
//   );
// }

// export default About;
