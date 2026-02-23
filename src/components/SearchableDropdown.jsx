import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

function SearchableDropdown({ options = [], value, onChange, placeholder = "Pilih...", disabled = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  const selected = options.find(o => String(o.value) === String(value));

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      {/* Trigger */}
      <div
        onClick={() => !disabled && setOpen(o => !o)}
        style={{
          border: `1px solid ${open ? "#6366f1" : "#e2e8f0"}`,
          borderRadius: 8, padding: "8px 36px 8px 12px",
          fontSize: 14, color: selected ? "#1e293b" : "#94a3b8",
          background: disabled ? "#f8fafc" : "white",
          cursor: disabled ? "not-allowed" : "pointer",
          userSelect: "none", position: "relative",
          boxShadow: open ? "0 0 0 2px #e0e7ff" : "none",
        }}
      >
        {selected ? selected.label : placeholder}
        <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", display: "flex", gap: 4 }}>
          {selected && !disabled && (
            <X size={14} onClick={(e) => { e.stopPropagation(); handleSelect(""); }} style={{ cursor: "pointer" }} />
          )}
          <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "none", transition: "0.2s" }} />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "white", border: "1px solid #e2e8f0", borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 9999, overflow: "hidden"
        }}>
          {/* Search */}
          <div style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
            <Search size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cari..."
              style={{ border: "none", outline: "none", fontSize: 13, width: "100%", color: "#1e293b" }}
            />
          </div>
          {/* Options */}
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            <div
              onClick={() => handleSelect("")}
              style={{ padding: "8px 12px", fontSize: 13, color: "#94a3b8", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {placeholder}
            </div>
            {filtered.length > 0 ? filtered.map(o => (
              <div
                key={o.value}
                onClick={() => handleSelect(o.value)}
                style={{
                  padding: "8px 12px", fontSize: 13, cursor: "pointer",
                  background: String(o.value) === String(value) ? "#eff6ff" : "transparent",
                  color: String(o.value) === String(value) ? "#2563eb" : "#1e293b",
                  fontWeight: String(o.value) === String(value) ? 600 : 400,
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = String(o.value) === String(value) ? "#eff6ff" : "transparent"}
              >
                {o.label}
              </div>
            )) : (
              <div style={{ padding: "12px", fontSize: 13, color: "#94a3b8", textAlign: "center" }}>Tidak ditemukan</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableDropdown;
