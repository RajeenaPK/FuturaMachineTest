const Order = require('../Model/order');
const Product = require('../Model/product');

exports.placeOrder = async (req, res) => {
  try {
    const { items } = req.body;
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.approved) return res.status(400).json({ msg: 'Invalid or unapproved product' });

      totalAmount += product.price * item.quantity;
    }

    const newOrder = new Order({
      user: req.user.id,
      items,
      totalAmount
    });

    await newOrder.save();
    res.status(200).json(newOrder);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id }).populate('items.product');
      res.json(orders);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find().populate('user', 'name email').populate('items.product');
      res.json(orders);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
};


exports.updateOrderStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.id);
  
      if (!order) return res.status(404).json({ msg: 'Order not found' });
  
      order.status = status;
      await order.save();
  
      res.json({ msg: 'Order status updated', order });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
};
  
  
  
