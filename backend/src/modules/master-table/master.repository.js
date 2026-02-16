const { Brand, SubBrand, Product } = require('../../models/master-table.model');

// ===== BRAND REPOSITORY =====
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

// ===== SUB BRAND REPOSITORY =====
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

// ===== PRODUCT REPOSITORY =====
const createProduct = async (name, subBrandId) => {
    return await Product.create({ name, subBrandId });
}

const findAllProducts = async () => {
    try {
        return await Product.findAll({
            include: [
                {
                    model: SubBrand,
                    as: 'SubBrand',
                    attributes: ['id', 'name', 'brandId'],
                    include: [
                        {
                            model: Brand,
                            as: 'Brand',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });
    } catch (error) {
        console.error("Error in findAllProducts:", error);
        // Fallback ke query tanpa relasi
        return await Product.findAll();
    }
}

const findProductById = async (id) => {
    try {
        return await Product.findByPk(id, {
            include: [
                {
                    model: SubBrand,
                    as: 'SubBrand',
                    attributes: ['id', 'name', 'brandId'],
                    include: [
                        {
                            model: Brand,
                            as: 'Brand',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });
    } catch (error) {
        console.error("Error in findProductById:", error);
        return await Product.findByPk(id);
    }
}

const updateProduct = async (id, name, subBrandId) => {
    try {
        const product = await Product.findByPk(id);
        if (!product) return null;
        return await product.update({ name, subBrandId });
    } catch (error) {
        console.error("Error in updateProduct:", error);
        throw error;
    }
}

const deleteProduct = async (id) => {
    try {
        return await Product.destroy({ where: { id } });
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        throw error;
    }
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