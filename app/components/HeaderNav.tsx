"use client";

import type { MouseEvent, SyntheticEvent } from "react";

type HeaderNavProps = {
  locationSlug: string;
  hasReservations?: boolean;
  isHome?: boolean;
  onNavigate?: () => void;
};

export default function HeaderNav({ locationSlug, hasReservations = false, isHome = false, onNavigate }: HeaderNavProps) {
  const location = encodeURIComponent(locationSlug);
  const home = `/?location=${location}`;
  const homeTarget = isHome ? "" : home;
  const page = (slug: string) => `/pages/${slug}?location=${location}`;
  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.closest("details")?.removeAttribute("open");
    onNavigate?.();
  };
  const handleToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    const current = event.currentTarget;
    if (!current.open) return;
    current.parentElement?.querySelectorAll("details[open]").forEach((details) => {
      if (details !== current) details.removeAttribute("open");
    });
  };

  return <>
    <details className="nav-dropdown" onToggle={handleToggle}>
      <summary>Menus <span aria-hidden="true">⌄</span></summary>
      <div className="nav-popover">
        <a href={`${homeTarget}#full-menu`} onClick={handleNavigate}>Food</a>
        <a href={`${homeTarget}#drinks`} onClick={handleNavigate}>Drinks</a>
        <a href={`${homeTarget}#happy-hour`} onClick={handleNavigate}>Happy Hour</a>
      </div>
    </details>
    {hasReservations && <a href={`${homeTarget}#reservations`} onClick={handleNavigate}>Reserve</a>}
    <a href={page("happenings")} onClick={handleNavigate}>Happenings</a>
    <a href={`${homeTarget}#locations`} onClick={handleNavigate}>Locations</a>
    <details className="nav-dropdown nav-dropdown-right" onToggle={handleToggle}>
      <summary>Contact Us <span aria-hidden="true">⌄</span></summary>
      <div className="nav-popover">
        <a href={page("private-dining")} onClick={handleNavigate}>Private Dining</a>
        <a href={page("franchise")} onClick={handleNavigate}>Franchising</a>
        <a href={page("contact")} onClick={handleNavigate}>Contact</a>
        <a href={`/careers/${location}`} onClick={handleNavigate}>Careers</a>
      </div>
    </details>
  </>;
}
