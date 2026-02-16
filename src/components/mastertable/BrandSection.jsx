
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
  const [formData, setFormData] = useState({
    name: "",
  });

  // Open modal
  const openModal = () => {
    setEditData(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (brand) => {
    setEditData(brand);
    setFormData({ name: brand.name });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "" });
    setEditData(null);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (editData) {
        // Edit mode
        await axios.put(`http://localhost:3000/api/master-table/${editData.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Create mode
        await axios.post("http://localhost:3000/api/master-table/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      call();
      closeModal();
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan");
    }
  };

  // Open delete confirmation
  const openDeleteModal = (id) => {
    setBrandToDelete(id);
    setDeleteModalOpen(true);
  };

  // Close delete confirmation
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setBrandToDelete(null);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/api/master-table/${brandToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      call();
      closeDeleteModal();
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menghapus brand");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">MASTER BRAND</h2>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm text-sm"
        >
          <Plus size={18} />
          Add Brand
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Brand Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dataBrand && dataBrand.length > 0 ? (
              dataBrand.map((brand, index) => (
                <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {brand.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(brand)}
                        className="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(brand.id)}
                        className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                  No brands found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <FormTambahBrand
        isOpen={isModalOpen}
        onClose={closeModal}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isEdit={!!editData}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={deleteModalOpen}
        item="Brand"
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}

export default BrandSection;