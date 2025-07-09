import { POST } from './route';

describe('POST /api/schools', () => {
  it('returns 400 for invalid payload', async () => {
    const res = await POST({ json: async () => ({}) } as any);
    expect(res.status).toBe(400);
  });
});
