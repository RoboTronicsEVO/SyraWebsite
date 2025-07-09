import type { Metadata } from 'next';
import './globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastProvider } from '@/components/ui/Toast';
import Navigation from '@/components/shared/Navigation';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'SyraRobot Academy',
  description: 'Comprehensive K-12 robotics education platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        <Providers>
          <ErrorBoundary>
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
            <footer className="w-full py-8 bg-primary-700 text-white text-center mt-auto">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
                <div className="text-lg font-bold">Syra Academy</div>
                <div className="text-sm">&copy; {new Date().getFullYear()} Syra Academy. All rights reserved.</div>
                <nav aria-label="Footer navigation" className="flex gap-4">
                  <a href="/community" className="hover:underline">Community</a>
                  <a href="/competitions" className="hover:underline">Competitions</a>
                  <a href="/teams" className="hover:underline">Teams</a>
                  <a href="/schools" className="hover:underline">Schools</a>
                </nav>
              </div>
            </footer>
            <ToastProvider />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}