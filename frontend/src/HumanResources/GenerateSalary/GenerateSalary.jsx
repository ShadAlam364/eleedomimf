/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ToWords } from "to-words";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDaysInMonth,
} from "date-fns";
import VITE_DATA from "../../config/config.jsx";

function GenerateSalary() {
  const [empList, setEmployeeList] = useState([]);
  const [arrear, setArrear] = useState(0);
  const [year, setYear] = useState("");
  const [empName, setEmpname] = useState("");
  const [total, setTotal] = useState(0);
  const [empId, setEmpId] = useState("");
  const [empUniqueId, setempUniqueId] = useState("");
  const [designation, setDesignation] = useState("");
  const [branchName, setBranchName] = useState("");
  const [accNo, setAccNo] = useState("");
  const [months, setMonths] = useState("");
  const [presentDay, setPresentDay] = useState(0);
  const [halfDay, setHalfDay] = useState(0);
  const [salaries, setSalaries] = useState(0);
  const [monthSalary, setMonthSalary] = useState(0);
  const [monthLeave, setMonthLeave] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [incentive, setIncentive] = useState(0);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [empGrossSalary, setGrossEmpSalary] = useState(0);
  const [empBasicSalary, setBasicEmpSalary] = useState(0);
  const [empHra, setEmpHra] = useState(0);
  const [empCa, setEmpCa] = useState(0);
  const [empMedical, setEmpMedical] = useState(0);
  const [empTiffin, setEmpTiffin] = useState(0);
  const [empCompanyPf, setEmpCompanyPf] = useState(0);
  const [empPf, setEmpPf] = useState(0);
  const [empEsi, setEmpESI] = useState(0);
  const [empLoanemi, setEmpLoanemi] = useState(0);
  const [totalAbsentDays, setTotalAbsentDays] = useState(0);
  const [sundays, setSundays] = useState(0);
  const [email, setEmail] = useState("");
  const [kit, setKit] = useState(0);
  const [additional, setAdditional] = useState(0);
  const [mobile, setMobile] = useState("");
  const [holidayCount, setHolidayCount] = useState(0);
  const [otherDeduction, setOtherDeduction] = useState(0);
  const [holidayData, setHolidayData] = useState([]);
  const [finalAmountSalary, setFinalAmountSalary] = useState(0);
  const [finalDeduction, setFinalDeduction] = useState(0);
  const [otherExpense, setOtherExpense] = useState(0);
  const [fuelExpense, setFuelExpense] = useState(0);
  const [bankNamed, setBankName] = useState("");
  const [salDate, setSalDate] = useState("");
  const [dateInput, setDateInput] = useState("");

  useEffect(() => {
    // Fetch the list of employees when the component mounts
    axios.get(`${VITE_DATA}/api/employee-list`).then((response) => {
      setEmployeeList(response.data);
    });
    // Fetch the list of holidays
    axios.get(`${VITE_DATA}/holidays/alllists`).then((response) => {
      setHolidayData(response.data);
    });
  }, []);

  // Function to format a Date object to dd/mm/yyyy
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleYearChange = (e) => {
    const selectedYear = parseInt(e.target.value);
    setYear(selectedYear);
  };

  const handleMonthChange = (e) => {
    const selectedMonth = parseInt(e.target.value);
    setMonths(selectedMonth);
  };

  useEffect(() => {
    // Calculate total days in the selected month
    setTotal(getDaysInMonth(new Date(year, months - 1)));
    // Update employee details for the selected month and year
    if (empName) {
      const selectedEmp = empList.find((emp) => emp.empname === empName);
      filterEmployeeDetailsByMonthAndYear(selectedEmp, year, months);
    }
  }, [year, months, empName, empList]);

  const handleEmployeeChange = (selectedEmployee) => {
    const selectedEmp = empList.find(
      (emp) => emp?.empname === selectedEmployee
    );
    setEmpname(selectedEmployee);
    setEmpId(selectedEmp.empid);
    setempUniqueId(selectedEmp._id);
    setDesignation(selectedEmp.staffType);
    setBranchName(selectedEmp.empbranch);
    setAccNo(selectedEmp.accNumber);
    setEmail(selectedEmp.empemail);
    setMobile(selectedEmp.empmobile);
    setBankName(selectedEmp.bankName);
    setMonthLeave(selectedEmp ? selectedEmp.leavemonth : 0);
    setMonthSalary(selectedEmp ? selectedEmp.salary : 0);
    filterEmployeeDetailsByMonthAndYear(selectedEmp, year, months);
  };

  const filterEmployeeDetailsByMonthAndYear = (

     employee,
    selectedYear,
    selectedMonth
  ) => {
    if (!employee) return;
    const startDate = startOfMonth(new Date(selectedYear, selectedMonth - 1));
    const endDate = endOfMonth(new Date(selectedYear, selectedMonth - 1));
    const daysOfMonth = eachDayOfInterval({ start: startDate, end: endDate });
    const formattedDays = daysOfMonth.map((day) => day.getDay());

    // const filteredDetails = employee.employeeDetails.filter((detail) => {
    //   // eslint-disable-next-line no-unused-vars
    //   const [day, month, year] = detail.date.split("/").map(Number);
    //   return year === selectedYear && month === selectedMonth;
    // });
    const filteredDetails = employee.employeeDetails.filter((detail) => {
      if (!detail.date) {
        console.log("Invalid date:", detail);
        return false;
      }
      const [day, month, year] = detail.date.split("/").map(Number);
      return year === selectedYear && month === selectedMonth;
    });

    // Calculate total present, absent, and half days
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

    //  holiday and working days counts

    daysOfMonth.map((date, dateIndex) => {
      // Convert date to dd/mm/yyyy format
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

    // console.log(
    //   "Working Days:(workingDaysCount + holiDayCount) = " +
    //     workday +
    //     " sunday: " +
    //     sundayCount +
    //     " P-days: " +
    //     totalPresentDays +
    //     " Holidays: " +
    //     holiDayCount
    // );

    setPresentDay(totalPresentDays);
    setTotal(formattedDays.length);
    setTotalDays(workday);
    setTotalAbsentDays(totalAbsentDays);
    setHalfDay(totalHalfDays);
    setSundays(sundayCount);
    setHolidayCount(holiDayCount);
  };






  //   employee,
  //   selectedYear,
  //   selectedMonth
  // ) => {
  //   if (!employee) return;
  //   const startDate = startOfMonth(new Date(selectedYear, selectedMonth - 1));
  //   const endDate = endOfMonth(new Date(selectedYear, selectedMonth - 1));
  //   const daysOfMonth = eachDayOfInterval({ start: startDate, end: endDate });

  //   const filteredDetails = employee.employeeDetails.filter((detail) => {
  //     if (!detail.date) {
  //       console.log("Invalid date:", detail);
  //       return false;
  //     }
  //     const [day, month, year] = detail.date.split("/").map(Number);
  //     return year === selectedYear && month === selectedMonth;
  //   });

  //   // Calculate total absent days and holidays
  //   let totalAbsentDays = 0;
  //   let holiDayCount = 0;

  //   filteredDetails.forEach((detail) => {
  //     if (detail?.status === "absent") {
  //       totalAbsentDays++;
  //     }
  //   });

    
  //   // Calculate holidays
  //   daysOfMonth.forEach((date) => {
  //     const formattedDate = formatDate(date);
  //     const holiday = holidayData.find(
  //       (holiday) => holiday.hdate === formattedDate
  //     );
  //     if (holiday) {
  //       holiDayCount++;
  //     }
  //   });

  //   setTotalAbsentDays(totalAbsentDays);
  //   setHolidayCount(holiDayCount);
  //   setTotal(getDaysInMonth(new Date(selectedYear, selectedMonth - 1)));
  // };

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
      const date = new Date(year, m - 1, 1);
      const monthName = format(date, "MMMM");
      months.push(
        <option key={m} value={m}>
          {monthName}
        </option>
      );
    }
    return months;
  };

  // HANDLE Gross-Salary
  useEffect(() => {
    setGrossEmpSalary(monthSalary);
  }, [monthSalary]);

  // Salary Calculation based on manual inputs
  useEffect(() => {
    const handleSalary = () => {
      const totalWorkingDays = parseFloat(totalDays) || 0;
      const presentDays = parseFloat(presentDay) || 0;
      const halfDays = parseFloat(halfDay) || 0;
      const sundayCount = parseFloat(sundays) || 0;
      const holidayCountValue = parseFloat(holidayCount) || 0;
      const monthLeavecount = parseFloat(monthLeave) || 0;

      if (totalWorkingDays === 0) {
        setSalaries(0);
        return;
      }

      let salary = (monthSalary / total) *
       (presentDays + sundayCount + holidayCountValue + monthLeavecount);
      const halfSalary = (monthSalary / total) * 0.5 * halfDays;
      salary = parseFloat(salary) + parseFloat(halfSalary);
      setSalaries(salary.toFixed(2));
    };
    handleSalary();
  }, [monthSalary, presentDay, halfDay, totalDays, holidayCount, total, monthLeave]);

  // Incentive
  useEffect(() => {
    const salariesValue = parseFloat(salaries) || 0;
    const incentiveValue = parseFloat(incentive) || 0;
    const incent = parseFloat(salariesValue + incentiveValue);
    setAmount(incent);
  }, [salaries, incentive]);

  // Basic Salary
  useEffect(() => {
    const basic = parseFloat(empGrossSalary) || 0;
    const final_basic = basic / 2;
    setBasicEmpSalary(final_basic);
  }, [empGrossSalary]);

  // HRA
  useEffect(() => {
    const calculateHra = parseFloat(empBasicSalary) || 0;
    const finalHra = (calculateHra * 50) / 100;
    setEmpHra(finalHra);
  }, [empGrossSalary ,empBasicSalary]);

  // CA
  useEffect(() => {
    const calculateCa = parseFloat(empBasicSalary) || 0;
    const finalCa = (calculateCa * 20) / 100;
    setEmpCa(finalCa);
  }, [empGrossSalary ,empBasicSalary]);

  // Medical
  useEffect(() => {
    const calculateMedical = parseFloat(empBasicSalary) || 0;
    const finalMedical = (calculateMedical * 10) / 100;
    setEmpMedical(finalMedical);
  }, [empGrossSalary , empBasicSalary]);

  // Tiffin
  useEffect(() => {
    const calculateTiffin = parseFloat(empBasicSalary) || 0;
    const finalTiffin = (calculateTiffin * 10) / 100;
    setEmpTiffin(finalTiffin);
  }, [ empGrossSalary, empBasicSalary]);

  // Kit
  useEffect(() => {
    const calculateKit = parseFloat(empBasicSalary) || 0;
    const finalKit = (calculateKit * 10) / 100;
    setKit(finalKit);
  }, [empGrossSalary , empBasicSalary]);

  // Additional
  // useEffect(() => {
  //   const calculateAdditional = parseFloat(empBasicSalary) || 0;
  //   const finalAdditional = (calculateAdditional * 5) / 100;
  //   setAdditional(finalAdditional);
  // }, [empGrossSalary]);

  // Final Salary Amount
  useEffect(() => {
    const salariesValue = parseFloat(salaries) || 0;
    const incentiveValue = parseFloat(incentive) || 0;
    const prevSalary = parseFloat(arrear) || 0;
    const fuelValue = parseFloat(fuelExpense) || 0;
    const otherValue = parseFloat(otherExpense) || 0;
    const incent = parseFloat(
      salariesValue + incentiveValue + prevSalary + fuelValue + otherValue
    ).toFixed(0);
    setFinalAmountSalary(incent);
  }, [salaries, incentive, arrear, fuelExpense, otherExpense]);

  // Deduction Amount
  useEffect(() => {
    const loanemis = parseFloat(empLoanemi) || 0;
    const emppf = parseFloat(empPf) || 0;
    const otherDeductionValue = parseFloat(otherDeduction) || 0;
    const deduct = parseFloat(loanemis + emppf + otherDeductionValue).toFixed(1);
    setFinalDeduction(deduct);
  }, [empLoanemi, empPf, otherDeduction]);

  // Company PF
  useEffect(() => {
    const calculatePf = parseFloat(empBasicSalary + empCa) || 0;
    const finalPf = (calculatePf * 12) / 100;
    setEmpCompanyPf(finalPf);
  }, [empBasicSalary, empCa]);

  // PF
  useEffect(() => {
    const calculatePf = parseFloat(empBasicSalary + empCa) || 0;
    const finalPf = (calculatePf * 12) / 100;
    setEmpPf(finalPf);
  }, [empBasicSalary, empCa]);

  // ESI
  // useEffect(() => {
  //   const calculateESI = parseFloat(empGrossSalary) || 0;
  //   const finalESI = (calculateESI * 0.75) / 100;
  //   setEmpESI(finalESI);
  // }, [empGrossSalary]);

  // Date Handling
  useEffect(() => {
    const currSalDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    setSalDate(currSalDate());
  }, []);

  const convertDateFormat = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (event) => {
    const input = event.target.value;
    if (input) {
      const formattedDate = convertDateFormat(input);
      setDateInput(formattedDate);
    } else {
      setDateInput("");
    }
    setSalDate(input);
  };

  let genSalary = months + "/" + year;
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

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (parseFloat(presentDay) + parseFloat(halfDay) + parseFloat(totalAbsentDays) > parseFloat(totalDays)) {
      toast.error("Present Days + Half Days + Absent Days cannot exceed Total Working Days!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${VITE_DATA}/dashboard/gensalary`, {
        empUniqueId,
        salDate: dateInput,
        empName,
        presentDays: presentDay,
        totalHalfDays: halfDay,
        sundays,
        email,
        mobile,
        holidayCount,
        totalAbsent: totalAbsentDays,
        genSalary: salaries,
        monthsalary: monthSalary,
        genMonths: genSalary,
        monthleave: monthLeave,
        totalMonthDays: total,
        totalDays,
        incentive,
        kit,
        additional,
        empgrossSalary: empGrossSalary,
        empbasicSalary: empBasicSalary,
        emphra: empHra,
        empca: empCa,
        empmedical: empMedical,
        emptiffin: empTiffin,
        empcompanyPf: empCompanyPf,
        emppf: empPf,
        empesi: empEsi,
        emploanemi: empLoanemi,
        totalAmount: amount,
        empid: empId,
        empdesignation: designation,
        empbranch: branchName,
        location: branchName,
        accNum: accNo,
        arrear,
        bankNamed,
        finalAmountSalary,
        otherDeduction,
        finalDeduction,
        fuelExpense,
        inWords: toWords.convert(finalAmountSalary || 0),
        otherExpense,
      });
      if (response.data) {
        toast.success("Added Successfully!");
        // Reset form
        setTotal(0);
        setSalDate("");
        setDateInput("");
        setempUniqueId("");
        setFuelExpense(0);
        setOtherExpense(0);
        setIncentive(0);
        setFinalDeduction(0);
        setTotalDays(0);
        setEmpname("");
        setMonths("");
        setYear("");
        setArrear(0);
        setPresentDay(0);
        setTotalAbsentDays(0);
        setHalfDay(0);
        setAccNo("");
        setBranchName("");
        setEmpId("");
        setDesignation("");
        setSalaries(0);
        setMonthSalary(0);
        setMonthLeave(0);
        setIncentive(0);
        setAmount(0);
        setGrossEmpSalary(0);
        setBasicEmpSalary(0);
        setEmpCa(0);
        setEmpHra(0);
        setEmpMedical(0);
        setEmpTiffin(0);
        setEmpCompanyPf(0);
        setEmpPf(0);
        setEmpESI(0);
        setEmpLoanemi(0);
        setFinalDeduction(0);
        setOtherDeduction(0);
        setSundays(0);
        setLoading(false);
        setHolidayCount(0);
      } else {
        toast.error("Error Occurred. Try again...!");
      }
    } catch (error) {
      console.error(error.response?.data?.status || error.message);
      toast.info(error.response?.data?.status || "An error occurred!");
      setLoading(false);
    }
  };

  return (
    <section className="container-fluid h-screen relative p-0 sm:ml-64 bg-white">
      <div className="container-fluid flex w-full lg:w-full px-2 flex-col justify-center border-gray-200 border-dashed rounded bg-white">
        <div className="relative mt-4 rounded-xl shadow-xl text-2xl items-center bg-slate-200">
          <h1 className="font-semibold text-3xl text-blue-700 py-4 mb-4">
            Generate Employee Salary
          </h1>
          <div className="flex flex-wrap justify-between">
            <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Salary Payment Date:</label>
              <input
                className="input-style p-1 rounded"
                type="date"
                value={salDate}
                onChange={handleDateChange}
                name="salDate"
              />
            </div>

            <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Employee Name</label>
              <select
                className="input-style text-base rounded p-1"
                value={empName}
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
                      {`${emp.empid}  -  ${emp.empname}`}
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
                value={monthSalary}
                name="monthSalary"
                placeholder="₹ 0"
                onChange={(e) => setMonthSalary(e.target.value)}
              />
            </div>

            <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Monthly Leave:</label>
              <input
                className="input-style p-1 bg-red-100 rounded"
                type="number"
                min="0"
                max="12"
                value={monthLeave}
                onChange={(e) => setMonthLeave(e.target.value)}
                name="monthLeave"
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
                disabled={!empName}
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

            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Total Days:</label>
              <input
                className="input-style p-1 bg-red-100 rounded"
                type="number"
                min="0"
                value={total}
                name="totalMonthDays"
                placeholder="0"
                disabled
              />
            </div>
            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Total Working Days:</label>
              <input
                className="input-style p-1 rounded"
                type="number"
                min="0"
                value={totalDays}
                name="totalDays"
                placeholder="0"
                onChange={(e) => setTotalDays(e.target.value)}
              />
            </div>
            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Present Days:</label>
              <input
                className="input-style p-1 rounded"
                type="number"
                min="0"
                value={presentDay}
                placeholder="0"
                name="presentDay"
                onChange={(e) => setPresentDay(e.target.value)}
              />
            </div>

            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Total Absent:</label>
              <input
                className="input-style p-1 bg-red-100 rounded"
                type="number"
                min="0"
                value={totalAbsentDays}
                placeholder="0"
                name="totalAbsent"
                onChange={(e) => setTotalAbsentDays(e.target.value)}
              />
            </div>

            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Total Half Days:</label>
              <input
                className="input-style p-1 rounded"
                type="number"
                min="0"
                value={halfDay}
                onChange={(e) => setHalfDay(e.target.value)}
                name="totalHalfDays"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Sundays:</label>
              <input
                className="input-style p-1 rounded"
                type="number"
                min="0"
                value={sundays}
                onChange={(e) => setSundays(e.target.value)}
                name="sundays"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Holidays:</label>
              <input
                className="input-style p-1 bg-red-100 rounded"
                type="number"
                min="0"
                value={holidayCount}
                onChange={(e) => setHolidayCount(e.target.value)}
                name="holidayCount"
                placeholder="0"
                // disabled
              />
            </div>
            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Salary:</label>
              <input
                className="input-style p-1 bg-red-100 rounded"
                type="number"
                min="0"
                value={salaries}
                name="genSalary"
                placeholder="₹ 0"
                disabled
              />
            </div>
            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Incentive:</label>
              <input
                className="input-style p-1 rounded"
                type="number"
                min="0"
                value={incentive}
                onChange={(e) => setIncentive(e.target.value)}
                name="incentive"
                placeholder="₹ 0"
              />
            </div>

            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Total Amount:</label>
              <input
                className="input-style p-1 bg-red-100 rounded"
                type="number"
                min="0"
                value={amount}
                name="totalAmount"
                placeholder="₹ 0"
                disabled
              />
            </div>

            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Arrear:</label>
              <input
                className="input-style p-1 rounded"
                type="number"
                min="0"
                value={arrear}
                onChange={(e) => setArrear(e.target.value)}
                name="arrear"
                placeholder="₹ 0"
              />
            </div>
            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Bank Name:</label>
              <input
                className="input-style bg-red-100 p-1 rounded"
                type="text"
                value={bankNamed}
                name="bankedName"
                placeholder="Bank Name"
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
              <label className="text-base mx-1">Account No:</label>
              <input
                className="input-style bg-red-100 p-1 rounded"
                type="text"
                value={accNo}
                name="accNo"
                placeholder="Please Added by Emp"
                onChange={(e) => setAccNo(e.target.value)}
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
                name="empGrossSalary"
                value={empGrossSalary}
                placeholder="₹ 0"
                disabled
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">Basic Salary:</label>
              <input
                className="input-style p-1 bg-red-100 rounded"
                type="number"
                name="empbasicSalary"
                value={empBasicSalary}
                onChange={(e) => setBasicEmpSalary(e.target.value)}
                placeholder="Basic Salary"
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">HRA:</label>
              <input
                className="input-style p-1 bg-red-100 rounded"
                type="number"
                name="empHra"
                value={empHra}
                onChange={(e) => setEmpHra(e.target.value)}
                placeholder="₹ 0"
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">DA:</label>
              <input
                className="input-style p-1 bg-red-100 rounded"
                type="number"
                name="empCa"
                value={empCa}
                onChange={(e) => setEmpCa(e.target.value)}
                placeholder="DA"
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">Medical Allowance:</label>
              <input
                className="input-style bg-red-100 p-1 rounded"
                type="number"
                name="empMedical"
                value={empMedical}
                onChange={(e) => setEmpMedical(e.target.value)}
                placeholder="Medical Allowance"
              />
            </div>
            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">Tiffin/DAS Allowance:</label>
              <input
                className="input-style bg-red-100 p-1 rounded"
                type="number"
                name="empTiffin"
                value={empTiffin}
                onChange={(e) => setEmpTiffin(e.target.value)}
                placeholder="Tiffin Allowance"
              />
            </div>
            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">Kit Allowance:</label>
              <input
                className="input-style bg-red-100 p-1 rounded"
                type="number"
                name="kit"
                value={kit}
                onChange={(e) => setKit(e.target.value)}
                placeholder="Kit Allowance"
              />
            </div>
            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">Additional Allowance:</label>
              <input
                className="input-style bg-red-100 p-1 rounded"
                type="number"
                name="additional"
                value={additional}
                onChange={(e) => setAdditional(e.target.value)}
                placeholder="Additional Allowance"
              />
            </div>
            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">Company PF:</label>
              <input
                className="input-style p-1 bg-red-100 rounded"
                type="number"
                name="empCompanyPf"
                value={monthSalary > 21000 ? 0 : empCompanyPf}
                onChange={(e) => setEmpCompanyPf(e.target.value)}
                placeholder="PF"
                disabled={monthSalary > 21000}
              />
              {monthSalary > 21000 && (
                <span className="text-xs text-red-700">Not applicable if salary {">"} ₹21,000</span>
              )}
            </div>
            <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">Final Salary Amount:</label>
              <input
                className="input-style bg-blue-100 p-1 rounded"
                type="number"
                name="finalAmountSalary"
                value={finalAmountSalary}
                onChange={(e) => setFinalAmountSalary(e.target.value)}
                placeholder="₹ 0"
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/3">
              <label className="text-base mx-1">Salary in Words:</label>
              <input
                className="input-style bg-blue-100 p-1 rounded"
                type="text"
                value={toWords.convert(finalAmountSalary || 0)}
                placeholder="₹ 0"
                disabled
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/5"></div>
            <div className="w-full col-span-4 my-4 text-white border-b border border-blue-500 bg-blue-700">
              Employee Contribution/Deduction
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">PF:</label>
              <input
                className="input-style bg-red-100 p-1 rounded"
                type="number"
                name="empPf"
                value={empPf}
                onChange={(e) => setEmpPf(e.target.value)}
                placeholder="PF"
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">Loan EMI:</label>
              <input
                className="input-style p-1 rounded"
                type="number"
                name="empLoanemi"
                value={empLoanemi}
                placeholder="₹ 0"
                onChange={(e) => setEmpLoanemi(e.target.value)}
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">ESI:</label>
              <input
                className="input-style bg-red-100 p-1 rounded"
                type="number"
                name="empEsi"
                value={empEsi}
                onChange={(e) => setEmpESI(e.target.value)}
                placeholder="₹ 0"
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">TDS:</label>
              <input
                className="input-style p-1 rounded"
                type="number"
                name="otherDeduction"
                value={otherDeduction}
                onChange={(e) => setOtherDeduction(e.target.value)}
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
                name="finalDeduction"
                value={finalDeduction}
                onChange={(e) => setFinalDeduction(e.target.value)}
                placeholder="₹ 0"
              />
            </div>
            <div className="w-full col-span-4 my-4 text-white border-b border border-blue-500 bg-blue-700">
              Other Expenses
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">Fuel Expenses:</label>
              <input
                className="input-style p-1 rounded"
                type="number"
                name="fuelExpense"
                value={fuelExpense}
                onChange={(e) => setFuelExpense(e.target.value)}
                placeholder="₹ 0"
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
              <label className="text-base mx-1">Other Expenses:</label>
              <input
                className="input-style p-1 rounded"
                type="number"
                name="otherExpense"
                value={otherExpense}
                onChange={(e) => setOtherExpense(e.target.value)}
                placeholder="₹ 0"
              />
            </div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/5"></div>
            <div className="flex flex-col p-2 text-start w-full lg:w-1/5"></div>
            <div className="w-full my-10 p-2 text-center">
              <button
                className="text-white bg-gradient-to-r leading-4 tracking-wider font-semibold from-green-600 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-green-700 dark:focus:ring-green-800 rounded shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={handleSubmit}
                type="button"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GenerateSalary;























// // previous code 
// /* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { ToWords } from "to-words";
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   getDaysInMonth,
// } from "date-fns";
// import VITE_DATA from "../../config/config.jsx";
// function GenerateSalary() {
//   const [empList, setEmployeeList] = useState([]);
//   const [arrear, setArrear] = useState();
//   const [year, setYear] = useState("");
//   const [empName, setEmpname] = useState("");
//   const [total, setTotal] = useState(0);
//   const [empId, setEmpId] = useState("");
//   const [empUniqueId, setempUniqueId] = useState();
//   const [designation, setDesignation] = useState("");
//   const [branchName, setBranchName] = useState("");
//   const [accNo, setAccNo] = useState("");
//   const [months, setMonths] = useState("");
//   const [presentDay, setPresentDay] = useState(0);
//   const [halfDay, setHalfDay] = useState(0);
//   const [salaries, setSalaries] = useState("");
//   const [monthSalary, setMonthSalary] = useState(0);
//   const [monthLeave, setMonthLeave] = useState(0);
//   const [totalDays, setTotalDays] = useState("");
//   const [incentive, setIncentive] = useState();
//   const [amount, setAmount] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [empGrossSalary, setGrossEmpSalary] = useState("");
//   const [empBasicSalary, setBasicEmpSalary] = useState("");
//   const [empHra, setEmpHra] = useState("");
//   const [empCa, setEmpCa] = useState("");
//   const [empMedical, setEmpMedical] = useState("");
//   const [empTiffin, setEmpTiffin] = useState("");
//   const [empCompanyPf, setEmpCompanyPf] = useState("");
//   const [empPf, setEmpPf] = useState("");
//   const [empEsi, setEmpESI] = useState();
//   const [empLoanemi, setEmpLoanemi] = useState();
//   const [totalAbsentDays, setTotalAbsentDays] = useState(0);
//   const [sundays, setSundays] = useState(0);
//   const [email, setEmail] = useState("");
//   const [kit, setKit] = useState();
//   const [additional, setAdditional] = useState();
//   const [mobile, setMobile] = useState("");
//   const [holidayCount, setHolidayCount] = useState("");
//   const [otherDeduction, setOtherDeduction] = useState();
//   const [holidayData, setHolidayData] = useState([]);
//   const [finalAmountSalary, setFinalAmountSalary] = useState();
//   const [finalDeduction, setFinalDeduction] = useState();
//   const [otherExpense, setOtherExpense] = useState();
//   const [fuelExpense, setFuelExpense] = useState();
//   const [bankNamed, setBankName] = useState();
//   const [salDate, setSalDate] = useState("");
//   const [dateInput, setDateInput] = useState("");
//   // const [inWords, setInWords] = useState("");

//   useEffect(() => {
//     // Fetch the list of employees when the component mounts
//     axios.get(`${VITE_DATA}/api/employee-list`).then((response) => {
//       setEmployeeList(response.data);
//     });
//     // Fetch the list of holidays
//     axios.get(`${VITE_DATA}/holidays/alllists`).then((response) => {
//       setHolidayData(response.data);
//     });
//   }, []);

//   // Function to format a Date object to dd/mm/yyyy
//   function formatDate(date) {
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   }

//   const handleYearChange = (e) => {
//     const selectedYear = parseInt(e.target.value);
//     setYear(selectedYear);
//   };

//   const handleMonthChange = (e) => {
//     const selectedMonth = parseInt(e.target.value);
//     setMonths(selectedMonth);
//   };

//   useEffect(() => {
//     // Calculate total days in the selected month
//     setTotalDays(getDaysInMonth(new Date(year, months - 1)));
//     // Update employee details for the selected month and year
//     if (empName) {
//       const selectedEmp = empList.find((emp) => emp.empname === empName);
//       filterEmployeeDetailsByMonthAndYear(selectedEmp, year, months);
//     }
//   }, [year, months, empName, empList]);

//   const handleEmployeeChange = (selectedEmployee) => {
//     const selectedEmp = empList.find(
//       (emp) => emp?.empname === selectedEmployee
//     );
//     setEmpname(selectedEmployee);
//     setEmpId(selectedEmp.empid);
//     setempUniqueId(selectedEmp._id);
//     setDesignation(selectedEmp.staffType);
//     setBranchName(selectedEmp.empbranch);
//     setAccNo(selectedEmp.accNumber);
//     setEmail(selectedEmp.empemail);
//     setMobile(selectedEmp.empmobile);
//     setBankName(selectedEmp.bankName);
//     setMonthLeave(selectedEmp ? selectedEmp.leavemonth : "");
//     setMonthSalary(selectedEmp ? selectedEmp.salary : "");
//     filterEmployeeDetailsByMonthAndYear(selectedEmp, year, months);
//   };

//   const filterEmployeeDetailsByMonthAndYear = (
//     employee,
//     selectedYear,
//     selectedMonth
//   ) => {
//     if (!employee) return;
//     const startDate = startOfMonth(new Date(selectedYear, selectedMonth - 1));
//     const endDate = endOfMonth(new Date(selectedYear, selectedMonth - 1));
//     const daysOfMonth = eachDayOfInterval({ start: startDate, end: endDate });
//     const formattedDays = daysOfMonth.map((day) => day.getDay());

//     // const filteredDetails = employee.employeeDetails.filter((detail) => {
//     //   // eslint-disable-next-line no-unused-vars
//     //   const [day, month, year] = detail.date.split("/").map(Number);
//     //   return year === selectedYear && month === selectedMonth;
//     // });
//     const filteredDetails = employee.employeeDetails.filter((detail) => {
//       if (!detail.date) {
//         console.log("Invalid date:", detail);
//         return false;
//       }
//       const [day, month, year] = detail.date.split("/").map(Number);
//       return year === selectedYear && month === selectedMonth;
//     });

//     // Calculate total present, absent, and half days
//     let totalPresentDays = 0;
//     let totalAbsentDays = 0;
//     let totalHalfDays = 0;
//     let holiDayCount = 0;
//     let sundayCount = 0;
//     let workingDaysCount = 0;

//     filteredDetails.forEach((detail) => {
//       switch (detail?.status) {
//         case "present":
//           totalPresentDays++;
//           break;
//         case "absent":
//           totalAbsentDays++;
//           break;
//         case "halfday":
//           totalHalfDays++;
//           break;
//         default:
//           break;
//       }
//     });

//     //  holiday and working days counts

//     daysOfMonth.map((date, dateIndex) => {
//       // Convert date to dd/mm/yyyy format
//       const formattedDate = formatDate(date);
//       const holiday = holidayData.find(
//         (holiday) => holiday.hdate === formattedDate
//       );
//       const isHoliday = !!holiday;
//       if (isHoliday) {
//         holiDayCount++;
//       }
//       if (formattedDays[dateIndex] !== 0) {
//         workingDaysCount++;
//       } else if (formattedDays[dateIndex] === 0) {
//         sundayCount++;
//       }
//     });
//     const workday = workingDaysCount - holiDayCount;

//     // console.log(
//     //   "Working Days:(workingDaysCount + holiDayCount) = " +
//     //     workday +
//     //     " sunday: " +
//     //     sundayCount +
//     //     " P-days: " +
//     //     totalPresentDays +
//     //     " Holidays: " +
//     //     holiDayCount
//     // );

//     setPresentDay(totalPresentDays);
//     setTotal(formattedDays.length);
//     setTotalDays(workday);
//     setTotalAbsentDays(totalAbsentDays);
//     setHalfDay(totalHalfDays);
//     setSundays(sundayCount);
//     setHolidayCount(holiDayCount);
//   };

//   const renderYears = () => {
//     const currentYear = new Date().getFullYear();
//     const years = [];
//     for (let y = currentYear; y >= 2000; y--) {
//       years.push(
//         <option key={y} value={y}>
//           {y}
//         </option>
//       );
//     }
//     return years;
//   };

//   const renderMonths = () => {
//     const months = [];
//     for (let m = 1; m <= 12; m++) {
//       const date = new Date(year, m - 1, 1);
//       const monthName = format(date, "MMMM");
//       months.push(
//         <option key={m} value={m}>
//           {monthName}
//         </option>
//       );
//     }
//     return months;
//   };

//   // HANDLE Gross-Salary
//   useEffect(() => {
//     const handleGrossSalary = () => {
//       setGrossEmpSalary(monthSalary);
//     };
//     handleGrossSalary();
//   }, [monthSalary, presentDay]);

//   useEffect(() => {
//     const handleSalary = () => {
//       let salary =
//         (monthSalary / total) * (presentDay + sundays + holidayCount);
//       const halfSalary = (monthSalary / 30.5) * 0.5 * halfDay;
//       salary = parseFloat(salary) + parseFloat(halfSalary);
//       setSalaries(salary.toFixed(2));
//     };
//     handleSalary();
//   }, [monthSalary, presentDay, halfDay, sundays, total, holidayCount]);

//   // incentive
//   useEffect(() => {
//     const handleIncentive = () => {
//       const salariesValue = parseFloat(salaries) || 0;
//       const incentiveValue = parseFloat(incentive) || 0;
//       const incent = parseFloat(salariesValue + incentiveValue);
//       setAmount(incent);
//     };
//     handleIncentive(); // Call the function when the component mounts or when 'absent' state changes
//   }, [salaries, incentive]);

//   // handle basic salary
//   useEffect(() => {
//     const handleBasic = () => {
//       const basic = parseFloat(empGrossSalary) || 0;
//       const final_basic = basic / 2;
//       setBasicEmpSalary(final_basic);
//     };
//     handleBasic();
//   }, [empGrossSalary]);

//   // HANDLE HRA
//   useEffect(() => {
//     const handleHra = () => {
//       const calculateHra = parseFloat(empGrossSalary) || 0;
//       const finalHra = (calculateHra * 30) / 100;
//       setEmpHra(finalHra);
//     };
//     handleHra();
//   }, [empGrossSalary]);

//   // HANDLE CA
//   useEffect(() => {
//     const handleCa = () => {
//       const calculateCa = parseFloat(empGrossSalary) || 0;
//       const finalCa = (calculateCa * 5) / 100;
//       setEmpCa(finalCa);
//     };
//     handleCa();
//   }, [empGrossSalary]);

//   // Handle MEDICAL
//   useEffect(() => {
//     const handleMedical = () => {
//       const calculateMedical = parseFloat(empGrossSalary) || 0;
//       const finalMedical = (calculateMedical * 5) / 100;
//       setEmpMedical(finalMedical);
//     };
//     handleMedical();
//   }, [empGrossSalary]);

//   // HANDLE TIFFIN
//   // useEffect(() => {
//   //   const handleTiffin = () => {
//   //     const calculateTiffin = parseFloat(empGrossSalary) || 0;
//   //     const finalTiffin = (calculateTiffin * 5) / 100;
//   //     setEmpTiffin(finalTiffin);
//   //   }
//   //   handleTiffin();
//   // }, [empGrossSalary]);

//   // HANDLE kit
//   useEffect(() => {
//     const handleKit = () => {
//       const calculateKit = parseFloat(empGrossSalary) || 0;
//       const finalTiffin = (calculateKit * 5) / 100;
//       setKit(finalTiffin);
//     };
//     handleKit();
//   }, [empGrossSalary]);

//   // HANDLE kit
//   useEffect(() => {
//     const handleAdditional = () => {
//       const calculateAdditional = parseFloat(empGrossSalary) || 0;
//       const finalTiffin = (calculateAdditional * 5) / 100;
//       setAdditional(finalTiffin);
//     };
//     handleAdditional();
//   }, [empGrossSalary]);

//   // handleFinalSalaryAmount
//   useEffect(() => {
//     const handleFinalSalaryAmount = () => {
//       const salariesValue = parseFloat(salaries) || 0;
//       const incentiveValue = parseFloat(incentive) || 0;
//       const prevSalary = parseFloat(arrear) || 0;
//       const fuelValue = parseFloat(fuelExpense) || 0;
//       const otherValue = parseFloat(otherExpense) || 0;
//       const esi = parseFloat(empEsi) || 0;
//       // const hraValue = parseFloat(empHra) || 0;
//       // const daValue = parseFloat(empCa) || 0;
//       // const ma = parseFloat(empMedical) || 0;
//       // const tfinValue = parseFloat(empTiffin) || 0;
//       // const kitValue = parseFloat(kit) || 0;
//       // const adds = parseFloat(additional) || 0;
//       // const loanemis = parseFloat(empLoanemi) || 0;
//       // const emppf = parseFloat(empPf) || 0;
//       // const esi =  parseFloat(empEsi) || 0;
//       // const otherDeductionValue =  parseFloat(otherDeduction) || 0;
//       // const incent = parseFloat(
//       //   salariesValue +
//       //     incentiveValue +
//       //     prevSalary +
//       //     fuelValue +
//       //     otherValue +
//       //     esi
//       // ).toFixed(0);
//       const incent = parseFloat(salariesValue).toFixed(0);
//       setFinalAmountSalary(incent);
//     };
//     handleFinalSalaryAmount(); // Call the function when the component mounts or when 'absent' state changes
//   }, [salaries, incentive, arrear, fuelExpense, empEsi, otherExpense]);

//   useEffect(() => {
//     const handleDeductionAmount = () => {
//       const loanemis = parseFloat(empLoanemi) || 0;
//       const emppf = parseFloat(empPf) || 0;
//       const otherDeductionValue = parseFloat(otherDeduction) || 0;

//       const deduct = parseFloat(loanemis + emppf + otherDeductionValue).toFixed(
//         1
//       );
//       setFinalDeduction(deduct);
//     };
//     handleDeductionAmount();
//   }, [empLoanemi, empPf, otherDeduction, otherExpense]);

//   // HANDLE COMPANY
//   useEffect(() => {
//     const handleCompanyPf = () => {
//       const calculatePf = parseFloat(empGrossSalary) || 0;
//       const finalPf = (calculatePf * 12) / 100;
//       setEmpCompanyPf(finalPf);
//     };
//     handleCompanyPf();
//   }, [empGrossSalary]);

//   // Handle PF
//   useEffect(() => {
//     const handlePf = () => {
//       const calculatePf = parseFloat(empGrossSalary) || 0;
//       const finalPf = (calculatePf * 12) / 100;
//       setEmpPf(finalPf);
//     };
//     handlePf();
//   }, [empGrossSalary]);

//   // Handle ESI
//   // useEffect(() => {
//   //   const handleESI = () => {
//   //     const calculateESI = parseFloat(empGrossSalary) || 0;
//   //     const finalESI = (calculateESI * 0.75) / 100;
//   //     setEmpESI(finalESI);
//   //   }
//   //   handleESI();
//   // }, [empGrossSalary]);

//   // Handle Employee Loan EMI
//   // useEffect(() => {
//   //   const handleLoanEmi = () => {
//   //     const loanEmi = parseFloat(empGrossSalary) || 0;
//   //     const finalLoanEmi = (loanEmi * 2) / 100;
//   //     setEmpLoanemi(finalLoanEmi);
//   //   }
//   //   handleLoanEmi();
//   // }, [empGrossSalary]);

//   useEffect(() => {
//     const currSalDate = () => {
//       const date = new Date();
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const day = String(date.getDate()).padStart(2, "0");
//       return `${year}-${month}-${day}`;
//     };

//     setSalDate(currSalDate());
//   }, []);

//   // const handleDateChange = (event) => {
//   //   console.log(event.target.value);

//   //   setSalDate(event.target.value);
//   // };
//   const convertDateFormat = (dateStr) => {
//     const [year, month, day] = dateStr.split("-");
//     return `${day}-${month}-${year}`;
//   };

//   const handleDateChange = (event) => {
//     const input = event.target.value;
//     if (input) {
//       const formattedDate = convertDateFormat(input);
//       setDateInput(formattedDate);
//     } else {
//       setDateInput(""); // Clear the converted date if the format is invalid
//     }
//     setSalDate(input);
//   };

//   let genSalary = months + "/" + year;
//   const toWords = new ToWords({
//     localeCode: "en-IN",
//     converterOptions: {
//       currency: true,
//       ignoreDecimal: false,
//       ignoreZeroCurrency: false,
//       doNotAddOnly: false,
//       currencyOptions: {
//         // can be used to override defaults for the selected locale
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

//   // post data
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Proceed with the rest of the submission logic
//       const response = await axios.post(`${VITE_DATA}/dashboard/gensalary`, {
//         empUniqueId,
//         salDate: dateInput,
//         empName,
//         presentDays: presentDay,
//         totalHalfDays: halfDay,
//         sundays,
//         email,
//         mobile,
//         holidayCount,
//         totalAbsent: totalAbsentDays,
//         genSalary: salaries,
//         monthsalary: monthSalary,
//         genMonths: genSalary,
//         monthleave: monthLeave,
//         totalMonthDays: total,
//         totalDays: totalDays,
//         incentive,
//         kit,
//         additional,
//         empgrossSalary: empGrossSalary,
//         empbasicSalary: empBasicSalary,
//         emphra: empHra,
//         empca: empCa,
//         empmedical: empMedical,
//         emptiffin: empTiffin,
//         empcompanyPf: empCompanyPf,
//         emppf: empPf,
//         empesi: "",
//         emploanemi: empLoanemi,
//         totalAmount: amount,
//         empid: empId,
//         empdesignation: designation,
//         empbranch: branchName,
//         location: branchName,
//         accNum: accNo,
//         arrear,
//         bankNamed,
//         finalAmountSalary,
//         otherDeduction,
//         finalDeduction,
//         fuelExpense,
//         inWords: toWords.convert(finalAmountSalary || 0),
//         otherExpense,
//       });
//       if (response.data) {
//         toast.success("Added Successfully!");
//         // Reset the form and loading state on successful submission
//         setTotal("");
//         setSalDate("");
//         setDateInput("");
//         setempUniqueId("");
//         setFuelExpense("");
//         setOtherExpense("");
//         setIncentive("");
//         setFinalDeduction("");
//         setTotalDays("");
//         setEmpname("");
//         setMonths("");
//         setYear("");
//         setArrear("");
//         setPresentDay("");
//         setTotalAbsentDays("");
//         setHalfDay("");
//         setAccNo("");
//         setBranchName("");
//         setEmpId("");
//         setDesignation("");
//         setSalaries("");
//         setMonthSalary("");
//         setMonthLeave("");
//         setTotalDays("");
//         setIncentive("");
//         setAmount("");
//         setGrossEmpSalary("");
//         setBasicEmpSalary("");
//         setEmpCa("");
//         setEmpHra("");
//         setEmpMedical("");
//         setEmpTiffin("");
//         setEmpCompanyPf("");
//         setEmpPf("");
//         setEmpESI("");
//         setEmpLoanemi("");
//         setFinalDeduction("");

//         setOtherDeduction("");
//         setLoading(false);
//       } else {
//         toast.error("Error Occurred. Try again...!");
//       }
//     } catch (error) {
//       console.error(error.response.data.status);
//       toast.info(error.response.data.status);
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="container-fluid h-screen relative p-0 sm:ml-64 bg-white">
//       <div className="container-fluid flex w-full lg:w-full px-2   flex-col justify-center  border-gray-200 border-dashed rounded bg-white">
//         <div className="relative mt-4 rounded-xl shadow-xl text-2xl  items-center bg-slate-200">
//           <h1 className="font-semibold text-3xl text-blue-700 py-4 mb-4">
//             Generate Employee Salary
//           </h1>
//           <div className="flex flex-wrap justify-between">
//             <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Salary Payment Date:</label>
//               <input
//                 className="input-style p-1 rounded"
//                 type="date"
//                 value={salDate}
//                 onChange={handleDateChange}
//                 name="salDate"
//               />
//             </div>

//             <div className="flex flex-col   p-2 text-start w-full lg:w-1/6 ">
//               <label className="text-base mx-1">Employee Name</label>
//               <select
//                 className="input-style text-base rounded  p-1"
//                 value={empName}
//                 onChange={(e) => handleEmployeeChange(e.target.value)}
//                 name="empName"
//               >
//                 <option value="" className="text-base">
//                   ------ Select Employee --------
//                 </option>
//                 {empList
//                   .filter((employee) => employee.flags === true)
//                   .map((emp) => (
//                     <option
//                       key={emp.empid}
//                       value={emp.empname}
//                       className="text-base"
//                     >
//                       {`${emp.empid}  -  ${emp.empname}`}
//                     </option>
//                   ))}
//               </select>
//             </div>

//             <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Monthly Salary:</label>
//               <input
//                 className="input-style p-1 bg-red-100 rounded"
//                 type="number"
//                 min="0"
//                 value={monthSalary}
//                 name="monthSalary"
//                 placeholder="₹ 0"
//                 // disabled
//                 onChange={(e) => setMonthSalary(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Monthly Leave:</label>
//               <input
//                 className="input-style p-1 bg-red-100 rounded"
//                 type="number"
//                 min="0"
//                 max="12"
//                 value={monthLeave}
//                 onChange={(e) => setMonthLeave(e.target.value)}
//                 name="monthLeave"
//                 placeholder="0"
//                 // disabled
//               />
//             </div>
//             <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//               <label htmlFor="year" className="text-base mx-1">
//                 Year:
//               </label>
//               <select
//                 id="year"
//                 value={year}
//                 onChange={handleYearChange}
//                 className="input-style p-1 text-base rounded text-black"
//                 disabled={!empName}
//               >
//                 <option value="">--------- Select Year --------</option>
//                 {renderYears()}
//               </select>
//             </div>

//             <div className="flex flex-col p-2 text-start w-full lg:w-1/6">
//               <label htmlFor="month" className="text-base mx-1">
//                 Months:
//               </label>

//               <select
//                 className="input-style p-1 text-base rounded text-black"
//                 type="text"
//                 id="month"
//                 value={months}
//                 onChange={handleMonthChange}
//                 placeholder="0"
//                 name="genMonths"
//                 disabled={!year}
//               >
//                 <option value="">------ Select Month ----------</option>
//                 {renderMonths()}
//               </select>
//             </div>

//             <div className="flex flex-col p-2  mt-4 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Total Days:</label>
//               <input
//                 className="input-style p-1 bg-red-100 rounded"
//                 type="number"
//                 min="0"
//                 value={total}
//                 name="totalMonthDays"
//                 placeholder="0"
//                 // disabled
//               />
//             </div>
//             <div className="flex flex-col p-2  mt-4 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Total Working Days:</label>
//               <input
//                 className="input-style p-1 bg-red-100 rounded"
//                 type="number"
//                 min="0"
//                 value={totalDays}
//                 name="totalDays"
//                 placeholder="0"
//                 // disabled
//                 onChange={(e) => setTotalDays(e.target.value)}
//               />
//             </div>
//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Present Days:</label>
//               <input
//                 className="input-style bg-red-100 p-1 rounded"
//                 type="number"
//                 min="0"
//                 value={presentDay}
//                 placeholder="0"
//                 name="presentDay"
//                 onChange={(e) => setPresentDay(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Total Absent:</label>
//               <input
//                 className="input-style p-1 bg-red-100 rounded"
//                 type="number"
//                 min="0"
//                 value={totalAbsentDays}
//                 placeholder="0"
//                 name="totalAbsent"
//                 onChange={(e) => setTotalAbsentDays(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Total Half Days:</label>
//               <input
//                 className="input-style p-1 bg-red-100 rounded"
//                 type="number"
//                 min="0"
//                 value={halfDay}
//                 onChange={(e) => setHalfDay(e.target.value)}
//                 name="totalHalfDays"
//                 placeholder="0"
//                 // disabled
//               />
//             </div>
//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Holidays:</label>
//               <input
//                 className="input-style p-1 bg-red-100 rounded"
//                 type="number"
//                 min="0"
//                 value={holidayCount}
//                 onChange={(e) => setHolidayCount(e.target.value)}
//                 name="holidayCount"
//                 placeholder="0"
//                 // disabled
//               />
//             </div>
//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Salary:</label>
//               <input
//                 className="input-style p-1 bg-red-100 rounded"
//                 type="number"
//                 min="0"
//                 value={salaries}
//                 name="genSalary"
//                 placeholder="₹ 0"
//                 onChange={(e) => setSalaries(e.target.value)}
//               />


//             </div>
//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Incentive:</label>
//               <input
//                 className="input-style p-1 rounded"
//                 type="number"
//                 min="0"
//                 value={incentive}
//                 onChange={(e) => setIncentive(e.target.value)}
//                 name="incentive"
//                 placeholder="₹ 0"
//               />
//             </div>

//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Total Amount:</label>
//               <input
//                 className="input-style p-1 bg-red-100 rounded"
//                 type="number"
//                 min="0"
//                 value={amount}
//                 name="totalAmount"
//                 placeholder="₹ 0"
//                 onChange={(e) => setAmount(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Arrear:</label>
//               <input
//                 className="input-style p-1 rounded"
//                 type="number"
//                 min="0"
//                 value={arrear}
//                 onChange={(e) => setArrear(e.target.value)}
//                 name="arrear"
//                 placeholder="₹ 0"
//               />
//             </div>
//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Bank Name:</label>
//               <input
//                 className="input-style bg-red-100 p-1 rounded"
//                 type="text"
//                 min="0"
//                 value={bankNamed}
//                 name="bankedName"
//                 placeholder="Bank Name"
//                 onChange={(e) => setBankName(e.target.value)}
//               />
//             </div>
//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/6">
//               <label className="text-base mx-1">Account No:</label>
//               <input
//                 className="input-style bg-red-100 p-1 rounded"
//                 type="text"
//                 min="0"
//                 value={accNo}
//                 name="accNo"
//                 placeholder="Please Added by Emp"
//                 onChange={(e) => setAccNo(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="w-full col-span-4 mt-5 mb-4 text-white border-b border border-blue-700 bg-blue-700"></div>
//           <div className="flex flex-wrap justify-between">
//             {/* next part starts here */}
//             <div className="flex flex-col p-2  text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">Gross Salary:</label>
//               <input
//                 className="input-style p-1 bg-red-100 rounded"
//                 type="text"
//                 rows={2}
//                 name="empGrossSalary"
//                 value={empGrossSalary}
//                 placeholder="₹ 0"
//                 onChange={(e) => setGrossEmpSalary(e.target.value)}
//               />
//             </div>
//             <div className="flex flex-col p-2  text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">Basic Salary:</label>
//               <input
//                 className="input-style p-1 bg-red-100 rounded"
//                 type="text"
//                 rows={2}
//                 name="empbasicSalary"
//                 value={empBasicSalary}
//                 onChange={(e) => setBasicEmpSalary(e.target.value)}
//                 placeholder="Basic Salary"
//                 // disabled
//               />
//             </div>
//             <div className="flex flex-col p-2  text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">HRA:</label>
//               <input
//                 className="input-style p-1 bg-red-100 rounded"
//                 type="text"
//                 rows={2}
//                 name="empHra"
//                 value={empHra}
//                 onChange={(e) => setEmpHra(e.target.value)}
//                 placeholder="₹ 0"
//                 // placeholder="HRA"
//                 // disabled
//               />
//             </div>
//             <div className="flex flex-col p-2  text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">DA:</label>
//               <input
//                 className="input-style p-1  bg-red-100 rounded"
//                 type="text"
//                 rows={2}
//                 name="empCa"
//                 value={empCa}
//                 onChange={(e) => setEmpCa(e.target.value)}
//                 placeholder="CA"
//                 // disabled
//               />
//             </div>
//             <div className="flex flex-col p-2  text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">Medical Allowance:</label>
//               <input
//                 className="input-style bg-red-100 p-1 rounded"
//                 type="text"
//                 rows={2}
//                 name="empMedical"
//                 value={empMedical}
//                 onChange={(e) => setEmpMedical(e.target.value)}
//                 placeholder="Medical Allowance"
//                 // disabled
//               />
//             </div>
//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">Tiffin/DAS Allowance:</label>
//               <input
//                 className="input-style bg-red-100 p-1 rounded"
//                 type="text"
//                 rows={2}
//                 name="empTiffin"
//                 value={empTiffin}
//                 onChange={(e) => setEmpTiffin(e.target.value)}
//                 placeholder="Tiffin Allowance"
//                 // disabled
//               />
//               <span className="text-xs text-red-100">DISABLED</span>
//             </div>
//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">Kit Allowance:</label>
//               <input
//                 className="input-style bg-red-100 p-1 rounded"
//                 type="text"
//                 rows={2}
//                 name="kit"
//                 value={kit}
//                 onChange={(e) => setKit(e.target.value)}
//                 placeholder="Kit Allowance"
//                 // disabled
//               />
//             </div>
//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">Additional Allowance:</label>
//               <input
//                 className="input-style bg-red-100 p-1 rounded"
//                 type="text"
//                 rows={2}
//                 name="additional"
//                 value={additional}
//                 onChange={(e) => setAdditional(e.target.value)}
//                 placeholder="Additional Allowance"
//                 // disabled
//               />
//             </div>
//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">Company PF:</label>
//               <input
//                 className="input-style p-1 bg-red-100 rounded"
//                 type="text"
//                 rows={2}
//                 name="empCompanyPf"
//                 value={monthSalary > 21000 ? 0 : empCompanyPf}
//                 onChange={(e) => setEmpCompanyPf(e.target.value)}
//                 placeholder="PF"
//                 disabled={monthSalary > 21000} // Set disabled to true when monthSalary >= 21000
//               />
//               {monthSalary > 21000 && (
//                 <span className="text-xs text-red-700">Not applicable if salary {">"} ₹21,000</span>
//               )}
//             </div>
//             <div className="flex flex-col p-2 mt-4 text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">Final Salary Amount:</label>
//               <input
//                 className="input-style bg-blue-100  p-1 rounded"
//                 type="number"
//                 rows={2}
//                 name="finalAmountSalary"
//                 value={finalAmountSalary}
//                 onChange={(e) => setFinalAmountSalary(e.target.value)}
//                 placeholder="₹ 0"
//                 // disabled
//               />
//             </div>



//             <div className="flex flex-col p-2  text-start w-full lg:w-1/3">
//               <label className="text-base mx-1">Salary in Words:</label>
//               <input
//                 className="input-style bg-blue-100  p-1 rounded"
//                 type="text"
//                 name=""
//                 value={toWords.convert(finalAmountSalary || 0)}
//                 // onChange={(e) => setInWords(e.target.value)}
//                 placeholder="₹ 0"
//                 // disabled
//               />
//             </div>
//             <div className="flex flex-col p-2  text-start w-full lg:w-1/5"></div>
//             {/* part-3 */}
//             <div className="w-full col-span-4 my-4 text-white border-b border border-blue-500 bg-blue-700">
//               Employee Contribution/Deduction
//             </div>
//             <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">PF:</label>
//               <input
//                 className="input-style bg-red-100  p-1 rounded"
//                 type="text"
//                 rows={2}
//                 name="empPf"
//                 value={empPf}
//                 onChange={(e) => setEmpPf(e.target.value)}
//                 placeholder="PF"
//                 // disabled
//               />
//               {/* <span className="text-xs text-red-700">DISABLED</span> */}
//             </div>
//             <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">Loan EMI:</label>
//               <input
//                 className="input-style  p-1 rounded"
//                 type="number"
//                 rows={2}
//                 name="empLoanemi"
//                 value={empLoanemi}
//                 placeholder="₹ 0"
//                 onChange={(e) => setEmpLoanemi(e.target.value)}
//               />
//             </div>

//             {/* <div className="flex flex-col p-2 text-start w-full lg:w-1/5 border-t">
//               <label className="text-base mx-1">ESI:</label>
//               <input
//                 className="input-style bg-red-100 p-1 rounded"
//                 type="number"
//                 rows={2}
//                 name="empEsi"
//                 value={empEsi}
//                 onChange={(e) => setEmpESI(e.target.value)}
//                 placeholder="₹ 0"
//                 disabled
//               />
//             </div> */}
//             <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">TDS:</label>
//               <input
//                 className="input-style  p-1 rounded"
//                 type="number"
//                 rows={2}
//                 name="otherDeduction"
//                 value={otherDeduction}
//                 onChange={(e) => setOtherDeduction(e.target.value)}
//                 placeholder="₹ 0"
//               />
//             </div>
//             <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//               <label className="text-base mx-1 font-semibold text-red-700">
//                 All Deduction Amount:
//               </label>
//               <input
//                 className="input-style  p-1 rounded "
//                 type="number"
//                 rows={2}
//                 name="finalDeduction"
//                 value={finalDeduction}
//                 onChange={(e) => setFinalDeduction(e.target.value)}
//                 placeholder="₹ 0"
//                 // disabled
//               />
//             </div>

//             <div className="w-full col-span-4 my-4 text-white border-b border border-blue-500 bg-blue-700">
//               Other Expenses
//             </div>

//             <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">Fuel Expenses:</label>
//               <input
//                 className="input-style  p-1 rounded"
//                 type="number"
//                 rows={2}
//                 name="fuelExpense"
//                 value={fuelExpense}
//                 onChange={(e) => setFuelExpense(e.target.value)}
//                 placeholder="₹ 0"
//               />
//             </div>
//             <div className="flex flex-col p-2 text-start w-full lg:w-1/5">
//               <label className="text-base mx-1">Other Expenses:</label>
//               <input
//                 className="input-style  p-1 rounded"
//                 type="number"
//                 rows={2}
//                 name="otherExpense"
//                 value={otherExpense}
//                 onChange={(e) => setOtherExpense(e.target.value)}
//                 placeholder="₹ 0"
//               />
//             </div>

//             <div className="flex flex-col p-2 text-start w-full lg:w-1/5"></div>
//             <div className="flex flex-col p-2 text-start w-full lg:w-1/5"></div>
//             <div className="w-full my-10 p-2 text-center">
//               <button
//                 className="text-white bg-gradient-to-r leading-4 tracking-wider font-semibold from-green-600 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-green-700 dark:focus:ring-green-800 rounded shadow-lg shadow-green-500/50  dark:shadow-lg dark:shadow-green-800/80 text-sm px-5 py-2.5 text-center me-2 mb-2"
//                 onClick={handleSubmit}
//                 type="button"
//               >
//                 {loading ? "Submitting..." : "Submit"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default GenerateSalary;
