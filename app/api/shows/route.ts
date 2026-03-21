import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const contentId = searchParams.get("contentId");
        const scheduled = searchParams.get("scheduled");
        const showId = searchParams.get("id");

        if (showId) {
            const { data, error } = await supabase
                .from("show")
                .select("*, content(*)")
                .eq("id", showId)
                .single();

            if (error) return NextResponse.json({ show: null });
            return NextResponse.json({ show: data });
        }

        if (contentId) {
            const { data, error } = await supabase
                .from("show")
                .select("*, content(*)")
                .eq("content_id", contentId)
                .order("updated_at", { ascending: false })
                .limit(1)
                .single();

            if (error) return NextResponse.json({ show: null });
            return NextResponse.json({ show: data });
        }

        let query = supabase
            .from("show")
            .select("*, content(*)")
            .order("start_time", { ascending: true, nullsFirst: false });

        if (scheduled === "true") {
            query = query.not("start_time", "is", null);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching shows:", error);
            return NextResponse.json({ error: "Failed to fetch shows" }, { status: 500 });
        }

        return NextResponse.json({ shows: data || [] });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, contentId, name, slidesData, startTime, finishTime, deviceId, locationId, clientId } = body;

        let validContentId = null;
        let generatedSlidesData = slidesData;
        
        if (contentId && !isNaN(parseInt(contentId, 10))) {
            const parsedId = parseInt(contentId, 10);
            const { data: contentCheck } = await supabase
                .from("content")
                .select("*")
                .eq("id", parsedId)
                .single();

            if (contentCheck) {
                validContentId = parsedId;
                
                // Auto-generate slides_data if missing so Display page works properly
                if (!slidesData || slidesData.length === 0) {
                    const isVideo = contentCheck.type === "video";
                    generatedSlidesData = [
                        {
                            id: `auto-${Date.now()}`,
                            name: contentCheck.name,
                            duration: isVideo ? 30 : 15,
                            backgroundColor: "#000000",
                            elements: [
                                {
                                    id: `elem-${Date.now()}`,
                                    type: isVideo ? "video" : "image",
                                    src: contentCheck.file_url,
                                    x: 0,
                                    y: 0,
                                    width: 960,
                                    height: 540,
                                    style: {}
                                }
                            ]
                        }
                    ];
                }
            }
        }

        if (id) {
            const updateData: any = { updated_at: new Date().toISOString() };
            if (name !== undefined) updateData.name = name;
            
            // If we generated fallback slides data, override it. Otherwise update if provided.
            if (generatedSlidesData !== undefined) {
                updateData.slides_data = generatedSlidesData;
            } else if (slidesData !== undefined) {
                updateData.slides_data = slidesData;
            }
            
            if (startTime !== undefined) updateData.start_time = startTime;
            if (finishTime !== undefined) updateData.finish_time = finishTime;
            if (deviceId !== undefined) updateData.device_id = deviceId;
            if (locationId !== undefined) updateData.location_id = locationId;
            if (clientId !== undefined) updateData.client_id = clientId;
            if (validContentId !== null) updateData.content_id = validContentId;

            const { data, error } = await supabase
                .from("show")
                .update(updateData)
                .eq("id", id)
                .select("*, content(*)")
                .single();

            if (error) {
                console.error("Error updating show:", error);
                return NextResponse.json({ error: error.message || "Failed to update show" }, { status: 500 });
            }

            return NextResponse.json({ success: true, show: data });
        } else {
            const insertData: any = {
                name: name || "Untitled",
                slides_data: generatedSlidesData || [],
            };

            if (validContentId !== null) insertData.content_id = validContentId;
            if (startTime) insertData.start_time = startTime;
            if (finishTime) insertData.finish_time = finishTime;
            if (deviceId) insertData.device_id = deviceId;
            if (locationId) insertData.location_id = locationId;
            if (clientId) insertData.client_id = clientId;

            const { data, error } = await supabase
                .from("show")
                .insert(insertData)
                .select("*, content(*)")
                .single();

            if (error) {
                console.error("Error creating show:", error);
                return NextResponse.json({ error: error.message || "Failed to create show" }, { status: 500 });
            }

            return NextResponse.json({ success: true, show: data });
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Show id is required" }, { status: 400 });
        }

        const { error } = await supabase.from("show").delete().eq("id", id);

        if (error) {
            console.error("Error deleting show:", error);
            return NextResponse.json({ error: "Failed to delete show" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
