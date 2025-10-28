// Cart controller
const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.body.userId || 'mock'; // For demo
    
    if (process.env.USE_MOCK === 'true') {
      // Return mock cart for demo
      return res.status(200).json({ user: userId, items: [] });
    }
    
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { userId, productId, qty } = req.body;
    
    // Validation
    if (!userId || !productId || !qty) {
      return res.status(400).json({ error: 'Missing required fields: userId, productId, qty' });
    }
    
    if (process.env.USE_MOCK === 'true') {
      // Return mock success for demo
      return res.status(200).json({ 
        user: userId, 
        items: [{ product: productId, qty: parseInt(qty) }] 
      });
    }
    
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });
    const existingIndex = cart.items.findIndex(i => i.product.equals(productId));
    if (existingIndex !== -1) {
      cart.items[existingIndex].qty += parseInt(qty);
    } else {
      cart.items.push({ product: productId, qty: parseInt(qty) });
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (err) { next(err); }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;
    
    // Validation
    if (!userId || !productId) {
      return res.status(400).json({ error: 'Missing required fields: userId, productId' });
    }
    
    if (process.env.USE_MOCK === 'true') {
      // Return mock success for demo
      return res.status(200).json({ user: userId, items: [] });
    }
    
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    cart.items = cart.items.filter(i => !i.product.equals(productId));
    await cart.save();
    res.status(200).json(cart);
  } catch (err) { next(err); }
};
