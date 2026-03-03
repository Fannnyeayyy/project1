import React, { useState } from "react";
import { X, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useFormValidation, v } from "../hooks/useFormValidation";

const RULES = {
  username: v.required('Username'),
  password: v.minLength('Password', 6),
  role:     v.required('Role'),
};
const ic = (err) => ({ border: `1px solid ${err ? '#ef4444' : '#e2e8f0'}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#1e293b", width: "100%", outline: "none", background: "white" });
const ls = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" };
const Err = ({ msg }) => msg ? <span className="flex items-center gap-1 mt-1 text-xs" style={{ color: "#ef4444" }}><AlertCircle size={11} />{msg}</span> : null;
const EMPTY = { username: "", password: "", role: "user" };

function FormTambahUser({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errors, validate, clearError } = useFormValidation(RULES);

  const set = (name, value) => { setForm(prev => ({ ...prev, [name]: value })); clearError(name); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
    setForm(EMPTY);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <span className="text-sm font-bold" style={{ color: "#1e293b" }}>Tambah User</span>
          <button onClick={onClose} style={{ color: "#94a3b8" }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label style={ls}>Username <span style={{color:"#ef4444"}}>*</span></label>
            <input type="text" value={form.username} onChange={e => set('username', e.target.value)} placeholder="Masukkan username" style={ic(errors.username)} />
            <Err msg={errors.username} />
          </div>
          <div>
            <label style={ls}>Password <span style={{color:"#ef4444"}}>*</span></label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={form.password} onChange={e => set('password', e.target.value)}
                placeholder="Min. 6 karakter" style={{ ...ic(errors.password), paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPass(p => !p)}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Err msg={errors.password} />
          </div>
          <div>
            <label style={ls}>Role <span style={{color:"#ef4444"}}>*</span></label>
            <select value={form.role} onChange={e => set('role', e.target.value)} style={{ ...ic(errors.role), appearance: "none" }}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <Err msg={errors.role} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>Batal</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50" style={{ background: "#2563eb" }}>
              {loading ? "Menyimpan..." : "Tambah User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default FormTambahUser;