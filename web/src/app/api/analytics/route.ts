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

    // 1. Fetch user's wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // 2. Fetch withdrawal requests to calculate pending/approved
    const { data: withdrawals } = await supabase
      .from("withdrawal_requests")
      .select("*")
      .eq("user_id", user.id);

    const pendingAmount =
      withdrawals
        ?.filter((w) => w.status === "pending")
        .reduce((sum, w) => sum + Number(w.amount_inr), 0) || 0;

    const paidAmount =
      withdrawals
        ?.filter((w) => w.status === "approved")
        .reduce((sum, w) => sum + Number(w.amount_inr), 0) || 0;

    // 3. Count total views from views_log
    const { count: totalViews } = await supabase
      .from("views_log")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", user.id);

    // 4. Count files
    const { count: totalFiles } = await supabase
      .from("files")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_trashed", false);

    const balanceInr = Number(wallet?.balance_inr ?? 0);
    const totalEarnedInr = Number(wallet?.total_earned_inr ?? 0);
    const cpmRateInr = Number(wallet?.cpm_rate_inr ?? 85.0);

    return NextResponse.json({
      success: true,
      wallet: {
        balanceInr,
        totalEarnedInr,
        paidInr: paidAmount,
        pendingInr: pendingAmount,
        availableInr: Math.max(0, balanceInr - pendingAmount),
        cpmRateInr,
        totalViews: totalViews ?? 0,
        totalFiles: totalFiles ?? 0,
        payoutStatus: "TEST_MODE_PAUSED", // Safe until real merchant gateway attached
      },
      withdrawals: withdrawals || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
