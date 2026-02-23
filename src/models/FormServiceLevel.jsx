import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import SearchableDropdown from "../components/SearchableDropdown";

const inputStyle = { border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#1e293b", width: "100%", outline: "none", background: "white" };
const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" };

function FormServiceLevel({ isOpen, onClose, onSubmit, onError = () => {}, editData, brands = [], subBrands = [], products = [] }) {
  const empty = { brandId: "", subBrandId: "", productId: "", totalSales: "", actualSales: "", };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        brandId:     editData.brandId ?? "",
        subBrandId:  editData.subBrandId ?? "",
        productId:   editData.productId ?? "",
        totalSales:  editData.totalSales ?? "",
        actualSales: editData.actualSales ?? "",
        });
    } else {
      setForm(empty);
    }
  }, [editData, isOpen]);

  const filteredSubBrands = form.brandId ? subBrands.filter(sb => sb.brandId === parseInt(form.brandId)) : subBrands;
  const filteredProducts  = form.subBrandId ? products.filter(p => p.subBrandId === parseInt(form.subBrandId)) : products;

  // Auto-calc preview
  const total  = parseInt(form.totalSales) || 0;
  const actual = parseInt(form.actualSales) || 0;
  const lose   = total - actual;
  const perf   = total > 0 ? ((actual / total) * 100).toFixed(1) : 0;
  const category = perf >= 95 ? "Excellent" : perf >= 85 ? "Good" : perf >= 70 ? "Average" : "Below Average";
  const categoryColor = { Excellent: "#2563eb", Good: "#10b981", Average: "#f59e0b", "Below Average": "#ef4444" };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brandId || !form.subBrandId || !form.productId || !form.totalSales || !form.actualSales)
      return onError("Semua field wajib diisi");
    if (parseInt(form.actualSales) > parseInt(form.totalSales))
      return onError("Actual Sales tidak boleh lebih dari Total Sales");
    setLoading(true);
    await onSubmit({
      ...form,
      brandId:     parseInt(form.brandId),
      subBrandId:  parseInt(form.subBrandId),
      productId:   parseInt(form.productId),
      totalSales:  parseInt(form.totalSales),
      actualSales: parseInt(form.actualSales),
    }, editData?.id);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <span className="text-sm font-bold" style={{ color: "#1e293b" }}>{editData ? "Edit Service Level" : "Tambah Service Level"}</span>
          <button onClick={onClose} style={{ color: "#94a3b8" }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label style={labelStyle}>Brand</label>
            <select name="brandId" value={form.brandId} onChange={handleChange} style={{ ...inputStyle, appearance: "none" }}>
              <option value="">Pilih Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Sub Brand</label>
            <select name="subBrandId" value={form.subBrandId} onChange={handleChange} style={{ ...inputStyle, appearance: "none" }}>
              <option value="">Pilih Sub Brand</option>
              {filteredSubBrands.map(sb => <option key={sb.id} value={sb.id}>{sb.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Product</label>
            <SearchableDropdown
              options={filteredProducts.map(p => ({ value: p.id, label: p.name }))}
              value={form.productId}
              onChange={val => setForm(prev => ({ ...prev, productId: val }))}
              placeholder="Pilih Product"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Total Sales (Qty Diminta)</label>
              <input type="number" name="totalSales" value={form.totalSales} onChange={handleChange} placeholder="0" style={inputStyle} min="0" />
            </div>
            <div>
              <label style={labelStyle}>Actual Sales (Qty Dipenuhi)</label>
              <input type="number" name="actualSales" value={form.actualSales} onChange={handleChange} placeholder="0" style={inputStyle} min="0" />
            </div>
          </div>

          {/* Auto-calc preview */}
          {total > 0 && actual > 0 && (
            <div className="px-4 py-3 rounded-lg flex flex-col gap-1" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#64748b" }}>Lose Sales:</span>
                <strong style={{ color: lose > 0 ? "#ef4444" : "#10b981" }}>{lose} qty</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#64748b" }}>Performance:</span>
                <strong style={{ color: categoryColor[category] }}>{perf}% — {category}</strong>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>Batal</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
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