import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('dl_token')?.value;
    const { pathname } = request.nextUrl;

    // Protected routes
    const protectedRoutes = ['/victim', '/rescuer'];
    const isProtected = protectedRoutes.some(r => pathname.startsWith(r));

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If already logged in and visiting login page, let them through (they may want to switch roles)
    return NextResponse.next();
}

export const config = {
    matcher: ['/victim/:path*', '/rescuer/:path*']
};
