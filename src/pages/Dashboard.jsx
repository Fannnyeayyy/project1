import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Edit2, Save, X, TrendingUp, Package, Tag, DollarSign, ArrowUpRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

function Dashboard() {
  const baseUrl = "http://localhost:3000/api/master-table/";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("Hansaplast");
  const [isEditingForecast, setIsEditingForecast] = useState(false);
  const [forecastData, setForecastData] = useState({
    plan: "Mei 1,5 m",
    week1: "18.622.480",
    week2: "72.241.100",
    week3: "354.064.758",
    week4: "79.171.170",
  });
  const [editForecastData, setEditForecastData] = useState({ ...forecastData });
  const [stats, setStats] = useState({
    totalSales: "Rp 333.333.000",
    totalProducts: 0,
    totalSubBrand: 0,
    growth: { sales: "+12.5%", products: "+5.2%", subBrand: "+3.1%" },
  });

  const forecastHistory = {
    April: { plan: "April 1,2 m", week1: "15.000.000", week2: "65.000.000", week3: "320.000.000", week4: "75.000.000" },
    Maret: { plan: "Maret 1,0 m", week1: "12.000.000", week2: "58.000.000", week3: "280.000.000", week4: "70.000.000" },
  };

  const brandData = {
    Hansaplast: {
      february: { value: 350000000, label: "350M" },
      maret: { value: 500000000, label: "500M" },
      april: { value: 800000000, label: "800M" },
      totalSales: "Rp 1.650.000.000",
      growth: "+18.5%",
    },
    NIVEA: {
      february: { value: 600000000, label: "600M" },
      maret: { value: 750000000, label: "750M" },
      april: { value: 920000000, label: "920M" },
      totalSales: "Rp 2.270.000.000",
      growth: "+22.3%",
    },
  };

  const currentBrandData = brandData[selectedBrand];
  const chartValues = [currentBrandData.february.value, currentBrandData.maret.value, currentBrandData.april.value];
  const maxValue = Math.max(...chartValues);
  const months = [
    { key: "february", label: "Feb", data: currentBrandData.february },
    { key: "maret", label: "Mar", data: currentBrandData.maret },
    { key: "april", label: "Apr", data: currentBrandData.april },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      const productsRes = await axios.get(`${baseUrl}product/list`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null);
      const subBrandsRes = await axios.get(`${baseUrl}sub-brand/list`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null);
      setStats((prev) => ({ ...prev, totalProducts: productsRes?.data?.length || 0, totalSubBrand: subBrandsRes?.data?.length || 0 }));
    } catch (error) { console.error("Error fetching data:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [navigate]);

  const handleSaveForecast = () => { setForecastData({ ...editForecastData }); setIsEditingForecast(false); };
  const handleForecastChange = (field, value) => setEditForecastData((prev) => ({ ...prev, [field]: value }));

  const statCards = [
    {
      label: "Total Sales",
      value: stats.totalSales,
      growth: stats.growth.sales,
      icon: DollarSign,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      label: "Total Product",
      value: loading ? "—" : stats.totalProducts,
      growth: stats.growth.products,
      icon: Package,
      color: "#10b981",
      bg: "#d1fae5",
    },
    {
      label: "Total Sub Brand",
      value: loading ? "—" : stats.totalSubBrand,
      growth: stats.growth.subBrand,
      icon: Tag,
      color: "#7c3aed",
      bg: "#ede9fe",
    },
  ];

  return (
    <div className="flex h-screen" style={{ background: "#f1f5f9" }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-7 py-6 flex flex-col">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "#1e293b" }}>Dashboard</h1>
            <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Selamat datang kembali, Admin</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-5 mb-6">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-white rounded-xl p-6 flex items-start justify-between" style={{ border: "1px solid #e2e8f0" }}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#94a3b8" }}>{card.label}</p>
                    <p className="text-3xl font-bold tracking-tight" style={{ color: "#1e293b" }}>{card.value}</p>
                    <div className="flex items-center gap-1 mt-3">
                      <ArrowUpRight size={13} style={{ color: "#10b981" }} />
                      <span className="text-xs font-semibold" style={{ color: "#10b981" }}>{card.growth}</span>
                      <span className="text-xs" style={{ color: "#94a3b8" }}>dari bulan lalu</span>
                    </div>
                  </div>
                  <div className="rounded-xl p-3.5 flex items-center justify-center" style={{ background: card.bg }}>
                    <Icon size={22} style={{ color: card.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">

            {/* Forecast Card */}
            <div className="bg-white rounded-xl overflow-hidden flex flex-col h-full" style={{ border: "1px solid #e2e8f0" }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Forecast</span>
                {!isEditingForecast && (
                  <button
                    onClick={() => { setEditForecastData({ ...forecastData }); setIsEditingForecast(true); }}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#dbeafe"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#eff6ff"}
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                {isEditingForecast ? (
                  <div className="flex flex-col gap-3">
                    {[
                      { key: "plan", label: "Plan" },
                      { key: "week1", label: "Week 1" },
                      { key: "week2", label: "Week 2" },
                      { key: "week3", label: "Week 3" },
                      { key: "week4", label: "Week 4" },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-xs font-semibold mb-1 block" style={{ color: "#64748b" }}>{label}</label>
                        <input
                          type="text"
                          value={editForecastData[key]}
                          onChange={(e) => handleForecastChange(key, e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all"
                          style={{ border: "1px solid #e2e8f0", color: "#1e293b" }}
                          onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                          onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                        />
                      </div>
                    ))}

                    {/* History */}
                    <div className="mt-2 pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#64748b" }}>History</p>
                      <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
                        {Object.entries(forecastHistory).map(([month, data]) => (
                          <div key={month} className="p-2.5 rounded-lg" style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                            <p className="text-xs font-semibold" style={{ color: "#1e293b" }}>{month} — {data.plan}</p>
                            <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>W1: {data.week1} · W2: {data.week2} · W3: {data.week3} · W4: {data.week4}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={handleSaveForecast}
                        className="flex-1 flex items-center justify-center gap-2 text-white text-sm font-semibold py-2 rounded-lg transition-all"
                        style={{ background: "#2563eb" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#1d4ed8"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#2563eb"}
                      >
                        <Save size={14} /> Save
                      </button>
                      <button
                        onClick={() => setIsEditingForecast(false)}
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-lg transition-all"
                        style={{ background: "#f1f5f9", color: "#64748b" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#e2e8f0"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#f1f5f9"}
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* IMS Plan header */}
                    <div className="flex items-center justify-between mb-6 p-4 rounded-xl" style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1px solid #bfdbfe" }}>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#2563eb" }}>IMS PLAN</p>
                        <p className="text-xl font-bold" style={{ color: "#1e293b" }}>{forecastData.plan}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium mb-1" style={{ color: "#64748b" }}>Total Forecast</p>
                        <p className="text-base font-bold" style={{ color: "#2563eb" }}>
                          Rp {[forecastData.week1, forecastData.week2, forecastData.week3, forecastData.week4]
                            .map(v => parseInt(v.replace(/\./g, "")) || 0)
                            .reduce((a, b) => a + b, 0)
                            .toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    {/* Week cards */}
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      {[
                        { label: "Week 1", val: forecastData.week1, color: "#3b82f6", bg: "#eff6ff", border: "#dbeafe" },
                        { label: "Week 2", val: forecastData.week2, color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0" },
                        { label: "Week 3", val: forecastData.week3, color: "#7c3aed", bg: "#faf5ff", border: "#e9d5ff" },
                        { label: "Week 4", val: forecastData.week4, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
                      ].map(({ label, val, color, bg, border }) => (
                        <div key={label} className="p-4 rounded-xl flex flex-col justify-between" style={{ background: bg, border: `1px solid ${border}` }}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>{label}</p>
                          </div>
                          <p className="text-sm font-bold" style={{ color: "#1e293b" }}>Rp {val}</p>
                        </div>
                      ))}
                    </div>

                    {/* History section */}
                    <div className="mt-5 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
                      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Riwayat Bulan Lalu</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(forecastHistory).map(([month, data]) => (
                          <div key={month} className="p-3 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                            <p className="text-xs font-bold mb-1" style={{ color: "#1e293b" }}>{month}</p>
                            <p className="text-xs" style={{ color: "#94a3b8" }}>{data.plan}</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {["week1", "week2", "week3", "week4"].map((w, i) => (
                                <span key={w} className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: "#e2e8f0", color: "#64748b" }}>
                                  W{i + 1}: {data[w]}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Brand Performance Card */}
            <div className="bg-white rounded-xl overflow-hidden flex flex-col h-full" style={{ border: "1px solid #e2e8f0" }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Brand Performance</span>
                <div className="flex gap-1.5">
                  {Object.keys(brandData).map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background: selectedBrand === brand ? "#2563eb" : "#f1f5f9",
                        color: selectedBrand === brand ? "white" : "#64748b",
                      }}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                {/* Bar Chart */}
                <div className="flex items-end gap-5 mb-4 flex-1" style={{ minHeight: "180px" }}>
                  {months.map(({ key, label, data }) => {
                    const heightPct = (data.value / maxValue) * 100;
                    return (
                      <div key={key} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                        <span className="text-xs font-semibold" style={{ color: "#64748b" }}>Rp {data.label}</span>
                        <div className="w-full flex items-end" style={{ flex: 1 }}>
                          <div
                            className="w-full rounded-t-lg transition-all duration-500"
                            style={{
                              height: `${heightPct}%`,
                              minHeight: "24px",
                              background: "linear-gradient(180deg, #60a5fa, #2563eb)",
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>{label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Brand info bottom */}
                <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
                  <div>
                    <p className="text-xs font-medium mb-0.5" style={{ color: "#94a3b8" }}>Total Sales — {selectedBrand}</p>
                    <p className="text-base font-bold" style={{ color: "#1e293b" }}>{currentBrandData.totalSales}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ background: "#d1fae5" }}>
                    <TrendingUp size={14} style={{ color: "#10b981" }} />
                    <span className="text-sm font-bold" style={{ color: "#10b981" }}>{currentBrandData.growth}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;