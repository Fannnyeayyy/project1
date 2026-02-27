import { useNavigate } from "react-router";
import indomaret from "../assets/Logo_Indomaret.png";
import { BarChart2, Package, Truck, TrendingUp, ArrowRight, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    Icon: BarChart2,
    title: "Dashboard Real-time",
    desc: "Monitor performa sales, service level, dan brand performance dalam satu tampilan.",
  },
  {
    Icon: Truck,
    title: "Tracking Leadtime",
    desc: "Pantau status pengiriman dari pabrik hingga tiba di distributor secara akurat.",
  },
  {
    Icon: Package,
    title: "Manajemen Stok",
    desc: "Kelola stok Indomaret dan distributor dengan data yang selalu terupdate.",
  },
  {
    Icon: TrendingUp,
    title: "Forecast & Analytics",
    desc: "Rencanakan target penjualan mingguan dan analisis tren 3 bulan terakhir.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f8fafc" }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-12 py-5 bg-white" style={{ borderBottom: "1px solid #e2e8f0" }}>
        <img src={indomaret} alt="Indomaret" style={{ height: 32 }} />
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "#2563eb" }}
        >
          Masuk <ArrowRight size={14} />
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
          style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}>
          <ShieldCheck size={13} /> Internal System — Indomaret Supply Chain
        </div>
        <h1 className="text-5xl font-bold mb-5 leading-tight" style={{ color: "#0f172a", maxWidth: 640 }}>
          Supply Chain Dashboard
        </h1>
        <p className="text-lg mb-10" style={{ color: "#64748b", maxWidth: 480 }}>
          Sistem monitoring dan manajemen supply chain Indomaret — dari stok, leadtime, hingga performa brand dalam satu platform.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#2563eb" }}
          >
            Masuk ke Dashboard <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="px-12 pb-24">
        <div className="grid grid-cols-4 gap-5 max-w-5xl mx-auto">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6" style={{ border: "1px solid #e2e8f0" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "#eff6ff" }}>
                <Icon size={20} style={{ color: "#2563eb" }} />
              </div>
              <p className="text-sm font-bold mb-2" style={{ color: "#1e293b" }}>{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-5 text-center text-xs" style={{ color: "#cbd5e1", borderTop: "1px solid #f1f5f9" }}>
        © {new Date().getFullYear()} Indomaret Supply Chain System. Internal use only.
      </footer>

    </div>
  );
}