/* eslint-disable no-case-declarations */
import { useState } from "react";
import { toast } from "react-toastify";
import JsonData from "../utils/JsonData.jsx";
import { NavLink } from "react-router-dom";
import VITE_DATA from "../config/config.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { isRestrictedDay } from "../utils/attendanceHelper.jsx";
import AnnounceDisplay from "./AnnounceDisplay.jsx";

// dates
const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
// time
function formatTime(dateTime) {
  const dateObj = new Date(dateTime);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${amOrPm}`;
}
// weekday
const formatWeekday = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = date.getDay();
  return weekdays[dayOfWeek];
};

function LoginAll() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  const handleToggleAttendance = async (id) => {
    try {
      // const empid = sessionStorage.getItem('employeeId') ;
      const currentDateAndTime = new Date().toISOString();
      const datePart = formatDate(currentDateAndTime); // Get date in the format 01-01-2000
      const timePart = formatTime(currentDateAndTime); // Get time in the format 00:00:00 AM/PM
      const weekdayPart = formatWeekday(currentDateAndTime); // Get weekday like 'Monday'
      // Make a POST request to mark attendance
      const resp = await axios.post(
        `${VITE_DATA}/employee/mark/attendance/${id}`,
        {
          status: "present",
          date: datePart,
          time: timePart,
          // logouttime: logouttime,
          // totalHours: totalHours,
          weekday: weekdayPart,
        }
      );
      // Handle success (e.g., show a success message)
      toast.success(`${resp.data.message}`);
      sessionStorage.setItem("aid", resp.data.data._id);
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

  const handleLoginTypeChange = (e) => {
    setLoginType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      let response;

      switch (loginType) {
        case "admin":
          response = await axios.post(`${VITE_DATA}/loginadmin`, {
            mobile,
            email,
            password,
          });
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("email", response.data.email);
          break;

        case "employee":
          response = await axios.post(`${VITE_DATA}/login/employee`, {
            empemail: email,
            empmobile: mobile,
            emppassword: password,
          });
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("email", response.data.user.empemail);
          sessionStorage.setItem("employeeId", response.data.user._id);
          sessionStorage.setItem("empname", response.data.user.empname);
          sessionStorage.setItem("branch", response.data.user.empbranch);
          sessionStorage.setItem("role", response.data.user.staffType);

          // Call isRestrictedDay() only when needed
          const restriction = await isRestrictedDay();
          if (restriction.restricted) {
            console.log(restriction.message);
          } else {
            await handleToggleAttendance(response.data.user._id);
          }
          break;

        case "hrmanager":
          response = await axios.post(`${VITE_DATA}/hradmin/login`, {
            hrademail: email,
            hradmobile: mobile,
            hradpassword: password,
          });
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("email", response.data.email);
          sessionStorage.setItem("hrId", response.data.id);
          sessionStorage.setItem("hrName", response.data.name);

          // Call isRestrictedDay() only when needed
          const hrRestriction = await isRestrictedDay();
          const hrName = sessionStorage.getItem("hrName");
          if (hrRestriction.restricted) {
            console.log(hrRestriction.message);
          } else {
            const params = {};
            if (hrName) params.hrName = hrName;
            response = await axios.get(`${VITE_DATA}/alldetails/hrlogin/emp`, {
              headers: {
                Authorization: sessionStorage.getItem("token"),
              },
              params,
            });
            const { ide } = response.data;
            await handleToggleAttendance(ide);
          }
          break;

        case "advisor":
          response = await axios.post(`${VITE_DATA}/advisor/login`, {
            advisoremail: email,
            advisormobile: mobile,
            advisorpassword: password,
          });
          // sessionStorage.setItem("advisoremail", email);
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem(
            "advisoremail",
            response.data.advisory.advisoremail
          );
          sessionStorage.setItem("advisorId", response.data.advisory._id);
          sessionStorage.setItem("advId", response.data.advisory.uniqueId);
          sessionStorage.setItem("advname", response.data.advisory.advisorname);
          break;

        case "branches":
          response = await axios.post(`${VITE_DATA}/branches/loginbranch`, {
            branchemail: email,
            password,
          });
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("email", response.data.user.branchemail);
          sessionStorage.setItem("branchName", response.data.user.branchname);
          sessionStorage.setItem("branchId", response.data.user._id);
          break;

        case "ops":
          response = await axios.post(`${VITE_DATA}/ops/login`, {
            opsemail: email,
            opspassword: password,
          });
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("email", response.data.user.opsemail);
          sessionStorage.setItem("opsName", response.data.user.opsname);
          break;

        case "finance":
          response = await axios.post(`${VITE_DATA}/finance/login`, {
            finemail: email,
            finpassword: password,
          });
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("finemail", response.data.email);
          sessionStorage.setItem("finname", response.data.name);
          break;

        case "cic":
          response = await axios.post(`${VITE_DATA}/cic/login`, {
            cicemail: email,
            cicpassword: password,
          });
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("cicemail", response.data.email);
          sessionStorage.setItem("cicname", response.data.name);
          break;

        default:
          toast.warn("Please Select Login Type..! ");
          break;
      }

      if (response) {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setLoading(false);
          toast.error("No token found. Please log in again.");
          return;
        }

        // Decode the token once
        const decodedToken = jwtDecode(token);

        // Handle navigation based on login type
        switch (loginType) {
          case "admin":
            decodedToken.isAdmin ? navigate("/dashboard") : navigate("/login");
            break;
          case "employee":
            ["HR ADMIN", "HR Admin", "hr admin"].includes(
              response.data.user.staffType
            )
              ? navigate("/admin/hr/home")
              : navigate("/employee/home");
            break;
          case "hrmanager":
            decodedToken.isHr ? navigate("/hr/home") : navigate("/login");
            break;
          case "advisor":
            navigate("/advisor/home");
            break;
          case "branches":
            navigate("/branches/home");
            break;
          case "ops":
            decodedToken.isOps ? navigate("/ops/home") : navigate("/login");
            break;
          case "finance":
            decodedToken.isFinance
              ? navigate("/finance/home")
              : navigate("/login");
            break;
          case "cic":
            decodedToken.isCic ? navigate("/cic/home") : navigate("/login");
            break;
        }
        toast.success("Logged In Successfully !");
      }
    } catch (error) {
      toast.error(`${error.response?.data?.message || "Choose Login Type"}`);
    } finally {
      setLoading(false);
    }
  };

  const forgotPasswordLink = () => {
    switch (loginType) {
      case "admin":
        return "/admin/forget";
      case "employee":
        return "/employee/forget";

      case "hrmanager":
        return "/hradmin/forget";
      case "branches":
        return "/branches/forget";
      case "ops":
        return "/ops/forget";
      case "advisor":
        return "/advisor/forget";
      case "finance":
        return "/finance/forget";
      case "cic":
        return "/cic/forget";

      default:
        return "/login";
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
    setTimeout(() => setShowPassword(false), 10000);
  };

  return (
    <section className="container-fluid flex justify-center min-h-screen h-full items-center flex-col shadow-2xl shadow-slate-500">
      <AnnounceDisplay/>
      {/* <div className="container-fluid flex flex-col justify-end ">
        <img src="/insurance.png" className="w-3/4  mx-auto" alt="Logo" />
       </div> */}

      <form
        className="space-y-6  relative p-10 my-auto mx-auto max-w-md w-full shadow-lg flex flex-col justify-center tracking-wider rounded"
        method="POST"
         style={{
      boxShadow: `
        0 10px 20px -5px rgba(0, 0, 0, 0.2),
        0 10px 10px -5px rgba(0, 0, 0, 0.04),
        inset 0 -2px 5px rgba(255, 255, 255, 0.5),
        0 0 0 2px rgba(255, 255, 255, 0.2),
        5px 10px 15px -2px rgba(0, 0, 0, 0.3)
      `,
      background: 'linear-gradient(to top, #f0f4f8, #e2e8f0)'
    }}
        onSubmit={handleSubmit}>
        <div className="text-base md:text-lg font-bold mx-auto text-blue-700 text-black-700 justify-center">
          <img
            src="/logo.webp"
            className="md:w-48 w-40 mx-auto my-1"
            loading="lazy"
            rel="preload"
            alt="Logo"
          />
          <span>Eleedom IMF Private Limited</span>
        </div>
       
        <label
          htmlFor="email"
          className="block mb-1 text-base md:text-lg text-start font-medium text-blue-700">
          Email
          <input
            type="email"
            name="email"
            id="email"
            value={mobile || email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMobile(e.target.value);
            }}
            autoComplete="email"
            className="bg-gray-50 border p-2 border-gray-300 text-gray-900 md:text-lg text-base rounded focus:ring-primary-500 active:placeholderbg-gray-400 focus:border-primary-500 block w-full"
            placeholder="name@company.com"
            required
          />
        </label>

        <label
          htmlFor="password"
          className="block mb-1 text-base md:text-lg text-start font-medium text-blue-700">
          Password
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="bg-gray-50 border p-2 border-gray-300 text-gray-900 md:text-lg text-base rounded focus:ring-primary-500 focus:border-primary-500 block w-full"
              required
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute inset-y-0 right-1 bottom-0 px-3 flex items-center focus:outline-none"
            >
              {showPassword ? (
                <Eye SIze={20} />
              ) : (
                <EyeOff size={20} />
              )}
            </button>
          </div>
        </label>
        
       
          <label
            htmlFor="type"
            className="block mx-0 text-base md:text-lg font-medium mt-3 ml-1 text-blue-700">
            Login Type
          <select
            id="type"
            className="input-style cursor-pointer mt-0.5 bg-gray-50 border p-2 ps-2 border-gray-300 text-gray-900 md:text-lg text-base rounded focus:ring-primary-500 focus:border-primary-500 block w-full"
            value={loginType}
            onChange={handleLoginTypeChange}>
              
            <option className="mx-auto" value=""> Select Login Type</option>
            {JsonData.LoginType.map((item) => (
        <option key={item.id} value={item.type}>
          {item.nameType}
        </option>
      ))}
          </select>
          </label>

        <div className="flex items-start">
          <NavLink
            to={forgotPasswordLink()}
            className="ml-auto text-base md:text-lg font-semibold transition ease-in-out delay-100 hover:-translate-y-0 hover:scale-1000 duration-300 text-blue-800 hover:underline hover:text-blue-600"
            target="_blank"
          >
            Forgot Password?
          </NavLink>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full transition ease-in-out delay-150 ${
            loading
              ? "bg-gray-400"
              : "hover:-translate-y-1 hover:scale-10 hover:bg-blue-600 bg-blue-800"
          } flex justify-center py-2 px-4 rounded text-base font-semibold text-white shadow-sm`}
        >
          {loading ? "Signing In..." : "SIGN IN"}
        </button>
      </form>
     </section>
  );
}

export default LoginAll;
