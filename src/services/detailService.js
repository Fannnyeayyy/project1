/**
 * detailService.js
 * Service untuk komunikasi frontend ke API /api/detail.
 * Semua fungsi mengembalikan { success, data } atau { success, message }
 * konsisten dengan service lainnya di project ini.
 */

const BASE_URL = "http://localhost:3000/api/detail";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + getToken(),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (res.ok) return { success: true, data: data.data ?? data };
  return { success: false, message: data.message || "Terjadi kesalahan" };
};

const catchError = (error) => ({ success: false, message: error.message });

// ── LEADTIME DELIVERY ─────────────────────────────────────────────────────────

export const getLeadtime = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${BASE_URL}/leadtime${params ? "?" + params : ""}`, { headers: headers() });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

export const tambahLeadtime = async (body) => {
  try {
    const res = await fetch(`${BASE_URL}/leadtime`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

export const editLeadtime = async (id, body) => {
  try {
    const res = await fetch(`${BASE_URL}/leadtime/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(body) });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

export const hapusLeadtime = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/leadtime/${id}`, { method: "DELETE", headers: headers() });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

// ── STOCK INDOMARET ───────────────────────────────────────────────────────────

export const getStockIndomaret = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${BASE_URL}/stock-indomaret${params ? "?" + params : ""}`, { headers: headers() });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

export const tambahStockIndomaret = async (body) => {
  try {
    const res = await fetch(`${BASE_URL}/stock-indomaret`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

export const editStockIndomaret = async (id, body) => {
  try {
    const res = await fetch(`${BASE_URL}/stock-indomaret/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(body) });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

export const hapusStockIndomaret = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/stock-indomaret/${id}`, { method: "DELETE", headers: headers() });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

// ── SERVICE LEVEL PERFORMANCE ─────────────────────────────────────────────────

export const getServiceLevel = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${BASE_URL}/service-level${params ? "?" + params : ""}`, { headers: headers() });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

// Khusus untuk dashboard — aggregate total sales per brand
export const getSalesPerBrand = async () => {
  try {
    const res = await fetch(`${BASE_URL}/service-level/sales-per-brand`, { headers: headers() });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

export const tambahServiceLevel = async (body) => {
  try {
    const res = await fetch(`${BASE_URL}/service-level`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

export const editServiceLevel = async (id, body) => {
  try {
    const res = await fetch(`${BASE_URL}/service-level/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(body) });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

export const hapusServiceLevel = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/service-level/${id}`, { method: "DELETE", headers: headers() });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

// ── STOCK DISTRIBUTOR ─────────────────────────────────────────────────────────

export const getStockDistributor = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${BASE_URL}/stock-distributor${params ? "?" + params : ""}`, { headers: headers() });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

export const tambahStockDistributor = async (body) => {
  try {
    const res = await fetch(`${BASE_URL}/stock-distributor`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

export const editStockDistributor = async (id, body) => {
  try {
    const res = await fetch(`${BASE_URL}/stock-distributor/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(body) });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};

export const hapusStockDistributor = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/stock-distributor/${id}`, { method: "DELETE", headers: headers() });
    return handleResponse(res);
  } catch (e) { return catchError(e); }
};
