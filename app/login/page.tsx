import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="font-heading text-3xl text-neutral-900 mb-2">
            Welcome back to SyraRobot
          </h1>
          <p className="text-neutral-600">
            Sign in to your robotics academy account
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <LoginForm />
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="text-primary-500 hover:text-primary-600 font-medium focus:outline-none focus:underline"
            >
              Create one here
            </Link>
          </p>
          <p className="text-xs text-neutral-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-neutral-700">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-neutral-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Sign In | SyraRobot Academy',
  description: 'Sign in to your SyraRobot Academy account to access robotics courses, competitions, and community.',
};