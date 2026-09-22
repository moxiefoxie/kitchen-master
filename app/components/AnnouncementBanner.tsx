"use client";

import { useEffect, useState } from "react";

export type AnnouncementHappening = {
  slug: string;
  title: string;
  eyebrow?: string;
  summary?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  dismissalKey?: string;
};

export default function AnnouncementBanner({ item, locationSlug, visible = true }: { item?: AnnouncementHappening | null; locationSlug: string; visible?: boolean }) {
  const [dismissed, setDismissed] = useState(true);
  const key = item ? `km-announcement-${item.dismissalKey || item.slug}` : "";

  useEffect(() => {
    setDismissed(!item || window.localStorage.getItem(key) === "dismissed");
  }, [item, key]);

  if (!item || dismissed) return null;
  const rawHref = item.buttonUrl || "/pages/happenings";
  const href = rawHref.startsWith("/") && !rawHref.includes("location=")
    ? `${rawHref}${rawHref.includes("?") ? "&" : "?"}location=${encodeURIComponent(locationSlug)}`
    : rawHref;

  return <aside className={`announcement-banner${visible ? "" : " announcement-banner-hidden"}`} aria-label="Current Kitchen Master announcement">
    <div>
      {item.eyebrow && <small>{item.eyebrow}</small>}
      <strong>{item.title}</strong>
      {item.summary && <span>{item.summary}</span>}
    </div>
    <a href={href}>{item.buttonLabel || "See details"} <span aria-hidden="true">→</span></a>
    <button type="button" aria-label="Dismiss announcement" onClick={() => { window.localStorage.setItem(key, "dismissed"); setDismissed(true); }}>×</button>
  </aside>;
}
