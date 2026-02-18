/**
 * FormLeadtime.jsx
 * Modal form untuk tambah / edit data Leadtime Delivery.
 * Fix: tambah field brandId — dropdown cascade Brand → SubBrand → Product.
 */
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const inputStyle = { appearance: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#1e293b", width: "100%", outline: "none" };
const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" };

function FormLeadtime({ isOpen, onClose, onSubmit, onError = () => {}, editData, brands = [], subBrands = [], products = [] }) {
  const empty = { brandId: "", subBrandId: "", productId: "", qtyOrder: "", eta: "", status: false, actualArrivalDate: "" };
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
        status: editData.status ?? false,
        actualArrivalDate: editData.actualArrivalDate ? editData.actualArrivalDate.split("T")[0] : "",
      });
    } else {
      setForm(empty);
    }
  }, [editData, isOpen]);

  const filteredSubBrands = form.brandId ? subBrands.filter(sb => sb.brandId === parseInt(form.brandId)) : subBrands;
  const filteredProducts  = form.subBrandId ? products.filter(p => p.subBrandId === parseInt(form.subBrandId)) : products;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brandId || !form.subBrandId || !form.productId || !form.qtyOrder || !form.eta) return onError("Semua field wajib diisi");
    setLoading(true);
    await onSubmit({ ...form, brandId: parseInt(form.brandId), subBrandId: parseInt(form.subBrandId), productId: parseInt(form.productId), qtyOrder: parseInt(form.qtyOrder) }, editData?.id);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <span className="text-sm font-bold" style={{ color: "#1e293b" }}>{editData ? "Edit Leadtime Delivery" : "Tambah Leadtime Delivery"}</span>
          <button onClick={onClose} style={{ color: "#94a3b8" }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label style={labelStyle}>Brand</label>
            <select name="brandId" value={form.brandId} onChange={handleChange} style={inputStyle}>
              <option value="">Pilih Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Sub Brand</label>
            <select name="subBrandId" value={form.subBrandId} onChange={handleChange} style={inputStyle}>
              <option value="">Pilih Sub Brand</option>
              {filteredSubBrands.map(sb => <option key={sb.id} value={sb.id}>{sb.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Product</label>
            <select name="productId" value={form.productId} onChange={handleChange} style={inputStyle}>
              <option value="">Pilih Product</option>
              {filteredProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Qty Order</label>
              <input type="number" name="qtyOrder" value={form.qtyOrder} onChange={handleChange} placeholder="0" style={inputStyle} min="1" />
            </div>
            <div>
              <label style={labelStyle}>ETA</label>
              <input type="date" name="eta" value={form.eta} onChange={handleChange} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Actual Arrival Date</label>
            <input type="date" name="actualArrivalDate" value={form.actualArrivalDate} onChange={handleChange} style={inputStyle} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="status" checked={form.status} onChange={handleChange} id="status-lt" className="w-4 h-4" style={{ accentColor: "#2563eb" }} />
            <label htmlFor="status-lt" className="text-sm font-medium" style={{ color: "#64748b" }}>Sudah tiba</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>Batal</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50" style={{ background: "#2563eb" }}>
              {loading ? "Menyimpan..." : editData ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormLeadtime;