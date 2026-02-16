import React, { useState, useEffect, useMemo } from "react";
import { X, Search } from "lucide-react";

function FormProduct({ isOpen, onClose, onSubmit, subBrands, brands, editData }) {
  const [formData, setFormData] = useState({
    name: "",
    brandId: "",
    subBrandId: ""
  });
  const [filteredSubBrands, setFilteredSubBrands] = useState([]);
  const [searchSubBrand, setSearchSubBrand] = useState("");
  const [showSubBrandDropdown, setShowSubBrandDropdown] = useState(false);

  useEffect(() => {
    if (editData) {
      const selectedSubBrand = subBrands?.find(sb => sb.id === editData.subBrandId);
      setFormData({
        name: editData.name,
        brandId: selectedSubBrand?.brandId || "",
        subBrandId: editData.subBrandId
      });
      const filtered = subBrands?.filter(sb => sb.brandId === selectedSubBrand?.brandId) || [];
      setFilteredSubBrands(filtered);
    } else {
      setFormData({
        name: "",
        brandId: "",
        subBrandId: ""
      });
      setFilteredSubBrands([]);
    }
    setSearchSubBrand("");
  }, [editData, isOpen, subBrands]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "brandId") {
      const filtered = subBrands?.filter(sb => sb.brandId === parseInt(value)) || [];
      setFilteredSubBrands(filtered);
      setFormData({
        ...formData,
        [name]: value,
        subBrandId: ""
      });
      setSearchSubBrand("");
      setShowSubBrandDropdown(false);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Filter sub brands berdasarkan search
  const searchedSubBrands = useMemo(() => {
    if (!searchSubBrand.trim()) {
      return filteredSubBrands;
    }
    
    return filteredSubBrands.filter(sb =>
      sb.name.toLowerCase().includes(searchSubBrand.toLowerCase())
    );
  }, [filteredSubBrands, searchSubBrand]);

  const handleSubBrandSelect = (subBrandId) => {
    setFormData({
      ...formData,
      subBrandId
    });
    setShowSubBrandDropdown(false);
    setSearchSubBrand("");
  };

  const getSelectedSubBrandName = () => {
    if (!formData.subBrandId) return "Select a sub brand";
    const selected = subBrands?.find(sb => sb.id === formData.subBrandId);
    return selected?.name || "Select a sub brand";
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
    
    onSubmit({ name: formData.name, subBrandId: formData.subBrandId }, editData?.id);
    setFormData({ name: "", brandId: "", subBrandId: "" });
    setFilteredSubBrands([]);
    setSearchSubBrand("");
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

          {/* Sub Brand Select dengan Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub Brand
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSubBrandDropdown(!showSubBrandDropdown)}
                disabled={!formData.brandId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed bg-white flex items-center justify-between"
              >
                <span className={formData.subBrandId ? "text-gray-900" : "text-gray-500"}>
                  {getSelectedSubBrandName()}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${showSubBrandDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showSubBrandDropdown && formData.brandId && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                  {/* Search Input */}
                  <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchSubBrand}
                        onChange={(e) => setSearchSubBrand(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* Sub Brands List */}
                  <div className="max-h-48 overflow-y-auto">
                    {searchedSubBrands && searchedSubBrands.length > 0 ? (
                      searchedSubBrands.map((subBrand) => (
                        <button
                          key={subBrand.id}
                          type="button"
                          onClick={() => handleSubBrandSelect(subBrand.id)}
                          className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition text-sm ${
                            formData.subBrandId === subBrand.id ? "bg-blue-100 text-blue-900 font-semibold" : "text-gray-900"
                          }`}
                        >
                          {subBrand.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500 text-sm">
                        No sub brand found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {!formData.brandId && (
              <p className="text-xs text-gray-500 mt-1">Select a brand first</p>
            )}
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