import { NextResponse } from "next/server";
import { STRAPI_URL } from "@/lib/strapi";

type InquiryType = "contact" | "private-dining" | "franchise";
type CmsLocation = { name?: unknown; slug?: unknown; contactEmail?: unknown; privateDiningEmail?: unknown };
type CmsContent = { locations?: CmsLocation[]; settings?: { contactEmail?: unknown; franchiseEmail?: unknown } };

const FIELD_LIMITS: Record<string, number> = {
  name: 200,
  email: 320,
  phone: 100,
  subject: 200,
  message: 5000,
  eventDate: 40,
  partySize: 20,
  eventType: 200,
  targetMarket: 300,
  experience: 300,
  investmentRange: 200,
};

const TYPE_FIELDS: Record<InquiryType, string[]> = {
  contact: ["name", "email", "phone", "subject", "message"],
  "private-dining": ["name", "email", "phone", "eventDate", "partySize", "eventType", "message"],
  franchise: ["name", "email", "phone", "targetMarket", "experience", "investmentRange", "message"],
};

function text(form: FormData, field: string) {
  const value = form.get(field);
  return typeof value === "string" ? value.trim().slice(0, FIELD_LIMITS[field] ?? 500) : "";
}

function email(value: unknown) {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return /^\S+@\S+\.\S+$/.test(normalized) ? normalized : null;
}

async function getCmsContent(): Promise<CmsContent | null> {
  const response = await fetch(`${STRAPI_URL}/api/kitchen-master-content`, { cache:"no-store" }).catch(() => null);
  if (!response?.ok) return null;
  return await response.json() as CmsContent;
}

export async function POST(request: Request) {
  const webhookUrl = process.env.INQUIRY_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error:"Website inquiries are not configured yet." }, { status:503 });
  }

  const form = await request.formData();
  const inquiryType = text(form, "inquiryType") as InquiryType;
  if (!(inquiryType in TYPE_FIELDS)) {
    return NextResponse.json({ error:"Please choose a valid inquiry type." }, { status:400 });
  }

  const values = Object.fromEntries(TYPE_FIELDS[inquiryType].map((field) => [field, text(form, field)]));
  if (!values.name || !email(values.email) || !values.message) {
    return NextResponse.json({ error:"Please complete every required field." }, { status:400 });
  }
  if (inquiryType === "private-dining" && (!values.phone || !values.eventDate || !values.partySize || !values.eventType)) {
    return NextResponse.json({ error:"Please complete every event field." }, { status:400 });
  }
  if (inquiryType === "franchise" && (!values.phone || !values.targetMarket || !values.experience || !values.investmentRange)) {
    return NextResponse.json({ error:"Please complete every franchise field." }, { status:400 });
  }
  if (inquiryType === "contact" && !values.subject) {
    return NextResponse.json({ error:"Please select a subject." }, { status:400 });
  }

  const content = await getCmsContent();
  if (!content) {
    return NextResponse.json({ error:"The requested team could not be reached." }, { status:503 });
  }

  const requestedSlug = text(form, "location");
  const location = content.locations?.find((entry) => entry.slug === requestedSlug);
  let recipient: string | null = null;
  let locationName = "";

  if (inquiryType === "franchise") {
    recipient = email(content.settings?.franchiseEmail) ?? email(content.settings?.contactEmail);
  } else {
    if (!location || typeof location.name !== "string" || typeof location.slug !== "string") {
      return NextResponse.json({ error:"Please choose a valid restaurant location." }, { status:400 });
    }
    locationName = location.name;
    recipient = inquiryType === "private-dining"
      ? email(location.privateDiningEmail) ?? email(location.contactEmail)
      : email(location.contactEmail);
  }

  if (!recipient) {
    return NextResponse.json({ error:"This inquiry recipient is not configured in Strapi." }, { status:503 });
  }

  const outbound = new FormData();
  outbound.set("inquiryType", inquiryType);
  outbound.set("source", "website-inquiry");
  outbound.set("recipientEmail", recipient);
  if (requestedSlug) outbound.set("location", requestedSlug);
  if (locationName) outbound.set("locationName", locationName);
  for (const [field, value] of Object.entries(values)) outbound.set(field, value);

  const response = await fetch(webhookUrl, { method:"POST", body:outbound }).catch(() => null);
  if (!response?.ok) {
    return NextResponse.json({ error:"Your inquiry could not be submitted." }, { status:502 });
  }

  const page = inquiryType === "private-dining" ? "private-dining" : inquiryType;
  const locationQuery = requestedSlug ? `&location=${encodeURIComponent(requestedSlug)}` : "";
  return NextResponse.redirect(new URL(`/pages/${page}?submitted=1${locationQuery}`, request.url), 303);
}
