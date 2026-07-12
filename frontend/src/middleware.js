import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/back')) {
    const userCookie = request.cookies.get('user');
    
    if (!userCookie) {
      const loginUrl = new URL('/login', request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const user = JSON.parse(userCookie.value);
      if (!user) {
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