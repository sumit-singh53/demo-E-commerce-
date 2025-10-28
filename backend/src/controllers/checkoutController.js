// Checkout controller
const Cart = require('../models/cart');
const ReceiptService = require('../services/receiptService');

exports.checkout = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart empty" });
    }
    // In real life: handle payments, stock deduction, transaction log...
    const receipt = ReceiptService.generateReceipt(cart);
    cart.items = [];
    await cart.save();
    res.status(200).json({ receipt });
  } catch (err) { next(err); }
};
