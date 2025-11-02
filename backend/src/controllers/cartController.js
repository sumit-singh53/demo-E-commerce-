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
  const product = products.find(p => p.id === numericId);
  console.log(`Looking for product ID: ${productId} (${numericId}), found:`, product ? product.title : 'Not found');
  return product;
};

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.body.userId || 'mock'; // For demo
    
    console.log('Get cart request for userId:', userId);
    
    // Always use mock data when USE_MOCK is true
    if (process.env.USE_MOCK === 'true') {
      const cart = global.mockCarts[userId] || { user: userId, items: [] };
      console.log('Returning cart:', cart);
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
    
    console.log('Add to cart request:', { userId, productId, qty, type: typeof productId });
    
    // Validation
    if (!userId || (!productId && productId !== 0) || !qty) {
      return res.status(400).json({ error: 'Missing required fields: userId, productId, qty' });
    }
    
    // Validate productId exists
    const product = await getProductById(productId);
    if (!product) {
      console.log('Product not found for ID:', productId);
      return res.status(400).json({ error: `Product with ID ${productId} not found` });
    }
    
    // Always use mock data when USE_MOCK is true
    if (process.env.USE_MOCK === 'true') {
      let cart = global.mockCarts[userId] || { user: userId, items: [] };
      
      console.log('Current cart before adding:', cart);
      
      // Check if product already exists in cart
      const existingIndex = cart.items.findIndex(item => item.product.id == productId);
      
      if (existingIndex !== -1) {
        // Update quantity if product exists
        cart.items[existingIndex].qty += parseInt(qty);
        console.log('Updated existing item quantity');
      } else {
        // Add new product to cart
        cart.items.push({ 
          product: product, 
          qty: parseInt(qty) 
        });
        console.log('Added new item to cart');
      }
      
      // Save cart to global storage
      global.mockCarts[userId] = cart;
      
      console.log('Cart after adding:', cart);
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
    
    console.log('Remove from cart request:', { userId, productId, type: typeof productId });
    
    // Validation
    if (!userId || (!productId && productId !== 0)) {
      return res.status(400).json({ error: 'Missing required fields: userId, productId' });
    }
    
    // Always use mock data when USE_MOCK is true
    if (process.env.USE_MOCK === 'true') {
      let cart = global.mockCarts[userId] || { user: userId, items: [] };
      
      console.log('Current cart before removing:', cart);
      
      // Remove product from cart
      const initialLength = cart.items.length;
      cart.items = cart.items.filter(item => item.product.id != productId);
      
      console.log(`Removed ${initialLength - cart.items.length} items`);
      
      // Save cart to global storage
      global.mockCarts[userId] = cart;
      
      console.log('Cart after removing:', cart);
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
