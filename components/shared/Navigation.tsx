'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  Home, 
  MapPin, 
  Trophy, 
  Users, 
  MessageSquare, 
  User,
  Search,
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { getSessionUser } from '@/lib/session';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
  roles?: string[]; // Which user roles can see this item
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and quick access',
  },
  {
    name: 'Schools',
    href: '/schools',
    icon: MapPin,
    description: 'Discover robotics schools',
  },
  {
    name: 'Competitions',
    href: '/competitions',
    icon: Trophy,
    description: 'Join robotics competitions',
  },
  {
    name: 'Teams',
    href: '/teams',
    icon: Users,
    description: 'Create and manage teams',
  },
  {
    name: 'Community',
    href: '/community',
    icon: MessageSquare,
    description: 'Connect with others',
  },
  {
    name: 'Coaches',
    href: '/coaches',
    icon: User,
    description: 'Find robotics mentors',
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const user = getSessionUser(session);
  const isAdmin = user?.role === 'admin';
  const isSchoolAdmin = user?.role === 'school-admin';
  const showCommunity = isAdmin || isSchoolAdmin;
  const showCoaches = isAdmin || isSchoolAdmin;

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3" aria-label="Go to dashboard">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SR</span>
              </div>
              <span className="font-heading text-xl text-neutral-900 hidden sm:block">
                SyraRobot Academy
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              if (item.name === 'Dashboard' && !isAdmin) return null;
              if (item.name === 'Community' && !showCommunity) return null;
              if (item.name === 'Coaches' && !showCoaches) return null;
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  )}
                  title={item.description}
                  aria-label={item.name}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            {!session && (
              <Link href="/register" className="px-3 py-2 rounded-lg text-sm font-medium text-primary-700 hover:bg-primary-50 transition-colors duration-200" aria-label="Register">
                Register
              </Link>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors" aria-label="Open search">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors relative" aria-label="View notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
            </button>

            {/* Profile */}
            <Link
              href="/profile"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
              aria-label="Go to profile"
            >
              <User className="w-5 h-5" />
            </Link>

            {session && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-2">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                if (item.name === 'Dashboard' && !isAdmin) return null;
                if (item.name === 'Community' && !showCommunity) return null;
                if (item.name === 'Coaches' && !showCoaches) return null;
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-neutral-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
              {!session && (
                <Link href="/register" className="px-3 py-2 rounded-lg text-sm font-medium text-primary-700 hover:bg-primary-50 transition-colors duration-200 block">
                  Register
                </Link>
              )}
              {session && (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 w-full"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );}