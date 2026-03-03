import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import SearchableDropdown from "../components/SearchableDropdown";
import { useFormValidation, v } from "../hooks/useFormValidation";

const STATUS_OPTIONS = ["Pending", "In Transit", "Delivered", "Delayed", "Cancelled"];
const RULES = {
  brandId:             v.positiveInt('Brand'),
  subBrandId:          v.positiveInt('Sub Brand'),
  productId:           v.positiveInt('Product'),
  qtyOrder:            v.int('Qty Order', 1),
  eta:                 (val, form) => v.requiredDate('ETA')(val) || v.etaAfterFactory()(val, form),
  status:              v.required('Status'),
  tanggalKeluarPabrik: () => null, // opsional
};

const ic = (err) => ({ border: `1px solid ${err ? '#ef4444' : '#e2e8f0'}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#1e293b", width: "100%", outline: "none", background: "white" });
const ls = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" };
const Err = ({ msg }) => msg ? <span className="flex items-center gap-1 mt-1 text-xs" style={{ color: "#ef4444" }}><AlertCircle size={11} />{msg}</span> : null;
const EMPTY = { brandId: "", subBrandId: "", productId: "", qtyOrder: "", eta: "", status: "Pending", tanggalKeluarPabrik: "", notes: "" };

function FormLeadtime({ isOpen, onClose, onSubmit, onError = () => {}, editData, brands = [], subBrands = [], products = [] }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const { errors, validate, clearError } = useFormValidation(RULES);

  useEffect(() => {
    setForm(editData ? {
      brandId: editData.brandId ?? "", subBrandId: editData.subBrandId ?? "",
      productId: editData.productId ?? "", qtyOrder: editData.qtyOrder ?? "",
      eta: editData.eta ?? "", status: editData.status ?? "Pending",
      tanggalKeluarPabrik: editData.tanggalKeluarPabrik ?? "", notes: editData.notes ?? "",
    } : EMPTY);
  }, [editData, isOpen]);

  const filteredSub  = form.brandId    ? subBrands.filter(sb => sb.brandId    === parseInt(form.brandId))    : [];
  const filteredProd = form.subBrandId ? products.filter(p   => p.subBrandId  === parseInt(form.subBrandId)) : [];

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
    await onSubmit({ ...form, brandId: parseInt(form.brandId), subBrandId: parseInt(form.subBrandId), productId: parseInt(form.productId), qtyOrder: parseInt(form.qtyOrder) }, editData?.id);
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
            <label style={ls}>Qty Order (Karton) <span style={{color:"#ef4444"}}>*</span></label>
            <input type="number" value={form.qtyOrder} onChange={e => set('qtyOrder', e.target.value)} placeholder="0" style={ic(errors.qtyOrder)} min="1" />
            <Err msg={errors.qtyOrder} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={ls}>Tgl Keluar Pabrik</label>
              <input type="date" value={form.tanggalKeluarPabrik} onChange={e => set('tanggalKeluarPabrik', e.target.value)} style={ic(errors.tanggalKeluarPabrik)} />
              <Err msg={errors.tanggalKeluarPabrik} />
            </div>
            <div>
              <label style={ls}>ETA <span style={{color:"#ef4444"}}>*</span></label>
              <input type="date" value={form.eta} onChange={e => set('eta', e.target.value)} style={ic(errors.eta)} />
              <Err msg={errors.eta} />
            </div>
          </div>

          <div>
            <label style={ls}>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...ic(errors.status), appearance: "none" }}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={ls}>Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Catatan tambahan..." rows={3} style={{ ...ic(false), resize: "vertical" }} />
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