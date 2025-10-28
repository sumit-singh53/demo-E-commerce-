// Enhanced price formatting utility
export function formatPrice(amount) {
  if (typeof amount !== 'number') {
    return '₹0.00';
  }
  
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).replace('₹', '').trim();
}

export function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    return '₹0.00';
  }
  
  return `₹${formatPrice(amount)}`;
}
