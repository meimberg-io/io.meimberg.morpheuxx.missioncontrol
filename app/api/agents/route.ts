import { NextResponse } from "next/server";

import { getAgents } from "@/lib/agents";

export const dynamic = "force-dynamic";

export async function GET() {
  const agents = getAgents();
  return NextResponse.json({ agents });
}
