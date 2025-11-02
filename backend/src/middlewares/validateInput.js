// Validate input middleware for adding to cart
const validateAddToCartInput = (req, res, next) => {
  const { userId, productId, qty } = req.body;
  
  if (!userId || (typeof userId !== 'string' && typeof userId !== 'number')) {
    return res.status(400).json({ error: 'Valid userId is required' });
  }
  
  if (!productId && productId !== 0) {
    return res.status(400).json({ error: 'Valid productId is required' });
  }
  
  // Convert qty to number and validate
  const qtyNum = parseInt(qty);
  if (isNaN(qtyNum) || qtyNum < 1) {
    return res.status(400).json({ error: 'qty must be a positive integer' });
  }
  
  // Normalize the values
  req.body.productId = String(productId);
  req.body.qty = qtyNum;
  
  next();
};

// Validate input middleware for removing from cart
const validateRemoveFromCartInput = (req, res, next) => {
  const { userId, productId } = req.body;
  
  if (!userId || (typeof userId !== 'string' && typeof userId !== 'number')) {
    return res.status(400).json({ error: 'Valid userId is required' });
  }
  
  if (!productId && productId !== 0) {
    return res.status(400).json({ error: 'Valid productId is required' });
  }
  
  // Normalize the productId
  req.body.productId = String(productId);
  
  next();
};

// Legacy function for backward compatibility
const validateCartInput = validateAddToCartInput;

const validateCheckoutInput = (req, res, next) => {
  const { userId } = req.body;
  
  if (!userId || (typeof userId !== 'string' && typeof userId !== 'number')) {
    return res.status(400).json({ error: 'Valid userId is required' });
  }
  
  next();
};

module.exports = {
  validateCartInput,
  validateAddToCartInput,
  validateRemoveFromCartInput,
  validateCheckoutInput
};
