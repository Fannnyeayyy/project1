import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import FormTambahBrand from "../../models/Formtambahbrand";
import DeleteConfirmation from "../DeleteConfirmation";
import Toast from "../Toast";
import axios from "axios";

const BASE = "http://localhost:3000/api/master-table";

function BrandSection({ dataBrand, call }) {
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete]   = useState(null);
  const [editData, setEditData]             = useState(null);
  const [toast, setToast]                   = useState({ isOpen: false, type: "success", message: "" });

  const showToast = (type, message) => setToast({ isOpen: true, type, message });
  const closeToast = () => setToast(prev => ({ ...prev, isOpen: false }));

  const openModal     = ()      => { setEditData(null); setIsModalOpen(true); };
  const openEditModal = (brand) => { setEditData(brand); setIsModalOpen(true); };
  const closeModal    = ()      => { setIsModalOpen(false); setEditData(null); };

  // ← Terima (data, id) dari FormTambahBrand — bukan event
  const handleSubmit = async (data, id) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (id) {
        await axios.put(`${BASE}/${id}`, data, { headers });
        showToast("success", "Brand berhasil diupdate");
      } else {
        await axios.post(`${BASE}/`, data, { headers });
        showToast("success", "Brand berhasil ditambahkan");
      }
      call();
      closeModal();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const openDeleteModal  = (id) => { setBrandToDelete(id); setDeleteModalOpen(true); };
  const closeDeleteModal = ()   => { setDeleteModalOpen(false); setBrandToDelete(null); };
  const confirmDelete    = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BASE}/${brandToDelete}`, { headers: { Authorization: `Bearer ${token}` } });
      showToast("success", "Brand berhasil dihapus");
      call();
      closeDeleteModal();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Gagal menghapus brand");
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Master Brand</span>
        <button onClick={openModal}
          className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          style={{ background: "#2563eb" }}
          onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
          onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}>
          <Plus size={14} /> Add Brand
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest w-16" style={{ color: "#64748b" }}>No</th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Brand Name</th>
              <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-widest pr-6" style={{ color: "#64748b" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataBrand?.length > 0 ? dataBrand.map((brand, index) => (
              <tr key={brand.id} style={{ borderBottom: "1px solid #f1f5f9" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td className="px-6 py-3.5">
                  <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>{String(index + 1).padStart(2, "0")}</span>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-sm font-medium" style={{ color: "#1e293b" }}>{brand.name}</span>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openEditModal(brand)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                      style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                      onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}>
                      <Edit size={12} /> Edit
                    </button>
                    <button onClick={() => openDeleteModal(brand.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                      style={{ background: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fca5a5"}
                      onMouseLeave={e => e.currentTarget.style.background = "#fee2e2"}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="3" className="px-6 py-10 text-center text-sm" style={{ color: "#94a3b8" }}>No brands found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ← Tidak lagi pass formData/onInputChange — form sudah self-contained */}
      <FormTambahBrand
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editData={editData}
      />
      <DeleteConfirmation isOpen={deleteModalOpen} item="Brand" onConfirm={confirmDelete} onCancel={closeDeleteModal} />
      <Toast isOpen={toast.isOpen} onClose={closeToast} type={toast.type} message={toast.message} duration={3000} />
    </div>
  );
}

export default BrandSection;