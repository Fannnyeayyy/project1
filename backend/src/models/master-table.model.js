const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Brand = sequelize.define('brand', {
    name: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
});

const subBrand = sequelize.define('sub_brand', {
    name: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    brandId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

const Product = sequelize.define('product', {
    name: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    subBrandId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

// Relasi Table
Brand.hasMany(subBrand, { foreignKey: 'brandId'})
subBrand.hasMany(Product, { foreignKey: 'subBrandId'})

module.exports = {
    Brand,
    subBrand,
    Product
}