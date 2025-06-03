import express from "express";
const router = express.Router();
import routes from "./user_routes/usersRoutes.js";
import Letter from "./letters/letter.routes.js";
import hr from "./hrsalary/hrattend.routes.js";
import {
  loginAdmin,
  adminRegister,
  forgotAdminPassword,
  adminPasswordReset,
} from "../controller/login.controller.js";
import {
  addbranchRegister,
  viewBranch,
  deleteBranch,
  updateBranch,
} from "../controller/addbranch.controller.js";
import {
  addempRegister,
  deleteEmployee,
  empPasswordReset,
  forgotEmpPassword,
  listOfEmp,
  loginEmployee,
  // applyLeave,
  updateLeaveStatus,
  updateEmployee,
  viewByIdEmp,
  viewEmployee,
  empListed,
} from "../controller/addemp.controller.js";
import {
  // addsalaryController,
  // deleteSalary,
  empList,
  updateSalary,
  // viewSalary,
} from "../controller/addsalary.controller.js";
import {
  addpolicyRegister,
  deletePolicy,
  updatePolicy,
  viewPolicy,
} from "../controller/addpolicy.controller.js";

import uploadFile from "../middleware/fileUpload.js";
import {
  deleteGenSalary,
  genSalaryController,
  salaryList,
  updateGenSalary,
} from "../controller/gensalary.controller.js";
import {
  branchPasswordReset,
  forgotBranchPassword,
  loginBranch,
} from "../controller/branch.controller.js";
import {
  addCompany,
  deleteCompany,
  updateCompany,
  viewCompanies,
  viewHealthInsuranceCompanies,
  viewMotorInsuranceCompanies,
  viewNonMotorInsuranceCompanies,
} from "../controller/addcompany.controller.js";
import m_details_routes from "./masterDetails/masterdetails.routes.js";
import {
  advisorPasswordReset,
  advisorRegister,
  deleteAdvisor,
  ForgotAdvisorPassword,
  loginAdvisor,
  updateAdvisor,
  viewAdvisor,
  viewAdvisor1,
} from "../controller/advisor/advisor.controller.js";
import {
  addHrRegister,
  deleteHr,
  loginHr,
  updateHr,
  viewHr,
} from "../controller/human_resources/hr.controller.js";
import hrouter from "./hrsalary/hrsalary.routes.js";
import {
  markAttendance,
  getEmployeeAttendance,
  updateEmpAttendance,
  markLeaveAttendance,
  updateEmpLogoutTime,
} from "../controller/empattendance.controller.js";
import {
  deleteStaff,
  staffList,
  staffType,
} from "../controller/staff/type.controller.js";
import {
  addOpsRegister,
  forgotOpsPassword,
  loginOps,
  opsPasswordReset,
} from "../controller/opsAdmin/opsAdmin.js";
import {
  HrAdPassReset,
  HrAdRegister,
  forgotHrAdminPassword,
  hrAdminLogin,
} from "../controller/hradmin/hradmin.controller.js";
import {
  PolicydeleteStaff,
  PolicystaffList,
  PolicystaffTypes,
  ProductPolicyAdd,
  ProductPolicyDelete,
} from "../controller/policytype/addtype.policy.js";
import {
  AddSegment,
  CategoryAdd,
  CompanyDelete,
  CompanyTypeList,
  CompanyTypes,
  categoryTypeDelete,
} from "../controller/companyType/company.controller.js";
import {
  apiListFuels,
  FuelDelete,
  FuelList,
  FuelTypes,
} from "../controller/fuel/fuel.controller.js";
import {
  PayoutOnAdd,
  PayoutOnDelete,
  PayoutOnList,
} from "../controller/payoutOn/payoutOn.controller.js";
import {
  PaymentAdd,
  PaymentDelete,
  PaymentModeList,
} from "../controller/payMode/pay.controller.js";
import {
  financePasswordReset,
  financeRegister,
  forgotFinancePassword,
  loginFinance,
} from "../controller/finance/finance.controller.js";
import {
  hDaysAdd,
  hDaysDelete,
  hDaysList,
} from "../controller/holiday/holiday.controller.js";
import letters from "./letters/letter.routes.js";
// import { exSave } from "../controller/human_resources/salaryhr.controller.js";
import {
  TWvehicleSlab,
  addCompGrid,
  cvehicleSlab,
  delVehicleSlab,
  deleteCompGrid,
  updateCVehicleSlab,
  updateCompGrid,
  viewAllCVehicleSlab,
  viewAllCompanyGrid,
  viewBranchwiseSlab,
} from "../controller/commSlab/commissionSlab.js";
import { viewAdvisorListing } from "../controller/masterdetails/masterdetails.controller.js";
import {
  ODAdd,
  OdDelete,
  OdList,
} from "../controller/oddiscount/OdDiscount.js";
import { CCDelete, CCList, ccAdd } from "../controller/CC/cc.controller.js";
import {
  addSitCapacities,
  deleteSitting,
  updateSeating,
  viewSitCapacityList,
} from "../controller/sittingCapacity/sittingcapacity.js";
import {
  ncbAdds,
  ncbDelete,
  ncbLists,
} from "../controller/ncb/ncb.contoller.js";
import {
  LeaveDelete,
  LeaveTypeList,
  LeaveTypes,
} from "../controller/leaveBalance/leavebalance.js";
import legers from "./leger/leger.routes.js";
import cics from "./cic/cic.routes.js";
import cancels from "./cancelForm/cancelForms.js";
import ind from "./indorshForm/indorForms.js";
import formsClaimed from "./formsClaimed/formsClaimed.js";
import dailyVisited from "./dailyVisits/daily.router.js";
import verifyAdmin from "../controller/verifyToken/verifyTokenId.js";
import getTokens from "../controller/tataAig/apiauth.controller.js";
import {
  financier,
  pincode,
  policyPlans,
  prevInsurer,
  proposalApi,
  quoteApi,
  rto,
  rtoByCode,
  rtoByLocation,
  vehicleMfg,
  vehicleMfgModel,
  vehicleMfgModelVariant,
  vehicleMfgModelVariantData,
  vehicleMfgModelVariantPriceData,
  cKycApi,
  verifyInspectionApi,
  makePayment,
  verifyPayment,
  formSixtyApi,
  aadhaarOtpApi,
  motorPolicyDownload,
  tataPolicyData
} from "../controller/tataAig/quoteProposalApi.js";
import exportDatabase from "../controller/user_controller/expController.js";
import magmaRoute from "./magma/magma.routes.js";
import announce from "./announcement/announce.route.js";


// GET TATA AIG AUTH TOKEN CALL
router.get("/tataaig/auth/details", getTokens);
// users Routes
router.use("/users", routes);
// claim routes
router.use("/claims", formsClaimed);
// cancel routes
router.use("/cancled", cancels);
// indorshment
router.use("/indorshment", ind);
// cic
router.use("/cic", cics);
// master routes
router.use("/alldetails", m_details_routes);
// hrsalary
router.use("/dashboard", hrouter);
// letter
router.use("/letters", letters);
// hr attendance
router.use("/hr", hr);
// leger
router.use("/leger", legers);
// daily visits
router.use("/dailyvisit", dailyVisited);
// admin routes
router.use("/announcement", announce);
// login
router.post("/loginadmin", loginAdmin);
// register
router.post("/registeradmin", adminRegister);
router.post("/forgot/admin/pass", forgotAdminPassword);
router.post("/admin/pass/:id/:token", adminPasswordReset);
// add or view branch
router.post("/dashboard/addbranch", addbranchRegister);
router.get("/api/branch-list", viewBranch);
router.put("/api/branch/update/:id", updateBranch);
router.delete("/dashboard/api/:id", deleteBranch);
// password change
router.post("/forgot/branch/pass", forgotBranchPassword);
router.post("/branch/pass/:id/:token", branchPasswordReset);
// COMPANY
router.post("/dashboard/addcompany", addCompany);
router.get("/api/company/company-list", viewCompanies);
router.get("/api/company/health-list", viewHealthInsuranceCompanies);
router.get("/api/company/motor-list", viewMotorInsuranceCompanies);
router.get("/api/company/nonmotor-list", viewNonMotorInsuranceCompanies);
router.get("/db/api/all/new", exportDatabase);
router.put("/api/company/updatecomp/:id", updateCompany);
router.delete("/company/api/:id", deleteCompany);
// add or view employee
router.post("/dashboard/addemployee", uploadFile, addempRegister);
router.post("/login/employee", loginEmployee);
router.get("/employees/data", empListed);
// get all employees details inside hr
router.get("/api/employee-list", viewEmployee);
// advisor policy lists
router.get("/api/advpolicy", viewAdvisorListing);
// Vehicle Manufacturer
router.get("/taig/pc/mfg", vehicleMfg);
// Manufacturer Model
router.get("/taig/pc/mfg/model/:code/:name", vehicleMfgModel);
// Manufacturer Model Variant
router.get("/taig/pc/mfg/model/variant/:code/:name", vehicleMfgModelVariant);
// Model Variant Data
router.get(
  "/taig/pc/mfg/model/variant/:code/:name/:vcode/:vname",
  vehicleMfgModelVariantData
);
// Model Variant Data Price
router.get(
  "/taig/pc/mfg/model/variant/price/:id/:name/:vid/:vname/:txt_uw_zone",
  vehicleMfgModelVariantPriceData
);
// rto all lists
router.get("/taig/pc/rto", rto);
// RTO BY id and location
router.get("/taig/pc/rto/:code/:location", rtoByLocation);
// rto by code1 and code 2
router.get("/taig/pc/code/rto/:code1/:code2", rtoByCode);
// pincode
router.get("/taig/pc/pincode", pincode);
// prev insurer
router.get("/taig/pc/prev/insurer", prevInsurer);
// financier
router.get("/taig/pc/financier", financier);
// policy bundle
router.get("/taig/pc/policy/plan", policyPlans);
// policy bundle
router.get("/tata_aig/policy/lists", tataPolicyData);
// MAGMA API 
router.use("/magma", magmaRoute);

// Quote/Proposal/ckyc/inspection/ post data
router.post("/taig/motor/quote", quoteApi);
router.post("/taig/motor/proposal", proposalApi);
router.post("/taig/motor/ckyc", cKycApi);
router.post("/taig/motor/verify/passkey", aadhaarOtpApi);
router.post("/taig/motor/form/sixty", formSixtyApi);
router.post("/taig/motor/verify/inspection", verifyInspectionApi);
router.post("/taig/motor/initiate/pay", makePayment);
router.post("/taig/motor/verif/pay", verifyPayment);
router.get("/taig/motor/download/policy/:encrypted_policy_id", motorPolicyDownload);

router.put("/api/emp/update/:id", uploadFile, updateEmployee);
router.delete("/emp/api/:id", deleteEmployee);
router.get("/api/employee/:empId", viewByIdEmp);
router.put("/employee/:empid/leave/:id", updateLeaveStatus);
// password change
router.post("/forgot/emp/pass", forgotEmpPassword);
router.post("/emp/pass/:id/:token", empPasswordReset);
// attendace of employee
router.post("/employee/mark/leave/:employeeId", markLeaveAttendance);
router.post("/employee/mark/attendance/:employeeId", markAttendance);
router.get("/employee/emp/attendance/:employee_id", getEmployeeAttendance);
router.put("/employee/update/attendance/:employee_id", updateEmpAttendance);
router.put("/employee/logout/time/:employee_id/:id", updateEmpLogoutTime);
// apply for PAYMENTS
router.post("/commission/slab/add", cvehicleSlab);
router.post("/commission1/slab/tw/add", TWvehicleSlab);
router.get("/commission/slab/view", viewAllCVehicleSlab);
router.put("/commission/slab/:id", updateCVehicleSlab);
router.delete("/commission/slab/del/:id", delVehicleSlab);
router.get("/commission/grid/branch/view", viewBranchwiseSlab);

// company grid
router.post("/company/grid/slab/add", addCompGrid);
router.get("/company/grid/slab/view", viewAllCompanyGrid);
router.put("/company/grid/slab/:id", updateCompGrid);
router.delete("/company/grid/slab/del/:id", deleteCompGrid);

// add or view salary
router.put("/api/salary/update/:id", updateSalary);
// for genrate salary
router.post("/dashboard/gensalary", genSalaryController);
router.get("/api/salaries-list", salaryList);
router.put("/api/salaries/:id", updateGenSalary);
router.delete("/salaries/api/:id", deleteGenSalary);
// add policy
router.post("/dashboard/addpolicy", uploadFile, addpolicyRegister);
router.get("/api/policy-list", viewPolicy);
// router.get("/api/policy/collection", exSave);
router.put("/policies/update/:id", updatePolicy);
router.delete("/policies/api/:id", deletePolicy);

// employee list aapi for add salary
router.get("/api/employee-lists", empList);

// advisor register
router.post("/advisor/register", advisorRegister);
router.post("/advisor/login", loginAdvisor);
router.get("/advisor/lists", viewAdvisor);
router.put("/advisor/update/:id", uploadFile, updateAdvisor);
router.delete("/advisor/lists/:id", deleteAdvisor);
router.post("/forgot/advisor/password", ForgotAdvisorPassword);
router.get("/advisor/all/lists", viewAdvisor1);
router.post("/advisor/password/:id/:token", advisorPasswordReset);

// login Branch using Addbranch database
router.post("/branches/loginbranch", loginBranch);
// HR ROUTES
router.post("/hr/addhr", uploadFile, addHrRegister);
// hr admin register
router.post("/hradmin/register", HrAdRegister);
router.post("/hradmin/login", hrAdminLogin);
router.post("/forgot/hradmin/pass", forgotHrAdminPassword);
router.post("/hradmin/pass/:id/:token", HrAdPassReset);
router.post("/hr/login", loginHr);
router.get("/hr/lists", viewHr);
router.put("/hr/update/:id", updateHr);
router.delete("/hr/data/:id", deleteHr);
router.get("/hr/staff/type", listOfEmp);

// add staff type
router.post("/add/staff", staffType);
router.get("/staff/lists", staffList);
router.delete("/staff/lists/:id", deleteStaff);

// add policy type
router.post("/add/policy/staff", PolicystaffTypes);
router.get("/staff/policy/lists", PolicystaffList);
router.delete("/policy/staff/:id", PolicydeleteStaff);
router.put("/api/policy/types/:id/products", ProductPolicyAdd);
router.delete("/api/policy/products/:id/delete", ProductPolicyDelete);

// add comapny category type
router.post("/add/comapny/type", CompanyTypes);
router.get("/view/company/lists", CompanyTypeList);
router.delete("/policy/company/:id", CompanyDelete);
router.put("/api/company/:id/category", CategoryAdd);
router.delete("/api/company/category/:id/delete", categoryTypeDelete);
router.get("/api/comp/cat/user", apiListFuels);
router.put("/api/comp/:id/segment", AddSegment);

// fuel
router.post("/add/fuel", FuelTypes);
router.get("/view/fuel", FuelList);
router.delete("/fuel/delete/:id", FuelDelete);

// PAYOUTON
router.post("/add/payouton", PayoutOnAdd);
router.get("/view/payouton", PayoutOnList);
router.delete("/payouton/delete/:id", PayoutOnDelete);

// PAYment route
router.post("/add/payment/mode", PaymentAdd);
router.get("/view/payment/mode", PaymentModeList);
router.delete("/payment/delete/:id", PaymentDelete);

// ops Admin
router.post("/ops/register", addOpsRegister);
router.post("/ops/login", loginOps);
// password change
router.post("/forgot/ops/pass", forgotOpsPassword);
router.post("/ops/pass/:id/:token", opsPasswordReset);

// finanace
router.post("/finance/register", financeRegister);
router.post("/finance/login", loginFinance);
router.post("/forgot/finance/pass", forgotFinancePassword);
router.post("/finance/pass/:id/:token", financePasswordReset);

// holidays
router.post("/holidays/add", hDaysAdd);
router.get("/holidays/alllists", hDaysList);
router.delete("/holidays/:id/delete", hDaysDelete);

// oddiscount
router.post("/od/discounts", ODAdd);
router.get("/od/list", OdList);
router.delete("/od/del/:id", OdDelete);

// cc add
router.post("/cc/add", ccAdd);
router.get("/cc/show", CCList);
router.delete("/cc/remove/:id", CCDelete);

// sitting capacity
router.post("/sit/set", addSitCapacities);
router.get("/sit/show", viewSitCapacityList);
router.delete("/sit/capacity/:id", deleteSitting);
router.put("/sit/update/:id", updateSeating);

// ncb
router.post("/ncb/add", ncbAdds);
router.get("/ncb/show", ncbLists);
router.delete("/ncb/delete/:id", ncbDelete);

// LEAVETYPE
router.post("/leave/type/add", LeaveTypes);
// router.put("/lt/edit/:id", leaveTypeEdit);
router.get("/leave/type/show", LeaveTypeList);
router.delete("/leave/delete/:id", LeaveDelete);
// router.put('/leave/update/:id', LeaveNumberAdd);

export default router;
