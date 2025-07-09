"use client";
import { Search } from 'lucide-react';
import ProfileButton from '@/components/auth/ProfileButton';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-white" role="main" aria-label="Homepage main content">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 w-full">
        <h1 className="text-5xl font-heading font-extrabold text-neutral-900 mb-4 drop-shadow-sm">Syra Academy</h1>
        <p className="text-lg text-neutral-700 max-w-2xl mb-8">Empowering the next generation of innovators through robotics, coding, and STEM education. Join our vibrant community, compete, learn, and grow together!</p>
        <div className="flex gap-4 justify-center">
          <a href="/register" className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold shadow hover:bg-primary-700 transition" aria-label="Get started by registering an account">Get Started</a>
          <a href="/community" className="px-6 py-3 border border-primary-600 text-primary-700 rounded-lg font-semibold shadow hover:bg-primary-50 transition" aria-label="Explore the community">Explore Community</a>
        </div>
      </section>

      {/* Section Introductions */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-4 w-full">
        <div className="bg-neutral-50 rounded-xl shadow p-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-heading font-bold text-primary-700 mb-2">Competitions</h2>
          <p className="text-neutral-600 mb-4">Join or create robotics competitions, challenge yourself, and win amazing prizes.</p>
          <a href="/competitions" className="text-primary-700 font-semibold hover:underline" aria-label="View competitions">View Competitions</a>
        </div>
        <div className="bg-neutral-50 rounded-xl shadow p-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-heading font-bold text-primary-700 mb-2">Teams</h2>
          <p className="text-neutral-600 mb-4">Find, join, or create a team. Collaborate, build, and compete together.</p>
          <a href="/teams" className="text-primary-700 font-semibold hover:underline" aria-label="Browse teams">Browse Teams</a>
        </div>
        <div className="bg-neutral-50 rounded-xl shadow p-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-heading font-bold text-primary-700 mb-2">Schools</h2>
          <p className="text-neutral-600 mb-4">Connect with top schools, discover programs, and expand your learning opportunities.</p>
          <a href="/schools" className="text-primary-700 font-semibold hover:underline" aria-label="Find schools">Find Schools</a>
        </div>
      </section>
    </div>
  );
}