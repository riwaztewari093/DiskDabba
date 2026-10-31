import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateCostEstimate } from "@/lib/cost-protection/calculator";
import { getStorageClient } from "@/lib/storage/s3-client";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify Admin privilege
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: "Forbidden: Administrator access required" },
        { status: 403 }
      );
    }

    // Aggregate storage metrics
    const { data: profiles } = await supabase
      .from("profiles")
      .select("storage_used");

    const totalStorageBytes =
      profiles?.reduce((acc, p) => acc + (p.storage_used || 0), 0) ?? 0;

    // Aggregate monthly bandwidth
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: logs } = await supabase
      .from("bandwidth_logs")
      .select("bytes_served")
      .gte("created_at", thirtyDaysAgo);

    const monthlyBandwidthBytes =
      logs?.reduce((acc, l) => acc + (l.bytes_served || 0), 0) ?? 0;

    // Total registered users
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Total files
    const { count: totalFiles } = await supabase
      .from("files")
      .select("*", { count: "exact", head: true })
      .eq("is_trashed", false);

    // Calculate real-time cost projection vs ₹300 budget
    const costEstimate = calculateCostEstimate(
      totalStorageBytes,
      monthlyBandwidthBytes
    );

    const { isMock, bucket } = getStorageClient();

    return NextResponse.json({
      totalUsers: totalUsers ?? 0,
      totalFiles: totalFiles ?? 0,
      storageProvider: isMock ? "MOCK_SIMULATOR" : "BACKBLAZE_B2",
      bucket,
      costEstimate,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
