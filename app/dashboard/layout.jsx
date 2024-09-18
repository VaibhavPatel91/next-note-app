import React from "react";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
function DashboardLayout({ children }) {
  return (
    <div>
      <DashboardNavbar />
      {children}
    </div>
  );
}

export default DashboardLayout;
