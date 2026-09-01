import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const webhookUrl = process.env.INSIDERS_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Insiders signup is not configured yet." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as { email?: string; preferredLocation?: string } | null;
  if (!body?.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: body.email, preferredLocation: body.preferredLocation, source: "website-popup" }),
  });
  if (!response.ok) return NextResponse.json({ error: "Signup could not be completed." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
