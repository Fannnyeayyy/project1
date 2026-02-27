/**
 * detail.controller.js
 * HTTP handler untuk semua endpoint detail.
 * Fungsi `respond` sebagai helper — pass result dari service,
 * status 200 jika success, 400 jika gagal.
 */
const svc = require('./detail.service');

const respond = (res, result) => result.success ? res.json(result) : res.status(400).json(result);

// ── LEADTIME 
exports.getLeadtime   = async (req, res) => respond(res, await svc.getLeadtime(req.query));
exports.addLeadtime   = async (req, res) => respond(res, await svc.addLeadtime(req.body));
exports.editLeadtime  = async (req, res) => respond(res, await svc.editLeadtime(req.params.id, req.body));
exports.hapusLeadtime = async (req, res) => respond(res, await svc.hapusLeadtime(req.params.id));

// ── STOCK INDOMARET ─
exports.getStockIndomaret   = async (req, res) => respond(res, await svc.getStockIndomaret(req.query));
exports.addStockIndomaret   = async (req, res) => respond(res, await svc.addStockIndomaret(req.body));
exports.editStockIndomaret  = async (req, res) => respond(res, await svc.editStockIndomaret(req.params.id, req.body));
exports.hapusStockIndomaret = async (req, res) => respond(res, await svc.hapusStockIndomaret(req.params.id));

// ── SERVICE LEVEL 
exports.getServiceLevel    = async (req, res) => respond(res, await svc.getServiceLevel(req.query));
exports.getSalesPerBrand   = async (req, res) => respond(res, await svc.getSalesPerBrand());
exports.addServiceLevel    = async (req, res) => respond(res, await svc.addServiceLevel(req.body));
exports.editServiceLevel   = async (req, res) => respond(res, await svc.editServiceLevel(req.params.id, req.body));
exports.hapusServiceLevel  = async (req, res) => respond(res, await svc.hapusServiceLevel(req.params.id));

// ── STOCK DISTRIBUTOR 
exports.getStockDistributor   = async (req, res) => respond(res, await svc.getStockDistributor(req.query));
exports.addStockDistributor   = async (req, res) => respond(res, await svc.addStockDistributor(req.body));
exports.editStockDistributor  = async (req, res) => respond(res, await svc.editStockDistributor(req.params.id, req.body));
exports.hapusStockDistributor = async (req, res) => respond(res, await svc.hapusStockDistributor(req.params.id));

// ── FORECAST
exports.getForecast        = async (req, res) => respond(res, await svc.getForecast(req.query));
exports.getLatestForecast  = async (req, res) => respond(res, await svc.getLatestForecast());
exports.addForecast        = async (req, res) => respond(res, await svc.addForecast(req.body));
exports.editForecast       = async (req, res) => respond(res, await svc.editForecast(req.params.id, req.body));
exports.hapusForecast      = async (req, res) => respond(res, await svc.hapusForecast(req.params.id));