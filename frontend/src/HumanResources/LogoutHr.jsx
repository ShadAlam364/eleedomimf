import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
export default function LogoutOps() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
    toast.success("Logout Successfully !");
  };
  return location.pathname !== "" ? (
    <button
      className="text-white tracking-wider bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded text-xs px-2 py-2 text-center"
      onClick={handleLogout}
    >
      LOGOUT
    </button>
  ) : null;
}
