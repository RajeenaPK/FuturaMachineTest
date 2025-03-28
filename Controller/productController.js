const Product = require('../Model/product');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    const newProduct = new Product({
      user: req.user.id, 
      name,
      description,
      price,
      quantity,
    });

    const product = await newProduct.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ msg: 'Product not found' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) return res.status(404).json({ msg: 'Product not found' });
  
      if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Unauthorized' });
      }
  
      const { name, description, price, quantity } = req.body;
  
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.quantity = quantity || product.quantity;
  
      await product.save();
      res.json({ msg: 'Product updated successfully', product });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
};
  
  exports.deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) return res.status(404).json({ msg: 'Product not found' });
  
      if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Unauthorized' });
      }
  
      await product.deleteOne();
      res.json({ msg: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
};
  
  