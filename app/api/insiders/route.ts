import { NextResponse } from "next/server";
import { marketingEmailConfigured, sendTransactionalEmail, subscribeMarketingContact, subscriberKey, transactionalEmailConfigured } from "@/lib/email";
import { insidersWelcomeEmail } from "@/lib/emailTemplates";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookUrl = process.env.INSIDERS_WEBHOOK_URL;
  if (!marketingEmailConfigured() && !webhookUrl) {
    return NextResponse.json({ error: "Insiders signup is not configured yet." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as { email?: string; preferredLocation?: string } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  const preferredLocation = body?.preferredLocation?.trim().toLowerCase() ?? "";
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(preferredLocation)) {
    return NextResponse.json({ error: "Please choose a valid preferred restaurant." }, { status: 400 });
  }

  if (marketingEmailConfigured()) {
    const signup = await subscribeMarketingContact(email, preferredLocation);
    if (!signup.ok) return NextResponse.json({ error: "Signup could not be completed." }, { status: 502 });

    if (signup.created && transactionalEmailConfigured()) {
      const welcome = insidersWelcomeEmail(preferredLocation);
      // Enrollment is complete even if this optional welcome message is delayed
      // or rejected; the contact remains available for the next Broadcast.
      await sendTransactionalEmail({
        to: email,
        ...welcome,
        tags: [
          { name:"source", value:"website" },
          { name:"email", value:"insiders-welcome" },
          { name:"location", value:preferredLocation },
        ],
        idempotencyKey: subscriberKey(email),
      });
    }
  } else if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, preferredLocation, source: "website-popup" }),
    }).catch(() => null);
    if (!response?.ok) return NextResponse.json({ error: "Signup could not be completed." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
