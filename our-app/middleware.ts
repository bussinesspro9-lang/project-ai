import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/signup', '/oauth/callback'];

const protectedPrefixes = [
  '/dashboard',
  '/create',
  '/content',
  '/calendar',
  '/analytics',
  '/settings',
  '/profile',
  '/pricing',
  '/checkout',
  '/referrals',
  '/inbox',
  '/platforms',
  '/achievements',
  '/content-plans',
  '/templates',
];

function isProtectedRoute(pathname: string): boolean {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value;

  if (!token && isProtectedRoute(pathname)) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && pathname === '/login') {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
