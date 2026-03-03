import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { useFormValidation, v } from "../hooks/useFormValidation";

const RULES = {
  brandId:    v.positiveInt('Brand'),
  subBrandId: v.positiveInt('Sub Brand'),
  productId:  v.positiveInt('Product'),
  periodDate: v.requiredDate('Period Date'),
  week1: v.decimal('Week 1', 0),
  week2: v.decimal('Week 2', 0),
  week3: v.decimal('Week 3', 0),
  week4: v.decimal('Week 4', 0),
};

const fmtRp   = (val) => String(val || "").replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const parseRp = (val) => String(val).replace(/\./g, "");

const inputCls = (err) => ({ border: `1px solid ${err ? '#ef4444' : '#e2e8f0'}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#1e293b", width: "100%", outline: "none", background: "white" });
const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" };
const FieldError = ({ msg }) => msg ? <span className="flex items-center gap-1 text-xs mt-1" style={{ color: "#ef4444" }}><AlertCircle size={11} />{msg}</span> : null;

const EMPTY = { brandId: "", subBrandId: "", productId: "", week1: "", week2: "", week3: "", week4: "", periodDate: "" };

function FormForecast({ isOpen, onClose, onSubmit, editData, brands = [], subBrands = [], products = [], onError = () => {} }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const { errors, validate, clearError } = useFormValidation(RULES);

  const filteredSubBrands = form.brandId ? subBrands.filter(sb => sb.brandId === parseInt(form.brandId)) : [];
  const filteredProducts  = form.subBrandId ? products.filter(p => p.subBrandId === parseInt(form.subBrandId)) : [];

  useEffect(() => {
    setForm(editData ? { brandId: editData.brandId ?? "", subBrandId: editData.subBrandId ?? "", productId: editData.productId ?? "", week1: editData.week1 ?? "", week2: editData.week2 ?? "", week3: editData.week3 ?? "", week4: editData.week4 ?? "", periodDate: editData.periodDate ?? "" } : EMPTY);
  }, [editData, isOpen]);

  const set = (name, value) => {
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'brandId')    { next.subBrandId = ""; next.productId = ""; }
      if (name === 'subBrandId') { next.productId = ""; }
      return next;
    });
    clearError(name);
  };

  const handleWeek = (name, value) => {
    set(name, parseRp(value));
  };

  const total = ["week1","week2","week3","week4"].reduce((s, w) => s + (parseFloat(form[w]) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    setLoading(true);
    await onSubmit({ brandId: parseInt(form.brandId), subBrandId: parseInt(form.subBrandId), productId: parseInt(form.productId), week1: parseFloat(form.week1)||0, week2: parseFloat(form.week2)||0, week3: parseFloat(form.week3)||0, week4: parseFloat(form.week4)||0, periodDate: form.periodDate }, editData?.id);
    setLoading(false);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <span className="text-sm font-bold" style={{ color: "#1e293b" }}>{editData ? "Edit Forecast" : "Tambah Forecast"}</span>
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
            <select name="productId" value={form.productId} onChange={e => set('productId', e.target.value)} disabled={!form.subBrandId}
              style={{ ...inputCls(errors.productId), appearance: "none", opacity: !form.subBrandId ? 0.5 : 1 }}>
              <option value="">Pilih Product</option>
              {filteredProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <FieldError msg={errors.productId} />
          </div>
          <div>
            <label style={labelStyle}>Period Date <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="date" name="periodDate" value={form.periodDate} onChange={e => set('periodDate', e.target.value)} style={inputCls(errors.periodDate)} />
            <FieldError msg={errors.periodDate} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["week1","week2","week3","week4"].map((w, i) => (
              <div key={w}>
                <label style={labelStyle}>Week {i+1} (Rp)</label>
                <input type="text" name={w} value={fmtRp(form[w])} onChange={e => handleWeek(w, e.target.value)} placeholder="0" style={inputCls(errors[w])} />
                <FieldError msg={errors[w]} />
              </div>
            ))}
          </div>
          <div className="px-4 py-3 rounded-lg" style={{ background: "#fef3c7", border: "1px solid #fde68a" }}>
            <span className="text-xs font-semibold" style={{ color: "#92400e" }}>Total 4 Minggu: </span>
            <strong className="text-sm" style={{ color: "#78350f" }}>Rp {total.toLocaleString("id-ID")}</strong>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>Batal</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50" style={{ background: "#f59e0b" }}>
              {loading ? "Menyimpan..." : editData ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default FormForecast;