import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onToggleSidebar={() => setCollapsed(!collapsed)} />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
