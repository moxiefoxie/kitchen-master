import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const webhookUrl = process.env.HIRING_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Applications are not configured yet. Please contact the restaurant directly." }, { status: 503 });
  }

  const form = await request.formData();
  const resume = form.get("resume");
  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json({ error: "Please attach a resume." }, { status: 400 });
  }
  if (resume.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Resume must be 10 MB or smaller." }, { status: 400 });
  }

  const response = await fetch(webhookUrl, { method: "POST", body: form });
  if (!response.ok) return NextResponse.json({ error: "Application could not be submitted." }, { status: 502 });
  return NextResponse.redirect(new URL(`/careers/${String(form.get("location"))}?submitted=1`, request.url), 303);
}
