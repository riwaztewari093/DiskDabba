export const runtime = "edge";

import { NextResponse } from "next/server";

export async function GET() {
  const directApkUrl =
    "https://github.com/riwaztewari093/DiskDabba/releases/latest/download/DiskDabba-Player.apk";

  return NextResponse.redirect(directApkUrl, {
    status: 302,
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}
