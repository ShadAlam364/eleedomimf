/* eslint-disable react/display-name */
import { memo } from "react";
import AdminDashboard from "../../admin/DashboardCompnent/AdminDashboard";

const HomepageAdvisor = memo(() => {
  return (
    <div className="p-1 mt-4 sm:ml-48 font-extrabold bg-slate-100">
      <AdminDashboard />
    </div>
  );
});

export default HomepageAdvisor;
