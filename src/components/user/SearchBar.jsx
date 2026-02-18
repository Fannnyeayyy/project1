import React from "react";
import { Search, Plus } from "lucide-react";

function SearchBar({ searchTerm, onSearchChange, onAddUser, loading, total }) {
  return (
    <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
      <div className="flex items-center gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={13} style={{ color: "#94a3b8" }} />
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Cari username atau role..."
            className="w-full pl-8 pr-4 py-2 text-sm rounded-lg outline-none transition-all"
            style={{ border: "1px solid #e2e8f0", background: "#f8fafc", color: "#1e293b" }}
            onFocus={e => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.background = "white"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
          />
        </div>
        <span className="text-xs" style={{ color: "#94a3b8" }}>
          <strong style={{ color: "#2563eb" }}>{total}</strong> user ditemukan
        </span>
      </div>

      <button
        onClick={onAddUser}
        disabled={loading}
        className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150 disabled:opacity-50"
        style={{ background: "#2563eb" }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1d4ed8"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#2563eb"; }}
      >
        <Plus size={14} /> Tambah User
      </button>
    </div>
  );
}

export default SearchBar;