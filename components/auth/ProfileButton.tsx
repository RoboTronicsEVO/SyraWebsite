'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';

const ProfileButton: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;
  if (!session?.user) return null;

  return (
    <div className="flex items-center space-x-3">
      {session.user.image && (
        <img
          src={session.user.image}
          alt={session.user.name ? `${session.user.name}'s avatar` : 'User avatar'}
          className="h-8 w-8 rounded-full"
          aria-label="Profile avatar"
        />
      )}
      <span className="text-sm font-medium">{session.user.name}</span>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
        aria-label="Sign out"
      >
        Sign Out
      </button>
    </div>
  );
};

export default ProfileButton;