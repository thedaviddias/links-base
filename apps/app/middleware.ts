import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { checkInitialSetup } from '@/features/setup/utils/initialization'

export function middleware(request: NextRequest) {
  // Skip setup check for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const isSetup = checkInitialSetup()

  // If not setup and not already on admin page, redirect to admin
  if (!isSetup) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)'
  ]
}
