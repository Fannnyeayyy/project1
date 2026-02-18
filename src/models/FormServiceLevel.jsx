/**
 * FormServiceLevel.jsx
 * Modal form untuk tambah / edit data Service Level Performance.
 * Props: isOpen, onClose, onSubmit, editData, brands, subBrands, products
 */
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const inputStyle = { appearance: "none",
  border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px",
  fontSize: 14, color: "#1e293b", width: "100%", outline: "none",
};
const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" };

const CATEGORIES = ["Excellent", "Good", "Average", "Below Average"];

function FormServiceLevel({ isOpen, onClose, onSubmit, editData, brands = [], subBrands = [], products = [] }) {
  const empty = { brandId: "", subBrandId: "", productId: "", totalSales: "", salesQuantity: "", salesRank: "", performanceCategory: "", percentageOfTotal: "", periodDate: "" };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        brandId: editData.brandId ?? "",
        subBrandId: editData.subBrandId ?? "",
        productId: editData.productId ?? "",
        totalSales: editData.totalSales ?? "",
        salesQuantity: editData.salesQuantity ?? "",
        salesRank: editData.salesRank ?? "",
        performanceCategory: editData.performanceCategory ?? "",
        percentageOfTotal: editData.percentageOfTotal ?? "",
        periodDate: editData.periodDate ?? "",
      });
    } else {
      setForm(empty);
    }
  }, [editData, isOpen]);

  const filteredSubBrands = form.brandId ? subBrands.filter(sb => sb.brandId === parseInt(form.brandId)) : subBrands;
  const filteredProducts = form.subBrandId ? products.filter(p => p.subBrandId === parseInt(form.subBrandId)) : products;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brandId || !form.subBrandId || !form.productId || !form.totalSales || !form.salesQuantity || !form.periodDate) return alert("Semua field wajib diisi");
    setLoading(true);
    await onSubmit({
      ...form,
      totalSales: parseFloat(form.totalSales),
      salesQuantity: parseInt(form.salesQuantity),
      salesRank: form.salesRank ? parseInt(form.salesRank) : null,
      percentageOfTotal: form.percentageOfTotal ? parseFloat(form.percentageOfTotal) : null,
    }, editData?.id);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <span className="text-sm font-bold" style={{ color: "#1e293b" }}>
            {editData ? "Edit Service Level" : "Tambah Service Level"}
          </span>
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
              <label style={labelStyle}>Total Sales (Rp)</label>
              <input type="number" name="totalSales" value={form.totalSales} onChange={handleChange} placeholder="0" style={inputStyle} min="0" />
            </div>
            <div>
              <label style={labelStyle}>Sales Qty</label>
              <input type="number" name="salesQuantity" value={form.salesQuantity} onChange={handleChange} placeholder="0" style={inputStyle} min="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Sales Rank</label>
              <input type="number" name="salesRank" value={form.salesRank} onChange={handleChange} placeholder="1" style={inputStyle} min="1" />
            </div>
            <div>
              <label style={labelStyle}>% of Total</label>
              <input type="number" name="percentageOfTotal" value={form.percentageOfTotal} onChange={handleChange} placeholder="0.00" style={inputStyle} min="0" max="100" step="0.01" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Performance Category</label>
            <select name="performanceCategory" value={form.performanceCategory} onChange={handleChange} style={inputStyle}>
              <option value="">Pilih Kategori</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Period Date</label>
            <input type="date" name="periodDate" value={form.periodDate} onChange={handleChange} style={inputStyle} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>
              Batal
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: "#7c3aed" }}>
              {loading ? "Menyimpan..." : editData ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormServiceLevel;