import { Session } from 'next-auth';

export interface SessionUser {
  id?: string;
  role?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  verified?: boolean;
}

export function getSessionUser(session: Session | null | undefined): SessionUser | null {
  if (!session?.user) return null;
  const { id, role, email, name, image, verified } = session.user as any;
  return { id, role, email, name, image, verified };
}

