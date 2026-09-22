"use client";

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
  const handleNavigate = () => {
    onNavigate?.();
  };

  return <>
    <div className="nav-dropdown">
      <div className="nav-dropdown-trigger"><a className="nav-parent" href={`${homeTarget}#full-menu`} onClick={handleNavigate}>Menus</a><span aria-hidden="true">⌄</span></div>
      <div className="nav-popover">
        <a href={`${homeTarget}#full-menu`} onClick={handleNavigate}>Food</a>
        <a href={`${homeTarget}#drinks`} onClick={handleNavigate}>Drinks</a>
        <a href={`${homeTarget}#happy-hour`} onClick={handleNavigate}>Happy Hour</a>
      </div>
    </div>
    {hasReservations && <a href={`${homeTarget}#reservations`} onClick={handleNavigate}>Reserve</a>}
    <div className="nav-dropdown">
      <div className="nav-dropdown-trigger"><a className="nav-parent" href={page("happenings")} onClick={handleNavigate}>Happenings</a><span aria-hidden="true">⌄</span></div>
      <div className="nav-popover">
        <a href={page("happenings")} onClick={handleNavigate}>Events</a>
        <a href={page("specials")} onClick={handleNavigate}>Specials</a>
      </div>
    </div>
    <a href={`${homeTarget}#locations`} onClick={handleNavigate}>Locations</a>
    <div className="nav-dropdown nav-dropdown-right">
      <div className="nav-dropdown-trigger"><a className="nav-parent" href={`${homeTarget}#contact`} onClick={handleNavigate}>Contact Us</a><span aria-hidden="true">⌄</span></div>
      <div className="nav-popover">
        <a href={page("private-dining")} onClick={handleNavigate}>Private Dining</a>
        <a href={page("franchise")} onClick={handleNavigate}>Franchising</a>
        <a href={page("contact")} onClick={handleNavigate}>Contact</a>
        <a href={`/careers/${location}`} onClick={handleNavigate}>Careers</a>
      </div>
    </div>
  </>;
}
