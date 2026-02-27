import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DeleteConfirmation from "../components/DeleteConfirmation";
import Toast from "../components/Toast";
import FormLeadtime from "../models/FormLeadtime";
import FormStockIndomaret from "../models/FormStockIndomaret";
import FormServiceLevel from "../models/FormServiceLevel";
import FormStockDistributor from "../models/FormStockDistributor";
import FormForecast from "../models/FormForecast";
import { Search, Truck, ShoppingBag, BarChart2, Package, TrendingUp, ChevronLeft, ChevronRight, RefreshCw, Plus, Edit, Trash2 } from "lucide-react";
import {
  getLeadtime, tambahLeadtime, editLeadtime, hapusLeadtime,
  getStockIndomaret, tambahStockIndomaret, editStockIndomaret, hapusStockIndomaret,
  getServiceLevel, tambahServiceLevel, editServiceLevel, hapusServiceLevel,
  getStockDistributor, tambahStockDistributor, editStockDistributor, hapusStockDistributor,
  getForecast, tambahForecast, editForecast, hapusForecast,
} from "../services/detailService";
import axios from "axios";

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const STATUS_COLORS = {
  true:            { bg: "#d1fae5", text: "#10b981", label: "Active" },
  false:           { bg: "#fee2e2", text: "#ef4444", label: "Inactive" },
  Pending:         { bg: "#f1f5f9", text: "#64748b", label: "Pending" },
  "In Transit":    { bg: "#dbeafe", text: "#2563eb", label: "In Transit" },
  Delivered:       { bg: "#d1fae5", text: "#10b981", label: "Delivered" },
  Delayed:         { bg: "#fee2e2", text: "#ef4444", label: "Delayed" },
  Cancelled:       { bg: "#f3f4f6", text: "#6b7280", label: "Cancelled" },
};

const StatusChip = ({ value }) => {
  const s = STATUS_COLORS[String(value)] || { bg: "#f1f5f9", text: "#64748b", label: String(value) };
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.text }}>{s.label}</span>
  );
};

const fmtRp   = v => `Rp ${Number(v).toLocaleString("id-ID")}`;
const fmtDate = v => v ? new Date(v).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—";

function DataTable({ columns, data, loading, onEdit, onDelete, color }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 7;

  useEffect(() => { setPage(1); }, [data]);

  const filtered = data.filter(row => {
    const q = search.toLowerCase();
    const flatMatch = columns.some(col => String(row[col.key] ?? "").toLowerCase().includes(q));
    const nestedMatch = [row.brand?.name, row.sub_brand?.name, row.product?.name]
      .some(val => val && String(val).toLowerCase().includes(q));
    return flatMatch || nestedMatch;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-6 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={13} style={{ color: "#94a3b8" }} />
          <input type="text" placeholder="Cari data..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-8 pr-4 py-2 text-sm rounded-lg outline-none"
            style={{ border: "1px solid #e2e8f0", background: "white", color: "#1e293b" }} />
        </div>
        <span className="text-xs" style={{ color: "#94a3b8" }}><strong style={{ color }}>{filtered.length}</strong> entri</span>
      </div>

      <div className="overflow-x-auto flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-sm" style={{ color: "#94a3b8" }}>Memuat data...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                {columns.map((col, idx) => (
                  <th key={`${col.key}-${idx}`} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: "#64748b" }}>{col.label}</th>
                ))}
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? paginated.map((row, i) => (
                <tr key={row.id ?? i} style={{ borderBottom: "1px solid #f1f5f9" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  {columns.map((col, idx) => (
                    <td key={`${col.key}-${idx}`} className="px-5 py-3.5 text-sm whitespace-nowrap">
                      {col.render ? col.render(row[col.key], row) : (
                        col.key === "id"
                          ? <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>{String(row[col.key]).padStart(2, "0")}</span>
                          : <span style={{ color: "#1e293b" }}>{row[col.key] ?? "—"}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => onEdit(row)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                        onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}>
                        <Edit size={12} /> Edit
                      </button>
                      <button onClick={() => onDelete(row.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fca5a5"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fee2e2"}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={columns.length + 1} className="px-5 py-14 text-center text-sm" style={{ color: "#94a3b8" }}>Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3" style={{ borderTop: "1px solid #f1f5f9" }}>
          <span className="text-xs" style={{ color: "#94a3b8" }}>Halaman <strong style={{ color: "#1e293b" }}>{page}</strong> dari <strong style={{ color: "#1e293b" }}>{totalPages}</strong></span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-40"
              style={{ border: "1px solid #e2e8f0", color: "#64748b" }}><ChevronLeft size={14} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all"
                style={{ background: page === p ? color : "white", color: page === p ? "white" : "#64748b", border: `1px solid ${page === p ? color : "#e2e8f0"}` }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-40"
              style={{ border: "1px solid #e2e8f0", color: "#64748b" }}><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("leadtime");
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [subBrands, setSubBrands] = useState([]);
  const [products, setProducts] = useState([]);

  const [filterBrand, setFilterBrand] = useState("");
  const [filterSubBrand, setFilterSubBrand] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [loading, setLoading] = useState(false);

  const [leadtime, setLeadtime] = useState([]);
  const [stockIndomaret, setStockIndomaret] = useState([]);
  const [serviceLevel, setServiceLevel] = useState([]);
  const [stockDistributor, setStockDistributor] = useState([]);
  const [forecast, setForecast] = useState([]);

  const [formOpen, setFormOpen] = useState({ leadtime: false, stockIndomaret: false, serviceLevel: false, stockDistributor: false, forecast: false });
  const [editData, setEditData] = useState({ leadtime: null, stockIndomaret: null, serviceLevel: null, stockDistributor: null, forecast: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, type: null });
  const [toast, setToast] = useState({ isOpen: false, type: "success", message: "" });
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  const showToast = (type, message) => setToast({ isOpen: true, type, message });
  const closeToast = () => setToast(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    const h = { Authorization: `Bearer ${token}` };
    axios.get("http://localhost:3000/api/master-table/", { headers: h }).then(r => setBrands(r.data)).catch(() => {});
    axios.get("http://localhost:3000/api/master-table/sub-brand/list", { headers: h }).then(r => setSubBrands(r.data)).catch(() => {});
    axios.get("http://localhost:3000/api/master-table/product/list", { headers: h }).then(r => setProducts(r.data)).catch(() => {});
  }, []);

  useEffect(() => { fetchAll(); }, [filterBrand, filterSubBrand, filterMonth, filterYear]);

  const fetchAll = async () => {
    setLoading(true);
    const filters = {};
    if (filterBrand)    filters.brandId    = filterBrand;
    if (filterSubBrand) filters.subBrandId = filterSubBrand;
    if (filterYear && filterMonth) filters.periodDate = `${filterYear}-${String(filterMonth).padStart(2, "0")}-01`;
    else if (filterYear) filters.year = filterYear;

    const [lt, si, sl, sd, fc] = await Promise.all([
      getLeadtime(filters), getStockIndomaret(filters),
      getServiceLevel(filters), getStockDistributor(filters),
      getForecast(filterBrand ? { brandId: filterBrand, ...(filters.periodDate ? { periodDate: filters.periodDate } : {}) } : {}),
    ]);
    if (lt.success) setLeadtime(lt.data);
    if (si.success) setStockIndomaret(si.data);
    if (sl.success) setServiceLevel(sl.data);
    if (sd.success) setStockDistributor(sd.data);
    if (fc.success) setForecast(fc.data);

    const allDates = [...(lt.data||[]),...(si.data||[]),...(sl.data||[]),...(sd.data||[]),...(fc.data||[])]
      .map(r => r.periodDate).filter(Boolean);
    setAvailableYears([...new Set(allDates.map(d => d.slice(0,4)))].sort().reverse());
    setAvailableMonths([...new Set(allDates.map(d => parseInt(d.slice(5,7))))].sort((a,b) => a-b));
    setLoading(false);
  };

  const filteredSubBrands = filterBrand ? subBrands.filter(sb => sb.brandId === parseInt(filterBrand)) : subBrands;
  const resetFilter = () => { setFilterBrand(""); setFilterSubBrand(""); setFilterMonth(""); setFilterYear(""); };

  const openAdd    = (type) => { setEditData(p => ({ ...p, [type]: null })); setFormOpen(p => ({ ...p, [type]: true })); };
  const openEdit   = (type, row) => { setEditData(p => ({ ...p, [type]: row })); setFormOpen(p => ({ ...p, [type]: true })); };
  const closeForm  = (type) => { setFormOpen(p => ({ ...p, [type]: false })); setEditData(p => ({ ...p, [type]: null })); };
  const openDelete = (type, id) => setDeleteModal({ open: true, id, type });
  const closeDelete = () => setDeleteModal({ open: false, id: null, type: null });

  const makeSubmit = (type, addFn, editFn, label) => async (data, id) => {
    const result = id ? await editFn(id, data) : await addFn(data);
    if (result.success) { showToast("success", id ? `${label} diupdate!` : `${label} ditambahkan!`); closeForm(type); fetchAll(); }
    else showToast("error", result.message);
  };

  const confirmDelete = async () => {
    const { id, type } = deleteModal;
    const fnMap = { leadtime: hapusLeadtime, stockIndomaret: hapusStockIndomaret, serviceLevel: hapusServiceLevel, stockDistributor: hapusStockDistributor, forecast: hapusForecast };
    const result = await fnMap[type](id);
    if (result.success) { showToast("success", "Data berhasil dihapus!"); fetchAll(); }
    else showToast("error", result.message);
    closeDelete();
  };

  const tabs = [
    {
      key: "leadtime", label: "Leadtime Delivery", icon: Truck, color: "#2563eb", bg: "#eff6ff",
      data: leadtime, onAdd: () => openAdd("leadtime"), onEdit: r => openEdit("leadtime", r), onDelete: id => openDelete("leadtime", id),
      columns: [
        { key: "id", label: "ID" },
        { key: "brand",     label: "Brand",     render: (_, r) => r.brand?.name     ?? "—" },
        { key: "sub_brand", label: "Sub Brand", render: (_, r) => r.sub_brand?.name ?? "—" },
        { key: "product",   label: "Product",   render: (_, r) => r.product?.name   ?? "—" },
        { key: "qtyOrder", label: "Qty Order (Karton)" },
        { key: "tanggalKeluarPabrik", label: "Tgl Keluar Pabrik", render: v => v ?? "—" },
        { key: "eta", label: "ETA" },
        { key: "status", label: "Status", render: v => <StatusChip value={v} /> },
        { key: "notes", label: "Notes", render: v => v ?? "—" },
      ]
    },
    {
      key: "stock_delivery", label: "Stock Delivery", icon: ShoppingBag, color: "#10b981", bg: "#d1fae5",
      data: stockIndomaret, onAdd: () => openAdd("stockIndomaret"), onEdit: r => openEdit("stockIndomaret", r), onDelete: id => openDelete("stockIndomaret", id),
      columns: [
        { key: "id", label: "ID" },
        { key: "brand",     label: "Brand",     render: (_, r) => r.brand?.name     ?? "—" },
        { key: "sub_brand", label: "Sub Brand", render: (_, r) => r.sub_brand?.name ?? "—" },
        { key: "product",   label: "Product",   render: (_, r) => r.product?.name   ?? "—" },
        { key: "avgL3m", label: "Avg L3M" },
        { key: "totalValue", label: "Total Value", render: v => fmtRp(v) },
        { key: "isActive", label: "Status", render: v => <StatusChip value={v} /> },
      ]
    },
    {
      key: "service_level", label: "Service Level", icon: BarChart2, color: "#7c3aed", bg: "#ede9fe",
      data: serviceLevel, onAdd: () => openAdd("serviceLevel"), onEdit: r => openEdit("serviceLevel", r), onDelete: id => openDelete("serviceLevel", id),
      columns: [
        { key: "id", label: "ID" },
        { key: "brand",     label: "Brand",     render: (_, r) => (r.Brand     || r.brand)?.name     ?? "—" },
        { key: "sub_brand", label: "Sub Brand", render: (_, r) => (r.SubBrand  || r.sub_brand)?.name ?? "—" },
        { key: "product",   label: "Product",   render: (_, r) => (r.Product   || r.product)?.name   ?? "—" },
        { key: "periodDate", label: "Period", render: v => fmtDate(v) },
        { key: "totalSales",  label: "Total Sales",  render: (v, r) => { const p = r.Product || r.product; return fmtRp(Number(v) * Number(p?.hargaPerCarton || 0)); } },
        { key: "actualSales", label: "Actual Sales", render: (v, r) => { const p = r.Product || r.product; return fmtRp(Number(v) * Number(p?.hargaPerCarton || 0)); } },
        { key: "loseSales",   label: "Lose Sales",   render: (v, r) => { const p = r.Product || r.product; const val = Number(v) * Number(p?.hargaPerCarton || 0); return <span style={{ color: val > 0 ? "#ef4444" : "#10b981", fontWeight: 600 }}>{fmtRp(val)}</span>; } },
        { key: "performance", label: "Performance (%)", render: v => v ? `${v}%` : "—" },
      ]
    },
    {
      key: "stock_distributor", label: "Stock Distributor", icon: Package, color: "#f59e0b", bg: "#fef3c7",
      data: stockDistributor, onAdd: () => openAdd("stockDistributor"), onEdit: r => openEdit("stockDistributor", r), onDelete: id => openDelete("stockDistributor", id),
      columns: [
        { key: "id", label: "ID" },
        { key: "brand",     label: "Brand",     render: (_, r) => r.brand?.name     ?? "—" },
        { key: "sub_brand", label: "Sub Brand", render: (_, r) => r.sub_brand?.name ?? "—" },
        { key: "product",   label: "Product",   render: (_, r) => r.product?.name   ?? "—" },
        { key: "stockQuantity", label: "Stock Qty" },
        { key: "avgL3m",    label: "Avg L3M" },
        { key: "totalValue", label: "Total Value", render: v => fmtRp(v) },
        { key: "periodDate", label: "Period" },
      ]
    },
    {
      key: "forecast", label: "Forecast", icon: TrendingUp, color: "#0ea5e9", bg: "#e0f2fe",
      data: forecast, onAdd: () => openAdd("forecast"), onEdit: r => openEdit("forecast", r), onDelete: id => openDelete("forecast", id),
      columns: [
        { key: "id", label: "ID" },
        { key: "brand",     label: "Brand",     render: (_, r) => r.brand?.name                       ?? "—" },
        { key: "sub_brand", label: "Sub Brand", render: (_, r) => (r.sub_brand || r.SubBrand)?.name   ?? "—" },
        { key: "product",   label: "Product",   render: (_, r) => (r.product   || r.Product)?.name    ?? "—" },
        { key: "week1", label: "Week 1", render: v => fmtRp(v) },
        { key: "week2", label: "Week 2", render: v => fmtRp(v) },
        { key: "week3", label: "Week 3", render: v => fmtRp(v) },
        { key: "week4", label: "Week 4", render: v => fmtRp(v) },
        { key: "periodDate", label: "Period" },
      ]
    },
  ];

  const current = tabs.find(t => t.key === activeTab);

  return (
    <div className="flex h-screen" style={{ background: "#f1f5f9" }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-7 py-6 flex flex-col">
          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "#1e293b" }}>Detail</h1>
            <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Data operasional Indomaret secara detail</p>
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-xl px-6 py-4 mb-5 flex items-center gap-3 flex-wrap" style={{ border: "1px solid #e2e8f0" }}>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94a3b8" }}>Filter</span>
            <select value={filterBrand} onChange={e => { setFilterBrand(e.target.value); setFilterSubBrand(""); }}
              className="text-sm px-3 py-2 rounded-lg outline-none" style={{ border: "1px solid #e2e8f0", color: "#1e293b", minWidth: 150 }}>
              <option value="">Semua Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select value={filterSubBrand} onChange={e => setFilterSubBrand(e.target.value)}
              className="text-sm px-3 py-2 rounded-lg outline-none" style={{ border: "1px solid #e2e8f0", color: "#1e293b", minWidth: 150 }}>
              <option value="">Semua Sub Brand</option>
              {filteredSubBrands.map(sb => <option key={sb.id} value={sb.id}>{sb.name}</option>)}
            </select>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
              className="text-sm px-3 py-2 rounded-lg outline-none" style={{ border: "1px solid #e2e8f0", color: "#1e293b", minWidth: 130 }}>
              <option value="">Semua Bulan</option>
              {availableMonths.map(m => <option key={m} value={m}>{MONTHS_ID[m - 1]}</option>)}
            </select>
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
              className="text-sm px-3 py-2 rounded-lg outline-none" style={{ border: "1px solid #e2e8f0", color: "#1e293b", minWidth: 110 }}>
              <option value="">Semua Tahun</option>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button onClick={resetFilter}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg"
              style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>
              <RefreshCw size={12} /> Reset
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-5 gap-4 mb-5">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className="text-left p-4 rounded-xl bg-white transition-all duration-150"
                  style={{ border: activeTab === tab.key ? `2px solid ${tab.color}` : "2px solid #e2e8f0" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg" style={{ background: tab.bg }}>
                      <Icon size={15} style={{ color: tab.color }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: tab.color }}>{tab.data.length}</span>
                  </div>
                  <p className="text-xs font-bold" style={{ color: "#1e293b" }}>{tab.label}</p>
                </button>
              );
            })}
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl flex flex-col flex-1 min-h-0" style={{ border: "1px solid #e2e8f0" }}>
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
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: activeTab === tab.key ? tab.color : "#f1f5f9", color: activeTab === tab.key ? "white" : "#64748b" }}>
                      {tab.label}
                    </button>
                  ))}
                </div>
                <button onClick={current.onAdd}
                  className="inline-flex items-center gap-2 text-white text-xs font-semibold px-3 py-2 rounded-lg"
                  style={{ background: current.color }}>
                  <Plus size={13} /> Tambah
                </button>
              </div>
            </div>
            <DataTable columns={current.columns} data={current.data} loading={loading}
              onEdit={current.onEdit} onDelete={current.onDelete} color={current.color} />
          </div>
        </main>
      </div>

      <FormLeadtime isOpen={formOpen.leadtime} onClose={() => closeForm("leadtime")} onSubmit={makeSubmit("leadtime", tambahLeadtime, editLeadtime, "Leadtime")} onError={msg => showToast("error", msg)} editData={editData.leadtime} brands={brands} subBrands={subBrands} products={products} />
      <FormStockIndomaret isOpen={formOpen.stockIndomaret} onClose={() => closeForm("stockIndomaret")} onSubmit={makeSubmit("stockIndomaret", tambahStockIndomaret, editStockIndomaret, "Stock Delivery")} onError={msg => showToast("error", msg)} editData={editData.stockIndomaret} brands={brands} subBrands={subBrands} products={products} />
      <FormServiceLevel isOpen={formOpen.serviceLevel} onClose={() => closeForm("serviceLevel")} onSubmit={makeSubmit("serviceLevel", tambahServiceLevel, editServiceLevel, "Service Level")} onError={msg => showToast("error", msg)} editData={editData.serviceLevel} brands={brands} subBrands={subBrands} products={products} />
      <FormStockDistributor isOpen={formOpen.stockDistributor} onClose={() => closeForm("stockDistributor")} onSubmit={makeSubmit("stockDistributor", tambahStockDistributor, editStockDistributor, "Stock Distributor")} onError={msg => showToast("error", msg)} editData={editData.stockDistributor} brands={brands} subBrands={subBrands} products={products} />
      <FormForecast isOpen={formOpen.forecast} onClose={() => closeForm("forecast")} onSubmit={makeSubmit("forecast", tambahForecast, editForecast, "Forecast")} onError={msg => showToast("error", msg)} editData={editData.forecast} brands={brands} subBrands={subBrands} products={products} />
      <DeleteConfirmation isOpen={deleteModal.open} onConfirm={confirmDelete} onCancel={closeDelete} item="data ini" />
      <Toast isOpen={toast.isOpen} onClose={closeToast} type={toast.type} message={toast.message} duration={3000} />
    </div>
  );
}

export default Detail;