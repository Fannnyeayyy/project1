import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

function FormSubBrand({ isOpen, onClose, onSubmit, brands, editData, onError = () => {} }) {
  const [formData, setFormData] = useState({
    name: "",
    brandId: ""
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        brandId: editData.brandId
      });
    } else {
      setFormData({
        name: "",
        brandId: ""
      });
    }
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      onError("Sub Brand name is required");
      return;
    }

    if (!formData.brandId) {
      onError("Pilih brand terlebih dahulu");
      return;
    }

    onSubmit(formData, editData?.id);
    setFormData({ name: "", brandId: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {editData ? "Edit Sub Brand" : "Add New Sub Brand"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Sub Brand Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub Brand Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter sub brand name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Brand Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Select a brand</option>
              {brands && brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              {editData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormSubBrand;