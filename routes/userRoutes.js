const express = require('express');
const { getUserProfile, updateUserProfile } = require('../Controller/userController');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../Controller/productController');
const { placeOrder, getUserOrders } = require('../Controller/orderController');

const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile); 
router.put('/profile', authMiddleware, updateUserProfile); 

router.post('/product/create', authMiddleware, createProduct); 
router.get('/products', getProducts); 
router.get('/product/get/:id', getProductById); 
router.put('/product/update/:id', authMiddleware, updateProduct); 
router.delete('/product/delete/:id', authMiddleware, deleteProduct);

router.post('/order/create', authMiddleware, placeOrder);
router.get('/orders/my-orders', authMiddleware, getUserOrders);

module.exports = router;
