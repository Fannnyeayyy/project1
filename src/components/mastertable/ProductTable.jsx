import React from "react";
import { Edit, Trash2 } from "lucide-react";

function ProductTable({ products, subBrands, brands, onEdit, onDelete }) {
  // Debug log
  React.useEffect(() => {
    console.log("Products:", products);
    console.log("SubBrands:", subBrands);
    console.log("Brands:", brands);
  }, [products, subBrands, brands]);

  const getSubBrandName = (subBrandId) => {
    const subBrand = subBrands?.find(sb => sb.id === subBrandId);
    return subBrand?.name || "Unknown";
  };

  const getBrandName = (subBrandId) => {
    const subBrand = subBrands?.find(sb => sb.id === subBrandId);
    
    if (!subBrand) {
      console.warn(`SubBrand not found for id ${subBrandId}`);
      return "Unknown";
    }
    
    const brandId = subBrand.brandId;
    console.log(`SubBrand: ${subBrand.name}, BrandId: ${brandId}`);
    
    if (!brandId) {
      console.warn(`BrandId not found for subBrand ${subBrand.name}`);
      return "Unknown";
    }
    
    const brand = brands?.find(b => b.id === brandId);
    console.log(`Brand for brandId ${brandId}:`, brand);
    
    return brand?.name || "Unknown";
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Sub Brand
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-white uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products && products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {getSubBrandName(product.subBrandId)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {getBrandName(product.subBrandId)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm transition font-medium"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition font-medium"
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
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;