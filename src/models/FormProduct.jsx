import React, { useState, useEffect, useMemo } from "react";
import { X, AlertCircle } from "lucide-react";
import { useFormValidation, v } from "../hooks/useFormValidation";

const RULES = {
  name:           v.required('Nama product'),
  brandId:        v.positiveInt('Brand'),
  subBrandId:     v.positiveInt('Sub Brand'),
  hargaPerCarton: v.decimal('Harga per karton', 0),
  qtyPerCarton:   v.int('Qty per karton', 1),
};
const ic = (err) => ({ border: `1px solid ${err ? '#ef4444' : '#e2e8f0'}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#1e293b", width: "100%", outline: "none", background: "white" });
const ls = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" };
const Err = ({ msg }) => msg ? <span className="flex items-center gap-1 mt-1 text-xs" style={{ color: "#ef4444" }}><AlertCircle size={11} />{msg}</span> : null;
const fmtRp = (val) => String(val || "").replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const parseRp = (val) => val.replace(/\./g, "");
const EMPTY = { name: "", brandId: "", subBrandId: "", hargaPerCarton: "", qtyPerCarton: "" };

function FormProduct({ isOpen, onClose, onSubmit, onError = () => {}, subBrands, brands, editData }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const { errors, validate, clearError } = useFormValidation(RULES);

  useEffect(() => {
    if (editData) {
      const sb = subBrands?.find(s => s.id === editData.subBrandId);
      setForm({ name: editData.name, brandId: sb?.brandId || "", subBrandId: editData.subBrandId, hargaPerCarton: editData.hargaPerCarton ?? "", qtyPerCarton: editData.qtyPerCarton ?? "" });
    } else {
      setForm(EMPTY);
    }
  }, [editData, isOpen]);

  const filteredSub = useMemo(() =>
    form.brandId ? subBrands?.filter(sb => sb.brandId === parseInt(form.brandId)) : subBrands,
  [subBrands, form.brandId]);

  const set = (name, value) => {
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'brandId') { next.subBrandId = ""; }
      return next;
    });
    clearError(name);
  };

  const harga = parseFloat(String(form.hargaPerCarton).replace(/\./g, '')) || 0;
  const qty   = parseInt(form.qtyPerCarton) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    setLoading(true);
    await onSubmit({ name: form.name, subBrandId: form.subBrandId, hargaPerCarton: harga, qtyPerCarton: qty }, editData?.id);
    setLoading(false);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <span className="text-sm font-bold" style={{ color: "#1e293b" }}>{editData ? "Edit Product" : "Tambah Product"}</span>
          <button onClick={onClose} style={{ color: "#94a3b8" }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

          <div>
            <label style={ls}>Nama Product <span style={{color:"#ef4444"}}>*</span></label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Masukkan nama product" style={ic(errors.name)} />
            <Err msg={errors.name} />
          </div>

          <div>
            <label style={ls}>Brand <span style={{color:"#ef4444"}}>*</span></label>
            <select value={form.brandId} onChange={e => set('brandId', e.target.value)} style={{ ...ic(errors.brandId), appearance: "none" }}>
              <option value="">Pilih Brand</option>
              {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <Err msg={errors.brandId} />
          </div>

          <div>
            <label style={ls}>Sub Brand <span style={{color:"#ef4444"}}>*</span></label>
            <select value={form.subBrandId} onChange={e => set('subBrandId', e.target.value)} disabled={!form.brandId}
              style={{ ...ic(errors.subBrandId), appearance: "none", opacity: !form.brandId ? 0.4 : 1, cursor: !form.brandId ? "not-allowed" : "pointer" }}>
              <option value="">{form.brandId ? "Pilih Sub Brand" : "Pilih Brand dulu"}</option>
              {filteredSub?.map(sb => <option key={sb.id} value={sb.id}>{sb.name}</option>)}
            </select>
            <Err msg={errors.subBrandId} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={ls}>Harga / Karton (Rp) <span style={{color:"#ef4444"}}>*</span></label>
              <input type="text" value={fmtRp(form.hargaPerCarton)} onChange={e => set('hargaPerCarton', parseRp(e.target.value))} placeholder="0" style={ic(errors.hargaPerCarton)} />
              <Err msg={errors.hargaPerCarton} />
            </div>
            <div>
              <label style={ls}>Qty / Karton (pcs) <span style={{color:"#ef4444"}}>*</span></label>
              <input type="number" value={form.qtyPerCarton} onChange={e => set('qtyPerCarton', e.target.value)} placeholder="1" style={ic(errors.qtyPerCarton)} min="1" />
              <Err msg={errors.qtyPerCarton} />
            </div>
          </div>

          {harga > 0 && qty > 0 && (
            <div className="px-4 py-3 rounded-lg text-sm" style={{ background: "#eff6ff", border: "1px solid #dbeafe" }}>
              <span style={{ color: "#64748b" }}>Harga per pcs: </span>
              <strong style={{ color: "#2563eb" }}>Rp {(harga / qty).toLocaleString("id-ID", { maximumFractionDigits: 0 })}</strong>
            </div>
          )}

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
export default FormProduct;