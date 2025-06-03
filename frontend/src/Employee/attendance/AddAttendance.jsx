import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import LeaveApplication from "../LeaveApplication/LeaveApplication.jsx";
import VITE_DATA from "../../config/config.jsx";
import { isRestrictedDay } from "../../utils/attendanceHelper.jsx";
// get times
const getCurrentDateAndTime = () => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date()
  );
  return formattedDate;
};
// dates
const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
// time
const formatTime = (dateTimeString) => {
  const timePart =
    dateTimeString.split(" ")[2] + " " + dateTimeString.split(" ")[3];
  return timePart;
};
// weekday
const formatWeekday = (dateTimeString) => {
  const weekdayPart = dateTimeString.split(",")[0];
  return weekdayPart;
};
// show date on screen
let dates = formatDate(getCurrentDateAndTime());
// api call to post attendancee

function AddAttendance() {
  let digitalTime = new Date().toLocaleTimeString();
  const [ctime, setTime] = useState(digitalTime);
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [restricted, setRestricted] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const checkRestriction = async () => {
      const result = await isRestrictedDay();
      setRestricted(result?.restricted);
      setMessage(result?.message || "");
    };
    checkRestriction();
  }, []);
  // digital clock
  const updateTime = () => {
    digitalTime = new Date().toLocaleTimeString();
    setTime(digitalTime);
  };
  setInterval(updateTime, 1000);

  // toggle handle present, absent api
  const handleToggleAttendance = async () => {
    try {
      const empid = sessionStorage.getItem("employeeId");
      // Check if a valid attendance status is selected
      if (!attendanceStatus) {
        toast.error("Please select a valid attendance status.");
        return;
      }
      const currentDateAndTime = getCurrentDateAndTime();
      const datePart = formatDate(currentDateAndTime); // Get date in the format 01-01-2000
      const timePart = formatTime(currentDateAndTime); // Get time in the format 00:00:00 AM/PM
      const weekdayPart = formatWeekday(currentDateAndTime); // Get weekday like 'Monday'
      // Make a POST request to mark attendance
      await axios.post(`${VITE_DATA}/employee/mark/attendance/${empid}`, {
        status: attendanceStatus,
        date: datePart,
        time: timePart,
        weekday: weekdayPart,
      });
      // Handle success (e.g., show a success message)
      toast.success("Today Attendance marked Successfully!");
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error(
        "Error marking attendance:",
        error.response ? error.response.data.message : error.message
      );
      toast.error(
        `${error.response ? error.response.data.message : error.message}`
      );
    }
  };

  const empnam = sessionStorage.getItem("empname");
  return (
    <section className="container-fluid relative flex flex-wrap p-0 sm:ml-48 bg-blue-50">
      <div className="container-fluid flex justify-center p-1 w-full sm:w-full md:w-full lg:w-full xl:w-full border-dashed rounded-lg  bg-blue-50">
        <div className="flex flex-col min-w-full   w-full py-0">
          <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl tracking-wider text-center text-blue-700  font-medium my-4">
            Attendance
          </h2>
          <div className="overflow-x-auto  ">
            {/* name, date, time */}
            <div className="flex justify-between px-2 shadow-2xl border border-slate-100 py-1 text-xl sm:text-md md:text-xl lg:text-xl xl:text-xl my-0">
              <span className="text-start font-semibold text-base bg-slate-200 p-2 rounded">
                Your Name:{" "}
                <span className="font-base tracking-wide text-blue-700">
                  {empnam}
                </span>
              </span>
              <span className="bg-slate-200 p-2 rounded text-start font-semibold text-base">
                Time:{" "}
                <span className="font-medium   tracking-wide text-blue-700   md:text-base xl:text-base   sm:text-base">
                  {" "}
                  {ctime}
                </span>{" "}
              </span>
              <span className="bg-slate-200 p-2 rounded text-start font-semibold text-base">
                Date:{" "}
                <span className="font-medium  tracking-wide text-blue-700 md:text-base xl:text-base  sm:text-base">
                  {" "}
                  {dates}
                </span>{" "}
              </span>
            </div>
            {/* part-2 */}
            <div className="flex flex-wrap ">
              {restricted ? (
                <div className="w-full sm:w-full md:w-full lg:w-full xl:w-1/2 bg-blue-100 shadow-2xl rounded">
                  <div className="flex justify-center items-center text-center my-auto">
                    <span className="text-xl font-bold tracking-wider">{message}</span>
                  </div>
                </div>
              ) : (
                <div className="w-full sm:w-full md:w-full lg:w-full xl:w-1/2 bg-blue-100 shadow-2xl rounded py-4 ">
                  <div className="flex justify-center text-center">
                    <h1 className="text-xl xl:text-2xl lg:text-2xl tracking-wide text-start font-medium uppercase text-blue-700 me-10">
                      Make Attendance
                    </h1>
                  </div>

                  <div className="flex flex-wrap mx-2 text-center justify-evenly mt-12">
                    <labe1
                      htmlFor="red-radio"
                      className="flex justify-center items-center text-xl cursor-pointer font-semibold text-red-600"
                    >
                      <input
                        id="red-radio"
                        type="radio"
                        value="absent"
                        name="colored-radio"
                        checked={attendanceStatus === "absent"}
                        onChange={() => setAttendanceStatus("absent")}
                        className="w-5 h-5 mx-2 cursor-pointer text-red-600 bg-red-200 border-red-700 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 "
                      />
                      Absent
                    </labe1>

                    <label
                      htmlFor="green-radio"
                      className="flex justify-center items-center text-xl cursor-pointer font-semibold text-green-600"
                    >
                      <input
                        id="green-radio"
                        type="radio"
                        value="present"
                        name="colored-radio"
                        checked={attendanceStatus === "present"}
                        onChange={() => setAttendanceStatus("present")}
                        className="w-5 h-5 mx-2 cursor-pointer text-green-600 bg-green-200 border-green-700 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2"
                      />
                      Present
                    </label>

                    <label
                      htmlFor="yellow-radio"
                      className="flex justify-center items-center text-xl cursor-pointer font-semibold text-yellow-600"
                    >
                      <input
                        id="yellow-radio"
                        type="radio"
                        value="halfday"
                        name="colored-radio"
                        checked={attendanceStatus === "halfday"}
                        onChange={() => setAttendanceStatus("halfday")}
                        className="w-5 h-5 mx-2 cursor-pointer text-yellow-400 bg-yellow-200 border-yellow-700 focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:ring-offset-yellow-800 focus:ring-2"
                      />
                      HalfDay
                    </label>

                    <label
                      htmlFor="yellow-radio"
                      className="flex justify-center items-center text-xl cursor-pointer font-semibold text-teal-600"
                    >
                      <input
                        id="yellow-radio"
                        type="radio"
                        value="holiday"
                        name="colored-radio"
                        checked={attendanceStatus === "holiday"}
                        onChange={() => setAttendanceStatus("holiday")}
                        className="w-5 h-5 mx-2 cursor-pointer text-teal-400 bg-teal-200 border-teal-700 focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-teal-800 focus:ring-2"
                      />
                      Holiday
                    </label>
                  </div>

                  <div className="text-center my-12 pt-12 mx-4 flex justify-center">
                    <button
                      className="text-white cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-10 duration-300 bg-blue-600 hover:bg-blue-700 focus:ring-0 focus:outline-none font-medium rounded text-base px-3 py-1 text-center"
                      onClick={handleToggleAttendance}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
              <LeaveApplication />
            </div>
          </div>
        </div>
        {/* <div className="container-fluid flex justify-center p-2  border-dashed rounded-lg  bg-slate-200">
          Balance:
        </div> */}
      </div>
      <div></div>
    </section>
  );
}

export default AddAttendance;
