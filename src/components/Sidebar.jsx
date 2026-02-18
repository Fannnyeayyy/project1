import React from "react";
import { Link, useLocation } from "react-router";
import { Home, FileText, User, ChevronsLeft, Table2 } from "lucide-react";
import indomaret from "../assets/Logo_Indomaret.png";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home, section: "Main" },
    { name: "Detail", path: "/detail", icon: FileText, section: "Main" },
    { name: "Master Table", path: "/master-table", icon: Table2, section: "Main" },
    { name: "User", path: "/user", icon: User, section: "Admin" },
  ];

  const isActive = (path) => location.pathname === path;
  const sections = ["Main", "Admin"];

  return (
    <aside
      className={`${sidebarOpen ? "w-56" : "w-[72px]"} flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out`}
      style={{ background: "#1e293b", borderRight: "1px solid #273549" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 h-[58px] flex-shrink-0"
        style={{ borderBottom: "1px solid #273549" }}
      >
        <img src={indomaret} alt="Indomaret" className="h-7 w-auto flex-shrink-0" />
        {sidebarOpen && (
          <div>
            <div className="text-sm font-bold text-white leading-tight">Indomaret</div>
            <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#475569" }}>
              Management
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        {sections.map((section) => {
          const items = menuItems.filter((m) => m.section === section);
          return (
            <div key={section} className="mb-2">
              {sidebarOpen && (
                <div className="text-[10px] font-semibold uppercase tracking-widest px-2 py-2" style={{ color: "#475569" }}>
                  {section}
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={!sidebarOpen ? item.name : undefined}
                      className={`flex items-center gap-3 rounded-lg transition-all duration-150 ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}`}
                      style={{ background: active ? "#2563eb" : "transparent", color: active ? "white" : "#94a3b8" }}
                      onMouseEnter={(e) => {
                        if (!active) { e.currentTarget.style.background = "#273549"; e.currentTarget.style.color = "#e2e8f0"; }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }
                      }}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Collapse */}
      <div className="p-3" style={{ borderTop: "1px solid #273549" }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`w-full flex items-center rounded-lg py-2 transition-all duration-150 ${sidebarOpen ? "gap-2 px-3" : "justify-center px-0"}`}
          style={{ color: "#64748b" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#273549"; e.currentTarget.style.color = "#e2e8f0"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
        >
          <ChevronsLeft size={18} className={`transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`} />
          {sidebarOpen && <span className="text-xs font-medium">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;