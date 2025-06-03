import { useState, startTransition } from "react";
import { NavLink } from "react-router-dom";
import LogoutOps from "./LogoutOps.jsx";

const SidebarOps = () => {
  const dashboardRouted = [
    {
      title: "Home",
      path: "/ops/home",
      logo: <img src="/pages.png" height={10} width={25} alt="dashboard"/>
    },
    {
      title: "Create Policy",
      path: "/ops/home/add/policy",
      // logo: < FcViewDetails size={24}/>
      logo: <img src="/policy.png" height={5} width={25} alt="policy"/>
    },
    {
      title: "Policy Lists",
      path: "/ops/home/policy",
      // logo: <IoPeopleOutline size={25} />
      logo: <img src="/grids.png" height={5} width={25} alt="grid"/>
    },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    startTransition(() => {
    setSidebarOpen(!sidebarOpen);
  });
  };

  const toggleSubmenu = (idx) => {
    startTransition(() => {
    setOpenSubmenu(openSubmenu === idx ? null : idx);
  });
  };

  const email = sessionStorage.getItem("email");
  const name = sessionStorage.getItem("opsName");

   return (
      <>
        {/* nav bar */}
        <nav className="fixed top-0 z-50 w-full bg-gradient-to-tr from-blue-700 to-cyan-700">
          <div className="px-3 py-2 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start rtl:justify-end">
                <button
                  data-drawer-target="logo-sidebar"
                  data-drawer-toggle="logo-sidebar"
                  onClick={toggleSidebar}
                  type="button"
                  className="inline-flex border bg-gradient-to-r from-blue-700 to-blue-300 items-center p-2 text-sm text-white rounded-lg sm:hidden hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700"
                >
                  <span className="sr-only">Open sidebar</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    ></path>
                  </svg>
                </button>
                <NavLink
                  to="/ops/home"
                  className="md:flex ms-2 hidden md:me-24"
                >
                  <img src="/logo.webp" className="h-10 w-20" alt="Logo" />
                  <span className="self-center text-xl font-semibold sm:text-xl whitespace-nowrap text-white ml-4">
                    ELEEDOM IMF
                  </span>
                </NavLink>
              </div>
              <div>
                <span className="text-2xl text-white font-medium font-serif tracking-wider">
                  OPS
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center ms-3 relative">
                  <div>
                    <button
                      type="button"
                      className="flex text-sm bg-blue-800 rounded-full focus:ring-0 focus:ring-blue-300"
                      aria-expanded="false"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-blue-800 font-bold text-xl">
                        {name ? name.charAt(0) : "A"}
                      </div>
                    </button>
                  </div>
                  {/* Dropdown with animation and outside click handling */}
                  <div
                    className={`fixed inset-0 z-40 bg-black bg-opacity-0 transition-opacity duration-300 ${
                      isDropdownOpen
                        ? "opacity-30 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
                    onClick={() => setIsDropdownOpen(false)}
                    style={{ display: isDropdownOpen ? "block" : "none" }}
                  ></div>
                  <div
                    className={`z-50 absolute text-center right-0 top-10 my-5 text-base list-none bg-gradient-to-tl from-blue-800 to-cyan-900 divide-y divide-gray-100 rounded shadow overflow-hidden transition-all duration-300 ${
                      isDropdownOpen
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 -translate-y-2 scale-95"
                    }`}
                    style={{ display: isDropdownOpen ? "block" : "none" }}
                  >
                    <div className="p-4 space-y-2" role="none">
                      <p className="text-gray-900 dark:text-white" role="none">
                        {name}
                      </p>
                      <p
                        className="font-medium text-gray-500 truncate dark:text-gray-200"
                        role="none"
                      >
                        {email}
                      </p>
                    </div>
                    <ul
                      className="flex justify-center flex-col space-y-2 mx-4 mb-4 text-white"
                      role="none"
                    >
                      <li>
                        <NavLink
                          to="/ops/home"
                          className="block px-4 py-1 mt-1 hover:bg-blue-700 transition-colors duration-200"
                          role="menuitem"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Home
                        </NavLink>
                      </li>
                      <LogoutOps />
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
  
        <aside
          id="logo-sidebar"
          className={`fixed top-0 left-0 z-40 w-44 h-screen pt-16 transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } bg-blue-700 border-r  sm:translate-x-0 `}
          aria-label="Sidebar"
        >
          <div className="h-full px-2 mt-4 overflow-y-auto bg-blue-700">
            <ul className="space-y-3 font-medium">
              {dashboardRouted.map((route, idx) => (
                <li key={`${route.path}-${idx}`} className="relative">
                  {route.subRoutes ? (
                    /* Parent route with dropdown */
                    <div className="group">
                      <NavLink
                        to={route.path}
                        end // This ensures exact matching for parent route
                        onClick={(e) => {
                          // Only prevent default if it has subroutes
                          if (route.subRoutes?.length > 0) {
                            e.preventDefault();
                            toggleSubmenu(idx);
                          }
                        }}
                        className={({ isActive }) =>
                          `flex items-center p-2 rounded-lg text-white hover:bg-blue-600 transition-colors duration-200 ${
                            isActive ? " font-semibold" : ""
                          }`
                        }
                        aria-expanded={openSubmenu === idx}
                        aria-haspopup="true"
                      >
                        <span className="w-6 flex justify-center">
                          {route.logo}
                        </span>
                        <span className="ml-3 text-sm md:text-base truncate">
                          {route.title}
                        </span>
                        {route.subRoutes?.length > 0 && (
                          <svg
                            className={`w-4 h-4 ml-2 mt-0.5 transition-transform duration-200 ${
                              openSubmenu === idx ? "rotate-90" : ""
                            }`}
                            fill="currentColor"
                            viewBox="0 0 15 18"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </NavLink>
  
                      {/* Submenu */}
                      {route.subRoutes?.length > 0 && (
                        <ul
                          className={`pl-1 mt-3 space-y-2 transition-all duration-300 overflow-hidden ${
                            openSubmenu === idx
                              ? "max-h-screen opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          {route.subRoutes.map((subRoute) => (
                            <li key={subRoute.path}>
                              <NavLink
                                to={subRoute.path}
                                end // Ensure exact matching
                                className={({ isActive }) =>
                                  `flex items-center p-2 text-sm md:text-base text-blue-50 rounded-lg hover:bg-blue-600 transition-colors duration-200 ${
                                    isActive ? "bg-slate-900 font-semibold" : ""
                                  }`
                                }
                              >
                                <span className="w-6 flex justify-center">
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                                <span className="ml-1 truncate">
                                  {subRoute.title}
                                </span>
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    /* Single route without dropdown */
                    <NavLink
                      to={route.path}
                      end // Ensure exact matching
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-white hover:bg-blue-600 transition-colors duration-200 ${
                          isActive ? "bg-slate-800 font-semibold" : ""
                        }`
                      }
                    >
                      <span className="w-6 flex justify-center">
                        {route.logo}
                      </span>
                      <span className="ml-3 text-sm md:text-base truncate">
                        {route.title}
                      </span>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <main className="mt-16"></main>
      </>
    );
};

export default SidebarOps;
