import React, { useState } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Search, Truck, ShoppingBag, BarChart2, Package, ChevronLeft, ChevronRight } from "lucide-react";

// ── DUMMY DATA ──────────────────────────────────────────────────────────────
const dummyLeadtime = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  sub_brand_id: `SB-${100 + i}`,
  product_id: `PRD-${200 + i}`,
  qty_order: Math.floor(Math.random() * 500) + 50,
  eta: `2025-05-${String(i + 1).padStart(2, "0")}`,
  status: i % 3 === 0 ? false : true,
  actual_arrival_date: i % 4 === 0 ? null : `2025-05-${String(i + 2).padStart(2, "0")} 10:00`,
  created_at: `2025-04-${String(i + 1).padStart(2, "0")}`,
}));

const dummyStockIndomaret = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  brand_id: `BR-${10 + i}`,
  sub_brand_id: `SB-${100 + i}`,
  product_id: `PRD-${200 + i}`,
  avg_l3m: Math.floor(Math.random() * 300) + 100,
  total_value: Math.floor(Math.random() * 50000000) + 1000000,
  is_active: i % 5 !== 0,
  created_at: `2025-04-${String(i + 1).padStart(2, "0")}`,
}));

const dummyServiceLevel = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  brand_id: `BR-${10 + i}`,
  sub_brand_id: `SB-${100 + i}`,
  product_id: `PRD-${200 + i}`,
  total_sales: (Math.random() * 100000000 + 5000000).toFixed(2),
  sales_quantity: Math.floor(Math.random() * 1000) + 100,
  sales_rank: i + 1,
  performance_category: ["Excellent", "Good", "Average", "Below Average"][i % 4],
  percentage_of_total: (Math.random() * 20 + 1).toFixed(2),
  period_date: `2025-05-01`,
  created_at: `2025-04-${String(i + 1).padStart(2, "0")}`,
}));

const dummyStockDistributor = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  brand_id: `BR-${10 + i}`,
  sub_brand_id: `SB-${100 + i}`,
  product_id: `PRD-${200 + i}`,
  stock_quantity: Math.floor(Math.random() * 2000) + 200,
  avg_l3m: Math.floor(Math.random() * 400) + 100,
  total_value: (Math.random() * 200000000 + 10000000).toFixed(2),
  last_updated: `2025-05-${String(i + 1).padStart(2, "0")} 08:00`,
  created_at: `2025-04-${String(i + 1).padStart(2, "0")}`,
}));

// ── BADGE ────────────────────────────────────────────────────────────────────
function Badge({ value }) {
  const map = {
    true: { bg: "#d1fae5", color: "#10b981", label: "Active" },
    false: { bg: "#fee2e2", color: "#ef4444", label: "Inactive" },
    Excellent: { bg: "#dbeafe", color: "#2563eb", label: "Excellent" },
    Good: { bg: "#d1fae5", color: "#10b981", label: "Good" },
    Average: { bg: "#fef3c7", color: "#f59e0b", label: "Average" },
    "Below Average": { bg: "#fee2e2", color: "#ef4444", label: "Below Average" },
  };
  const style = map[String(value)] || { bg: "#f1f5f9", color: "#64748b", label: String(value) };
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: style.bg, color: style.color }}>
      {style.label}
    </span>
  );
}

// ── TABLE WRAPPER ─────────────────────────────────────────────────────────────
function DataTable({ columns, data, searchKeys }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 7;

  const filtered = data.filter(row =>
    searchKeys.some(k => String(row[k] ?? "").toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-6 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={13} style={{ color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Cari data..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-8 pr-4 py-2 text-sm rounded-lg outline-none"
            style={{ border: "1px solid #e2e8f0", background: "white", color: "#1e293b" }}
            onFocus={e => e.currentTarget.style.borderColor = "#3b82f6"}
            onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
          />
        </div>
        <span className="text-xs" style={{ color: "#94a3b8" }}>
          <strong style={{ color: "#2563eb" }}>{filtered.length}</strong> entri ditemukan
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full">
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {columns.map(col => (
                <th key={col.key} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: "#64748b" }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? paginated.map((row, i) => (
              <tr
                key={row.id}
                style={{ borderBottom: "1px solid #f1f5f9" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-5 py-3 text-sm whitespace-nowrap" style={{ color: "#1e293b" }}>
                    {col.render ? col.render(row[col.key], row) : (
                      col.key === "id"
                        ? <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>{String(row[col.key]).padStart(2, "0")}</span>
                        : <span>{row[col.key] ?? "—"}</span>
                    )}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm" style={{ color: "#94a3b8" }}>
                  Tidak ada data yang sesuai
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3" style={{ borderTop: "1px solid #f1f5f9" }}>
          <span className="text-xs" style={{ color: "#94a3b8" }}>
            Halaman <strong style={{ color: "#1e293b" }}>{page}</strong> dari <strong style={{ color: "#1e293b" }}>{totalPages}</strong>
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-40"
              style={{ border: "1px solid #e2e8f0", color: "#64748b" }}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: page === p ? "#2563eb" : "white",
                  color: page === p ? "white" : "#64748b",
                  border: `1px solid ${page === p ? "#2563eb" : "#e2e8f0"}`,
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-40"
              style={{ border: "1px solid #e2e8f0", color: "#64748b" }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TABS CONFIG ───────────────────────────────────────────────────────────────
const tabs = [
  {
    key: "leadtime",
    label: "Leadtime Delivery",
    icon: Truck,
    color: "#2563eb",
    bg: "#eff6ff",
    data: dummyLeadtime,
    searchKeys: ["product_id", "sub_brand_id", "status"],
    columns: [
      { key: "id", label: "ID" },
      { key: "sub_brand_id", label: "Sub Brand" },
      { key: "product_id", label: "Product" },
      { key: "qty_order", label: "Qty Order" },
      { key: "eta", label: "ETA" },
      { key: "status", label: "Status", render: v => <Badge value={v} /> },
      { key: "actual_arrival_date", label: "Actual Arrival" },
      { key: "created_at", label: "Created At" },
    ],
  },
  {
    key: "stock_indomaret",
    label: "Stock Indomaret",
    icon: ShoppingBag,
    color: "#10b981",
    bg: "#d1fae5",
    data: dummyStockIndomaret,
    searchKeys: ["brand_id", "product_id", "sub_brand_id"],
    columns: [
      { key: "id", label: "ID" },
      { key: "brand_id", label: "Brand" },
      { key: "sub_brand_id", label: "Sub Brand" },
      { key: "product_id", label: "Product" },
      { key: "avg_l3m", label: "Avg L3M" },
      { key: "total_value", label: "Total Value", render: v => `Rp ${Number(v).toLocaleString("id-ID")}` },
      { key: "is_active", label: "Status", render: v => <Badge value={v} /> },
      { key: "created_at", label: "Created At" },
    ],
  },
  {
    key: "service_level",
    label: "Service Level",
    icon: BarChart2,
    color: "#7c3aed",
    bg: "#ede9fe",
    data: dummyServiceLevel,
    searchKeys: ["brand_id", "product_id", "performance_category"],
    columns: [
      { key: "id", label: "ID" },
      { key: "brand_id", label: "Brand" },
      { key: "sub_brand_id", label: "Sub Brand" },
      { key: "product_id", label: "Product" },
      { key: "total_sales", label: "Total Sales", render: v => `Rp ${Number(v).toLocaleString("id-ID")}` },
      { key: "sales_quantity", label: "Sales Qty" },
      { key: "sales_rank", label: "Rank" },
      { key: "performance_category", label: "Performance", render: v => <Badge value={v} /> },
      { key: "percentage_of_total", label: "% Total", render: v => `${v}%` },
      { key: "period_date", label: "Period" },
    ],
  },
  {
    key: "stock_distributor",
    label: "Stock Distributor",
    icon: Package,
    color: "#f59e0b",
    bg: "#fef3c7",
    data: dummyStockDistributor,
    searchKeys: ["brand_id", "product_id", "sub_brand_id"],
    columns: [
      { key: "id", label: "ID" },
      { key: "brand_id", label: "Brand" },
      { key: "sub_brand_id", label: "Sub Brand" },
      { key: "product_id", label: "Product" },
      { key: "stock_quantity", label: "Stock Qty" },
      { key: "avg_l3m", label: "Avg L3M" },
      { key: "total_value", label: "Total Value", render: v => `Rp ${Number(v).toLocaleString("id-ID")}` },
      { key: "last_updated", label: "Last Updated" },
      { key: "created_at", label: "Created At" },
    ],
  },
];

// ── PAGE ──────────────────────────────────────────────────────────────────────
function Detail() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("leadtime");
  const navigate = useNavigate();

  const current = tabs.find(t => t.key === activeTab);

  return (
    <div className="flex h-screen" style={{ background: "#f1f5f9" }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-7 py-6 flex flex-col">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "#1e293b" }}>Detail</h1>
            <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Data operasional Indomaret secara detail</p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="text-left p-4 rounded-xl transition-all duration-150"
                  style={{
                    background: activeTab === tab.key ? "white" : "white",
                    border: activeTab === tab.key ? `2px solid ${tab.color}` : "2px solid transparent",
                    boxShadow: activeTab === tab.key ? `0 0 0 1px ${tab.color}20` : "none",
                    outline: "1px solid #e2e8f0",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg" style={{ background: tab.bg }}>
                      <Icon size={16} style={{ color: tab.color }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: tab.color }}>
                      {tab.data.length} data
                    </span>
                  </div>
                  <p className="text-xs font-bold" style={{ color: "#1e293b" }}>{tab.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "#94a3b8" }}>{tab.columns.length} kolom</p>
                </button>
              );
            })}
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl flex flex-col flex-1 min-h-0" style={{ border: "1px solid #e2e8f0" }}>
            {/* Tab Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: current.bg }}>
                  <current.icon size={15} style={{ color: current.color }} />
                </div>
                <div>
                  <span className="text-sm font-bold" style={{ color: "#1e293b" }}>{current.label}</span>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>{current.data.length} total entri</p>
                </div>
              </div>
              {/* Tab pills */}
              <div className="flex gap-1.5">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      background: activeTab === tab.key ? tab.color : "#f1f5f9",
                      color: activeTab === tab.key ? "white" : "#64748b",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table content */}
            <DataTable
              columns={current.columns}
              data={current.data}
              searchKeys={current.searchKeys}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Detail;