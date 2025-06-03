/* eslint-disable react/prop-types */
import {
  Home,
  MessageSquare,
  BarChart2,
  Settings,
  ShoppingCart,
  Package,
  Heart,
  Archive,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Asidebar({ insuranceName, category }) {
  const sidebarItems = [
    { icon: Home, label: "Home", path: "/advisor/home/insurance" },
    {
      icon: MessageSquare,
      label: "Policies",
      // path: `/advisor/${insuranceName}/policies/lists`,
      path: `/advisor/home/${insuranceName}/${category}/lists`,
    },
    { icon: BarChart2, label: "Analytics", path: "/analytics" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: Archive, label: "Archive", path: "/archive" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];
  const [colorClass, setColorClass] = useState("bg-gray-700"); // Default to gray
  const navigate = useNavigate();

  useEffect(() => {
    switch (insuranceName) {
      case "tata_aig":
        setColorClass("bg-blue-700");
        break;
      case "magma_hdi":
        setColorClass("bg-green-700");
        break;
      default:
        setColorClass("bg-gray-700");
        break;
    }
  }, [insuranceName]);

  return (
    <aside
      className={`  w-16 flex flex-col items-center justify-between ${colorClass} rounded shadow-lg`}
    >
      <div className="flex flex-col justify-between items-end">
        <div className="w-full pt-6 flex flex-col items-center space-y-6">
          {sidebarItems.map((item, index) => (
            <div key={index} className="relative group">
              {/* Button with tooltip trigger */}
              <button
                data-tooltip-target={`tooltip-${index}-right`}
                data-tooltip-placement="right"
                className="text-white hover:bg-slate-900 shadow-inner rounded-full p-2"
                aria-label={item?.label}
                onClick={() => navigate(item?.path)}
              >
                <item.icon className="h-7 w-7" />
                
              </button>

              {/* Tooltip */}
             
              <div
                id={`tooltip-${index}-right`}
                role="tooltip"
                className="mx-1 tracking-wider my-2 absolute z-10 invisible inline-block px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded shadow-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:visible"
              >
                {item?.label}
                <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full pt-6 bottom-5">
          <button
            className="text-white hover:bg-slate-900 rounded-full p-2"
            aria-label="User profile"
            onClick={() => navigate("/profile")}
          >
            <User className="h-6 w-6" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Asidebar;
