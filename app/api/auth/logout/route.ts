import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * POST /api/auth/logout
 *
 * Server-side logout handler. This route exists because Next.js rewrites do NOT
 * reliably forward Set-Cookie headers from the backend to the browser. If we
 * call the backend logout endpoint directly through the rewrite proxy, the
 * accessToken cookie is never cleared in the browser, causing the middleware to
 * keep treating the user as authenticated and redirecting /login → /dashboard.
 *
 * This route:
 * 1. Forwards the logout request to the backend (to invalidate the server session)
 * 2. Explicitly expires the auth cookies in the response headers using both
 *    cookieStore.delete() AND manual Set-Cookie headers with Max-Age=0 to
 *    cover all possible path/domain combinations the backend may have used.
 */
export async function POST() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  // Forward the logout to the backend to invalidate the server-side session.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    try {
      const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ')
      await fetch(`${apiUrl}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
      })
    } catch {
      // Backend call failed — still clear cookies locally
    }
  }

  // Build response first, then set expiry headers on it directly.
  // We use both cookieStore.delete() AND manual response headers to cover
  // all path/domain combinations the backend may have used when setting cookies.
  const response = NextResponse.json({ success: true })

  const authCookieNames = ['accessToken', 'refreshToken']
  for (const name of authCookieNames) {
    // Method 1: next/headers delete (works when path/domain match exactly)
    cookieStore.delete(name)

    // Method 2: Manually append Set-Cookie headers with Max-Age=0 for common
    // path/domain combinations to ensure the browser clears the cookie
    // regardless of what attributes the backend used when setting it.
    const expireOptions = [
      // path=/ no domain (most common for same-origin cookies)
      `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
      // path=/ with Secure flag (for HTTPS environments)
      `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure`,
    ]
    for (const cookieStr of expireOptions) {
      response.headers.append('Set-Cookie', cookieStr)
    }
  }

  return response
}
