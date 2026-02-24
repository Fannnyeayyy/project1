import { TrendingUp, TrendingDown } from "lucide-react";

export default function BrandPerformanceCard({
  brands, selectedBrand, onSelectBrand,
  subBrandChart,
  totalActualSelected, totalLoseSelected, totalLabel,
  fmtM,
}) {
  const maxValue = Math.max(...subBrandChart.map(d => d.actual), 1);

  const growth = subBrandChart.length >= 2
    ? (((subBrandChart.at(-1)?.actual - subBrandChart[0]?.actual) / (subBrandChart[0]?.actual || 1)) * 100).toFixed(1)
    : null;

  const isPositive = parseFloat(growth) >= 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col h-full" style={{ border: "1px solid #e2e8f0" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>
          Brand Performance
        </span>
        <div className="flex gap-1.5">
          {brands.map(b => (
            <button
              key={b.name}
              onClick={() => onSelectBrand(b.name)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: selectedBrand === b.name ? "#2563eb" : "#f1f5f9",
                color: selectedBrand === b.name ? "white" : "#64748b",
                border: "none", cursor: "pointer",
              }}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {subBrandChart.length > 0 ? (
          <>
            {/* Bar Chart — pure CSS seperti referensi */}
            <div className="flex items-end gap-5 mb-4 flex-1" style={{ minHeight: "260px" }}>
              {subBrandChart.map(({ label, actual, lose }) => {
                const actualPct = (actual / maxValue) * 100;
                const losePct   = (lose   / maxValue) * 100;
                return (
                  <div key={label} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                    {/* Label nilai actual */}
                    <span className="text-xs font-semibold" style={{ color: "#64748b" }}>{fmtM(actual)}</span>

                    {/* Dua bar berdampingan */}
                    <div className="w-full flex gap-1 items-end" style={{ flex: 1 }}>
                      {/* Actual bar */}
                      <div className="flex-1 flex items-end" style={{ height: "100%" }}>
                        <div
                          className="w-full rounded-t-lg transition-all duration-500"
                          style={{
                            height: `${actualPct}%`,
                            minHeight: "32px",
                            background: "linear-gradient(180deg, #60a5fa, #2563eb)",
                          }}
                        />
                      </div>
                      {/* Lose bar */}
                      <div className="flex-1 flex items-end" style={{ height: "100%" }}>
                        <div
                          className="w-full rounded-t-lg transition-all duration-500"
                          style={{
                            height: `${losePct}%`,
                            minHeight: lose > 0 ? "24px" : "0px",
                            background: "linear-gradient(180deg, #fca5a5, #ef4444)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Label bulan */}
                    <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>{label}</span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <div style={{ width: 10, height: 10, borderRadius: 3, background: "linear-gradient(180deg,#60a5fa,#2563eb)" }} />
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Actual Sales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div style={{ width: 10, height: 10, borderRadius: 3, background: "linear-gradient(180deg,#fca5a5,#ef4444)" }} />
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Lose Sales</span>
              </div>
            </div>

            {/* Summary bottom — per bulan */}
            <div className="pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94a3b8" }}>
                  Ringkasan per Bulan
                </p>
                {growth !== null && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ background: isPositive ? "#d1fae5" : "#fee2e2" }}>
                    {isPositive
                      ? <TrendingUp size={12} style={{ color: "#10b981" }} />
                      : <TrendingDown size={12} style={{ color: "#ef4444" }} />
                    }
                    <span className="text-xs font-bold" style={{ color: isPositive ? "#10b981" : "#ef4444" }}>
                      {isPositive ? "+" : ""}{growth}%
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                {subBrandChart.map(({ label, actual, lose }) => (
                  <div key={label} className="flex-1 rounded-xl p-3" style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#94a3b8" }}>{label}</p>
                    <div className="flex items-center gap-1 mb-1">
                      <div style={{ width: 6, height: 6, borderRadius: 2, background: "linear-gradient(180deg,#60a5fa,#2563eb)", flexShrink: 0 }} />
                      <p className="text-xs font-bold" style={{ color: "#1e293b" }}>{fmtM(actual)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div style={{ width: 6, height: 6, borderRadius: 2, background: "linear-gradient(180deg,#fca5a5,#ef4444)", flexShrink: 0 }} />
                      <p className="text-xs font-semibold" style={{ color: "#ef4444" }}>{fmtM(lose)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm" style={{ color: "#94a3b8" }}>Belum ada data</p>
          </div>
        )}
      </div>
    </div>
  );
}