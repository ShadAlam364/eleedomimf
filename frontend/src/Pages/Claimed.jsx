import axios from "axios";
import { useState } from "react";
import VITE_DATA from "../config/config";
import { toast } from "react-toastify";

function Claimed() {
   const [email, setEmail] = useState("");
   const [mobile, setMobile] = useState("");
   const [claim, setClaim] = useState("");
   const [name, setName] = useState("");
   const [policy, setPolicy] = useState("");
   const [dated, setDate] = useState();
   const [dates, setDates] = useState("");
   const [time, setTime] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
  
   const handleSubmit = async (e) => {
      e.preventDefault();
      if (isSubmitting) return; // Prevent multiple submissions
      
      setIsSubmitting(true);
      try {
          const response = await axios.post(`${VITE_DATA}/users/claim`, {
              userclaim_name: name,
              userclaim_email: email,
              userclaim_mobile: mobile,
              userclaim_insurance_name: claim,
              userclaim_policyno: policy,
              userclaim_date: new Date(dates + 'T' + time),
              userclaim_time: time,
              userclaim_policyexp: new Date(dated),
          });

          if (response.data) {
              toast.success("Claim submitted successfully");
              // Reset form fields
              setEmail("");
              setMobile("");
              setClaim("");
              setName("");
              setPolicy("");
              setDates("");
              setDate("");
              setTime("");
          }
      } catch (error) {
          console.error('Error:', error);
          toast.error(error.response?.data?.message || "Failed to submit claim");
      } finally {
          setIsSubmitting(false);
      }
   };
  
   return (
    <>
      {/* Header Section */}
      <div className='flex justify-center bg-blue-600 shadow-lg'>
        <div className='w-[80%] py-12 md:py-25'>
          <div className="pl-2 border-l-[5px] border-white">
            <h3 className='text-white font-bold text-2xl ml-4'>
              <span role="img" aria-label="claim">📝</span>
              Claim
            </h3>
            <h3 className='text-white font-bold text-lg ml-4 '>
              Home / <span className='text-white font-light text-sm'>Claim</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Claim Form Section */}
      <div className="flex justify-center bg-gray-100 py-12">
        <div className="w-[80%] bg-white shadow-2xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">
            <span role="img" aria-label="insurance">💼</span>
            Insurance Claim
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1">
                <span role="img" aria-label="person">👤</span>
                Full Name
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                <span role="img" aria-label="email">📧</span>
                Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                <span role="img" aria-label="telephone">📞</span>
                Contact Number
              </label>
              <input 
                type="tel" 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter contact number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                <span role="img" aria-label="building">🏢</span>
                Insurance Company Name
              </label>
              <input 
                type="text" 
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                placeholder="Enter company name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                <span role="img" aria-label="file">📄</span>
                Policy Number
              </label>
              <input 
                type="text" 
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
                placeholder="Enter policy number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                <span role="img" aria-label="calendar">📅</span>
                Claim Date
              </label>
              <input 
                type="date" 
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                <span role="img" aria-label="clock">⏰</span>
                Claim Time
              </label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                <span role="img" aria-label="expired">⏳</span>
                Policy Expiry Date
              </label>
              <input 
                type="date" 
                value={dated}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>

            <div className="md:col-span-2 flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-600 text-white px-10 py-3 rounded-full font-semibold transition duration-300 flex items-center gap-2
                  ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-800'}`}
              >
                <span role="img" aria-label="submit">🚀</span>
                {isSubmitting ? 'Submitting...' : 'Submit Claim'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Claimed;
