import { API_ENDPOINTS } from "../constants/apiConfig";

// Ambil semua users
export const ambilSemuaUsers = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.USERS);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
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

