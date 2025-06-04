'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      setIsLoading(false);
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getLinkClass = (path: string) => {
    const baseClass = "text-base px-3 py-2 rounded-md transition-colors";
    if (pathname === path) {
      return `${baseClass} text-blue-600 bg-blue-50`;
    }
    return `${baseClass} text-gray-700 hover:text-gray-900 hover:bg-gray-50`;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Task Board</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {user ? (
              <>
                <nav className="hidden md:flex items-center space-x-4">
                  <Link 
                    href="/dashboard" 
                    className={getLinkClass('/dashboard')}
                  >
                    Board
                  </Link>
                  <Link 
                    href="/profile" 
                    className={getLinkClass('/profile')}
                  >
                    Profile
                  </Link>
                </nav>
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-1 text-base text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50"
                  >
                    <span>{user.email?.split('@')[0]}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {!isLoading && (
                  <>
                    <Link
                      href="/auth/signin"
                      className="text-base text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="text-base text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
