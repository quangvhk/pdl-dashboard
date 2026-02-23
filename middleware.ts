import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
// Note: /invitations/accept is public — invitation acceptance can be done without auth
const PUBLIC_ROUTES = ['/', '/login', '/register', '/invitations/accept']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // V2: Auth uses httpOnly cookies managed by the backend.
  // The backend sets an `auth-status` cookie (non-httpOnly) that the frontend
  // can read to determine if the user has an active session, without exposing
  // the actual access/refresh tokens.
  const hasAuthStatus = request.cookies.has('auth-status')

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    // Redirect authenticated users away from login/register to dashboard
    if (hasAuthStatus && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Protect all other routes — redirect unauthenticated users to /login
  if (!hasAuthStatus) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static files, API routes, and Next.js internals
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
}
