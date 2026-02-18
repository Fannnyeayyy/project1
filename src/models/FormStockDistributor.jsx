/**
 * FormStockDistributor.jsx
 * Total Value dihitung otomatis: stockQuantity × hargaPerCarton dari product.
 * Field totalValue readonly — tidak bisa diinput manual.
 */
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const inputStyle = { border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#1e293b", width: "100%", outline: "none", background: "white" };
const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" };

function FormStockDistributor({ isOpen, onClose, onSubmit, onError = () => {}, editData, brands = [], subBrands = [], products = [] }) {
  const empty = { brandId: "", subBrandId: "", productId: "", stockQuantity: "", avgL3m: "" };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        brandId: editData.brandId ?? "",
        subBrandId: editData.subBrandId ?? "",
        productId: editData.productId ?? "",
        stockQuantity: editData.stockQuantity ?? "",
        avgL3m: editData.avgL3m ?? "",
      });
    } else {
      setForm(empty);
    }
  }, [editData, isOpen]);

  const filteredSubBrands = form.brandId ? subBrands.filter(sb => sb.brandId === parseInt(form.brandId)) : subBrands;
  const filteredProducts  = form.subBrandId ? products.filter(p => p.subBrandId === parseInt(form.subBrandId)) : products;

  // Ambil harga dari product yang dipilih
  const selectedProduct = products.find(p => p.id === parseInt(form.productId));
  const hargaPerCarton  = selectedProduct?.hargaPerCarton ? parseFloat(selectedProduct.hargaPerCarton) : 0;
  const qtyPerCarton    = selectedProduct?.qtyPerCarton ?? 1;

  // Preview total value
  const previewTotal = (parseInt(form.stockQuantity) || 0) * hargaPerCarton;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brandId || !form.subBrandId || !form.productId || !form.stockQuantity || !form.avgL3m) return onError("Semua field wajib diisi");
    setLoading(true);
    await onSubmit({
      ...form,
      brandId: parseInt(form.brandId),
      subBrandId: parseInt(form.subBrandId),
      productId: parseInt(form.productId),
      stockQuantity: parseInt(form.stockQuantity),
      avgL3m: parseInt(form.avgL3m),
      // totalValue dihitung di backend, tapi kirim juga untuk preview
      totalValue: previewTotal,
    }, editData?.id);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <span className="text-sm font-bold" style={{ color: "#1e293b" }}>{editData ? "Edit Stock Distributor" : "Tambah Stock Distributor"}</span>
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
            <select name="productId" value={form.productId} onChange={handleChange} style={{ ...inputStyle, appearance: "none" }}>
              <option value="">Pilih Product</option>
              {filteredProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Info harga dari product */}
          {selectedProduct && hargaPerCarton > 0 && (
            <div className="px-4 py-2 rounded-lg text-xs flex gap-4" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <span style={{ color: "#64748b" }}>Harga/Karton: <strong style={{ color: "#1e293b" }}>Rp {hargaPerCarton.toLocaleString("id-ID")}</strong></span>
              <span style={{ color: "#64748b" }}>Isi: <strong style={{ color: "#1e293b" }}>{qtyPerCarton} pcs</strong></span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Stock Qty (Karton)</label>
              <input type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} placeholder="0" style={inputStyle} min="0" />
            </div>
            <div>
              <label style={labelStyle}>Avg L3M</label>
              <input type="number" name="avgL3m" value={form.avgL3m} onChange={handleChange} placeholder="0" style={inputStyle} min="0" />
            </div>
          </div>

          {/* Total Value — readonly, auto-calc */}
          <div>
            <label style={labelStyle}>Total Value (Auto)</label>
            <div className="px-3 py-2 rounded-lg text-sm font-bold" style={{ background: "#eff6ff", border: "1px solid #dbeafe", color: "#2563eb" }}>
              Rp {previewTotal.toLocaleString("id-ID")}
              {hargaPerCarton === 0 && form.productId && (
                <span className="text-xs font-normal ml-2" style={{ color: "#f59e0b" }}>⚠ Harga product belum diset</span>
              )}
            </div>
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

export default FormStockDistributor;