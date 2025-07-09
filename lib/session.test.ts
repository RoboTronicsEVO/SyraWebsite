import { getSessionUser } from './session';

describe('getSessionUser', () => {
  it('returns null when session has no user', () => {
    expect(getSessionUser(null)).toBeNull();
    expect(getSessionUser({} as any)).toBeNull();
  });

  it('extracts fields from session.user', () => {
    const session = { user: { id: '1', role: 'admin', email: 'a', name: 'b', image: null, verified: true } } as any;
    expect(getSessionUser(session)).toEqual({ id: '1', role: 'admin', email: 'a', name: 'b', image: null, verified: true });
  });
});
