/* eslint-disable react/display-name */
import { useState, useEffect, memo } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import VITE_DATA from "../../config/config.jsx";
import { useSpring, animated } from "@react-spring/web";

const OpsDashboard = memo(() => {
  const [yearlyData, setYearlyData] = useState(0);
  const [monthlyData, setMonthlyData] = useState(0);
  const [dailyData, setDailyData] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [employeePolicyCounts, setEmployeePolicyCounts] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const allDetailsProps = useSpring({
    number: yearlyData, 
    from: { number: 0 },
  });
  const monthlyProps = useSpring({ number: monthlyData, from: { number: 0 } });
  const dailyProps = useSpring({ number: dailyData, from: { number: 0 } });

  const fetchData = async (start = "", end = "") => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Not Authorized yet.. Try again!");
        return;
      }

      const params = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;

      const response = await axios.get(`${VITE_DATA}/alldetails/dashboard/data`, {
        headers: { Authorization: `${token}` },
        params
      });

      const {
        yearlyCount,
        monthlyCount,
        dailyCount,
        employees,
        employeePolicyCounts
      } = response.data;

      setYearlyData(yearlyCount);
      setMonthlyData(monthlyCount);
      setDailyData(dailyCount);
      setEmployees(employees);
      setEmployeePolicyCounts(employeePolicyCounts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = () => {
    if (!startDate && !endDate) return;
    fetchData(startDate, endDate);
    setIsFiltered(true);
  };

  const handleRemoveFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchData();
    setIsFiltered(false);
  };

  return (
    <>
      <div className="flex flex-nowrap flex-auto justify-between mb-5">
        <div className="flex mr-2">
          <div className="mr-8">
            <label className="text-base font-mono font-semibold xl:inline lg:inline md:inline sm:inline hidden mr-1">
              From:
            </label>
            <input
              type="date"
              className="input-style font-mono xl:w-auto lg:w-auto sm:w-auto w-24 p-1 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-base font-mono font-semibold xl:inline lg:inline md:inline sm:inline hidden mx-1">
              To:
            </label>
            <input
              type="date"
              className="input-style font-mono xl:w-auto lg:w-auto sm:w-auto w-24 p-1 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-between">
          <button
            onClick={handleFilter}
            className={`bg-blue-600 text-white font-mono rounded font-semibold mr-4 xl:w-auto w-18 px-3 py-1 ${
              (!startDate && !endDate) || isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={(!startDate && !endDate) || isLoading}
          >
            {isLoading ? "Loading..." : "Filter"}
          </button>

          {isFiltered && (
            <button
              onClick={handleRemoveFilter}
              className="bg-red-600 text-white font-mono rounded font-semibold xl:w-auto w-18 px-3 py-1"
              disabled={isLoading}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="flex xl:flex lg:flex md:flex sm:flex items-center justify-between xl:h-16 lg:h-10 md:h-10 h-8 rounded-lg bg-cyan-600 shadow-2xl drop-shadow-2xl shadow-blue-650">
          <span className="sm:block mx-1 sm:mx-2 lg:mx-3 xl:mx-6 px-2 py-1 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg font-semibold text-white focus:ring-[#050708]/50">
            YTD
          </span>
          <animated.span className="mx-1 sm:mx-2 lg:mx-3 xl:mx-6 text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
            {allDetailsProps.number.to((n) => n.toFixed(0))}
          </animated.span>
        </div>

        <div className="flex xl:flex lg:flex md:flex sm:flex items-center justify-between xl:h-16 lg:h-10 md:h-10 h-8 rounded-lg bg-blue-600 shadow-2xl drop-shadow-2xl shadow-blue-650">
          <span className="sm:block mx-1 sm:mx-2 lg:mx-3 xl:mx-6 px-2 py-1 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg font-semibold text-white focus:ring-[#050708]/50 xl:whitespace-nowrap">
            MTD
          </span>
          <animated.span className="mx-1 sm:mx-2 lg:mx-3 xl:mx-6 text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
            {monthlyProps.number.to((n) => n.toFixed(0))}
          </animated.span>
        </div>

        <div className="flex xl:flex lg:flex md:flex sm:flex items-center justify-between xl:h-16 lg:h-10 md:h-10 h-8 rounded-lg bg-sky-500 shadow-2xl drop-shadow-2xl shadow-blue-650">
          <span className="sm:block mx-1 sm:mx-2 lg:mx-3 xl:mx-6 px-2 py-1 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg font-semibold text-white focus:ring-[#050708]/50">
            FTD
          </span>
          <animated.span className="mx-1 sm:mx-2 lg:mx-3 xl:mx-6 text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
            {dailyProps.number.to((n) => n.toFixed(0))}
          </animated.span>
        </div>
      </div>

      {/* Employee-wise data */}
      <div className="flex flex-col justify-between">
        <div className="grid grid-cols-6 items-center">
          <span className="col-span-3 uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
            EMP NAME
          </span>
          <span className="col-span-1 uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
            YTD
          </span>
          <span className="col-span-1 uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
            MTD
          </span>
          <span className="col-span-1 uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
            FTD
          </span>
        </div>
        {employees.map((employee, index) => (
          <div
            key={index}
            className={`odd:bg-sky-500 grid grid-cols-6 items-center h-10 lg:p-1 lg:h-10 xl:h-10 bg-blue-600 shadow-2xl drop-shadow-2xl shadow-blue-650 ${
              index === 0 ? "rounded-t-lg" : ""
            } ${index === employees.length - 1 ? "rounded-b-lg" : ""}`}
          >
            <span className="col-span-3 sm:block mx-1 sm:mx-2 lg:mx-1 xl:mx-2 px-2 py-0.5 rounded-lg text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-semibold text-white focus:ring-[#050708]/50 uppercase">
              {employee}
            </span>
            {["ytd", "mtd", "daily"].map((period) => (
              <span
                key={period}
                className="col-span-1 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50 text-center"
              >
                {employeePolicyCounts[employee]?.[period] || "0"}
              </span>
            ))}
          </div>
        ))}
      </div>
    </>
  )
})

export default OpsDashboard;