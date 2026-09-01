"use client";

import { useEffect, useState } from "react";
import { DRINK_CATEGORIES, MENU_CATEGORIES } from "./menuData";
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
  storyEyebrow:string;storyTitle:string;storyAccent:string;storyBody:string;storyImageUrl?:string;
  menuIntroEyebrow:string;menuIntroTitle:string;menuIntroAccent:string;
  menuCard1Eyebrow:string;menuCard1Title:string;menuCard1ImageUrl?:string;
  menuCard2Eyebrow:string;menuCard2Title:string;menuCard2ImageUrl?:string;
  menuCard3Eyebrow:string;menuCard3Title:string;menuCard3ImageUrl?:string;
  foodMenuTitle:string;foodMenuDescription:string;foodMenuDisclaimer:string;
  drinkEyebrow:string;drinkTitle:string;drinkAccent:string;drinkDescription:string;drinkDisclaimer:string;
  featureEyebrow:string;featureTitle:string;featureAccent:string;featureBody:string;featureImageUrl?:string;
  privateDiningEyebrow:string;privateDiningTitle:string;privateDiningAccent:string;privateDiningBody:string;privateDiningImageUrl?:string;privateDiningCaption:string;
  connectEyebrow:string;connectTitle:string;connectAccent:string;footerTagline:string;footerCopyright:string;
};

const DEFAULT_HOME: HomePageContent = {
  gatewayEyebrow:"Welcome to Kitchen Master",gatewayTitle:"Choose your",gatewayAccent:"location.",gatewayDescription:"Menus, reservations, hours, and restaurant details are tailored to your selected Kitchen Master.",
  storyEyebrow:"Our philosophy",storyTitle:"Old-world technique.",storyAccent:"New-world spirit.",storyBody:"At Kitchen Master, Taiwanese and Japanese traditions meet a modern American point of view. Every fold, slice, and sizzle reflects our dedication to craft, flavor, and ingredients prepared fresh each day.",storyImageUrl:"/images/dining.png",
  menuIntroEyebrow:"What we’re known for",menuIntroTitle:"Made with patience.",menuIntroAccent:"Remembered by flavor.",
  menuCard1Eyebrow:"The signature",menuCard1Title:"Soup Dumplings",menuCard1ImageUrl:"/images/soup-dumplings.png",menuCard2Eyebrow:"From the wok",menuCard2Title:"Modern Plates",menuCard2ImageUrl:"/images/lamb-chop.png",menuCard3Eyebrow:"Made to share",menuCard3Title:"Small Plates",menuCard3ImageUrl:"/images/szechuan-wonton.png",
  foodMenuTitle:"The full menu.",foodMenuDescription:"Handcrafted daily. Menu availability and pricing may change. Please tell your server about any allergies before ordering.",foodMenuDisclaimer:"V · Vegetarian|Raw · May be served raw or undercooked|Parties of six or more are subject to 20% gratuity",
  drinkEyebrow:"From the bar",drinkTitle:"Pour something",drinkAccent:"memorable.",drinkDescription:"House cocktails inspired by Asian flavors, a considered wine and sake list, and thoughtful zero-proof drinks.",drinkDisclaimer:"Must be 21+ with valid identification|Selections and vintages may change|Please enjoy responsibly",
  featureEyebrow:"Dinner, done differently",featureTitle:"A table worth",featureAccent:"gathering around.",featureBody:"From a quick dinner to a long celebration, every meal is made to be shared.",featureImageUrl:"/images/spread.jpg",
  privateDiningEyebrow:"Private dining",privateDiningTitle:"Your occasion.",privateDiningAccent:"Our craft.",privateDiningBody:"Host an intimate dinner or a full celebration in a space designed for memorable meals. Our team will help shape the room and menu around your event.",privateDiningImageUrl:"/images/private-room.png",privateDiningCaption:"Private rooms · Custom menus · Personal service",
  connectEyebrow:"More from Kitchen Master",connectTitle:"Come be part",connectAccent:"of the story.",footerTagline:"Tradition meets innovation.",footerCopyright:"© 2026 Kitchen Master",
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroEyebrow: "Taiwanese craft · Japanese precision",
  heroTitle: "Tradition,",
  heroAccent: "mastered.",
  heroDescription: "Soup dumplings, fresh sushi, and bold modern plates—crafted daily in {{location}}.",
  contactEmail: "Management@kitchenmasterga.com",
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
  const [homePage, setHomePage] = useState<HomePageContent>(DEFAULT_HOME);
  const [foodCategories, setFoodCategories] = useState(MENU_CATEGORIES);
  const [drinkCategories, setDrinkCategories] = useState(DRINK_CATEGORIES);
  const [locationChosen, setLocationChosen] = useState(false);
  const [introPlaying, setIntroPlaying] = useState(true);
  const [activeMenuCategory, setActiveMenuCategory] = useState(MENU_CATEGORIES[0].name);
  const [activeDrinkCategory, setActiveDrinkCategory] = useState(DRINK_CATEGORIES[0].name);
  const [popupOpen, setPopupOpen] = useState(false);
  const [insiderEmail, setInsiderEmail] = useState("");
  const [insiderStatus, setInsiderStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [headerVisible, setHeaderVisible] = useState(true);
  const [pageScrolled, setPageScrolled] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>(FALLBACK_CAMPAIGNS);
  const selectedLocation = locations.find((location) => location.id === selectedId) ?? locations[0];
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
  const availableFoodCategories = foodCategories.filter((category) => !category.locationSlugs?.length || category.locationSlugs.includes(selectedId));
  const availableDrinkCategories = drinkCategories.filter((category) => !category.locationSlugs?.length || category.locationSlugs.includes(selectedId));
  const menuCards = [
    { title:homePage.menuCard1Title,eyebrow:homePage.menuCard1Eyebrow,image:homePage.menuCard1ImageUrl },
    { title:homePage.menuCard2Title,eyebrow:homePage.menuCard2Eyebrow,image:homePage.menuCard2ImageUrl },
    { title:homePage.menuCard3Title,eyebrow:homePage.menuCard3Eyebrow,image:homePage.menuCard3ImageUrl },
  ];

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const requestedLocation = search.get("location");
    if (requestedLocation) setSelectedId(requestedLocation);
    const timer = window.setTimeout(() => setIntroPlaying(false), 6500);
    return () => window.clearTimeout(timer);
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
          instagramUrl: location.instagramUrl ? String(location.instagramUrl) : undefined,
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
          const cmsHome = payload.pages.find((page: Record<string, unknown>) => page.slug === "home");
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
              storyEyebrow:text("storyEyebrow"),storyTitle:text("storyTitle"),storyAccent:text("storyAccent"),storyBody:text("storyBody"),storyImageUrl:media("storyImage",DEFAULT_HOME.storyImageUrl),
              menuIntroEyebrow:text("menuIntroEyebrow"),menuIntroTitle:text("menuIntroTitle"),menuIntroAccent:text("menuIntroAccent"),
              menuCard1Eyebrow:text("menuCard1Eyebrow"),menuCard1Title:text("menuCard1Title"),menuCard1ImageUrl:media("menuCard1Image",DEFAULT_HOME.menuCard1ImageUrl),
              menuCard2Eyebrow:text("menuCard2Eyebrow"),menuCard2Title:text("menuCard2Title"),menuCard2ImageUrl:media("menuCard2Image",DEFAULT_HOME.menuCard2ImageUrl),
              menuCard3Eyebrow:text("menuCard3Eyebrow"),menuCard3Title:text("menuCard3Title"),menuCard3ImageUrl:media("menuCard3Image",DEFAULT_HOME.menuCard3ImageUrl),
              foodMenuTitle:text("foodMenuTitle"),foodMenuDescription:text("foodMenuDescription"),foodMenuDisclaimer:text("foodMenuDisclaimer"),
              drinkEyebrow:text("drinkEyebrow"),drinkTitle:text("drinkTitle"),drinkAccent:text("drinkAccent"),drinkDescription:text("drinkDescription"),drinkDisclaimer:text("drinkDisclaimer"),
              featureEyebrow:text("featureEyebrow"),featureTitle:text("featureTitle"),featureAccent:text("featureAccent"),featureBody:text("featureBody"),featureImageUrl:media("featureImage",DEFAULT_HOME.featureImageUrl),
              privateDiningEyebrow:text("privateDiningEyebrow"),privateDiningTitle:text("privateDiningTitle"),privateDiningAccent:text("privateDiningAccent"),privateDiningBody:text("privateDiningBody"),privateDiningImageUrl:media("privateDiningImage",DEFAULT_HOME.privateDiningImageUrl),privateDiningCaption:text("privateDiningCaption"),
              connectEyebrow:text("connectEyebrow"),connectTitle:text("connectTitle"),connectAccent:text("connectAccent"),footerTagline:text("footerTagline"),footerCopyright:text("footerCopyright"),
            });
          }
        }

        if (Array.isArray(payload.homepageSections) && payload.homepageSections.length) {
          const section = (key: string) => payload.homepageSections.find((item: Record<string, unknown>) => item.sectionKey === key) as Record<string, unknown> | undefined;
          const value = (item: Record<string, unknown> | undefined, key: string, fallback: string) => item?.[key] ? String(item[key]) : fallback;
          const image = (item: Record<string, unknown> | undefined, fallback?: string) => item?.image && typeof item.image === "object" && "url" in item.image ? String((item.image as {url:unknown}).url) : fallback;
          const gateway=section("location-gateway"),story=section("story"),featured=section("featured-menu"),food=section("food-menu"),drinks=section("drinks"),dining=section("dining-feature"),privateDining=section("private-dining"),connect=section("connect"),footer=section("footer");
          const cards=Array.isArray(featured?.items)?featured.items as Record<string,unknown>[]:[];
          const cardImages=Array.isArray(featured?.images)?featured.images as {url?:unknown}[]:[];
          setHomePage((current)=>({
            ...current,
            gatewayEyebrow:value(gateway,"eyebrow",current.gatewayEyebrow),gatewayTitle:value(gateway,"title",current.gatewayTitle),gatewayAccent:value(gateway,"accent",current.gatewayAccent),gatewayDescription:value(gateway,"body",current.gatewayDescription),
            storyEyebrow:value(story,"eyebrow",current.storyEyebrow),storyTitle:value(story,"title",current.storyTitle),storyAccent:value(story,"accent",current.storyAccent),storyBody:value(story,"body",current.storyBody),storyImageUrl:image(story,current.storyImageUrl),
            menuIntroEyebrow:value(featured,"eyebrow",current.menuIntroEyebrow),menuIntroTitle:value(featured,"title",current.menuIntroTitle),menuIntroAccent:value(featured,"accent",current.menuIntroAccent),
            menuCard1Eyebrow:value(cards[0],"eyebrow",current.menuCard1Eyebrow),menuCard1Title:value(cards[0],"title",current.menuCard1Title),menuCard1ImageUrl:cardImages[0]?.url?String(cardImages[0].url):current.menuCard1ImageUrl,
            menuCard2Eyebrow:value(cards[1],"eyebrow",current.menuCard2Eyebrow),menuCard2Title:value(cards[1],"title",current.menuCard2Title),menuCard2ImageUrl:cardImages[1]?.url?String(cardImages[1].url):current.menuCard2ImageUrl,
            menuCard3Eyebrow:value(cards[2],"eyebrow",current.menuCard3Eyebrow),menuCard3Title:value(cards[2],"title",current.menuCard3Title),menuCard3ImageUrl:cardImages[2]?.url?String(cardImages[2].url):current.menuCard3ImageUrl,
            foodMenuTitle:value(food,"title",current.foodMenuTitle),foodMenuDescription:value(food,"body",current.foodMenuDescription),foodMenuDisclaimer:Array.isArray(food?.items)?food.items.map(String).join("|"):current.foodMenuDisclaimer,
            drinkEyebrow:value(drinks,"eyebrow",current.drinkEyebrow),drinkTitle:value(drinks,"title",current.drinkTitle),drinkAccent:value(drinks,"accent",current.drinkAccent),drinkDescription:value(drinks,"body",current.drinkDescription),drinkDisclaimer:Array.isArray(drinks?.items)?drinks.items.map(String).join("|"):current.drinkDisclaimer,
            featureEyebrow:value(dining,"eyebrow",current.featureEyebrow),featureTitle:value(dining,"title",current.featureTitle),featureAccent:value(dining,"accent",current.featureAccent),featureBody:value(dining,"body",current.featureBody),featureImageUrl:image(dining,current.featureImageUrl),
            privateDiningEyebrow:value(privateDining,"eyebrow",current.privateDiningEyebrow),privateDiningTitle:value(privateDining,"title",current.privateDiningTitle),privateDiningAccent:value(privateDining,"accent",current.privateDiningAccent),privateDiningBody:value(privateDining,"body",current.privateDiningBody),privateDiningImageUrl:image(privateDining,current.privateDiningImageUrl),privateDiningCaption:value(privateDining,"caption",current.privateDiningCaption),
            connectEyebrow:value(connect,"eyebrow",current.connectEyebrow),connectTitle:value(connect,"title",current.connectTitle),connectAccent:value(connect,"accent",current.connectAccent),footerTagline:value(footer,"title",current.footerTagline),footerCopyright:value(footer,"caption",current.footerCopyright),
          }));
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
          <a href="#menu" onClick={() => setMenuOpen(false)}>Menu</a>
          <a href="#drinks" onClick={() => setMenuOpen(false)}>Drinks</a>
          {selectedLocation.id === "suwanee" && <a href="#reservations" onClick={() => setMenuOpen(false)}>Reserve</a>}
          <a href="#story" onClick={() => setMenuOpen(false)}>Our Story</a>
          <a href="#locations" onClick={() => setMenuOpen(false)}>Locations</a>
          <a href="#events" onClick={() => setMenuOpen(false)}>Private Dining</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Join Our Team</a>
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

      <section className="hero" id="top" style={(homePage.heroImageUrl || selectedLocation.heroImageUrl) ? { backgroundImage: `url(${homePage.heroImageUrl || selectedLocation.heroImageUrl})` } : undefined}>
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="kicker">{siteSettings.heroEyebrow}</p>
          <h1>{siteSettings.heroTitle}<br /><em>{siteSettings.heroAccent}</em></h1>
          <p className="hero-sub">{siteSettings.heroDescription.replace("{{location}}", selectedLocation.name)}</p>
          <div className="hero-actions">
            <a className="button button-red" href="#menu">Explore the menu <span>↗</span></a>
            {selectedLocation.id === "suwanee" ? <a className="text-link" href="#reservations">Book a table <span>↓</span></a> : selectedLocation.status === "open" ? <a className="text-link" href={selectedLocation.orderUrl} target="_blank" rel="noreferrer">Order in {selectedLocation.name} <span>→</span></a> : <a className="text-link" href="#locations">Opening soon <span>↓</span></a>}
          </div>
        </div>
        <div className="hero-stamp"><span>小籠包</span><small>HANDCRAFTED<br />IN {selectedLocation.name.toUpperCase()}</small></div>
        <a className="scroll-note" href="#story">SCROLL TO DISCOVER <span>↓</span></a>
      </section>

      <section className="location-bar">
        <div className="location-title"><span className="pin">⌖</span><div><small>{locationState === "found" ? "YOUR NEAREST KITCHEN MASTER" : "FIND YOUR KITCHEN MASTER"}</small><strong>{selectedLocation.name}</strong></div></div>
        <div className="location-detail"><span>{selectedLocation.address}<br />{selectedLocation.city}</span><span className="open"><i /> {selectedLocation.status === "open" ? selectedLocation.hours : "Coming soon"}</span></div>
        <div className="location-actions">
          {locationState === "found" && miles !== null && <span className="distance">About {miles < 10 ? miles.toFixed(1) : Math.round(miles)} miles away</span>}
          {locationState === "denied" && <span className="distance">Location unavailable — choose a restaurant below</span>}
          <button onClick={findNearest} disabled={locationState === "loading"}>{locationState === "loading" ? "Locating…" : "Use my location"}</button>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(`${selectedLocation.address}, ${selectedLocation.city}`)}`} target="_blank" rel="noreferrer">Get directions ↗</a>
          {selectedLocation.id === "suwanee" && <a className="location-book" href="#reservations">Book a table ↓</a>}
        </div>
      </section>

      {selectedLocation.id === "suwanee" && <section className="reservations" id="reservations"><ResyEmbed /></section>}

      <section className="story" id="story">
        <div className="story-label"><span>01</span><p>{homePage.storyEyebrow}</p></div>
        <div className="story-copy">
          <p className="brush">匠</p>
          <h2>{homePage.storyTitle}<br /><em>{homePage.storyAccent}</em></h2>
          <p>{homePage.storyBody}</p>
          <a className="under-link" href="#menu">OUR STORY <span>→</span></a>
        </div>
        <div className="story-image"><img src={homePage.storyImageUrl} alt="Kitchen Master dining room" /><span className="vertical-copy">CRAFTED WITH INTENTION</span></div>
      </section>

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

      <section className="feature">
        <div className="feature-image"><img src={homePage.featureImageUrl} alt="A spread of Kitchen Master dishes" /></div>
        <div className="feature-copy"><p className="kicker">{homePage.featureEyebrow}</p><h2>{homePage.featureTitle}<br /><em>{homePage.featureAccent}</em></h2><p>{homePage.featureBody}</p><div>{selectedLocation.reservationUrl&&<a className="button button-light" href={selectedLocation.reservationUrl} target="_blank" rel="noreferrer">Book on Resy <span>↗</span></a>}<a className="text-link" href={selectedLocation.orderUrl} target="_blank" rel="noreferrer">Order pickup <span>→</span></a></div></div>
      </section>

      <section className="events" id="events">
        <div className="events-copy"><p className="kicker dark">{homePage.privateDiningEyebrow}</p><h2>{homePage.privateDiningTitle}<br /><em>{homePage.privateDiningAccent}</em></h2><p>{homePage.privateDiningBody}</p><a className="button button-dark" href="/pages/private-dining">Plan your event <span>↗</span></a></div>
        <div className="events-image"><img src={homePage.privateDiningImageUrl} alt="Private dining room at Kitchen Master" /><span>{homePage.privateDiningCaption}</span></div>
      </section>

      <section className="social-proof" aria-labelledby="social-proof-title">
        <div className="social-proof-head"><p className="kicker dark">From our guests</p><h2 id="social-proof-title">Loved locally.<br /><em>Shared often.</em></h2><p>See what guests are saying about Kitchen Master {selectedLocation.name}, then follow along for new dishes and behind-the-scenes moments.</p></div>
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
            <p className="kicker" style={{margin:"0 0 28px",fontSize:9,fontWeight:800,letterSpacing:2.5,textTransform:"uppercase",color:"#aaa39b"}}>Our restaurants</p>
            <h2 id="locations-title" style={{margin:0,fontSize:"clamp(54px, 6vw, 86px)",fontWeight:400,lineHeight:.94,letterSpacing:-2}}>Find your<br /><em style={{color:"#b44a47",fontWeight:400}}>Kitchen Master.</em></h2>
          </div>
          <p style={{maxWidth:480,margin:0,color:"#aaa39b",font:"17px/1.7 Georgia, serif"}}>Explore every Kitchen Master location and choose the restaurant you’d like to visit.</p>
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
          <a href="/pages/contact"><span>01</span><div><small>Questions & feedback</small><strong>Contact us</strong></div><b>↗</b></a>
          <a href={`/careers/${selectedLocation.id}`}><span>02</span><div><small>Join our {selectedLocation.name} team</small><strong>Careers</strong></div><b>↗</b></a>
          <a href="/pages/franchise"><span>03</span><div><small>Grow with us</small><strong>Franchise opportunities</strong></div><b>↗</b></a>
          <a href="/pages/private-dining"><span>04</span><div><small>Gather together</small><strong>Private dining</strong></div><b>↗</b></a>
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
        <div className="footer-top"><div className="footer-brand"><span className="brand-mark">KM</span><h2>KITCHEN<br />MASTER</h2><p>{homePage.footerTagline}</p></div><div className="footer-locations"><small>GEORGIA</small><button onClick={() => showLocation("suwanee")}>Suwanee <span>→</span></button><button onClick={() => showLocation("midtown")}>Midtown Atlanta <em>Coming soon</em></button></div><div className="footer-locations"><small>TEXAS</small><button onClick={() => showLocation("frisco")}>Frisco <span>→</span></button><button onClick={() => showLocation("southlake")}>Southlake <span>→</span></button></div><div><small>FOLLOW</small><a href={siteSettings.instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a><a href={siteSettings.facebookUrl} target="_blank" rel="noreferrer">Facebook ↗</a></div></div>
        <div className="footer-bottom"><span>{homePage.footerCopyright}</span><span>{siteSettings.contactEmail}</span><span>{selectedLocation.city}</span></div>
      </footer>
    </main>
  );
}
