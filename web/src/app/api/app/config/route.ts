export const runtime = "edge";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch system settings from Supabase if configured
    const { data: settings } = await supabase
      .from("system_settings")
      .select("key, value");

    const settingsMap: Record<string, any> = {};
    settings?.forEach((item) => {
      settingsMap[item.key] = item.value;
    });

    const appConfig = settingsMap["app_config"] || {
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
    };

    return NextResponse.json({
      status: "online",
      serverTime: new Date().toISOString(),
      config: appConfig,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({
      status: "online",
      serverTime: new Date().toISOString(),
      config: {
        app_name: "DiskDabba Player",
        package_name: "com.diskdabba.player",
        latest_version_code: 1,
        latest_version_name: "1.0.0",
        min_supported_version_code: 1,
        maintenance_mode: false,
        enable_streaming: true,
        enable_downloads: true,
      },
      warning: message,
    });
  }
}
