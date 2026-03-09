import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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

    if (!username || !password) {
        return NextResponse.json(
            { error: "Username and password are required" },
            { status: 400 }
        );
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Look up the user's email by username via the database function
        const { data: email, error: lookupError } = await supabase.rpc(
            "get_email_by_username",
            { lookup_username: username }
        );

        if (lookupError || !email) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }

        // Verify password via Supabase Auth
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

        // Fetch profile info from credentials table
        const { data: profile } = await supabase
            .from("credentials")
            .select("first_name, last_name")
            .eq("username", username)
            .single();

        const name = profile
            ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || username
            : username;

        return NextResponse.json({
            success: true,
            user: {
                id: data.user.id,
                username,
                name,
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
