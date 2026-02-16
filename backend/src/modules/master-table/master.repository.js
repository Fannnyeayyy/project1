const { Brand, SubBrand, Product } = require('../../models/master-table.model');

// Brand Repository
const createBrand = async (name) => {
    return await Brand.create({ name });
}

const findAllBrands = async () => {
    return await Brand.findAll();
}

const findBrandById = async (id) => {
    return await Brand.findByPk(id);
}

const updateBrand = async (id, name) => {
    const brand = await Brand.findByPk(id);
    if (!brand) return null;
    return await brand.update({ name });
}

const deleteBrand = async (id) => {
    return await Brand.destroy({ where: { id } });
}

// Sub Brand Repository
const createSubBrand = async (name, brandId) => {
    return await SubBrand.create({ name, brandId });
}

const findAllSubBrands = async () => {
    return await SubBrand.findAll();
}

const findSubBrandById = async (id) => {
    return await SubBrand.findByPk(id);
}

const updateSubBrand = async (id, name, brandId) => {
    const subBrand = await SubBrand.findByPk(id);
    if (!subBrand) return null;
    return await subBrand.update({ name, brandId });
}

const deleteSubBrand = async (id) => {
    return await SubBrand.destroy({ where: { id } });
}

// Product Repository
const createProduct = async (name, subBrandId) => {
    return await Product.create({ name, subBrandId });
}

const findAllProducts = async () => {
    return await Product.findAll();
}

const findProductById = async (id) => {
    return await Product.findByPk(id);
}

const updateProduct = async (id, name, subBrandId) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return await product.update({ name, subBrandId });
}

const deleteProduct = async (id) => {
    return await Product.destroy({ where: { id } });
}

module.exports = {
    createBrand,
    findAllBrands,
    findBrandById,
    updateBrand,
    deleteBrand,
    createSubBrand,
    findAllSubBrands,
    findSubBrandById,
    updateSubBrand,
    deleteSubBrand,
    createProduct,
    findAllProducts,
    findProductById,
    updateProduct,
    deleteProduct
}