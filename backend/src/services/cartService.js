// Cart + DB logic
const Cart = require('../models/cart');
exports.getUserCart = async (uid) => await Cart.findOne({ user: uid }).populate('items.product');
exports.updateUserCart = async (uid, cart) => await Cart.findOneAndUpdate({ user: uid }, cart, { upsert: true, new: true }).populate('items.product');
exports.deleteUserCart = async (uid) => await Cart.findOneAndDelete({ user: uid });
exports.deleteUserCartItem = async (uid, pid) => await Cart.findOneAndUpdate({ user: uid }, { $pull: { items: { product: pid } } }, { new: true }).populate('items.product');
exports.addUserCartItem = async (uid, pid) => await Cart.findOneAndUpdate({ user: uid }, { $push: { items: { product: pid, quantity: 1 } } }, { upsert: true, new: true }).populate('items.product');
exports.updateUserCartItem = async (uid, pid, quantity) => await Cart.findOneAndUpdate({ user: uid, 'items.product': pid }, { $set: { 'items.$.quantity': quantity } }, { new: true }).populate('items.product');
