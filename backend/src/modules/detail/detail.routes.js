/**
 * detail.routes.js
 * Base URL: /api/detail
 *
 * GET  → semua user (auth only)
 * POST/PUT/DELETE → admin only
 *
 * Query params yang didukung:
 * - ?brandId=1
 * - ?subBrandId=2
 * - ?periodDate=2025-05-01
 *
 * Endpoint khusus dashboard:
 * GET /api/detail/service-level/sales-per-brand → total sales aggregate per brand
 * GET /api/detail/forecast/latest               → forecast terbaru per brand
 */
const express = require('express');
const router  = express.Router();
const ctrl    = require('./detail.controller');
const auth    = require('../../middlewares/auth.middleware');
const admin   = require('../../middlewares/admin.middleware');

// ── LEADTIME DELIVERY ─────────────────────────────────────────────────────────
router.get   ('/leadtime',     auth,       ctrl.getLeadtime);
router.post  ('/leadtime',     auth, admin, ctrl.addLeadtime);
router.put   ('/leadtime/:id', auth, admin, ctrl.editLeadtime);
router.delete('/leadtime/:id', auth, admin, ctrl.hapusLeadtime);

// ── STOCK INDOMARET ───────────────────────────────────────────────────────────
router.get   ('/stock-indomaret',     auth,       ctrl.getStockIndomaret);
router.post  ('/stock-indomaret',     auth, admin, ctrl.addStockIndomaret);
router.put   ('/stock-indomaret/:id', auth, admin, ctrl.editStockIndomaret);
router.delete('/stock-indomaret/:id', auth, admin, ctrl.hapusStockIndomaret);

// ── SERVICE LEVEL PERFORMANCE ─────────────────────────────────────────────────
router.get   ('/service-level/sales-per-brand', auth, ctrl.getSalesPerBrand); // khusus dashboard
router.get   ('/service-level',                 auth,       ctrl.getServiceLevel);
router.post  ('/service-level',                 auth, admin, ctrl.addServiceLevel);
router.put   ('/service-level/:id',             auth, admin, ctrl.editServiceLevel);
router.delete('/service-level/:id',             auth, admin, ctrl.hapusServiceLevel);

// ── STOCK DISTRIBUTOR ─────────────────────────────────────────────────────────
router.get   ('/stock-distributor',     auth,       ctrl.getStockDistributor);
router.post  ('/stock-distributor',     auth, admin, ctrl.addStockDistributor);
router.put   ('/stock-distributor/:id', auth, admin, ctrl.editStockDistributor);
router.delete('/stock-distributor/:id', auth, admin, ctrl.hapusStockDistributor);

// ── FORECAST ──────────────────────────────────────────────────────────────────
router.get   ('/forecast/latest', auth,       ctrl.getLatestForecast); // khusus dashboard
router.get   ('/forecast',        auth,       ctrl.getForecast);
router.post  ('/forecast',        auth, admin, ctrl.addForecast);
router.put   ('/forecast/:id',    auth, admin, ctrl.editForecast);
router.delete('/forecast/:id',    auth, admin, ctrl.hapusForecast);

module.exports = router;