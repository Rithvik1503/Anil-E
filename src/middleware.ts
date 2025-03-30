import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Temporarily disabled authentication
  return NextResponse.next()

  // Original code commented out for now
  /*
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const { data: { session } } = await supabase.auth.getSession()

    // If user is not signed in and trying to access admin routes
    if (!session && req.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // If user is signed in and trying to access login page
    if (session && req.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/login', req.url))
  }
  */
}

export const config = {
  matcher: ['/admin/:path*', '/login']
} 