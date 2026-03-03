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
  return `Rp ${num.toLocaleString("id-ID")}`;
};

const MONTHS_FULL = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.name || user.username || "User";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [leadtimes, setLeadtimes] = useState([]);
  const [subBrands, setSubBrands] = useState([]);
  const [serviceLevel, setServiceLevel] = useState([]);
  const [forecastList, setForecastList] = useState([]);
  const [forecastIndex, setForecastIndex] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState("");

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAll(token);
  }, [navigate]);

  const fetchAll = async (token) => {
    setLoading(true);
    const h = { Authorization: `Bearer ${token}` };
    try {
      const [bRes, pRes, sbRes, fcRes, ltRes, slRes] = await Promise.all([
        axios
          .get(`${BASE}/master-table/`, { headers: h })
          .catch(() => ({ data: [] })),
        axios
          .get(`${BASE}/master-table/product/list`, { headers: h })
          .catch(() => ({ data: [] })),
        axios
          .get(`${BASE}/master-table/sub-brand/list`, { headers: h })
          .catch(() => ({ data: [] })),
        axios
          .get(`${BASE}/detail/forecast`, { headers: h })
          .catch(() => ({ data: { data: [] } })),
        axios
          .get(`${BASE}/detail/leadtime`, { headers: h })
          .catch(() => ({ data: { data: [] } })),
        axios
          .get(`${BASE}/detail/service-level`, { headers: h })
          .catch(() => ({ data: { data: [] } })),
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

      const allDates = [
        ...slList.map((r) => r.periodDate),
        ...ltList.map((r) => r.eta || r.tanggalKeluarPabrik),
        ...fcList.map((r) => r.periodDate),
      ]
        .filter(Boolean)
        .map((d) => d.slice(0, 7));

      const uniqueMonths = [...new Set(allDates)].sort().reverse();
      const uniqueYears = [...new Set(allDates.map((d) => d.slice(0, 4)))]
        .sort()
        .reverse();
      setAvailableMonths(uniqueMonths);
      setAvailableYears(uniqueYears);

      const latestYM = uniqueMonths[0] || "";
      setSelectedYear(latestYM.slice(0, 4) || "");
      setSelectedMonth(latestYM);

      if (fcList.length > 0) {
        const byMonth = {};
        fcList.forEach((fc) => {
          const month = fc.periodDate?.slice(0, 7) || "unknown";
          if (!byMonth[month])
            byMonth[month] = {
              periodDate: fc.periodDate,
              week1: 0,
              week2: 0,
              week3: 0,
              week4: 0,
            };
          byMonth[month].week1 += Number(fc.week1) || 0;
          byMonth[month].week2 += Number(fc.week2) || 0;
          byMonth[month].week3 += Number(fc.week3) || 0;
          byMonth[month].week4 += Number(fc.week4) || 0;
        });
        const mapped = Object.values(byMonth)
          .sort(
            (a, b) => new Date(b.periodDate || 0) - new Date(a.periodDate || 0),
          )
          .map((fc) => ({
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
      console.error("[Dashboard] fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const monthsForYear = useMemo(
    () =>
      selectedYear
        ? availableMonths.filter((m) => m.startsWith(selectedYear))
        : availableMonths,
    [availableMonths, selectedYear],
  );

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setForecastIndex(0);
    if (!year) {
      setSelectedMonth("");
      return;
    }
    const first = availableMonths.find((m) => m.startsWith(year)) || "";
    setSelectedMonth(first);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setForecastIndex(0);
  };

  const handleReset = () => {
    setSelectedYear("");
    setSelectedMonth("");
    setForecastIndex(0);
  };

  const activePrefix = selectedMonth || selectedYear || "";

  const filteredServiceLevel = useMemo(() => {
    if (!activePrefix) return serviceLevel;
    return serviceLevel.filter((r) => r.periodDate?.startsWith(activePrefix));
  }, [serviceLevel, activePrefix]);

  const filteredLeadtimes = useMemo(() => {
    if (!activePrefix) return leadtimes;
    return leadtimes.filter((r) =>
      (r.eta || r.tanggalKeluarPabrik || "").startsWith(activePrefix),
    );
  }, [leadtimes, activePrefix]);

  const filteredForecastList = useMemo(() => {
    if (!activePrefix) return forecastList;
    return forecastList.filter((fc) => fc.periodDate?.startsWith(activePrefix));
  }, [forecastList, activePrefix]);

  const totalSales = useMemo(
    () =>
      filteredServiceLevel.reduce((s, r) => {
        const p = r.Product || r.product;
        return s + Number(r.actualSales || 0) * Number(p?.hargaPerCarton || 0);
      }, 0),
    [filteredServiceLevel],
  );

  const prevMonthSales = useMemo(() => {
    if (!selectedMonth) return 0;
    const [y, m] = selectedMonth.split("-").map(Number);
    const prevDate = new Date(y, m - 2, 1);
    const prevPrefix = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
    return serviceLevel
      .filter((r) => r.periodDate?.startsWith(prevPrefix))
      .reduce((s, r) => {
        const p = r.Product || r.product;
        return s + Number(r.actualSales || 0) * Number(p?.hargaPerCarton || 0);
      }, 0);
  }, [serviceLevel, selectedMonth]);

  const salesGrowth = useMemo(() => {
    if (!selectedMonth || prevMonthSales === 0) return null;
    return (((totalSales - prevMonthSales) / prevMonthSales) * 100).toFixed(1);
  }, [totalSales, prevMonthSales, selectedMonth]);

  const topLose = useMemo(
    () =>
      [...filteredServiceLevel]
        .filter((r) => Number(r.loseSales || 0) > 0)
        .sort((a, b) => Number(b.loseSales || 0) - Number(a.loseSales || 0))
        .slice(0, 3),
    [filteredServiceLevel],
  );

  const brandStats = useMemo(() => {
    const brandObj = brands.find((b) => b.name === selectedBrand);
    if (!brandObj)
      return {
        totalActual: 0,
        totalLose: 0,
        totalLabel: "",
        chart: [],
        max: 1,
      };
    const filtered = serviceLevel.filter(
      (r) => r.brandId === brandObj.id || r.Brand?.id === brandObj.id,
    );
    const allMonths = [
      ...new Set(
        filtered.map((r) => r.periodDate?.slice(0, 7)).filter(Boolean),
      ),
    ]
      .sort()
      .slice(-3);
    const chart = allMonths.map((month) => {
      const rows = filtered.filter((r) => r.periodDate?.startsWith(month));
      const actual = rows.reduce(
        (s, r) =>
          s +
          Number(r.actualSales || 0) *
            Number((r.Product || r.product)?.hargaPerCarton || 0),
        0,
      );
      const lose = rows.reduce(
        (s, r) =>
          s +
          Number(r.loseSales || 0) *
            Number((r.Product || r.product)?.hargaPerCarton || 0),
        0,
      );
      const label = new Date(month + "-01").toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      });
      return { label, actual, lose, month };
    });
    const last = chart.at(-1);
    return {
      totalActual: last?.actual || 0,
      totalLose: last?.lose || 0,
      totalLabel: last?.label || "",
      chart,
      max: Math.max(...chart.map((d) => d.actual), 1),
    };
  }, [selectedBrand, brands, serviceLevel]);

  const handleForecastNav = (dir) => {
    const newIdx = forecastIndex + dir;
    if (newIdx < 0 || newIdx >= filteredForecastList.length) return;
    setForecastIndex(newIdx);
  };

  const filterLabel = useMemo(() => {
    if (selectedMonth) {
      const [y, m] = selectedMonth.split("-");
      return `${MONTHS_FULL[parseInt(m) - 1]} ${y}`;
    }
    if (selectedYear) return `Tahun ${selectedYear}`;
    return "Semua Periode";
  }, [selectedYear, selectedMonth]);

  return (
    <div className="flex h-screen" style={{ background: "#f1f5f9" }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-7 py-6 flex flex-col">
          {/* Header + Filter */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className="text-[22px] font-bold tracking-tight"
                style={{ color: "#1e293b" }}
              >
                Dashboard
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>
                Welcome back, {username}
              </p>
            </div>

            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white"
              style={{ border: "1px solid #e2e8f0" }}
            >
              <CalendarDays size={15} style={{ color: "#64748b" }} />

              {/* Dropdown Tahun */}
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="text-sm font-semibold outline-none bg-transparent"
                style={{ color: "#1e293b", cursor: "pointer" }}
              >
                <option value="">Semua Tahun</option>
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <span style={{ color: "#cbd5e1" }}>|</span>

              {/* Dropdown Bulan */}
              <select
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                disabled={!selectedYear}
                className="text-sm font-semibold outline-none bg-transparent"
                style={{
                  color: selectedYear ? "#1e293b" : "#94a3b8",
                  cursor: selectedYear ? "pointer" : "not-allowed",
                }}
              >
                <option value="">
                  {selectedYear ? "Semua Bulan" : "— Pilih Tahun dulu —"}
                </option>
                {monthsForYear.map((m) => {
                  const idx = parseInt(m.split("-")[1]) - 1;
                  return (
                    <option key={m} value={m}>
                      {MONTHS_FULL[idx]}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Badge periode aktif + tombol reset */}
          <div className="flex items-center gap-2 mb-5">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: "#eff6ff",
                color: "#2563eb",
                border: "1px solid #dbeafe",
              }}
            >
              📅 {filterLabel}
            </span>
            {(selectedYear || selectedMonth) && (
              <button
                onClick={handleReset}
                className="text-xs font-medium px-3 py-1 rounded-full transition"
                style={{
                  background: "#f1f5f9",
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#e2e8f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#f1f5f9")
                }
              >
                Reset
              </button>
            )}
          </div>

          {/* Stat Cards */}
          <div className="mb-5">
            <StatCards
              loading={loading}
              totalSales={totalSales}
              totalProducts={products.length}
              totalSubBrands={subBrands.length}
              salesGrowth={salesGrowth}
              fmtM={fmtM}
            />
          </div>

          {/* Leadtime + Lose Sales */}
          <div className="mb-5">
            <LeadtimeLoseSales
              leadtimes={filteredLeadtimes}
              topLose={topLose}
              fmtM={fmtM}
            />
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
              activePrefix={activePrefix}
              fmtM={fmtM}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
