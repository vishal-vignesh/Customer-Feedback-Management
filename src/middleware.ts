// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const role = req.cookies.get("role")?.value;

//   if (req.nextUrl.pathname.startsWith("/admin")) {
//     if (role !== "ADMIN") {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }
// }


import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '../lib/jwt'

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // Public routes that should never block
  const PUBLIC_PATHS = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register', '/favicon.ico']
  const isPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
  if (isPublic) return NextResponse.next()

  if (pathname === '/users') {
    return NextResponse.redirect(new URL('/users/dashboard', req.url))
  }

  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/products', req.url))
  }


  const token = req.cookies.get('auth-token')?.value
  let role: string | undefined
  let userId: string | undefined

  if (token) {
    const payload = await verifyToken(token)
    if (payload) {
      role = payload.role
      userId = payload.userId
    }
  }

  // Not logged in → redirect to login
  if (!role || !userId) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('next', pathname + search)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/users/dashboard', req.url))
  }

  if (pathname.startsWith('/users') && role !== 'USER') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}