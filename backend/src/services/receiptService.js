// Checkout receipt logic
exports.generateReceipt = (cart) => {
  const total = cart.items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const items = cart.items.map(i => ({
    title: i.product.title,
    price: i.product.price,
    qty: i.qty
  }));
  return {
    date: new Date(),
    items,
    total
  };
};
