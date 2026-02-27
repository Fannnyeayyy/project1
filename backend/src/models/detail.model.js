/**
 * detail.model.js
 * Versi 3 — tambah subBrandId & productId di Forecast
 */
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const { Brand, SubBrand, Product } = require('./master-table.model');

const defaultOptions = { paranoid: true };

// ── LEADTIME DELIVERY
const LeadtimeDelivery = sequelize.define('leadtime_delivery', {
  brandId:    { type: DataTypes.INTEGER, allowNull: false, references: { model: Brand, key: 'id' } },
  subBrandId: { type: DataTypes.INTEGER, allowNull: false, references: { model: SubBrand, key: 'id' } },
  productId:  { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
  qtyOrder:   { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  eta:        { type: DataTypes.DATEONLY, allowNull: false },
  status:     { type: DataTypes.ENUM('Pending', 'In Transit', 'Delivered', 'Delayed', 'Cancelled'), allowNull: false, defaultValue: 'Pending' },
  tanggalKeluarPabrik: { type: DataTypes.DATEONLY, allowNull: true },
  notes:      { type: DataTypes.TEXT, allowNull: true }
}, defaultOptions);

// ── STOCK INDOMARET
const StockIndomaret = sequelize.define('stock_indomaret', {
  brandId:    { type: DataTypes.INTEGER, allowNull: false, references: { model: Brand, key: 'id' } },
  subBrandId: { type: DataTypes.INTEGER, allowNull: false, references: { model: SubBrand, key: 'id' } },
  productId:  { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
  avgL3m:     { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  totalValue: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  isActive:   { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  periodDate: { type: DataTypes.DATEONLY, allowNull: true }
}, defaultOptions);

// ── SERVICE LEVEL PERFORMANCE
const ServiceLevelPerformance = sequelize.define('service_level_performance', {
  brandId:    { type: DataTypes.INTEGER, allowNull: false, references: { model: Brand, key: 'id' } },
  subBrandId: { type: DataTypes.INTEGER, allowNull: false, references: { model: SubBrand, key: 'id' } },
  productId:  { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
  totalSales:    { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  actualSales:   { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  loseSales:     { type: DataTypes.INTEGER, allowNull: true },
  performance:   { type: DataTypes.DECIMAL(5, 2), allowNull: true },
  periodDate: { type: DataTypes.DATEONLY, allowNull: true }
}, defaultOptions);

// ── STOCK DISTRIBUTOR
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

// ── FORECAST — tambah 
const Forecast = sequelize.define('forecast', {
  brandId:    { type: DataTypes.INTEGER, allowNull: false, references: { model: Brand, key: 'id' } },
  subBrandId: { type: DataTypes.INTEGER, allowNull: false, references: { model: SubBrand, key: 'id' } },
  productId:  { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
  week1:      { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  week2:      { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  week3:      { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  week4:      { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  periodDate: { type: DataTypes.DATEONLY, allowNull: false }
}, defaultOptions);

// ── RELASI
[LeadtimeDelivery, StockIndomaret, ServiceLevelPerformance, StockDistributor].forEach(Model => {
  Brand.hasMany(Model, { foreignKey: 'brandId', onDelete: 'CASCADE' });
  Model.belongsTo(Brand, { foreignKey: 'brandId' });
  SubBrand.hasMany(Model, { foreignKey: 'subBrandId', onDelete: 'CASCADE' });
  Model.belongsTo(SubBrand, { foreignKey: 'subBrandId' });
  Product.hasMany(Model, { foreignKey: 'productId', onDelete: 'CASCADE' });
  Model.belongsTo(Product, { foreignKey: 'productId' });
});

// Forecast relasi
Brand.hasMany(Forecast, { foreignKey: 'brandId', onDelete: 'CASCADE' });
Forecast.belongsTo(Brand, { foreignKey: 'brandId' });
SubBrand.hasMany(Forecast, { foreignKey: 'subBrandId', onDelete: 'CASCADE' });
Forecast.belongsTo(SubBrand, { foreignKey: 'subBrandId' });
Product.hasMany(Forecast, { foreignKey: 'productId', onDelete: 'CASCADE' });
Forecast.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { LeadtimeDelivery, StockIndomaret, ServiceLevelPerformance, StockDistributor, Forecast };