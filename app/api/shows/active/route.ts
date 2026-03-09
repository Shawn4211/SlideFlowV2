import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const now = new Date().toISOString();

        const { data: manualPresent } = await supabase
            .from("active_present")
            .select("*")
            .eq("id", 1)
            .single();

        const { data: activeShows } = await supabase
            .from("show")
            .select("*, content(*)")
            .lte("start_time", now)
            .gte("finish_time", now)
            .order("start_time", { ascending: true })
            .limit(1);

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
