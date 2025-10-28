// Checkout tests
const request = require('supertest');
const app = require('../src/app');

describe('POST /api/checkout', () => {
  it('should checkout cart and return receipt', async () => {
    const res = await request(app).post('/api/checkout').send({ userId: "mock" });
    expect(res.statusCode).toBe(200);
    expect(res.body.receipt).toBeDefined();
  });
});
