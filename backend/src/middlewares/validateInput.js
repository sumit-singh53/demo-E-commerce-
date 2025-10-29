// Validate input middleware for adding to cart
const validateAddToCartInput = (req, res, next) => {
  const { userId, productId, qty } = req.body;
  
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Valid userId is required' });
  }
  
  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ error: 'Valid productId is required' });
  }
  
  if (!qty || typeof qty !== 'number' || !Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ error: 'qty must be a positive integer' });
  }
  
  next();
};

// Validate input middleware for removing from cart
const validateRemoveFromCartInput = (req, res, next) => {
  const { userId, productId } = req.body;
  
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Valid userId is required' });
  }
  
  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ error: 'Valid productId is required' });
  }
  
  next();
};

// Legacy function for backward compatibility
const validateCartInput = validateAddToCartInput;

const validateCheckoutInput = (req, res, next) => {
  const { userId } = req.body;
  
  if (!userId || typeof userId !== 'string') {
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
