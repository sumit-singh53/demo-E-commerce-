// Product controller
// Only require models when not using mock data
let Product;
if (process.env.USE_MOCK !== 'true') {
  Product = require('../models/product');
}
const { getMockProducts } = require('../utils/mockData');

exports.getAllProducts = async (req, res, next) => {
  try {
    let products;
    if (process.env.USE_MOCK === 'true') {
      products = await getMockProducts();
    } else if (process.env.DB_TYPE === 'mongo') {
      products = await Product.find({});
    } else {
      // For SQLite or other databases, use mock data for now
      products = await getMockProducts();
    }
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};
