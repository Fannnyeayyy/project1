import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import FormTambahBrand from "../../models/Formtambahbrand";
import DeleteConfirmation from "../DeleteConfirmation";

function BrandSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [formData, setFormData] = useState({
    brandName: "",
  });

  // Dummy data brands
  const [brands, setBrands] = useState([
    { id: 1, brandName: "NIVEA" },
    { id: 2, brandName: "HANSAPLAST" },
  ]);

  // Open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ brandName: "" });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newBrand = {
      id: brands.length + 1,
      brandName: formData.brandName,
    };
    
    setBrands([...brands, newBrand]);
    closeModal();
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
  const confirmDelete = () => {
    if (brandToDelete) {
      setBrands(brands.filter((brand) => brand.id !== brandToDelete));
      closeDeleteModal();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">MASTER BRAND</h2>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm text-sm"
        >
          <Plus size={18} />
          Add Brand
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-indigo-600">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                ID
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
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">#{brand.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">{brand.brandName}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(brand.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      <Trash2 size={16} />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form Tambah Brand */}
      <FormTambahBrand
        isOpen={isModalOpen}
        onClose={closeModal}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default BrandSection;