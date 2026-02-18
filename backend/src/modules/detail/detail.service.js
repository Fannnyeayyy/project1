/**
 * detail.service.js
 * Business logic layer untuk semua tabel detail.
 * Format response konsisten: { success, data } atau { success, message }.
 * Soft delete ditangani di repository — service tidak perlu tahu detailnya.
 */
const repo = require('./detail.repository');

const ok  = (data, message)  => ({ success: true, data, message });
const err = (e)              => ({ success: false, message: e?.message || 'Terjadi kesalahan' });

// ── LEADTIME DELIVERY ─────────────────────────────────────────────────────────
exports.getLeadtime    = async (f) => { try { return ok(await repo.findAllLeadtime(f)); } catch(e) { return err(e); } };
exports.addLeadtime    = async (b) => { try { return ok(await repo.createLeadtime(b), 'Leadtime berhasil ditambahkan'); } catch(e) { return err(e); } };
exports.editLeadtime   = async (id, b) => { try { const d = await repo.updateLeadtime(id, b); return d ? ok(d, 'Leadtime berhasil diupdate') : { success: false, message: 'Data tidak ditemukan' }; } catch(e) { return err(e); } };
exports.hapusLeadtime  = async (id) => { try { await repo.deleteLeadtime(id); return ok(null, 'Leadtime berhasil dihapus'); } catch(e) { return err(e); } };

// ── STOCK INDOMARET ───────────────────────────────────────────────────────────
exports.getStockIndomaret   = async (f) => { try { return ok(await repo.findAllStockIndomaret(f)); } catch(e) { return err(e); } };
exports.addStockIndomaret   = async (b) => { try { return ok(await repo.createStockIndomaret(b), 'Stock Indomaret berhasil ditambahkan'); } catch(e) { return err(e); } };
exports.editStockIndomaret  = async (id, b) => { try { const d = await repo.updateStockIndomaret(id, b); return d ? ok(d, 'Stock Indomaret berhasil diupdate') : { success: false, message: 'Data tidak ditemukan' }; } catch(e) { return err(e); } };
exports.hapusStockIndomaret = async (id) => { try { await repo.deleteStockIndomaret(id); return ok(null, 'Stock Indomaret berhasil dihapus'); } catch(e) { return err(e); } };

// ── SERVICE LEVEL PERFORMANCE ─────────────────────────────────────────────────
exports.getServiceLevel    = async (f) => { try { return ok(await repo.findAllServiceLevel(f)); } catch(e) { return err(e); } };
exports.getSalesPerBrand   = async ()  => { try { return ok(await repo.getTotalSalesPerBrand()); } catch(e) { return err(e); } };
exports.addServiceLevel    = async (b) => { try { return ok(await repo.createServiceLevel(b), 'Service level berhasil ditambahkan'); } catch(e) { return err(e); } };
exports.editServiceLevel   = async (id, b) => { try { const d = await repo.updateServiceLevel(id, b); return d ? ok(d, 'Service level berhasil diupdate') : { success: false, message: 'Data tidak ditemukan' }; } catch(e) { return err(e); } };
exports.hapusServiceLevel  = async (id) => { try { await repo.deleteServiceLevel(id); return ok(null, 'Service level berhasil dihapus'); } catch(e) { return err(e); } };

// ── STOCK DISTRIBUTOR ─────────────────────────────────────────────────────────
exports.getStockDistributor   = async (f) => { try { return ok(await repo.findAllStockDistributor(f)); } catch(e) { return err(e); } };
exports.addStockDistributor   = async (b) => { try { return ok(await repo.createStockDistributor(b), 'Stock Distributor berhasil ditambahkan'); } catch(e) { return err(e); } };
exports.editStockDistributor  = async (id, b) => { try { const d = await repo.updateStockDistributor(id, b); return d ? ok(d, 'Stock Distributor berhasil diupdate') : { success: false, message: 'Data tidak ditemukan' }; } catch(e) { return err(e); } };
exports.hapusStockDistributor = async (id) => { try { await repo.deleteStockDistributor(id); return ok(null, 'Stock Distributor berhasil dihapus'); } catch(e) { return err(e); } };

// ── FORECAST ──────────────────────────────────────────────────────────────────
exports.getForecast          = async (f) => { try { return ok(await repo.findAllForecast(f)); } catch(e) { return err(e); } };
exports.getLatestForecast    = async ()  => { try { return ok(await repo.getLatestForecastPerBrand()); } catch(e) { return err(e); } };
exports.addForecast          = async (b) => { try { return ok(await repo.createForecast(b), 'Forecast berhasil ditambahkan'); } catch(e) { return err(e); } };
exports.editForecast         = async (id, b) => { try { const d = await repo.updateForecast(id, b); return d ? ok(d, 'Forecast berhasil diupdate') : { success: false, message: 'Data tidak ditemukan' }; } catch(e) { return err(e); } };
exports.hapusForecast        = async (id) => { try { await repo.deleteForecast(id); return ok(null, 'Forecast berhasil dihapus'); } catch(e) { return err(e); } };