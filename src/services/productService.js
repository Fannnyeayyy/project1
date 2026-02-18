/**
 * productService.js
 * Service untuk CRUD product.
 * Versi 2: tambah hargaPerCarton dan qtyPerCarton di tambah/edit.
 */
const BASE_URL = "http://localhost:3000/api/master-table";
const getToken = () => localStorage.getItem("token");
const headers  = () => ({ "Content-Type": "application/json", "Authorization": "Bearer " + getToken() });

export const ambilSemuaProducts = async () => {
  try {
    const res  = await fetch(`${BASE_URL}/product/list`, { headers: headers() });
    if (!res.ok) throw new Error("Gagal mengambil products");
    return { success: true, data: await res.json() };
  } catch (e) { return { success: false, message: e.message }; }
};

export const ambilProductById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/product/${id}`, { headers: headers() });
    if (!res.ok) throw new Error("Gagal mengambil product");
    return { success: true, data: await res.json() };
  } catch (e) { return { success: false, message: e.message }; }
};

export const tambahProduct = async (name, subBrandId, hargaPerCarton = 0, qtyPerCarton = 1) => {
  try {
    const res  = await fetch(`${BASE_URL}/product`, {
      method: "POST", headers: headers(),
      body: JSON.stringify({ name, subBrandId, hargaPerCarton, qtyPerCarton }),
    });
    const data = await res.json();
    return res.ok ? { success: true, message: data.message, data: data.data } : { success: false, message: data.message };
  } catch (e) { return { success: false, message: e.message }; }
};

export const editProduct = async (id, name, subBrandId, hargaPerCarton = 0, qtyPerCarton = 1) => {
  try {
    const res  = await fetch(`${BASE_URL}/product/${id}`, {
      method: "PUT", headers: headers(),
      body: JSON.stringify({ name, subBrandId, hargaPerCarton, qtyPerCarton }),
    });
    const data = await res.json();
    return res.ok ? { success: true, message: data.message, data: data.data } : { success: false, message: data.message };
  } catch (e) { return { success: false, message: e.message }; }
};

export const hapusProduct = async (id) => {
  try {
    const res  = await fetch(`${BASE_URL}/product/${id}`, { method: "DELETE", headers: headers() });
    const data = await res.json();
    return res.ok ? { success: true, message: "Product berhasil dihapus" } : { success: false, message: data.message };
  } catch (e) { return { success: false, message: e.message }; }
};