import { DollarSign, Package, Tag, ArrowUpRight } from "lucide-react";

export default function StatCards({ loading, totalSales, totalProducts, totalSubBrands, fmtM }) {
  const cards = [
    { label: "Total Sales",     value: loading ? "—" : fmtM(totalSales), color: "#2563eb", bg: "#eff6ff", Icon: DollarSign, showTrend: true },
    { label: "Total Product",   value: loading ? "—" : totalProducts,    color: "#10b981", bg: "#d1fae5", Icon: Package,     showTrend: false, big: true },
    { label: "Total Sub Brand", value: loading ? "—" : totalSubBrands,   color: "#7c3aed", bg: "#ede9fe", Icon: Tag,         showTrend: false, big: true },
  ];

  return (
    <div className="grid grid-cols-3 gap-5 mb-6">
      {cards.map(({ label, value, color, bg, Icon, showTrend, big }) => (
        <div key={label} className="bg-white rounded-xl p-6 flex items-start justify-between" style={{ border: "1px solid #e2e8f0" }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#94a3b8" }}>{label}</p>
            <p className={`${big ? "text-4xl" : "text-3xl"} font-bold tracking-tight`} style={{ color: "#1e293b" }}>{value}</p>
            {showTrend ? (
              <div className="flex items-center gap-1 mt-3">
                <ArrowUpRight size={13} style={{ color: "#10b981" }} />
                <span className="text-xs" style={{ color: "#94a3b8" }}>dari bulan lalu</span>
              </div>
            ) : (
              <div className="mt-3" style={{ height: "20px" }} />
            )}
          </div>
          <div className="rounded-xl p-3.5" style={{ background: bg }}>
            <Icon size={22} style={{ color }} />
          </div>
        </div>
      ))}
    </div>
  );
} 