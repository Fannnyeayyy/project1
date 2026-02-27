import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { CalendarDays } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCards from "../components/dashboard/StatCards";
import LeadtimeLoseSales from "../components/dashboard/LeadtimeLoseSales";
import ForecastCard from "../components/dashboard/ForecastCard";
import BrandPerformanceCard from "../components/dashboard/BrandPerformanceCard";

const BASE = "http://localhost:3000/api";

export const fmtM = (n) => {
  const num = Number(n || 0);
  if (num >= 1e9) return `Rp ${(num / 1e9).toFixed(1)}M`;
  if (num >= 1e6) return `Rp ${(num / 1e6).toFixed(0)}jt`;
  return `Rp ${num.toLocaleString("id-ID")}`;
};

const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // State Data
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [leadtimes, setLeadtimes] = useState([]);
  const [subBrands, setSubBrands] = useState([]);
  const [serviceLevel, setServiceLevel] = useState([]);

  // State Forecast
  const [forecastList, setForecastList] = useState([]);
  const [forecastIndex, setForecastIndex] = useState(0);

  // State UI
  const [selectedBrand, setSelectedBrand] = useState("");

  // State Filter Periode
  const [selectedMonth, setSelectedMonth] = useState(""); // "YYYY-MM" atau "" = semua
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetchAll(token);
  }, [navigate]);

  const fetchAll = async (token) => {
    setLoading(true);
    const h = { Authorization: `Bearer ${token}` };
    try {
      const [bRes, pRes, sbRes, fcRes, ltRes, slRes] = await Promise.all([
        axios.get(`${BASE}/master-table/`, { headers: h }).catch(() => ({ data: [] })),
        axios.get(`${BASE}/master-table/product/list`, { headers: h }).catch(() => ({ data: [] })),
        axios.get(`${BASE}/master-table/sub-brand/list`, { headers: h }).catch(() => ({ data: [] })),
        axios.get(`${BASE}/detail/forecast`, { headers: h }).catch(() => ({ data: { data: [] } })),
        axios.get(`${BASE}/detail/leadtime`, { headers: h }).catch(() => ({ data: { data: [] } })),
        axios.get(`${BASE}/detail/service-level`, { headers: h }).catch(() => ({ data: { data: [] } })),
      ]);

      const brandList = bRes.data || [];
      const fcList = fcRes.data?.data || [];
      const slList = slRes.data?.data || [];
      const ltList = ltRes.data?.data || [];

      setBrands(brandList);
      setProducts(pRes.data || []);
      setSubBrands(sbRes.data || []);
      setLeadtimes(ltList);
      setServiceLevel(slList);
      if (brandList.length > 0) setSelectedBrand(brandList[0].name);

      // Extract available months dari data yang ada
      const allDates = [
        ...slList.map(r => r.periodDate),
        ...ltList.map(r => r.eta || r.tanggalKeluarPabrik),
        ...fcList.map(r => r.periodDate),
      ].filter(Boolean).map(d => d.slice(0, 7));
      const uniqueMonths = [...new Set(allDates)].sort().reverse();
      setAvailableMonths(uniqueMonths);
      setSelectedMonth(uniqueMonths[0] || "");

      if (fcList.length > 0) {
        // Aggregate forecast per bulan (sum semua product dalam bulan yang sama)
        const byMonth = {};
        fcList.forEach(fc => {
          const month = fc.periodDate?.slice(0, 7) || "unknown";
          if (!byMonth[month]) byMonth[month] = { periodDate: fc.periodDate, week1: 0, week2: 0, week3: 0, week4: 0 };
          byMonth[month].week1 += Number(fc.week1) || 0;
          byMonth[month].week2 += Number(fc.week2) || 0;
          byMonth[month].week3 += Number(fc.week3) || 0;
          byMonth[month].week4 += Number(fc.week4) || 0;
        });
        const mapped = Object.values(byMonth)
          .sort((a, b) => new Date(b.periodDate || 0) - new Date(a.periodDate || 0))
          .map(fc => ({
            periodDate: fc.periodDate,
            week1: fc.week1,
            week2: fc.week2,
            week3: fc.week3,
            week4: fc.week4,
          }));
        setForecastList(mapped);
        setForecastIndex(0);
      }
    } catch (e) {
      console.error("[Dashboard] Critical fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Format label bulan untuk dropdown
  const fmtMonthLabel = (ym) => {
    if (!ym) return "All Periods";
    const [year, month] = ym.split("-");
    return `${MONTHS_ID[parseInt(month) - 1]} ${year}`;
  };

  // Filter serviceLevel berdasarkan periode yang dipilih
  const filteredServiceLevel = useMemo(() => {
    if (!selectedMonth) return serviceLevel;
    return serviceLevel.filter(r => r.periodDate?.startsWith(selectedMonth));
  }, [serviceLevel, selectedMonth]);

  // Filter leadtime berdasarkan periode (gunakan eta atau tanggal keluarPabrik)
  const filteredLeadtimes = useMemo(() => {
    if (!selectedMonth) return leadtimes;
    return leadtimes.filter(r => {
      const d = r.eta || r.tanggalKeluarPabrik || "";
      return d.startsWith(selectedMonth);
    });
  }, [leadtimes, selectedMonth]);

  // Filter forecast berdasarkan periode
  const filteredForecastList = useMemo(() => {
    if (!selectedMonth) return forecastList;
    return forecastList.filter(fc => fc.periodDate?.startsWith(selectedMonth));
  }, [forecastList, selectedMonth]);

  // Derived: total sales filtered
  const totalSales = useMemo(() => filteredServiceLevel.reduce((s, r) => {
    const p = r.Product || r.product;
    return s + (Number(r.actualSales || 0) * Number(p?.hargaPerCarton || 0));
  }, 0), [filteredServiceLevel]);

  // Derived: top 3 lose sales filtered
  const topLose = useMemo(() =>
    [...filteredServiceLevel].sort((a, b) => Number(b.loseSales || 0) - Number(a.loseSales || 0)).slice(0, 3)
  , [filteredServiceLevel]);

  // Derived: chart 3 bulan per brand (tetap 3 bulan dari data asli, tidak difilter periode)
  const brandStats = useMemo(() => {
    const selectedBrandObj = brands.find(b => b.name === selectedBrand);
    if (!selectedBrandObj) return { totalActual: 0, totalLose: 0, chart: [], max: 1, months: [] };

    const filtered = serviceLevel.filter(r =>
      r.brandId === selectedBrandObj.id || r.Brand?.id === selectedBrandObj.id
    );

    const allMonths = [...new Set(filtered.map(r => r.periodDate?.slice(0, 7)).filter(Boolean))].sort().slice(-3);

    const chart = allMonths.map(month => {
      const rows = filtered.filter(r => r.periodDate?.startsWith(month));
      const actual = rows.reduce((s, r) => {
        const harga = Number((r.Product || r.product)?.hargaPerCarton || 0);
        return s + Number(r.actualSales || 0) * harga;
      }, 0);
      const lose = rows.reduce((s, r) => {
        const harga = Number((r.Product || r.product)?.hargaPerCarton || 0);
        return s + Number(r.loseSales || 0) * harga;
      }, 0);
      const label = new Date(month + "-01").toLocaleDateString("id-ID", { month: "short", year: "numeric" });
      return { label, actual, lose, month };
    });

    const lastMonth = chart.at(-1);
    const totalActual = lastMonth?.actual || 0;
    const totalLose   = lastMonth?.lose   || 0;
    const totalLabel  = lastMonth?.label  || "";
    const max = Math.max(...chart.map(d => d.actual), 1);
    return { totalActual, totalLose, totalLabel, chart, max };
  }, [selectedBrand, brands, serviceLevel]);

  const handleForecastNav = (dir) => {
    const newIdx = forecastIndex + dir;
    if (newIdx < 0 || newIdx >= filteredForecastList.length) return;
    setForecastIndex(newIdx);
  };

  // Reset forecast index saat filter berubah
  useMemo(() => { setForecastIndex(0); }, [selectedMonth]);

  return (
    <div className="flex h-screen" style={{ background: "#f1f5f9" }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-7 py-6 flex flex-col">

          {/* Header + Filter */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "#1e293b" }}>Dashboard</h1>
              <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Welcome back, Admin</p>
            </div>

             
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white" style={{ border: "1px solid #e2e8f0" }}>
              <CalendarDays size={15} style={{ color: "#64748b" }} />
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="text-sm font-semibold outline-none bg-transparent pr-1"
                style={{ color: "#1e293b", cursor: "pointer" }}
              >
                <option value="">All Periods</option>
                {availableMonths.map(m => (
                  <option key={m} value={m}>{fmtMonthLabel(m)}</option>
                ))}
              </select>
            </div>
            
          </div>

          {/* 3 stat cards */}
          <div className="mb-5">
            <StatCards loading={loading} totalSales={totalSales} totalProducts={products.length} totalSubBrands={subBrands.length} fmtM={fmtM} />
          </div>

          {/* Status Leadtime + Top Lose Sales */}
          <div className="mb-5">
            <LeadtimeLoseSales leadtimes={filteredLeadtimes} topLose={topLose} fmtM={fmtM} />
          </div>

          {/* Forecast + Brand Performance */}
          <div className="grid grid-cols-2 gap-5">
            <ForecastCard
              forecastData={filteredForecastList[forecastIndex] || null}
              forecastIndex={forecastIndex}
              forecastTotal={filteredForecastList.length}
              onNav={handleForecastNav}
            />
            <BrandPerformanceCard
              brands={brands}
              selectedBrand={selectedBrand}
              onSelectBrand={setSelectedBrand}
              subBrandChart={brandStats.chart}
              maxChartVal={brandStats.max}
              totalActualSelected={brandStats.totalActual}
              totalLoseSelected={brandStats.totalLose}
              totalLabel={brandStats.totalLabel}
              fmtM={fmtM}
            />
          </div>
        </main>
      </div>
    </div>
  );
}