import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import VITE_DATA from "../config/config.jsx";

function LoginEmp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${VITE_DATA}/login/employee`, {
        empmobile: mobile,
        empemail: email,
        emppassword: password,
      });
      const token = response.data.token;
    
       const emails = response.data.user.empemail;
       const name = response.data.user.empname;
       const employeeId = response.data.user._id;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("email", emails);
      sessionStorage.setItem("employeeId", employeeId);
      sessionStorage.setItem("name", name);
      navigate("/");
      // Check if the user is an token based on your backend response
      if (response.data) {
        const token = response.data.token;
        sessionStorage.getItem("token", token);
        navigate("/employee/home");
        toast.success("Logged In Successfully !");
      } else {
        // For non-token users, you might want to redirect to a different page
        navigate("/employee");
        toast.error("User Not Found!");
      }
    } catch (error) {
      console.log(error);
      toast.warn("Incorrect UserID/Password or Admin Access Not Allowed! ");
    }
  };

  return (
    <>
      <section className="container-fluid h-screen relative bg-slate-200">
        <div className="container-fluid pt-20 flex flex-col md:flex-row items-center pb-20 justify-between bg-slate-200">
          <div className="flex-shrink-4 px-6 md:h-full h-full py-20">
            <img
              src="/adminlogin-avatar.jpg"
              className="h-1/4 w-2/5 rounded-full mx-auto "
              alt="Logo"
            />
            <div className="text-4xl font-bold mt-6 w-64 mx-auto  text-blue-400 flex justify-center leading-relaxed">Employee Login</div>
          </div>
          <div className="flex-shrink-1 px-6  md:h-full h-full w-full xs:w-full  sm:w-full md:1/2 mx-auto lg:w-1/2 xl:w-1/2 xl:py-20">
            <div className="w-full max-w-xl p-6 space-y-14 sm:p-8  rounded-lg shadow bg-slate-900 ">
              <h2 className="text-2xl font-bold text-white">
                Sign in as Employee
              </h2>
              <form
                className="mt-8 space-y-6"
                method="POST"
                onSubmit={(e) => handleSubmit(e)}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-3 text-sm text-start font-medium t text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    
                    id="email"
                    value={mobile || email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setMobile(e.target.value);
                    }}
                    name="email"
                    autoComplete="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 active:placeholderbg-gray-400focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="name@emp.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm text-start font-medium text-gray-900 dark:text-white">
                    Your password
                  </label>
                  <input
                    type="password"
                   
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    autoComplete="current-password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                </div>
                <div className=" text-end text-red-700 font-semibold hover:text-red-500">
             <NavLink to = "/employee/forget">
              Forgot Password
             </NavLink>
              </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-700 focus:ring-1 focus:ring-blue-900 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-50"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginEmp;