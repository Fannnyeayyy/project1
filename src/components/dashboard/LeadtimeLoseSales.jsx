import { CheckCircle, Truck, Clock, AlertTriangle, XCircle } from "lucide-react";

const STATUSES = [
  { status: "Delivered",  color: "#10b981", bg: "#d1fae5", Icon: CheckCircle },
  { status: "In Transit", color: "#2563eb", bg: "#dbeafe", Icon: Truck },
  { status: "Pending",    color: "#64748b", bg: "#f1f5f9", Icon: Clock },
  { status: "Delayed",    color: "#ef4444", bg: "#fee2e2", Icon: AlertTriangle },
  { status: "Cancelled",  color: "#6b7280", bg: "#f3f4f6", Icon: XCircle },
];

function LeadtimeCard({ leadtimes }) {
  return (
    <div className="bg-white rounded-xl px-5 py-4" style={{ border: "1px solid #e2e8f0" }}>
      <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#94a3b8" }}>Status Leadtime</p>
      <div className="grid grid-cols-5 gap-2">
        {STATUSES.map(({ status, color, bg, Icon }) => {
          const count = leadtimes.filter(l => l.status === status).length;
          return (
            <div key={status} className="flex flex-col items-center justify-center py-2 rounded-lg gap-1" style={{ background: bg }}>
              <Icon size={13} style={{ color }} />
              <span className="text-base font-bold leading-none" style={{ color }}>{count}</span>
              <span className="text-[9px] font-semibold text-center leading-tight" style={{ color }}>{status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopLoseCard({ topLose, fmtM }) {
  return (
    <div className="bg-white rounded-xl px-5 py-4" style={{ border: "1px solid #e2e8f0" }}>
      <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#94a3b8" }}>Top Lose Sales</p>
      <div className="flex flex-col gap-2">
        {topLose.length > 0 ? topLose.map((r, i) => {
          const p = r.Product || r.product;
          const harga = Number(p?.hargaPerCarton || 0);
          const lose = Number(r.loseSales || 0) * harga;
          const maxLose = Number(topLose[0]?.loseSales || 1) * Number((topLose[0]?.Product || topLose[0]?.product)?.hargaPerCarton || 1);
          const pct = maxLose > 0 ? Math.round((lose / maxLose) * 100) : 0;
          return (
            <div key={r.id} className="flex items-center gap-2">
              <span className="text-[10px] font-bold w-3 flex-shrink-0" style={{ color: "#cbd5e1" }}>{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-xs font-medium truncate" style={{ color: "#334155", maxWidth: "65%" }}>{p?.name ?? "—"}</span>
                  <span className="text-xs font-bold" style={{ color: "#ef4444" }}>{fmtM(lose)}</span>
                </div>
                <div style={{ height: 3, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#ef4444", borderRadius: 99, opacity: 0.6 }} />
                </div>
              </div>
            </div>
          );
        }) : <p className="text-xs" style={{ color: "#94a3b8" }}>Belum ada data</p>}
      </div>
    </div>
  );
}

export default function LeadtimeLoseSales({ leadtimes, topLose, fmtM }) {
  return (
    <div className="grid grid-cols-2 gap-5 mb-6">
      <LeadtimeCard leadtimes={leadtimes} />
      <TopLoseCard topLose={topLose} fmtM={fmtM} />
    </div>
  );
}