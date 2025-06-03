// src/pages/About.jsx

import { Link } from 'react-router-dom'; // ✅ Correct import

function Service() {
  return (
    <>
 <div className="flex justify-center bg-blue-600 shadow-lg">
        <div className="w-[80%] py-12 md:py-25">
          <div className="pl-2 border-l-[5px] border-white">
            {/* Emoji Section */}
            <div className="flex items-center gap-2 ml-4">
              <span className="text-2xl">🏢</span> {/* Emoji added here */}
              <h3 className="text-white font-bold text-2xl ">Our Services</h3>
            </div>

            <h3 className="text-white font-bold text-lg ml-4">
              Home /{" "}
              <span className="text-white font-light text-sm">Our Services</span>
            </h3>

            {/* Routing Links */}
            <div className="flex gap-4 mt-4 ml-4">
              <Link
                to="/about/about-us"
                className="text-sm text-white border border-blue-600 px-3 py-1 rounded-2xl hover:bg-white hover:text-black transition bg-black"
              >
                About Us
              </Link>
              <Link
                to="/about/service"
                className="text-sm text-white border border-blue-600 px-3 py-1 rounded-2xl hover:bg-white hover:text-black transition bg-black"
              >
                Our Services
              </Link>
              {/* <Link
                to="/about/team"
                className="text-sm text-white border border-blue-600 px-3 py-1 rounded-2xl hover:bg-white hover:text-black transition bg-black"
              >
                Our Team
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      {/* Our Services Section */}
      <div className='flex justify-center mt-16'>
        <div className='w-[80%]'>
          <h2 className='text-center text-3xl font-bold text-blue-600 mb-10'>Our Services</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>

            {/* Service Card 1 */}
            <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50'>
              <div className='flex justify-center mb-4'>
                {/* Replace this emoji with an actual icon if needed */}
                <div className='w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl'>
                  🛡️
                </div>
              </div>
              <h3 className='text-center text-xl font-semibold text-blue-600 mb-2'>General Insurance</h3>
              <p className='text-gray-700 text-sm text-center'>
                Protect your assets, business, and personal belongings with our wide range of general insurance options.
              </p>
            </div>

            {/* Service Card 2 */}
            <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50'>
              <div className='flex justify-center mb-4'>
                <div className='w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl'>
                  ❤️
                </div>
              </div>
              <h3 className='text-center text-xl font-semibold text-blue-600 mb-2'>Personal Insurance</h3>
              <p className='text-gray-700 text-sm text-center'>
                Safeguard your health, life, and loved ones with our personalized personal insurance solutions.
              </p>
            </div>

            {/* Service Card 3 */}
            <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-blue-200 transition duration-300 hover:bg-blue-50'>
              <div className='flex justify-center mb-4'>
                <div className='w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl'>
                  🏢
                </div>
              </div>
              <h3 className='text-center text-xl font-semibold text-blue-600 mb-2'>Business Insurance</h3>
              <p className='text-gray-700 text-sm text-center'>
                We understand the complexities of running a business. Our business insurance plans are designed to mitigate risks and support your growth.
              </p>
            </div>

          </div>
        </div>
      </div>





      {/* Grid Section */}
      <div className='flex justify-center bg-gray-100 py-8 mb-1'>
        <div className='w-[80%] shadow-xl rounded-2xl bg-white'>
          <h2 className='text-center text-3xl font-bold text-blue-600 pt-8'>Trusted By</h2>
          <p className='text-center text-gray-500 mb-8'>Our partners and clients who trust Eleedom IMF</p>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-10'>

            {/* Logo Card 1 */}
            <div className='border rounded-lg p-6 flex flex-col items-center hover:shadow-md transition'>
              <div className='text-4xl mb-2'>🏦</div>
              <p className='text-center text-blue-700 font-semibold'>BankCorp</p>
              <p className='text-center text-sm text-gray-500'>Leading financial partner</p>
            </div>

            {/* Logo Card 2 */}
            <div className='border rounded-lg p-6 flex flex-col items-center hover:shadow-md transition'>
              <div className='text-4xl mb-2'>🏥</div>
              <p className='text-center text-blue-700 font-semibold'>HealthPlus</p>
              <p className='text-center text-sm text-gray-500'>Healthcare insurance leader</p>
            </div>

            {/* Logo Card 3 */}
            <div className='border rounded-lg p-6 flex flex-col items-center hover:shadow-md transition'>
              <div className='text-4xl mb-2'>🚗</div>
              <p className='text-center text-blue-700 font-semibold'>AutoSecure</p>
              <p className='text-center text-sm text-gray-500'>Vehicle coverage experts</p>
            </div>

            {/* Logo Card 4 */}
            <div className='border rounded-lg p-6 flex flex-col items-center hover:shadow-md transition'>
              <div className='text-4xl mb-2'>🏠</div>
              <p className='text-center text-blue-700 font-semibold'>HomeGuard</p>
              <p className='text-center text-sm text-gray-500'>Property protection plans</p>
            </div>

            {/* Logo Card 5 */}
            <div className='border rounded-lg p-6 flex flex-col items-center hover:shadow-md transition'>
              <div className='text-4xl mb-2'>💼</div>
              <p className='text-center text-blue-700 font-semibold'>BizTrust</p>
              <p className='text-center text-sm text-gray-500'>Business insurance solutions</p>
            </div>

          </div>
        </div>
      </div>

    </>
  );
}

export default Service;
