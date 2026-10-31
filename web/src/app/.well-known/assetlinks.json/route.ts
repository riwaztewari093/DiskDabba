export const runtime = "edge";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  let packageNames = ["com.diskdabba.player", "com.diskdabba.app"];
  let fingerprints = [
    // Standard debug keystore SHA-256 fingerprint placeholder
    "14:6D:E9:01:0F:B5:2F:AE:54:1E:EF:7B:97:F2:66:32:F8:07:42:9F:81:46:F8:86:14:57:9B:EE:7C:A2:AE:A6",
  ];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "app_config")
      .maybeSingle();

    if (data?.value?.sha256_cert_fingerprints && Array.isArray(data.value.sha256_cert_fingerprints)) {
      fingerprints = data.value.sha256_cert_fingerprints;
    }
    if (data?.value?.package_name) {
      packageNames = [data.value.package_name, ...packageNames.filter((p) => p !== data.value.package_name)];
    }
  } catch {
    // Fall back to defaults
  }

  const assetLinks = packageNames.map((pkg) => ({
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: pkg,
      sha256_cert_fingerprints: fingerprints,
    },
  }));

  return NextResponse.json(assetLinks, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
