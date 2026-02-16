import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

function FormProduct({ isOpen, onClose, onSubmit, subBrands, brands, editData }) {
  const [formData, setFormData] = useState({
    name: "",
    brandId: "",
    subBrandId: ""
  });
  const [filteredSubBrands, setFilteredSubBrands] = useState([]);

  useEffect(() => {
    if (editData) {
      // Cari brand dari sub brand yang dipilih
      const selectedSubBrand = subBrands?.find(sb => sb.id === editData.subBrandId);
      setFormData({
        name: editData.name,
        brandId: selectedSubBrand?.brandId || "",
        subBrandId: editData.subBrandId
      });
      // Filter sub brands berdasarkan brand
      if (selectedSubBrand?.brandId) {
        const filtered = subBrands?.filter(sb => sb.brandId === selectedSubBrand.brandId) || [];
        setFilteredSubBrands(filtered);
      }
    } else {
      setFormData({
        name: "",
        brandId: "",
        subBrandId: ""
      });
      setFilteredSubBrands([]);
    }
  }, [editData, isOpen, subBrands]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "brandId") {
      // Saat brand berubah, filter sub brands dan reset sub brand selection
      const filtered = subBrands?.filter(sb => sb.brandId === parseInt(value)) || [];
      setFilteredSubBrands(filtered);
      setFormData({
        ...formData,
        [name]: value,
        subBrandId: "" // Reset sub brand selection
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Product name is required");
      return;
    }
    if (!formData.subBrandId) {
      alert("Please select a sub brand");
      return;
    }
    
    // Submit hanya name dan subBrandId
    onSubmit({ name: formData.name, subBrandId: formData.subBrandId }, editData?.id);
    setFormData({ name: "", brandId: "", subBrandId: "" });
    setFilteredSubBrands([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {editData ? "Edit Product" : "Add New Product"}
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
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
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

          {/* Sub Brand Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub Brand
            </label>
            <select
              name="subBrandId"
              value={formData.subBrandId}
              onChange={handleChange}
              disabled={!formData.brandId}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {!formData.brandId ? "Select a brand first" : "Select a sub brand"}
              </option>
              {filteredSubBrands && filteredSubBrands.map((subBrand) => (
                <option key={subBrand.id} value={subBrand.id}>
                  {subBrand.name}
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

export default FormProduct;