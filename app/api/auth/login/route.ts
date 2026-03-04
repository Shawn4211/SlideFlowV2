import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// POST /api/auth/login — Authenticate with username and password
export async function POST(request: NextRequest) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: 'Request body must be valid JSON. Example: { "username": "Admin", "password": "Password1" }' },
            { status: 400 }
        );
    }

    const { username, password } = body;

    // Validate input
    if (!username || !password) {
        return NextResponse.json(
            { error: "Username and password are required" },
            { status: 400 }
        );
    }

    // Admin user accounts
    const adminAccounts: Record<string, string> = {
        "Admin": "admin@slideflow.app",
        "Admin2": "admin2@slideflow.app",
        "Admin3": "admin3@slideflow.app",
        "Admin4": "admin4@slideflow.app",
        "Admin5": "admin5@slideflow.app",
        "Admin6": "admin6@slideflow.app",
    };

    const email = adminAccounts[username];
    if (!email) {
        return NextResponse.json(
            { error: "Invalid username or password" },
            { status: 401 }
        );
    }

    try {
        // Authenticate via Supabase Auth
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: data.user.id,
                username,
                name: `${username} User`,
            },
            session: {
                access_token: data.session?.access_token ? "Token received" : null,
                expires_at: data.session?.expires_at,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
