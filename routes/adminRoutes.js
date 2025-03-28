const express = require('express');
const { getAllUsers, deleteUser } = require('../Controller/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../Controller/productController');
const { getAllOrders, updateOrderStatus } = require('../Controller/orderController');

const router = express.Router();

router.get('/users', authMiddleware, adminMiddleware, getAllUsers); 
router.delete('/user/:id', authMiddleware, adminMiddleware, deleteUser); 

router.post('/product/create', authMiddleware, createProduct); 
router.get('/products', getProducts); 
router.get('/product/get/:id', getProductById); 
router.put('/product/update/:id', authMiddleware, updateProduct); 
router.delete('/product/delete/:id', authMiddleware, deleteProduct);

router.get('/orders/all', authMiddleware, adminMiddleware, getAllOrders);
router.put('/order/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;