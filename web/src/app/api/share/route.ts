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

    const { data: shares, error } = await supabase
      .from("shares")
      .select("*, files(id, name, size, mime_type, created_at)")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ shares: shares || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fileId, permission = "view", expiresInDays } = body;

    if (!fileId) {
      return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
    }

    // Verify user owns the file
    const { data: file, error: fileError } = await supabase
      .from("files")
      .select("id, name")
      .eq("id", fileId)
      .eq("user_id", user.id)
      .single();

    if (fileError || !file) {
      return NextResponse.json(
        { error: "File not found or permission denied" },
        { status: 404 }
      );
    }

    // Calculate expiration if provided
    let expiresAt: string | null = null;
    if (expiresInDays && Number(expiresInDays) > 0) {
      const exp = new Date();
      exp.setDate(exp.getDate() + Number(expiresInDays));
      expiresAt = exp.toISOString();
    }

    // Unique random token
    const token = crypto.randomUUID().replace(/-/g, "").substring(0, 16);

    const { data: share, error: shareError } = await supabase
      .from("shares")
      .insert({
        file_id: fileId,
        created_by: user.id,
        token,
        permission: permission === "download" ? "download" : "view",
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (shareError) {
      return NextResponse.json({ error: shareError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      share,
      shareUrl: `/app/${token}`,
    });
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
    const shareId = searchParams.get("id");

    if (!shareId) {
      return NextResponse.json({ error: "Missing share id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("shares")
      .delete()
      .eq("id", shareId)
      .eq("created_by", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
