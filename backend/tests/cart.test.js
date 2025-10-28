// Cart tests
const request = require('supertest');
const app = require('../src/app');

describe('POST /api/cart/add', () => {
  it('should add product to cart with mock data', async () => {
    // Set environment to use mock data for testing
    process.env.USE_MOCK = 'true';
    
    const res = await request(app)
      .post('/api/cart/add')
      .send({ userId: "mock", productId: "test-product-1", qty: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toBeDefined();
  });

  it('should return error for missing fields', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .send({ userId: "mock" }); // Missing productId and qty
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('productId is required');
  });
});
