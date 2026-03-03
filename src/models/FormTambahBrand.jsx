import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { useFormValidation, v } from "../hooks/useFormValidation";

const RULES = { name: v.required('Nama brand') };
const ic = (err) => ({ border: `1px solid ${err ? '#ef4444' : '#e2e8f0'}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#1e293b", width: "100%", outline: "none", background: "white" });
const ls = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" };
const Err = ({ msg }) => msg ? <span className="flex items-center gap-1 mt-1 text-xs" style={{ color: "#ef4444" }}><AlertCircle size={11} />{msg}</span> : null;

function FormTambahBrand({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { errors, validate, clearError } = useFormValidation(RULES);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate({ name })) return;
    setLoading(true);
    await onSubmit({ name });
    setLoading(false);
    setName("");
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <span className="text-sm font-bold" style={{ color: "#1e293b" }}>Tambah Brand</span>
          <button onClick={onClose} style={{ color: "#94a3b8" }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label style={ls}>Nama Brand <span style={{color:"#ef4444"}}>*</span></label>
            <input type="text" value={name} onChange={e => { setName(e.target.value); clearError('name'); }}
              placeholder="Masukkan nama brand" style={ic(errors.name)} />
            <Err msg={errors.name} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>Batal</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50" style={{ background: "#6366f1" }}>
              {loading ? "Menyimpan..." : "Simpan Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default FormTambahBrand;