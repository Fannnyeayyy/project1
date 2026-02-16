const express = require('express');
const router = express.Router();
const controller = require('./master.controller')
const authMiddleware = require('../../middlewares/auth.middleware');
const adminMiddleware = require('../../middlewares/admin.middleware');

// ===== BRAND ROUTES =====
router.get('/', authMiddleware, adminMiddleware, controller.getAllBrands);
router.post('/', authMiddleware, adminMiddleware, controller.createBrand);
router.delete('/:id', authMiddleware, adminMiddleware, controller.deleteBrand);
router.put('/:id', authMiddleware, adminMiddleware, controller.editBrand);

// ===== SUB BRAND ROUTES =====
router.get('/sub-brand/list', authMiddleware, adminMiddleware, controller.getAllSubBrands);
router.get('/sub-brand/:id', authMiddleware, adminMiddleware, controller.getSubBrandById);
router.post('/sub-brand', authMiddleware, adminMiddleware, controller.createSubBrand);
router.put('/sub-brand/:id', authMiddleware, adminMiddleware, controller.updateSubBrand);
router.delete('/sub-brand/:id', authMiddleware, adminMiddleware, controller.deleteSubBrand);

module.exports = router;