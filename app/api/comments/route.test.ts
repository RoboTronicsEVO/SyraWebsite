import { POST } from './route';

describe('POST /api/comments', () => {
  it('requires auth', async () => {
    const res = await POST({ json: async () => ({}) } as any as Request);
    expect(res.status).toBe(401);
  });
});
