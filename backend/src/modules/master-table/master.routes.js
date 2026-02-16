const express = require('express');
const router = express.Router();
const controller = require('./master.controller')
const authMiddleware = require('../../middlewares/auth.middleware');
const adminMiddleware = require('../../middlewares/admin.middleware');

// ===== PRODUCT ROUTES (SPECIFIC - PUT FIRST) =====
router.post('/product', authMiddleware, adminMiddleware, controller.createProduct);
router.get('/product/list', authMiddleware, adminMiddleware, controller.getAllProducts);
router.get('/product/:id', authMiddleware, adminMiddleware, controller.getProductById);
router.put('/product/:id', authMiddleware, adminMiddleware, controller.updateProduct);
router.delete('/product/:id', authMiddleware, adminMiddleware, controller.deleteProduct);

// ===== SUB BRAND ROUTES (SPECIFIC) =====
router.post('/sub-brand', authMiddleware, adminMiddleware, controller.createSubBrand);
router.get('/sub-brand/list', authMiddleware, adminMiddleware, controller.getAllSubBrands);
router.get('/sub-brand/:id', authMiddleware, adminMiddleware, controller.getSubBrandById);
router.put('/sub-brand/:id', authMiddleware, adminMiddleware, controller.updateSubBrand);
router.delete('/sub-brand/:id', authMiddleware, adminMiddleware, controller.deleteSubBrand);

// ===== BRAND ROUTES (GENERAL - PUT LAST) =====
router.get('/', authMiddleware, adminMiddleware, controller.getAllBrands);
router.post('/', authMiddleware, adminMiddleware, controller.createBrand);
router.delete('/:id', authMiddleware, adminMiddleware, controller.deleteBrand);
router.put('/:id', authMiddleware, adminMiddleware, controller.editBrand);

module.exports = router;