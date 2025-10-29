// Enhanced Checkout receipt logic with better error handling
exports.generateReceipt = (cart) => {
  try {
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty or invalid');
    }

    const items = cart.items.map(item => {
      if (!item.product) {
        throw new Error('Invalid product in cart item');
      }
      
      return {
        id: item.product._id || item.product.id,
        title: item.product.title || 'Unknown Product',
        price: parseFloat(item.product.price) || 0,
        qty: parseInt(item.qty) || 1,
        subtotal: (parseFloat(item.product.price) || 0) * (parseInt(item.qty) || 1)
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    return {
      id: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      status: 'completed',
      paymentMethod: 'demo', // In real app, this would come from payment processor
      userId: cart.user
    };
  } catch (error) {
    console.error('Error generating receipt:', error);
    throw new Error('Failed to generate receipt: ' + error.message);
  }
};
