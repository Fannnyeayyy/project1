/**
 * FormForecast.jsx
 * Modal form untuk tambah / edit data Forecast.
 */
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const inputStyle = { border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#1e293b", width: "100%", outline: "none", background: "white" };
const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" };

const formatRupiah = (val) => String(val || "").replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const parseRupiah  = (val) => String(val).replace(/\./g, "");

function FormForecast({ isOpen, onClose, onSubmit, editData, brands = [], onError = () => {} }) {
  const empty = { brandId: "", plan: "", week1: "", week2: "", week3: "", week4: "", periodDate: "" };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        brandId: editData.brandId ?? "",
        plan: editData.plan ?? "",
        week1: editData.week1 ?? "",
        week2: editData.week2 ?? "",
        week3: editData.week3 ?? "",
        week4: editData.week4 ?? "",
        periodDate: editData.periodDate ?? "",
      });
    } else {
      setForm(empty);
    }
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["week1", "week2", "week3", "week4"].includes(name)) {
      setForm(prev => ({ ...prev, [name]: parseRupiah(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Total semua week
  const total = ["week1", "week2", "week3", "week4"].reduce((sum, w) => sum + (parseFloat(form[w]) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brandId || !form.plan || !form.periodDate) return onError("Brand, plan, dan periode wajib diisi");
    setLoading(true);
    await onSubmit({
      ...form,
      brandId: parseInt(form.brandId),
      week1: parseFloat(form.week1) || 0,
      week2: parseFloat(form.week2) || 0,
      week3: parseFloat(form.week3) || 0,
      week4: parseFloat(form.week4) || 0,
    }, editData?.id);
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
            <select name="brandId" value={form.brandId} onChange={handleChange} style={{ ...inputStyle, appearance: "none" }}>
              <option value="">Pilih Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Plan</label>
            <input type="text" name="plan" value={form.plan} onChange={handleChange} placeholder="contoh: Mei 1,5 m" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Period Date</label>
            <input type="date" name="periodDate" value={form.periodDate} onChange={handleChange} style={inputStyle} />
          </div>

          {/* Week inputs */}
          <div className="grid grid-cols-2 gap-3">
            {["week1", "week2", "week3", "week4"].map((w, i) => (
              <div key={w}>
                <label style={labelStyle}>Week {i + 1} (Rp)</label>
                <input type="text" name={w} value={formatRupiah(form[w])} onChange={handleChange} placeholder="0" style={inputStyle} />
              </div>
            ))}
          </div>

          {/* Total preview */}
          <div className="px-4 py-3 rounded-lg" style={{ background: "#fef3c7", border: "1px solid #fde68a" }}>
            <span className="text-xs font-semibold" style={{ color: "#92400e" }}>Total 4 Minggu: </span>
            <strong className="text-sm" style={{ color: "#78350f" }}>Rp {total.toLocaleString("id-ID")}</strong>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>Batal</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: "#f59e0b" }}>
              {loading ? "Menyimpan..." : editData ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormForecast;
