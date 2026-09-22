"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AnnouncementBanner, { type AnnouncementHappening } from "./AnnouncementBanner";
import HeaderNav from "./HeaderNav";
import { contentAppliesToLocation } from "../restaurantScope";

type HeaderLocation = {
  name: string;
  slug: string;
  orderUrl?: string;
  reservationUrl?: string;
};

export default function SiteHeader({ location }: { location: HeaderLocation }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<AnnouncementHappening | null>(null);
  const home = `/?location=${encodeURIComponent(location.slug)}`;

  useEffect(() => {
    fetch("/api/cms")
      .then((response) => response.json())
      .then((payload) => {
        const now = Date.now();
        const match = (Array.isArray(payload.happenings) ? payload.happenings : [])
          .filter((item: Record<string, unknown>) => item.enabled !== false && item.showInBanner === true)
          .filter((item: Record<string, unknown>) => !item.endsAt || new Date(String(item.endsAt)).getTime() >= now)
          .filter((item: Record<string, unknown>) => contentAppliesToLocation(
            item.restaurantScope ? String(item.restaurantScope) : undefined,
            Array.isArray(item.locations) ? item.locations.map((assigned: Record<string, unknown>) => String(assigned.slug)) : undefined,
            location.slug,
          ))
          .sort((a: Record<string, unknown>, b: Record<string, unknown>) => Number(b.priority ?? 0) - Number(a.priority ?? 0))[0];
        setAnnouncement(match ? {
          slug: String(match.slug), title: String(match.title), eyebrow: match.eyebrow ? String(match.eyebrow) : undefined,
          summary: match.summary ? String(match.summary) : undefined, buttonLabel: match.buttonLabel ? String(match.buttonLabel) : undefined,
          buttonUrl: match.buttonUrl ? String(match.buttonUrl) : undefined, dismissalKey: match.dismissalKey ? String(match.dismissalKey) : undefined,
        } : null);
      })
      .catch(() => setAnnouncement(null));
  }, [location.slug]);

  return <><header className="site-header interior-header header-visible header-scrolled">
    <Link className="brand" href={home} aria-label="Kitchen Master home">
      <span className="brand-mark">KM</span>
      <span>KITCHEN MASTER</span>
    </Link>
    <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main navigation">
      <HeaderNav locationSlug={location.slug} hasReservations={Boolean(location.reservationUrl)} onNavigate={() => setMenuOpen(false)} />
    </nav>
    <div className="header-actions interior-header-actions">
      <Link className="interior-location" href={`${home}#locations`}><span>Location</span><strong>{location.name}</strong></Link>
      {location.orderUrl && <a className="header-cta" href={location.orderUrl} target="_blank" rel="noreferrer">Order online</a>}
    </div>
    <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle menu">{menuOpen ? "×" : "☰"}</button>
  </header><AnnouncementBanner item={announcement} locationSlug={location.slug} /></>;
}
