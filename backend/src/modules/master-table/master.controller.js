const service = require('./master.service');

const createBrand = async (req, res) => {
    try {
        const { name } = req.body;
        await service.createBrand(name);
        res.json({ message: 'Brand created successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllBrands = async (req, res) => {
    try {
        const brands = await service.findAllBrands();
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteBrand = async (req, res) => {
    try {
        await service.deleteBrand(req.params.id);
        res.json({ message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const editBrand = async (req, res) => {
    try {
        const { name } = req.body;
        const brand = await service.updateBrand(req.params.id, name);
        res.json({ message: 'Brand updated successfully', brand });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createBrand,
    getAllBrands,
    deleteBrand,
    editBrand
}