const repo = require('./master.repository');

// Brand Services
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

module.exports = {
    createBrand,
    findAllBrands,
    findBrandById,
    updateBrand,
    deleteBrand
}