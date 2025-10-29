// Cart controller
// Only require models when not using mock data
let Cart, Product, User;
if (process.env.USE_MOCK !== 'true') {
  Cart = require('../models/cart');
  Product = require('../models/product');
  User = require('../models/user');
}

// Simple global cart storage for mock mode
global.mockCarts = global.mockCarts || {};

// Get products data for mock mode
const { getMockProducts } = require('../utils/mockData');

const getProductById = async (productId) => {
  const products = await getMockProducts();
  // Convert productId to number for proper comparison
  const numericId = parseInt(productId);
  return products.find(p => p.id === numericId);
};

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.body.userId || 'mock'; // For demo
    
    // Always use mock data when USE_MOCK is true
    if (process.env.USE_MOCK === 'true') {
      const cart = global.mockCarts[userId] || { user: userId, items: [] };
      return res.status(200).json(cart);
    }
    
    // Only use database operations when not in mock mode
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
    
    // Validate productId exists
    const product = await getProductById(productId);
    if (!product) {
      return res.status(400).json({ error: 'Valid productId is required' });
    }
    
    // Always use mock data when USE_MOCK is true
    if (process.env.USE_MOCK === 'true') {
      let cart = global.mockCarts[userId] || { user: userId, items: [] };
      
      // Check if product already exists in cart
      const existingIndex = cart.items.findIndex(item => item.product.id == productId);
      
      if (existingIndex !== -1) {
        // Update quantity if product exists
        cart.items[existingIndex].qty += parseInt(qty);
      } else {
        // Add new product to cart
        cart.items.push({ 
          product: product, 
          qty: parseInt(qty) 
        });
      }
      
      // Save cart to global storage
      global.mockCarts[userId] = cart;
      
      return res.status(200).json(cart);
    }
    
    // Only use database operations when not in mock mode
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
    
    // Always use mock data when USE_MOCK is true
    if (process.env.USE_MOCK === 'true') {
      let cart = global.mockCarts[userId] || { user: userId, items: [] };
      
      // Remove product from cart
      cart.items = cart.items.filter(item => item.product.id != productId);
      
      // Save cart to global storage
      global.mockCarts[userId] = cart;
      
      return res.status(200).json(cart);
    }
    
    // Only use database operations when not in mock mode
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    cart.items = cart.items.filter(i => !i.product.equals(productId));
    await cart.save();
    res.status(200).json(cart);
  } catch (err) { next(err); }
};
