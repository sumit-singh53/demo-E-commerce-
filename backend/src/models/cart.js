// Cart model
const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    qty: { type: Number, default: 1 }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
