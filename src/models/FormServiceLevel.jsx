import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import SearchableDropdown from "../components/SearchableDropdown";
import { useFormValidation, v } from "../hooks/useFormValidation";

const RULES = {
  brandId:     v.positiveInt('Brand'),
  subBrandId:  v.positiveInt('Sub Brand'),
  productId:   v.positiveInt('Product'),
  totalSales:  v.int('Total Sales', 0),
  actualSales: (val, form) => {
    const err = v.int('Actual Sales', 0)(val, form);
    if (err) return err;
    return v.maxRef('Actual Sales', 'totalSales', 'Total Sales')(val, form);
  },
  periodDate: v.requiredDate('Period Date'),
};

const inputCls = (err) => ({ border: `1px solid ${err ? '#ef4444' : '#e2e8f0'}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#1e293b", width: "100%", outline: "none", background: "white" });
const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" };
const FieldError = ({ msg }) => msg ? <span className="flex items-center gap-1 text-xs mt-1" style={{ color: "#ef4444" }}><AlertCircle size={11} />{msg}</span> : null;

const EMPTY = { brandId: "", subBrandId: "", productId: "", totalSales: "", actualSales: "", periodDate: "" };

function FormServiceLevel({ isOpen, onClose, onSubmit, onError = () => {}, editData, brands = [], subBrands = [], products = [] }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const { errors, validate, clearError } = useFormValidation(RULES);

  useEffect(() => {
    setForm(editData ? { brandId: editData.brandId ?? "", subBrandId: editData.subBrandId ?? "", productId: editData.productId ?? "", totalSales: editData.totalSales ?? "", actualSales: editData.actualSales ?? "", periodDate: editData.periodDate ?? "" } : EMPTY);
  }, [editData, isOpen]);

  const filteredSubBrands = form.brandId ? subBrands.filter(sb => sb.brandId === parseInt(form.brandId)) : subBrands;
  const filteredProducts  = form.subBrandId ? products.filter(p => p.subBrandId === parseInt(form.subBrandId)) : products;

  const set = (name, value) => {
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'brandId')    { next.subBrandId = ""; next.productId = ""; }
      if (name === 'subBrandId') { next.productId = ""; }
      return next;
    });
    clearError(name);
  };

  const total  = parseInt(form.totalSales) || 0;
  const actual = parseInt(form.actualSales) || 0;
  const lose   = total - actual;
  const perf   = total > 0 ? ((actual / total) * 100).toFixed(1) : 0;
  const category = perf >= 95 ? "Excellent" : perf >= 85 ? "Good" : perf >= 70 ? "Average" : "Below Average";
  const catColor = { Excellent: "#2563eb", Good: "#10b981", Average: "#f59e0b", "Below Average": "#ef4444" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    setLoading(true);
    await onSubmit({ ...form, brandId: parseInt(form.brandId), subBrandId: parseInt(form.subBrandId), productId: parseInt(form.productId), totalSales: parseInt(form.totalSales), actualSales: parseInt(form.actualSales) }, editData?.id);
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
            <select name="brandId" value={form.brandId} onChange={e => set('brandId', e.target.value)} style={{ ...inputCls(errors.brandId), appearance: "none" }}>
              <option value="">Pilih Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <FieldError msg={errors.brandId} />
          </div>
          <div>
            <label style={labelStyle}>Sub Brand</label>
            <select name="subBrandId" value={form.subBrandId} onChange={e => set('subBrandId', e.target.value)} disabled={!form.brandId}
              style={{ ...inputCls(errors.subBrandId), appearance: "none", opacity: !form.brandId ? 0.5 : 1 }}>
              <option value="">Pilih Sub Brand</option>
              {filteredSubBrands.map(sb => <option key={sb.id} value={sb.id}>{sb.name}</option>)}
            </select>
            <FieldError msg={errors.subBrandId} />
          </div>
          <div>
            <label style={labelStyle}>Product</label>
            <SearchableDropdown options={filteredProducts.map(p => ({ value: p.id, label: p.name }))} value={form.productId} onChange={val => set('productId', val)} placeholder="Pilih Product" hasError={!!errors.productId} />
            <FieldError msg={errors.productId} />
          </div>
          <div>
            <label style={labelStyle}>Period Date <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="date" name="periodDate" value={form.periodDate} onChange={e => set('periodDate', e.target.value)} style={inputCls(errors.periodDate)} />
            <FieldError msg={errors.periodDate} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Total Sales (Qty)</label>
              <input type="number" name="totalSales" value={form.totalSales} onChange={e => set('totalSales', e.target.value)} placeholder="0" style={inputCls(errors.totalSales)} min="0" />
              <FieldError msg={errors.totalSales} />
            </div>
            <div>
              <label style={labelStyle}>Actual Sales (Qty)</label>
              <input type="number" name="actualSales" value={form.actualSales} onChange={e => set('actualSales', e.target.value)} placeholder="0" style={inputCls(errors.actualSales)} min="0" />
              <FieldError msg={errors.actualSales} />
            </div>
          </div>
          {total > 0 && actual >= 0 && (
            <div className="px-4 py-3 rounded-lg flex flex-col gap-1" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div className="flex justify-between text-xs"><span style={{ color: "#64748b" }}>Lose Sales:</span><strong style={{ color: lose > 0 ? "#ef4444" : "#10b981" }}>{lose} qty</strong></div>
              <div className="flex justify-between text-xs"><span style={{ color: "#64748b" }}>Performance:</span><strong style={{ color: catColor[category] }}>{perf}% — {category}</strong></div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>Batal</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50" style={{ background: "#7c3aed" }}>
              {loading ? "Menyimpan..." : editData ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default FormServiceLevel;