const { Brand, SubBrand, Product } = require('../../models/master-table.model');

// ===== BRAND =====
const createBrand  = async (name) => Brand.create({ name });
const findAllBrands = async () => Brand.findAll();
const findBrandById = async (id) => Brand.findByPk(id);
const updateBrand  = async (id, name) => { const b = await Brand.findByPk(id); return b ? b.update({ name }) : null; };
const deleteBrand  = async (id) => Brand.destroy({ where: { id } });

// ===== SUB BRAND =====
const createSubBrand   = async (name, brandId) => SubBrand.create({ name, brandId });
const findAllSubBrands = async () => SubBrand.findAll();
const findSubBrandById = async (id) => SubBrand.findByPk(id);
const updateSubBrand   = async (id, name, brandId) => { const sb = await SubBrand.findByPk(id); return sb ? sb.update({ name, brandId }) : null; };
const deleteSubBrand   = async (id) => SubBrand.destroy({ where: { id } });

// ===== PRODUCT =====
const createProduct = async (name, subBrandId, hargaPerCarton = 0, qtyPerCarton = 1) => Product.create({ name, subBrandId, hargaPerCarton, qtyPerCarton });

// Fix: hapus alias 'as' yang tidak didefinisikan di model — penyebab fallback ke findAll tanpa include
const findAllProducts = async () => {
    return await Product.findAll({
        include: [{
            model: SubBrand,
            attributes: ['id', 'name', 'brandId'],
            include: [{ model: Brand, attributes: ['id', 'name'] }]
        }]
    });
};

const findProductById = async (id) => {
    return await Product.findByPk(id, {
        include: [{
            model: SubBrand,
            attributes: ['id', 'name', 'brandId'],
            include: [{ model: Brand, attributes: ['id', 'name'] }]
        }]
    });
};

const updateProduct = async (id, name, subBrandId, hargaPerCarton, qtyPerCarton) => {
    const product = await Product.findByPk(id);
    return product ? product.update({ name, subBrandId, hargaPerCarton, qtyPerCarton }) : null;
};

const deleteProduct = async (id) => Product.destroy({ where: { id } });

module.exports = {
    createBrand, findAllBrands, findBrandById, updateBrand, deleteBrand,
    createSubBrand, findAllSubBrands, findSubBrandById, updateSubBrand, deleteSubBrand,
    createProduct, findAllProducts, findProductById, updateProduct, deleteProduct,
};