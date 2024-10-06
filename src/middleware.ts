import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that require authentication (protected routes)
const protectedRoutes = ['/my-comodity', '/profile', '/add-product', '/edit-product'];

// Define guest-only routes (e.g., login, signup)
const guestRoutes = ['/login', '/register'];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Get the user's authentication token (assuming it's stored in a cookie)
    const token = req.cookies.get('auth-token'); // Adjust this based on your auth mechanism

    // Check if the current route is a protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Check if the current route is a guest-only route
    const isGuestRoute = guestRoutes.some(route => pathname.startsWith(route));

    // If the user is authenticated and tries to access a guest-only route (e.g., login), redirect them
    if (isGuestRoute && token) {
        const dashboardUrl = new URL('/', req.url); // Redirect to dashboard or any protected page
        return NextResponse.redirect(dashboardUrl);
    }

    // If the user is not authenticated and tries to access a protected route, redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // Allow the request to proceed for public routes or valid access
    return NextResponse.next();
}

// Define the matcher to apply the middleware only to specific routes
export const config = {
    matcher: ['/my-comodity/:path*', '/profile/:path*', '/login', '/register', '/add-product', '/edit-product'], // Include both protected and guest-only routes
};
