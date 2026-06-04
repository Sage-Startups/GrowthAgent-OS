import { NextResponse } from "next/server"
import { testOpenClawConnection } from "@/app/actions/agent-config"

export async function POST() {
  const result = await testOpenClawConnection()
  if ("error" in result) return NextResponse.json(result, { status: 400 })
  return NextResponse.json(result)
}
