/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  FileText,
  LayoutDashboard,
  Route,
  Settings,
  Ticket,
  Train,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { NavLink } from "react-router";

const menuItems = [
  {
    path: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Tổng quan hệ thống",
  },
  {
    path: "/admin/user-management",
    label: "Quản lý người dùng",
    icon: Users,
    description: "Quản lý tài khoản",
  },
  {
    path: "/admin/trainroute-management",
    label: "Quản lý tuyến đường",
    icon: Route,
    description: "Tuyến tàu và trạm",
  },
  {
    path: "/admin/tickets",
    label: "Quản lý vé",
    icon: Ticket,
    description: "Vé và giao dịch",
  },
  {
    path: "/admin/applications",
    label: "Đơn xét duyệt",
    icon: FileText,
    description: "Xét duyệt ưu tiên",
  },
];

function Sidebar({ collapsed, onToggle }) {
  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Train className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Metro Admin</h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              "h-8 w-8 p-0 hover:bg-gray-100",
              collapsed && "mx-auto"
            )}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-start gap-3 px-4 py-3 rounded-md transition-all duration-200",
                  collapsed && "justify-center px-3",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )
              }
            >
              <Icon className="w-5 h-5 mt-1 flex-shrink-0" />
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-gray-500">
                    {item.description}
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed ? (
          <div className="text-center">
            <p className="text-xs text-gray-500">Metro Ticket System v2.0</p>
            <p className="text-xs text-gray-400">© 2025 All rights reserved</p>
          </div>
        ) : (
          <div className="w-8 h-8 bg-gray-100 rounded-lg mx-auto" />
        )}
      </div>
    </div>
  );
}

export default Sidebar;
