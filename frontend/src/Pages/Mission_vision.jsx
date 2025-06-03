
function Missionvision() {
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-center bg-blue-600 shadow-lg">
        <div className="w-[80%] py-12 md:py-25">
        <div className=" border-l-[5px] border-white  pl-6">
            <h3 className="text-white font-extrabold text-2xl">Mission & Vision</h3>
            <h3 className="text-white font-light text-sm pt-2">
              Home / <span className="text-white">Mission & Vision</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex justify-center mt-12 mb-2">
        <div className="w-[80%] space-y-20">

          {/* MISSION Block */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img src="/mission1.svg" alt="Mission" className="w-full h-full object-cover" />
            </div>
            <div className="text-gray-800 space-y-4">
              <p className="text-blue-600 text-lg font-semibold">Our Origin</p>
              <h2 className="text-4xl font-bold">MISSION</h2>
              <p className="text-lg text-justify">
                At Eleedom IMF Pvt Ltd, our mission is to empower individuals
                and businesses to navigate life&apos;s uncertainties with
                confidence. We are committed to providing comprehensive,
                innovative, and personalized insurance solutions that safeguard
                what matters most to our clients. Through unwavering integrity,
                exceptional service, and a deep understanding of our client&apos;s
                needs, we aim to build lasting relationships and contribute to
                the peace of mind and prosperity of the communities we serve.
              </p>
            </div>
          </div>

          {/* VISION Block */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pb-12">
            <div className="text-gray-800 space-y-4 lg:order-1 order-2">
            
              <h2 className="text-4xl font-bold">VISION</h2>
              <p className="text-lg">
              Our vision at Eleedom IMF Pvt Ltd is to be the preeminent insurance partner, setting the standard for excellence in the industry. We aspire to be the first choice for individuals and businesses seeking trustworthy, tailored, and forward-thinking insurance solutions. By leveraging our local expertise, embracing technological advancements, and fostering a culture of continuous improvement, we envision a future where our clients feel secure, confident, and supported in every aspect of their lives and ventures.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg lg:order-2 order-1">
              <img src="/vision.svg" alt="Vision" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* VALUES Block */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img src="/assets/image/pic3.jpg" alt="Values" className="w-full h-full object-cover" />
            </div>
            <div className="text-gray-800 space-y-4">
              <p className="text-blue-600 text-lg font-semibold">What Drives Us</p>
              <h2 className="text-4xl font-bold">OUR VALUES</h2>
              <p className="text-lg">
                Integrity, empathy, and transparency are the pillars that guide our work. We believe in putting our
                clients first, fostering relationships built on trust, and driving change through responsible
                innovation in insurance solutions.
              </p>
            </div>
          </div> */}

        </div>
      </div>
    </>
  );
}

export default Missionvision;
