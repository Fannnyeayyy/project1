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

// Sub Brand Services
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
    deleteSubBrand
}