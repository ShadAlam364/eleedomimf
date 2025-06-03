import { useEffect, useState } from "react";
import VITE_DATA from "../config/config";
import axios from "axios";

function Branched() {
  const [APIData, setAPIData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${VITE_DATA}/api/branch-list`)
      .then((response) => {
        setAPIData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {/* Header Section */}
      <div className='flex justify-center bg-blue-600 shadow-lg'>
        <div className='w-[80%] py-12 md:py-25'>
        <div className="pl-2 border-l-[5px] border-white">
            <h3 className='text-white font-bold text-2xl ml-4'>
              <span role="img" aria-label="branch">🏢</span> {/* Emoji before text */}
              Branch
            </h3>
            <h3 className='text-white font-bold text-lg ml-4 '>
              Home / <span className='text-white font-light text-sm'>branches</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Branch Info Section */}
      <div className='flex justify-center bg-gray-100 py-10'>
        <div className='w-[80%] sm:w-[80%] md:w-[80%] bg-white rounded-2xl p-6'>
          <h2 className='text-3xl font-bold text-blue-700  text-center mb-6'>
            <span role="img" aria-label="branches">🌍</span> {/* Emoji before text */}
            Our Branches
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              {APIData.map((branch, index) => (
                <div key={index} className='p-4 rounded-2xl shadow-lg hover:shadow-2xl transition'>
                  <h3 className='text-xl font-semibold mb-2'>
                    <span role="img" aria-label="location">📍</span> {branch.branchname}
                  </h3>
                  <p className='text-gray-700 mb-1'><strong>Address:</strong> {branch.branchaddress}, {branch.branchdistrict}, {branch.branchstate} - {branch.branchpincode}</p>
                  <p className='text-gray-700 mb-1'><strong>Phone:</strong> {branch.branchphone || 'N/A'}</p>
                  <p className='text-gray-700'><strong>Email:</strong> {branch.branchemail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Branched;
