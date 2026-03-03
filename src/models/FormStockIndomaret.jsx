import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import SearchableDropdown from "../components/SearchableDropdown";
import { useFormValidation, v } from "../hooks/useFormValidation";

const RULES = {
  brandId:    v.positiveInt('Brand'),
  subBrandId: v.positiveInt('Sub Brand'),
  productId:  v.positiveInt('Product'),
  avgL3m:     v.int('Avg L3M', 0),
};
const ic = (err) => ({ border: `1px solid ${err ? '#ef4444' : '#e2e8f0'}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#1e293b", width: "100%", outline: "none", background: "white" });
const ls = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" };
const Err = ({ msg }) => msg ? <span className="flex items-center gap-1 mt-1 text-xs" style={{ color: "#ef4444" }}><AlertCircle size={11} />{msg}</span> : null;
const EMPTY = { brandId: "", subBrandId: "", productId: "", avgL3m: "", isActive: true, periodDate: "" };

function FormStockIndomaret({ isOpen, onClose, onSubmit, onError = () => {}, editData, brands = [], subBrands = [], products = [] }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const { errors, validate, clearError } = useFormValidation(RULES);

  useEffect(() => {
    setForm(editData ? {
      brandId: editData.brandId ?? "", subBrandId: editData.subBrandId ?? "",
      productId: editData.productId ?? "", avgL3m: editData.avgL3m ?? "",
      isActive: editData.isActive ?? true, periodDate: editData.periodDate ?? "",
    } : EMPTY);
  }, [editData, isOpen]);

  const filteredSub  = form.brandId    ? subBrands.filter(sb => sb.brandId   === parseInt(form.brandId))    : [];
  const filteredProd = form.subBrandId ? products.filter(p  => p.subBrandId  === parseInt(form.subBrandId)) : [];

  const set = (name, value) => {
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'brandId')    { next.subBrandId = ""; next.productId = ""; }
      if (name === 'subBrandId') { next.productId = ""; }
      return next;
    });
    clearError(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    setLoading(true);
    await onSubmit({ ...form, brandId: parseInt(form.brandId), subBrandId: parseInt(form.subBrandId), productId: parseInt(form.productId), avgL3m: parseInt(form.avgL3m) }, editData?.id);
    setLoading(false);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <span className="text-sm font-bold" style={{ color: "#1e293b" }}>{editData ? "Edit Stock Indomaret" : "Tambah Stock Indomaret"}</span>
          <button onClick={onClose} style={{ color: "#94a3b8" }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

          <div>
            <label style={ls}>Brand <span style={{color:"#ef4444"}}>*</span></label>
            <select value={form.brandId} onChange={e => set('brandId', e.target.value)} style={{ ...ic(errors.brandId), appearance: "none" }}>
              <option value="">Pilih Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <Err msg={errors.brandId} />
          </div>

          <div>
            <label style={ls}>Sub Brand <span style={{color:"#ef4444"}}>*</span></label>
            <select value={form.subBrandId} onChange={e => set('subBrandId', e.target.value)} disabled={!form.brandId}
              style={{ ...ic(errors.subBrandId), appearance: "none", opacity: !form.brandId ? 0.4 : 1, cursor: !form.brandId ? "not-allowed" : "pointer" }}>
              <option value="">{form.brandId ? "Pilih Sub Brand" : "Pilih Brand dulu"}</option>
              {filteredSub.map(sb => <option key={sb.id} value={sb.id}>{sb.name}</option>)}
            </select>
            <Err msg={errors.subBrandId} />
          </div>

          <div>
            <label style={ls}>Product <span style={{color:"#ef4444"}}>*</span></label>
            <SearchableDropdown
              options={filteredProd.map(p => ({ value: p.id, label: p.name }))}
              value={form.productId} onChange={val => set('productId', val)}
              placeholder={form.subBrandId ? "Pilih Product" : "Pilih Sub Brand dulu"}
              disabled={!form.subBrandId} hasError={!!errors.productId}
            />
            <Err msg={errors.productId} />
          </div>

          <div>
            <label style={ls}>Avg L3M (Qty) <span style={{color:"#ef4444"}}>*</span></label>
            <input type="number" value={form.avgL3m} onChange={e => set('avgL3m', e.target.value)} placeholder="0" style={ic(errors.avgL3m)} min="0" />
            <Err msg={errors.avgL3m} />
          </div>

          <div>
            <label style={ls}>Period Date</label>
            <input type="date" value={form.periodDate} onChange={e => set('periodDate', e.target.value)} style={ic(false)} />
          </div>

          <div className="flex items-center gap-3">
            <label style={ls}>Status</label>
            <button type="button" onClick={() => set('isActive', !form.isActive)}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: form.isActive ? "#d1fae5" : "#fee2e2", color: form.isActive ? "#10b981" : "#ef4444" }}>
              {form.isActive ? "Active" : "Inactive"}
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>Batal</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50" style={{ background: "#0ea5e9" }}>
              {loading ? "Menyimpan..." : editData ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default FormStockIndomaret;