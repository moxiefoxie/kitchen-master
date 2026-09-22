import { NextResponse } from "next/server";
import { getCareersLocation } from "@/lib/careers";

const MAX_RESUME_SIZE = 10 * 1024 * 1024;
const ALLOWED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];

function text(form: FormData, field: string, maximumLength: number) {
  const value = form.get(field);
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function isAllowedResume(resume: File) {
  const fileName = resume.name.toLowerCase();
  return ALLOWED_RESUME_EXTENSIONS.some((extension) => fileName.endsWith(extension));
}

export async function POST(request: Request) {
  const webhookUrl = process.env.HIRING_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Applications are not configured yet. Please contact the restaurant directly." }, { status: 503 });
  }

  const form = await request.formData();
  const locationSlug = text(form, "location", 100);
  const location = await getCareersLocation(locationSlug, true).catch(() => null);
  if (!location) {
    return NextResponse.json({ error: "Please choose a valid restaurant location." }, { status: 400 });
  }
  if (!location.hiringEmail) {
    return NextResponse.json({ error: `Applications for ${location.name} are not configured yet.` }, { status: 503 });
  }

  const name = text(form, "name", 200);
  const email = text(form, "email", 320);
  const phone = text(form, "phone", 100);
  const role = text(form, "role", 200);
  const message = text(form, "message", 5000);
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email) || !phone || !message || !location.hiringRoles.includes(role)) {
    return NextResponse.json({ error: "Please complete every application field." }, { status: 400 });
  }

  const resume = form.get("resume");
  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json({ error: "Please attach a resume." }, { status: 400 });
  }
  if (resume.size > MAX_RESUME_SIZE) {
    return NextResponse.json({ error: "Resume must be 10 MB or smaller." }, { status: 400 });
  }
  if (!isAllowedResume(resume)) {
    return NextResponse.json({ error: "Resume must be a PDF, DOC, or DOCX file." }, { status: 400 });
  }

  const outbound = new FormData();
  outbound.set("name", name);
  outbound.set("email", email);
  outbound.set("phone", phone);
  outbound.set("role", role);
  outbound.set("message", message);
  outbound.set("location", location.slug);
  outbound.set("locationName", location.name);
  outbound.set("hiringEmail", location.hiringEmail);
  outbound.set("source", "website-careers");
  outbound.set("resume", resume, resume.name);

  const response = await fetch(webhookUrl, { method: "POST", body: outbound }).catch(() => null);
  if (!response) return NextResponse.json({ error: "Application could not be submitted." }, { status: 502 });
  if (!response.ok) return NextResponse.json({ error: "Application could not be submitted." }, { status: 502 });
  return NextResponse.redirect(new URL(`/careers/${location.slug}?submitted=1`, request.url), 303);
}
