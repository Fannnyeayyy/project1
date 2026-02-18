/**
 * detailService.js
 * Service untuk semua tabel detail + forecast.
 */
import axios from "axios";

const BASE = "http://localhost:3000/api/detail";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

const call = async (fn) => { try { return await fn(); } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; } };

// ── LEADTIME ──────────────────────────────────────────────────────────────────
export const getLeadtime          = (p) => call(async () => { const r = await axios.get(`${BASE}/leadtime`, { headers: headers(), params: p }); return r.data; });
export const tambahLeadtime       = (d) => call(async () => { const r = await axios.post(`${BASE}/leadtime`, d, { headers: headers() }); return r.data; });
export const editLeadtime         = (id, d) => call(async () => { const r = await axios.put(`${BASE}/leadtime/${id}`, d, { headers: headers() }); return r.data; });
export const hapusLeadtime        = (id) => call(async () => { const r = await axios.delete(`${BASE}/leadtime/${id}`, { headers: headers() }); return r.data; });

// ── STOCK INDOMARET ───────────────────────────────────────────────────────────
export const getStockIndomaret    = (p) => call(async () => { const r = await axios.get(`${BASE}/stock-indomaret`, { headers: headers(), params: p }); return r.data; });
export const tambahStockIndomaret = (d) => call(async () => { const r = await axios.post(`${BASE}/stock-indomaret`, d, { headers: headers() }); return r.data; });
export const editStockIndomaret   = (id, d) => call(async () => { const r = await axios.put(`${BASE}/stock-indomaret/${id}`, d, { headers: headers() }); return r.data; });
export const hapusStockIndomaret  = (id) => call(async () => { const r = await axios.delete(`${BASE}/stock-indomaret/${id}`, { headers: headers() }); return r.data; });

// ── SERVICE LEVEL ─────────────────────────────────────────────────────────────
export const getServiceLevel      = (p) => call(async () => { const r = await axios.get(`${BASE}/service-level`, { headers: headers(), params: p }); return r.data; });
export const getSalesPerBrand     = ()  => call(async () => { const r = await axios.get(`${BASE}/service-level/sales-per-brand`, { headers: headers() }); return r.data; });
export const tambahServiceLevel   = (d) => call(async () => { const r = await axios.post(`${BASE}/service-level`, d, { headers: headers() }); return r.data; });
export const editServiceLevel     = (id, d) => call(async () => { const r = await axios.put(`${BASE}/service-level/${id}`, d, { headers: headers() }); return r.data; });
export const hapusServiceLevel    = (id) => call(async () => { const r = await axios.delete(`${BASE}/service-level/${id}`, { headers: headers() }); return r.data; });

// ── STOCK DISTRIBUTOR ─────────────────────────────────────────────────────────
export const getStockDistributor  = (p) => call(async () => { const r = await axios.get(`${BASE}/stock-distributor`, { headers: headers(), params: p }); return r.data; });
export const tambahStockDistributor = (d) => call(async () => { const r = await axios.post(`${BASE}/stock-distributor`, d, { headers: headers() }); return r.data; });
export const editStockDistributor = (id, d) => call(async () => { const r = await axios.put(`${BASE}/stock-distributor/${id}`, d, { headers: headers() }); return r.data; });
export const hapusStockDistributor = (id) => call(async () => { const r = await axios.delete(`${BASE}/stock-distributor/${id}`, { headers: headers() }); return r.data; });

// ── FORECAST ──────────────────────────────────────────────────────────────────
export const getForecast          = (p) => call(async () => { const r = await axios.get(`${BASE}/forecast`, { headers: headers(), params: p }); return r.data; });
export const getLatestForecast    = ()  => call(async () => { const r = await axios.get(`${BASE}/forecast/latest`, { headers: headers() }); return r.data; });
export const tambahForecast       = (d) => call(async () => { const r = await axios.post(`${BASE}/forecast`, d, { headers: headers() }); return r.data; });
export const editForecast         = (id, d) => call(async () => { const r = await axios.put(`${BASE}/forecast/${id}`, d, { headers: headers() }); return r.data; });
export const hapusForecast        = (id) => call(async () => { const r = await axios.delete(`${BASE}/forecast/${id}`, { headers: headers() }); return r.data; });