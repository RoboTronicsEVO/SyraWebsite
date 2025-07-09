'use client';

import React from 'react';
import { signIn } from 'next-auth/react';

const SignInButtons: React.FC = () => {
  return (
    <div className="space-y-2">
      <button
        onClick={() => signIn('google', { callbackUrl: '/profile' })}
        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Sign in with Google
      </button>
      <button
        onClick={() => signIn('github', { callbackUrl: '/profile' })}
        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Sign in with GitHub
      </button>
    </div>
  );
};

export default SignInButtons;