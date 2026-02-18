import React from "react";
import { Trash2, Eye, EyeOff, Edit } from "lucide-react";

function UserTable({ users, showPassword, onTogglePassword, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full">
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            {["ID", "Username", "Password", "Role", "Created At", "Action"].map(h => (
              <th key={h} className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: "#64748b" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users && users.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-sm" style={{ color: "#94a3b8" }}>
                Tidak ada data user
              </td>
            </tr>
          ) : (
            users && users.map((user) => (
              <tr
                key={user.id}
                style={{ borderBottom: "1px solid #f1f5f9" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* ID */}
                <td className="px-6 py-3.5">
                  <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>
                    {String(user.id).padStart(2, "0")}
                  </span>
                </td>

                {/* Username */}
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #2563eb, #60a5fa)" }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#1e293b" }}>{user.username}</span>
                  </div>
                </td>

                {/* Password */}
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono" style={{ color: "#64748b" }}>
                      {showPassword?.[user.id] ? user.password : "••••••••"}
                    </span>
                    <button
                      onClick={() => onTogglePassword?.(user.id)}
                      style={{ color: "#94a3b8" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#64748b"}
                      onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
                    >
                      {showPassword?.[user.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-3.5">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={
                      user.role === "admin"
                        ? { background: "#dbeafe", color: "#2563eb" }
                        : { background: "#f1f5f9", color: "#64748b" }
                    }
                  >
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                </td>

                {/* Created At */}
                <td className="px-6 py-3.5 text-sm" style={{ color: "#64748b" }}>
                  {new Date(user.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </td>

                {/* Action */}
                <td className="px-6 py-3.5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                      onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fca5a5"}
                      onMouseLeave={e => e.currentTarget.style.background = "#fee2e2"}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;