
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // DEFINITION OF ROUTES
    const url = request.nextUrl.clone()
    const path = url.pathname

    // Public Routes (Access without login)
    const isPublicRoute = path === '/login' || path === '/signup' || path === '/upload' || path.startsWith('/auth') || path.startsWith('/_next') || path.includes('.') // Static files

    // Protected Routes (Require login)
    // Basically everything else.

    // 1. If User is NOT logged in and tries to access a protected route -> Redirect to Login
    if (!user && !isPublicRoute) {
        console.log(`[Middleware] Unauthorized access to ${path}. Redirecting to /login`);
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 2. If User IS logged in and tries to access Login/Signup -> Redirect to Home
    if (user && (path === '/login' || path === '/signup')) {
        console.log(`[Middleware] User already logged in. Redirecting to /`);
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
