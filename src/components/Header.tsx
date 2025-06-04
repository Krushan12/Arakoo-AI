'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (user !== undefined) {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
                </nav>                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 hover:border-blue-500 transition-colors duration-200 relative"
                  >
                    <img
                      src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email?.charAt(0)}&background=random`}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-1 z-10 border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.displayName || user?.email?.split('@')[0]}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
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
