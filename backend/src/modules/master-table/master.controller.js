const service = require('./master.service');

// ===== BRAND CONTROLLERS =====
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

// ===== SUB BRAND CONTROLLERS =====
const createSubBrand = async (req, res) => {
    try {
        const { name, brandId } = req.body;
        
        if (!name || !brandId) {
            return res.status(400).json({ message: 'Name and brandId are required' });
        }
        
        const subBrand = await service.createSubBrand(name, brandId);
        res.status(201).json({ 
            message: 'Sub Brand created successfully',
            data: subBrand 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllSubBrands = async (req, res) => {
    try {
        const subBrands = await service.findAllSubBrands();
        res.json(subBrands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSubBrandById = async (req, res) => {
    try {
        const subBrand = await service.findSubBrandById(req.params.id);
        
        if (!subBrand) {
            return res.status(404).json({ message: 'Sub Brand not found' });
        }
        
        res.json(subBrand);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSubBrand = async (req, res) => {
    try {
        const { name, brandId } = req.body;
        
        if (!name || !brandId) {
            return res.status(400).json({ message: 'Name and brandId are required' });
        }
        
        const subBrand = await service.updateSubBrand(req.params.id, name, brandId);
        
        if (!subBrand) {
            return res.status(404).json({ message: 'Sub Brand not found' });
        }
        
        res.json({ message: 'Sub Brand updated successfully', data: subBrand });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSubBrand = async (req, res) => {
    try {
        const result = await service.deleteSubBrand(req.params.id);
        
        if (result === 0) {
            return res.status(404).json({ message: 'Sub Brand not found' });
        }
        
        res.json({ message: 'Sub Brand deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ===== PRODUCT CONTROLLERS =====
const createProduct = async (req, res) => {
    try {
        const { name, subBrandId } = req.body;
        
        if (!name || !subBrandId) {
            return res.status(400).json({ message: 'Name and subBrandId are required' });
        }
        
        const product = await service.createProduct(name, subBrandId);
        res.status(201).json({ 
            message: 'Product created successfully',
            data: product 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await service.findAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await service.findProductById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, subBrandId } = req.body;
        
        if (!name || !subBrandId) {
            return res.status(400).json({ message: 'Name and subBrandId are required' });
        }
        
        const product = await service.updateProduct(req.params.id, name, subBrandId);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({ message: 'Product updated successfully', data: product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const result = await service.deleteProduct(req.params.id);
        
        if (result === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    // Brand
    createBrand,
    getAllBrands,
    deleteBrand,
    editBrand,
    // Sub Brand
    createSubBrand,
    getAllSubBrands,
    getSubBrandById,
    updateSubBrand,
    deleteSubBrand,
    // Product
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
}