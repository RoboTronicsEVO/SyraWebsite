import { users } from './db.js';

const SESSION_KEY = 'skool_clone_session';

export async function signIn(provider, credentials) {
    let user;
    switch (provider) {
        case 'credentials':
            if (!credentials || !credentials.email || !credentials.password) {
                return { ok: false, error: 'Email and password are required' };
            }
            user = users.find(u => u.email === credentials.email && u.password === credentials.password);
            if (!user) {
                return { ok: false, error: 'Invalid credentials' };
            }
            break;
        case 'google':
            user = { id: '2', name: 'Google User', email: 'google@example.com', image: 'https://i.pravatar.cc/150?u=google@example.com' };
            break;
        case 'github':
            user = { id: '3', name: 'GitHub User', email: 'github@example.com', image: 'https://i.pravatar.cc/150?u=github@example.com' };
            break;
        default:
            return { ok: false, error: 'Unknown provider' };
    }

    const session = {
        user: {
            name: user.name,
            email: user.email,
            image: user.image
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, url: '#/profile' };
}

export async function signOut() {
    localStorage.removeItem(SESSION_KEY);
    return { ok: true };
}

export async function getSession() {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    const session = JSON.parse(sessionStr);
    if (new Date(session.expires) < new Date()) {
        localStorage.removeItem(SESSION_KEY);
        return null;
    }
    return session;
}
