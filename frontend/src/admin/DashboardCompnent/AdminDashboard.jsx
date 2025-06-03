/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { useState, useEffect, memo } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import VITE_DATA from "../../config/config.jsx";
import { useSpring, animated } from "@react-spring/web";



const AdminDashboard = memo(() => {
  const [yearlyData, setYearlyData] = useState(0);
  const [monthlyData, setMonthlyData] = useState(0);
  const [dailyData, setDailyData] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [branchWiseData, setBranchWiseData] = useState([]);
  const [branchFilterData, setBranchFilterData] = useState([]);
  const [employeePolicyCounts, setEmployeePolicyCounts] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New state for additional data
  const [totalNsell, setTotalNsell] = useState(0);
  const [monthlyNsell, setMonthlyNsell] = useState(0);
  const [dailyNsell, setDailyNsell] = useState(0);
  const [totalFsell, setTotalFsell] = useState(0);
  const [monthlyFsell, setMonthlyFsell] = useState(0);
  const [dailyFsell, setDailyFsell] = useState(0);

  // Segment data states
  const [totalCvPayout, setTotalCvPayout] = useState(0);
  const [monthlyCvPayout, setMonthlyCvPayout] = useState(0);
  const [dailyCvPayout, setDailyCvPayout] = useState(0);
  const [totalCvCount, setTotalCvCount] = useState(0);
  const [monthlyCvCount, setMonthlyCvCount] = useState(0);
  const [dailyCvCount, setDailyCvCount] = useState(0);

  const [totalPvtCarPayout, setTotalPvtCarPayout] = useState(0);
  const [monthlyPvtCarPayout, setMonthlyPvtCarPayout] = useState(0);
  const [dailyPvtCarPayout, setDailyPvtCarPayout] = useState(0);
  const [totalPvtCarCount, setTotalPvtCarCount] = useState(0);
  const [monthlyPvtCarCount, setMonthlyPvtCarCount] = useState(0);
  const [dailyPvtCarCount, setDailyPvtCarCount] = useState(0);

  const [totalTwPayout, setTotalTwPayout] = useState(0);
  const [monthlyTwPayout, setMonthlyTwPayout] = useState(0);
  const [dailyTwPayout, setDailyTwPayout] = useState(0);
  const [totalTwCount, setTotalTwCount] = useState(0);
  const [monthlyTwCount, setMonthlyTwCount] = useState(0);
  const [dailyTwCount, setDailyTwCount] = useState(0);

  const [totalHealthPayout, setTotalHealthPayout] = useState(0);
  const [monthlyHealthPayout, setMonthlyHealthPayout] = useState(0);
  const [dailyHealthPayout, setDailyHealthPayout] = useState(0);
  const [totalHealthCount, setTotalHealthCount] = useState(0);
  const [monthlyHealthCount, setMonthlyHealthCount] = useState(0);
  const [dailyHealthCount, setDailyHealthCount] = useState(0);

  const [totalLifePayout, setTotalLifePayout] = useState(0);
  const [monthlyLifePayout, setMonthlyLifePayout] = useState(0);
  const [dailyLifePayout, setDailyLifePayout] = useState(0);
  const [totalLifeCount, setTotalLifeCount] = useState(0);
  const [monthlyLifeCount, setMonthlyLifeCount] = useState(0);
  const [dailyLifeCount, setDailyLifeCount] = useState(0);

  const [totalNonMotorPayout, setTotalNonMotorPayout] = useState(0);
  const [monthlyNonMotorPayout, setMonthlyNonMotorPayout] = useState(0);
  const [dailyNonMotorPayout, setDailyNonMotorPayout] = useState(0);
  const [totalNonMotorCount, setTotalNonMotorCount] = useState(0);
  const [monthlyNonMotorCount, setMonthlyNonMotorCount] = useState(0);
  const [dailyNonMotorCount, setDailyNonMotorCount] = useState(0);

  //   Advisors
  const [totalAdvisors, setTotalAdvisors] = useState(0);
  const [advisor, setAdvisors] = useState([]);
  const [advCounts, setAdvCounts] = useState({});

  const [company, setCompany] = useState(0);
  const [career, setCareer] = useState(0);

  //   Attendances/leaves
  const [empAttendLeave, setEmpAttendLeave] = useState({});

  const [visitsData, setVisitsData] = useState({
    total: 0,
    yearly: 0,
    monthly: 0,
    daily: 0,
    branchData: [],
  });
  const branch = sessionStorage.getItem("branchName");
  const employeeId = sessionStorage.getItem("employeeId");
  const advId = sessionStorage.getItem("advId");
  // Animation props
  const allDetailsProps = useSpring({
    number: yearlyData,
    from: { number: 0 },
  });
  const monthlyProps = useSpring({ number: monthlyData, from: { number: 0 } });
  const dailyProps = useSpring({ number: dailyData, from: { number: 0 } });
  const companyProps = useSpring({ number: company, from: { number: 0 } });
  const careerProps = useSpring({ number: career, from: { number: 0 } });

  const totalNsellProps = useSpring({
    number: totalNsell,
    from: { number: 0 },
  });
  const monthlyNsellProps = useSpring({
    number: monthlyNsell,
    from: { number: 0 },
  });
  const dailyNsellProps = useSpring({
    number: dailyNsell,
    from: { number: 0 },
  });

  const totalFsellProps = useSpring({
    number: totalFsell,
    from: { number: 0 },
  });
  const monthlyFsellProps = useSpring({
    number: monthlyFsell,
    from: { number: 0 },
  });
  const dailyFsellProps = useSpring({
    number: dailyFsell,
    from: { number: 0 },
  });

  const totalCvPayoutProps = useSpring({
    number: totalCvPayout,
    from: { number: 0 },
  });
  const monthlyCvPayoutProps = useSpring({
    number: monthlyCvPayout,
    from: { number: 0 },
  });
  const dailyCvPayoutProps = useSpring({
    number: dailyCvPayout,
    from: { number: 0 },
  });
  const totalCvCountProps = useSpring({
    number: totalCvCount,
    from: { number: 0 },
  });
  const monthlyCvCountProps = useSpring({
    number: monthlyCvCount,
    from: { number: 0 },
  });
  const dailyCvCountProps = useSpring({
    number: dailyCvCount,
    from: { number: 0 },
  });

  const totalPvtCarPayoutProps = useSpring({
    number: totalPvtCarPayout,
    from: { number: 0 },
  });
  const monthlyPvtCarPayoutProps = useSpring({
    number: monthlyPvtCarPayout,
    from: { number: 0 },
  });
  const dailyPvtCarPayoutProps = useSpring({
    number: dailyPvtCarPayout,
    from: { number: 0 },
  });
  const totalPvtCarCountProps = useSpring({
    number: totalPvtCarCount,
    from: { number: 0 },
  });
  const monthlyPvtCarCountProps = useSpring({
    number: monthlyPvtCarCount,
    from: { number: 0 },
  });
  const dailyPvtCarCountProps = useSpring({
    number: dailyPvtCarCount,
    from: { number: 0 },
  });

  const totalTwPayoutProps = useSpring({
    number: totalTwPayout,
    from: { number: 0 },
  });
  const monthlyTwPayoutProps = useSpring({
    number: monthlyTwPayout,
    from: { number: 0 },
  });
  const dailyTwPayoutProps = useSpring({
    number: dailyTwPayout,
    from: { number: 0 },
  });
  const totalTwCountProps = useSpring({
    number: totalTwCount,
    from: { number: 0 },
  });
  const monthlyTwCountProps = useSpring({
    number: monthlyTwCount,
    from: { number: 0 },
  });
  const dailyTwCountProps = useSpring({
    number: dailyTwCount,
    from: { number: 0 },
  });

  const totalHealthPayoutProps = useSpring({
    number: totalHealthPayout,
    from: { number: 0 },
  });
  const monthlyHealthPayoutProps = useSpring({
    number: monthlyHealthPayout,
    from: { number: 0 },
  });
  const dailyHealthPayoutProps = useSpring({
    number: dailyHealthPayout,
    from: { number: 0 },
  });
  const totalHealthCountProps = useSpring({
    number: totalHealthCount,
    from: { number: 0 },
  });
  const monthlyHealthCountProps = useSpring({
    number: monthlyHealthCount,
    from: { number: 0 },
  });
  const dailyHealthCountProps = useSpring({
    number: dailyHealthCount,
    from: { number: 0 },
  });

  const totalLifePayoutProps = useSpring({
    number: totalLifePayout,
    from: { number: 0 },
  });
  const monthlyLifePayoutProps = useSpring({
    number: monthlyLifePayout,
    from: { number: 0 },
  });
  const dailyLifePayoutProps = useSpring({
    number: dailyLifePayout,
    from: { number: 0 },
  });
  const totalLifeCountProps = useSpring({
    number: totalLifeCount,
    from: { number: 0 },
  });
  const monthlyLifeCountProps = useSpring({
    number: monthlyLifeCount,
    from: { number: 0 },
  });
  const dailyLifeCountProps = useSpring({
    number: dailyLifeCount,
    from: { number: 0 },
  });

  const totalNonMotorPayoutProps = useSpring({
    number: totalNonMotorPayout,
    from: { number: 0 },
  });
  const monthlyNonMotorPayoutProps = useSpring({
    number: monthlyNonMotorPayout,
    from: { number: 0 },
  });
  const dailyNonMotorPayoutProps = useSpring({
    number: dailyNonMotorPayout,
    from: { number: 0 },
  });
  const totalNonMotorCountProps = useSpring({
    number: totalNonMotorCount,
    from: { number: 0 },
  });
  const monthlyNonMotorCountProps = useSpring({
    number: monthlyNonMotorCount,
    from: { number: 0 },
  });
  const dailyNonMotorCountProps = useSpring({
    number: dailyNonMotorCount,
    from: { number: 0 },
  });

  const activeEmpCountProps = useSpring({
    number: empAttendLeave.activeEmployees,
    from: { number: 0 },
  });

  const empCountProps = useSpring({
    number: empAttendLeave.totalEmployees,
    from: { number: 0 },
  });

  const currAttendanceProps = useSpring({
    number: empAttendLeave.todayAttendance,
    from: { number: 0 },
  });

  const approveLeaveCountsProps = useSpring({
    number: empAttendLeave.approvedLeaves,
    from: { number: 0 },
  });

  const rejectedLeaveCountsProps = useSpring({
    number: empAttendLeave.rejectedLeaves,
    from: { number: 0 },
  });

  const totalLeavesCountsProps = useSpring({
    number: empAttendLeave.totalLeaves,
    from: { number: 0 },
  });

  const totalLeaveCountsProps = useSpring({
    number: empAttendLeave?.leaveStats?.total,
    from: { number: 0 },
  });

  const totalLeavePendingCountsProps = useSpring({
    number: empAttendLeave?.leaveStats?.pending,
    from: { number: 0 },
  });

  const totalLeaveApprovedCountsProps = useSpring({
    number: empAttendLeave?.leaveStats?.approved,
    from: { number: 0 },
  });

  const totalLeaveRejectedCountsProps = useSpring({
    number: empAttendLeave?.leaveStats?.rejected,
    from: { number: 0 },
  });

  const totalVisitsDataProps = useSpring({
    number: visitsData?.total,
    from: { number: 0 },
  });

  const yearlyVisitsProps = useSpring({
    number: visitsData.yearly,
    from: { number: 0 },
  });

  const monthlyVisitsProps = useSpring({
    number: visitsData.monthly,
    from: { number: 0 },
  });

  const dailyVisitsProps = useSpring({
    number: visitsData.daily,
    from: { number: 0 },
  });

  const advisorProps = useSpring({
    number: totalAdvisors,
    from: { number: 0 },
  });

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
      if (branch) params.branchName = branch;
      if (employeeId) params.employeeId = employeeId;
      if (advId) params.advId = advId;
      const response = await axios.get(
        `${VITE_DATA}/alldetails/dashboard/data`,
        {
          headers: { Authorization: `${token}` },
          params,
        }
      );

      const {
        yearlyCount,
        monthlyCount,
        dailyCount,
        employees,
        employeePolicyCounts,
        yearlyNetPremium,
        monthlyNetPremium,
        dailyNetPremium,
        yearlyFinalEntryFields,
        monthlyFinalEntryFields,
        dailyFinalEntryFields,
        segmentData,
        branchData,
      } = response.data;

      setYearlyData(yearlyCount);
      setMonthlyData(monthlyCount);
      setDailyData(dailyCount);
      setEmployees(employees);
      setEmployeePolicyCounts(employeePolicyCounts);
      setBranchFilterData(branchData);
      // Set sales data
      setTotalNsell(yearlyNetPremium);
      setMonthlyNsell(monthlyNetPremium);
      setDailyNsell(dailyNetPremium);
      setTotalFsell(yearlyFinalEntryFields);
      setMonthlyFsell(monthlyFinalEntryFields);
      setDailyFsell(dailyFinalEntryFields);

      // Set segment data
      if (segmentData) {
        // CV
        setTotalCvPayout(segmentData.cv.yearlyPremium);
        setMonthlyCvPayout(segmentData.cv.monthlyPremium);
        setDailyCvPayout(segmentData.cv.dailyPremium);
        setTotalCvCount(segmentData.cv.yearlyCount);
        setMonthlyCvCount(segmentData.cv.monthlyCount);
        setDailyCvCount(segmentData.cv.dailyCount);

        // PVT-CAR
        setTotalPvtCarPayout(segmentData?.pvtCar.yearlyPremium);
        setMonthlyPvtCarPayout(segmentData.pvtCar.monthlyPremium);
        setDailyPvtCarPayout(segmentData.pvtCar.dailyPremium);
        setTotalPvtCarCount(segmentData.pvtCar.yearlyCount);
        setMonthlyPvtCarCount(segmentData.pvtCar.monthlyCount);
        setDailyPvtCarCount(segmentData.pvtCar.dailyCount);

        // TW
        setTotalTwPayout(segmentData.tw.yearlyPremium);
        setMonthlyTwPayout(segmentData.tw.monthlyPremium);
        setDailyTwPayout(segmentData.tw.dailyPremium);
        setTotalTwCount(segmentData.tw.yearlyCount);
        setMonthlyTwCount(segmentData.tw.monthlyCount);
        setDailyTwCount(segmentData.tw.dailyCount);

        // LIFE
        setTotalLifePayout(segmentData.life.yearlyPremium);
        setMonthlyLifePayout(segmentData.life.monthlyPremium);
        setDailyLifePayout(segmentData.life.dailyPremium);
        setTotalLifeCount(segmentData.life.yearlyCount);
        setMonthlyLifeCount(segmentData.life.monthlyCount);
        setDailyLifeCount(segmentData.life.dailyCount);

        // HEALTH
        setTotalHealthPayout(segmentData.health.yearlyPremium);
        setMonthlyHealthPayout(segmentData.health.monthlyPremium);
        setDailyHealthPayout(segmentData.health.dailyPremium);
        setTotalHealthCount(segmentData.health.yearlyCount);
        setMonthlyHealthCount(segmentData.health.monthlyCount);
        setDailyHealthCount(segmentData.health.dailyCount);

        // NON-MOTOR
        setTotalNonMotorPayout(segmentData.nonMotor.yearlyPremium);
        setMonthlyNonMotorPayout(segmentData.nonMotor.monthlyPremium);
        setDailyNonMotorPayout(segmentData.nonMotor.dailyPremium);
        setTotalNonMotorCount(segmentData.nonMotor.yearlyCount);
        setMonthlyNonMotorCount(segmentData.nonMotor.monthlyCount);
        setDailyNonMotorCount(segmentData.nonMotor.dailyCount);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data.");
      setIsLoading(false);
    }
  };

  const fetchBranchWiseData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const params = {};
      // if (branch) params.branchName = branch;
      if (advId) params.advId = advId;
      const response = await axios.get(
        `${VITE_DATA}/alldetails/dashboard/branchwise/data`,
        {
          headers: { Authorization: `${token}` },
          params,
        }
      );
      setBranchWiseData(response?.data.branchData);
    } catch (error) {
      console.error("Failed to fetch Branch Wise Data:", error);
    }
  };

  const fetchAdvisorData = async (start = "", end = "") => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Not Authorized yet.. Try again!");
        return;
      }

      const params = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;
      if (branch) params.branchName = branch;
      const response = await axios.get(
        `${VITE_DATA}/alldetails/dashboard/advisor/data`,
        {
          headers: { Authorization: token },
          params,
        }
      );
      const { totalAdvisors, branches, branchCounts } = response.data;
      setTotalAdvisors(totalAdvisors);
      setAdvisors(branches);
      setAdvCounts(branchCounts);
    } catch (error) {
      toast.error("Failed to fetch advisor data.", error);
    }
  };

  const fetchAttendaceLeaves = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const params = {};
      if (branch) params.branchName = branch;
      if (employeeId) params.employeeId = employeeId;
      const response = await axios.get(
        `${VITE_DATA}/alldetails/dashboard/emp/attendance/data`,
        {
          headers: { Authorization: `${token}` },
          params,
        }
      );
      setEmpAttendLeave(response?.data);
    } catch (error) {
      console.error("Failed to fetch empAttendLeave:", error);
    }
  };

  const fetchBranchCount = async (start = "", end = "") => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Not Authorized yet.. Try again!");
        return;
      }
      const params = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;
      if (branch) params.branchName = branch;
      const response = await axios.get(
        `${VITE_DATA}/alldetails/dashboard/branch/data`,
        {
          headers: { Authorization: `${token}` },
          params,
        }
      );
      setCompany(response?.data?.count);
    } catch (error) {
      console.error("Failed to fetch branch:", error);
    }
  };

  const fetchJobsCount = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${VITE_DATA}/alldetails/dashboard/career/data`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      setCareer(response?.data.count);
    } catch (error) {
      console.error("Failed to fetch jobs applied:", error);
    }
  };

  const fetchVisitsData = async (start = "", end = "") => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Not Authorized yet.. Try again!");
        return;
      }

      const params = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;
      if (branch) params.branchName = branch;
      const response = await axios.get(
        `${VITE_DATA}/alldetails/dashboard/dvr/data`,
        {
          headers: { Authorization: token },
          params,
        }
      );

      const {
        totalVisits,
        yearlyVisits,
        monthlyVisits,
        dailyVisits,
        branchData,
      } = response.data;

      setVisitsData({
        total: totalVisits,
        yearly: yearlyVisits,
        monthly: monthlyVisits,
        daily: dailyVisits,
        branchData,
      });
    } catch (error) {
      console.error("Error fetching visits data:", error);
      toast.error("Failed to fetch visits data.");
    }
  };

  useEffect(() => {
    fetchData();
    fetchAdvisorData();
    fetchAttendaceLeaves();
    fetchBranchCount();
    fetchJobsCount();
    fetchVisitsData();
    fetchBranchWiseData();
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
              (!startDate && !endDate) || isLoading
                ? "cursor-not-allowed opacity-50"
                : ""
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
      {/* dashboard data */}
      <div className="flex flex-col">
        {/* Basic counts */}
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

        {/* Sales data */}
        <div className="grid grid-cols-5 gap-3 mb-5 text-center">
          {/* NET SALES */}
          <div className="block shadow-2xl drop-shadow-2xl shadow-blue-650">
            <h1 className="uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
              NET SALES
            </h1>
            <div className="grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-16 lg:h-12 xl:h-12 rounded-t-lg bg-cyan-600">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                YTD
              </span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {totalNsellProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 sm:h-16 lg:p-1 lg:h-12 xl:h-12 bg-blue-600">
              <span className="sm:block mx-1 sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                MTD
              </span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {monthlyNsellProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 sm:h-16 lg:p-1 lg:h-16 xl:h-12 rounded-b-lg bg-sky-500">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                FTD
              </span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {dailyNsellProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
          </div>

          {/* FINAL SALES */}
          <div className="block shadow-2xl drop-shadow-2xl shadow-blue-650">
            <h1 className="uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
              FINAL SALES
            </h1>
            <div className="grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-16 lg:h-12 xl:h-12 rounded-t-lg bg-cyan-600">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                YTD
              </span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {totalFsellProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 sm:h-16 lg:p-1 lg:h-12 xl:h-12 bg-blue-600">
              <span className="sm:block mx-1 sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                MTD
              </span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {monthlyFsellProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 sm:h-16 lg:p-1 lg:h-16 xl:h-12 rounded-b-lg bg-sky-500">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                FTD
              </span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {dailyFsellProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
          </div>

          {/* CV */}
          <div className="block shadow-2xl drop-shadow-2xl shadow-blue-650">
            <h1 className="uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
              CV
            </h1>
            <div className="grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-t-lg bg-cyan-600">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                YTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {totalCvCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {totalCvPayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 bg-blue-600">
              <span className="sm:block mx-1 sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                MTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {monthlyCvCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {monthlyCvPayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-b-lg bg-sky-500">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                FTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {dailyCvCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {dailyCvPayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
          </div>

          {/* PVT-CAR */}
          <div className="block shadow-2xl drop-shadow-2xl shadow-blue-650">
            <h1 className="uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
              PVT-CAR
            </h1>
            <div className="grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-t-lg bg-cyan-600">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                YTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {totalPvtCarCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {totalPvtCarPayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 bg-blue-600">
              <span className="sm:block mx-1 sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                MTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {monthlyPvtCarCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {monthlyPvtCarPayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-b-lg bg-sky-500">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                FTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {dailyPvtCarCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {dailyPvtCarPayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
          </div>

          {/* TW */}
          <div className="block shadow-2xl drop-shadow-2xl shadow-blue-650">
            <h1 className="uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
              TW
            </h1>
            <div className="grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-t-lg bg-cyan-600">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                YTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {totalTwCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {totalTwPayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 bg-blue-600">
              <span className="sm:block mx-1 sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                MTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {monthlyTwCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {monthlyTwPayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-b-lg bg-sky-500">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                FTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {dailyTwCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {dailyTwPayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
          </div>

          {/* HEALTH */}
          <div className="block shadow-2xl drop-shadow-2xl shadow-blue-650">
            <h1 className="uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
              HEALTH
            </h1>
            <div className="grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-t-lg bg-cyan-600">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                YTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {totalHealthCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {totalHealthPayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 bg-blue-600">
              <span className="sm:block mx-1 sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                MTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {monthlyHealthCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {monthlyHealthPayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-b-lg bg-sky-500">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                FTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {dailyHealthCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {dailyHealthPayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
          </div>

          {/* LIFE */}
          <div className="block shadow-2xl drop-shadow-2xl shadow-blue-650">
            <h1 className="uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
              LIFE
            </h1>
            <div className="grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-t-lg bg-cyan-600">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                YTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {totalLifeCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {totalLifePayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 bg-blue-600">
              <span className="sm:block mx-1 sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                MTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {monthlyLifeCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {monthlyLifePayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-b-lg bg-sky-500">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                FTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {dailyLifeCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {dailyLifePayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
          </div>

          {/* NON-MOTOR */}
          <div className="block shadow-2xl drop-shadow-2xl shadow-blue-650">
            <h1 className="uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
              NON-MOTOR
            </h1>
            <div className="grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-t-lg bg-cyan-600">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                YTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {totalNonMotorCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {totalNonMotorPayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 bg-blue-600">
              <span className="sm:block mx-1 sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                MTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {monthlyNonMotorCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {monthlyNonMotorPayoutProps.number.to(
                  (n) => `₹ ${n.toFixed(0)}`
                )}
              </animated.span>
            </div>
            <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-b-lg bg-sky-500">
              <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                FTD
              </span>
              <animated.span className="mx-1 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50">
                {dailyNonMotorCountProps.number.to((n) => n.toFixed(0))}
              </animated.span>
              <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                {dailyNonMotorPayoutProps.number.to((n) => `₹ ${n.toFixed(0)}`)}
              </animated.span>
            </div>
          </div>

          {/* BLANK SPACES */}
          <div></div>

          {/* DVR */}
          <div className="block shadow-blue-650">
            <h1 className="uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
              DVR
            </h1>
            <div className="shadow-2xl drop-shadow-2xl">
              <div className="grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-t-lg bg-blue-600">
                <span className="text-gray-50 sm:block mx-1 sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                  YTD
                </span>
                <span className="mx-2 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50 space-x-1">
                  <animated.span>
                    {visitsData.branchData[0]?.length > 0
                      ? visitsData?.branchData[0].yearlyVisits
                      : yearlyVisitsProps?.number.to((n) => n.toFixed(0)) || 0}
                  </animated.span>{" "}
                  /
                  <animated.span>
                    {visitsData.branchData[0]?.length > 0
                      ? visitsData?.branchData[0].totalVisits
                      : totalVisitsDataProps?.number.to((n) => n.toFixed(0)) ||
                        0}
                  </animated.span>
                </span>
              </div>
              <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 bg-sky-500">
                <span className="sm:block mx-1 sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                  MTD
                </span>
                <span className="mx-2 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50 space-x-1">
                  <animated.span>
                    {visitsData.branchData?.length > 0
                      ? visitsData?.branchData[0].monthlyVisits
                      : monthlyVisitsProps?.number.to((n) => n.toFixed(0)) || 0}
                  </animated.span>{" "}
                  /
                  <animated.span>
                    {visitsData.branchData?.length > 0
                      ? visitsData?.branchData[0].totalVisits
                      : totalVisitsDataProps?.number.to((n) => n.toFixed(0)) ||
                        0}
                  </animated.span>
                </span>
              </div>
              <div className="grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-b-lg bg-blue-600">
                <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                  FTD
                </span>
                <span className="mx-2 text-xs sm:text-xs md:text-sm lg:text-basese xl:text-base font-bold text-gray-50 space-x-1">
                  <animated.span>
                    {visitsData.branchData?.length > 0
                      ? visitsData?.branchData[0].dailyVisits
                      : dailyVisitsProps?.number.to((n) => n.toFixed(0)) || 0}
                  </animated.span>{" "}
                  /
                  <animated.span>
                    {visitsData.branchData?.length > 0
                      ? visitsData?.branchData[0].totalVisits
                      : totalVisitsDataProps?.number.to((n) => n.toFixed(0)) ||
                        0}
                  </animated.span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* branch wise */}
        <div className="grid xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3 mb-5 font-semibold">
          {employeeId || advId
            ? branchFilterData &&
              branchFilterData.length > 0 &&
              branchFilterData.map((branch, index) => (
                <div
                  key={index}
                  className="flex flex-col shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-800"
                >
                  <h2 className="text-white text-center font-bold text-sm sm:text-base uppercase truncate py-2 bg-slate-600 dark:bg-slate-700">
                    {branch.branch || "Unknown Branch"}
                  </h2>

                  {/* Yearly Data */}
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700">
                    <span className="text-white text-xs sm:text-sm font-semibold uppercase">
                      YTD
                    </span>
                    <p className="text-white text-xs sm:text-sm font-bold">
                      {branch.yearlyCount || 0}
                    </p>
                    <p className="text-white text-sm sm:text-base font-bold">
                      ₹{(branch.yearlyNetPremium || 0).toFixed(0)}
                    </p>
                  </div>

                  {/* Monthly Data */}
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
                    <span className="text-white text-xs sm:text-sm font-semibold uppercase">
                      MTD
                    </span>
                    <p className="text-white text-xs sm:text-sm font-bold">
                      {branch.monthlyCount || 0}
                    </p>
                    <p className="text-white text-sm sm:text-base font-bold">
                      ₹{(branch.monthlyNetPremium || 0).toFixed(0)}
                    </p>
                  </div>

                  {/* Daily Data */}
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-sky-500 to-sky-600 dark:from-sky-600 dark:to-sky-700">
                    <span className="text-white text-xs sm:text-sm font-semibold uppercase">
                      FTD
                    </span>
                    <p className="text-white text-xs sm:text-sm font-bold">
                      {branch.dailyCount || 0}
                    </p>
                    <p className="text-white text-sm sm:text-base font-bold">
                      ₹{(branch.dailyNetPremium || 0).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))
            : branchWiseData.map((branch, index) => (
                <div
                  key={index}
                  className="flex flex-col shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-800"
                >
                  <h2 className="text-white text-center font-bold text-sm sm:text-base uppercase truncate py-2 bg-slate-600 dark:bg-slate-700">
                    {branch.branch || "Unknown Branch"}
                  </h2>

                  {/* Yearly Data */}
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700">
                    <span className="text-white text-xs sm:text-sm font-semibold uppercase">
                      YTD
                    </span>
                    <p className="text-white text-xs sm:text-sm font-bold">
                      {branch.yearly?.count || 0}
                    </p>
                    <p className="text-white text-sm sm:text-base font-bold">
                      ₹{(branch.yearly?.netPremium || 0).toFixed(0)}
                    </p>
                  </div>

                  {/* Monthly Data */}
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
                    <span className="text-white text-xs sm:text-sm font-semibold uppercase">
                      MTD
                    </span>
                    <p className="text-white text-xs sm:text-sm font-bold">
                      {branch.monthly?.count || 0}
                    </p>
                    <p className="text-white text-sm sm:text-base font-bold">
                      ₹{(branch.monthly?.netPremium || 0).toFixed(0)}
                    </p>
                  </div>

                  {/* Daily Data */}
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-sky-500 to-sky-600 dark:from-sky-600 dark:to-sky-700">
                    <span className="text-white text-xs sm:text-sm font-semibold uppercase">
                      FTD
                    </span>
                    <p className="text-white text-xs sm:text-sm font-bold">
                      {branch.daily?.count || 0}
                    </p>
                    <p className="text-white text-sm sm:text-base font-bold">
                      ₹{(branch.daily?.netPremium || 0).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
        </div>

        {/* company / career */}
        {!employeeId && (
          <div className="grid grid-cols-5 gap-3 ">
            {branch ? (
              <div className="my-4 shadow-2xl drop-shadow-2xl shadow-blue-650 grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-lg bg-yellow-700 ">
                <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2  rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold   focus:ring-[#050708]/50 uppercase">
                  Total Advisor
                </span>
                <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2  text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                  {advisorProps?.number.to((n) => n.toFixed(0))}
                </animated.span>
              </div>
            ) : (
              !advId && (
                <>
                  <div className="my-4 shadow-2xl drop-shadow-2xl shadow-blue-650 grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-lg bg-yellow-700 ">
                    <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2  rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold   focus:ring-[#050708]/50 uppercase">
                      Total Branch
                    </span>
                    <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2  text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                      {companyProps?.number.to((n) => n.toFixed(0))}
                    </animated.span>
                  </div>

                  <div className="my-4 shadow-2xl drop-shadow-2xl shadow-blue-650 grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-16 lg:p-1 sm:h-20 lg:h-20 xl:h-12 rounded-lg bg-emerald-700 ">
                    <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2  rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold   focus:ring-[#050708]/50 uppercase">
                      JOB APPLIED
                    </span>
                    <animated.span className="whitespace-nowrap mx-1 sm:mx-2 lg:mx-1 xl:mx-2  text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                      {careerProps?.number.to((n) => n.toFixed(0))}
                    </animated.span>
                  </div>
                </>
              )
            )}
          </div>
        )}


        {/* Employee-wise data */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          
          {/* advisor */}
          {!branch && !employeeId && !advId && (
            <div className="block shadow-blue-650">
              <h1 className="uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
                ADVISORS
              </h1>
              <div className="shadow-2xl drop-shadow-2xl">
                {/* Display the total number of advisors at the top */}
                <div className="flex justify-between flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row items-center bg-blue-600 shadow-2xl drop-shadow-2xl shadow-blue-650 rounded-t-lg">
                  <span className="sm:block mx-1 sm:mx-2 px-2 py-2 rounded-lg text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-semibold text-white focus:ring-[#050708]/50 uppercase">
                    Total Advisors
                  </span>
                  <span className="mx-1 sm:mx-2 lg:mx-1 xl:mx-2 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                    {totalAdvisors}
                  </span>
                </div>

                {/* Iterate through the advisors array to display each branch and its count */}
                {advisor?.map((branch, index) => (
                  <div
                    key={index}
                    className={`even:bg-sky-500 flex flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row justify-between items-center h-12 lg:p-1 lg:h-16 xl:h-10 bg-blue-600 shadow-2xl drop-shadow-2xl shadow-blue-650 ${
                      index === advisor?.length - 1 ? "rounded-b-lg" : ""
                    }`}
                  >
                    <span className="sm:block mx-1 sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-semibold text-white focus:ring-[#050708]/50 uppercase">
                      {branch}
                    </span>
                    <span className="text-xs sm:text-xs mx-1 sm:mx-2 lg:mx-1 xl:mx-2 md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                      {advCounts[branch] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attendances */}
          {!advId && (
            <div className="block space-y-0.5">
              {employeeId ? (
                // Employee-specific leave stats
                <>
                  <h1 className="uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
                    Leave Statistics
                  </h1>
                  <div className="shadow-2xl drop-shadow-2xl shadow-blue-650 grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-16 sm:h-16 lg:h-16 xl:h-12 rounded-t-lg mb-2 bg-slate-600">
                    <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                      PENDING / TOTAL
                    </span>
                    <span className="mx-3">
                      <animated.span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        {totalLeavePendingCountsProps?.number.to((n) =>
                          n.toFixed(0)
                        )}
                      </animated.span>
                      <span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        /
                      </span>
                      <animated.span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        {totalLeaveCountsProps?.number.to((n) => n.toFixed(0))}
                      </animated.span>
                    </span>
                  </div>
                  <div className="shadow-2xl drop-shadow-2xl shadow-blue-650 grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-16 sm:h-16 lg:h-16 xl:h-12 bg-green-700">
                    <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                      APPROVED / TOTAL
                    </span>
                    <span className="mx-3">
                      <animated.span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        {totalLeaveApprovedCountsProps?.number.to((n) =>
                          n.toFixed(0)
                        )}
                      </animated.span>
                      <span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        /
                      </span>
                      <animated.span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        {totalLeaveCountsProps?.number.to((n) => n.toFixed(0))}
                      </animated.span>
                    </span>
                  </div>

                  <div className="shadow-2xl drop-shadow-2xl shadow-blue-650 grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-16 sm:h-16 lg:h-16 xl:h-12 rounded-b-lg mb-2 bg-rose-700">
                    <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                      REJECTED / TOTAL
                    </span>
                    <span className="mx-3">
                      <animated.span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        {totalLeaveRejectedCountsProps?.number.to((n) =>
                          n.toFixed(0)
                        )}
                      </animated.span>
                      <span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        /
                      </span>
                      <animated.span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        {totalLeaveCountsProps?.number.to((n) => n.toFixed(0))}
                      </animated.span>
                    </span>
                  </div>
                </>
              ) : (
                // General dashboard stats
                <>
                  <h1 className="uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center">
                    Att/Emp
                  </h1>
                  <div className="shadow-2xl drop-shadow-2xl shadow-blue-650 grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-12 sm:h-16 lg:h-16 xl:h-12 rounded-t-lg bg-sky-700">
                    <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                      Active / Total
                    </span>
                    <span className="mx-3">
                      <animated.span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        {activeEmpCountProps?.number.to((n) => n.toFixed(0))}
                      </animated.span>
                      <span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        /
                      </span>
                      <animated.span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        {empCountProps?.number.to((n) => n.toFixed(0))}
                      </animated.span>
                    </span>
                  </div>
                  <div className="shadow-2xl drop-shadow-2xl shadow-blue-650 grid xl:flex lg:grid text-white md:grid sm:grid items-center xl:justify-between h-12 sm:h-16 lg:h-16 xl:h-12 rounded-b-lg mb-2 bg-sky-600">
                    <span className="sm:block mx-1 sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                      Att. / Active
                    </span>
                    <span className="mx-3">
                      <animated.span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        {currAttendanceProps?.number.to((n) => n.toFixed(0))}
                      </animated.span>
                      <span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        /
                      </span>
                      <animated.span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        {activeEmpCountProps?.number.to((n) => n.toFixed(0))}
                      </animated.span>
                    </span>
                  </div>

                  <h1 className="uppercase font-serif text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-center py-1">
                    Leave
                  </h1>
                  <div className="shadow-2xl drop-shadow-2xl shadow-blue-650 grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-16 sm:h-16 lg:h-16 xl:h-12 rounded-t-lg bg-rose-700">
                    <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                      APPROVED / TOTAL
                    </span>
                    <span className="mx-3">
                      <animated.span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        {approveLeaveCountsProps?.number.to((n) =>
                          n.toFixed(0)
                        )}
                      </animated.span>
                      <span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        /
                      </span>
                      <animated.span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        {totalLeavesCountsProps?.number.to((n) => n.toFixed(0))}
                      </animated.span>
                    </span>
                  </div>
                  <div className="shadow-2xl drop-shadow-2xl shadow-blue-650 grid xl:flex lg:grid md:grid sm:grid items-center xl:justify-between h-16 sm:h-16 lg:h-16 xl:h-12 rounded-b-lg bg-rose-600">
                    <span className="sm:block mx-1 text-white sm:mx-2 lg:mx-1 xl:mx-2 px-2 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-semibold focus:ring-[#050708]/50 uppercase">
                      REJECTED / TOTAL
                    </span>
                    <span className="mx-3">
                      <animated.span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        {rejectedLeaveCountsProps?.number.to((n) =>
                          n.toFixed(0)
                        )}
                      </animated.span>
                      <span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        /
                      </span>
                      <animated.span className="mx-0.5 text-xs sm:text-xs md:text-sm lg:text-base xl:text-base font-bold text-gray-50">
                        {totalLeavesCountsProps?.number.to((n) => n.toFixed(0))}
                      </animated.span>
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* employees */}
          {!employeeId && (
            <div
              className={`block ${
                advId ? "col-span-5" : branch ? "col-span-4" : "col-span-3"
              } items-center`}
            >
              <div className="grid grid-cols-6">
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
          )}
        </div>
      </div>
    </>
  );
});

export default AdminDashboard;
