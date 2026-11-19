import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets, favicon, Next.js internals, and public videos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/videos') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  // 2. Read session token from HttpOnly cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(sessionCookie);

  // 3. Admin Route Protection (/admin & /api/admin/*)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!session || session.role !== 'ADMIN') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: Platform Arbiter administrative privileges required.' },
          { status: 403 }
        );
      }
      const signinUrl = new URL('/signin', request.url);
      signinUrl.searchParams.set('redirect', pathname);
      signinUrl.searchParams.set('error', 'admin_required');
      return NextResponse.redirect(signinUrl);
    }
  }

  // 4. Mutating Escrow Payment API (/api/payments) - strictly requires authenticated session
  if (pathname === '/api/payments' && request.method === 'POST') {
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Escrow settlements require an active authenticated session.' },
        { status: 401 }
      );
    }
  }

  // 5. Injected Session Header for Downstream Route Handlers
  const response = NextResponse.next();
  if (session) {
    response.headers.set('x-user-id', session.userId);
    response.headers.set('x-user-role', session.role);
    response.headers.set('x-user-email', session.email);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
