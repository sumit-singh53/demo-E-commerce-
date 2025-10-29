// Checkout controller
// Only require models when not using mock data
let Cart;
if (process.env.USE_MOCK !== 'true') {
  Cart = require('../models/cart');
}
const ReceiptService = require('../services/receiptService');

exports.checkout = async (req, res, next) => {
  try {
    const { userId } = req.body || { userId: 'mock' };
    
    // Always use mock data when USE_MOCK is true
    if (process.env.USE_MOCK === 'true') {
      const mockReceipt = {
        id: `receipt_${Date.now()}`,
        userId: userId,
        items: [],
        total: 0,
        date: new Date().toISOString(),
        status: 'completed'
      };
      return res.status(200).json({ receipt: mockReceipt });
    }
    
    // Only use database operations when not in mock mode
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
