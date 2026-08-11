"use client";

import { useEffect, useState } from "react";
import { DRINK_CATEGORIES, MENU_CATEGORIES } from "./menuData";

const RESY_URL = "https://resy.com/cities/suwanee-ga/venues/kitchen-master";

type SiteSettings = {
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
  contactEmail: string;
  instagramUrl: string;
  facebookUrl: string;
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroEyebrow: "Taiwanese craft · Japanese precision",
  heroTitle: "Tradition,",
  heroAccent: "mastered.",
  heroDescription: "Soup dumplings, fresh sushi, and bold modern plates—crafted daily in {{location}}.",
  contactEmail: "Management@kitchenmasterga.com",
  instagramUrl: "https://www.instagram.com/kitchenmasterga/",
  facebookUrl: "https://www.facebook.com/kitchenmasterga/",
};

type RestaurantLocation = {
  id: string;
  name: string;
  state: string;
  address: string;
  city: string;
  phone: string;
  lat: number;
  lng: number;
  status: "open" | "coming-soon";
  hours: string;
  orderUrl: string;
  reservationUrl?: string;
  contactEmail?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroAccent?: string;
  heroDescription?: string;
  heroImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
};

const DEFAULT_LOCATIONS: RestaurantLocation[] = [
  {
    id: "suwanee", name: "Suwanee", state: "Georgia", address: "3131 Lawrenceville-Suwanee Rd, Ste B5",
    city: "Suwanee, GA 30024", phone: "470-589-1112", lat: 34.0236, lng: -84.0519, status: "open",
    hours: "Tue–Fri 4:30–10 · Sat 11–10 · Sun 12–9:30",
    orderUrl: "https://order.toasttab.com/online/kitchen-master-bistro-2-3131-lawrenceville-suwanee-rd-b5",
  },
  {
    id: "frisco", name: "Frisco", state: "Texas", address: "9285 Preston Rd",
    city: "Frisco, TX 75033", phone: "469-362-8001", lat: 33.1548354, lng: -96.8039115, status: "open",
    hours: "Mon–Thu 11–2:30, 4:30–9 · Fri–Sat until 9:30",
    orderUrl: "https://order.toasttab.com/online/kitchen-master-bistro-9285-preston-rd",
  },
  {
    id: "southlake", name: "Southlake", state: "Texas", address: "3311 E State Hwy 114",
    city: "Southlake, TX 76092", phone: "214-724-5600", lat: 32.9369978, lng: -97.1029086, status: "open",
    hours: "Tue–Thu 11–9 · Fri–Sat 11–10",
    orderUrl: "https://order.toasttab.com/online/kitchen-master-bistro-southlake-3311-w-state-hwy-114",
  },
  {
    id: "midtown", name: "Midtown Atlanta", state: "Georgia", address: "Address to be announced",
    city: "Atlanta, GA", phone: "Coming soon", lat: 33.7838, lng: -84.3831, status: "coming-soon",
    hours: "Opening details coming soon", orderUrl: "",
  },
];

const menuCards = [
  { title: "Soup Dumplings", eyebrow: "The signature", image: "/images/soup-dumplings.png" },
  { title: "Modern Plates", eyebrow: "From the wok", image: "/images/lamb-chop.png" },
  { title: "Small Plates", eyebrow: "Made to share", image: "/images/szechuan-wonton.png" },
];

function distanceInMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radius = 3958.8;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [locationState, setLocationState] = useState<"idle" | "loading" | "found" | "denied">("idle");
  const [miles, setMiles] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState("suwanee");
  const [locations, setLocations] = useState<RestaurantLocation[]>(DEFAULT_LOCATIONS);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [foodCategories, setFoodCategories] = useState(MENU_CATEGORIES);
  const [drinkCategories, setDrinkCategories] = useState(DRINK_CATEGORIES);
  const [locationChosen, setLocationChosen] = useState(false);
  const [activeMenuCategory, setActiveMenuCategory] = useState(MENU_CATEGORIES[0].name);
  const [activeDrinkCategory, setActiveDrinkCategory] = useState(DRINK_CATEGORIES[0].name);
  const selectedLocation = locations.find((location) => location.id === selectedId) ?? locations[0];
  const availableFoodCategories = foodCategories.filter((category) => !category.locationSlugs?.length || category.locationSlugs.includes(selectedId));
  const availableDrinkCategories = drinkCategories.filter((category) => !category.locationSlugs?.length || category.locationSlugs.includes(selectedId));

  useEffect(() => {
    const requestedLocation = new URLSearchParams(window.location.search).get("location");
    const savedLocation = window.localStorage.getItem("kitchen-master-location");
    if (requestedLocation || savedLocation) {
      setSelectedId(requestedLocation || savedLocation || "suwanee");
      setLocationChosen(true);
    }
  }, []);

  useEffect(() => {
    if (availableFoodCategories.length && !availableFoodCategories.some((category) => category.name === activeMenuCategory)) {
      setActiveMenuCategory(availableFoodCategories[0].name);
    }
    if (availableDrinkCategories.length && !availableDrinkCategories.some((category) => category.name === activeDrinkCategory)) {
      setActiveDrinkCategory(availableDrinkCategories[0].name);
    }
  }, [selectedId, foodCategories, drinkCategories]);

  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get("preview") === "1";
    fetch(preview ? "/api/cms?preview=1" : "/api/cms")
      .then((response) => response.json())
      .then((payload) => {
        if (Array.isArray(payload.locations) && payload.locations.length > 0) {
          const cmsLocations: RestaurantLocation[] = payload.locations.map((location: Record<string, unknown>) => ({
          id: String(location.slug),
          name: String(location.name),
          state: String(location.state),
          address: String(location.address),
          city: String(location.city),
          phone: String(location.phone ?? ""),
          lat: Number(location.latitude),
          lng: Number(location.longitude),
          status: location.locationStatus === "coming-soon" ? "coming-soon" : "open",
          hours: String(location.hours ?? ""),
          orderUrl: String(location.orderUrl ?? ""),
          reservationUrl: String(location.reservationUrl ?? ""),
          contactEmail: String(location.contactEmail ?? ""),
          heroEyebrow: location.heroEyebrow ? String(location.heroEyebrow) : undefined,
          heroTitle: location.heroTitle ? String(location.heroTitle) : undefined,
          heroAccent: location.heroAccent ? String(location.heroAccent) : undefined,
          heroDescription: location.heroDescription ? String(location.heroDescription) : undefined,
          heroImageUrl: location.heroImage && typeof location.heroImage === "object" && "url" in location.heroImage
            ? String((location.heroImage as { url: unknown }).url)
            : undefined,
          seoTitle: location.seoTitle ? String(location.seoTitle) : undefined,
          seoDescription: location.seoDescription ? String(location.seoDescription) : undefined,
          }));
          setLocations(cmsLocations);
          setSelectedId((current) => cmsLocations.some((location) => location.id === current) ? current : cmsLocations[0].id);
        }

        if (payload.settings) {
          setSiteSettings({
            heroEyebrow: String(payload.settings.heroEyebrow ?? DEFAULT_SITE_SETTINGS.heroEyebrow),
            heroTitle: String(payload.settings.heroTitle ?? DEFAULT_SITE_SETTINGS.heroTitle),
            heroAccent: String(payload.settings.heroAccent ?? DEFAULT_SITE_SETTINGS.heroAccent),
            heroDescription: String(payload.settings.heroDescription ?? DEFAULT_SITE_SETTINGS.heroDescription),
            contactEmail: String(payload.settings.contactEmail ?? DEFAULT_SITE_SETTINGS.contactEmail),
            instagramUrl: String(payload.settings.instagramUrl ?? DEFAULT_SITE_SETTINGS.instagramUrl),
            facebookUrl: String(payload.settings.facebookUrl ?? DEFAULT_SITE_SETTINGS.facebookUrl),
          });
        }

        if (Array.isArray(payload.menuCategories) && payload.menuCategories.length > 0) {
          const normalizeCategories = (menuType: "food" | "drink") => payload.menuCategories
            .filter((category: Record<string, unknown>) => category.menuType === menuType)
            .map((category: Record<string, unknown>) => ({
              name: String(category.name),
              note: category.note ? String(category.note) : undefined,
              locationSlugs: Array.isArray(category.locations)
                ? category.locations.map((location: Record<string, unknown>) => String(location.slug))
                : undefined,
              items: Array.isArray(category.items) ? category.items.map((item: Record<string, unknown>) => ({
                name: String(item.name),
                price: String(item.price),
                description: item.description ? String(item.description) : undefined,
                tags: Array.isArray(item.tags) ? item.tags.map(String) : undefined,
              })) : [],
            }));
          const cmsFood = normalizeCategories("food");
          const cmsDrinks = normalizeCategories("drink");
          if (cmsFood.length > 0) {
            setFoodCategories(cmsFood);
            setActiveMenuCategory((current) => cmsFood.some((category: { name: string }) => category.name === current) ? current : cmsFood[0].name);
          }
          if (cmsDrinks.length > 0) {
            setDrinkCategories(cmsDrinks);
            setActiveDrinkCategory((current) => cmsDrinks.some((category: { name: string }) => category.name === current) ? current : cmsDrinks[0].name);
          }
        }
      })
      .catch(() => undefined);
  }, []);

  function showLocation(id: string) {
    setSelectedId(id);
    setMiles(null);
    setLocationState("idle");
    window.setTimeout(() => document.getElementById("locations")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  function findNearest() {
    if (!navigator.geolocation) {
      setLocationState("denied");
      return;
    }
    setLocationState("loading");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = locations.filter((location) => location.status === "open")
          .map((location) => ({ location, miles: distanceInMiles(coords.latitude, coords.longitude, location.lat, location.lng) }))
          .sort((a, b) => a.miles - b.miles)[0];
        setSelectedId(nearest.location.id);
        window.localStorage.setItem("kitchen-master-location", nearest.location.id);
        setLocationChosen(true);
        setMiles(nearest.miles);
        setLocationState("found");
      },
      () => setLocationState("denied"),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }

  return (
    <main>
      {!locationChosen && (
        <section className="location-gateway" aria-labelledby="location-gateway-title">
          <div className="gateway-brand"><span className="brand-mark">KM</span><span>KITCHEN MASTER</span></div>
          <div className="gateway-copy">
            <p className="kicker">WELCOME TO KITCHEN MASTER</p>
            <h1 id="location-gateway-title">Choose your<br /><em>location.</em></h1>
            <p>Menus, reservations, hours, and restaurant details are tailored to your selected Kitchen Master.</p>
          </div>
          <div className="gateway-locations">
            {locations.map((location) => (
              <button key={location.id} onClick={() => {
                setSelectedId(location.id);
                window.localStorage.setItem("kitchen-master-location", location.id);
                setLocationChosen(true);
              }}>
                <small>{location.state}</small><strong>{location.name}</strong>
                <span>{location.status === "open" ? "Enter location →" : "Coming soon"}</span>
              </button>
            ))}
          </div>
          <button className="gateway-nearest" onClick={findNearest} disabled={locationState === "loading"}>
            {locationState === "loading" ? "Finding your nearest restaurant…" : "Use my current location"}
          </button>
        </section>
      )}
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Kitchen Master home">
          <span className="brand-mark">KM</span>
          <span>KITCHEN MASTER</span>
        </a>
        <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main navigation">
          <a href="#menu" onClick={() => setMenuOpen(false)}>Menu</a>
          <a href="#drinks" onClick={() => setMenuOpen(false)}>Drinks</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our Story</a>
          <a href="#locations" onClick={() => setMenuOpen(false)}>Locations</a>
          <a href="#events" onClick={() => setMenuOpen(false)}>Private Dining</a>
        </nav>
        <div className="header-actions">
          <label className="location-select">
            <span>Location</span>
            <select value={selectedId} onChange={(event) => { setSelectedId(event.target.value); window.localStorage.setItem("kitchen-master-location", event.target.value); setLocationChosen(true); setMiles(null); setLocationState("idle"); }} aria-label="Choose restaurant location">
              {locations.map((location) => <option value={location.id} key={location.id}>{location.name}{location.status === "coming-soon" ? " — Soon" : ""}</option>)}
            </select>
          </label>
          {selectedLocation.status === "open" ? <a className="header-cta" href={selectedLocation.orderUrl} target="_blank" rel="noreferrer">Order online</a> : <a className="header-cta" href="#locations">Coming soon</a>}
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">{menuOpen ? "×" : "☰"}</button>
      </header>

      <section className="hero" id="top" style={selectedLocation.heroImageUrl ? { backgroundImage: `url(${selectedLocation.heroImageUrl})` } : undefined}>
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="kicker">{selectedLocation.heroEyebrow || siteSettings.heroEyebrow}</p>
          <h1>{selectedLocation.heroTitle || siteSettings.heroTitle}<br /><em>{selectedLocation.heroAccent || siteSettings.heroAccent}</em></h1>
          <p className="hero-sub">{(selectedLocation.heroDescription || siteSettings.heroDescription).replace("{{location}}", selectedLocation.name)}</p>
          <div className="hero-actions">
            <a className="button button-red" href="#menu">Explore the menu <span>↗</span></a>
            {selectedLocation.reservationUrl || selectedLocation.id === "suwanee" ? <a className="text-link" href={selectedLocation.reservationUrl || RESY_URL} target="_blank" rel="noreferrer">Book on Resy <span>→</span></a> : selectedLocation.status === "open" ? <a className="text-link" href={selectedLocation.orderUrl} target="_blank" rel="noreferrer">Order in {selectedLocation.name} <span>→</span></a> : <a className="text-link" href="#locations">Opening soon <span>↓</span></a>}
          </div>
        </div>
        <div className="hero-stamp"><span>小籠包</span><small>HANDCRAFTED<br />IN {selectedLocation.name.toUpperCase()}</small></div>
        <a className="scroll-note" href="#story">SCROLL TO DISCOVER <span>↓</span></a>
      </section>

      <section className="location-bar" id="locations">
        <div className="location-title"><span className="pin">⌖</span><div><small>{locationState === "found" ? "YOUR NEAREST KITCHEN MASTER" : "FIND YOUR KITCHEN MASTER"}</small><strong>{selectedLocation.name}</strong></div></div>
        <div className="location-detail"><span>{selectedLocation.address}<br />{selectedLocation.city}</span><span className="open"><i /> {selectedLocation.status === "open" ? selectedLocation.hours : "Coming soon"}</span></div>
        <div className="location-actions">
          {locationState === "found" && miles !== null && <span className="distance">About {miles < 10 ? miles.toFixed(1) : Math.round(miles)} miles away</span>}
          {locationState === "denied" && <span className="distance">Location unavailable — choose a restaurant below</span>}
          <button onClick={findNearest} disabled={locationState === "loading"}>{locationState === "loading" ? "Locating…" : "Use my location"}</button>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(`${selectedLocation.address}, ${selectedLocation.city}`)}`} target="_blank" rel="noreferrer">Get directions ↗</a>
          {(selectedLocation.reservationUrl || selectedLocation.id === "suwanee") && <a className="location-book" href={selectedLocation.reservationUrl || RESY_URL} target="_blank" rel="noreferrer">Book on Resy ↗</a>}
        </div>
      </section>

      <section className="location-switcher" aria-label="Choose a Kitchen Master location">
        <div className="switcher-intro"><span>OUR LOCATIONS</span><p>Choose your restaurant</p></div>
        <div className="switcher-list">
          {locations.map((location, index) => (
            <button className={selectedId === location.id ? "active" : ""} onClick={() => { setSelectedId(location.id); window.localStorage.setItem("kitchen-master-location", location.id); setLocationChosen(true); setMiles(null); setLocationState("idle"); }} key={location.id}>
              <small>0{index + 1} · {location.state}</small>
              <strong>{location.name}</strong>
              <span>{location.status === "open" ? "View location →" : "Coming soon"}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="story" id="story">
        <div className="story-label"><span>01</span><p>OUR PHILOSOPHY</p></div>
        <div className="story-copy">
          <p className="brush">匠</p>
          <h2>Old-world technique.<br /><em>New-world spirit.</em></h2>
          <p>At Kitchen Master, Taiwanese and Japanese traditions meet a modern American point of view. Every fold, slice, and sizzle reflects our dedication to craft, flavor, and ingredients prepared fresh each day.</p>
          <a className="under-link" href="#menu">OUR STORY <span>→</span></a>
        </div>
        <div className="story-image"><img src="/images/dining.png" alt="Kitchen Master dining room" /><span className="vertical-copy">CRAFTED WITH INTENTION</span></div>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-head">
          <div><p className="kicker dark">WHAT WE’RE KNOWN FOR</p><h2>Made with patience.<br /><em>Remembered by flavor.</em></h2></div>
          <a className="under-link" href="#full-menu">VIEW FULL MENU <span>↓</span></a>
        </div>
        <div className="menu-grid">
          {menuCards.map((card, index) => (
            <a className="menu-card" href="https://www.kitchenmasterga.com/main-menu" target="_blank" rel="noreferrer" key={card.title}>
              <div className="card-image"><img src={card.image} alt={card.title} /><span>0{index + 1}</span></div>
              <p>{card.eyebrow}</p><h3>{card.title}</h3><b>DISCOVER <span>→</span></b>
            </a>
          ))}
        </div>
      </section>

      <section className="full-menu" id="full-menu">
        <div className="full-menu-head"><div><p className="kicker">SUWANEE DINNER MENU</p><h2>The full menu.</h2></div><p>Handcrafted daily. Menu availability and pricing may change. Please tell your server about any allergies before ordering.</p></div>
        <div className="menu-tabs" role="tablist" aria-label="Menu categories">
          {availableFoodCategories.map((category) => <button role="tab" aria-selected={activeMenuCategory === category.name} className={activeMenuCategory === category.name ? "active" : ""} onClick={() => setActiveMenuCategory(category.name)} key={category.name}>{category.name}</button>)}
        </div>
        {availableFoodCategories.filter((category) => category.name === activeMenuCategory).map((category) => (
          <div className="menu-panel" role="tabpanel" key={category.name}>
            <div className="menu-panel-title"><span>菜單</span><div><h3>{category.name}</h3>{category.note && <p>{category.note}</p>}</div></div>
            <div className="menu-items">
              {category.items.map((item) => <article className="menu-item" key={item.name}>
                <div className="menu-item-title"><h4>{item.name}</h4><span>{item.price}</span></div>
                {item.description && <p>{item.description}</p>}
                {item.tags && <div className="menu-tags">{item.tags.map((tag) => <small key={tag}>{tag}</small>)}</div>}
              </article>)}
            </div>
          </div>
        ))}
        <div className="menu-disclaimer"><span>V · Vegetarian</span><span>Raw · May be served raw or undercooked</span><span>Parties of six or more are subject to 20% gratuity</span></div>
      </section>

      <section className="full-menu drinks-menu" id="drinks">
        <div className="full-menu-head"><div><p className="kicker">FROM THE BAR</p><h2>Pour something<br /><em>memorable.</em></h2></div><p>House cocktails inspired by Asian flavors, a considered wine and sake list, and thoughtful zero-proof drinks.</p></div>
        <div className="menu-tabs" role="tablist" aria-label="Drink categories">
          {availableDrinkCategories.map((category) => <button role="tab" aria-selected={activeDrinkCategory === category.name} className={activeDrinkCategory === category.name ? "active" : ""} onClick={() => setActiveDrinkCategory(category.name)} key={category.name}>{category.name}</button>)}
        </div>
        {availableDrinkCategories.filter((category) => category.name === activeDrinkCategory).map((category) => (
          <div className="menu-panel" role="tabpanel" key={category.name}>
            <div className="menu-panel-title"><span>乾杯</span><div><h3>{category.name}</h3>{category.note && <p>{category.note}</p>}</div></div>
            <div className="menu-items">
              {category.items.map((item) => <article className="menu-item" key={item.name}><div className="menu-item-title"><h4>{item.name}</h4><span>{item.price}</span></div>{item.description && <p>{item.description}</p>}</article>)}
            </div>
          </div>
        ))}
        <div className="menu-disclaimer"><span>Must be 21+ with valid identification</span><span>Selections and vintages may change</span><span>Please enjoy responsibly</span></div>
      </section>

      <section className="feature">
        <div className="feature-image"><img src="/images/spread.jpg" alt="A spread of Kitchen Master dishes" /></div>
        <div className="feature-copy"><p className="kicker">DINNER, DONE DIFFERENTLY</p><h2>A table worth<br /><em>gathering around.</em></h2><p>From a quick dinner to a long celebration, every meal is made to be shared.</p><div><a className="button button-light" href={RESY_URL} target="_blank" rel="noreferrer">Book on Resy <span>↗</span></a><a className="text-link" href="https://order.toasttab.com/online/kitchen-master-bistro-2-3131-lawrenceville-suwanee-rd-b5" target="_blank" rel="noreferrer">Order pickup <span>→</span></a></div></div>
      </section>

      <section className="events" id="events">
        <div className="events-copy"><p className="kicker dark">PRIVATE DINING</p><h2>Your occasion.<br /><em>Our craft.</em></h2><p>Host an intimate dinner or a full celebration in a space designed for memorable meals. Our team will help shape the room and menu around your event.</p><a className="button button-dark" href="https://www.kitchenmasterga.com/private-rooms" target="_blank" rel="noreferrer">Plan your event <span>↗</span></a></div>
        <div className="events-image"><img src="/images/private-room.png" alt="Private dining room at Kitchen Master" /><span>PRIVATE ROOMS · CUSTOM MENUS · PERSONAL SERVICE</span></div>
      </section>

      <section className="connect" id="contact">
        <div className="connect-intro"><p className="kicker dark">MORE FROM KITCHEN MASTER</p><h2>Come be part<br />of the story.</h2></div>
        <div className="connect-links">
          <a href={`mailto:${siteSettings.contactEmail}`}><span>01</span><div><small>Questions & feedback</small><strong>Contact us</strong></div><b>↗</b></a>
          <a href="https://www.kitchenmasterga.com/careers" target="_blank" rel="noreferrer"><span>02</span><div><small>Join our team</small><strong>Careers</strong></div><b>↗</b></a>
          <a href={`mailto:${siteSettings.contactEmail}?subject=Kitchen%20Master%20Franchise%20Opportunity`}><span>03</span><div><small>Grow with us</small><strong>Franchise opportunities</strong></div><b>↗</b></a>
          <a href="https://www.kitchenmasterga.com/private-rooms" target="_blank" rel="noreferrer"><span>04</span><div><small>Gather together</small><strong>Private dining</strong></div><b>↗</b></a>
        </div>
      </section>

      <footer>
        <div className="footer-top"><div className="footer-brand"><span className="brand-mark">KM</span><h2>KITCHEN<br />MASTER</h2><p>Tradition meets innovation.</p></div><div className="footer-locations"><small>GEORGIA</small><button onClick={() => showLocation("suwanee")}>Suwanee <span>→</span></button><button onClick={() => showLocation("midtown")}>Midtown Atlanta <em>Coming soon</em></button></div><div className="footer-locations"><small>TEXAS</small><button onClick={() => showLocation("frisco")}>Frisco <span>→</span></button><button onClick={() => showLocation("southlake")}>Southlake <span>→</span></button></div><div><small>FOLLOW</small><a href={siteSettings.instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a><a href={siteSettings.facebookUrl} target="_blank" rel="noreferrer">Facebook ↗</a></div></div>
        <div className="footer-bottom"><span>© 2026 Kitchen Master</span><span>{siteSettings.contactEmail}</span><span>Suwanee, Georgia</span></div>
      </footer>
    </main>
  );
}
