import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/back')) {
    const adminCookie = request.cookies.get('admin');
    
    if (!adminCookie) {
      const loginUrl = new URL('/login', request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const admin = JSON.parse(adminCookie.value);
      if (!admin || admin.role !== 'admin') {
        const loginUrl = new URL('/login', request.nextUrl.origin);
        return NextResponse.redirect(loginUrl);
      }
    } catch (e) {
      const loginUrl = new URL('/login', request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/back/:path*'],
};