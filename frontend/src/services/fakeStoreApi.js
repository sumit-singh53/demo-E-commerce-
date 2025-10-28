// Bonus/Optional integration
// Optional integration with fakestoreapi for demo/mock
export async function fetchFakeStoreProducts() {
  const response = await fetch('https://fakestoreapi.com/products');
  return response.json();
}
