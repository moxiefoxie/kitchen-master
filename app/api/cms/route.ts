import { NextResponse } from "next/server";

const cmsUrl = process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL;

async function request(path: string) {
  if (!cmsUrl) return null;

  const response = await fetch(`${cmsUrl.replace(/\/$/, "")}${path}`, {
    headers: process.env.STRAPI_API_TOKEN
      ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
      : undefined,
    next: { revalidate: 60 },
  });

  if (!response.ok) throw new Error(`Strapi returned ${response.status}`);
  return response.json();
}

export async function GET() {
  if (!cmsUrl) return NextResponse.json({ configured: false });

  try {
    const content = await request("/api/kitchen-master-content");

    return NextResponse.json({
      configured: true,
      locations: content?.locations ?? [],
      settings: content?.settings ?? null,
    });
  } catch (error) {
    console.error("CMS request failed", error);
    return NextResponse.json({ configured: true, unavailable: true }, { status: 502 });
  }
}
