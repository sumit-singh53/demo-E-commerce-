// Mock and DB item handling
const Product = require('../models/product');
exports.fetchAllProducts = async () => await Product.find({});
