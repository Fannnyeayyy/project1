import { useState } from "react";
import { Edit2, Save, X, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKS = ["week1", "week2", "week3", "week4"];
const WEEK_STYLES = [
  { color: "#3b82f6", bg: "#eff6ff", border: "#dbeafe" },
  { color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0" },
  { color: "#7c3aed", bg: "#faf5ff", border: "#e9d5ff" },
  { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
];

// Format angka jadi "18.622.480"
const fmtNum = (val) =>
  String(val || "").replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// Parse "18.622.480" → angka
const parseNum = (val) => parseInt(String(val || "0").replace(/\./g, "")) || 0;

// Total semua week
const weekTotal = (data) =>
  WEEKS.reduce((sum, w) => sum + parseNum(data?.[w]), 0).toLocaleString("id-ID");

// Format periodDate → "Mei 2025"
const fmtPeriod = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

export default function ForecastCard({
  forecastData, editForecastData,
  onSave, onChange,
  forecastIndex, forecastTotal, onNav,
}) {
  const [editing, setEditing] = useState(false);

  const handleSave = () => { onSave(); setEditing(false); };
  const handleCancel = () => setEditing(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col h-full" style={{ border: "1px solid #e2e8f0" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Forecast</span>
        {!editing && forecastData && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
            style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe" }}
            onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
            onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}
          >
            <Edit2 size={12} /> Edit
          </button>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {editing ? (
          <EditForm data={editForecastData} onChange={onChange} onSave={handleSave} onCancel={handleCancel} />
        ) : forecastData ? (
          <>
            <ViewMode data={forecastData} />

            {/* Navigasi bulan */}
            {forecastTotal > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
                <button
                  onClick={() => onNav(1)}
                  disabled={forecastIndex >= forecastTotal - 1}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-30"
                  style={{ background: "#f1f5f9", color: "#64748b", border: "none", cursor: forecastIndex >= forecastTotal - 1 ? "not-allowed" : "pointer" }}
                >
                  <ChevronLeft size={14} /> Sebelumnya
                </button>

                <span className="text-xs font-semibold" style={{ color: "#94a3b8" }}>
                  {forecastIndex + 1} / {forecastTotal}
                </span>

                <button
                  onClick={() => onNav(-1)}
                  disabled={forecastIndex <= 0}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-30"
                  style={{ background: "#f1f5f9", color: "#64748b", border: "none", cursor: forecastIndex <= 0 ? "not-allowed" : "pointer" }}
                >
                  Selanjutnya <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-center py-8" style={{ color: "#94a3b8" }}>Belum ada data forecast</p>
        )}
      </div>
    </div>
  );
}

function ViewMode({ data }) {
  return (
    <>
      {/* IMS Plan header */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-xl"
        style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1px solid #bfdbfe" }}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#2563eb" }}>IMS PLAN</p>
          <p className="text-xl font-bold" style={{ color: "#1e293b" }}>{data.plan}</p>
          {data.periodDate && (
            <p className="text-xs mt-1" style={{ color: "#64748b" }}>{fmtPeriod(data.periodDate)}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs font-medium mb-1" style={{ color: "#64748b" }}>Total Forecast</p>
          <p className="text-base font-bold" style={{ color: "#2563eb" }}>
            Rp {weekTotal(data)}
          </p>
        </div>
      </div>

      {/* Week cards */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {WEEKS.map((w, i) => {
          const { color, bg, border } = WEEK_STYLES[i];
          return (
            <div key={w} className="p-4 rounded-xl flex flex-col justify-between"
              style={{ background: bg, border: `1px solid ${border}` }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
                  Week {i + 1}
                </p>
              </div>
              <p className="text-sm font-bold" style={{ color: "#1e293b" }}>
                Rp {fmtNum(data[w])}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

function EditForm({ data, onChange, onSave, onCancel }) {
  const fields = [
    { key: "plan", label: "Plan" },
    ...WEEKS.map((w, i) => ({ key: w, label: `Week ${i + 1} (Rp)` })),
  ];

  return (
    <div className="flex flex-col gap-3 flex-1">
      {fields.map(({ key, label }) => (
        <div key={key}>
          <label className="text-xs font-semibold mb-1 block" style={{ color: "#64748b" }}>{label}</label>
          <input
            type="text"
            value={WEEKS.includes(key) ? fmtNum(data?.[key]) : (data?.[key] || "")}
            onChange={e => onChange(key, WEEKS.includes(key) ? e.target.value.replace(/\D/g, "") : e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg outline-none"
            style={{ border: "1px solid #e2e8f0", color: "#1e293b" }}
            onFocus={e => e.currentTarget.style.borderColor = "#3b82f6"}
            onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
          />
        </div>
      ))}
      <div className="flex gap-2 mt-auto pt-2">
        <button onClick={onSave}
          className="flex-1 flex items-center justify-center gap-2 text-white text-sm font-semibold py-2 rounded-lg"
          style={{ background: "#2563eb" }}>
          <Save size={14} /> Save
        </button>
        <button onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-lg"
          style={{ background: "#f1f5f9", color: "#64748b" }}>
          <X size={14} /> Cancel
        </button>
      </div>
    </div>
  );
}