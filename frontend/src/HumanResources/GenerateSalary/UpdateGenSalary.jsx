/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToWords } from "to-words";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDaysInMonth,
} from "date-fns";
import VITE_DATA from "../../config/config.jsx";

function UpdateGenSalary({ genSalaries, onUpdate, onClose }) {
//  console.log("genSalaries:", genSalaries);
 
  const [loading, setLoading] = useState(false);
  const [empList, setEmployeeList] = useState([]);
  const [holidayData, setHolidayData] = useState([]);
  const [data, setData] = useState({
    empUniqueId: "",
    salDate: "",
    empName: "",
    presentDays: 0,
    totalHalfDays: 0,
    totalAbsent: 0,
    genSalary: 0,
    sundays: 0,
    monthsalary: 0,
    genMonths: "",
    monthleave: 0,
    totalDays: 0,
    incentive: 0,
    totalAmount: 0,
    totalMonthDays: 0,
    empgrossSalary: 0,
    empbasicSalary: 0,
    emphra: 0,
    empca: 0,
    empmedical: 0,
    emptiffin: 0,
    empcompanyPf: 0,
    emppf: 0,
    empesi: 0,
    emploanemi: 0,
    empid: "",
    empdesignation: "",
    empbranch: "",
    location: "",
    accNum: "",
    arrear: 0,
    bankNamed: "",
    finalAmountSalary: 0,
    otherDeduction: 0,
    finalDeduction: 0,
    fuelExpense: 0,
    otherExpense: 0,
    inWords: "",
    kit: 0,
    additional: 0,
    email: "",
    mobile: "",
    holidayCount: 0,
  });

  const [year, setYear] = useState("");
  const [months, setMonths] = useState("");

  useEffect(() => {
    // Fetch the list of employees and holidays when the component mounts
    axios.get(`${VITE_DATA}/api/employee-list`).then((response) => {
      setEmployeeList(response.data);
    });
    axios.get(`${VITE_DATA}/holidays/alllists`).then((response) => {
      setHolidayData(response.data);
    });
  }, []);

  useEffect(() => {
    // Initialize data with genSalaries props
    setData({
      ...genSalaries,
      salDate: genSalaries.salDate || "",
      empName: genSalaries.empName || "",
      presentDays: genSalaries.presentDays || 0,
      totalHalfDays: genSalaries.totalHalfDays || 0,
      totalAbsent: genSalaries.totalAbsent || 0,
      genSalary: genSalaries.genSalary || 0,
      sundays: genSalaries.sundays || 0,
      monthsalary: genSalaries.monthsalary || 0,
      genMonths: genSalaries.genMonths || "",
      monthleave: genSalaries.monthleave || 0,
      totalDays: genSalaries.totalDays || 0,
      incentive: genSalaries.incentive || 0,
      totalAmount: genSalaries.totalAmount || 0,
      totalMonthDays: genSalaries.totalMonthDays || 0,
      empgrossSalary: genSalaries.empgrossSalary || 0,
      empbasicSalary: genSalaries.empbasicSalary || 0,
      emphra: genSalaries.emphra || 0,
      empca: genSalaries.empca || 0,
      empmedical: genSalaries.empmedical || 0,
      emptiffin: genSalaries.emptiffin || 0,
      empcompanyPf: genSalaries.empcompanyPf || 0,
      emppf: genSalaries.emppf || 0,
      empesi: genSalaries.empesi || 0,
      emploanemi: genSalaries.emploanemi || 0,
      empid: genSalaries.empid || "",
      empdesignation: genSalaries.empdesignation || "",
      empbranch: genSalaries.empbranch || "",
      location: genSalaries.location || "",
      accNum: genSalaries.accNum || "",
      arrear: genSalaries.arrear || 0,
      bankNamed: genSalaries.bankNamed || "",
      finalAmountSalary: genSalaries.finalAmountSalary || 0,
      otherDeduction: genSalaries.otherDeduction || 0,
      finalDeduction: genSalaries.finalDeduction || 0,
      fuelExpense: genSalaries.fuelExpense || 0,
      otherExpense: genSalaries.otherExpense || 0,
      inWords: genSalaries.inWords || "",
      kit: genSalaries.kit || 0,
      additional: genSalaries.additional || 0,
      email: genSalaries.email || "",
      mobile: genSalaries.mobile || "",
      holidayCount: genSalaries.holidayCount || 0,
    });

    // Extract year and month from genMonths (format: MM/YYYY)
    if (genSalaries.genMonths) {
      const [month, year] = genSalaries.genMonths.split("/");
      setMonths(month);
      setYear(year);
    }
  }, [genSalaries]);

  // Function to format a Date object to dd/mm/yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setYear(selectedYear);
    setData((prevData) => ({
      ...prevData,
      genMonths: months ? `${months}/${selectedYear}` : prevData.genMonths,
    }));
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setMonths(selectedMonth);
    setData((prevData) => ({
      ...prevData,
      genMonths: year ? `${selectedMonth}/${year}` : prevData.genMonths,
    }));
  };

  const handleEmployeeChange = (selectedEmployee) => {
    const selectedEmp = empList.find(
      (emp) => emp?.empname === selectedEmployee
    );
    setData((prevData) => ({
      ...prevData,
      empName: selectedEmployee,
      empid: selectedEmp?.empid || "",
      empUniqueId: selectedEmp?._id || "",
      empdesignation: selectedEmp?.staffType || "",
      empbranch: selectedEmp?.empbranch || "",
      location: selectedEmp?.empbranch || "",
      accNum: selectedEmp?.accNumber || "",
      email: selectedEmp?.empemail || "",
      mobile: selectedEmp?.empmobile || "",
      bankNamed: selectedEmp?.bankName || "",
      monthsalary: selectedEmp?.salary || 0,
      monthleave: selectedEmp?.leavemonth || 0,
    }));
    filterEmployeeDetailsByMonthAndYear(selectedEmp, year, months);
  };

  const filterEmployeeDetailsByMonthAndYear = (employee, selectedYear, selectedMonth) => {
    if (!employee || !selectedYear || !selectedMonth) return;
    const startDate = startOfMonth(new Date(selectedYear, selectedMonth - 1));
    const endDate = endOfMonth(new Date(selectedYear, selectedMonth - 1));
    const daysOfMonth = eachDayOfInterval({ start: startDate, end: endDate });
    const formattedDays = daysOfMonth.map((day) => day.getDay());

    const filteredDetails = employee.employeeDetails.filter((detail) => {
      if (!detail.date) {
        console.log("Invalid date:", detail);
        return false;
      }
      const [day, month, year] = detail.date.split("/").map(Number);
      return year === parseInt(selectedYear) && month === parseInt(selectedMonth);
    });

    let totalPresentDays = 0;
    let totalAbsentDays = 0;
    let totalHalfDays = 0;
    let holiDayCount = 0;
    let sundayCount = 0;
    let workingDaysCount = 0;

    filteredDetails.forEach((detail) => {
      switch (detail?.status) {
        case "present":
          totalPresentDays++;
          break;
        case "absent":
          totalAbsentDays++;
          break;
        case "halfday":
          totalHalfDays++;
          break;
        default:
          break;
      }
    });

    daysOfMonth.forEach((date, dateIndex) => {
      const formattedDate = formatDate(date);
      const holiday = holidayData.find(
        (holiday) => holiday.hdate === formattedDate
      );
      const isHoliday = !!holiday;
      if (isHoliday) {
        holiDayCount++;
      }
      if (formattedDays[dateIndex] !== 0) {
        workingDaysCount++;
      } else if (formattedDays[dateIndex] === 0) {
        sundayCount++;
      }
    });
    const workday = workingDaysCount - holiDayCount;

    setData((prevData) => ({
      ...prevData,
      presentDays: totalPresentDays,
      totalMonthDays: getDaysInMonth(new Date(selectedYear, selectedMonth - 1)),
      totalDays: workday,
      totalAbsent: totalAbsentDays,
      totalHalfDays: totalHalfDays,
      sundays: sundayCount,
      holidayCount: holiDayCount,
    }));
  };

  const renderYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 2000; y--) {
      years.push(
        <option key={y} value={y}>
          {y}
        </option>
      );
    }
    return years;
  };

  const renderMonths = () => {
    const months = [];
    for (let m = 1; m <= 12; m++) {
      const date = new Date(year || new Date().getFullYear(), m - 1, 1);
      const monthName = format(date, "MMMM");
      months.push(
        <option key={m} value={m}>
          {monthName}
        </option>
      );
    }
    return months;
  };

  // Gross Salary
  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      empgrossSalary: parseFloat(data.monthsalary) || 0,
    }));
  }, [data.monthsalary]);

  // Salary Calculation
  useEffect(() => {
    const handleSalary = () => {
      const totalWorkingDays = parseFloat(data.totalDays) || 0;
      const presentDays = parseFloat(data.presentDays) || 0;
      const halfDays = parseFloat(data.totalHalfDays) || 0;
      const sundayCount = parseFloat(data.sundays) || 0;
      const holidayCountValue = parseFloat(data.holidayCount) || 0;
      const monthLeavecount = parseFloat(data.monthleave) || 0;
      const total = parseFloat(data.totalMonthDays) || 0;

      if (totalWorkingDays === 0) {
        setData((prevData) => ({
          ...prevData,
          genSalary: 0,
        }));
        return;
      }

      let salary = (data.monthsalary / total) *
        (presentDays + sundayCount + holidayCountValue + monthLeavecount);
      const halfSalary = (data.monthsalary / total) * 0.5 * halfDays;
      salary = parseFloat(salary) + parseFloat(halfSalary);
      setData((prevData) => ({
        ...prevData,
        genSalary: salary.toFixed(2),
      }));
    };
    handleSalary();
  }, [data.monthsalary, data.presentDays, data.totalHalfDays, data.totalDays, data.holidayCount, data.totalMonthDays, data.monthleave]);

  // Total Amount
  useEffect(() => {
    const salariesValue = parseFloat(data.genSalary) || 0;
    const incentiveValue = parseFloat(data.incentive) || 0;
    const incent = parseFloat(salariesValue + incentiveValue);
    setData((prevData) => ({
      ...prevData,
      totalAmount: incent.toFixed(2),
    }));
  }, [data.genSalary, data.incentive]);

  // Basic Salary
  useEffect(() => {
    const basic = parseFloat(data.empgrossSalary) || 0;
    const final_basic = basic / 2;
    setData((prevData) => ({
      ...prevData,
      empbasicSalary: final_basic.toFixed(2),
    }));
  }, [data.empgrossSalary]);

  // HRA
  useEffect(() => {
    const calculateHra = parseFloat(data.empbasicSalary) || 0;
    const finalHra = (calculateHra * 50) / 100;
    setData((prevData) => ({
      ...prevData,
      emphra: finalHra.toFixed(2),
    }));
  }, [data.empbasicSalary]);

  // CA
  useEffect(() => {
    const calculateCa = parseFloat(data.empbasicSalary) || 0;
    const finalCa = (calculateCa * 20) / 100;
    setData((prevData) => ({
      ...prevData,
      empca: finalCa.toFixed(2),
    }));
  }, [data.empbasicSalary]);

  // Medical
  useEffect(() => {
    const calculateMedical = parseFloat(data.empbasicSalary) || 0;
    const finalMedical = (calculateMedical * 10) / 100;
    setData((prevData) => ({
      ...prevData,
      empmedical: finalMedical.toFixed(2),
    }));
  }, [data.empbasicSalary]);

  // Tiffin
  useEffect(() => {
    const calculateTiffin = parseFloat(data.empbasicSalary) || 0;
    const finalTiffin = (calculateTiffin * 10) / 100;
    setData((prevData) => ({
      ...prevData,
      emptiffin: finalTiffin.toFixed(2),
    }));
  }, [data.empbasicSalary]);

  // Kit
  useEffect(() => {
    const calculateKit = parseFloat(data.empbasicSalary) || 0;
    const finalKit = (calculateKit * 10) / 100;
    setData((prevData) => ({
      ...prevData,
      kit: finalKit.toFixed(2),
    }));
  }, [data.empbasicSalary]);

  // // Additional
  // useEffect(() => {
  //   const calculateAdditional = parseFloat(data.empbasicSalary) || 0;
  //   const finalAdditional = (calculateAdditional * 10) / 100;
  //   setData((prevData) => ({
  //     ...prevData,
  //     additional: finalAdditional.toFixed(2),
  //   }));
  // }, [data.empbasicSalary]);

  // Final Salary Amount
  useEffect(() => {
    const salariesValue = parseFloat(data.genSalary) || 0;
    const incentiveValue = parseFloat(data.incentive) || 0;
    const prevSalary = parseFloat(data.arrear) || 0;
    const fuelValue = parseFloat(data.fuelExpense) || 0;
    const otherValue = parseFloat(data.otherExpense) || 0;
    const incent = parseFloat(
      salariesValue + incentiveValue + prevSalary + fuelValue + otherValue
    ).toFixed(0);
    setData((prevData) => ({
      ...prevData,
      finalAmountSalary: incent,
    }));
  }, [data.genSalary, data.incentive, data.arrear, data.fuelExpense, data.otherExpense]);

  // Deduction Amount
  useEffect(() => {
    const loanemis = parseFloat(data.emploanemi) || 0;
    const emppf = parseFloat(data.emppf) || 0;
    const otherDeductionValue = parseFloat(data.otherDeduction) || 0;
    const empesi = parseFloat(data.empesi) || 0;
    const deduct = parseFloat(loanemis + emppf + otherDeductionValue + empesi).toFixed(1);
    setData((prevData) => ({
      ...prevData,
      finalDeduction: deduct,
    }));
  }, [data.emploanemi, data.emppf, data.otherDeduction , data.empesi]);

  // Company PF
  useEffect(() => {
    const calculatePf = parseFloat(data.empbasicSalary ) || 0;
    const abc = parseFloat(data.empca ) || 0;
    const calculatePfWithCa = calculatePf + abc;
    const finalPf = (calculatePfWithCa * 12) / 100;
    setData((prevData) => ({
      ...prevData,
      empcompanyPf: finalPf.toFixed(2),
    }));
  }, [data.empbasicSalary,data.empca]);

  // PF
  useEffect(() => {
     const calculatePf = parseFloat(data.empbasicSalary ) || 0;
    const abc = parseFloat(data.empca ) || 0;
    const calculatePfWithCa = calculatePf + abc;
    const finalPf = (calculatePfWithCa * 12) / 100;
    setData((prevData) => ({
      ...prevData,
      emppf: finalPf.toFixed(2),
    }));
  }, [data.empbasicSalary, data.empca]);

  // ESI
  // useEffect(() => {
  //   const calculateESI = parseFloat(data.empgrossSalary) || 0;
  //   const finalESI = (calculateESI * 0.75) / 100;
  //   setData((prevData) => ({
  //     ...prevData,
  //     empesi: finalESI.toFixed(2),
  //   }));
  // }, [data.empgrossSalary]);

  // In Words Conversion
  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        name: "Rupee",
        plural: "Rupees",
        symbol: "₹",
        fractionalUnit: {
          name: "Paisa",
          plural: "Paise",
          symbol: "",
        },
      },
    },
  });

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      inWords: toWords.convert(parseFloat(data.finalAmountSalary) || 0),
    }));
  }, [data.finalAmountSalary]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const convertToDateInputFormat = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e) => {
    const input = e.target.value;
    if (input) {
      const [year, month, day] = input.split("-");
      const formattedDate = `${day}-${month}-${year}`;
      setData((prevData) => ({
        ...prevData,
        salDate: formattedDate,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        salDate: "",
      }));
    }
  };
      console.log("Data to be updated:", data);


  const updateGenSalaryAPI = async () => {
    // Validation
    if (parseFloat(data.presentDays) + parseFloat(data.totalHalfDays) + parseFloat(data.totalAbsent) > parseFloat(data.totalDays)) {
      toast.error("Present Days + Half Days + Absent Days cannot exceed Total Working Days!");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.put(
        `${VITE_DATA}/api/salaries/${genSalaries._id}`,
        data
      );
      toast.success("Updated Successfully!");
      onClose();
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred!");
      console.error("Error updating Generated Salary:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="static-modal"
      data-modal-backdrop="static"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 bottom-0 inset-0 z-50 overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-7xl max-h-full mx-auto mt-10">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 border-b rounded-t">
            <h3 className="text-2xl font-semibold text-blue-700">
              Update Generated Salary
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Salary Payment Date:</label>
                <input
                  className="input-style p-1 rounded"
                  type="date"
                  value={convertToDateInputFormat(data.salDate)}
                  onChange={handleDateChange}
                  name="salDate"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Employee Name:</label>
                <select
                  className="input-style text-base rounded p-1"
                  value={data.empName}
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                  name="empName"
                >
                  <option value="" className="text-base">
                    ------ Select Employee --------
                  </option>
                  {empList
                    .filter((employee) => employee.flags === true)
                    .map((emp) => (
                      <option
                        key={emp.empid}
                        value={emp.empname}
                        className="text-base"
                      >
                        {`${emp.empid} - ${emp.empname}`}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Monthly Salary:</label>
                <input
                  className="input-style p-1 bg-red-100 rounded"
                  type="number"
                  min="0"
                  value={data.monthsalary}
                  name="monthsalary"
                  onChange={handleInputChange}
                  placeholder="₹ 0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Monthly Leave:</label>
                <input
                  className="input-style p-1 bg-red-100 rounded"
                  type="number"
                  min="0"
                  max="12"
                  value={data.monthleave}
                  name="monthleave"
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label htmlFor="year" className="text-base mx-1">
                  Year:
                </label>
                <select
                  id="year"
                  value={year}
                  onChange={handleYearChange}
                  className="input-style p-1 text-base rounded text-black"
                  disabled={!data.empName}
                >
                  <option value="">--------- Select Year --------</option>
                  {renderYears()}
                </select>
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label htmlFor="month" className="text-base mx-1">
                  Months:
                </label>
                <select
                  className="input-style p-1 text-base rounded text-black"
                  id="month"
                  value={months}
                  onChange={handleMonthChange}
                  name="genMonths"
                  disabled={!year}
                >
                  <option value="">------ Select Month ----------</option>
                  {renderMonths()}
                </select>
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Total Days:</label>
                <input
                  className="input-style p-1 bg-red-100 rounded"
                  type="number"
                  min="0"
                  value={data.totalMonthDays}
                  name="totalMonthDays"
                  onChange={handleInputChange}
                  placeholder="0"
                  disabled
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Total Working Days:</label>
                <input
                  className="input-style p-1 rounded"
                  type="number"
                  min="0"
                  value={data.totalDays}
                  name="totalDays"
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Present Days:</label>
                <input
                  className="input-style p-1 rounded"
                  type="number"
                  min="0"
                  value={data.presentDays}
                  name="presentDays"
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Total Absent:</label>
                <input
                  className="input-style p-1 bg-red-100 rounded"
                  type="number"
                  min="0"
                  value={data.totalAbsent}
                  name="totalAbsent"
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Total Half Days:</label>
                <input
                  className="input-style p-1 rounded"
                  type="number"
                  min="0"
                  value={data.totalHalfDays}
                  name="totalHalfDays"
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Sundays:</label>
                <input
                  className="input-style p-1 rounded"
                  type="number"
                  min="0"
                  value={data.sundays}
                  name="sundays"
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Holidays:</label>
                <input
                  className="input-style p-1 bg-red-100 rounded"
                  type="number"
                  min="0"
                  value={data.holidayCount}
                  name="holidayCount"
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Salary:</label>
                <input
                  className="input-style p-1 bg-red-100 rounded"
                  type="number"
                  min="0"
                  value={data.genSalary}
                  name="genSalary"
                  onChange={handleInputChange}
                  placeholder="₹ 0"
                  disabled
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Incentive:</label>
                <input
                  className="input-style p-1 rounded"
                  type="number"
                  min="0"
                  value={data.incentive}
                  name="incentive"
                  onChange={handleInputChange}
                  placeholder="₹ 0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Total Amount:</label>
                <input
                  className="input-style p-1 bg-red-100 rounded"
                  type="number"
                  min="0"
                  value={data.totalAmount}
                  name="totalAmount"
                  onChange={handleInputChange}
                  placeholder="₹ 0"
                  disabled
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Arrear:</label>
                <input
                  className="input-style p-1 rounded"
                  type="number"
                  min="0"
                  value={data.arrear}
                  name="arrear"
                  onChange={handleInputChange}
                  placeholder="₹ 0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Bank Name:</label>
                <input
                  className="input-style bg-red-100 p-1 rounded"
                  type="text"
                  value={data.bankNamed}
                  name="bankNamed"
                  onChange={handleInputChange}
                  placeholder="Bank Name"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
                <label className="text-base mx-1">Account No:</label>
                <input
                  className="input-style bg-red-100 p-1 rounded"
                  type="text"
                  value={data.accNum}
                  name="accNum"
                  onChange={handleInputChange}
                  placeholder="Please Added by Emp"
                />
              </div>
            </div>
            <div className="w-full col-span-4 mt-5 mb-4 text-white border-b border border-blue-700 bg-blue-700"></div>
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">Gross Salary:</label>
                <input
                  className="input-style p-1 bg-red-100 rounded"
                  type="number"
                  min="0"
                  value={data.empgrossSalary}
                  name="empgrossSalary"
                  onChange={handleInputChange}
                  placeholder="₹ 0"
                  disabled
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">Basic Salary:</label>
                <input
                  className="input-style p-1 bg-red-100 rounded"
                  type="number"
                  min="0"
                  value={data.empbasicSalary}
                  name="empbasicSalary"
                  onChange={handleInputChange}
                  placeholder="Basic Salary"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">HRA:</label>
                <input
                  className="input-style p-1 bg-red-100 rounded"
                  type="number"
                  min="0"
                  value={data.emphra}
                  name="emphra"
                  onChange={handleInputChange}
                  placeholder="₹ 0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">DA:</label>
                <input
                  className="input-style p-1 bg-red-100 rounded"
                  type="number"
                  min="0"
                  value={data.empca}
                  name="empca"
                  onChange={handleInputChange}
                  placeholder="DA"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">Medical Allowance:</label>
                <input
                  className="input-style bg-red-100 p-1 rounded"
                  type="number"
                  min="0"
                  value={data.empmedical}
                  name="empmedical"
                  onChange={handleInputChange}
                  placeholder="Medical Allowance"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">Tiffin/DAS Allowance:</label>
                <input
                  className="input-style bg-red-100 p-1 rounded"
                  type="number"
                  min="0"
                  value={data.emptiffin}
                  name="emptiffin"
                  onChange={handleInputChange}
                  placeholder="Tiffin Allowance"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">Kit Allowance:</label>
                <input
                  className="input-style bg-red-100 p-1 rounded"
                  type="number"
                  min="0"
                  value={data.kit}
                  name="kit"
                  onChange={handleInputChange}
                  placeholder="Kit Allowance"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">Additional Allowance:</label>
                <input
                  className="input-style bg-red-100 p-1 rounded"
                  type="number"
                  min="0"
                  value={data.additional}
                  name="additional"
                  onChange={handleInputChange}
                  placeholder="Additional Allowance"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">Company PF:</label>
                <input
                  className="input-style p-1 bg-red-100 rounded"
                  type="number"
                  min="0"
                  value={data.monthsalary > 21000 ? 0 : data.empcompanyPf}
                  name="empcompanyPf"
                  onChange={handleInputChange}
                  placeholder="PF"
                  disabled={data.monthsalary > 21000}
                />
                {data.monthsalary > 21000 && (
                  <span className="text-xs text-red-700">Not applicable if salary {">"} ₹21,000</span>
                )}
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">Final Salary Amount:</label>
                <input
                  className="input-style p-1 bg-blue-100 rounded"
                  type="number"
                  min="0"
                  value={data.finalAmountSalary}
                  name="finalAmountSalary"
                  onChange={handleInputChange}
                  placeholder="₹ 0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/3">
                <label className="text-base mx-1">Salary in Words:</label>
                <input
                  className="input-style bg-blue-100 p-1 rounded"
                  type="text"
                  value={data.inWords}
                  name="inWords"
                  placeholder="₹ 0"
                  disabled
                />
              </div>
            </div>
            <div className="w-full col-span-4 my-4 text-white border-b border border-blue-500 bg-blue-700">
              Employee Contribution/Deduction
            </div>
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">PF:</label>
                <input
                  className="input-style bg-red-100 p-1 rounded"
                  type="number"
                  min="0"
                  value={data.emppf}
                  name="emppf"
                  onChange={handleInputChange}
                  placeholder="PF"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">Loan EMI:</label>
                <input
                  className="input-style p-1 rounded"
                  type="number"
                  min="0"
                  value={data.emploanemi}
                  name="emploanemi"
                  onChange={handleInputChange}
                  placeholder="₹ 0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">ESI:</label>
                <input
                  className="input-style bg-red-100 p-1 rounded"
                  type="number"
                  min="0"
                  value={data.empesi}
                  name="empesi"
                  onChange={handleInputChange}
                  placeholder="₹ 0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">TDS:</label>
                <input
                  className="input-style p-1 rounded"
                  type="number"
                  min="0"
                  value={data.otherDeduction}
                  name="otherDeduction"
                  onChange={handleInputChange}
                  placeholder="₹ 0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1 font-semibold text-red-700">
                  All Deduction Amount:
                </label>
                <input
                  className="input-style p-1 rounded"
                  type="number"
                  min="0"
                  value={data.finalDeduction}
                  name="finalDeduction"
                  onChange={handleInputChange}
                  placeholder="₹ 0"
                />
              </div>
            </div>
            <div className="w-full col-span-4 my-4 text-white border-b border border-blue-500 bg-blue-700">
              Other Expenses
            </div>
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">Fuel Expenses:</label>
                <input
                  className="input-style p-1 rounded"
                  type="number"
                  min="0"
                  value={data.fuelExpense}
                  name="fuelExpense"
                  onChange={handleInputChange}
                  placeholder="₹ 0"
                />
              </div>
              <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
                <label className="text-base mx-1">Other Expenses:</label>
                <input
                  className="input-style p-1 rounded"
                  type="number"
                  min="0"
                  value={data.otherExpense}
                  name="otherExpense"
                  onChange={handleInputChange}
                  placeholder="₹ 0"
                />
              </div>
            </div>
            <div className="w-full my-10 p-2 text-center">
              <button
                className="text-white bg-gradient-to-r leading-4 tracking-wider font-semibold from-green-600 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-green-700 dark:focus:ring-green-800 rounded shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 text-sm px-5 py-2.5 text-center"
                onClick={updateGenSalaryAPI}
                type="button"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateGenSalary;












// shad working code 3-06-2025
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react/prop-types */
// /* eslint-disable react/prop-types */
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { ToWords } from "to-words";
// import VITE_DATA from "../../config/config.jsx";

// function UpdateGenSalary({ genSalaries, onUpdate, onClose }) {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState({
//     empUniqueId: "",
//     salDate: "",
//     empName: "",
//     presentDays: "",
//     totalHalfDays: "",
//     totalAbsent: "",
//     genSalary: "",
//     sundays: "",
//     monthsalary: "",
//     genMonths: "",
//     monthleave: "",
//     totalDays: "",
//     incentive: "",
//     totalAmount: "",
//     totalMonthDays: "",
//     empgrossSalary: "",
//     empbasicSalary: "",
//     emphra: "",
//     empca: "",
//     empmedical: "",
//     emptiffin: "",
//     empcompanyPf: "",
//     emppf: "",
//     empesi: "",
//     emploanemi: "",
//     empid: "",
//     empdesignation: "",
//     empbranch: "",
//     location: "",
//     accNum: "",
//     arrear: "",
//     bankNamed: "",
//     finalAmountSalary: "",
//     otherDeduction: "",
//     finalDeduction: "",
//     fuelExpense: "",
//     otherExpense: "",
//     inWords: "",
//     kit: "",
//     additional: "",
//     email: "",
//     mobile: "",
//     holidayCount: "",
//   });

//   useEffect(() => {
//     setData({
//       ...genSalaries,
//       salDate: genSalaries.salDate || "",
//       empName: genSalaries.empName || "",
//       presentDays: genSalaries.presentDays || "",
//       totalHalfDays: genSalaries.totalHalfDays || "",
//       totalAbsent: genSalaries.totalAbsent || "",
//       genSalary: genSalaries.genSalary || "",
//       sundays: genSalaries.sundays || "",
//       monthsalary: genSalaries.monthsalary || "",
//       genMonths: genSalaries.genMonths || "",
//       monthleave: genSalaries.monthleave || "",
//       totalDays: genSalaries.totalDays || "",
//       incentive: genSalaries.incentive || "",
//       totalAmount: genSalaries.totalAmount || "",
//       totalMonthDays: genSalaries.totalMonthDays || "",
//       empgrossSalary: genSalaries.empgrossSalary || "",
//       empbasicSalary: genSalaries.empbasicSalary || "",
//       emphra: genSalaries.emphra || "",
//       empca: genSalaries.empca || "",
//       empmedical: genSalaries.empmedical || "",
//       emptiffin: genSalaries.emptiffin || "",
//       empcompanyPf: genSalaries.empcompanyPf || "",
//       emppf: genSalaries.emppf || "",
//       empesi: genSalaries.empesi || "",
//       emploanemi: genSalaries.emploanemi || "",
//       empid: genSalaries.empid || "",
//       empdesignation: genSalaries.empdesignation || "",
//       empbranch: genSalaries.empbranch || "",
//       location: genSalaries.location || "",
//       accNum: genSalaries.accNum || "",
//       arrear: genSalaries.arrear || "",
//       bankNamed: genSalaries.bankNamed || "",
//       finalAmountSalary: genSalaries.finalAmountSalary || "",
//       otherDeduction: genSalaries.otherDeduction || "",
//       finalDeduction: genSalaries.finalDeduction || "",
//       fuelExpense: genSalaries.fuelExpense || "",
//       otherExpense: genSalaries.otherExpense || "",
//       inWords: genSalaries.inWords || "",
//       kit: genSalaries.kit || "",
//       additional: genSalaries.additional || "",
//       email: genSalaries.email || "",
//       mobile: genSalaries.mobile || "",
//       holidayCount: genSalaries.holidayCount || "",
//     });
//   }, [genSalaries]);

//   // Calculate generated salary
//   useEffect(() => {
//     const handleSalary = () => {
//       const total = parseFloat(data.totalMonthDays) || 30.5;
//       let salary =
//         (parseFloat(data.monthsalary) || 0) /
//         total *
//         ((parseFloat(data.presentDays) || 0) + (parseFloat(data.sundays) || 0) + (parseFloat(data.holidayCount) || 0));
//       const halfSalary = ((parseFloat(data.monthsalary) || 0) / 30.5) * 0.5 * (parseFloat(data.totalHalfDays) || 0);
//       salary = parseFloat(salary) + parseFloat(halfSalary);
//       setData((prevData) => ({
//         ...prevData,
//         genSalary: parseFloat(salary.toFixed(2)),
//       }));
//     };
//     handleSalary();
//   }, [data.monthsalary, data.presentDays, data.totalHalfDays, data.sundays, data.holidayCount, data.totalMonthDays]);

//   // Calculate total amount
//   useEffect(() => {
//     const handleIncentive = () => {
//       const salariesValue = parseFloat(data.genSalary) || 0;
//       const incentiveValue = parseFloat(data.incentive) || 0;
//       const incent = parseFloat(salariesValue + incentiveValue);
//       setData((prevData) => ({
//         ...prevData,
//         totalAmount: incent.toFixed(2),
//       }));
//     };
//     handleIncentive();
//   }, [data.genSalary, data.incentive]);


//   // Calculate basic salary
//   useEffect(() => {
//     const handleBasic = () => {
//       const basic = parseFloat(data.empgrossSalary) || 0;
//       const final_basic = basic / 2;
//       setData((prevData) => ({
//         ...prevData,
//         empbasicSalary: final_basic.toFixed(2),
//       }));
//     };
//     handleBasic();
//   }, [data.empgrossSalary]);

//   // Calculate HRA
//   useEffect(() => {
//     const handleHra = () => {
//       const calculateHra = parseFloat(data.empgrossSalary) || 0;
//       const finalHra = (calculateHra * 30) / 100;
//       setData((prevData) => ({
//         ...prevData,
//         emphra: finalHra.toFixed(2),
//       }));
//     };
//     handleHra();
//   }, [data.empgrossSalary]);

//   // Calculate CA
//   useEffect(() => {
//     const handleCa = () => {
//       const calculateCa = parseFloat(data.empgrossSalary) || 0;
//       const finalCa = (calculateCa * 5) / 100;
//       setData((prevData) => ({
//         ...prevData,
//         empca: finalCa.toFixed(2),
//       }));
//     };
//     handleCa();
//   }, [data.empgrossSalary]);

//   // Calculate Medical
//   useEffect(() => {
//     const handleMedical = () => {
//       const calculateMedical = parseFloat(data.empgrossSalary) || 0;
//       const finalMedical = (calculateMedical * 5) / 100;
//       setData((prevData) => ({
//         ...prevData,
//         empmedical: finalMedical.toFixed(2),
//       }));
//     };
//     handleMedical();
//   }, [data.empgrossSalary]);

//   // Calculate Tiffin
//   useEffect(() => {
//     const handleTiffin = () => {
//       const calculateTiffin = parseFloat(data.empgrossSalary) || 0;
//       const finalTiffin = (calculateTiffin * 5) / 100;
//       setData((prevData) => ({
//         ...prevData,
//         emptiffin: finalTiffin.toFixed(2),
//       }));
//     };
//     handleTiffin();
//   }, [data.empgrossSalary]);

//   // Calculate Kit
//   useEffect(() => {
//     const handleKit = () => {
//       const calculateKit = parseFloat(data.empgrossSalary) || 0;
//       const finalKit = (calculateKit * 5) / 100;
//       setData((prevData) => ({
//         ...prevData,
//         kit: finalKit.toFixed(2),
//       }));
//     };
//     handleKit();
//   }, [data.empgrossSalary]);

//   // Calculate Additional
//   useEffect(() => {
//     const handleAdditional = () => {
//       const calculateAdditional = parseFloat(data.empgrossSalary) || 0;
//       const finalAdditional = (calculateAdditional * 5) / 100;
//       setData((prevData) => ({
//         ...prevData,
//         additional: finalAdditional.toFixed(2),
//       }));
//     };
//     handleAdditional();
//   }, [data.empgrossSalary]);

//   // Calculate Company PF
//   useEffect(() => {
//     const handleCompanyPf = () => {
//       const calculatePf = parseFloat(data.empgrossSalary) || 0;
//       const finalPf = (calculatePf * 12) / 100;
//       setData((prevData) => ({
//         ...prevData,
//         empcompanyPf: finalPf.toFixed(2),
//       }));
//     };
//     handleCompanyPf();
//   }, [data.empgrossSalary]);

//   // Calculate PF
//   useEffect(() => {
//     const handlePf = () => {
//       const calculatePf = parseFloat(data.empgrossSalary) || 0;
//       const finalPf = (calculatePf * 12) / 100;
//       setData((prevData) => ({
//         ...prevData,
//         emppf: finalPf.toFixed(2),
//       }));
//     };
//     handlePf();
//   }, [data.empgrossSalary]);

//   // Calculate final salary amount
//   useEffect(() => {
//     const handleFinalSalaryAmount = () => {
//       const salariesValue = parseFloat(data.genSalary) || 0;
//       const incent = parseFloat(salariesValue).toFixed(0);
//       setData((prevData) => ({
//         ...prevData,
//         finalAmountSalary: incent,
//       }));
//     };
//     handleFinalSalaryAmount();
//   }, [data.genSalary]);

//   // Calculate deductions
//   useEffect(() => {
//     const handleDeductionAmount = () => {
//       const loanemis = parseFloat(data.emploanemi) || 0;
//       const emppf = parseFloat(data.emppf) || 0;
//       const otherDeductionValue = parseFloat(data.otherDeduction) || 0;
//       const deduct = parseFloat(loanemis + emppf + otherDeductionValue).toFixed(1);
//       setData((prevData) => ({
//         ...prevData,
//         finalDeduction: deduct,
//       }));
//     };
//     handleDeductionAmount();
//   }, [data.emploanemi, data.emppf, data.otherDeduction]);

//   // Handle inWords conversion
//   const toWords = new ToWords({
//     localeCode: "en-IN",
//     converterOptions: {
//       currency: true,
//       ignoreDecimal: false,
//       ignoreZeroCurrency: false,
//       doNotAddOnly: false,
//       currencyOptions: {
//         name: "Rupee",
//         plural: "Rupees",
//         symbol: "₹",
//         fractionalUnit: {
//           name: "Paisa",
//           plural: "Paise",
//           symbol: "",
//         },
//       },
//     },
//   });

//   useEffect(() => {
//     setData((prevData) => ({
//       ...prevData,
//       inWords: toWords.convert(parseFloat(data.finalAmountSalary) || 0),
//     }));
//   }, [data.finalAmountSalary]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };


  
//   const updateGenSalaryAPI = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.put(
//         `${VITE_DATA}/api/salaries/${genSalaries._id}`,
//         data
//       );
//       toast.success(`${response.data.status}`);
//       onClose();
//       onUpdate();
//     } catch (error) {
//       toast.error(`${error.response?.data?.message || error.message}`);
//       console.error("Error updating Generated Salary:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Convert dd-mm-yyyy to yyyy-mm-dd for date input
//   const convertToDateInputFormat = (dateStr) => {
//     if (!dateStr) return "";
//     const [day, month, year] = dateStr.split("-");
//     return `${year}-${month}-${day}`;
//   };

//   return (
//     <div
//       id="static-modal"
//       data-modal-backdrop="static"
//       tabIndex="-1"
//       aria-hidden="true"
//       className="fixed top-0 right-0 left-0 bottom-0 inset-0 z-50 overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
//     >
//       <div className="relative p-4 w-full max-w-7xl max-h-full mx-auto mt-10">
//         <div className="relative bg-white rounded-lg shadow">
//           <div className="flex items-center justify-between p-4 border-b rounded-t">
//             <h3 className="text-2xl font-semibold text-blue-700">
//               Update Generated Salary
//             </h3>
//             <button
//               onClick={onClose}
//               type="button"
//               className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
//             >
//               <svg
//                 className="w-3 h-3"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 14 14"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
//                 />
//               </svg>
//               <span className="sr-only">Close modal</span>
//             </button>
//           </div>
//           <div className="p-4">
//             <div className="flex flex-wrap justify-between">
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Salary Payment Date:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="date"
//                   value={convertToDateInputFormat(data.salDate)}
//                   onChange={(e) => {
//                     const input = e.target.value;
//                     const [year, month, day] = input.split("-");
//                     const formattedDate = `${day}-${month}-${year}`;
//                     setData((prevData) => ({
//                       ...prevData,
//                       salDate: formattedDate,
//                     }));
//                   }}
//                   name="salDate"
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Employee Name:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="text"
//                   value={data.empName}
//                   name="empName"
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Monthly Salary:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.monthsalary}
//                   name="monthsalary"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Monthly Leave:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   max="12"
//                   value={data.monthleave}
//                   name="monthleave"
//                   onChange={handleInputChange}
//                   placeholder="0"
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Month/Year:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="text"
//                   value={data.genMonths}
//                   name="genMonths"
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Total Days:</label>
//                 <input
//                   className="input-style p-1 bg-red-100 rounded"
//                   type="number"
//                   min="0"
//                   value={data.totalMonthDays}
//                   name="totalMonthDays"
//                   onChange={handleInputChange}
//                   placeholder="0"
//                   // disabled
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Total Working Days:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.totalDays}
//                   name="totalDays"
//                   onChange={handleInputChange}
//                   placeholder="0"
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Present Days:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.presentDays}
//                   name="presentDays"
//                   onChange={handleInputChange}
//                   placeholder="0"
//                 />
//               </div>

//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Total Absent:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.totalAbsent}
//                   name="totalAbsent"
//                   onChange={handleInputChange}
//                   placeholder="0"
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Total Half Days:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.totalHalfDays}
//                   name="totalHalfDays"
//                   onChange={handleInputChange}
//                   placeholder="0"
//                 />
//               </div>


//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Holidays:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.holidayCount}
//                   name="holidayCount"
//                   onChange={handleInputChange}
//                   placeholder="0"
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Salary:</label>
//                 <input
//                   className="input-style p-1 bg-red-100 rounded"
//                   type="number"
//                   min="0"
//                   value={data.genSalary}
//                   name="genSalary"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                   // disabled
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Incentive:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.incentive}
//                   name="incentive"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Total Amount:</label>
//                 <input
//                   className="input-style p-1 bg-red-100 rounded"
//                   type="number"
//                   min="0"
//                   value={data.totalAmount}
//                   name="totalAmount"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                   // disabled
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Arrear:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.arrear}
//                   name="arrear"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Bank Name:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="text"
//                   value={data.bankNamed}
//                   name="bankNamed"
//                   onChange={handleInputChange}
//                   placeholder="Bank Name"
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//                 <label className="text-base mx-1">Account No:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="text"
//                   value={data.accNum}
//                   name="accNum"
//                   onChange={handleInputChange}
//                   placeholder="Please Added by Emp"
//                 />
//               </div>
//             </div>
//             <div className="w-full col-span-4 mt-5 mb-4 text-white border-b border border-blue-700 bg-blue-700"></div>
//             <div className="flex flex-wrap justify-between">
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">Gross Salary:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.empgrossSalary}
//                   name="empgrossSalary"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">Basic Salary:</label>
//                 <input
//                   className="input-style p-1 bg-red-100 rounded"
//                   type="number"
//                   min="0"
//                   value={data.empbasicSalary}
//                   name="empbasicSalary"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                   // disabled
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">HRA:</label>
//                 <input
//                   className="input-style p-1 bg-red-100 rounded"
//                   type="number"
//                   min="0"
//                   value={data.emphra}
//                   name="emphra"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                   // disabled
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">DA:</label>
//                 <input
//                   className="input-style p-1 bg-red-100 rounded"
//                   type="number"
//                   min="0"
//                   value={data.empca}
//                   name="empca"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                   // disabled
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">Medical Allowance:</label>
//                 <input
//                   className="input-style p-1 bg-red-100 rounded"
//                   type="number"
//                   min="0"
//                   value={data.empmedical}
//                   name="empmedical"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                   // disabled
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">Tiffin/DAS Allowance:</label>
//                 <input
//                   className="input-style p-1 bg-red-100 rounded"
//                   type="number"
//                   min="0"
//                   value={data.emptiffin}
//                   name="emptiffin"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                   // disabled
//                 />
//                 {/* <span className="text-xs text-red-700">DISABLED</span> */}
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">Kit Allowance:</label>
//                 <input
//                   className="input-style p-1 bg-red-100 rounded"
//                   type="number"
//                   min="0"
//                   value={data.kit}
//                   name="kit"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                   // disabled
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">Additional Allowance:</label>
//                 <input
//                   className="input-style p-1 bg-red-100 rounded"
//                   type="number"
//                   min="0"
//                   value={data.additional}
//                   name="additional"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                   // disabled
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">Company PF:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.monthsalary > 21000 ? 0 : data.empcompanyPf}
//                   name="empcompanyPf"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                   disabled={data.monthsalary > 21000}
//                 />
//                 {data.monthsalary > 21000 && (
//                   <span className="text-xs text-red-700">Not applicable if salary {">"} ₹21,000</span>
//                 )}
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">Final Salary Amount:</label>
//                 <input
//                   className="input-style p-1 bg-blue-100 rounded"
//                   type="number"
//                   min="0"
//                   value={data.finalAmountSalary}
//                   name="finalAmountSalary"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                   // disabled
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/3">
//                 <label className="text-base mx-1">Salary in Words:</label>
//                 <input
//                   className="input-style p-1 bg-blue-100 rounded"
//                   type="text"
//                   value={data.inWords}
//                   name="inWords"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                   // disabled
//                 />
//               </div>
//             </div>
//             <div className="w-full col-span-4 my-4 text-white border-b border border-blue-500 bg-blue-700">
//               Employee Contribution/Deduction
//             </div>
//             <div className="flex flex-wrap justify-between">
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">PF:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.emppf}
//                   name="emppf"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">Loan EMI:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.emploanemi}
//                   name="emploanemi"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">TDS:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.otherDeduction}
//                   name="otherDeduction"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1 font-semibold text-red-700">
//                   All Deduction Amount:
//                 </label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.finalDeduction}
//                   name="finalDeduction"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                   // disabled
//                 />
//               </div>
//             </div>
//             <div className="w-full col-span-4 my-4 text-white border-b border border-blue-500 bg-blue-700">
//               Other Expenses
//             </div>
//             <div className="flex flex-wrap justify-between">
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">Fuel Expenses:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.fuelExpense}
//                   name="fuelExpense"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                 />
//               </div>
//               <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                 <label className="text-base mx-1">Other Expenses:</label>
//                 <input
//                   className="input-style p-1 rounded"
//                   type="number"
//                   min="0"
//                   value={data.otherExpense}
//                   name="otherExpense"
//                   onChange={handleInputChange}
//                   placeholder="₹ 0"
//                 />
//               </div>
//             </div>
//             <div className="w-full my-10 p-2 text-center">
//               <button
//                 className="text-white bg-gradient-to-r leading-4 tracking-wider font-semibold from-green-600 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-green-700 dark:focus:ring-green-800 rounded shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 text-sm px-5 py-2.5 text-center"
//                 onClick={updateGenSalaryAPI}
//                 type="button"
//               >
//                 {loading ? "Submitting..." : "Submit"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UpdateGenSalary;

































//previous code

// /* eslint-disable react/prop-types */
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// // import { format } from 'date-fns';
// import VITE_DATA from "../../config/config.jsx";

// function UpdateGenSalary({ genSalaries, onUpdate, onClose }) {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState({
//     empName: "",
//     presentDays: "",
//     totalHalfDays: "",
//     totalAbsent: "",
//     genSalary: "",
//     sundays: "",
//     monthsalary: "",
//     genMonths: "",
//     monthleave: "",
//     totalDays: "",
//     incentive: "",
//     totalAmount: "",
//     totalMonthDays: "",
//   });

//   useEffect(() => {
//     setData(genSalaries);
//   }, [genSalaries]);

//   // useEffect(() => {
//   //   const handleSalary = () => {
//   //     const presentSalary = (data.monthsalary / 30.5) * data.presentDays;
//   //     const halfSalary = (data.monthsalary / 30.5) * 0.5 * data.totalHalfDays;
//   //     const salary = parseFloat(presentSalary) + parseFloat(halfSalary);
//   //     setData((prevData) => ({
//   //       ...prevData,
//   //       genSalary: parseFloat(salary.toFixed(2)),
//   //     }));
//   //   };
//   //   handleSalary();
//   // }, [
//   //   data.monthsalary,
//   //   data.presentDays,
//   //   data.totalHalfDays,
//   //   data.totalAbsent,
//   //   data.sundays,
//   // ]);

  
//   useEffect(() => {
//     const handleSalary = () => {
//       const workingDays = 30.5 - data.sundays; // Exclude Sundays from total days
//       const dailySalary = data.monthsalary / workingDays;
//       const presentSalary = dailySalary * data.presentDays;
//       const halfSalary = dailySalary * 0.5 * data.totalHalfDays;

//       const salary = parseFloat(presentSalary) + parseFloat(halfSalary);

//       setData((prevData) => ({
//         ...prevData,
//         genSalary: parseFloat(salary.toFixed(2)),
//       }));
//     };

//     handleSalary();
//   }, [
//     data.monthsalary,
//     data.presentDays,
//     data.totalHalfDays,
//     data.sundays,
//   ]);


//   // useEffect(() => {
//   //   const handleIncentive = () => {
//   //     const genSalaryValue = parseFloat(data.genSalary) || 0;
//   //     const incentiveValue = parseFloat(data.incentive) || 0;
//   //     const esiValue = parseFloat(data.empesi) || 0;
//   //     const arrearValue = parseFloat(data.arrear) || 0;
//   //     const fuelValue = parseFloat(data.fuelExpense) || 0;
//   //     const otherValue = parseFloat(data.otherExpense) || 0;
//   //     const empLoanValue = parseFloat(data.emploanemi) || 0;
//   //     const totalAmount = parseFloat(
//   //       genSalaryValue +
//   //         incentiveValue +
//   //         esiValue +
//   //         arrearValue +
//   //         fuelValue +
//   //         otherValue -
//   //         empLoanValue
//   //     );
//   //     setData((prevData) => ({
//   //       ...prevData,
//   //       totalAmount: totalAmount.toFixed(2),
//   //     }));
//   //   };
//   //   handleIncentive();
//   // }, [
//   //   data.genSalary,
//   //   data.incentive,
//   //   data.empesi,
//   //   data.arrear,
//   //   data.fuelExpense,
//   //   data.otherExpense,
//   //   data.emploanemi,
//   //   data.sundays,
//   // ]);

//   // const handleInputChange = (e) => {
//   //     const { name, value } = e.target;
//   //     setData((prevData) => ({
//   //         ...prevData,
//   //         [name]: value,
//   //     }));
//   // };
//   useEffect(() => {
//     const handleIncentive = () => {
//       const genSalaryValue = parseFloat(data.genSalary) || 0;
//       const incentiveValue = parseFloat(data.incentive) || 0;
//       const esiValue = parseFloat(data.empesi) || 0;
//       const arrearValue = parseFloat(data.arrear) || 0;
//       const fuelValue = parseFloat(data.fuelExpense) || 0;
//       const otherValue = parseFloat(data.otherExpense) || 0;
//       const empLoanValue = parseFloat(data.emploanemi) || 0;

//       const totalAmount =
//         genSalaryValue +
//         incentiveValue +
//         esiValue +
//         arrearValue +
//         fuelValue +
//         otherValue -
//         empLoanValue;

//       setData((prevData) => ({
//         ...prevData,
//         totalAmount: totalAmount.toFixed(2),
//       }));
//     };

//     handleIncentive();
//   }, [
//     data.genSalary,
//     data.incentive,
//     data.empesi,
//     data.arrear,
//     data.fuelExpense,
//     data.otherExpense,
//     data.emploanemi,
//   ]);
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setData((prevData) => {
//       if (name === "totalAbsent") {
//         const adjustedPresentDays = prevData.totalDays - value;
//         return {
//           ...prevData,
//           presentDays: adjustedPresentDays,
//           [name]: value,
//         };
//       } else if (name === "presentDays") {
//         const adjustedAbsentDays = prevData.totalDays - value;
//         return {
//           ...prevData,
//           totalAbsent: adjustedAbsentDays,
//           [name]: value,
//         };
//       } else if (name === "sundays") {
//         const adjustedSundayDays = prevData.sundays - value;
//         return {
//           ...prevData,
//           sundays: adjustedSundayDays,
//           [name]: value,
//         };
//       } else {
//         return {
//           ...prevData,
//           [name]: value,
//         };
//       }
//     });
//   };

//   const updateGenSalaryAPI = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.put(
//         `${VITE_DATA}/api/salaries/${genSalaries._id}`,
//         data
//       );
//       toast.success(`${response.data.status}`);
//       onClose();
//       onUpdate();
//     } catch (error) {
//       toast.error(`${error}`);
//       console.error("Error updating Generated Salary:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const renderMonths = () => {
//   //     const currentYear = new Date().getFullYear();
//   //     const months = [];
//   //     for (let m = 0; m < 12; m++) {
//   //         const monthValue = `${String(m + 1).padStart(2, '0')}/${currentYear}`;
//   //         const date = new Date(currentYear, m, 1);
//   //         const monthName = format(date, 'MMMM');
//   //         months.push(<option key={monthValue} value={monthValue}>{monthName}</option>);
//   //     }
//   //     return months;
//   // };

//   return (
//     <>
//       <div
//         id="static-modal"
//         data-modal-backdrop="static"
//         tabIndex="-1"
//         aria-hidden="true"
//         className="fixed top-0 right-0 left-0 bottom-0 inset-0 z-50 overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
//       >
//         <div className="relative p-4 w-full max-w-7xl max-h-5xl mx-auto mt-40">
//           <div className="relative bg-gradient-to-r from-blue-700 to-blue-700 rounded-lg shadow">
//             <div className="flex items-center justify-between p-2 md:p-3 rounded-lg dark:border-gray-600">
//               <h3 className="text-xl font-semibold text-gray-50">
//                 Update Generated Salary
//               </h3>
//               <button
//                 onClick={onClose}
//                 type="button"
//                 className="bg-transparent hover:bg-red-100 text-slate-100 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
//               >
//                 <img
//                   src="/close.png"
//                   height={5}
//                   width={25}
//                   alt="close"
//                   className="hover:bg-red-100 rounded-full"
//                 />
//               </button>
//             </div>
//             <section className="p-2 scroll-smooth hs-scroll-inside-viewport-modal rounded-lg max-h-auto text-justify overflow-y-auto bg-blue-700">
//               <div className="flex flex-wrap rounded justify-start gap-5 bg-slate-200  pt-5 font-semibold">
//                 <label className="flex flex-col text-base mx-1 ">
//                   Employee Name
//                   <input
//                     type="text"
//                     className="input-style bg-red-100 rounded text-base"
//                     value={data.empName}
//                     name="empName"
//                     onChange={handleInputChange}
//                   />
//                 </label>
//                 <label className="flex flex-col text-base mx-1">
//                   Working Days
//                   <input
//                     className="input-style bg-red-100 rounded"
//                     type="number"
//                     min="0"
//                     value={data.totalDays}
//                     name="totalDays"
//                     disabled
//                   />
//                 </label>

//                 <label className="flex flex-col text-base mx-1">
//                   Present Days
//                   <input
//                     className="input-style rounded"
//                     type="number"
//                     min="0"
//                     value={data.presentDays}
//                     onChange={handleInputChange}
//                     name="presentDays"
//                   />
//                 </label>

//                 <label className="flex flex-col text-base mx-1">
//                   Half Days
//                   <input
//                     className="input-style rounded"
//                     type="number"
//                     min="0"
//                     value={data.totalHalfDays}
//                     onChange={handleInputChange}
//                     name="totalHalfDays"
//                   />
//                 </label>
//                 <label className="flex flex-col text-base mx-1">
//                   Sundays
//                   <input
//                     className="input-style rounded"
//                     type="number"
//                     min="0"
//                     value={data.sundays}
//                     onChange={handleInputChange}
//                     name="sundays"
//                   />
//                 </label>

//                 <label className="flex flex-col text-base mx-1">
//                   Absent Days
//                   <input
//                     className="input-style rounded"
//                     type="number"
//                     min="0"
//                     value={data.totalAbsent}
//                     onChange={handleInputChange}
//                     name="totalAbsent"
//                   />
//                 </label>

//                 <label className="flex flex-col text-base mx-1">
//                   Salary
//                   <input
//                     className="input-style bg-red-100 rounded"
//                     type="number"
//                     min="0"
//                     value={data.genSalary}
//                     name="genSalary"
//                     disabled
//                   />
//                 </label>
//                 {/* <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//                   <label className="text-base mx-1">ESI</label>
//                   <input
//                     className="input-style rounded"
//                     type="number"
//                     min="0"
//                     value={data.empesi}
//                     onChange={handleInputChange}
//                     name="empesi"
//                     placeholder="₹"
//                   />
//                 </div> */}

//                 <label className="flex flex-col text-base mx-1">
//                   Arrear
//                   <input
//                     className="input-style rounded"
//                     type="number"
//                     min="0"
//                     value={data.arrear}
//                     onChange={handleInputChange}
//                     name="arrear"
//                     placeholder="₹"
//                   />
//                 </label>

//                 <label className="flex flex-col text-base mx-1">
//                   Incentive
//                   <input
//                     className="input-style rounded"
//                     type="number"
//                     min="0"
//                     value={data.incentive}
//                     onChange={handleInputChange}
//                     name="incentive"
//                     placeholder="₹"
//                   />
//                 </label>

//                 <label className="flex flex-col text-base mx-1">
//                   Fuel Expense&apos;s
//                   <input
//                     className="input-style rounded"
//                     type="number"
//                     min="0"
//                     value={data.fuelExpense}
//                     onChange={handleInputChange}
//                     name="fuelExpense"
//                     placeholder="₹"
//                   />
//                 </label>

//                 <label className="flex flex-col text-base mx-1">
//                   Other Expense&apos;s
//                   <input
//                     className="input-style rounded"
//                     type="number"
//                     min="0"
//                     value={data.otherExpense}
//                     onChange={handleInputChange}
//                     name="otherExpense"
//                     placeholder="₹"
//                   />
//                 </label>

//                 <label className="flex flex-col text-base mx-1">
//                   Loan EMI
//                   <input
//                     className="input-style rounded"
//                     type="number"
//                     min="0"
//                     value={data.emploanemi}
//                     onChange={handleInputChange}
//                     name="emploanemi"
//                     placeholder="₹"
//                   />
//                 </label>

//                 <label className="flex flex-col text-base mx-1">
//                   Total Amount
//                   <input
//                     className="input-style bg-red-100 rounded"
//                     type="number"
//                     min="0"
//                     value={data.totalAmount}
//                     name="totalAmount"
//                     disabled
//                   />
//                 </label>

//                 <div className="w-full p-1 mt-4 justify-center flex">
//                   <button
//                     className="text-white bg-gradient-to-r from-green-600 via-green-600 to-green-600 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded text-sm px-3 py-2 text-center mb-2"
//                     onClick={updateGenSalaryAPI}
//                     type="button"
//                   >
//                     {loading ? "Submitting..." : "Submit"}
//                   </button>
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default UpdateGenSalary;
