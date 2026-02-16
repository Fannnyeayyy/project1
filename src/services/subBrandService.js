const BASE_URL = "http://localhost:3000/api/master-table";

const getToken = () => {
  return localStorage.getItem("token");
};

const headers = () => ({
  "Content-Type": "application/json",
  "Authorization": "Bearer " + getToken()
});

// ========== GET ALL SUB BRANDS ==========
export const ambilSemuaSubBrands = async () => {
  try {
    const res = await fetch(`${BASE_URL}/sub-brand/list`, {
      method: "GET",
      headers: headers()
    });

    if (!res.ok) throw new Error("Gagal mengambil sub brands");

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

// ========== GET SUB BRAND BY ID ==========
export const ambilSubBrandById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/sub-brand/${id}`, {
      method: "GET",
      headers: headers()
    });

    if (!res.ok) throw new Error("Gagal mengambil sub brand");

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

// ========== TAMBAH SUB BRAND ==========
export const tambahSubBrand = async (name, brandId) => {
  try {
    const response = await fetch(`${BASE_URL}/sub-brand`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ name, brandId }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: data.message || "Sub Brand berhasil ditambahkan",
        data: data.data
      };
    } else {
      return {
        success: false,
        message: data.message || "Gagal menambahkan sub brand"
      };
    }
  } catch (error) {
    console.error("Error adding sub brand:", error);
    return {
      success: false,
      message: error.message || "Terjadi kesalahan"
    };
  }
};

// ========== EDIT SUB BRAND ==========
export const editSubBrand = async (id, name, brandId) => {
  try {
    const response = await fetch(`${BASE_URL}/sub-brand/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ name, brandId }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: data.message || "Sub Brand berhasil diupdate",
        data: data.data
      };
    } else {
      return {
        success: false,
        message: data.message || "Gagal mengupdate sub brand"
      };
    }
  } catch (error) {
    console.error("Error editing sub brand:", error);
    return {
      success: false,
      message: error.message || "Terjadi kesalahan"
    };
  }
};

// ========== HAPUS SUB BRAND ==========
export const hapusSubBrand = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/sub-brand/${id}`, {
      method: "DELETE",
      headers: headers()
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: "Sub Brand berhasil dihapus"
      };
    } else {
      return {
        success: false,
        message: data.message || "Gagal menghapus sub brand"
      };
    }
  } catch (error) {
    console.error("Error deleting sub brand:", error);
    return {
      success: false,
      message: error.message || "Terjadi kesalahan"
    };
  }
};