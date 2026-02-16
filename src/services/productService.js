const BASE_URL = "http://localhost:3000/api/master-table";

const getToken = () => {
  return localStorage.getItem("token");
};

const headers = () => ({
  "Content-Type": "application/json",
  "Authorization": "Bearer " + getToken()
});

// ========== GET ALL PRODUCTS ==========
export const ambilSemuaProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/product/list`, {
      method: "GET",
      headers: headers()
    });

    if (!res.ok) throw new Error("Gagal mengambil products");

    const data = await res.json();

    return {
      success: true,
      data: data
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// ========== GET PRODUCT BY ID ==========
export const ambilProductById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/product/${id}`, {
      method: "GET",
      headers: headers()
    });

    if (!res.ok) throw new Error("Gagal mengambil product");

    const data = await res.json();

    return {
      success: true,
      data: data
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// ========== TAMBAH PRODUCT ==========
export const tambahProduct = async (name, subBrandId) => {
  try {
    const response = await fetch(`${BASE_URL}/product`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ name, subBrandId }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: data.message || "Product berhasil ditambahkan",
        data: data.data
      };
    } else {
      return {
        success: false,
        message: data.message || "Gagal menambahkan product"
      };
    }
  } catch (error) {
    console.error("Error adding product:", error);
    return {
      success: false,
      message: error.message || "Terjadi kesalahan"
    };
  }
};

// ========== EDIT PRODUCT ==========
export const editProduct = async (id, name, subBrandId) => {
  try {
    const response = await fetch(`${BASE_URL}/product/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ name, subBrandId }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: data.message || "Product berhasil diupdate",
        data: data.data
      };
    } else {
      return {
        success: false,
        message: data.message || "Gagal mengupdate product"
      };
    }
  } catch (error) {
    console.error("Error editing product:", error);
    return {
      success: false,
      message: error.message || "Terjadi kesalahan"
    };
  }
};

// ========== HAPUS PRODUCT ==========
export const hapusProduct = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/product/${id}`, {
      method: "DELETE",
      headers: headers()
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: "Product berhasil dihapus"
      };
    } else {
      return {
        success: false,
        message: data.message || "Gagal menghapus product"
      };
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: error.message || "Terjadi kesalahan"
    };
  }
};