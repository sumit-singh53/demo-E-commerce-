// Validate input middleware
const validateCartInput = (req, res, next) => {
  const { userId, productId, qty } = req.body;
  
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Valid userId is required' });
  }
  
  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ error: 'Valid productId is required' });
  }
  
  if (qty !== undefined && (!Number.isInteger(qty) || qty < 1)) {
    return res.status(400).json({ error: 'qty must be a positive integer' });
  }
  
  next();
};

const validateCheckoutInput = (req, res, next) => {
  const { userId } = req.body;
  
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Valid userId is required' });
  }
  
  next();
};

module.exports = {
  validateCartInput,
  validateCheckoutInput
};
