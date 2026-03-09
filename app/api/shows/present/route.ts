import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("active_present")
            .select("*")
            .eq("id", 1)
            .single();

        if (error || !data) {
            return NextResponse.json({ present: null });
        }

        return NextResponse.json({ present: data });
    } catch (error) {
        console.error("Error fetching manual present:", error);
        return NextResponse.json({ present: null });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { showId, showName, slidesData } = body;

        if (!slidesData || !Array.isArray(slidesData) || slidesData.length === 0) {
            return NextResponse.json(
                { error: "slidesData is required and must be a non-empty array" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("active_present")
            .upsert({
                id: 1,
                show_id: showId || null,
                slides_data: slidesData,
                show_name: showName || "Manual Present",
                started_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error("Error setting manual present:", error);
            return NextResponse.json(
                { error: "Failed to set manual present" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, present: data });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const { error } = await supabase
            .from("active_present")
            .delete()
            .eq("id", 1);

        if (error) {
            console.error("Error clearing manual present:", error);
            return NextResponse.json(
                { error: "Failed to clear manual present" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
