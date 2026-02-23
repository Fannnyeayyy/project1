/**
 * FormProduct.jsx
 * Modal form untuk tambah / edit Product.
 * Versi 2: tambah field hargaPerCarton dan qtyPerCarton.
 * Data ini dipakai untuk auto-kalkulasi totalValue di Stock tabel.
 */
import React, { useState, useEffect, useMemo } from "react";
import { X, Search } from "lucide-react";

const inputStyle = { border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#1e293b", width: "100%", outline: "none", background: "white" };
const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" };

function FormProduct({ isOpen, onClose, onSubmit, onError = () => {}, subBrands, brands, editData }) {
  const empty = { name: "", brandId: "", subBrandId: "", hargaPerCarton: "", qtyPerCarton: "" };
  const [formData, setFormData] = useState(empty);
  const [searchSubBrand, setSearchSubBrand] = useState("");
  const [showSubBrandDropdown, setShowSubBrandDropdown] = useState(false);

  useEffect(() => {
    if (editData) {
      const selectedSubBrand = subBrands?.find(sb => sb.id === editData.subBrandId);
      setFormData({
        name: editData.name,
        brandId: selectedSubBrand?.brandId || "",
        subBrandId: editData.subBrandId,
        hargaPerCarton: editData.hargaPerCarton ?? "",
        qtyPerCarton: editData.qtyPerCarton ?? "",
      });
    } else {
      setFormData(empty);
    }
    setSearchSubBrand("");
    setShowSubBrandDropdown(false);
  }, [editData, isOpen]);

  const filteredSubBrands = useMemo(() => {
    const byBrand = formData.brandId ? subBrands?.filter(sb => sb.brandId === parseInt(formData.brandId)) : subBrands;
    return searchSubBrand ? byBrand?.filter(sb => sb.name.toLowerCase().includes(searchSubBrand.toLowerCase())) : byBrand;
  }, [subBrands, formData.brandId, searchSubBrand]);

  const formatRupiah = (val) => String(val || "").replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const parseRupiah  = (val) => val.replace(/\./g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "brandId") {
      setFormData(prev => ({ ...prev, brandId: value, subBrandId: "" }));
      setSearchSubBrand("");
    } else if (name === "hargaPerCarton") {
      setFormData(prev => ({ ...prev, hargaPerCarton: parseRupiah(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const getSelectedSubBrandName = () => {
    if (!formData.subBrandId) return "Pilih Sub Brand";
    return subBrands?.find(sb => sb.id === formData.subBrandId)?.name || "Pilih Sub Brand";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return onError("Nama product wajib diisi");
    if (!formData.subBrandId) return onError("Pilih sub brand terlebih dahulu");
    if (!formData.hargaPerCarton || !formData.qtyPerCarton) return onError("Harga dan qty per karton wajib diisi");
    onSubmit({
      name: formData.name,
      subBrandId: formData.subBrandId,
      hargaPerCarton: parseFloat(formData.hargaPerCarton),
      qtyPerCarton: parseInt(formData.qtyPerCarton),
    }, editData?.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" style={{ border: "1px solid #e2e8f0" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <span className="text-sm font-bold" style={{ color: "#1e293b" }}>{editData ? "Edit Product" : "Tambah Product"}</span>
          <button onClick={onClose} style={{ color: "#94a3b8" }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Nama Product */}
          <div>
            <label style={labelStyle}>Nama Product</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Masukkan nama product" style={inputStyle} />
          </div>

          {/* Brand */}
          <div>
            <label style={labelStyle}>Brand</label>
            <select name="brandId" value={formData.brandId} onChange={handleChange} style={{ ...inputStyle, appearance: "none" }}>
              <option value="">Pilih Brand</option>
              {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          {/* Sub Brand dengan search dropdown */}
          <div>
            <label style={labelStyle}>Sub Brand</label>
            <div className="relative">
              <button type="button" onClick={() => setShowSubBrandDropdown(!showSubBrandDropdown)} disabled={!formData.brandId}
                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg disabled:opacity-50"
                style={{ border: "1px solid #e2e8f0", background: "white", color: formData.subBrandId ? "#1e293b" : "#94a3b8" }}>
                {getSelectedSubBrandName()}
                <svg className={`w-4 h-4 transition-transform ${showSubBrandDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showSubBrandDropdown && formData.brandId && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50" style={{ border: "1px solid #e2e8f0" }}>
                  <div className="p-2" style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2" size={12} style={{ color: "#94a3b8" }} />
                      <input type="text" placeholder="Cari..." value={searchSubBrand} onChange={e => setSearchSubBrand(e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 text-sm rounded-lg outline-none"
                        style={{ border: "1px solid #e2e8f0" }} onClick={e => e.stopPropagation()} />
                    </div>
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {filteredSubBrands?.length > 0 ? filteredSubBrands.map(sb => (
                      <button key={sb.id} type="button" onClick={() => { setFormData(prev => ({ ...prev, subBrandId: sb.id })); setShowSubBrandDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition"
                        style={{ color: formData.subBrandId === sb.id ? "#2563eb" : "#1e293b", fontWeight: formData.subBrandId === sb.id ? 600 : 400 }}>
                        {sb.name}
                      </button>
                    )) : <div className="px-4 py-3 text-sm text-center" style={{ color: "#94a3b8" }}>Tidak ditemukan</div>}
                  </div>
                </div>
              )}
            </div>
            {!formData.brandId && <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>Pilih brand terlebih dahulu</p>}
          </div>

          {/* Harga & Qty Per Carton */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Harga / Karton (Rp)</label>
              <input type="text" name="hargaPerCarton" value={formatRupiah(formData.hargaPerCarton)} onChange={handleChange}
                placeholder="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Qty / Karton (pcs)</label>
              <input type="number" name="qtyPerCarton" value={formData.qtyPerCarton} onChange={handleChange}
                placeholder="1" style={inputStyle} min="1" />
            </div>
          </div>

          {/* Preview kalkulasi */}
          {formData.hargaPerCarton && formData.qtyPerCarton && (
            <div className="px-4 py-3 rounded-lg text-sm" style={{ background: "#eff6ff", border: "1px solid #dbeafe" }}>
              <span style={{ color: "#64748b" }}>Harga per pcs: </span>
              <strong style={{ color: "#2563eb" }}>
                Rp {(parseFloat(formData.hargaPerCarton) / parseInt(formData.qtyPerCarton)).toLocaleString("id-ID", { maximumFractionDigits: 0 })}
              </strong>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>Batal</button>
            <button type="submit" className="flex-1 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "#2563eb" }}>
              {editData ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormProduct;