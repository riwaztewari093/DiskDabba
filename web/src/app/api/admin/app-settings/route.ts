export const runtime = "edge";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { data } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "app_config")
      .maybeSingle();

    const config = data?.value || {
      app_name: "DiskDabba Player",
      package_name: "com.diskdabba.player",
      latest_version_code: 1,
      latest_version_name: "1.0.0",
      min_supported_version_code: 1,
      min_supported_version_name: "1.0.0",
      maintenance_mode: false,
      maintenance_message: "DiskDabba Player is currently undergoing scheduled maintenance. Please check back shortly.",
      app_update_url: "https://diskdabba.com/download/app",
      enable_streaming: true,
      enable_downloads: true,
      app_links_active: true,
      sha256_cert_fingerprints: [
        "14:6D:E9:01:0F:B5:2F:AE:54:1E:EF:7B:97:F2:66:32:F8:07:42:9F:81:46:F8:86:14:57:9B:EE:7C:A2:AE:A6"
      ]
    };

    return NextResponse.json({ config });
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();

    const { error } = await supabase
      .from("system_settings")
      .upsert({
        key: "app_config",
        value: body,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: body });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
