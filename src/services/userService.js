import { API_ENDPOINTS } from "../constants/apiConfig";

const BASE_URL = "http://localhost:3000/api/auth";

const getToken = () => {
  return sessionStorage.getItem("token");
};

const headers = () => ({
  "Content-Type": "application/json",
  "Authorization": "Bearer " + getToken()
});

// ========== GET ALL USERS ==========

export const ambilSemuaUsers = async () => {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      headers: headers()
    });

    if (!res.ok) throw new Error("Gagal mengambil users");

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

// ========== TAMBAH USER (REGISTER) ==========

export const tambahUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: data.message || "User berhasil ditambahkan"
      };
    } else {
      return {
        success: false,
        message: data.message || "Gagal menambahkan user"
      };
    }
  } catch (error) {
    console.error("Error adding user:", error);
    return {
      success: false,
      message: error.message || "Terjadi kesalahan"
    };
  }
};

// ========== EDIT USER ==========

export const editUser = async (userId, userData) => {
  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: data.message || "User berhasil diupdate"
      };
    } else {
      return {
        success: false,
        message: data.message || "Gagal mengupdate user"
      };
    }
  } catch (error) {
    console.error("Error editing user:", error);
    return {
      success: false,
      message: error.message || "Terjadi kesalahan"
    };
  }
};

// ========== HAPUS USER ==========

export const hapusUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: "DELETE",
      headers: headers()
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: "User berhasil dihapus"
      };
    } else {
      return {
        success: false,
        message: data.message || "Gagal menghapus user"
      };
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message: error.message || "Terjadi kesalahan"
    };
  }
};