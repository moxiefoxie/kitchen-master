"use client";

import { useEffect, useMemo, useState } from "react";
import { DRINK_CATEGORIES, HAPPY_HOUR_CATEGORIES, MENU_CATEGORIES } from "./menuData";
import AnnouncementBanner, { type AnnouncementHappening } from "./components/AnnouncementBanner";
import HeaderNav from "./components/HeaderNav";
import ResyEmbed from "./components/ResyEmbed";

type SiteSettings = {
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
  contactEmail: string;
  instagramUrl: string;
  facebookUrl: string;
};

type HomePageContent = {
  heroImageUrl?: string;
  gatewayEyebrow:string;gatewayTitle:string;gatewayAccent:string;gatewayDescription:string;
  reservationEyebrow:string;reservationTitle:string;reservationAccent:string;reservationDescription:string;
  storyEyebrow:string;storyTitle:string;storyAccent:string;storyBody:string;storyImageUrl?:string;
  menuIntroEyebrow:string;menuIntroTitle:string;menuIntroAccent:string;
  menuCard1Eyebrow:string;menuCard1Title:string;menuCard1ImageUrl?:string;
  menuCard2Eyebrow:string;menuCard2Title:string;menuCard2ImageUrl?:string;
  menuCard3Eyebrow:string;menuCard3Title:string;menuCard3ImageUrl?:string;
  foodMenuTitle:string;foodMenuDescription:string;foodMenuDisclaimer:string;
  drinkEyebrow:string;drinkTitle:string;drinkAccent:string;drinkDescription:string;drinkDisclaimer:string;
  happyHourEyebrow:string;happyHourTitle:string;happyHourAccent:string;happyHourDescription:string;happyHourDisclaimer:string;
  featureEyebrow:string;featureTitle:string;featureAccent:string;featureBody:string;featureImageUrl?:string;
  privateDiningEyebrow:string;privateDiningTitle:string;privateDiningAccent:string;privateDiningBody:string;privateDiningImageUrl?:string;privateDiningCaption:string;
  socialEyebrow:string;socialTitle:string;socialAccent:string;socialBody:string;
  locationsEyebrow:string;locationsTitle:string;locationsAccent:string;locationsBody:string;
  connectEyebrow:string;connectTitle:string;connectAccent:string;connectItems:Array<{eyebrow:string;title:string;url:string}>;footerTagline:string;footerCopyright:string;
};

type HomepageSection = Record<string, unknown> & {
  sectionKey?: string;
  location?: { slug?: string } | null;
};

const DEFAULT_HOME: HomePageContent = {
  gatewayEyebrow:"Welcome to Kitchen Master",gatewayTitle:"Choose your",gatewayAccent:"location.",gatewayDescription:"Menus, reservations, hours, and restaurant details are tailored to your selected Kitchen Master.",
  reservationEyebrow:"Reservations",reservationTitle:"Your table in",reservationAccent:"{{location}}.",reservationDescription:"Choose a date and party size here, then view live times and complete your reservation securely with our reservation partner.",
  storyEyebrow:"Our philosophy",storyTitle:"Old-world technique.",storyAccent:"New-world spirit.",storyBody:"At Kitchen Master, Taiwanese and Japanese traditions meet a modern American point of view. Every fold, slice, and sizzle reflects our dedication to craft, flavor, and ingredients prepared fresh each day.",storyImageUrl:"/images/dining.png",
  menuIntroEyebrow:"What we’re known for",menuIntroTitle:"Made with patience.",menuIntroAccent:"Remembered by flavor.",
  menuCard1Eyebrow:"The signature",menuCard1Title:"Soup Dumplings",menuCard1ImageUrl:"/images/soup-dumplings.png",menuCard2Eyebrow:"From the wok",menuCard2Title:"Modern Plates",menuCard2ImageUrl:"/images/lamb-chop.png",menuCard3Eyebrow:"Made to share",menuCard3Title:"Small Plates",menuCard3ImageUrl:"/images/szechuan-wonton.png",
  foodMenuTitle:"The full menu.",foodMenuDescription:"Handcrafted daily. Menu availability and pricing may change. Please tell your server about any allergies before ordering.",foodMenuDisclaimer:"V · Vegetarian|Raw · May be served raw or undercooked|Parties of six or more are subject to 20% gratuity",
  drinkEyebrow:"From the bar",drinkTitle:"Pour something",drinkAccent:"memorable.",drinkDescription:"House cocktails inspired by Asian flavors, a considered wine and sake list, and thoughtful zero-proof drinks.",drinkDisclaimer:"Must be 21+ with valid identification|Selections and vintages may change|Please enjoy responsibly",
  happyHourEyebrow:"A little earlier",happyHourTitle:"Happy hour.",happyHourAccent:"Well spent.",happyHourDescription:"Selected bites and pours at participating Kitchen Master restaurants. Times and availability vary by location.",happyHourDisclaimer:"Dine-in only|Participation, days, and times vary by location|Must be 21+ for alcoholic beverages",
  featureEyebrow:"Dinner, done differently",featureTitle:"A table worth",featureAccent:"gathering around.",featureBody:"From a quick dinner to a long celebration, every meal is made to be shared.",featureImageUrl:"/images/spread.jpg",
  privateDiningEyebrow:"Private dining",privateDiningTitle:"Your occasion.",privateDiningAccent:"Our craft.",privateDiningBody:"Host an intimate dinner or a full celebration in a space designed for memorable meals. Our team will help shape the room and menu around your event.",privateDiningImageUrl:"/images/private-room.png",privateDiningCaption:"Private rooms · Custom menus · Personal service",
  socialEyebrow:"From our guests",socialTitle:"Loved locally.",socialAccent:"Shared often.",socialBody:"See what guests are saying about Kitchen Master {{location}}, then follow along for new dishes and behind-the-scenes moments.",
  locationsEyebrow:"Our restaurants",locationsTitle:"Find your",locationsAccent:"Kitchen Master.",locationsBody:"Explore every Kitchen Master location and choose the restaurant you’d like to visit.",
  connectEyebrow:"More from Kitchen Master",connectTitle:"Come be part",connectAccent:"of the story.",connectItems:[{eyebrow:"Questions & feedback",title:"Contact us",url:"/pages/contact"},{eyebrow:"Join our team",title:"Careers",url:"/careers/{{location}}"},{eyebrow:"Grow with us",title:"Franchise opportunities",url:"/pages/franchise"},{eyebrow:"Gather together",title:"Private dining",url:"/pages/private-dining"}],footerTagline:"Tradition meets innovation.",footerCopyright:"© 2026 Kitchen Master",
};

function resolveHomepageSections(base: HomePageContent, sections: HomepageSection[], locationSlug: string) {
  const section = (key: string) => sections.find((item) => item.sectionKey === key && item.location?.slug === locationSlug)
    ?? sections.find((item) => item.sectionKey === key && !item.location);
  const value = (item: HomepageSection | undefined, key: string, fallback: string) => item?.[key] ? String(item[key]) : fallback;
  const image = (item: HomepageSection | undefined, fallback?: string) => item?.image && typeof item.image === "object" && "url" in item.image
    ? String((item.image as { url: unknown }).url)
    : fallback;
  const gateway=section("location-gateway"),reservations=section("reservations"),story=section("story"),featured=section("featured-menu"),food=section("food-menu"),drinks=section("drinks"),happyHour=section("happy-hour"),dining=section("dining-feature"),privateDining=section("private-dining"),social=section("social-proof"),locations=section("locations"),connect=section("connect"),footer=section("footer");
  const cards=Array.isArray(featured?.items)?featured.items as Record<string,unknown>[]:[];
  const cardImages=Array.isArray(featured?.images)?featured.images as {url?:unknown}[]:[];

  return {
    ...base,
    gatewayEyebrow:value(gateway,"eyebrow",base.gatewayEyebrow),gatewayTitle:value(gateway,"title",base.gatewayTitle),gatewayAccent:value(gateway,"accent",base.gatewayAccent),gatewayDescription:value(gateway,"body",base.gatewayDescription),
    reservationEyebrow:value(reservations,"eyebrow",base.reservationEyebrow),reservationTitle:value(reservations,"title",base.reservationTitle),reservationAccent:value(reservations,"accent",base.reservationAccent),reservationDescription:value(reservations,"body",base.reservationDescription),
    storyEyebrow:value(story,"eyebrow",base.storyEyebrow),storyTitle:value(story,"title",base.storyTitle),storyAccent:value(story,"accent",base.storyAccent),storyBody:value(story,"body",base.storyBody),storyImageUrl:image(story,base.storyImageUrl),
    menuIntroEyebrow:value(featured,"eyebrow",base.menuIntroEyebrow),menuIntroTitle:value(featured,"title",base.menuIntroTitle),menuIntroAccent:value(featured,"accent",base.menuIntroAccent),
    menuCard1Eyebrow:value(cards[0],"eyebrow",base.menuCard1Eyebrow),menuCard1Title:value(cards[0],"title",base.menuCard1Title),menuCard1ImageUrl:cardImages[0]?.url?String(cardImages[0].url):base.menuCard1ImageUrl,
    menuCard2Eyebrow:value(cards[1],"eyebrow",base.menuCard2Eyebrow),menuCard2Title:value(cards[1],"title",base.menuCard2Title),menuCard2ImageUrl:cardImages[1]?.url?String(cardImages[1].url):base.menuCard2ImageUrl,
    menuCard3Eyebrow:value(cards[2],"eyebrow",base.menuCard3Eyebrow),menuCard3Title:value(cards[2],"title",base.menuCard3Title),menuCard3ImageUrl:cardImages[2]?.url?String(cardImages[2].url):base.menuCard3ImageUrl,
    foodMenuTitle:value(food,"title",base.foodMenuTitle),foodMenuDescription:value(food,"body",base.foodMenuDescription),foodMenuDisclaimer:Array.isArray(food?.items)?food.items.map(String).join("|"):base.foodMenuDisclaimer,
    drinkEyebrow:value(drinks,"eyebrow",base.drinkEyebrow),drinkTitle:value(drinks,"title",base.drinkTitle),drinkAccent:value(drinks,"accent",base.drinkAccent),drinkDescription:value(drinks,"body",base.drinkDescription),drinkDisclaimer:Array.isArray(drinks?.items)?drinks.items.map(String).join("|"):base.drinkDisclaimer,
    happyHourEyebrow:value(happyHour,"eyebrow",base.happyHourEyebrow),happyHourTitle:value(happyHour,"title",base.happyHourTitle),happyHourAccent:value(happyHour,"accent",base.happyHourAccent),happyHourDescription:value(happyHour,"body",base.happyHourDescription),happyHourDisclaimer:Array.isArray(happyHour?.items)?happyHour.items.map(String).join("|"):base.happyHourDisclaimer,
    featureEyebrow:value(dining,"eyebrow",base.featureEyebrow),featureTitle:value(dining,"title",base.featureTitle),featureAccent:value(dining,"accent",base.featureAccent),featureBody:value(dining,"body",base.featureBody),featureImageUrl:image(dining,base.featureImageUrl),
    privateDiningEyebrow:value(privateDining,"eyebrow",base.privateDiningEyebrow),privateDiningTitle:value(privateDining,"title",base.privateDiningTitle),privateDiningAccent:value(privateDining,"accent",base.privateDiningAccent),privateDiningBody:value(privateDining,"body",base.privateDiningBody),privateDiningImageUrl:image(privateDining,base.privateDiningImageUrl),privateDiningCaption:value(privateDining,"caption",base.privateDiningCaption),
    socialEyebrow:value(social,"eyebrow",base.socialEyebrow),socialTitle:value(social,"title",base.socialTitle),socialAccent:value(social,"accent",base.socialAccent),socialBody:value(social,"body",base.socialBody),
    locationsEyebrow:value(locations,"eyebrow",base.locationsEyebrow),locationsTitle:value(locations,"title",base.locationsTitle),locationsAccent:value(locations,"accent",base.locationsAccent),locationsBody:value(locations,"body",base.locationsBody),
    connectEyebrow:value(connect,"eyebrow",base.connectEyebrow),connectTitle:value(connect,"title",base.connectTitle),connectAccent:value(connect,"accent",base.connectAccent),connectItems:Array.isArray(connect?.items) ? (connect.items as Record<string,unknown>[]).map((item) => ({eyebrow:String(item.eyebrow ?? ""),title:String(item.title ?? ""),url:String(item.url ?? "#")})) : base.connectItems,footerTagline:value(footer,"title",base.footerTagline),footerCopyright:value(footer,"caption",base.footerCopyright),
  };
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroEyebrow: "Taiwanese craft · Japanese precision",
  heroTitle: "Tradition,",
  heroAccent: "mastered.",
  heroDescription: "Soup dumplings, fresh sushi, and bold modern plates—crafted daily in {{location}}.",
  contactEmail: "switham.gca@gmail.com",
  instagramUrl: "https://www.instagram.com/kitchenmaster.ga/",
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
  instagramUrl?: string;
  facebookUrl?: string;
  googleReviewsUrl?: string;
  googleRating?: string;
  googleReviewCount?: string;
  reviews?: Array<{ quote: string; author: string; rating?: number }>;
};

const BEST_OF_GWINNETT_URL = "https://www.guidetogwinnett.com/best-of/vote/food-drink";

type Campaign = {
  name: string;
  campaignType: "insiders" | "external-cta";
  enabled: boolean;
  startsAt?: string;
  endsAt?: string;
  priority: number;
  locations?: Array<{ slug: string }>;
  eyebrow?: string;
  title: string;
  accent?: string;
  body?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  finePrint?: string;
  dismissalKey: string;
  delayMs?: number;
};

type Happening = AnnouncementHappening & {
  enabled?: boolean;
  showInBanner?: boolean;
  priority?: number;
  startsAt?: string;
  endsAt?: string;
  locations?: Array<{ slug: string }>;
};

const FALLBACK_CAMPAIGNS: Campaign[] = [
  { name:"2026 Best of Gwinnett Voting",campaignType:"external-cta",enabled:true,startsAt:"2026-09-01T00:00:00.000Z",endsAt:"2026-12-31T23:59:59.000Z",priority:100,locations:[{slug:"suwanee"}],eyebrow:"Best of Gwinnett · 2026",title:"Love Kitchen Master?",accent:"Cast your vote.",body:"Help your Suwanee Kitchen Master earn Best of Gwinnett. Find us under Chinese Restaurants in Food & Drink.",buttonLabel:"Vote for Kitchen Master",buttonUrl:BEST_OF_GWINNETT_URL,finePrint:"Voting takes place on the official Best of Gwinnett website.",dismissalKey:"best-of-gwinnett-2026",delayMs:1200 },
  { name:"Kitchen Master Insiders",campaignType:"insiders",enabled:true,priority:10,eyebrow:"Kitchen Master Insiders",title:"Your table has",accent:"its advantages.",body:"Join for restaurant news, special events, and rewards—with your selected restaurant as your preferred Kitchen Master.",buttonLabel:"Join the Insiders",dismissalKey:"kitchen-master-insiders",delayMs:1200 },
];

const DEFAULT_LOCATIONS: RestaurantLocation[] = [
  {
    id: "suwanee", name: "Suwanee", state: "Georgia", address: "3131 Lawrenceville-Suwanee Rd, Ste B5",
    city: "Suwanee, GA 30024", phone: "470-589-1112", lat: 34.0236, lng: -84.0519, status: "open",
    hours: "Tue–Fri 4:30–10 · Sat 11–10 · Sun 12–9:30",
    orderUrl: "https://order.toasttab.com/online/kitchen-master-bistro-2-3131-lawrenceville-suwanee-rd-b5",
    reservationUrl: "https://resy.com/cities/suwanee-ga/venues/kitchen-master-suwanee",
  },
  {
    id: "frisco", name: "Frisco", state: "Texas", address: "9285 Preston Rd",
    city: "Frisco, TX 75033", phone: "469-362-8001", lat: 33.1548354, lng: -96.8039115, status: "open",
    hours: "Mon–Thu 11–2:30, 4:30–9 · Fri–Sat until 9:30",
    orderUrl: "https://order.toasttab.com/online/kitchen-master-bistro-9285-preston-rd",
    reservationUrl: "https://www.kitchenmasterbistro.com/reservations-frisco",
  },
  {
    id: "southlake", name: "Southlake", state: "Texas", address: "3311 E State Hwy 114",
    city: "Southlake, TX 76092", phone: "214-724-5600", lat: 32.9369978, lng: -97.1029086, status: "open",
    hours: "Tue–Thu 11–9 · Fri–Sat 11–10",
    orderUrl: "https://order.toasttab.com/online/kitchen-master-bistro-southlake-3311-w-state-hwy-114",
    reservationUrl: "tel:+12147245600",
  },
  {
    id: "midtown", name: "Midtown Atlanta", state: "Georgia", address: "Address to be announced",
    city: "Atlanta, GA", phone: "Coming soon", lat: 33.7838, lng: -84.3831, status: "coming-soon",
    hours: "Opening details coming soon", orderUrl: "",
  },
];

const LOCATION_SOCIAL: Record<string, { instagram: string; handle: string; rating?: string; count?: string; reviews: Array<{ quote: string; author: string }> }> = {
  suwanee: { instagram: "kitchenmaster.ga", handle: "@kitchenmaster.ga", rating: "4.5", count: "444 Google reviews", reviews: [
    { quote: "Shaun provided the best service and the food was amazing.", author: "Recent Suwanee guest" },
    { quote: "This was my first time at Kitchen Master and it won’t be my last!", author: "Recent Suwanee guest" },
  ] },
  frisco: { instagram: "kitchenmaster.tx", handle: "@kitchenmaster.tx", rating: "4.3", count: "1,000+ Google reviews", reviews: [
    { quote: "Everything we ordered was delicious — the xiaolongbao were juicy and flavorful.", author: "Xiaoyu S. · Google" },
    { quote: "The shrimp were crispy outside, juicy inside, and full of flavor.", author: "Thi Kim D. · Google" },
  ] },
  southlake: { instagram: "kitchenmaster.tx", handle: "@kitchenmaster.tx", reviews: [] },
  midtown: { instagram: "kitchenmaster.ga", handle: "@kitchenmaster.ga", reviews: [] },
};

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
  const [baseHomePage, setHomePage] = useState<HomePageContent>(DEFAULT_HOME);
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>([]);
  const [foodCategories, setFoodCategories] = useState(MENU_CATEGORIES);
  const [drinkCategories, setDrinkCategories] = useState(DRINK_CATEGORIES);
  const [locationChosen, setLocationChosen] = useState(false);
  const [introPlaying, setIntroPlaying] = useState(true);
  const [activeMenuCategory, setActiveMenuCategory] = useState(MENU_CATEGORIES[0].name);
  const [activeDrinkCategory, setActiveDrinkCategory] = useState(DRINK_CATEGORIES[0].name);
  const [happyHourCategories, setHappyHourCategories] = useState(HAPPY_HOUR_CATEGORIES);
  const [activeHappyHourCategory, setActiveHappyHourCategory] = useState(HAPPY_HOUR_CATEGORIES[0].name);
  const [popupOpen, setPopupOpen] = useState(false);
  const [insiderEmail, setInsiderEmail] = useState("");
  const [insiderStatus, setInsiderStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [headerVisible, setHeaderVisible] = useState(true);
  const [pageScrolled, setPageScrolled] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>(FALLBACK_CAMPAIGNS);
  const [happenings, setHappenings] = useState<Happening[]>([]);
  const selectedLocation = locations.find((location) => location.id === selectedId) ?? locations[0];
  const homePage = useMemo(() => resolveHomepageSections(baseHomePage, homepageSections, selectedId), [baseHomePage, homepageSections, selectedId]);
  const locationStates = Array.from(new Set(locations.map((location) => location.state)));
  const socialFallback = LOCATION_SOCIAL[selectedLocation.id] ?? LOCATION_SOCIAL.suwanee;
  const instagramHandle = selectedLocation.instagramUrl ? `@${selectedLocation.instagramUrl.replace(/\/$/, "").split("/").pop()}` : socialFallback.handle;
  const locationSocial = {
    instagram: selectedLocation.instagramUrl?.replace(/\/$/, "").split("/").pop() ?? socialFallback.instagram,
    handle: instagramHandle,
    rating: selectedLocation.googleRating ?? socialFallback.rating,
    count: selectedLocation.googleReviewCount ?? socialFallback.count,
    reviews: selectedLocation.reviews?.length ? selectedLocation.reviews : socialFallback.reviews,
  };
  const now = Date.now();
  const activeCampaign = campaigns
    .filter((campaign) => campaign.enabled)
    .filter((campaign) => !campaign.startsAt || new Date(campaign.startsAt).getTime() <= now)
    .filter((campaign) => !campaign.endsAt || new Date(campaign.endsAt).getTime() >= now)
    .filter((campaign) => !campaign.locations?.length || campaign.locations.some((location) => location.slug === selectedId))
    .sort((a, b) => b.priority - a.priority)[0];
  const activeAnnouncement = happenings
    .filter((item) => item.enabled !== false && item.showInBanner)
    .filter((item) => !item.startsAt || new Date(item.startsAt).getTime() <= now)
    .filter((item) => !item.endsAt || new Date(item.endsAt).getTime() >= now)
    .filter((item) => !item.locations?.length || item.locations.some((location) => location.slug === selectedId))
    .sort((a, b) => Number(b.priority ?? 0) - Number(a.priority ?? 0))[0];
  const availableFoodCategories = foodCategories.filter((category) => !category.locationSlugs?.length || category.locationSlugs.includes(selectedId));
  const availableDrinkCategories = drinkCategories.filter((category) => !category.locationSlugs?.length || category.locationSlugs.includes(selectedId));
  const availableHappyHourCategories = happyHourCategories.filter((category) => !category.locationSlugs?.length || category.locationSlugs.includes(selectedId));
  const menuCards = [
    { title:homePage.menuCard1Title,eyebrow:homePage.menuCard1Eyebrow,image:homePage.menuCard1ImageUrl },
    { title:homePage.menuCard2Title,eyebrow:homePage.menuCard2Eyebrow,image:homePage.menuCard2ImageUrl },
    { title:homePage.menuCard3Title,eyebrow:homePage.menuCard3Eyebrow,image:homePage.menuCard3ImageUrl },
  ];

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const requestedLocation = search.get("location");
    let locationTimer: number | undefined;
    if (requestedLocation) {
      locationTimer = window.setTimeout(() => {
        setSelectedId(requestedLocation);
        setLocationChosen(true);
      }, 0);
    }
    const timer = window.setTimeout(() => setIntroPlaying(false), 6500);
    return () => {
      if (locationTimer) window.clearTimeout(locationTimer);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!locationChosen || introPlaying) return;
    if (!activeCampaign) return;
    const dismissalKey = `km-popup-${activeCampaign.dismissalKey}`;
    if (window.sessionStorage.getItem(dismissalKey)) return;
    const timer = window.setTimeout(() => setPopupOpen(true), activeCampaign.delayMs ?? 1200);
    return () => window.clearTimeout(timer);
  }, [locationChosen, introPlaying, selectedId, activeCampaign?.dismissalKey]);

  useEffect(() => {
    let stopTimer: number | undefined;
    const handleScroll = () => {
      setPageScrolled(window.scrollY > 20);
      if (window.scrollY <= 20 || menuOpen) {
        setHeaderVisible(true);
        if (stopTimer) window.clearTimeout(stopTimer);
        return;
      }
      setHeaderVisible(false);
      if (stopTimer) window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => setHeaderVisible(true), 450);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (stopTimer) window.clearTimeout(stopTimer);
    };
  }, [menuOpen]);

  function closePopup() {
    const dismissalKey = `km-popup-${activeCampaign?.dismissalKey ?? "campaign"}`;
    window.sessionStorage.setItem(dismissalKey, "dismissed");
    setPopupOpen(false);
  }

  async function joinInsiders(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInsiderStatus("sending");
    const response = await fetch("/api/insiders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: insiderEmail, preferredLocation: selectedLocation.id }),
    }).catch(() => null);
    setInsiderStatus(response?.ok ? "success" : "error");
  }

  useEffect(() => {
    if (availableFoodCategories.length && !availableFoodCategories.some((category) => category.name === activeMenuCategory)) {
      setActiveMenuCategory(availableFoodCategories[0].name);
    }
    if (availableDrinkCategories.length && !availableDrinkCategories.some((category) => category.name === activeDrinkCategory)) {
      setActiveDrinkCategory(availableDrinkCategories[0].name);
    }
    if (availableHappyHourCategories.length && !availableHappyHourCategories.some((category) => category.name === activeHappyHourCategory)) {
      setActiveHappyHourCategory(availableHappyHourCategories[0].name);
    }
  }, [selectedId, foodCategories, drinkCategories, happyHourCategories]);

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
          instagramUrl: location.instagramUrl ? String(location.instagramUrl) : undefined,
          facebookUrl: location.facebookUrl ? String(location.facebookUrl) : undefined,
          googleReviewsUrl: location.googleReviewsUrl ? String(location.googleReviewsUrl) : undefined,
          googleRating: location.googleRating != null ? String(location.googleRating) : undefined,
          googleReviewCount: location.googleReviewCount ? String(location.googleReviewCount) : undefined,
          reviews: Array.isArray(location.reviews) ? location.reviews.map((review: Record<string, unknown>) => ({ quote:String(review.quote ?? ""),author:String(review.author ?? "Guest"),rating:review.rating == null ? undefined : Number(review.rating) })) : undefined,
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

        if (Array.isArray(payload.pages)) {
          const cmsHome = payload.pages.find((page: Record<string, unknown>) => page.pageType === "home" && !page.location)
            ?? payload.pages.find((page: Record<string, unknown>) => page.slug === "home" && !page.location);
          if (cmsHome) {
            setSiteSettings((current) => ({
              ...current,
              heroEyebrow: cmsHome.heroEyebrow ? String(cmsHome.heroEyebrow) : current.heroEyebrow,
              heroTitle: cmsHome.heroTitle ? String(cmsHome.heroTitle) : current.heroTitle,
              heroAccent: cmsHome.heroAccent ? String(cmsHome.heroAccent) : current.heroAccent,
              heroDescription: cmsHome.heroDescription ? String(cmsHome.heroDescription) : current.heroDescription,
            }));
            const text = (key: keyof HomePageContent): string => cmsHome[key] ? String(cmsHome[key]) : String(DEFAULT_HOME[key] ?? "");
            const media = (key: string, fallback?: string) => cmsHome[key] && typeof cmsHome[key] === "object" && "url" in (cmsHome[key] as object)
              ? String((cmsHome[key] as { url: unknown }).url) : fallback;
            setHomePage({
              heroImageUrl:media("heroImage"),gatewayEyebrow:text("gatewayEyebrow"),gatewayTitle:text("gatewayTitle"),gatewayAccent:text("gatewayAccent"),gatewayDescription:text("gatewayDescription"),
              reservationEyebrow:text("reservationEyebrow"),reservationTitle:text("reservationTitle"),reservationAccent:text("reservationAccent"),reservationDescription:text("reservationDescription"),
              storyEyebrow:text("storyEyebrow"),storyTitle:text("storyTitle"),storyAccent:text("storyAccent"),storyBody:text("storyBody"),storyImageUrl:media("storyImage",DEFAULT_HOME.storyImageUrl),
              menuIntroEyebrow:text("menuIntroEyebrow"),menuIntroTitle:text("menuIntroTitle"),menuIntroAccent:text("menuIntroAccent"),
              menuCard1Eyebrow:text("menuCard1Eyebrow"),menuCard1Title:text("menuCard1Title"),menuCard1ImageUrl:media("menuCard1Image",DEFAULT_HOME.menuCard1ImageUrl),
              menuCard2Eyebrow:text("menuCard2Eyebrow"),menuCard2Title:text("menuCard2Title"),menuCard2ImageUrl:media("menuCard2Image",DEFAULT_HOME.menuCard2ImageUrl),
              menuCard3Eyebrow:text("menuCard3Eyebrow"),menuCard3Title:text("menuCard3Title"),menuCard3ImageUrl:media("menuCard3Image",DEFAULT_HOME.menuCard3ImageUrl),
              foodMenuTitle:text("foodMenuTitle"),foodMenuDescription:text("foodMenuDescription"),foodMenuDisclaimer:text("foodMenuDisclaimer"),
              drinkEyebrow:text("drinkEyebrow"),drinkTitle:text("drinkTitle"),drinkAccent:text("drinkAccent"),drinkDescription:text("drinkDescription"),drinkDisclaimer:text("drinkDisclaimer"),
              happyHourEyebrow:text("happyHourEyebrow"),happyHourTitle:text("happyHourTitle"),happyHourAccent:text("happyHourAccent"),happyHourDescription:text("happyHourDescription"),happyHourDisclaimer:text("happyHourDisclaimer"),
              featureEyebrow:text("featureEyebrow"),featureTitle:text("featureTitle"),featureAccent:text("featureAccent"),featureBody:text("featureBody"),featureImageUrl:media("featureImage",DEFAULT_HOME.featureImageUrl),
              privateDiningEyebrow:text("privateDiningEyebrow"),privateDiningTitle:text("privateDiningTitle"),privateDiningAccent:text("privateDiningAccent"),privateDiningBody:text("privateDiningBody"),privateDiningImageUrl:media("privateDiningImage",DEFAULT_HOME.privateDiningImageUrl),privateDiningCaption:text("privateDiningCaption"),
              socialEyebrow:text("socialEyebrow"),socialTitle:text("socialTitle"),socialAccent:text("socialAccent"),socialBody:text("socialBody"),
              locationsEyebrow:text("locationsEyebrow"),locationsTitle:text("locationsTitle"),locationsAccent:text("locationsAccent"),locationsBody:text("locationsBody"),
              connectEyebrow:text("connectEyebrow"),connectTitle:text("connectTitle"),connectAccent:text("connectAccent"),connectItems:DEFAULT_HOME.connectItems,footerTagline:text("footerTagline"),footerCopyright:text("footerCopyright"),
            });
          }
        }

        if (Array.isArray(payload.homepageSections)) {
          setHomepageSections(payload.homepageSections as HomepageSection[]);
        }

        if (Array.isArray(payload.menuCategories) && payload.menuCategories.length > 0) {
          const normalizeCategories = (menuType: "food" | "drink" | "happy-hour") => payload.menuCategories
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
          const cmsHappyHour = normalizeCategories("happy-hour");
          if (cmsFood.length > 0) {
            setFoodCategories(cmsFood);
            setActiveMenuCategory((current) => cmsFood.some((category: { name: string }) => category.name === current) ? current : cmsFood[0].name);
          }
          if (cmsDrinks.length > 0) {
            setDrinkCategories(cmsDrinks);
            setActiveDrinkCategory((current) => cmsDrinks.some((category: { name: string }) => category.name === current) ? current : cmsDrinks[0].name);
          }
          if (cmsHappyHour.length > 0) {
            setHappyHourCategories(cmsHappyHour);
            setActiveHappyHourCategory((current) => cmsHappyHour.some((category: { name: string }) => category.name === current) ? current : cmsHappyHour[0].name);
          }
        }

        if (Array.isArray(payload.campaigns) && payload.campaigns.length > 0) {
          setCampaigns(payload.campaigns.map((campaign: Record<string, unknown>) => ({
            name:String(campaign.name ?? "Campaign"),campaignType:campaign.campaignType === "insiders" ? "insiders" : "external-cta",enabled:campaign.enabled !== false,
            startsAt:campaign.startsAt ? String(campaign.startsAt) : undefined,endsAt:campaign.endsAt ? String(campaign.endsAt) : undefined,priority:Number(campaign.priority ?? 0),
            locations:Array.isArray(campaign.locations) ? campaign.locations.map((location: Record<string, unknown>) => ({slug:String(location.slug)})) : [],
            eyebrow:campaign.eyebrow ? String(campaign.eyebrow) : undefined,title:String(campaign.title ?? "Kitchen Master"),accent:campaign.accent ? String(campaign.accent) : undefined,
            body:campaign.body ? String(campaign.body) : undefined,buttonLabel:campaign.buttonLabel ? String(campaign.buttonLabel) : undefined,buttonUrl:campaign.buttonUrl ? String(campaign.buttonUrl) : undefined,
            finePrint:campaign.finePrint ? String(campaign.finePrint) : undefined,dismissalKey:String(campaign.dismissalKey ?? campaign.name ?? "campaign"),delayMs:Number(campaign.delayMs ?? 1200),
          })));
        }

        if (Array.isArray(payload.happenings)) {
          setHappenings(payload.happenings.map((item: Record<string, unknown>) => ({
            slug:String(item.slug ?? item.documentId ?? "happening"),title:String(item.title ?? "Kitchen Master"),eyebrow:item.eyebrow ? String(item.eyebrow) : undefined,
            summary:item.summary ? String(item.summary) : undefined,buttonLabel:item.buttonLabel ? String(item.buttonLabel) : undefined,buttonUrl:item.buttonUrl ? String(item.buttonUrl) : undefined,
            dismissalKey:item.dismissalKey ? String(item.dismissalKey) : undefined,enabled:item.enabled !== false,showInBanner:item.showInBanner === true,priority:Number(item.priority ?? 0),
            startsAt:item.startsAt ? String(item.startsAt) : undefined,endsAt:item.endsAt ? String(item.endsAt) : undefined,
            locations:Array.isArray(item.locations) ? item.locations.map((location: Record<string, unknown>) => ({slug:String(location.slug)})) : [],
          })));
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
      {introPlaying && <section className="launch-reveal" aria-label="Kitchen Master is loading">
        <div className="pickup-group">
          <img className="launch-chopstick launch-chopstick-rear" src="/images/chopstick-rear.png" alt="" />
          <img className="launch-dumpling" src="/images/dumpling-cutout.png" alt="" />
          <img className="launch-chopstick launch-chopstick-front" src="/images/chopstick-front.png" alt="" />
          <div className="launch-steam" aria-hidden="true"><span /><span /><span /></div>
        </div>
        <p>Kitchen Master</p>
      </section>}
      {!locationChosen && (
        <section className="location-gateway" aria-labelledby="location-gateway-title">
          <div className="gateway-dumpling gateway-logo-final" aria-hidden="true"><img src="/images/logo-transparent-v2.png" alt="" /></div>
          <div className="gateway-brand"><span className="brand-mark">KM</span><span>KITCHEN MASTER</span></div>
          <div className="gateway-copy">
            <p className="kicker">{homePage.gatewayEyebrow}</p>
            <h1 id="location-gateway-title">{homePage.gatewayTitle}<br /><em>{homePage.gatewayAccent}</em></h1>
            <p>{homePage.gatewayDescription}</p>
          </div>
          <div className="gateway-locations">
            {locations.map((location) => (
              <button key={location.id} onClick={() => {
                setSelectedId(location.id);
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
      <header className={`site-header ${headerVisible ? "header-visible" : "header-hidden"} ${pageScrolled ? "header-scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="Kitchen Master home">
          <span className="brand-mark">KM</span>
          <span>KITCHEN MASTER</span>
        </a>
        <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main navigation">
          <HeaderNav locationSlug={selectedLocation.id} hasReservations={Boolean(selectedLocation.reservationUrl)} isHome onNavigate={() => setMenuOpen(false)} />
        </nav>
        <div className="header-actions">
          <label className="location-select">
            <span>Location</span>
            <select value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setLocationChosen(true); setMiles(null); setLocationState("idle"); }} aria-label="Choose restaurant location">
              {locations.map((location) => <option value={location.id} key={location.id}>{location.name}{location.status === "coming-soon" ? " — Soon" : ""}</option>)}
            </select>
          </label>
          {selectedLocation.status === "open" ? <a className="header-cta" href={selectedLocation.orderUrl} target="_blank" rel="noreferrer">Order online</a> : <a className="header-cta" href="#locations">Coming soon</a>}
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">{menuOpen ? "×" : "☰"}</button>
      </header>
      {locationChosen && !introPlaying && <AnnouncementBanner item={activeAnnouncement} locationSlug={selectedLocation.id} visible={headerVisible} />}

      <section className="hero" id="top" style={(selectedLocation.heroImageUrl || homePage.heroImageUrl) ? { backgroundImage: `url(${selectedLocation.heroImageUrl || homePage.heroImageUrl})` } : undefined}>
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="kicker">{selectedLocation.heroEyebrow || siteSettings.heroEyebrow}</p>
          <h1>{selectedLocation.heroTitle || siteSettings.heroTitle}<br /><em>{selectedLocation.heroAccent || siteSettings.heroAccent}</em></h1>
          <p className="hero-sub">{(selectedLocation.heroDescription || siteSettings.heroDescription).replace("{{location}}", selectedLocation.name)}</p>
          <div className="hero-actions">
            <a className="button button-red" href="#menu">Explore the menu <span>↗</span></a>
            {selectedLocation.reservationUrl ? <a className="text-link" href="#reservations">Book a table <span>↓</span></a> : selectedLocation.status === "open" ? <a className="text-link" href={selectedLocation.orderUrl} target="_blank" rel="noreferrer">Order in {selectedLocation.name} <span>→</span></a> : <a className="text-link" href="#locations">Opening soon <span>↓</span></a>}
          </div>
        </div>
        <div className="hero-stamp"><span>小籠包</span><small>HANDCRAFTED<br />IN {selectedLocation.name.toUpperCase()}</small></div>
        <a className="scroll-note" href="#menu">SCROLL TO DISCOVER <span>↓</span></a>
      </section>

      <section className="location-bar">
        <div className="location-title"><span className="pin">⌖</span><div><small>{locationState === "found" ? "YOUR NEAREST KITCHEN MASTER" : "FIND YOUR KITCHEN MASTER"}</small><strong>{selectedLocation.name}</strong></div></div>
        <div className="location-detail"><span>{selectedLocation.address}<br />{selectedLocation.city}</span><span className="open"><i /> {selectedLocation.status === "open" ? selectedLocation.hours : "Coming soon"}</span></div>
        <div className="location-actions">
          {locationState === "found" && miles !== null && <span className="distance">About {miles < 10 ? miles.toFixed(1) : Math.round(miles)} miles away</span>}
          {locationState === "denied" && <span className="distance">Location unavailable — choose a restaurant below</span>}
          <button onClick={findNearest} disabled={locationState === "loading"}>{locationState === "loading" ? "Locating…" : "Use my location"}</button>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(`${selectedLocation.address}, ${selectedLocation.city}`)}`} target="_blank" rel="noreferrer">Get directions ↗</a>
          {selectedLocation.reservationUrl && <a className="location-book" href="#reservations">Book a table ↓</a>}
        </div>
      </section>

      {selectedLocation.reservationUrl && <section className="reservations" id="reservations"><ResyEmbed locationName={selectedLocation.name} reservationUrl={selectedLocation.reservationUrl} phone={selectedLocation.phone} content={{eyebrow:homePage.reservationEyebrow,title:homePage.reservationTitle,accent:homePage.reservationAccent,description:homePage.reservationDescription}} /></section>}

      <section className="menu-section" id="menu">
        <div className="section-head">
          <div><p className="kicker dark">{homePage.menuIntroEyebrow}</p><h2>{homePage.menuIntroTitle}<br /><em>{homePage.menuIntroAccent}</em></h2></div>
          <a className="under-link" href="#full-menu">VIEW FULL MENU <span>↓</span></a>
        </div>
        <div className="menu-grid">
          {menuCards.map((card, index) => (
            <a className="menu-card" href="#full-menu" key={card.title}>
              <div className="card-image"><img src={card.image} alt={card.title} /><span>0{index + 1}</span></div>
              <p>{card.eyebrow}</p><h3>{card.title}</h3><b>DISCOVER <span>→</span></b>
            </a>
          ))}
        </div>
      </section>

      <section className="full-menu" id="full-menu">
        <div className="full-menu-head"><div><p className="kicker">{selectedLocation.name.toUpperCase()} DINNER MENU</p><h2>{homePage.foodMenuTitle}</h2></div><p>{homePage.foodMenuDescription}</p></div>
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
        <div className="menu-disclaimer">{homePage.foodMenuDisclaimer.split("|").map((item)=><span key={item}>{item}</span>)}</div>
      </section>

      <section className="full-menu drinks-menu" id="drinks">
        <div className="full-menu-head"><div><p className="kicker">{homePage.drinkEyebrow}</p><h2>{homePage.drinkTitle}<br /><em>{homePage.drinkAccent}</em></h2></div><p>{homePage.drinkDescription}</p></div>
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
        <div className="menu-disclaimer">{homePage.drinkDisclaimer.split("|").map((item)=><span key={item}>{item}</span>)}</div>
      </section>

      <section className="full-menu happy-hour-menu" id="happy-hour">
        <div className="full-menu-head"><div><p className="kicker">{homePage.happyHourEyebrow}</p><h2>{homePage.happyHourTitle}<br /><em>{homePage.happyHourAccent}</em></h2></div><p>{homePage.happyHourDescription}</p></div>
        {availableHappyHourCategories.length > 0 ? <>
          <div className="menu-tabs" role="tablist" aria-label="Happy hour categories">
            {availableHappyHourCategories.map((category) => <button role="tab" aria-selected={activeHappyHourCategory === category.name} className={activeHappyHourCategory === category.name ? "active" : ""} onClick={() => setActiveHappyHourCategory(category.name)} key={category.name}>{category.name}</button>)}
          </div>
          {availableHappyHourCategories.filter((category) => category.name === activeHappyHourCategory).map((category) => (
            <div className="menu-panel" role="tabpanel" key={category.name}>
              <div className="menu-panel-title"><span>乾杯</span><div><h3>{category.name}</h3>{category.note && <p>{category.note}</p>}</div></div>
              <div className="menu-items">{category.items.map((item) => <article className="menu-item" key={item.name}><div className="menu-item-title"><h4>{item.name}</h4><span>{item.price}</span></div>{item.description && <p>{item.description}</p>}{item.tags && <div className="menu-tags">{item.tags.map((tag) => <small key={tag}>{tag}</small>)}</div>}</article>)}</div>
            </div>
          ))}
        </> : <div className="menu-empty"><small>{selectedLocation.name.toUpperCase()}</small><p>Happy hour details for this restaurant are coming soon.</p></div>}
        <div className="menu-disclaimer">{homePage.happyHourDisclaimer.split("|").map((item)=><span key={item}>{item}</span>)}</div>
      </section>

      <section className="feature">
        <div className="feature-image"><img src={homePage.featureImageUrl} alt="A spread of Kitchen Master dishes" /></div>
        <div className="feature-copy"><p className="kicker">{homePage.featureEyebrow}</p><h2>{homePage.featureTitle}<br /><em>{homePage.featureAccent}</em></h2><p>{homePage.featureBody}</p><div>{selectedLocation.reservationUrl&&<a className="button button-light" href={selectedLocation.reservationUrl} target={selectedLocation.reservationUrl.startsWith("http")?"_blank":undefined} rel={selectedLocation.reservationUrl.startsWith("http")?"noreferrer":undefined}>Reserve a table <span>↗</span></a>}<a className="text-link" href={selectedLocation.orderUrl} target="_blank" rel="noreferrer">Order pickup <span>→</span></a></div></div>
      </section>

      <section className="events" id="events">
        <div className="events-copy"><p className="kicker dark">{homePage.privateDiningEyebrow}</p><h2>{homePage.privateDiningTitle}<br /><em>{homePage.privateDiningAccent}</em></h2><p>{homePage.privateDiningBody}</p><a className="button button-dark" href={`/pages/private-dining?location=${selectedLocation.id}`}>Plan your event <span>↗</span></a></div>
        <div className="events-image"><img src={homePage.privateDiningImageUrl} alt="Private dining room at Kitchen Master" /><span>{homePage.privateDiningCaption}</span></div>
      </section>

      <section className="social-proof" aria-labelledby="social-proof-title">
        <div className="social-proof-head"><p className="kicker dark">{homePage.socialEyebrow}</p><h2 id="social-proof-title">{homePage.socialTitle}<br /><em>{homePage.socialAccent}</em></h2><p>{homePage.socialBody.replaceAll("{{location}}", selectedLocation.name)}</p></div>
        <div className="social-embeds">
          <div className="google-reviews-live">
            <div className="google-review-summary"><div><span className="google-g">G</span><small>GOOGLE REVIEWS · {selectedLocation.name}</small></div>{locationSocial.rating ? <><strong>{locationSocial.rating}</strong><div className="review-stars">★★★★★</div><p>{locationSocial.count}</p></> : <><strong>New</strong><p>Reviews will appear as this location opens.</p></>}</div>
            <div className="visible-reviews">{locationSocial.reviews.map((review, index) => <article key={`${selectedLocation.id}-${index}`}><div className="review-stars">★★★★★</div><blockquote>“{review.quote}”</blockquote><small>{review.author}</small></article>)}</div>
            <a className="under-link" href={selectedLocation.googleReviewsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Kitchen Master ${selectedLocation.address} ${selectedLocation.city}`)}`} target="_blank" rel="noreferrer">VIEW ALL ON GOOGLE <span>↗</span></a>
          </div>
          <div className="instagram-live"><div className="instagram-live-head"><div><small>LIVE FROM INSTAGRAM</small><strong>{locationSocial.handle}</strong></div><a href={`https://www.instagram.com/${locationSocial.instagram}/`} target="_blank" rel="noreferrer">Follow ↗</a></div><iframe key={locationSocial.instagram} title={`${locationSocial.handle} Instagram feed`} src={`https://www.instagram.com/${locationSocial.instagram}/embed`} loading="lazy" /></div>
        </div>
      </section>

      <section className="locations-section" id="locations" aria-labelledby="locations-title" style={{padding:"clamp(78px, 9vw, 130px) 7vw",background:"#171513",color:"white",scrollMarginTop:88}}>
        <div className="locations-section-head" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 360px), 1fr))",gap:"32px 8vw",alignItems:"end",marginBottom:58}}>
          <div>
            <p className="kicker" style={{margin:"0 0 28px",fontSize:9,fontWeight:800,letterSpacing:2.5,textTransform:"uppercase",color:"#aaa39b"}}>{homePage.locationsEyebrow}</p>
            <h2 id="locations-title" style={{margin:0,fontSize:"clamp(54px, 6vw, 86px)",fontWeight:400,lineHeight:.94,letterSpacing:-2}}>{homePage.locationsTitle}<br /><em style={{color:"#b44a47",fontWeight:400}}>{homePage.locationsAccent}</em></h2>
          </div>
          <p style={{maxWidth:480,margin:0,color:"#aaa39b",font:"17px/1.7 Georgia, serif"}}>{homePage.locationsBody}</p>
        </div>
        <div className="locations-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 250px), 1fr))",border:"1px solid #48433f"}}>
          {locations.map((location, index) => (
            <article className={`location-card ${selectedId === location.id ? "active" : ""}`} style={{position:"relative",minHeight:370,padding:32,display:"flex",flexDirection:"column",borderRight:"1px solid #48433f",background:selectedId === location.id ? "#292421" : "#201d1b",boxShadow:selectedId === location.id ? "inset 0 4px #882020" : "none"}} key={location.id}>
              <div className="location-card-top" style={{minHeight:28,display:"flex",justifyContent:"space-between",gap:12}}><small style={{fontSize:8,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:"#918a84"}}>0{index + 1} · {location.state}</small>{selectedId === location.id && <span style={{fontSize:8,fontWeight:800,letterSpacing:1.3,textTransform:"uppercase",color:"#d06763"}}>Current</span>}</div>
              <h3 style={{margin:"30px 0 20px",font:"36px/1 Georgia, serif"}}>{location.name}</h3>
              <p style={{margin:0,color:"#c2bbb4",font:"15px/1.65 Georgia, serif"}}>{location.address}<br />{location.city}</p>
              <p className="location-card-hours" style={{margin:"20px 0 0",color:"#817a74",font:"13px/1.6 Georgia, serif"}}>{location.hours}</p>
              <div className="location-card-actions" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:18,marginTop:"auto",paddingTop:26,borderTop:"1px solid #3c3834"}}>
                {location.status === "open" ? <>
                  <button style={{padding:0,border:0,background:"none",color:"#d06763",fontSize:8,fontWeight:800,letterSpacing:1.3,textTransform:"uppercase",cursor:"pointer"}} onClick={() => showLocation(location.id)}>Select →</button>
                  <a style={{color:"white",fontSize:8,fontWeight:800,letterSpacing:1.3,textTransform:"uppercase"}} href={`https://maps.google.com/?q=${encodeURIComponent(`${location.address}, ${location.city}`)}`} target="_blank" rel="noreferrer">Directions ↗</a>
                </> : <span style={{color:"#918a84",fontSize:8,fontWeight:800,letterSpacing:1.3,textTransform:"uppercase"}}>Coming soon</span>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="connect" id="contact">
        <div className="connect-intro"><p className="kicker dark">{homePage.connectEyebrow}</p><h2>{homePage.connectTitle}<br />{homePage.connectAccent}</h2></div>
        <div className="connect-links">
          {homePage.connectItems.map((item, index) => {
            const interpolatedUrl = item.url.replaceAll("{{location}}", selectedLocation.id);
            const href = interpolatedUrl.startsWith("/pages/") && !interpolatedUrl.includes("?") ? `${interpolatedUrl}?location=${selectedLocation.id}` : interpolatedUrl;
            return <a href={href} key={`${item.title}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{item.eyebrow.replaceAll("{{location}}", selectedLocation.name)}</small><strong>{item.title.replaceAll("{{location}}", selectedLocation.name)}</strong></div><b>↗</b></a>;
          })}
        </div>
      </section>

      {popupOpen && activeCampaign && <div className="campaign-backdrop" role="presentation" style={{position:"fixed",inset:0,zIndex:3000,padding:24,display:"grid",placeItems:"center",background:"rgba(13,11,9,.76)",backdropFilter:"blur(8px)"}} onMouseDown={(event) => { if (event.target === event.currentTarget) closePopup(); }}>
        <section className="campaign-popup" role="dialog" aria-modal="true" aria-labelledby="campaign-title" style={{position:"relative",width:"min(720px, 100%)",minHeight:480,padding:"64px clamp(32px, 6vw, 68px)",overflow:"hidden",border:"1px solid #d3cbc0",background:"radial-gradient(circle at 88% 14%, #e8d7ca 0, transparent 32%), #f5f1e9",color:"#171513",boxShadow:"0 32px 100px rgba(0,0,0,.55)"}}>
          <button className="campaign-close" style={{position:"absolute",right:24,top:20,zIndex:3,width:42,height:42,border:"1px solid #9d958a",borderRadius:"50%",background:"transparent",fontSize:27,cursor:"pointer"}} onClick={closePopup} aria-label="Close popup">×</button>
          <div aria-hidden="true" style={{position:"absolute",right:-105,bottom:-145,width:340,height:340,borderRadius:"50%",background:"#882020"}} />
          <div className="campaign-mark" aria-hidden="true" style={{position:"absolute",zIndex:1,right:34,bottom:30,width:76,height:76,display:"grid",placeItems:"center",border:"2px solid white",borderRadius:"50%",color:"white",font:"700 22px Georgia, serif"}}>KM</div>
          {activeCampaign?.campaignType === "external-cta" ? <>
            <p className="kicker dark" style={{position:"relative",zIndex:2,margin:"0 0 28px",fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",color:"#766f67"}}>{activeCampaign.eyebrow}</p>
            <h2 id="campaign-title" style={{position:"relative",zIndex:2,margin:"0 0 24px",maxWidth:560,fontSize:"clamp(48px, 6vw, 72px)",fontWeight:400,lineHeight:.93,letterSpacing:-2}}>{activeCampaign.title}<br /><em style={{color:"#882020",fontWeight:400}}>{activeCampaign.accent}</em></h2>
            <p style={{position:"relative",zIndex:2,maxWidth:500,margin:"0 0 28px",color:"#5e5851",font:"18px/1.6 Georgia, serif"}}>{activeCampaign.body}</p>
            <a className="button button-red" style={{position:"relative",zIndex:2,display:"inline-flex",alignItems:"center",justifyContent:"space-between",gap:36,minWidth:310}} href={activeCampaign.buttonUrl || "#"} target="_blank" rel="noreferrer" onClick={closePopup}>{activeCampaign.buttonLabel || "Learn more"} <span>↗</span></a>
            {activeCampaign.finePrint && <small style={{position:"relative",zIndex:2,display:"block",maxWidth:400,marginTop:16,color:"#746e67",fontSize:8,fontWeight:800,letterSpacing:1.2,textTransform:"uppercase"}}>{activeCampaign.finePrint}</small>}
          </> : <>
            <p className="kicker dark" style={{position:"relative",zIndex:2,margin:"0 0 28px",fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",color:"#766f67"}}>{activeCampaign?.eyebrow || "Kitchen Master Insiders"}</p>
            <h2 id="campaign-title" style={{position:"relative",zIndex:2,margin:"0 0 24px",maxWidth:560,fontSize:"clamp(48px, 6vw, 72px)",fontWeight:400,lineHeight:.93,letterSpacing:-2}}>{activeCampaign?.title || "Your table has"}<br /><em style={{color:"#882020",fontWeight:400}}>{activeCampaign?.accent || "its advantages."}</em></h2>
            <p style={{position:"relative",zIndex:2,maxWidth:500,margin:"0 0 28px",color:"#5e5851",font:"18px/1.6 Georgia, serif"}}>{(activeCampaign?.body || "Join for restaurant news, special events, and rewards—with your selected restaurant as your preferred Kitchen Master.").replace("your selected restaurant", selectedLocation.name)}</p>
            {insiderStatus === "success" ? <div className="campaign-success" style={{position:"relative",zIndex:2,maxWidth:510,padding:20,border:"1px solid #bdb4a8",background:"#fffdf9",font:"18px Georgia, serif"}}>You’re on the list. Welcome inside.</div> : <form className="insiders-form" style={{position:"relative",zIndex:2,maxWidth:510,display:"flex",flexWrap:"wrap",gap:10}} onSubmit={joinInsiders}>
              <label style={{flex:"1 1 240px"}}><span style={{position:"absolute",width:1,height:1,overflow:"hidden"}}>Email address</span><input style={{width:"100%",height:54,padding:"0 18px",border:"1px solid #bdb4a8",background:"#fffdf9",font:"16px Georgia, serif"}} type="email" value={insiderEmail} onChange={(event) => setInsiderEmail(event.target.value)} placeholder="you@example.com" required /></label>
              <button className="button button-red" style={{height:54,border:0,cursor:"pointer"}} disabled={insiderStatus === "sending"}>{insiderStatus === "sending" ? "Joining…" : (activeCampaign?.buttonLabel || "Join the Insiders")} <span>→</span></button>
              {insiderStatus === "error" && <small style={{flexBasis:"100%",color:"#882020"}}>Signup isn’t connected yet. Please try again later.</small>}
            </form>}
          </>}
        </section>
      </div>}

      <footer>
        <div className="footer-top"><div className="footer-brand"><span className="brand-mark">KM</span><h2>KITCHEN<br />MASTER</h2><p>{homePage.footerTagline}</p></div>{locationStates.map((state) => <div className="footer-locations" key={state}><small>{state.toUpperCase()}</small>{locations.filter((location) => location.state === state).map((location) => <button key={location.id} onClick={() => showLocation(location.id)}>{location.name} {location.status === "open" ? <span>→</span> : <em>Coming soon</em>}</button>)}</div>)}<div><small>FOLLOW</small><a href={selectedLocation.instagramUrl || siteSettings.instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a><a href={selectedLocation.facebookUrl || siteSettings.facebookUrl} target="_blank" rel="noreferrer">Facebook ↗</a></div></div>
        <div className="footer-bottom"><span>{homePage.footerCopyright}</span><span>{selectedLocation.contactEmail || siteSettings.contactEmail}</span><span>{selectedLocation.city}</span></div>
      </footer>
    </main>
  );
}
