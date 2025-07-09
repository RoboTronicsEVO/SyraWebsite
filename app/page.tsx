"use client";
import Link from 'next/link';
import ProfileButton from '@/components/auth/ProfileButton';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      <h1 className="text-3xl font-bold">Welcome to Syra Website</h1>
      {!session ? (
        <div className="space-x-4">
          <Link href="/signin" className="text-indigo-600 underline">
            Sign In
          </Link>
          <Link href="/register" className="text-indigo-600 underline">
            Register as School
          </Link>
        </div>
      ) : (
        <div className="space-x-4">
          <span className="text-neutral-700">Hello, {session.user?.name || session.user?.email}!</span>
          <Link href="/profile" className="text-indigo-600 underline">
            Profile
          </Link>
        </div>
      )}
      <ProfileButton />
    </main>
  );
}