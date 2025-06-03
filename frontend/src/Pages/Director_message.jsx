// src/pages/About.jsx

function Directormessage() {
  return (
    <>
      <div className="flex justify-center bg-blue-600 shadow-lg">
        <div className="w-[80%] py-12 md:py-25">
        <div className="pl-2 border-l-[5px] border-white">
            <h3 className="text-white font-bold text-2xl ml-4 ">
              Director & Message
            </h3>
            <h3 className="text-white font-bold text-lg ml-4 ">
              Home /{" "}
              <span className="text-white font-light text-sm ">
              Director & Message
              </span>
            </h3>
          </div>
        </div>
      </div>

      <section className="container-fluid relative bg-gray-100">
      <div className="container-fluid h-3/4 items-center pt-10 ml-2 mr-2 pb-12 ">
        {/* <h1 className="text-3xl font-semibold mb-6 md:mb-20">Director&apos;s Message</h1> */}
        <div className="flex flex-col md:flex-row text-xl justify-evenly text-justify items-center">
          <div className="h-auto   rounded-lg shadow-2xl mb-6 md:mb-0 md:mr-10 ">
            <img className="w-full h-auto" src="/avatar.png" alt="company img" />
          </div>
          <div className="text-center max-w-3xl px-4 p-2">
            <h1 className="text-2xl font-medium bg-gradient-to-r from-blue-700 to-slate-800 bg-clip-text text-transparent">AMIT KUMAR</h1>
            <span className="bg-gradient-to-r from-blue-800 to-blue-800 bg-clip-text text-transparent font-medium">(Director)</span>
            <p className="mt-4 text-justify text-gray-900">
              Amit Kumar is registered with the Ministry of Corporate Affairs as a Director in Indian Companies. The DIN
              (Director Identification Number) of Amit Kumar is 08315397.
            </p>
            <p className="mt-1 text-justify text-gray-900">
              Currently, he serves as a director in 3 Companies in India. The companies he is associated with are from
              various industries such as Other service activities, Insurance, Trading etc.
            </p>
          </div>
        </div>

        {/* part 2 */}

        <div className="flex flex-col md:flex-row justify-evenly text-xl mt-6 md:mt-20 text-justify items-center">
          <div className="text-center max-w-3xl px-4 p-2 sm:2xl">
            <h1 className="text-2xl font-medium bg-gradient-to-r from-cyan-900 to-slate-800 bg-clip-text text-transparent">ADARSH KUMAR</h1>
            <span className="bg-gradient-to-r from-blue-800 to-blue-800 bg-clip-text text-transparent font-medium">(Director)</span>
            <p className="mt-4 text-justify text-gray-900">
              Adarsh Kumar is registered with the Ministry of Corporate Affairs as a Director in Indian Companies. The DIN
              (Director Identification Number) of Adarsh Kumar is 08315397.
            </p>
            <p className="mt-1 text-justify text-gray-900">
              Currently, he serves as a director in 3 Companies in India. The companies he is associated with are from
              various industries such as Other service activities, Insurance, Trading etc.
            </p>
          </div>

          <div className="h-auto  xl:order-last lg:order-last md:order-last sm:order-first xs:order-first order-first border-gray-200 rounded-lg shadow-2xl md:ml-10 dark:border-gray-100">
            <img className="w-full h-auto" src="/avatar.png" alt="company img" />
          </div>
        </div>

        {/* part 3 */}
        <div className="flex flex-col pt-20 md:flex-row justify-evenly text-xl text-justify items-center">
          <div className="h-auto   rounded-lg shadow-2xl mb-6 md:mb-0 md:mr-10 ">
            <img className="w-full h-auto" src="/avatar.png" alt="company img" />
          </div>
          <div className="text-center max-w-3xl px-4 p-2">
            <h1 className="text-2xl font-medium bg-gradient-to-r from-blue-700 to-slate-800 bg-clip-text text-transparent">Kamlesh Thakur</h1>
            <span className="bg-gradient-to-r from-blue-800 to-blue-800 bg-clip-text text-transparent font-medium">(Director)</span>
            <p className="mt-4 text-justify text-gray-900">
              Kamlesh Thakur, director with Eleedom Imf Private Limited, is registered with the Ministry of Corporate Affairs (MCA), bearing DIN 08105505. He is an Indian staying in Vaishali, Bihar, India.

              Kamlesh Thakur is currently associated with Eleedom Imf Private Limited appointed as Director and the paid-up capital Eleedom Imf Private Limited ₹1,000,000.00.
              Kamlesh Thakur was previously associated with 1 company, Reano Healthcare Private Limited.
            </p>
            <p className="mt-1 text-justify text-gray-900">
              Currently, he serves as a director in 3 Companies in India. The companies he is associated with are from
              various industries such as Other service activities, Insurance, Trading etc.
            </p>
          </div>
        </div>

        {/* part-4 */}
        <div className="flex flex-col md:flex-row justify-evenly mt-6 text-xl md:mt-20 text-justify items-center ">
          <div className="text-center max-w-3xl px-4 p-2 sm:2xl">
            <h1 className="text-2xl font-medium bg-gradient-to-r from-cyan-900 to-slate-800 bg-clip-text text-transparent">Suraj Bhan</h1>
            <span className="bg-gradient-to-r from-blue-800 to-blue-800 bg-clip-text text-transparent font-medium">(Director)</span>
            <p className="mt-4 text-justify text-gray-900">
              Suraj Bhan, director with Eleedom Imf Private Limited, is registered with the Ministry of Corporate Affairs (MCA), bearing DIN 10049673. He is an Indian staying in Vaishali, Bihar, India.
              Suraj Bhan is currently associated with Eleedom Imf Private Limited appointed as Director and the paid-up capital Eleedom Imf Private Limited ₹1,000,000.00.
            </p>
            <p className="mt-1 text-justify text-gray-900">
              Currently, he serves as a director in 3 Companies in India. The companies he is associated with are from
              various industries such as Other service activities, Insurance, Trading etc.
            </p>
          </div>

          <div className="h-auto  xl:order-last lg:order-last md:order-last sm:order-first xs:order-first order-first border-gray-200 rounded-lg shadow-2xl md:ml-10 dark:border-gray-100">
            <img className="w-full h-auto" src="/avatar.png" alt="company img" />
          </div>
        </div>

      </div>
    </section>
    </>
  );
}

export default Directormessage;
