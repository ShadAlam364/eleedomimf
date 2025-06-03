import { useState,  startTransition } from "react";
import { NavLink } from "react-router-dom";
import Logout from "./logout/Logout.jsx";


const Sidebar = () => {
  const dashboardRoutes = [
    {
      title: "Dashboard",
      path: "/dashboard",
      logo: <img src="/pages.png" height={10} width={25} alt="dashboard"/>
    },
    {
      title: "Renewable Dashboard",
      path: "/dashboard/policy-dashboard",
      logo: <img src="/renew.png" height={10} width={25} alt="dashboard"/>
    },
    {
      title: "New Dashboard",
      path: "/dashboard/new-dashboard",
      logo: <img src="/renew.png" height={10} width={25} alt="dashboard"/>
    },
    

    {
      title: "Company",
      path: "#",
      // logo: <FaRegBuilding size={24} />,
      logo: <img src="/enterprise.png" height={5} width={25} alt="company"/>,
      subRoutes: [
        {
          title: "Add Company",
          path: "/dashboard/addcompanies",
          dash: ""
        },
        {
          title: "View Company",
          path: "/dashboard/viewcompanies",
          dash: ""
        },
      ]
    },

    {
      title: "Branch",
      path: "#",
      // logo: <RiGitBranchFill size={24} />,
      logo: <img src="/franchise.png" height={5} width={25} alt="branch"/>,
      subRoutes: [
        {
          title: "Add Branch",
          path: "/dashboard/addbranch",
          dash: ""
        },
        {
          title: "View Branch",
          path: "/dashboard/viewbranch",
          dash: ""
        },
      ]
    },

    {
      title: "Snap",
      path: "#",
      // logo: <FaImages size={24} />,
      logo: <img src="/avatar.png" height={5} width={25} alt="snap"/>,
      subRoutes: [
        {
          title: "Add Snap",
          path: "/dashboard/addcarousel",
          dash: ""
        },
        {
          title: "View Snap",
          path: "/dashboard/firstview/carousel",
          dash: ""
        },
      ]
    },

    {
      title: "Policy",
      path: "#",
      // logo: < FcViewDetails size={24} />,
      logo: <img src="/policy.png" height={5} width={25} alt="policy"/>,
      subRoutes: [
        {
          title: "Add Policy",
          path: "/dashboard/masterform",
          dash: ""
        },
        {
          title: "View Policies",
          path: "/dashboard/viewmasterform",
          dash: ""
        },
      ]
    },

   
    {
      title: "Payout Grid",
      path: "#",
      // logo: <GiReceiveMoney size={25} />,
      logo: <img src="/grids.png" height={5} width={25} alt="grid"/>,
      subRoutes: [

        {
          title: "Add Payout",
          path: "/dashboard/advisor/slabs",
          dash: ""
        },
        {
          title: "Payout Lists",
          path: "/dashboard/advisor/payout/lists",
          dash: ""
        },
      ]
    },
    {
      title: "CEC",
      path: "#",
      logo: <img src="/cic.png" height={5} width={25} alt="grid"/>,
      subRoutes: [

        {
          title: " Claim",
          path: "/dashboard/cic/claim",
          dash: ""
        },
        {
          title: "Endorsment",
          path: "/dashboard/cic/indorshment",
          dash: ""
        },
        {
          title: "Cancellation",
          path: "/dashboard/cic/cancelation",
          dash: ""
        },
      ]
    },
    {
      title: "Leger",
      path: "#",
      // logo: <FaMoneyBill size={25} />,
      logo: <img src="/account.png" height={5} width={25} alt="leger"/>,
      subRoutes: [
        // {
        //   title: "Daily Leger",
        //   path: "/dashboard/ledger1",
        //   dash: "/dashboard/daily/view"
        // },
       
        // {
        //   title: "Monthly Leger",
        //   path: "/dashboard/ledger2",
        //   dash: ""
        // },
        {
          title: "Company Leger",
          path: "/dashboard/ledger3",
          dash: ""
        },
      ]
    },
    {
      title: "View DVR",
      path: "/dashboard/daily/visits/view",
      // logo: <CgProfile size={24} />,
      logo: <img src="/tablet.png" height={5} width={25} alt="tablet"/>
    },
    {
      title: "Recon Data",
      path: "/dashboard/recon/adv/advis",
      // logo: <CgProfile size={24} />,
      logo: <img src="/tablet.png" height={5} width={25} alt="tablet"/>
    },
    {
      title: "View Advisor",
      path: "/dashboard/viewadvisor",
      // logo: <CgProfile size={24} />,
      logo: <img src="/advisor.png" height={5} width={25} alt="adviosr"/>
    },
    {
      title: "Employee Type",
      path: "/dashboard/staff/type",
      // logo: <MdOutlineCategory size={24} />,
      logo: <img src="/staff.png" height={5} width={25} alt="staff"/>,
     
    },
    {
      title: "Announcement",
      path: "/dashboard/announcemnets",
      // logo: <MdOutlineCategory size={24} />,
      logo: <img src="/notify.png" height={5} width={25} alt="Announcement"/>,
    },
    {
      title: "Master",
      path: "#",
      // logo: <MdOutlinePolicy size={24} />,
      logo: <img src="/filter.png" height={5} width={25} alt="filter"/>,
      subRoutes: [
        {
          title: "Add Policy Type",
          path: "/dashboard/policy/type",
          dash: ""
        },
        {
          title: "Add Prod. Type",
          path: "/dashboard/policy/lists",
          dash: ""
        },
        {
          title: "Add Comp. Name",
          path: "/dashboard/company/type",
          dash: ""
        },
        {
          title: "Add Cat. Type",
          path: "/dashboard/company/lists",
          dash: ""
        },
        {
          title: "Add OD_Discount",
          path: "/dashboard/oddiscount",
          dash: ""
        },
        {
          title: "Add Sit Capacity",
          path: "/dashboard/sit/capacity",
          dash: ""
        },
        {
          title: "Add CC",
          path: "/dashboard/CC",
          dash: ""
        },
        {
          title: "Add NCB",
          path: "/dashboard/ncb",
          dash: ""
        },
        {
          title: "Add Segment",
          path: "/dashboard/segment/add",
          dash: ""
        },
        {
          title: "Add Fuel Type",
          path: "/dashboard/fuel/type",
          dash: ""
        },
        {
          title: "Add Payout On",
          path: "/dashboard/payout/type",
          dash: ""
        },
        {
          title: "Add Pay Mode",
          path: "/dashboard/payment/type",
          dash: ""
        },
        {
          title: "Add Holiday ",
          path: "/dashboard/holiday/add",
          dash: ""
        },

      ]
    },

    {
      title: "Report",
      path: "#",
      // logo: <TbReport size={24} />,
      logo: <img src="/report.png" height={5} width={25} alt="report"/>,
      subRoutes: [
        // {
        //   title: "Policies",
        //   path: "/dashboard/policy",
        //   dash: ""
        // },
        // {
        //   title: "Add Policy Details",
        //   path: "/dashboard/addpolicy",
        //   dash: ""
        // },
        {
          title: "View All Claim's",
          path: "/dashboard/viewclaim",
          dash: ""
        },
        {
          title: "View Feedback's",
          path: "/dashboard/viewfeedback",
          dash: ""
        },
        {
          title: "View Complaint's",
          path: "/dashboard/viewcomplaint",
          dash: ""
        },
        {
          title: "View Contact's",
          path: "/dashboard/viewcontact",
          dash: ""
        },
        {
          title: "View User's List",
          path: "/dashboard/viewfilledform",
          dash: ""
        },
      ]
    },
    {
      title: "Careers",
      path: "/dashboard/career/view/list",
      logo: <img src="/career.png" height={5} width={25} alt="grid"/>,
      // subRoutes: [
  
      //   {
      //     title: "Add Payout",
      //     path: "/dashboard/advisor/slabs",
      //     dash: ""
      //   },
      //   {
      //     title: "Payout Lists",
      //     path: "/dashboard/advisor/payout/lists",
      //     dash: ""
      //   },
      // ]
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

  const loginemail = sessionStorage.getItem("email");

  // return (
  //   <>
  //     <nav className="fixed top-0 z-50 w-full bg-blue-800">
  //       <div className="px-3 py-1 lg:px-5 lg:pl-3">
  //         <div className="flex items-center justify-between">
  //           <button onClick={toggleSidebar} className="inline-flex items-center p-2 text-sm text-white rounded-lg sm:hidden hover:bg-gradient-to-r from-blue-700 to-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-500">
  //             <span className="sr-only">Open sidebar</span>
  //             <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
  //               <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
  //             </svg>
  //           </button>
  //           <NavLink to="/dashboard" className="flex ms-2 md:me-24">
  //             <img src="/logo.webp " className="h-10 w-20 me-1 " alt="Logo" />
  //             <span className="self-center text-xl font-semibold sm:text-xl whitespace-nowrap text-white">ELEEDOM IMF</span>
  //           </NavLink>
  //           <span className="text-2xl text-white font-medium font-serif hidden xs:block sm:block md:block lg:block xl:block">Admin Dashboard</span>
  //           <div className="flex">
  //             <div className="flex items-center mx-5">
  //               <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-0 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
  //                 <span className="sr-only">Open user menu</span>
  //                 {/* <img className="w-8 h-8 rounded-full" src="/profile.jpg" alt="user photo" /> */}
  //               </button>
  //               <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
  //                 <div className="px-4 py-3" role="none">
  //                   <p className="text-sm text-gray-900 dark:text-white" role="none">
  //                     .
  //                   </p>
  //                   <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
  //                     {loginemail}
  //                   </p>
  //                 </div>
  //                 <ul className="py-1" role="none">
  //                   <li>
  //                     <NavLink to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</NavLink>
  //                   </li>
  //                   <li>
  //                     <NavLink to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</NavLink>
  //                   </li>
  //                   <li>
  //                     <Logout />
  //                   </li>
  //                 </ul>
  //               </div>
  //             </div>
  //             <span>
  //               <Logout />
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //     </nav>

  //     <aside id="logo-sidebar" className={`fixed top-0 left-0 z-40 w-48 h-screen pt-16 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-blue-800 border-r sm:translate-x-0`} aria-label="Sidebar">
  //       <div className="h-full px-2 pb-4 overflow-y-auto text-white bg-blue-800">
  //         <ul className="space-y-2 font-medium ">
  //           {dashboardRoutes.map((route, idx) => (
  //             <li key={idx} className="">
  //               {route.subRoutes ? (
  //                 <div className="relative group ">
  //                   <NavLink to={route.path} onClick={() => toggleSubmenu(idx)} className={`flex items-center p-2 text-white rounded-md hover:bg-slate-800 group ${openSubmenu === idx ? "bg-slate-800 mb-2" : ""}`}>
  //                     <span className="">{route.logo}</span>
  //                     <span className="ms-2  text-sm flex whitespace-nowrap">{route.title}
  //                     <img src="/chivron.png" height={1} width={8} className="my-auto mx-2" alt="dropdown"/>
  //                     </span>
  //                   </NavLink>
  //                   <ul onClick={() => toggleSubmenu(idx)} onMouseLeave={closeSubmenu} className={`whitespace-nowrap pl-0 transition-all ease-in-out duration-400 ${openSubmenu === idx ? "opacity-100 max-h-2/3 text-white" : "opacity-0 max-h-0 overflow-hidden"}`}>
  //                     {route.subRoutes.map((subRoute, subIdx) => (
  //                       <li key={subIdx}>
  //                         <NavLink to={subRoute.path} className="flex p-2 text-white text-start mx-1 text-sm hover:bg-slate-800 hover:rounded-md ">
  //                         <img src="/chivron1.png" height={1} width={8} className="my-auto mx-1" alt="right"/>
  //                           {subRoute.title}
  //                         </NavLink>
  //                       </li>
  //                     ))}
  //                   </ul>
  //                 </div>
  //               ) : (
  //                 <NavLink to={route.path} className="flex items-center p-1 rounded-md text-white hover:bg-slate-800 dark:hover:bg-slate-800 group">
  //                   <span className="">{route.logo}</span>
  //                   <span className="ms-2 text-sm hover:bg-slate-600 whitespace-nowrap">{route.title}</span>
  //                 </NavLink>
  //               )}
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     </aside>
  //     <main className="mt-14 bg-white">
  //       {/* ALL PAGES RENDER HERE */}
  //     </main>
  //   </>
  // );


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
                to="/dashboard"
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
                ADMINISTRATION
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
                     A
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
                      Admin
                    </p>
                    <p
                      className="font-medium text-gray-500 truncate dark:text-gray-200"
                      role="none"
                    >
                      {loginemail}
                    </p>
                  </div>
                  <ul
                    className="flex justify-center flex-col space-y-2 mx-4 mb-4 text-white"
                    role="none"
                  >
                    <li>
                      <NavLink
                        to="/dashboard"
                        className="block px-4 py-1 mt-1 hover:bg-blue-700 transition-colors duration-200"
                        role="menuitem"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Home
                      </NavLink>
                    </li>
                    <Logout />
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-48 h-screen pt-16 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-blue-700 border-r  sm:translate-x-0 `}
        aria-label="Sidebar"
      >
        <div className="h-full px-2 mt-4 overflow-y-auto bg-blue-700">
          <ul className="space-y-3 font-medium">
            {dashboardRoutes.map((route, idx) => (
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
                        className={`pl-1
                           space-y-2 transition-all duration-300 overflow-hidden ${
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

export default Sidebar;