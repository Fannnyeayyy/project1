/**
 * detail.model.js
 * Versi 2 — hasil review & perbaikan struktur:
 *
 * Fix yang diterapkan:
 * 1. LeadtimeDelivery   → tambah brandId (filter by brand tanpa double join)
 * 2. StockIndomaret     → tambah periodDate (tracking per periode)
 * 3. StockDistributor   → tambah periodDate (konsisten dengan tabel lain)
 * 4. Semua tabel detail → paranoid: true (soft delete via deletedAt)
 * 5. Tambah tabel Forecast → data forecast tidak lagi hardcoded di frontend
 */
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const { Brand, SubBrand, Product } = require('./master-table.model');

const defaultOptions = { paranoid: true };

// ── LEADTIME DELIVERY ─────────────────────────────────────────────────────────
const LeadtimeDelivery = sequelize.define('leadtime_delivery', {
  brandId:    { type: DataTypes.INTEGER, allowNull: false, references: { model: Brand, key: 'id' } },
  subBrandId: { type: DataTypes.INTEGER, allowNull: false, references: { model: SubBrand, key: 'id' } },
  productId:  { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
  qtyOrder:   { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  eta:        { type: DataTypes.DATEONLY, allowNull: false },
  status:     { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  actualArrivalDate: { type: DataTypes.DATE, allowNull: true }
}, defaultOptions);

// ── STOCK INDOMARET ───────────────────────────────────────────────────────────
const StockIndomaret = sequelize.define('stock_indomaret', {
  brandId:    { type: DataTypes.INTEGER, allowNull: false, references: { model: Brand, key: 'id' } },
  subBrandId: { type: DataTypes.INTEGER, allowNull: false, references: { model: SubBrand, key: 'id' } },
  productId:  { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
  avgL3m:     { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  totalValue: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  isActive:   { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  periodDate: { type: DataTypes.DATEONLY, allowNull: true }
}, defaultOptions);

// ── SERVICE LEVEL PERFORMANCE ─────────────────────────────────────────────────
const ServiceLevelPerformance = sequelize.define('service_level_performance', {
  brandId:    { type: DataTypes.INTEGER, allowNull: false, references: { model: Brand, key: 'id' } },
  subBrandId: { type: DataTypes.INTEGER, allowNull: false, references: { model: SubBrand, key: 'id' } },
  productId:  { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
  totalSales:    { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  salesQuantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  salesRank:     { type: DataTypes.INTEGER, allowNull: true },
  performanceCategory: { type: DataTypes.ENUM('Excellent', 'Good', 'Average', 'Below Average'), allowNull: true },
  percentageOfTotal: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
  periodDate: { type: DataTypes.DATEONLY, allowNull: false }
}, defaultOptions);

// ── STOCK DISTRIBUTOR ─────────────────────────────────────────────────────────
const StockDistributor = sequelize.define('stock_distributor', {
  brandId:    { type: DataTypes.INTEGER, allowNull: false, references: { model: Brand, key: 'id' } },
  subBrandId: { type: DataTypes.INTEGER, allowNull: false, references: { model: SubBrand, key: 'id' } },
  productId:  { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
  stockQuantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  avgL3m:     { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  totalValue: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  lastUpdated: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
  periodDate:  { type: DataTypes.DATEONLY, allowNull: true }
}, defaultOptions);

// ── FORECAST ──────────────────────────────────────────────────────────────────
// Baru: menggantikan data hardcoded di dashboard frontend
const Forecast = sequelize.define('forecast', {
  brandId:    { type: DataTypes.INTEGER, allowNull: false, references: { model: Brand, key: 'id' } },
  plan:       { type: DataTypes.STRING, allowNull: false },       // contoh: "Mei 1,5 m"
  week1:      { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  week2:      { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  week3:      { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  week4:      { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  periodDate: { type: DataTypes.DATEONLY, allowNull: false }      // misal: 2025-05-01
}, defaultOptions);

// ── RELASI ────────────────────────────────────────────────────────────────────
[LeadtimeDelivery, StockIndomaret, ServiceLevelPerformance, StockDistributor].forEach(Model => {
  Brand.hasMany(Model, { foreignKey: 'brandId', onDelete: 'CASCADE' });
  Model.belongsTo(Brand, { foreignKey: 'brandId' });
  SubBrand.hasMany(Model, { foreignKey: 'subBrandId', onDelete: 'CASCADE' });
  Model.belongsTo(SubBrand, { foreignKey: 'subBrandId' });
  Product.hasMany(Model, { foreignKey: 'productId', onDelete: 'CASCADE' });
  Model.belongsTo(Product, { foreignKey: 'productId' });
});

Brand.hasMany(Forecast, { foreignKey: 'brandId', onDelete: 'CASCADE' });
Forecast.belongsTo(Brand, { foreignKey: 'brandId' });

module.exports = { LeadtimeDelivery, StockIndomaret, ServiceLevelPerformance, StockDistributor, Forecast };