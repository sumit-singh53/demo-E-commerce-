const request = require('supertest');
const app = require('../src/app');

describe('API integration', () => {
  let productId;

  it('fetch products, add to cart, checkout', async () => {
    const prods = await request(app).get('/api/products');
    expect(prods.statusCode).toBe(200);
    productId = prods.body[0]._id;

    const add = await request(app).post('/api/cart/add').send({ userId: "mock", productId, qty: 2 });
    expect(add.statusCode).toBe(200);

    const checkout = await request(app).post('/api/checkout').send({ userId: "mock" });
    expect(checkout.statusCode).toBe(200);
    expect(checkout.body.receipt).toBeDefined();
  });
});