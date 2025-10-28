// Product tests
const request = require('supertest');
const app = require('../src/app');

describe('GET /api/products', () => {
  it('should return 200 and a list of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
