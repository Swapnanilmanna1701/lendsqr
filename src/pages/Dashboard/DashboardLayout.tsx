import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { SearchProvider } from "../../contexts/SearchContext";
import "./Dashboard.scss";

const DashboardLayout: React.FC = () => (
  <SearchProvider>
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />

      <main className="dashboard-layout__main">
        <Outlet />
      </main>
    </div>
  </SearchProvider>
);

export default DashboardLayout;
