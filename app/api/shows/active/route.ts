import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// GET /api/shows/active — returns the currently active show and the next upcoming show
export async function GET() {
    try {
        const now = new Date().toISOString();

        // Check for a manual present first
        const { data: manualPresent } = await supabase
            .from("active_present")
            .select("*")
            .eq("id", 1)
            .single();

        // Currently active show: start_time <= now AND finish_time >= now
        const { data: activeShows } = await supabase
            .from("show")
            .select("*, content(*)")
            .lte("start_time", now)
            .gte("finish_time", now)
            .order("start_time", { ascending: true })
            .limit(1);

        // Upcoming shows: start_time > now, ordered by soonest first
        const { data: upcomingShows } = await supabase
            .from("show")
            .select("*, content(*)")
            .gt("start_time", now)
            .order("start_time", { ascending: true });

        return NextResponse.json({
            currentShow: activeShows?.[0] ?? null,
            nextShow: upcomingShows?.[0] ?? null,
            upcomingShows: upcomingShows ?? [],
            manualPresent: manualPresent ?? null,
        });
    } catch (error) {
        console.error("Error fetching active shows:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
