import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
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
  const [forecastData, setForecastData] = useState(null);
  const [editForecastData, setEditForecastData] = useState(null);

  // State UI
  const [selectedBrand, setSelectedBrand] = useState("");

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

      setBrands(brandList);
      setProducts(pRes.data || []);
      setSubBrands(sbRes.data || []);
      setLeadtimes(ltRes.data?.data || []);
      setServiceLevel(slList);
      // DEBUG — hapus setelah fix
      if (slList.length > 0) {
        const s = slList[0];
        console.log("[DEBUG] serviceLevel keys:", Object.keys(s));
        console.log("[DEBUG] brandId:", s.brandId, "| Brand:", s.Brand, "| Product:", s.Product, "| actualSales:", s.actualSales, "| hargaPerCarton:", s.Product?.hargaPerCarton);
      }
      console.log("[DEBUG] brands:", brandList.map(b => ({id: b.id, name: b.name})));

      if (brandList.length > 0) setSelectedBrand(brandList[0].name);

      if (fcList.length > 0) {
        const fc = fcList[0];
        const mapped = {
          id: fc.id,
          plan: fc.plan,
          week1: Number(fc.week1).toLocaleString("id-ID"),
          week2: Number(fc.week2).toLocaleString("id-ID"),
          week3: Number(fc.week3).toLocaleString("id-ID"),
          week4: Number(fc.week4).toLocaleString("id-ID"),
        };
        setForecastData(mapped);
        setEditForecastData(mapped);
      }
    } catch (e) {
      console.error("[Dashboard] Critical fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Derived: total sales semua brand
  const totalSales = useMemo(() => serviceLevel.reduce((s, r) => {
    const p = r.Product || r.product;
    return s + (Number(r.actualSales || 0) * Number(p?.hargaPerCarton || 0));
  }, 0), [serviceLevel]);

  // Derived: top 3 lose sales
  const topLose = useMemo(() =>
    [...serviceLevel].sort((a, b) => Number(b.loseSales || 0) - Number(a.loseSales || 0)).slice(0, 3)
  , [serviceLevel]);

  // Derived: data chart 3 bulan terakhir per brand
  const brandStats = useMemo(() => {
    const selectedBrandObj = brands.find(b => b.name === selectedBrand);
    if (!selectedBrandObj) return { totalActual: 0, totalLose: 0, chart: [], max: 1, months: [] };

    const filtered = serviceLevel.filter(r =>
      r.brandId === selectedBrandObj.id || r.Brand?.id === selectedBrandObj.id
    );

    // Ambil 3 bulan unik terakhir dari data
    const allMonths = [...new Set(filtered.map(r => r.periodDate?.slice(0, 7)).filter(Boolean))].sort().slice(-3);

    // Group per bulan → total actual sales
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

    // Tampilkan per bulan terakhir, bukan total akumulasi
    const lastMonth = chart.at(-1);
    const totalActual = lastMonth?.actual || 0;
    const totalLose   = lastMonth?.lose   || 0;
    const totalLabel  = lastMonth?.label  || "";
    const max = Math.max(...chart.map(d => d.actual), 1);
    return { totalActual, totalLose, totalLabel, chart, max };
  }, [selectedBrand, brands, serviceLevel]);

  // Handlers
  const handleSaveForecast = async () => {
    const token = localStorage.getItem("token");
    try {
      const rawData = {
        ...editForecastData,
        week1: editForecastData.week1.replace(/\./g, ""),
        week2: editForecastData.week2.replace(/\./g, ""),
        week3: editForecastData.week3.replace(/\./g, ""),
        week4: editForecastData.week4.replace(/\./g, ""),
      };
      await axios.put(`${BASE}/detail/forecast/${editForecastData.id}`, rawData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForecastData({ ...editForecastData });
      alert("Forecast berhasil diperbarui!");
    } catch (err) {
      console.error("Gagal simpan forecast:", err);
      alert("Terjadi kesalahan saat menyimpan.");
    }
  };

  const handleForecastChange = (field, value) =>
    setEditForecastData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="flex h-screen" style={{ background: "#f1f5f9" }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-7 py-6 flex flex-col">
          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "#1e293b" }}>Dashboard</h1>
            <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Selamat datang kembali, Admin</p>
          </div>

          {/* 3 stat cards */}
          <div className="mb-5">
            <StatCards loading={loading} totalSales={totalSales} totalProducts={products.length} totalSubBrands={subBrands.length} fmtM={fmtM} />
          </div>

          {/* Status Leadtime + Top Lose Sales */}
          <div className="mb-5">
            <LeadtimeLoseSales leadtimes={leadtimes} topLose={topLose} fmtM={fmtM} />
          </div>

          {/* Forecast + Brand Performance */}
          <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">
            <ForecastCard forecastData={forecastData} editForecastData={editForecastData} onSave={handleSaveForecast} onChange={handleForecastChange} />
            <BrandPerformanceCard brands={brands} selectedBrand={selectedBrand} onSelectBrand={setSelectedBrand} subBrandChart={brandStats.chart} maxChartVal={brandStats.max} totalActualSelected={brandStats.totalActual} totalLoseSelected={brandStats.totalLose} totalLabel={brandStats.totalLabel} fmtM={fmtM} />
          </div>
        </main>
      </div>
    </div>
  );
}