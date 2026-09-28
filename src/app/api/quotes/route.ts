import { NextRequest, NextResponse } from "next/server";
import { nextId, saveQuote } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const quote = await saveQuote({
    id: nextId("QT"),
    kind: body.kind,
    createdAt: new Date().toISOString(),
    payload: body.payload ?? {},
  });
  return NextResponse.json({ quote });
}
