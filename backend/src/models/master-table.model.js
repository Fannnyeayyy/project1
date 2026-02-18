/**
 * master-table.model.js
 * Versi 3 — tambah hargaPerCarton dan qtyPerCarton di Product.
 * Digunakan untuk auto-kalkulasi totalValue di StockDistributor & StockIndomaret.
 *
 * hargaPerCarton : harga jual per karton (Rp)
 * qtyPerCarton   : jumlah unit dalam 1 karton (pcs)
 */
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Brand = sequelize.define('brand', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const SubBrand = sequelize.define('sub_brand', {
  name:    { type: DataTypes.STRING, allowNull: false },
  brandId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  indexes: [{ unique: true, fields: ['name', 'brandId'] }]
});

const Product = sequelize.define('product', {
  name:      { type: DataTypes.STRING, allowNull: false },
  subBrandId:{ type: DataTypes.INTEGER, allowNull: false },
  // Baru: harga dan qty per karton untuk kalkulasi totalValue
  hargaPerCarton: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  qtyPerCarton: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  indexes: [{ unique: true, fields: ['name', 'subBrandId'] }]
});

Brand.hasMany(SubBrand, { foreignKey: 'brandId', onDelete: 'CASCADE' });
SubBrand.belongsTo(Brand, { foreignKey: 'brandId' });
SubBrand.hasMany(Product, { foreignKey: 'subBrandId', onDelete: 'CASCADE' });
Product.belongsTo(SubBrand, { foreignKey: 'subBrandId' });

module.exports = { Brand, SubBrand, Product };