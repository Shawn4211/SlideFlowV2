import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get("folderId");

    let query = supabase
      .from("content")
      .select("*")
      .order("created_at", { ascending: false });

    if (folderId) {
      query = query.eq("folder_id", folderId);
    } else {
      query = query.is("folder_id", null);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching content:", error);
      return NextResponse.json(
        { error: "Failed to fetch content" },
        { status: 500 }
      );
    }

    return NextResponse.json({ assets: data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetId, folderId } = body;

    if (!assetId) {
      return NextResponse.json(
        { error: "assetId is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("content")
      .update({ folder_id: folderId || null })
      .eq("id", assetId)
      .select()
      .single();

    if (error) {
      console.error("Error moving asset:", error);
      return NextResponse.json(
        { error: "Failed to move asset" },
        { status: 500 }
      );
    }

    return NextResponse.json({ asset: data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Asset id is required" },
        { status: 400 }
      );
    }

    const { data: asset, error: fetchError } = await supabase
      .from("content")
      .select("file_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching asset:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch asset" },
        { status: 500 }
      );
    }

    const { error: deleteError } = await supabase
      .from("content")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting asset from database:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete asset" },
        { status: 500 }
      );
    }

    if (asset?.file_url) {
      const urlParts = asset.file_url.split("/");
      const filePath = urlParts.slice(urlParts.indexOf("content") + 1).join("/");

      if (filePath) {
        await supabase.storage.from("content").remove([filePath]);
      }
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
