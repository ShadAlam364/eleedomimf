/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import {
  Route,
  // RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import TextLoader from "../loader/TextLoader.jsx";
import LoginAll from "../Login/LoginAll.jsx";
// Lazy TextLoader components
const PolicyLists = lazy(() =>
  import("../advisor/API/PolicyLists/PolicyLists.jsx")
);
import Apps from "../components/apps/Apps.jsx";
const Companies = lazy(() => import("../components/about/Companies.jsx"));
const Feedback = lazy(() => import("../components/feedback/Feedback.jsx"));
// const Home = lazy(() => import("../components/home/Home.jsx"));
const DirectorMessage = lazy(() =>
  import("../components/about/DirectorMessage.jsx")
);
const Mission = lazy(() => import("../components/about/Mission.jsx"));
const Brochure = lazy(() => import("../components/downloads/Brochure.jsx"));
const Proposal = lazy(() => import("../components/downloads/Proposal.jsx"));
const ClaimForm = lazy(() => import("../components/downloads/ClaimForm.jsx"));
const ServiceClaim = lazy(() =>
  import("../components/service-request/ServiceClaim.jsx")
);
const Branch = lazy(() => import("../components/branch/Branch.jsx"));
const TrackRequest = lazy(() =>
  import("../components/track-request/TrackRequest.jsx")
);
const ComplaintForm = lazy(() =>
  import("../components/complaint/ComplaintForm.jsx")
);
const ContactUs = lazy(() => import("../components/contact/ContactUs.jsx"));
const Dashboard = lazy(() => import("../admin/admincomponents/Dashboard.jsx"));
const AddBranch = lazy(() =>
  import("../admin/admincomponents/Branch/AddBranch.jsx")
);
const AddEmployee = lazy(() =>
  import("../HumanResources/Employee/AddEmployee.jsx")
);
const AddHRSalary = lazy(() =>
  import("../admin/admincomponents/Salary/HrSalary.jsx")
);
const GenerateSalary = lazy(() =>
  import("../HumanResources/GenerateSalary/GenerateSalary.jsx")
);

const Policy = lazy(() =>
  import("../admin/admincomponents/reports/Policy.jsx")
);
const AddPolicyDetails = lazy(() =>
  import("../admin/admincomponents/PolicyLists/AddPolicyDetails.jsx")
);
const Layout = lazy(() => import("../admin/Layout.jsx"));
const ViewBranch = lazy(() =>
  import("../admin/admincomponents/Branch/ViewBranch.jsx")
);
const UpdateBranch = lazy(() =>
  import("../admin/admincomponents/Branch/UpdateBranch.jsx")
);
const ViewEmployee = lazy(() =>
  import("../HumanResources/Employee/ViewEmployee.jsx")
);
const ViewHRSalary = lazy(() =>
  import("../admin/admincomponents/Salary/ViewHrSalary.jsx")
);
const UpdateHRSalary = lazy(() =>
  import("../admin/admincomponents/Salary/UpdateHrSalary.jsx")
);
const ViewPolicy = lazy(() =>
  import("../admin/admincomponents/PolicyLists/ViewPolicy.jsx")
);
const Announcement = lazy(() =>
  import("../admin/admincomponents/Annoucement/Announcement.jsx")
);
const ViewGenSalary = lazy(() =>
  import("../HumanResources/GenerateSalary/ViewGenSalary.jsx")
);
const ProtectRoute = lazy(() => import("../admin/Protected.jsx"));
const BranchLayout = lazy(() => import("../branches/BranchLayout.jsx"));
const BranchDashboard = lazy(() =>
  import("../branches/BranchDash/BranchDashboard.jsx")
);
const BranchProtected = lazy(() => import("../branches/BranchProtect.jsx"));
const ViewClaim = lazy(() =>
  import("../admin/admincomponents/reports/ViewClaim.jsx")
);
const ViewComplaint = lazy(() =>
  import("../admin/admincomponents/reports/ViewComplaint.jsx")
);
const ViewContact = lazy(() =>
  import("../admin/admincomponents/reports/ViewContact.jsx")
);
const ViewFeedback = lazy(() =>
  import("../admin/admincomponents/reports/ViewFeedback.jsx")
);
const HealthInsurance = lazy(() =>
  import("../components/homeComponets/HealthInsurance.jsx")
);
const MotorInsurance = lazy(() =>
  import("../components/homeComponets/MotorInsurance.jsx")
);
const NonMotorInsurance = lazy(() =>
  import("../components/homeComponets/NonMotorInsurance.jsx")
);
const AddCompanies = lazy(() =>
  import("../admin/admincomponents/company/AddCompanies.jsx")
);
const ViewCompany = lazy(() =>
  import("../admin/admincomponents/company/ViewCompany.jsx")
);
const HealthPage = lazy(() =>
  import("../components/homeComponets/Health/HealthPage.jsx")
);
const MotorPage = lazy(() =>
  import("../components/homeComponets/Motor/MotorPage.jsx")
);
const NonMotorPage = lazy(() =>
  import("../components/homeComponets/Non_Motor/NonMotorPage.jsx")
);
const UserCarousel = lazy(() =>
  import("../admin/admincomponents/uploadCarousel/UserCarousel.jsx")
);
const ViewCarousel = lazy(() =>
  import("../admin/admincomponents/uploadCarousel/ViewCarousel.jsx")
);
const ViewUserFillCompany = lazy(() =>
  import("../admin/admincomponents/reports/ViewUserFillCompany.jsx")
);
const FamilyHealthPage = lazy(() =>
  import("../components/homeComponets/Health/FamilyHealthPage.jsx")
);
const EmpHealthPage = lazy(() =>
  import("../components/homeComponets/Health/EmpHealthPage.jsx")
);
const TwoWheeler = lazy(() =>
  import("../components/homeComponets/Motor/TwoWheeler.jsx")
);
const CommercialVehicle = lazy(() =>
  import("../components/homeComponets/Motor/CommercialVehicle.jsx")
);
const HomeInsPage = lazy(() =>
  import("../components/homeComponets/Non_Motor/HomeInsPage.jsx")
);
const BusinessInsPage = lazy(() =>
  import("../components/homeComponets/Non_Motor/BusinessInsPage.jsx")
);
const MarineInsPage = lazy(() =>
  import("../components/homeComponets/Non_Motor/MarineInsPage.jsx")
);
const ChallanView = lazy(() =>
  import("../components/homeComponets/viewChallan/ChallanView.jsx")
);
const Careers = lazy(() => import("../components/careers/Careers.jsx"));
const MasterForm = lazy(() =>
  import("../admin/admincomponents/MasterForm/MasterForm.jsx")
);
const ViewMasterForm = lazy(() =>
  import("../admin/admincomponents/MasterForm/ViewMasterForm.jsx")
);
const MasterView = lazy(() =>
  import("../branches/showInsuranceData/MasterView.jsx")
);
const ProtectedAdvisor = lazy(() =>
  import("../advisor/Dashboard/ProtectedAdvisor.jsx")
);
const InsuranceLists = lazy(() =>
  import("../advisor/showInsurance/InsuranceLists.jsx")
);
const LayoutAdvisor = lazy(() => import("../advisor/LayoutAdvisor.jsx"));
const AddAdvisor = lazy(() =>
  import("../admin/admincomponents/Advisor/AddAdvisor.jsx")
);
const ViewAdvisor = lazy(() =>
  import("../admin/admincomponents/Advisor/ViewAdvisor.jsx")
);
const UpdateAdvisor = lazy(() =>
  import("../admin/admincomponents/Advisor/UpdateAdvisor.jsx")
);
const HomepageAdvisor = lazy(() =>
  import("../advisor/Home/HomepageAdvisor.jsx")
);
const ForgotPassword = lazy(() => import("../advisor/ForgotPassword.jsx"));
const ForgetPassBranch = lazy(() => import("../branches/ForgetPassBranch.jsx"));
const UpdateEmployee = lazy(() =>
  import("../HumanResources/Employee/UpdateEmployee.jsx")
);
const UpdateGenSalary = lazy(() =>
  import("../HumanResources/GenerateSalary/UpdateGenSalary.jsx")
);
const ProtectedEmp = lazy(() => import("../Employee/ProtectedEmp.jsx"));
const LayoutEmp = lazy(() => import("../Employee/LayoutEmp.jsx"));
const ForgotEmpPassword = lazy(() =>
  import("../Employee/ForgotEmpPassword.jsx")
);
const ProtectedHr = lazy(() => import("../HumanResources/ProtectedHr.jsx"));
const LayoutHr = lazy(() => import("../HumanResources/LayoutHr.jsx"));
const AddHr = lazy(() => import("../admin/admincomponents/Hr/AddHr.jsx"));
const ViewHr = lazy(() => import("../admin/admincomponents/Hr/ViewHr.jsx"));
const DashboardHr = lazy(() =>
  import("../HumanResources/dashboard/DashboardHr.jsx")
);
const AddSalary = lazy(() => import("../HumanResources/Salary/AddSalary.jsx"));
const ViewSalary = lazy(() =>
  import("../HumanResources/Salary/ViewSalary.jsx")
);
const UpdateSalary = lazy(() =>
  import("../HumanResources/Salary/UpdateSalary.jsx")
);
const GenerateHrSalary = lazy(() =>
  import("../admin/admincomponents/GenerateSalary/GenerateSalary.jsx")
);
const ViewGenHrSalary = lazy(() =>
  import("../admin/admincomponents/GenerateSalary/ViewGenSalary.jsx")
);
const UpdateGenHrSalary = lazy(() =>
  import("../admin/admincomponents/Salary/UpdateHrSalary.jsx")
);
const HrAttendance = lazy(() =>
  import("../HumanResources/attendance/HrAttendance.jsx")
);
const AddHrAttendance = lazy(() =>
  import("../HumanResources/attendance/AddHrAttendance.jsx")
);
const EmpAttendance = lazy(() =>
  import("../Employee/attendance/EmpAttendance.jsx")
);
const DashboardEmp = lazy(() =>
  import("../Employee/Dashboard/DashboardEmp.jsx")
);
const AddAttendance = lazy(() =>
  import("../Employee/attendance/AddAttendance.jsx")
);
const ViewHrAttendace = lazy(() =>
  import("../admin/admincomponents/Hr/ViewHrAttendace.jsx")
);
const EmpAttendanceModal = lazy(() =>
  import("../HumanResources/Employee/EmpAttendanceModal.jsx")
);
const EmpCalendar = lazy(() =>
  import("../HumanResources/Employee/EmpCalendar.jsx")
);
const AddDataByBranch = lazy(() =>
  import("../branches/AddDetails/AddDataByBranch.jsx")
);
const OperationHead = lazy(() =>
  import("../admin/admincomponents/operationHead/OperationHead.jsx")
);
const StaffType = lazy(() =>
  import("../admin/admincomponents/stafftype/StaffType.jsx")
);
const EmpPolicy = lazy(() => import("../Employee/policy/EmpPolicy.jsx"));
const ForgetPassOps = lazy(() => import("../opsAdmin/ForgetPassOps.jsx"));
const ProtectOps = lazy(() => import("../opsAdmin/ProtectOps.jsx"));
const LayoutOps = lazy(() => import("../opsAdmin/LayoutOps.jsx"));
const DashboardOps = lazy(() =>
  import("../opsAdmin/OPSDashboard/DashboardOps.jsx")
);
const AllOpsDetails = lazy(() =>
  import("../opsAdmin/AllOpsDetails/AllOpsDetails.jsx")
);
// const LoginAll = lazy(() => import("../Login/LoginAll.jsx"));
const AdminForgot = lazy(() => import("../admin/AdminForgot.jsx"));
const AdpassUpdate = lazy(() => import("../admin/AdpassUpdate.jsx"));
const BrpassUpdate = lazy(() => import("../branches/BrpassUpdate.jsx"));
const OpspassUpdate = lazy(() => import("../opsAdmin/OpspassUpdate.jsx"));
const EmpPassUpdate = lazy(() => import("../Employee/EmpPassUpdate.jsx"));
const HrForgetAdmin = lazy(() => import("../HumanResources/HrForgetAdmin.jsx"));
const HrPassUpdate = lazy(() => import("../HumanResources/HrPassUpdate.jsx"));
const AddPolicyType = lazy(() =>
  import("../admin/admincomponents/PolicyType/AddPolicyType.jsx")
);
const AddProductType = lazy(() =>
  import("../admin/admincomponents/PolicyType/AddProductType.jsx")
);
const ProfileUpdate = lazy(() =>
  import("../Employee/updateProfile/ProfileUpdate.jsx")
);
const ForgetFinance = lazy(() => import("../finance/ForgetFinance.jsx"));
const ProtectFinance = lazy(() => import("../finance/ProtectFinance.jsx"));
const LayoutFinance = lazy(() => import("../finance/LayoutFinance.jsx"));
const DashboardFinance = lazy(() =>
  import("../finance/DashboardFinance/DashboardFinance.jsx")
);
const CompanyType = lazy(() =>
  import("../admin/admincomponents/companyType/CompanyType.jsx")
);
const CategoryType = lazy(() =>
  import("../admin/admincomponents/companyType/CategoryType.jsx")
);
const AddSegment = lazy(() =>
  import("../admin/admincomponents/Segment/AddSegment.jsx")
);
const AddFuel = lazy(() => import("../admin/admincomponents/Fuel/AddFuel.jsx"));
const AddPayoutOn = lazy(() =>
  import("../admin/admincomponents/PayoutOn/AddPayoutOn.jsx")
);
const AddPaymentMode = lazy(() =>
  import("../admin/admincomponents/PaymentMode/AddPaymentMode.jsx")
);
const ReportEmp = lazy(() =>
  import("../HumanResources/attendanceReport/ReportEmp.jsx")
);
const FinPassUpdate = lazy(() => import("../finance/FinPassUpdate.jsx"));
const HolidayAdd = lazy(() =>
  import("../admin/admincomponents/holiday/HolidayAdd.jsx")
);
const CurrentAttendance = lazy(() =>
  import("../HumanResources/attendanceReport/CurrentAttendance.jsx")
);
const AddFinance = lazy(() => import("../finance/FinanceData/AddFinance.jsx"));
const ViewFinance = lazy(() =>
  import("../finance/FinanceData/ViewFinance.jsx")
);
const SalarySlip = lazy(() =>
  import("../HumanResources/GenerateSalary/SalarySlip.jsx")
);
const OffersLetter = lazy(() =>
  import("../HumanResources/Letters/offers/OffersLetter.jsx")
);
const ResignationLetter = lazy(() =>
  import("../HumanResources/resign/ResignationLetter.jsx")
);
const TerminationLetter = lazy(() =>
  import("../HumanResources/Letters/termination/TerminationLetter.jsx")
);
const IncrementLetter = lazy(() =>
  import("../HumanResources/Letters/increment/IncrementLetter.jsx")
);
const JoiningLetter = lazy(() =>
  import("../HumanResources/Letters/joining/JoiningLetter.jsx")
);
// const LeaveApplication = lazy(() => import("../Employee/LeaveApplication/LeaveApplication.jsx"));
const AddPolicy = lazy(() =>
  import("../opsAdmin/AddPolicyByOPS/AddPolicy.jsx")
);
const AddOfferLetter = lazy(() =>
  import("../HumanResources/Letters/offers/AddOfferLetter.jsx")
);
const ViewOfferLetter = lazy(() =>
  import("../HumanResources/Letters/offers/ViewOfferLetter.jsx")
);
const AddJoining = lazy(() =>
  import("../HumanResources/Letters/joining/AddJoining.jsx")
);
const ViewJoining = lazy(() =>
  import("../HumanResources/Letters/joining/ViewJoining.jsx")
);
const AddIncrement = lazy(() =>
  import("../HumanResources/Letters/increment/AddIncrement.jsx")
);
const ViewIncrement = lazy(() =>
  import("../HumanResources/Letters/increment/ViewIncrement.jsx")
);
const ProtectedHrAdmin = lazy(() => import("../HRAdmin/ProtectedHr.jsx"));
const LayoutHrAdmin = lazy(() => import("../HRAdmin/LayoutHrAdmin.jsx"));
const DashHrAdmin = lazy(() => import("../HRAdmin/DashHrAdmin.jsx"));
const AddTerminator = lazy(() =>
  import("../HumanResources/Letters/termination/AddTerminator.jsx")
);
const ViewTerminate = lazy(() =>
  import("../HumanResources/Letters/termination/ViewTerminate.jsx")
);
const LeaveApproval = lazy(() =>
  import("../HumanResources/LeaveApproval/LeaveApproval.jsx")
);
const CommercialVehicles = lazy(() =>
  import("../branches/CommissionSlab/CommercialVehicles.jsx")
);
const PrivateCar = lazy(() =>
  import("../branches/CommissionSlab/PrivateCar.jsx")
);
const TwoWheelers = lazy(() =>
  import("../branches/CommissionSlab/TwoWheelers.jsx")
);
const CvLists = lazy(() =>
  import("../branches/ListsCommissionSlab/CvLists.jsx")
);
const PCLists = lazy(() =>
  import("../branches/ListsCommissionSlab/PCLists.jsx")
);
const TwLists = lazy(() =>
  import("../branches/ListsCommissionSlab/TwLists.jsx")
);
const CompanySlab = lazy(() =>
  import("../branches/CommissionSlab/CompanySlab.jsx")
);
const AddAdvisors = lazy(() =>
  import("../advisor/RegisterAdvisor/AddAdvisors.jsx")
);
const ListAdvisor = lazy(() =>
  import("../advisor/ShowListAdvisor/ListAdvisor.jsx")
);
const OdDiscount = lazy(() =>
  import("../admin/admincomponents/odDiscount/OdDiscount.jsx")
);
const Cc = lazy(() => import("../admin/admincomponents/CC/Cc.jsx"));
const SitCapacity = lazy(() =>
  import("../admin/admincomponents/SittingCapacity/SitCapacity.jsx")
);
const NcbData = lazy(() => import("../admin/admincomponents/NCB/NcbData.jsx"));
const Ledger1 = lazy(() =>
  import("../admin/admincomponents/Ledger/Ledger1.jsx")
);
const Ledger2 = lazy(() =>
  import("../admin/admincomponents/Ledger/Ledger2.jsx")
);
const Ledger3 = lazy(() =>
  import("../admin/admincomponents/Ledger/Ledger3.jsx")
);
const LeaveBalance = lazy(() =>
  import("../HumanResources/LeaveBalance/LeaveBalance.jsx")
);
const PayoutView = lazy(() => import("../advisor/payout/PayoutView.jsx"));
const DailyViewLeger = lazy(() =>
  import("../branches/ViewLeger/DailyViewLeger.jsx")
);
const MonthViewLeger = lazy(() =>
  import("../branches/ViewLeger/MonthViewLeger.jsx")
);
const UpdateMaster = lazy(() =>
  import("../admin/admincomponents/MasterForm/UpdateMaster.jsx")
);
const ListOfLeave = lazy(() =>
  import("../Employee/attendance/ListOfLeave.jsx")
);
const CareersView = lazy(() =>
  import("../admin/admincomponents/Careers/CareersView.jsx")
);
const ViewSal = lazy(() => import("../Employee/viewSalary/ViewSal.jsx"));
const Sports = lazy(() =>
  import("../admin/admincomponents/reports/Sports.jsx")
);
const ForgetCIC = lazy(() => import("../claim&indosrhment/ForgetPassCIC.jsx"));
const ForgetPassCIC = lazy(() =>
  import("../claim&indosrhment/ForgetPassCIC.jsx")
);
const ProtectCIC = lazy(() =>
  import("../claim&indosrhment/sidebar/ProtectCIC.jsx")
);
const LayoutCIC = lazy(() =>
  import("../claim&indosrhment/sidebar/LayoutCIC.jsx")
);
// const DashboardCIC = lazy(() => import("../claim&indosrhment/dashboard/DashboardCIC.jsx"));
const Claim = lazy(() =>
  import("../claim&indosrhment/allform/claim/Claim.jsx")
);
const Indorshment = lazy(() =>
  import("../claim&indosrhment/allform/indosh/Indorshment.jsx")
);
const Cancelation = lazy(() =>
  import("../claim&indosrhment/allform/cancelation/Cancelation.jsx")
);
const ViewClaimed = lazy(() =>
  import("../claim&indosrhment/allform/claim/ViewClaimed.jsx")
);
const ViewIndorsh = lazy(() =>
  import("../claim&indosrhment/allform/indosh/ViewIndorsh.jsx")
);
const ViewCancelation = lazy(() =>
  import("../claim&indosrhment/allform/cancelation/ViewCancelation.jsx")
);
const SubCompName = lazy(() => import("../branches/aigtata/SubCompName.jsx"));
const BranchClaimList = lazy(() =>
  import("../branches/cic/BranchClaimList.jsx")
);
const BranchIndorshment = lazy(() =>
  import("../branches/cic/BranchIndorshment.jsx")
);
const BranchCancelation = lazy(() =>
  import("../branches/cic/BranchCancelation.jsx")
);
const VisitDaily = lazy(() =>
  import("../Employee/DailyVisitReport/VisitDaily.jsx")
);
const ViewDailyVisit = lazy(() =>
  import("../Employee/DailyVisitReport/ViewDailyVisit.jsx")
);
const VisitReport = lazy(() =>
  import("../admin/admincomponents/VisitReport/VisitReport.jsx")
);
const Dvr = lazy(() => import("../branches/DVR/Dvr.jsx"));
const ReconAdvisor = lazy(() =>
  import("../admin/admincomponents/MasterForm/ReconAdvisor/ReconAdvisor.jsx")
);
const AllCompanyName = lazy(() =>
  import("../advisor/API/AllCompany/AllCompanyName.jsx")
);
const AdvResetPassword = lazy(() => import("../advisor/AdvResetPassword.jsx"));
const BranchLaout = lazy(() => import("../branches/BranchLaout.jsx"));
const VerifyPayments = lazy(() =>
  import("../advisor/API/TataAIG/CAR/CarPayment/VerifyPayments.jsx")
);
const NotFound = lazy(() => import("../notFound/NotFound.jsx"));
const CompSwitch = lazy(() =>
  import("../advisor/API/RenderCompany/CompSwitch.jsx")
);
import ApiLayout from "../advisor/API/Layout/ApiLayout.jsx";
import DynamicPolicyCard from "../advisor/API/AllCompany/DynamicPolicyCard.jsx";
import Home from "../Pages/Home.jsx";
import About from "../Pages/About.jsx";
import Service from "../Pages/Service.jsx";
import Missionvision from "../Pages/Mission_vision.jsx";
import Directormessage from "../Pages/Director_message.jsx";
import Claimform from "../Pages/Claimform.jsx";
import Contact from "../Pages/Contact.jsx";
import Career from "../Pages/Career.jsx";
import ApplicationForm from "../Pages/ApplicationForm.jsx";
import Feedbacks from "../Pages/Feedbacks.jsx";
import Claimed from "../Pages/Claimed.jsx";
import Branched from "../Pages/Branched.jsx";
import PolicyDashboard from "../admin/DashboardCompnent/PolicyDashboard.jsx";
import NewDashboard from "../admin/DashboardCompnent/NewDashboard.jsx";
import BranchPolicyRenewDashboard from "../branches/PolicyRenewDashboard/Branch-Policy-Renew-Dahboard.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route
        path="/"
        element={
          <Suspense fallback={<TextLoader />}>
            <Apps />
            {/* <Home /> */}
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback={<TextLoader />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<TextLoader />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="/about/about-us"
          element={
            <Suspense fallback={<TextLoader />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="/about/service"
          element={
            <Suspense fallback={<TextLoader />}>
              <Service />
            </Suspense>
          }
        />
        <Route
          path="/about/mission_vision"
          element={
            <Suspense fallback={<TextLoader />}>
              <Missionvision />
            </Suspense>
          }
        />
        <Route
          path="/about/director_message"
          element={
            <Suspense fallback={<TextLoader />}>
              <Directormessage />
            </Suspense>
          }
        />
        <Route
          path="/downloads"
          element={
            <Suspense fallback={<TextLoader />}>
              <Claimform />
            </Suspense>
          }
        />
        <Route
          path="/downloads/claimform"
          element={
            <Suspense fallback={<TextLoader />}>
              <Claimform />
            </Suspense>
          }
        />
        <Route
          path="/feedback"
          element={
            <Suspense fallback={<TextLoader />}>
              <Feedbacks />
            </Suspense>
          }
        />
        <Route
          path="/branch"
          element={
            <Suspense fallback={<TextLoader />}>
              <Branched />
            </Suspense>
          }
        />
        <Route
          path="/claim"
          element={
            <Suspense fallback={<TextLoader />}>
              <Claimed />
            </Suspense>
          }
        />

        <Route path="/contact" element={<Contact />} />
        <Route path="/career" element={<Career />} />
        <Route path="/apply/:position" element={<ApplicationForm />} />

        {/* home */}

        {/* health insurance */}
        <Route
          path="/healthinsurance"
          element={
            <Suspense fallback={<TextLoader />}>
              <HealthInsurance />
            </Suspense>
          }
        />
        <Route
          path="/healthinsurance/health"
          element={
            <Suspense fallback={<TextLoader />}>
              <HealthPage />
            </Suspense>
          }
        />
        <Route
          path="/healthinsurance/health2"
          element={
            <Suspense fallback={<TextLoader />}>
              <FamilyHealthPage />
            </Suspense>
          }
        />
        <Route
          path="/healthinsurance/health3"
          element={
            <Suspense fallback={<TextLoader />}>
              <EmpHealthPage />
            </Suspense>
          }
        />

        {/* motor */}
        <Route
          path="/motorinsurance"
          element={
            <Suspense fallback={<TextLoader />}>
              <MotorInsurance />
            </Suspense>
          }
        />
        <Route
          path="/motorinsurance/car"
          element={
            <Suspense fallback={<TextLoader />}>
              <MotorPage />
            </Suspense>
          }
        />
        <Route
          path="/motorinsurance/twowheeler"
          element={
            <Suspense fallback={<TextLoader />}>
              <TwoWheeler />
            </Suspense>
          }
        />
        <Route
          path="/motorinsurance/commervehicle"
          element={
            <Suspense fallback={<TextLoader />}>
              <CommercialVehicle />
            </Suspense>
          }
        />

        {/* non-motor */}
        <Route
          path="/nonmotorinsurance"
          element={
            <Suspense fallback={<TextLoader />}>
              <NonMotorInsurance />
            </Suspense>
          }
        />
        <Route
          path="/nonmotorinsurance/travelins"
          element={
            <Suspense fallback={<TextLoader />}>
              <NonMotorPage />
            </Suspense>
          }
        />
        <Route
          path="/nonmotorinsurance/homeins"
          element={
            <Suspense fallback={<TextLoader />}>
              <HomeInsPage />
            </Suspense>
          }
        />
        <Route
          path="/nonmotorinsurance/businessins"
          element={
            <Suspense fallback={<TextLoader />}>
              <BusinessInsPage />
            </Suspense>
          }
        />
        <Route
          path="/nonmotorinsurance/marineins"
          element={
            <Suspense fallback={<TextLoader />}>
              <MarineInsPage />
            </Suspense>
          }
        />

        {/* about us */}
        <Route
          path="/aboutus"
          element={
            <Suspense fallback={<TextLoader />}>
              <Companies />
            </Suspense>
          }
        />
        <Route
          path="/vision"
          element={
            <Suspense fallback={<TextLoader />}>
              <Mission />
            </Suspense>
          }
        />
        <Route
          path="/messages"
          element={
            <Suspense fallback={<TextLoader />}>
              <DirectorMessage />
            </Suspense>
          }
        />
        {/* downloads */}
        <Route
          path="/claimforms"
          element={
            <Suspense fallback={<TextLoader />}>
              <ClaimForm />
            </Suspense>
          }
        />
        <Route
          path="/proposal"
          element={
            <Suspense fallback={<TextLoader />}>
              <Proposal />
            </Suspense>
          }
        />
        <Route
          path="/brochures"
          element={
            <Suspense fallback={<TextLoader />}>
              <Brochure />
            </Suspense>
          }
        />

        {/* SERVICE */}
        <Route
          path="/serviceclaim"
          element={
            <Suspense fallback={<TextLoader />}>
              <ServiceClaim />
            </Suspense>
          }
        />
        {/* Branch */}
        <Route
          path="/branch"
          element={
            <Suspense fallback={<TextLoader />}>
              <Branch />
            </Suspense>
          }
        />
        {/* complaint */}
        <Route
          path="/complaintform"
          element={
            <Suspense fallback={<TextLoader />}>
              <ComplaintForm />
            </Suspense>
          }
        />
        {/* Contact us */}
        <Route
          path="/contactus"
          element={
            <Suspense fallback={<TextLoader />}>
              <ContactUs />
            </Suspense>
          }
        />
        <Route
          path="/careers"
          element={
            <Suspense fallback={<TextLoader />}>
              <Careers />
            </Suspense>
          }
        />
        <Route
          path="/feedback"
          element={
            <Suspense fallback={<TextLoader />}>
              <Feedback />
            </Suspense>
          }
        />
        <Route
          path="/track-request"
          element={
            <Suspense fallback={<TextLoader />}>
              <TrackRequest />
            </Suspense>
          }
        />
        {/* challans */}
        <Route
          path="/challans"
          element={
            <Suspense fallback={<TextLoader />}>
              <ChallanView />
            </Suspense>
          }
        />
      </Route>

      {/* all departments can login from here */}
      <Route
        path="/login"
        element={
          <Suspense fallback={<TextLoader />}>
            <LoginAll />
          </Suspense>
        }
      />

      {/* admin routes */}
      <Route
        path="/admin"
        element={
          <Suspense fallback={<TextLoader />}>
            <LoginAll />
          </Suspense>
        }
      />
      <Route
        path="/admin/forget"
        element={
          <Suspense fallback={<TextLoader />}>
            <AdminForgot />
          </Suspense>
        }
      />
      <Route
        path="/reset/password/admin/:adminId/:token"
        element={
          <Suspense fallback={<TextLoader />}>
            <AdpassUpdate />
          </Suspense>
        }
      />

      <Route
        element={
          <Suspense fallback={<TextLoader />}>
            <ProtectRoute />
          </Suspense>
        }
      >
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<TextLoader />}>
              <Layout />
            </Suspense>
          }
        >
          <Route
            path="policy-dashboard"
            element={
              <Suspense fallback={<TextLoader />}>
                <PolicyDashboard />
              </Suspense>
            }
          />

          <Route
            path="new-dashboard"
            element={
              <Suspense fallback={<TextLoader />}>
                <NewDashboard />
              </Suspense>
            }
          />

          <Route
            path="pol"
            element={
              <Suspense fallback={<TextLoader />}>
                <PolicyDashboard />
              </Suspense>
            }
          />

          <Route
            path=""
            element={
              <Suspense fallback={<TextLoader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/new"
            element={
              <Suspense fallback={<TextLoader />}>
                <Sports />
              </Suspense>
            }
          />
          {/* <Route
            path="/dashboard/onload"
            element={
              <Suspense fallback={<TextLoader />}>
                <PaginatedDataTable />
              </Suspense>
            }
          /> */}
          <Route
            path="/dashboard/addcompanies"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddCompanies />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/viewcompanies"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewCompany />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/addbranch"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddBranch />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/viewbranch"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewBranch />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/updatebranch"
            element={
              <Suspense fallback={<TextLoader />}>
                <UpdateBranch />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/addhr"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddHr />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/viewhr"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewHr />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/addhrsalary"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddHRSalary />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/viewhrsalary"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewHRSalary />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/updatehrsalary"
            element={
              <Suspense fallback={<TextLoader />}>
                <UpdateHRSalary />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/generate/salary"
            element={
              <Suspense fallback={<TextLoader />}>
                <GenerateHrSalary />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/update/gensalary"
            element={
              <Suspense fallback={<TextLoader />}>
                <UpdateGenHrSalary />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/view/generatesalary"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewGenHrSalary />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/view/attendance"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewHrAttendace />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/policy"
            element={
              <Suspense fallback={<TextLoader />}>
                <Policy />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/addpolicy"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddPolicyDetails />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/viewpolicy"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewPolicy />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/viewclaim"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewClaim />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/viewcomplaint"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewComplaint />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/viewfeedback"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewFeedback />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/viewcontact"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewContact />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/addcarousel"
            element={
              <Suspense fallback={<TextLoader />}>
                <UserCarousel />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/firstview/carousel"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewCarousel />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/viewfilledform"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewUserFillCompany />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/masterform"
            element={
              <Suspense fallback={<TextLoader />}>
                <MasterForm />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/viewmasterform"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewMasterForm />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/addAdvisor"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddAdvisor />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/viewadvisor"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewAdvisor />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/updateadvisor"
            element={
              <Suspense fallback={<TextLoader />}>
                <UpdateAdvisor />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/operation/head"
            element={
              <Suspense fallback={<TextLoader />}>
                <OperationHead />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/staff/type"
            element={
              <Suspense fallback={<TextLoader />}>
                <StaffType />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/policy/type"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddPolicyType />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/policy/lists"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddProductType />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/company/type"
            element={
              <Suspense fallback={<TextLoader />}>
                <CompanyType />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/company/lists"
            element={
              <Suspense fallback={<TextLoader />}>
                <CategoryType />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/segment/add"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddSegment />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/fuel/type"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddFuel />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/payout/type"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddPayoutOn />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/payment/type"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddPaymentMode />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/holiday/add"
            element={
              <Suspense fallback={<TextLoader />}>
                <HolidayAdd />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/commvehicle"
            element={
              <Suspense fallback={<TextLoader />}>
                <CommercialVehicles />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/payout/slab"
            element={
              <Suspense fallback={<TextLoader />}>
                <PrivateCar />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/advisor/slabs"
            element={
              <Suspense fallback={<TextLoader />}>
                <CompanySlab />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/payout/lists"
            element={
              <Suspense fallback={<TextLoader />}>
                <PCLists />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/advisor/payout/lists"
            element={
              <Suspense fallback={<TextLoader />}>
                <TwLists />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/oddiscount"
            element={
              <Suspense fallback={<TextLoader />}>
                <OdDiscount />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/CC"
            element={
              <Suspense fallback={<TextLoader />}>
                <Cc />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/ncb"
            element={
              <Suspense fallback={<TextLoader />}>
                <NcbData />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/sit/capacity"
            element={
              <Suspense fallback={<TextLoader />}>
                <SitCapacity />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/ledger1"
            element={
              <Suspense fallback={<TextLoader />}>
                <Ledger1 />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/ledger2"
            element={
              <Suspense fallback={<TextLoader />}>
                <Ledger2 />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/ledger3"
            element={
              <Suspense fallback={<TextLoader />}>
                <Ledger3 />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/updatemasterform"
            element={
              <Suspense fallback={<TextLoader />}>
                <UpdateMaster />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/announcemnets"
            element={
              <Suspense fallback={<TextLoader />}>
                <Announcement />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/career/view/list"
            element={
              <Suspense fallback={<TextLoader />}>
                <CareersView />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/cic/claim"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewClaimed />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/cic/indorshment"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewIndorsh />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/cic/cancelation"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewCancelation />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/daily/visits/view"
            element={
              <Suspense fallback={<TextLoader />}>
                <VisitReport />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/recon/adv/advis"
            element={
              <Suspense fallback={<TextLoader />}>
                <ReconAdvisor />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* BRANCHES ROUTES */}
      <Route
        path="/branches/branch/home/login"
        element={
          <Suspense fallback={<TextLoader />}>
            <BranchLaout />
          </Suspense>
        }
      />
      <Route
        path="/branches"
        element={
          <Suspense fallback={<TextLoader />}>
            <LoginAll />
          </Suspense>
        }
      />
      <Route
        path="/branches/forget"
        element={
          <Suspense fallback={<TextLoader />}>
            <ForgetPassBranch />
          </Suspense>
        }
      />
      <Route
        path="/reset/password/branch/:userId/:token"
        element={
          <Suspense fallback={<TextLoader />}>
            <BrpassUpdate />
          </Suspense>
        }
      />
      <Route
        element={
          <Suspense fallback={<TextLoader />}>
            {" "}
            <BranchProtected />{" "}
          </Suspense>
        }
      >
        <Route
          path="/branches/home"
          element={
            <Suspense fallback={<TextLoader />}>
              <BranchLayout />
            </Suspense>
          }
        >
          <Route
            path="/branches/home"
            element={
              <Suspense fallback={<TextLoader />}>
                <BranchDashboard />
              </Suspense>
            }
          />
           <Route
            path="/branches/home/dashboard/policy-dashboard"
            element={
              <Suspense fallback={<TextLoader />}>
                <BranchPolicyRenewDashboard />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/tataaig"
            element={
              <Suspense fallback={<TextLoader />}>
                <SubCompName />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/add/policy"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddDataByBranch />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/viewinsurance"
            element={
              <Suspense fallback={<TextLoader />}>
                <MasterView />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/commvehicle"
            element={
              <Suspense fallback={<TextLoader />}>
                <CommercialVehicles />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/pvtvehicle"
            element={
              <Suspense fallback={<TextLoader />}>
                <PrivateCar />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/payout"
            element={
              <Suspense fallback={<TextLoader />}>
                <TwoWheelers />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/advisor/register"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddAdvisors />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/advisor/lists"
            element={
              <Suspense fallback={<TextLoader />}>
                <ListAdvisor />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/commvehicle/lists"
            element={
              <Suspense fallback={<TextLoader />}>
                <CvLists />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/advisor/grids"
            element={
              <Suspense fallback={<TextLoader />}>
                <PCLists />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/payout/lists"
            element={
              <Suspense fallback={<TextLoader />}>
                <TwLists />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/daily/leger"
            element={
              <Suspense fallback={<TextLoader />}>
                <DailyViewLeger />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/monthly/leger"
            element={
              <Suspense fallback={<TextLoader />}>
                <MonthViewLeger />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/claim/lists"
            element={
              <Suspense fallback={<TextLoader />}>
                <BranchClaimList />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/indorsh/lists"
            element={
              <Suspense fallback={<TextLoader />}>
                <BranchIndorshment />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/cncl/lists"
            element={
              <Suspense fallback={<TextLoader />}>
                <BranchCancelation />
              </Suspense>
            }
          />
          <Route
            path="/branches/home/daily/visits"
            element={
              <Suspense fallback={<TextLoader />}>
                <Dvr />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* Advisor Routes */}
      <Route
        path="/advisor"
        element={
          <Suspense fallback={<TextLoader />}>
            <LoginAll />
          </Suspense>
        }
      />
      <Route
        path="/advisor/forget"
        element={
          <Suspense fallback={<TextLoader />}>
            <ForgotPassword />
          </Suspense>
        }
      />
      <Route
        path="/reset/password/advisor/:advId/:token"
        element={
          <Suspense fallback={<TextLoader />}>
            <AdvResetPassword />
          </Suspense>
        }
      />
      <Route
        element={
          <Suspense fallback={<TextLoader />}>
            <ProtectedAdvisor />
          </Suspense>
        }
      >
        <Route
          path="/advisor/home"
          element={
            <Suspense fallback={<TextLoader />}>
              <LayoutAdvisor />
            </Suspense>
          }
        >
          <Route
            path="/advisor/home"
            element={
              <Suspense fallback={<TextLoader />}>
                <HomepageAdvisor />
              </Suspense>
            }
          />
          <Route
            path="/advisor/home/insurance"
            element={
              <Suspense fallback={<TextLoader />}>
                <AllCompanyName />
              </Suspense>
            }
          />
          <Route
            path="/advisor/home/viewinsurance"
            element={
              <Suspense fallback={<TextLoader />}>
                <InsuranceLists />
              </Suspense>
            }
          />
          <Route
            path="/advisor/home/payout/view"
            element={
              <Suspense fallback={<TextLoader />}>
                <PayoutView />
              </Suspense>
            }
          />
        </Route>

        <Route
          path="/advisor/verify/pay/policy"
          element={
            <Suspense fallback={<TextLoader />}>
              <VerifyPayments />
            </Suspense>
          }
        />
        <Route
          path="/advisor/home/:insuranceName/:category"
          element={
            <Suspense fallback={<TextLoader />}>
              <ApiLayout />
            </Suspense>
          }
        >
          <Route
            path="lists"
            element={
              <Suspense fallback={<TextLoader />}>
                <PolicyLists />
              </Suspense>
            }
          />

          <Route
            path=":selectedCategory"
            element={
              <Suspense fallback={<TextLoader />}>
                <DynamicPolicyCard />
              </Suspense>
            }
          />
          <Route
            path=":selectedCategory/:path"
            element={
              <Suspense fallback={<TextLoader />}>
                <CompSwitch />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* Employee Routes */}
      <Route
        path="/employee"
        element={
          <Suspense fallback={<TextLoader />}>
            <LoginAll />
          </Suspense>
        }
      />
      <Route
        path="/employee/forget"
        element={
          <Suspense fallback={<TextLoader />}>
            <ForgotEmpPassword />
          </Suspense>
        }
      />
      <Route
        path="/reset/password/emp/:empsId/:token"
        element={
          <Suspense fallback={<TextLoader />}>
            <EmpPassUpdate />
          </Suspense>
        }
      />
      <Route
        element={
          <Suspense fallback={<TextLoader />}>
            <ProtectedEmp />
          </Suspense>
        }
      >
        <Route
          path="/employee/home"
          element={
            <Suspense fallback={<TextLoader />}>
              <LayoutEmp />
            </Suspense>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<TextLoader />}>
                <DashboardEmp />
              </Suspense>
            }
          />
          <Route
            path="/employee/home/profile"
            element={
              <Suspense fallback={<TextLoader />}>
                <ProfileUpdate />
              </Suspense>
            }
          />
          <Route
            path="/employee/home/add/attendance"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddAttendance />
              </Suspense>
            }
          />
          <Route
            path="/employee/home/attendance"
            element={
              <Suspense fallback={<TextLoader />}>
                <EmpAttendance />
              </Suspense>
            }
          />
          <Route
            path="/employee/home/policy"
            element={
              <Suspense fallback={<TextLoader />}>
                <EmpPolicy />
              </Suspense>
            }
          />
          <Route
            path="/employee/home/lists"
            element={
              <Suspense fallback={<TextLoader />}>
                <ListOfLeave />
              </Suspense>
            }
          />
          <Route
            path="/employee/home/monthly/salary"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewSal />
              </Suspense>
            }
          />
          <Route
            path="/employee/home/daily/visits/add"
            element={
              <Suspense fallback={<TextLoader />}>
                <VisitDaily />
              </Suspense>
            }
          />
          <Route
            path="/employee/home/daily/visits/view"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewDailyVisit />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* HR Routes */}
      <Route
        path="/hr"
        element={
          <Suspense fallback={<TextLoader />}>
            <LoginAll />
          </Suspense>
        }
      />
      <Route
        path="/hradmin/forget"
        element={
          <Suspense fallback={<TextLoader />}>
            <HrForgetAdmin />
          </Suspense>
        }
      />
      <Route
        path="/reset/password/hradmin/:hradId/:token"
        element={
          <Suspense fallback={<TextLoader />}>
            <HrPassUpdate />
          </Suspense>
        }
      />
      <Route
        element={
          <Suspense fallback={<TextLoader />}>
            <ProtectedHr />
          </Suspense>
        }
      >
        <Route
          path="/hr/home"
          element={
            <Suspense fallback={<TextLoader />}>
              <LayoutHr />
            </Suspense>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<TextLoader />}>
                <DashboardHr />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/addemployee"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddEmployee />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/viewemployee"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewEmployee />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/emp/modal/attendance"
            element={<EmpAttendanceModal />}
          />
          <Route
            path="/hr/home/emp/modal/attendance"
            element={
              <Suspense fallback={<TextLoader />}>
                <EmpAttendanceModal />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/updateemployee"
            element={
              <Suspense fallback={<TextLoader />}>
                <UpdateEmployee />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/emp/attendance"
            element={
              <Suspense fallback={<TextLoader />}>
                <EmpCalendar />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/addsalary"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddSalary />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/viewsalary"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewSalary />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/updatesalary"
            element={
              <Suspense fallback={<TextLoader />}>
                <UpdateSalary />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/generate/salary"
            element={
              <Suspense fallback={<TextLoader />}>
                <GenerateSalary />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/update/gensalary"
            element={
              <Suspense fallback={<TextLoader />}>
                <UpdateGenSalary />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/view/generate/salary"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewGenSalary />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/attendance"
            element={
              <Suspense fallback={<TextLoader />}>
                <HrAttendance />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/add/attendance"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddHrAttendance />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/attendance/report"
            element={
              <Suspense fallback={<TextLoader />}>
                <ReportEmp />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/attendance/current/date"
            element={
              <Suspense fallback={<TextLoader />}>
                <CurrentAttendance />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/salary/slip"
            element={
              <Suspense fallback={<TextLoader />}>
                <SalarySlip />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/add/offer/letter"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddOfferLetter />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/view/offer/letter"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewOfferLetter />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/offer/letters"
            element={
              <Suspense fallback={<TextLoader />}>
                <OffersLetter />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/resign/letter"
            element={
              <Suspense fallback={<TextLoader />}>
                <ResignationLetter />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/add/terminate/letter"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddTerminator />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/view/terminate/letter"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewTerminate />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/terminate/letter"
            element={
              <Suspense fallback={<TextLoader />}>
                <TerminationLetter />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/add/increment/letter"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddIncrement />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/view/increment/letter"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewIncrement />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/increment/letter"
            element={
              <Suspense fallback={<TextLoader />}>
                <IncrementLetter />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/add/joining/letter"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddJoining />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/view/joining/letter"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewJoining />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/joining/letter"
            element={
              <Suspense fallback={<TextLoader />}>
                <JoiningLetter />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/leave/approval"
            element={
              <Suspense fallback={<TextLoader />}>
                <LeaveApproval />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/leave/balance"
            element={
              <Suspense fallback={<TextLoader />}>
                <LeaveBalance />
              </Suspense>
            }
          />
          <Route
            path="/hr/home/updatesalary"
            element={
              <Suspense fallback={<TextLoader />}>
                <UpdateSalary />
              </Suspense>
            }
          />
          {/* <Route path="/hr/home/attendance" element={ <Suspense fallback={<TextLoader />}><EmpAttendance/> </Suspense>} /> */}
        </Route>
      </Route>

      {/* HR ADMIN */}
      <Route
        path="/hr/admin"
        element={
          <Suspense fallback={<TextLoader />}>
            <LoginAll />
          </Suspense>
        }
      />
      <Route element={<ProtectedHrAdmin />}>
        <Route path="/admin/hr/home" element={<LayoutHrAdmin />}>
          <Route
            path=""
            element={
              <Suspense fallback={<TextLoader />}>
                <DashHrAdmin />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* OPSAdmin */}
      <Route
        path="/ops"
        element={
          <Suspense fallback={<TextLoader />}>
            <LoginAll />
          </Suspense>
        }
      />
      <Route
        path="/ops/forget"
        element={
          <Suspense fallback={<TextLoader />}>
            <ForgetPassOps />
          </Suspense>
        }
      />
      <Route
        path="/reset/password/ops/:opsId/:token"
        element={
          <Suspense fallback={<TextLoader />}>
            <OpspassUpdate />
          </Suspense>
        }
      />
      <Route
        element={
          <Suspense fallback={<TextLoader />}>
            <ProtectOps />
          </Suspense>
        }
      >
        <Route path="/ops/home" element={<LayoutOps />}>
          <Route
            path=""
            element={
              <Suspense fallback={<TextLoader />}>
                <DashboardOps />
              </Suspense>
            }
          />
          <Route
            path="/ops/home/add/policy"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddPolicy />
              </Suspense>
            }
          />
          <Route
            path="/ops/home/policy"
            element={
              <Suspense fallback={<TextLoader />}>
                <AllOpsDetails />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* finance */}
      <Route
        path="/finance"
        element={
          <Suspense fallback={<TextLoader />}>
            <LoginAll />
          </Suspense>
        }
      />
      <Route
        path="/finance/forget"
        element={
          <Suspense fallback={<TextLoader />}>
            <ForgetFinance />
          </Suspense>
        }
      />
      <Route
        path="/reset/password/finance/:fId/:token"
        element={
          <Suspense fallback={<TextLoader />}>
            <FinPassUpdate />
          </Suspense>
        }
      />
      <Route
        element={
          <Suspense fallback={<TextLoader />}>
            <ProtectFinance />
          </Suspense>
        }
      >
        <Route
          path="/finance/home"
          element={
            <Suspense fallback={<TextLoader />}>
              <LayoutFinance />
            </Suspense>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<TextLoader />}>
                <DashboardFinance />
              </Suspense>
            }
          />
          <Route
            path="/finance/home/new"
            element={
              <Suspense fallback={<TextLoader />}>
                <AddFinance />
              </Suspense>
            }
          />
          {/* <Route
    path="/finance/home/update"
    element={
      <Suspense fallback={<TextLoader />}>
        <UpdateFinance />
      </Suspense>
    }
  /> */}
          <Route
            path="/finance/home/view"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewFinance />
              </Suspense>
            }
          />
          <Route
            path="/finance/home/daily/leger"
            element={
              <Suspense fallback={<TextLoader />}>
                <Ledger1 />
              </Suspense>
            }
          />
          <Route
            path="/finance/home/monthly/leger"
            element={
              <Suspense fallback={<TextLoader />}>
                <Ledger2 />
              </Suspense>
            }
          />
          <Route
            path="/finance/home/company/leger"
            element={
              <Suspense fallback={<TextLoader />}>
                <Ledger3 />
              </Suspense>
            }
          />
        </Route>
      </Route>
      {/* CLAIM/INDOSRSHMENT/CANCEL */}
      <Route
        path="/cic"
        element={
          <Suspense fallback={<TextLoader />}>
            <LoginAll />
          </Suspense>
        }
      />
      <Route
        path="/cic/forget"
        element={
          <Suspense fallback={<TextLoader />}>
            <ForgetCIC />
          </Suspense>
        }
      />
      <Route
        path="/reset/password/cic/:cId/:token"
        element={
          <Suspense fallback={<TextLoader />}>
            <ForgetPassCIC />
          </Suspense>
        }
      />
      <Route
        element={
          <Suspense fallback={<TextLoader />}>
            <ProtectCIC />
          </Suspense>
        }
      >
        <Route
          path="/cic/home"
          element={
            <Suspense fallback={<TextLoader />}>
              <LayoutCIC />
            </Suspense>
          }
        >
          <Route
            path="/cic/home"
            element={
              <Suspense fallback={<TextLoader />}>
                <Claim />
              </Suspense>
            }
          />
          <Route
            path="/cic/home/claims/view"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewClaimed />
              </Suspense>
            }
          />
          <Route
            path="/cic/home/indorsh"
            element={
              <Suspense fallback={<TextLoader />}>
                <Indorshment />
              </Suspense>
            }
          />
          <Route
            path="/cic/home/indorsh/view"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewIndorsh />
              </Suspense>
            }
          />
          <Route
            path="/cic/home/cancelation"
            element={
              <Suspense fallback={<TextLoader />}>
                <Cancelation />
              </Suspense>
            }
          />
          <Route
            path="/cic/home/cancelation/view"
            element={
              <Suspense fallback={<TextLoader />}>
                <ViewCancelation />
              </Suspense>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export { router };
