// Product controller
const Product = require('../models/product');
const { getMockProducts } = require('../utils/mockData');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    let products;
    
    if (process.env.USE_MOCK === 'true') {
      // Use mock data when in mock mode
      products = await getMockProducts();
    } else if (process.env.DB_TYPE === 'mongo') {
      // Fetch from MongoDB
      products = await Product.find({});
    } else if (process.env.DB_TYPE === 'sqlite') {
      // For SQLite, use mock data for now (can be extended later)
      products = await getMockProducts();
    } else {
      // Default to mock data
      products = await getMockProducts();
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
};

// Keep the old method name for backward compatibility
const getAllProducts = getProducts;

module.exports = { 
  getProducts,
  getAllProducts 
};
