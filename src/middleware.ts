import { NextRequest, NextResponse } from 'next/server'

const siteURL = process.env.NEXT_PUBLIC_SITE_URL

export function middleware(req: NextRequest) {
  const { cookies } = req
  const token = cookies.get('token')?.value.replaceAll('"', '')
  if (!token) {
    return NextResponse.redirect(`${siteURL}`)
  }
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard',
    '/products/:path*',
    '/users/:path*',
  ],
}