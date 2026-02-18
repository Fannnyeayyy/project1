import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-white flex items-center justify-between px-6 h-[58px] flex-shrink-0" style={{ borderBottom: "1px solid #e2e8f0" }}>
     <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Dashboard</h2>

      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">Admin</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #2563eb, #60a5fa)" }}
          >
            A
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all duration-150"
          style={{ color: "#94a3b8", borderColor: "#e2e8f0" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ef4444";
            e.currentTarget.style.borderColor = "#ef4444";
            e.currentTarget.style.background = "#fee2e2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;