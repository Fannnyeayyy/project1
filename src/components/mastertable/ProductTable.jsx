import React, { useState, useMemo } from "react";
import { Edit, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

function ProductTable({ products, subBrands, brands, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage =5;

  const getSubBrandName = (subBrandId) => {
    const subBrand = subBrands?.find(sb => sb.id === subBrandId);
    return subBrand?.name || "Unknown";
  };

  const getBrandName = (subBrandId) => {
    const subBrand = subBrands?.find(sb => sb.id === subBrandId);
    
    if (!subBrand) return "Unknown";
    
    const brandId = subBrand.brandId;
    if (!brandId) return "Unknown";
    
    const brand = brands?.find(b => b.id === brandId);
    return brand?.name || "Unknown";
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSubBrandName(product.subBrandId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getBrandName(product.subBrandId).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm, subBrands, brands]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Search Bar */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="🔍 Cari product, sub brand, atau brand..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-blue-600">{paginatedProducts.length}</span> dari <span className="font-semibold text-blue-600">{filteredProducts.length}</span> products ditampilkan
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-6 py-3 text-left text-sm font-bold w-12">No</th>
              <th className="px-6 py-3 text-left text-sm font-bold flex-1">Nama Product</th>
              <th className="px-6 py-3 text-left text-sm font-bold flex-1">Sub Brand</th>
              <th className="px-6 py-3 text-left text-sm font-bold flex-1">Brand</th>
              <th className="px-6 py-3 text-center text-sm font-bold w-40">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedProducts && paginatedProducts.length > 0 ? (
              paginatedProducts.map((product, index) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 font-semibold text-sm rounded-full">
                      {startIndex + index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-full text-sm font-semibold">
                      {getSubBrandName(product.subBrandId)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-semibold">
                      {getBrandName(product.subBrandId)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-200"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-200"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <p className="text-gray-500 text-sm">
                    {filteredProducts.length === 0 && searchTerm 
                      ? "❌ Tidak ada product yang sesuai" 
                      : "📦 Tidak ada product"}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-white"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductTable;