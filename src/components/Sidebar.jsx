import React from "react";
import { Link, useLocation } from "react-router";
import { Home, FileText, User, ChevronsLeft,Table2 } from "lucide-react";
import indomaret from "../assets/Logo_Indomaret.png";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  // Menu items ada di Sidebar aja
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },
    {
      name: "Detail",
      path: "/detail",
      icon: FileText,
    },
    {
      name: "MasterTable",
      path: "/master-table",
      icon: Table2,
    },
    {
      name: "User",
      path: "/user",
      icon: User,
    },
    
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-white shadow-lg transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 h-16 border-b border-gray-200 px-4">
          {sidebarOpen ? (
            <>
              <img src={indomaret} alt="Indomaret" className="h-8 w-auto" />
              <h1 className="font-bold text-indigo-600 text-xl">Indomaret</h1>
            </>
          ) : (
            <img src={indomaret} alt="Indomaret" className="h-8 w-auto" />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? "text-gray-700 bg-indigo-50 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Toggle Sidebar Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronsLeft
              size={20}
              className={`transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
            />
            {sidebarOpen && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;