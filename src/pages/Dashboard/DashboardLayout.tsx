import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { SearchProvider } from "../../contexts/SearchContext";
import "./Dashboard.scss";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <SearchProvider>
      <div className="dashboard-layout">
        <Navbar onMenuToggle={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <main className="dashboard-layout__main">
          <Outlet />
        </main>
      </div>
    </SearchProvider>
  );
};

export default DashboardLayout;
