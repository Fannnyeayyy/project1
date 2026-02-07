import { API_ENDPOINTS } from "../constants/apiConfig";

const BASE_URL = "http://localhost:3000/api/auth";

const getToken = () => {
  return sessionStorage.getItem("token");
};

const headers = () => ({
  "Content-Type": "application/json",
  "Authorization": "Bearer " + getToken()
});


// Ambil semua users
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


// Tambah user baru
export const tambahUser = async (userData) => {
  try {
    const response = await fetch(API_ENDPOINTS.USERS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// Hapus user
export const hapusUser = async (userId) => {
  try {
    const response = await fetch(API_ENDPOINTS.USER_BY_ID(userId), {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

