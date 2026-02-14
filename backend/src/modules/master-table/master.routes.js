const express = require('express');
const router = express.Router();
const controller = require('./master.controller')
const authMiddleware = require('../../middlewares/auth.middleware');
const adminMiddleware = require('../../middlewares/admin.middleware');

router.get('/', authMiddleware, adminMiddleware, controller.getAllBrands);
router.post('/', authMiddleware, adminMiddleware, controller.createBrand);
router.delete('/:id', authMiddleware, adminMiddleware, controller.deleteBrand);
router.put('/:id', authMiddleware, adminMiddleware, controller.editBrand);

module.exports = router;
