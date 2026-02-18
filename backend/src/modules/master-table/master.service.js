const repo = require('./master.repository');

// ===== BRAND SERVICES =====
const createBrand = async (name) => {
    return await repo.createBrand(name);
}

const findAllBrands = async () => {
    return await repo.findAllBrands();
}

const findBrandById = async (id) => {
    return await repo.findBrandById(id);
}

const updateBrand = async (id, name) => {
    return await repo.updateBrand(id, name);
}

const deleteBrand = async (id) => {
    return await repo.deleteBrand(id);
}

// ===== SUB BRAND SERVICES =====
const createSubBrand = async (name, brandId) => {
    return await repo.createSubBrand(name, brandId);
}

const findAllSubBrands = async () => {
    return await repo.findAllSubBrands();
}

const findSubBrandById = async (id) => {
    return await repo.findSubBrandById(id);
}

const updateSubBrand = async (id, name, brandId) => {
    return await repo.updateSubBrand(id, name, brandId);
}

const deleteSubBrand = async (id) => {
    return await repo.deleteSubBrand(id);
}

// ===== PRODUCT SERVICES =====
const createProduct = async (name, subBrandId, hargaPerCarton = 0, qtyPerCarton = 1) => {
    return await repo.createProduct(name, subBrandId, hargaPerCarton, qtyPerCarton);
}

const findAllProducts = async () => {
    return await repo.findAllProducts();
}

const findProductById = async (id) => {
    return await repo.findProductById(id);
}

const updateProduct = async (id, name, subBrandId, hargaPerCarton, qtyPerCarton) => {
    return await repo.updateProduct(id, name, subBrandId, hargaPerCarton, qtyPerCarton);
}

const deleteProduct = async (id) => {
    return await repo.deleteProduct(id);
}

module.exports = {
    // Brand
    createBrand,
    findAllBrands,
    findBrandById,
    updateBrand,
    deleteBrand,
    // Sub Brand
    createSubBrand,
    findAllSubBrands,
    findSubBrandById,
    updateSubBrand,
    deleteSubBrand,
    // Product
    createProduct,
    findAllProducts,
    findProductById,
    updateProduct,
    deleteProduct
}