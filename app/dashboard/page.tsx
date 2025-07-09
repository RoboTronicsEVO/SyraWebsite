'use client';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-neutral-600">The dashboard is only available to admin users.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="font-heading text-4xl text-neutral-900 mb-2">
            Welcome to SyraRobot Academy
          </h1>
          <p className="text-neutral-600 text-lg">
            Your robotics learning journey starts here
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-heading text-xl text-neutral-900 mb-3">Schools</h3>
            <p className="text-neutral-600 mb-4">Discover and join robotics schools in your area</p>
            <button className="text-primary-500 hover:text-primary-600 font-medium">
              Explore Schools →
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-heading text-xl text-neutral-900 mb-3">Competitions</h3>
            <p className="text-neutral-600 mb-4">Participate in robotics competitions and challenges</p>
            <button className="text-primary-500 hover:text-primary-600 font-medium">
              View Competitions →
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-heading text-xl text-neutral-900 mb-3">Community</h3>
            <p className="text-neutral-600 mb-4">Connect with fellow robotics enthusiasts</p>
            <button className="text-primary-500 hover:text-primary-600 font-medium">
              Join Community →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}