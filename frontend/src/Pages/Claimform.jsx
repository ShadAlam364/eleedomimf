// src/pages/Claimform.jsx

function Claimform() {
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-center bg-blue-600 shadow-lg ">
        <div className='w-[80%] py-12 md:py-25'>
        <div className="pl-2 border-l-[5px] border-white">
            <h3 className='text-white font-bold text-2xl ml-4'>
              <span role="img" aria-label="claim-form">📝</span> {/* Emoji before text */}
              Claim form
            </h3>
            <h3 className='text-white font-bold text-lg ml-4'>
              Home / <span className='text-white font-light text-sm'>Claim form</span>
            </h3>
          </div>
        </div>
      </div>

      {/* New Section */}
      <div className='flex justify-center bg-gray-100 py-10'>
        <div className='w-[80%] bg-white shadow-2xl rounded-2xl p-6'>
          <div className='mb-6'>
            <h2 className='text-3xl font-bold text-blue-700 text-center pb-4'>
              <span role="img" aria-label="form">🖊️</span> {/* Emoji before text */}
              Claim Form
            </h2>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full border border-gray-300 text-center'>
              <thead className='bg-gray-200'>
                <tr className='text-center'>
                  <th className='p-4 border'>
                    <span role="img" aria-label="serial">#️⃣</span> {/* Emoji before S.NO */}
                    S.NO
                  </th>
                  <th className='p-4 border'>
                    <span role="img" aria-label="company">🏢</span> {/* Emoji before Company Name */}
                    Company Name
                  </th>
                  <th className='p-4 border'>
                    <span role="img" aria-label="download">⬇️</span> {/* Emoji before Download */}
                    Download
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1 */}
                <tr>
                  <td className='p-4 border'>1</td>
                  <td className='p-4 border'>TATA AIG</td>
                  <td className='p-4 border'>
                    <a
                      href='/claimformdownload/Tata AIG_Claim_Form.pdf'
                      download
                      className='bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm'
                    >
                      <span role="img" aria-label="download">⬇️</span>
                    </a>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr>
                  <td className='p-4 border'>2</td>
                  <td className='p-4 border'>Bajaj Allianz</td>
                  <td className='p-4 border'>
                    <a
                      href='/claimformdownload/Bajaj Allianz_Claim_Form.pdf'
                      download
                      className='bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm'
                    >
                      <span role="img" aria-label="download">⬇️</span>
                    </a>
                  </td>
                </tr>



                {/* Row 3 */}
                <tr>
                  <td className='p-4 border'>3</td>
                  <td className='p-4 border'>ICICI Lombard</td>
                  <td className='p-4 border'>
                    <a
                      href='/claimformdownload/ICICI Lombard_Claim_Form.pdf'
                      download
                      className='bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm'
                    >
                      <span role="img" aria-label="download">⬇️</span>
                    </a>
                  </td>
                </tr>


                {/* Row 4 */}
                <tr>
                  <td className='p-4 border'>4</td>
                  <td className='p-4 border'>Reliance General Insurance</td>
                  <td className='p-4 border'>
                    <a
                      href='/claimformdownload/Reliance General Insurance_Claim_Form.pdf'
                      download
                      className='bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm'
                    >
                      <span role="img" aria-label="download">⬇️</span>
                    </a>
                  </td>
                </tr>


                 {/* Row 5 */}
                 <tr>
                  <td className='p-4 border'>5</td>
                  <td className='p-4 border'>Future Generali</td>
                  <td className='p-4 border'>
                    <a
                      href='/claimformdownload/Future Generali_Claim_Form.pdf'
                      download
                      className='bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm'
                    >
                      <span role="img" aria-label="download">⬇️</span>
                    </a>
                  </td>
                </tr>

                {/* Row 6 */}
                <tr>
                  <td className='p-4 border'>6</td>
                  <td className='p-4 border'>HDFC ERGO</td>
                  <td className='p-4 border'>
                    <a
                      href='/claimformdownload/HDFC ERGO_Claim_Form.pdf'
                      download
                      className='bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm'
                    >
                      <span role="img" aria-label="download">⬇️</span>
                    </a>
                  </td>
                </tr>

                {/* Row 7 */}
                <tr>
                  <td className='p-4 border'>7</td>
                  <td className='p-4 border'>IFFICO Tokio</td>
                  <td className='p-4 border'>
                    <a
                      href='/claimformdownload/IFFICO Tokio_Claim_Form.pdf'
                      download
                      className='bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm'
                    >
                      <span role="img" aria-label="download">⬇️</span>
                    </a>
                  </td>
                </tr>



                 {/* Row 8 */}
                 <tr>
                  <td className='p-4 border'>8</td>
                  <td className='p-4 border'>Magma HDI</td>
                  <td className='p-4 border'>
                    <a
                      href='/claimformdownload/Magma HDI_Claim_Form.pdf'
                      download
                      className='bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm'
                    >
                      <span role="img" aria-label="download">⬇️</span>
                    </a>
                  </td>
                </tr>
                

                 {/* Row 9 */}
                 <tr>
                  <td className='p-4 border'>9</td>
                  <td className='p-4 border'>Shriram General Insurance</td>
                  <td className='p-4 border'>
                    <a
                      href='/claimformdownload/Shriram General Insurance_Claim_Form.pdf'
                      download
                      className='bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm'
                    >
                      <span role="img" aria-label="download">⬇️</span>
                    </a>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Claimform;
