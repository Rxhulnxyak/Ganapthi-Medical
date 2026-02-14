
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    console.log("[AuthCallback] Started");
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        try {
            const cookieStore = await cookies();
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        get(name: string) {
                            return cookieStore.get(name)?.value
                        },
                        set(name: string, value: string, options: CookieOptions) {
                            console.log(`[AuthCallback] Setting cookie: ${name}`);
                            cookieStore.set({ name, value, ...options })
                        },
                        remove(name: string, options: CookieOptions) {
                            console.log(`[AuthCallback] Removing cookie: ${name}`);
                            cookieStore.delete({ name, ...options })
                        },
                    },
                }
            );

            const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
                console.error("[AuthCallback] Session exchange error:", error);
                return NextResponse.redirect(`${origin}/auth/auth-code-error`);
            }

            if (authData?.user) {
                console.log(`[AuthCallback] Success. User ID: ${authData.user.id}`);

                // Fetch Role to determine redirect (Admin vs User)
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', authData.user.id)
                    .single();

                // If profile load fails, default to user to avoid stuck screen
                const role = profile?.role || 'user';
                console.log(`[AuthCallback] Role: ${role}`);

                if (role === 'admin') {
                    // Pass session to Admin App (3001) via hash
                    const session = authData.session;
                    if (session) {
                        const redirectUrl = new URL('http://localhost:3001/');
                        // Note: Using standard hash params for implicit auth transfer
                        redirectUrl.hash = `access_token=${session.access_token}&refresh_token=${session.refresh_token}&expires_in=${session.expires_in}&token_type=bearer&type=recovery`;
                        console.log("[AuthCallback] Redirecting to Admin 3001 with hash");
                        return NextResponse.redirect(redirectUrl);
                    } else {
                        console.log("[AuthCallback] Admin session missing, redirecting to 3001 login");
                        return NextResponse.redirect('http://localhost:3001/login');
                    }
                }

                return NextResponse.redirect(`${origin}${next}`);
            }
        } catch (err: any) {
            console.error("[AuthCallback] Unexpected error:", err);
            return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(err.message)}`);
        }
    }

    // No code
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`);
}
