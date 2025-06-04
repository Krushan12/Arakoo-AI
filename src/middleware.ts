import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/signin', '/auth/signup'];
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile'];

  // Get the Firebase auth session token from cookies
  const session = request.cookies.get('__session')?.value || request.cookies.get('firebase-auth')?.value;

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Handle protected routes
  if (protectedRoutes.includes(pathname)) {
    // If no session, redirect to sign in
    if (!session) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/auth/') && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/* (API routes)
     * 2. /_next/* (Next.js internals)
     * 3. /_static/* (static files)
     * 4. /_vercel/* (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml|.*\\.(?:jpg|jpeg|gif|png|svg|ico)).*)',
  ],
};
