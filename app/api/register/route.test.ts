import { POST } from './route';

describe('POST /api/register', () => {
  it('returns 400 for invalid payload', async () => {
    const res = await POST({ json: async () => ({}) } as any as Request);
    expect(res.status).toBe(400);
  });
});
