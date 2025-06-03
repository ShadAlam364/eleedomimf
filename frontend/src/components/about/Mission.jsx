const Mission = () => {
    return (
        <section className="container-fluid relative bg-slate-100">
            <div className="container-fluid h-3/4 items-center pb-4 bg-gradient-to-r from-slate-50 to-slate-50">
                

                <div className="flex flex-col lg:flex-row justify-center lg:justify-between text-justify  p-5  lg:px-10 items-center bg-slate-50">
                    
                    <div className=" mb-8 sm:mb-4">
                        <img
                            src="/mission1.svg" // Add the actual image source
                            alt="company img"
                            className="w-full sm:w-2/3 h-auto mx-auto border rounded-lg shadow-xl"
                        />
                    </div>
                    <div className="max-w-auto text-base  xl:max-w-3xl ">
                    <h1 className="text-3xl mb-5 text-blue-700 font-medium text-center">Mission</h1>

                        <p className="mb-4 text-xl">
                       { `At Eleedom IMF Pvt Ltd , our mission is to empower individuals and businesses to navigate life's uncertainties with confidence. We are committed to providing comprehensive, innovative, and personalized insurance solutions that safeguard what matters most to our clients. Through unwavering integrity, exceptional service, and a deep understanding of our client's needs, we aim to build lasting relationships and contribute to the peace of mind and prosperity of the communities we serve.`}
                        </p>
                    </div>
                </div>

                {/* part 2 */}
                <div className="flex flex-col lg:flex-row justify-center lg:justify-between text-justify shadow-lg p-5 lg:px-10 items-center bg-slate-100">
                    <div className="max-w-auto text-base xl:max-w-3xl ">
                    <h1 className="text-4xl mb-5 text-blue-700 font-medium text-center">Vision</h1>

                        <p className="mb-4 text-xl">
                       { `Our vision at Eleedom IMF Pvt Ltd is to be the preeminent insurance partner, setting the standard for excellence in the industry. We aspire to be the first choice for individuals and businesses seeking trustworthy, tailored, and forward-thinking insurance solutions. By leveraging our local expertise, embracing technological advancements, and fostering a culture of continuous improvement, we envision a future where our clients feel secure, confident, and supported in every aspect of their lives and ventures`}
                        </p>
                    </div>
                    <div className="mb-1 lg:mb- h-auto  rounded-lg ">
                        <img
                            src="/vision.svg" // Add the actual image source
                            alt="company img"
                            className=" w-full sm:w-2/3 h-auto mx-auto border rounded-lg shadow-xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Mission;
