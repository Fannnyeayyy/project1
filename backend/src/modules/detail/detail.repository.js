/**
 * detail.repository.js
 * Layer akses database untuk semua tabel detail.
 */
const { LeadtimeDelivery, StockIndomaret, ServiceLevelPerformance, StockDistributor, Forecast } = require('../../models/detail.model');
const { Brand, SubBrand, Product } = require('../../models/master-table.model');
const { fn, col } = require('sequelize');

const includeBrand    = { model: Brand,    attributes: ['id', 'name'] };
const includeSubBrand = { model: SubBrand, attributes: ['id', 'name'] };
const includeProduct  = { model: Product,  attributes: ['id', 'name', 'hargaPerCarton', 'qtyPerCarton'] };

const getHarga = async (productId) => {
  const p = await Product.findByPk(productId);
  return p ? parseFloat(p.hargaPerCarton) : 0;
};

// ── LEADTIME DELIVERY
const findAllLeadtime = async ({ brandId, subBrandId } = {}) => {
  const where = {};
  if (brandId)    where.brandId    = parseInt(brandId);
  if (subBrandId) where.subBrandId = parseInt(subBrandId);
  return LeadtimeDelivery.findAll({ where, include: [includeBrand, includeSubBrand, includeProduct], order: [['createdAt', 'DESC']] });
};
const createLeadtime = async (data) => LeadtimeDelivery.create(data);
const updateLeadtime = async (id, data) => { const r = await LeadtimeDelivery.findByPk(id); return r ? r.update(data) : null; };
const deleteLeadtime = async (id) => LeadtimeDelivery.destroy({ where: { id } });

// ── STOCK INDOMARET
const findAllStockIndomaret = async ({ brandId, subBrandId, periodDate } = {}) => {
  const where = {};
  if (brandId)    where.brandId    = parseInt(brandId);
  if (subBrandId) where.subBrandId = parseInt(subBrandId);
  if (periodDate) where.periodDate = periodDate;
  return StockIndomaret.findAll({ where, include: [includeBrand, includeSubBrand, includeProduct], order: [['createdAt', 'DESC']] });
};
const createStockIndomaret = async (data) => {
  const harga = await getHarga(data.productId);
  data.totalValue = (parseInt(data.avgL3m) || 0) * harga;
  return StockIndomaret.create(data);
};
const updateStockIndomaret = async (id, data) => {
  const r = await StockIndomaret.findByPk(id);
  if (!r) return null;
  const harga = await getHarga(data.productId || r.productId);
  data.totalValue = (parseInt(data.avgL3m ?? r.avgL3m) || 0) * harga;
  return r.update(data);
};
const deleteStockIndomaret = async (id) => StockIndomaret.destroy({ where: { id } });

// ── SERVICE LEVEL PERFORMANCE
const findAllServiceLevel = async ({ brandId, subBrandId, periodDate } = {}) => {
  const where = {};
  if (brandId)    where.brandId    = parseInt(brandId);
  if (subBrandId) where.subBrandId = parseInt(subBrandId);
  if (periodDate) where.periodDate = periodDate;
  return ServiceLevelPerformance.findAll({ where, include: [includeBrand, includeSubBrand, includeProduct], order: [['createdAt', 'DESC']] });
};
const getTotalSalesPerBrand = async () => {
  return ServiceLevelPerformance.findAll({
    attributes: ['brandId', [fn('SUM', col('totalSales')), 'totalSales'], [fn('SUM', col('salesQuantity')), 'totalQty']],
    include: [includeBrand],
    group: ['brandId'],
    order: [[fn('SUM', col('totalSales')), 'DESC']]
  });
};
const calcServiceLevel = (data) => {
  const total  = parseInt(data.totalSales) || 0;
  const actual = parseInt(data.actualSales) || 0;
  return { ...data, loseSales: total - actual, performance: total > 0 ? parseFloat(((actual / total) * 100).toFixed(2)) : 0 };
};
const createServiceLevel = async (data) => { return ServiceLevelPerformance.create(calcServiceLevel(data)); };
const updateServiceLevel = async (id, data) => { const r = await ServiceLevelPerformance.findByPk(id); if (r) { await r.update(calcServiceLevel(data)); } return r; };
const deleteServiceLevel  = async (id) => ServiceLevelPerformance.destroy({ where: { id } });

// ── STOCK DISTRIBUTOR
const findAllStockDistributor = async ({ brandId, subBrandId, periodDate } = {}) => {
  const where = {};
  if (brandId)    where.brandId    = parseInt(brandId);
  if (subBrandId) where.subBrandId = parseInt(subBrandId);
  if (periodDate) where.periodDate = periodDate;
  return StockDistributor.findAll({ where, include: [includeBrand, includeSubBrand, includeProduct], order: [['lastUpdated', 'DESC']] });
};
const createStockDistributor = async (data) => {
  const harga = await getHarga(data.productId);
  data.totalValue = (parseInt(data.stockQuantity) || 0) * harga;
  return StockDistributor.create(data);
};
const updateStockDistributor = async (id, data) => {
  const r = await StockDistributor.findByPk(id);
  if (!r) return null;
  const harga = await getHarga(data.productId || r.productId);
  data.totalValue = (parseInt(data.stockQuantity ?? r.stockQuantity) || 0) * harga;
  return r.update(data);
};
const deleteStockDistributor = async (id) => StockDistributor.destroy({ where: { id } });

// ── FORECAST — sekarang include SubBrand & Product
const findAllForecast = async ({ brandId, subBrandId, productId, periodDate } = {}) => {
  const where = {};
  if (brandId)    where.brandId    = parseInt(brandId);
  if (subBrandId) where.subBrandId = parseInt(subBrandId);
  if (productId)  where.productId  = parseInt(productId);
  if (periodDate) where.periodDate = periodDate;
  return Forecast.findAll({
    where,
    include: [includeBrand, includeSubBrand, includeProduct],
    order: [['periodDate', 'DESC']]
  });
};
const getLatestForecastPerBrand = async () => Forecast.findAll({
  include: [includeBrand, includeSubBrand, includeProduct],
  order: [['periodDate', 'DESC']]
});
const createForecast = async (data) => Forecast.create(data);
const updateForecast = async (id, data) => { const r = await Forecast.findByPk(id); return r ? r.update(data) : null; };
const deleteForecast = async (id) => Forecast.destroy({ where: { id } });

module.exports = {
  findAllLeadtime, createLeadtime, updateLeadtime, deleteLeadtime,
  findAllStockIndomaret, createStockIndomaret, updateStockIndomaret, deleteStockIndomaret,
  findAllServiceLevel, getTotalSalesPerBrand, createServiceLevel, updateServiceLevel, deleteServiceLevel,
  findAllStockDistributor, createStockDistributor, updateStockDistributor, deleteStockDistributor,
  findAllForecast, getLatestForecastPerBrand, createForecast, updateForecast, deleteForecast,
};