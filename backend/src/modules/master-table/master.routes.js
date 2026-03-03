const express = require('express');
const router = express.Router();
const controller = require('./master.controller');
const authMiddleware  = require('../../middlewares/auth.middleware');
const adminMiddleware = require('../../middlewares/admin.middleware');
const { validate, rules } = require('../../middlewares/validators');

router.post  ('/product',     authMiddleware, adminMiddleware, validate(rules.product), controller.createProduct);
router.get   ('/product/list', authMiddleware, controller.getAllProducts);
router.get   ('/product/:id',  authMiddleware, controller.getProductById);
router.put   ('/product/:id',  authMiddleware, adminMiddleware, validate(rules.product), controller.updateProduct);
router.delete('/product/:id',  authMiddleware, adminMiddleware, controller.deleteProduct);

router.post  ('/sub-brand',     authMiddleware, adminMiddleware, validate(rules.subBrand), controller.createSubBrand);
router.get   ('/sub-brand/list', authMiddleware, controller.getAllSubBrands);
router.get   ('/sub-brand/:id',  authMiddleware, controller.getSubBrandById);
router.put   ('/sub-brand/:id',  authMiddleware, adminMiddleware, validate(rules.subBrand), controller.updateSubBrand);
router.delete('/sub-brand/:id',  authMiddleware, adminMiddleware, controller.deleteSubBrand);

router.get   ('/',    authMiddleware, controller.getAllBrands);
router.post  ('/',    authMiddleware, adminMiddleware, validate(rules.brand), controller.createBrand);
router.put   ('/:id', authMiddleware, adminMiddleware, validate(rules.brand), controller.editBrand);
router.delete('/:id', authMiddleware, adminMiddleware, controller.deleteBrand);

module.exports = router;