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
            <ToastProvider />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}