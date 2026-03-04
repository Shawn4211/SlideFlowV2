import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Routes that require authentication
const protectedPaths = ["/dashboard", "/editor"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only check protected paths
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
    if (!isProtected) {
        return NextResponse.next();
    }

    // Check for Supabase auth token in cookies
    // Supabase stores session tokens in cookies with the project ref
    const cookies = request.cookies;
    let hasSession = false;

    // Look for any Supabase auth cookie (sb-<ref>-auth-token)
    for (const [name] of cookies) {
        if (name.startsWith("sb-") && name.includes("-auth-token")) {
            hasSession = true;
            break;
        }
    }

    // If no cookie found, also check for the access token in the Authorization header
    // (for API-style access)
    if (!hasSession) {
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            hasSession = true;
        }
    }

    if (!hasSession) {
        // Redirect to login
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/editor/:path*"],
};
