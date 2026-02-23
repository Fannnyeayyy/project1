import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import SearchableDropdown from "../components/SearchableDropdown";

const inputStyle = { border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#1e293b", width: "100%", outline: "none", background: "white" };
const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" };

const STATUS_OPTIONS = ["Pending", "In Transit", "Delivered", "Delayed", "Cancelled"];
const STATUS_COLORS = {
  "Pending":    { bg: "#f1f5f9", color: "#64748b" },
  "In Transit": { bg: "#dbeafe", color: "#2563eb" },
  "Delivered":  { bg: "#d1fae5", color: "#10b981" },
  "Delayed":    { bg: "#fee2e2", color: "#ef4444" },
  "Cancelled":  { bg: "#f3f4f6", color: "#6b7280" },
};

function FormLeadtime({ isOpen, onClose, onSubmit, onError = () => {}, editData, brands = [], subBrands = [], products = [] }) {
  const empty = { brandId: "", subBrandId: "", productId: "", qtyOrder: "", eta: "", status: "Pending", tanggalKeluarPabrik: "", notes: "" };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        brandId: editData.brandId ?? "",
        subBrandId: editData.subBrandId ?? "",
        productId: editData.productId ?? "",
        qtyOrder: editData.qtyOrder ?? "",
        eta: editData.eta ?? "",
        status: editData.status ?? "Pending",
        tanggalKeluarPabrik: editData.tanggalKeluarPabrik ?? "",
        notes: editData.notes ?? "",
      });
    } else {
      setForm(empty);
    }
  }, [editData, isOpen]);

  const filteredSubBrands = form.brandId ? subBrands.filter(sb => sb.brandId === parseInt(form.brandId)) : subBrands;
  const filteredProducts  = form.subBrandId ? products.filter(p => p.subBrandId === parseInt(form.subBrandId)) : products;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brandId || !form.subBrandId || !form.productId || !form.qtyOrder || !form.eta) return onError("Semua field wajib diisi");
    setLoading(true);
    await onSubmit({
      ...form,
      brandId: parseInt(form.brandId),
      subBrandId: parseInt(form.subBrandId),
      productId: parseInt(form.productId),
      qtyOrder: parseInt(form.qtyOrder),
    }, editData?.id);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <span className="text-sm font-bold" style={{ color: "#1e293b" }}>{editData ? "Edit Leadtime" : "Tambah Leadtime"}</span>
          <button onClick={onClose} style={{ color: "#94a3b8" }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Brand */}
          <div>
            <label style={labelStyle}>Brand</label>
            <select name="brandId" value={form.brandId} onChange={handleChange} style={{ ...inputStyle, appearance: "none" }}>
              <option value="">Pilih Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          {/* Sub Brand */}
          <div>
            <label style={labelStyle}>Sub Brand</label>
            <select name="subBrandId" value={form.subBrandId} onChange={handleChange} style={{ ...inputStyle, appearance: "none" }}>
              <option value="">Pilih Sub Brand</option>
              {filteredSubBrands.map(sb => <option key={sb.id} value={sb.id}>{sb.name}</option>)}
            </select>
          </div>

          {/* Product */}
          <div>
            <label style={labelStyle}>Product</label>
            <SearchableDropdown
              options={filteredProducts.map(p => ({ value: p.id, label: p.name }))}
              value={form.productId}
              onChange={val => setForm(prev => ({ ...prev, productId: val }))}
              placeholder="Pilih Product"
            />
          </div>

          {/* Qty Order */}
          <div>
            <label style={labelStyle}>Qty Order (Karton)</label>
            <input type="number" name="qtyOrder" value={form.qtyOrder} onChange={handleChange} placeholder="0" style={inputStyle} min="0" />
          </div>

          {/* Tanggal Keluar Pabrik & ETA */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Tgl Keluar Pabrik</label>
              <input type="date" name="tanggalKeluarPabrik" value={form.tanggalKeluarPabrik} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>ETA</label>
              <input type="date" name="eta" value={form.eta} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} style={{ ...inputStyle, appearance: "none" }}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Catatan tambahan..." rows={3}
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>Batal</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: "#2563eb" }}>
              {loading ? "Menyimpan..." : editData ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormLeadtime;