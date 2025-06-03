import express from "express";
import {
  createAllInsurance,
  viewAllList,
  deleteAllList,
  updateMasterDetails,
  viewHajipurList,
  viewPolicyBasedonId,
  viewPoliciesList,
  viewMonthlyData,
  updateByAdvisor,
  viewAllPoliciesLists,
  recalculateAndUpdate,
  getPaginatedData,
  viewBranchLists,
  updateAdvisorByCvpercent,
  
} from "../../controller/masterdetails/masterdetails.controller.js";
import getDashboardData, {
  getDashboardAdvisor,
  getDashboardAttendances,
  // getDashboardAttendances1,
  getDashboardBranch,
  getDashboardBranchWisePolicy,
  getDashboardEmpData,
  getDashboardJobsApplied,
  getDashboardVisits,
  toggleAttendanceForName,
  getCombinedDataOfEmployeePolicyUpdatePage
} from "../../controller/masterdetails/dashboard.controller.js";
const m_details_routes = express.Router();
// add
m_details_routes.post("/adddata", createAllInsurance);
m_details_routes.get("/show/view", viewAllPoliciesLists);
m_details_routes.get("/dashboard/data", getDashboardData);
m_details_routes.get("/dashboard/admin/data", getDashboardEmpData); // not in use
m_details_routes.get("/dashboard/emp/attendance/data", getDashboardAttendances);
// m_details_routes.get("/dashboard/emp/attendance1/data", getDashboardAttendances1);
m_details_routes.get("/emp/policy", getCombinedDataOfEmployeePolicyUpdatePage);
m_details_routes.get("/dashboard/advisor/data", getDashboardAdvisor);
m_details_routes.get("/dashboard/branch/data", getDashboardBranch);
m_details_routes.get("/dashboard/branchwise/data", getDashboardBranchWisePolicy);
m_details_routes.get("/dashboard/career/data", getDashboardJobsApplied);
m_details_routes.get("/dashboard/dvr/data", getDashboardVisits);
m_details_routes.get("/hrlogin/emp", toggleAttendanceForName);
// update
m_details_routes.put("/updatedata/:id", updateMasterDetails);
m_details_routes.put("/update/adv/payout/:id", updateAdvisorByCvpercent);
m_details_routes.get("/update/adv/percentage", updateByAdvisor);

// view
m_details_routes.get("/viewdata", viewAllList);


m_details_routes.get("/viewdata/branch/hpur", viewHajipurList);
m_details_routes.get("/viewdata/branch/lists", viewBranchLists);

// view
m_details_routes.get("/viewdata/:employee_id", viewPolicyBasedonId);

// delete
m_details_routes.delete("/deletedata/:id", deleteAllList);

// lists advisor policy lists based on its id and name
m_details_routes.get("/view/policies", viewPoliciesList);
m_details_routes.get("/view/onload", getPaginatedData);
// by query string
m_details_routes.get("/view/insurance/policies", viewMonthlyData);

export default m_details_routes;