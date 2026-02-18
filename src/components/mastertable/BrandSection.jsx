import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import FormTambahBrand from "../../models/Formtambahbrand";
import DeleteConfirmation from "../DeleteConfirmation";
import axios from "axios";

function BrandSection({ dataBrand, call }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  const openModal = () => { setEditData(null); setFormData({ name: "" }); setIsModalOpen(true); };
  const openEditModal = (brand) => { setEditData(brand); setFormData({ name: brand.name }); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setFormData({ name: "" }); setEditData(null); };
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData({ ...formData, [name]: value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (editData) {
        await axios.put(`http://localhost:3000/api/master-table/${editData.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post("http://localhost:3000/api/master-table/", formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      call(); closeModal();
    } catch (error) { console.error("Error:", error); alert("Terjadi kesalahan"); }
  };

  const openDeleteModal = (id) => { setBrandToDelete(id); setDeleteModalOpen(true); };
  const closeDeleteModal = () => { setDeleteModalOpen(false); setBrandToDelete(null); };
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/master-table/${brandToDelete}`, { headers: { Authorization: `Bearer ${token}` } });
      call(); closeDeleteModal();
    } catch (error) { console.error("Error:", error); alert("Gagal menghapus brand"); }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>
          Master Brand
        </span>
        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150"
          style={{ background: "#2563eb" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#1d4ed8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#2563eb"; }}
        >
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
            {dataBrand && dataBrand.length > 0 ? (
              dataBrand.map((brand, index) => (
                <tr
                  key={brand.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid #f1f5f9" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td className="px-6 py-3.5">
                    <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm font-medium" style={{ color: "#1e293b" }}>{brand.name}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEditModal(brand)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#dbeafe"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#eff6ff"}
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(brand.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#fca5a5"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-10 text-center text-sm" style={{ color: "#94a3b8" }}>
                  No brands found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <FormTambahBrand isOpen={isModalOpen} onClose={closeModal} formData={formData} onInputChange={handleInputChange} onSubmit={handleSubmit} isEdit={!!editData} />
      <DeleteConfirmation isOpen={deleteModalOpen} item="Brand" onConfirm={confirmDelete} onCancel={closeDeleteModal} />
    </div>
  );
}

export default BrandSection;