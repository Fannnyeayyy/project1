/**
 * Detail.jsx
 * Halaman 4 tabel operasional dengan CRUD lengkap.
 * Filter brand/sub brand berlaku untuk semua tabel sekaligus.
 * Setiap tabel punya tombol Add, Edit, Delete dengan modal popup.
 */
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
import { Search, Truck, ShoppingBag, BarChart2, Package, ChevronLeft, ChevronRight, RefreshCw, Plus, Edit, Trash2 } from "lucide-react";
import {
  getLeadtime, tambahLeadtime, editLeadtime, hapusLeadtime,
  getStockIndomaret, tambahStockIndomaret, editStockIndomaret, hapusStockIndomaret,
  getServiceLevel, tambahServiceLevel, editServiceLevel, hapusServiceLevel,
  getStockDistributor, tambahStockDistributor, editStockDistributor, hapusStockDistributor,
} from "../services/detailService";
import axios from "axios";

// ── BADGE ─────────────────────────────────────────────────────────────────────
function Badge({ value }) {
  const map = {
    true:            { bg: "#d1fae5", color: "#10b981", label: "Active" },
    false:           { bg: "#fee2e2", color: "#ef4444", label: "Inactive" },
    Excellent:       { bg: "#dbeafe", color: "#2563eb", label: "Excellent" },
    Good:            { bg: "#d1fae5", color: "#10b981", label: "Good" },
    Average:         { bg: "#fef3c7", color: "#f59e0b", label: "Average" },
    "Below Average": { bg: "#fee2e2", color: "#ef4444", label: "Below Average" },
  };
  const s = map[String(value)] || { bg: "#f1f5f9", color: "#64748b", label: String(value) };
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// ── TABLE WRAPPER ─────────────────────────────────────────────────────────────
function DataTable({ columns, data, loading, onEdit, onDelete, color, accentBg }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 7;

  useEffect(() => { setPage(1); }, [data]);

  const filtered = data.filter(row =>
    columns.some(col => String(row[col.key] ?? "").toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Search */}
      <div className="px-6 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
        <div className="relative w-64">
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
          <strong style={{ color }}>{filtered.length}</strong> entri ditemukan
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-sm" style={{ color: "#94a3b8" }}>Memuat data...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                {columns.map(col => (
                  <th key={col.key} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: "#64748b" }}>
                    {col.label}
                  </th>
                ))}
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? paginated.map((row, i) => (
                <tr key={row.id ?? i} style={{ borderBottom: "1px solid #f1f5f9" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  {columns.map(col => (
                    <td key={col.key} className="px-5 py-3.5 text-sm whitespace-nowrap">
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
                <tr>
                  <td colSpan={columns.length + 1} className="px-5 py-14 text-center text-sm" style={{ color: "#94a3b8" }}>
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3" style={{ borderTop: "1px solid #f1f5f9" }}>
          <span className="text-xs" style={{ color: "#94a3b8" }}>
            Halaman <strong style={{ color: "#1e293b" }}>{page}</strong> dari <strong style={{ color: "#1e293b" }}>{totalPages}</strong>
          </span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-40"
              style={{ border: "1px solid #e2e8f0", color: "#64748b" }}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all"
                style={{ background: page === p ? color : "white", color: page === p ? "white" : "#64748b", border: `1px solid ${page === p ? color : "#e2e8f0"}` }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-40"
              style={{ border: "1px solid #e2e8f0", color: "#64748b" }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
function Detail() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("leadtime");
  const navigate = useNavigate();

  // Master data untuk dropdown form
  const [brands, setBrands] = useState([]);
  const [subBrands, setSubBrands] = useState([]);
  const [products, setProducts] = useState([]);

  // Filter global
  const [filterBrand, setFilterBrand] = useState("");
  const [filterSubBrand, setFilterSubBrand] = useState("");
  const [loading, setLoading] = useState(false);

  // Data tabel
  const [leadtime, setLeadtime] = useState([]);
  const [stockIndomaret, setStockIndomaret] = useState([]);
  const [serviceLevel, setServiceLevel] = useState([]);
  const [stockDistributor, setStockDistributor] = useState([]);

  // Modal state
  const [formOpen, setFormOpen] = useState({ leadtime: false, stockIndomaret: false, serviceLevel: false, stockDistributor: false });
  const [editData, setEditData] = useState({ leadtime: null, stockIndomaret: null, serviceLevel: null, stockDistributor: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, type: null });
  const [toast, setToast] = useState({ isOpen: false, type: "success", message: "" });

  const showToast = (type, message) => setToast({ isOpen: true, type, message });
  const closeToast = () => setToast(prev => ({ ...prev, isOpen: false }));

  // Ambil master data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    const h = { Authorization: `Bearer ${token}` };
    axios.get("http://localhost:3000/api/master-table/", { headers: h }).then(r => setBrands(r.data)).catch(() => {});
    axios.get("http://localhost:3000/api/master-table/sub-brand/list", { headers: h }).then(r => setSubBrands(r.data)).catch(() => {});
    axios.get("http://localhost:3000/api/master-table/product/list", { headers: h }).then(r => setProducts(r.data)).catch(() => {});
  }, []);

  // Fetch semua tabel
  useEffect(() => { fetchAll(); }, [filterBrand, filterSubBrand]);

  const fetchAll = async () => {
    setLoading(true);
    const filters = {};
    if (filterBrand) filters.brandId = filterBrand;
    if (filterSubBrand) filters.subBrandId = filterSubBrand;
    const [lt, si, sl, sd] = await Promise.all([
      getLeadtime(filters), getStockIndomaret(filters),
      getServiceLevel(filters), getStockDistributor(filters),
    ]);
    if (lt.success) setLeadtime(lt.data);
    if (si.success) setStockIndomaret(si.data);
    if (sl.success) setServiceLevel(sl.data);
    if (sd.success) setStockDistributor(sd.data);
    setLoading(false);
  };

  const filteredSubBrands = filterBrand ? subBrands.filter(sb => sb.brandId === parseInt(filterBrand)) : subBrands;

  // ── HANDLERS ────────────────────────────────────────────────────────────────
  const openAdd = (type) => {
    setEditData(prev => ({ ...prev, [type]: null }));
    setFormOpen(prev => ({ ...prev, [type]: true }));
  };

  const openEdit = (type, row) => {
    setEditData(prev => ({ ...prev, [type]: row }));
    setFormOpen(prev => ({ ...prev, [type]: true }));
  };

  const closeForm = (type) => {
    setFormOpen(prev => ({ ...prev, [type]: false }));
    setEditData(prev => ({ ...prev, [type]: null }));
  };

  const openDelete = (type, id) => setDeleteModal({ open: true, id, type });
  const closeDelete = () => setDeleteModal({ open: false, id: null, type: null });

  // Submit handlers
  const handleSubmitLeadtime = async (data, id) => {
    const result = id ? await editLeadtime(id, data) : await tambahLeadtime(data);
    if (result.success) { showToast("success", id ? "Leadtime diupdate!" : "Leadtime ditambahkan!"); closeForm("leadtime"); fetchAll(); }
    else showToast("error", result.message);
  };

  const handleSubmitStockIndomaret = async (data, id) => {
    const result = id ? await editStockIndomaret(id, data) : await tambahStockIndomaret(data);
    if (result.success) { showToast("success", id ? "Stock diupdate!" : "Stock ditambahkan!"); closeForm("stockIndomaret"); fetchAll(); }
    else showToast("error", result.message);
  };

  const handleSubmitServiceLevel = async (data, id) => {
    const result = id ? await editServiceLevel(id, data) : await tambahServiceLevel(data);
    if (result.success) { showToast("success", id ? "Service level diupdate!" : "Service level ditambahkan!"); closeForm("serviceLevel"); fetchAll(); }
    else showToast("error", result.message);
  };

  const handleSubmitStockDistributor = async (data, id) => {
    const result = id ? await editStockDistributor(id, data) : await tambahStockDistributor(data);
    if (result.success) { showToast("success", id ? "Stock diupdate!" : "Stock ditambahkan!"); closeForm("stockDistributor"); fetchAll(); }
    else showToast("error", result.message);
  };

  const confirmDelete = async () => {
    const { id, type } = deleteModal;
    const fnMap = { leadtime: hapusLeadtime, stockIndomaret: hapusStockIndomaret, serviceLevel: hapusServiceLevel, stockDistributor: hapusStockDistributor };
    const result = await fnMap[type](id);
    if (result.success) { showToast("success", "Data berhasil dihapus!"); fetchAll(); }
    else showToast("error", result.message);
    closeDelete();
  };

  // ── TABS CONFIG ──────────────────────────────────────────────────────────────
  const tabs = [
    {
      key: "leadtime", label: "Leadtime Delivery", icon: Truck, color: "#2563eb", bg: "#eff6ff",
      data: leadtime,
      onAdd: () => openAdd("leadtime"),
      onEdit: (row) => openEdit("leadtime", row),
      onDelete: (id) => openDelete("leadtime", id),
      columns: [
        { key: "id", label: "ID" },
        { key: "sub_brand", label: "Sub Brand", render: (_, r) => r.sub_brand?.name ?? "—" },
        { key: "product", label: "Product", render: (_, r) => r.product?.name ?? "—" },
        { key: "qtyOrder", label: "Qty Order" },
        { key: "eta", label: "ETA" },
        { key: "status", label: "Status", render: v => <Badge value={v} /> },
        { key: "actualArrivalDate", label: "Actual Arrival", render: v => v ? new Date(v).toLocaleDateString("id-ID") : "—" },
      ]
    },
    {
      key: "stock_indomaret", label: "Stock Indomaret", icon: ShoppingBag, color: "#10b981", bg: "#d1fae5",
      data: stockIndomaret,
      onAdd: () => openAdd("stockIndomaret"),
      onEdit: (row) => openEdit("stockIndomaret", row),
      onDelete: (id) => openDelete("stockIndomaret", id),
      columns: [
        { key: "id", label: "ID" },
        { key: "brand", label: "Brand", render: (_, r) => r.brand?.name ?? "—" },
        { key: "sub_brand", label: "Sub Brand", render: (_, r) => r.sub_brand?.name ?? "—" },
        { key: "product", label: "Product", render: (_, r) => r.product?.name ?? "—" },
        { key: "avgL3m", label: "Avg L3M" },
        { key: "totalValue", label: "Total Value", render: v => `Rp ${Number(v).toLocaleString("id-ID")}` },
        { key: "isActive", label: "Status", render: v => <Badge value={v} /> },
      ]
    },
    {
      key: "service_level", label: "Service Level", icon: BarChart2, color: "#7c3aed", bg: "#ede9fe",
      data: serviceLevel,
      onAdd: () => openAdd("serviceLevel"),
      onEdit: (row) => openEdit("serviceLevel", row),
      onDelete: (id) => openDelete("serviceLevel", id),
      columns: [
        { key: "id", label: "ID" },
        { key: "brand", label: "Brand", render: (_, r) => r.brand?.name ?? "—" },
        { key: "product", label: "Product", render: (_, r) => r.product?.name ?? "—" },
        { key: "totalSales", label: "Total Sales", render: v => `Rp ${Number(v).toLocaleString("id-ID")}` },
        { key: "salesQuantity", label: "Sales Qty" },
        { key: "salesRank", label: "Rank" },
        { key: "performanceCategory", label: "Performance", render: v => <Badge value={v} /> },
        { key: "percentageOfTotal", label: "% Total", render: v => v ? `${v}%` : "—" },
        { key: "periodDate", label: "Period" },
      ]
    },
    {
      key: "stock_distributor", label: "Stock Distributor", icon: Package, color: "#f59e0b", bg: "#fef3c7",
      data: stockDistributor,
      onAdd: () => openAdd("stockDistributor"),
      onEdit: (row) => openEdit("stockDistributor", row),
      onDelete: (id) => openDelete("stockDistributor", id),
      columns: [
        { key: "id", label: "ID" },
        { key: "brand", label: "Brand", render: (_, r) => r.brand?.name ?? "—" },
        { key: "sub_brand", label: "Sub Brand", render: (_, r) => r.sub_brand?.name ?? "—" },
        { key: "product", label: "Product", render: (_, r) => r.product?.name ?? "—" },
        { key: "stockQuantity", label: "Stock Qty" },
        { key: "avgL3m", label: "Avg L3M" },
        { key: "totalValue", label: "Total Value", render: v => `Rp ${Number(v).toLocaleString("id-ID")}` },
        { key: "lastUpdated", label: "Last Updated", render: v => v ? new Date(v).toLocaleDateString("id-ID") : "—" },
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
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "#1e293b" }}>Detail</h1>
            <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Data operasional Indomaret secara detail</p>
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-xl px-6 py-4 mb-5 flex items-center gap-4" style={{ border: "1px solid #e2e8f0" }}>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94a3b8" }}>Filter</span>
            <select value={filterBrand} onChange={e => { setFilterBrand(e.target.value); setFilterSubBrand(""); }}
              className="text-sm px-3 py-2 rounded-lg outline-none" style={{ border: "1px solid #e2e8f0", color: "#1e293b", minWidth: 160 }}>
              <option value="">Semua Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select value={filterSubBrand} onChange={e => setFilterSubBrand(e.target.value)}
              className="text-sm px-3 py-2 rounded-lg outline-none" style={{ border: "1px solid #e2e8f0", color: "#1e293b", minWidth: 160 }}>
              <option value="">Semua Sub Brand</option>
              {filteredSubBrands.map(sb => <option key={sb.id} value={sb.id}>{sb.name}</option>)}
            </select>
            <button onClick={() => { setFilterBrand(""); setFilterSubBrand(""); }}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all"
              style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}
              onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
              onMouseLeave={e => e.currentTarget.style.background = "#f1f5f9"}>
              <RefreshCw size={12} /> Reset
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-5">
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
                    <span className="text-xs font-bold" style={{ color: tab.color }}>{tab.data.length} data</span>
                  </div>
                  <p className="text-xs font-bold" style={{ color: "#1e293b" }}>{tab.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "#94a3b8" }}>{tab.columns.length} kolom</p>
                </button>
              );
            })}
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl flex flex-col flex-1 min-h-0" style={{ border: "1px solid #e2e8f0" }}>
            {/* Header */}
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
                {/* Tab pills */}
                <div className="flex gap-1.5">
                  {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: activeTab === tab.key ? tab.color : "#f1f5f9", color: activeTab === tab.key ? "white" : "#64748b" }}>
                      {tab.label}
                    </button>
                  ))}
                </div>
                {/* Add button */}
                <button onClick={current.onAdd}
                  className="inline-flex items-center gap-2 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                  style={{ background: current.color }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  <Plus size={13} /> Tambah
                </button>
              </div>
            </div>

            <DataTable
              columns={current.columns}
              data={current.data}
              loading={loading}
              onEdit={current.onEdit}
              onDelete={current.onDelete}
              color={current.color}
              accentBg={current.bg}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      <FormLeadtime isOpen={formOpen.leadtime} onClose={() => closeForm("leadtime")} onSubmit={handleSubmitLeadtime} editData={editData.leadtime} brands={brands} subBrands={subBrands} products={products} />
      <FormStockIndomaret isOpen={formOpen.stockIndomaret} onClose={() => closeForm("stockIndomaret")} onSubmit={handleSubmitStockIndomaret} editData={editData.stockIndomaret} brands={brands} subBrands={subBrands} products={products} />
      <FormServiceLevel isOpen={formOpen.serviceLevel} onClose={() => closeForm("serviceLevel")} onSubmit={handleSubmitServiceLevel} editData={editData.serviceLevel} brands={brands} subBrands={subBrands} products={products} />
      <FormStockDistributor isOpen={formOpen.stockDistributor} onClose={() => closeForm("stockDistributor")} onSubmit={handleSubmitStockDistributor} editData={editData.stockDistributor} brands={brands} subBrands={subBrands} products={products} />

      <DeleteConfirmation isOpen={deleteModal.open} onConfirm={confirmDelete} onCancel={closeDelete} item="data ini" />
      <Toast isOpen={toast.isOpen} onClose={closeToast} type={toast.type} message={toast.message} duration={3000} />
    </div>
  );
}

export default Detail;