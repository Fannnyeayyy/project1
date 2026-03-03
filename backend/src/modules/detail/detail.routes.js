const express = require('express');
const router  = express.Router();
const ctrl    = require('./detail.controller');
const auth    = require('../../middlewares/auth.middleware');
const admin   = require('../../middlewares/admin.middleware');
const { validate, rules } = require('../../middlewares/validators');

// LEADTIME
router.get   ('/leadtime',     auth,             ctrl.getLeadtime);
router.post  ('/leadtime',     auth, admin, validate(rules.leadtime),         ctrl.addLeadtime);
router.put   ('/leadtime/:id', auth, admin, validate(rules.leadtime),         ctrl.editLeadtime);
router.delete('/leadtime/:id', auth, admin,                                   ctrl.hapusLeadtime);

// STOCK INDOMARET
router.get   ('/stock-indomaret',     auth,             ctrl.getStockIndomaret);
router.post  ('/stock-indomaret',     auth, admin, validate(rules.stockIndomaret),   ctrl.addStockIndomaret);
router.put   ('/stock-indomaret/:id', auth, admin, validate(rules.stockIndomaret),   ctrl.editStockIndomaret);
router.delete('/stock-indomaret/:id', auth, admin,                                   ctrl.hapusStockIndomaret);

// SERVICE LEVEL
router.get   ('/service-level/sales-per-brand', auth,             ctrl.getSalesPerBrand);
router.get   ('/service-level',                 auth,             ctrl.getServiceLevel);
router.post  ('/service-level',                 auth, admin, validate(rules.serviceLevel),  ctrl.addServiceLevel);
router.put   ('/service-level/:id',             auth, admin, validate(rules.serviceLevel),  ctrl.editServiceLevel);
router.delete('/service-level/:id',             auth, admin,                                ctrl.hapusServiceLevel);

// STOCK DISTRIBUTOR
router.get   ('/stock-distributor',     auth,             ctrl.getStockDistributor);
router.post  ('/stock-distributor',     auth, admin, validate(rules.stockDistributor), ctrl.addStockDistributor);
router.put   ('/stock-distributor/:id', auth, admin, validate(rules.stockDistributor), ctrl.editStockDistributor);
router.delete('/stock-distributor/:id', auth, admin,                                   ctrl.hapusStockDistributor);

// FORECAST
router.get   ('/forecast/latest', auth,             ctrl.getLatestForecast);
router.get   ('/forecast',        auth,             ctrl.getForecast);
router.post  ('/forecast',        auth, admin, validate(rules.forecast), ctrl.addForecast);
router.put   ('/forecast/:id',    auth, admin, validate(rules.forecast), ctrl.editForecast);
router.delete('/forecast/:id',    auth, admin,                           ctrl.hapusForecast);

module.exports = router;