'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useRandomProfileImage } from '@/hooks/useRandomProfileImage';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const defaultProfileImage = useRandomProfileImage();

  return (
    <ProtectedRoute>
      <div className="max-w-xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24">
              <img
                src={user?.photoURL || defaultProfileImage}
                alt={user?.displayName || 'Profile'}
                className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {user?.displayName || user?.email?.split('@')[0] || 'User'}
              </h3>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
