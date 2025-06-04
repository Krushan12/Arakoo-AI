'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  signInWithEmailAndPassword, 
  AuthError as FirebaseAuthError
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthError {
  message: string;
  code?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setUser(user);
        setLoading(false);
        setError(null);

        if (user) {
          // Get the ID token and set it as a cookie
          const token = await user.getIdToken();
          document.cookie = `firebase-auth=${token}; path=/`;
        } else {
          // Clear the cookie when signed out
          document.cookie = 'firebase-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      },
      (error: FirebaseAuthError) => {
        console.error('Auth state change error:', error);
        setError({
          message: error.message || 'Failed to check authentication status',
          code: error.code
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (callbackUrl?: string) => {
    try {
      setError(null);
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push(callbackUrl || '/profile');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      const authError = error as FirebaseAuthError;
      setError({
        message: authError.message || 'Failed to sign in with Google',
        code: authError.code
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string, callbackUrl?: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push(callbackUrl || '/profile');
    } catch (error) {
      console.error('Error signing in with email:', error);
      const authError = error as FirebaseAuthError;
      setError({
        message: authError.message || 'Failed to sign in with email',
        code: authError.code
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      const authError = error as FirebaseAuthError;
      setError({
        message: authError.message || 'Failed to sign out',
        code: authError.code
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signInWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
