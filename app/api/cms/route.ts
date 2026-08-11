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

function absoluteMedia<T>(media: T): T {
  if (!cmsUrl || !media) return media;
  if (Array.isArray(media)) return media.map(absoluteMedia) as T;
  if (typeof media === "object" && "url" in media) {
    const item = media as Record<string, unknown>;
    if (typeof item.url === "string" && item.url.startsWith("/")) {
      return { ...item, url: `${cmsUrl.replace(/\/$/, "")}${item.url}` } as T;
    }
  }
  if (typeof media === "object") {
    return Object.fromEntries(Object.entries(media as Record<string, unknown>).map(([key, value]) => [key, absoluteMedia(value)])) as T;
  }
  return media;
}

export async function GET(incomingRequest: Request) {
  if (!cmsUrl) return NextResponse.json({ configured: false });

  try {
    const preview = new URL(incomingRequest.url).searchParams.get("preview") === "1";
    const previewQuery = preview && process.env.STRAPI_PREVIEW_SECRET
      ? `?preview=1&previewSecret=${encodeURIComponent(process.env.STRAPI_PREVIEW_SECRET)}`
      : "";
    const content = await request(`/api/kitchen-master-content${previewQuery}`);

    const locations = (content?.locations ?? []).map((location: Record<string, unknown>) => ({
      ...location,
      heroImage: absoluteMedia(location.heroImage),
      gallery: absoluteMedia(location.gallery),
    }));
    const pages = (content?.pages ?? []).map((page: Record<string, unknown>) => absoluteMedia(page));

    return NextResponse.json({
      configured: true,
      locations,
      settings: content?.settings ?? null,
      menuCategories: content?.menuCategories ?? [],
      pages,
      homepageSections: absoluteMedia(content?.homepageSections ?? []),
      preview: content?.preview ?? false,
    });
  } catch (error) {
    console.error("CMS request failed", error);
    return NextResponse.json({ configured: true, unavailable: true }, { status: 502 });
  }
}
