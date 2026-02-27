import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKS = ["week1", "week2", "week3", "week4"];

const parseNum = (val) => Number(val) || 0;

const fmtRp = (val) => {
  const num = parseNum(val);
  return `Rp ${num.toLocaleString("id-ID")}`;
};

const weekTotal = (data) => {
  const total = WEEKS.reduce((sum, w) => sum + parseNum(data?.[w]), 0);
  return fmtRp(total);
};

const fmtPeriod = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

export default function ForecastCard({
  forecastData,
  forecastIndex, forecastTotal, onNav,
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col h-full" style={{ border: "1px solid #e2e8f0" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Forecast</span>
        {forecastTotal > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNav(1)}
              disabled={forecastIndex >= forecastTotal - 1}
              className="flex items-center justify-center w-7 h-7 rounded-lg disabled:opacity-30"
              style={{ background: "#f1f5f9", border: "none", cursor: forecastIndex >= forecastTotal - 1 ? "not-allowed" : "pointer" }}
            >
              <ChevronLeft size={14} style={{ color: "#64748b" }} />
            </button>
            <span className="text-xs font-semibold" style={{ color: "#94a3b8" }}>
              {forecastIndex + 1} / {forecastTotal}
            </span>
            <button
              onClick={() => onNav(-1)}
              disabled={forecastIndex <= 0}
              className="flex items-center justify-center w-7 h-7 rounded-lg disabled:opacity-30"
              style={{ background: "#f1f5f9", border: "none", cursor: forecastIndex <= 0 ? "not-allowed" : "pointer" }}
            >
              <ChevronRight size={14} style={{ color: "#64748b" }} />
            </button>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col gap-5 flex-1">
        {forecastData ? (
          <>
            {/* IMS Plan header */}
            <div className="flex items-center justify-between p-5 rounded-xl"
              style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1px solid #bfdbfe" }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#2563eb" }}>IMS PLAN</p>
                {forecastData.periodDate && (
                  <p className="text-3xl font-bold" style={{ color: "#1e293b" }}>{fmtPeriod(forecastData.periodDate)}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium mb-1" style={{ color: "#64748b" }}>Total Forecast</p>
                <p className="text-2xl font-bold" style={{ color: "#2563eb" }}>
                  {weekTotal(forecastData)}
                </p>
              </div>
            </div>

            {/* Week cards */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              {WEEKS.map((w, i) => (
                <div key={w} className="flex flex-col justify-center px-5 py-4 rounded-xl"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#94a3b8" }}>
                    Week {i + 1}
                  </p>
                  <p className="text-base font-bold" style={{ color: "#1e293b" }}>
                    <span style={{ color: "#3b82f6" }}>● </span>
                    {fmtRp(forecastData[w])}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm" style={{ color: "#94a3b8" }}>No forecast data available</p>
          </div>
        )}
      </div>
    </div>
  );
}