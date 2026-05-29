import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/app/actions/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await signUp(body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
