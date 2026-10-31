export const runtime = "edge";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const { amount, paymentMethod = "UPI", paymentAddress } = body;
    const amountNum = Number(amount);

    if (!amountNum || amountNum < 100) {
      return NextResponse.json(
        { error: "Minimum withdrawal amount is ₹100." },
        { status: 400 }
      );
    }

    if (!paymentAddress || paymentAddress.trim().length < 3) {
      return NextResponse.json(
        { error: "Valid UPI ID or bank account details are required." },
        { status: 400 }
      );
    }

    // 1. Check user wallet balance
    const { data: wallet } = await supabase
      .from("wallets")
      .select("balance_inr")
      .eq("user_id", user.id)
      .maybeSingle();

    const currentBalance = Number(wallet?.balance_inr ?? 0);
    if (currentBalance < amountNum) {
      return NextResponse.json(
        {
          error: `Insufficient balance. Available: ₹${currentBalance.toFixed(2)}, Requested: ₹${amountNum.toFixed(2)}`,
        },
        { status: 400 }
      );
    }

    // 2. Insert withdrawal request with "sandbox_paused" status to prevent premature automated payouts
    const { data: withdrawal, error } = await supabase
      .from("withdrawal_requests")
      .insert({
        user_id: user.id,
        amount_inr: amountNum,
        payment_method: paymentMethod,
        payment_address: paymentAddress.trim(),
        status: "sandbox_paused",
        rejection_reason:
          "Payout gateway is currently in verified test mode. Direct payouts remain paused until production payment provider verification is completed.",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      withdrawal,
      message:
        "Withdrawal request recorded. Payout processing is paused in test mode until genuine payment gateway provider is configured.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
