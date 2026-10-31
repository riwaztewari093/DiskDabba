export const runtime = "edge";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") || "";

    let query = supabase
      .from("files")
      .select("*, shares(id, token, permission)")
      .eq("user_id", user.id)
      .eq("is_trashed", false)
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data: files, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ files: files || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("id");

    if (!fileId) {
      return NextResponse.json({ error: "Missing file id" }, { status: 400 });
    }

    // 1. Get file size before deleting
    const { data: file } = await supabase
      .from("files")
      .select("size")
      .eq("id", fileId)
      .eq("user_id", user.id)
      .single();

    // 2. Delete file row (cascades to shares)
    const { error } = await supabase
      .from("files")
      .delete()
      .eq("id", fileId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. Decrement user's storage_used
    if (file?.size) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("storage_used")
        .eq("id", user.id)
        .single();

      const newStorage = Math.max(0, (profile?.storage_used ?? 0) - file.size);
      await supabase
        .from("profiles")
        .update({ storage_used: newStorage })
        .eq("id", user.id);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fileId, name, visibility } = body;

    if (!fileId) {
      return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (name) updates.name = name;
    if (visibility && ["public", "unlisted", "private"].includes(visibility)) {
      updates.visibility = visibility;
    }

    const { data: file, error } = await supabase
      .from("files")
      .update(updates)
      .eq("id", fileId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, file });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
