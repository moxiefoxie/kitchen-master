"use client";

import Link from "next/link";
import { useState } from "react";

type HeaderLocation = {
  name: string;
  slug: string;
  orderUrl?: string;
  reservationUrl?: string;
};

export default function SiteHeader({ location }: { location: HeaderLocation }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const home = `/?location=${encodeURIComponent(location.slug)}`;
  const contextualPage = (slug: string) => `/pages/${slug}?location=${encodeURIComponent(location.slug)}`;

  return <header className="site-header interior-header header-visible header-scrolled">
    <Link className="brand" href={home} aria-label="Kitchen Master home">
      <span className="brand-mark">KM</span>
      <span>KITCHEN MASTER</span>
    </Link>
    <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main navigation">
      <Link href={`${home}#menu`} onClick={() => setMenuOpen(false)}>Menu</Link>
      <Link href={`${home}#drinks`} onClick={() => setMenuOpen(false)}>Drinks</Link>
      {location.reservationUrl && <a href={location.reservationUrl} target={location.reservationUrl.startsWith("http") ? "_blank" : undefined} rel={location.reservationUrl.startsWith("http") ? "noreferrer" : undefined} onClick={() => setMenuOpen(false)}>Reserve</a>}
      <Link href={`${home}#locations`} onClick={() => setMenuOpen(false)}>Locations</Link>
      <Link href={contextualPage("private-dining")} onClick={() => setMenuOpen(false)}>Private Dining</Link>
      <Link href={contextualPage("contact")} onClick={() => setMenuOpen(false)}>Contact</Link>
      <Link href={`/careers/${location.slug}`} onClick={() => setMenuOpen(false)}>Careers</Link>
    </nav>
    <div className="header-actions interior-header-actions">
      <Link className="interior-location" href={`${home}#locations`}><span>Location</span><strong>{location.name}</strong></Link>
      {location.orderUrl && <a className="header-cta" href={location.orderUrl} target="_blank" rel="noreferrer">Order online</a>}
    </div>
    <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle menu">{menuOpen ? "×" : "☰"}</button>
  </header>;
}
