import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HappeningsCalendar from "@/app/components/HappeningsCalendar";
import SiteHeader from "@/app/components/SiteHeader";
import { STRAPI_URL as cmsUrl } from "@/lib/strapi";

type ContentSection = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  linkLabel?: string;
  linkUrl?: string;
};

type FormConfig = {
  formEyebrow?: string;
  formTitle?: string;
  formDescription?: string;
  submitLabel?: string;
  subjectOptions?: string[];
  eventTypeOptions?: string[];
  experienceOptions?: string[];
  investmentRangeOptions?: string[];
};

type SitePage = {
  documentId?: string;
  title: string;
  slug: string;
  pageType?: "home" | "story" | "private-dining" | "contact" | "careers" | "franchise" | "happenings" | "specials" | "custom";
  location?: { slug?: string } | null;
  heroEyebrow?: string;
  heroTitle?: string;
  heroAccent?: string;
  heroDescription?: string;
  heroImage?: { url?: string };
  sections?: ContentSection[];
  formConfig?: FormConfig;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
};

type Happening = {
  documentId?: string;
  title: string;
  slug: string;
  happeningType?: "event" | "special";
  enabled?: boolean;
  featured?: boolean;
  eyebrow?: string;
  summary?: string;
  details?: string;
  startsAt?: string;
  endsAt?: string;
  schedule?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  image?: { url?: string };
  locations?: Array<{ slug?: string }>;
  priority?: number;
};

type Location = {
  name: string;
  slug: string;
  state: string;
  address: string;
  city: string;
  phone?: string;
  hours?: string;
  orderUrl?: string;
  reservationUrl?: string;
  contactEmail?: string;
  privateDiningEmail?: string;
  locationStatus?: string;
};

type PublicContent = {
  pages?: SitePage[];
  locations?: Location[];
  happenings?: Happening[];
  settings?: { contactEmail?: string; franchiseEmail?: string };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kitchen-master-two.vercel.app";
const DEFAULT_EMAIL = "switham.gca@gmail.com";

const FALLBACK_LOCATIONS: Location[] = [
  { name:"Suwanee",slug:"suwanee",state:"Georgia",address:"3131 Lawrenceville-Suwanee Rd, Ste B5",city:"Suwanee, GA 30024",phone:"470-589-1112",hours:"Tue–Fri 4:30–10 · Sat 11–10 · Sun 12–9:30",orderUrl:"https://order.toasttab.com/online/kitchen-master-bistro-2-3131-lawrenceville-suwanee-rd-b5",reservationUrl:"https://resy.com/cities/suwanee-ga/venues/kitchen-master-suwanee",contactEmail:DEFAULT_EMAIL,privateDiningEmail:DEFAULT_EMAIL,locationStatus:"open" },
  { name:"Frisco",slug:"frisco",state:"Texas",address:"9285 Preston Rd",city:"Frisco, TX 75033",phone:"469-362-8001",hours:"Mon–Thu 11–2:30, 4:30–9 · Fri–Sat until 9:30",orderUrl:"https://order.toasttab.com/online/kitchen-master-bistro-9285-preston-rd",reservationUrl:"https://www.kitchenmasterbistro.com/reservations-frisco",contactEmail:DEFAULT_EMAIL,privateDiningEmail:DEFAULT_EMAIL,locationStatus:"open" },
  { name:"Southlake",slug:"southlake",state:"Texas",address:"3311 E State Hwy 114",city:"Southlake, TX 76092",phone:"214-724-5600",hours:"Tue–Thu 11–9 · Fri–Sat 11–10",orderUrl:"https://order.toasttab.com/online/kitchen-master-bistro-southlake-3311-w-state-hwy-114",reservationUrl:"tel:+12147245600",contactEmail:DEFAULT_EMAIL,privateDiningEmail:DEFAULT_EMAIL,locationStatus:"open" },
  { name:"Midtown Atlanta",slug:"midtown",state:"Georgia",address:"Address to be announced",city:"Atlanta, GA",phone:"Coming soon",hours:"Opening details coming soon",contactEmail:DEFAULT_EMAIL,privateDiningEmail:DEFAULT_EMAIL,locationStatus:"coming-soon" },
];

const FALLBACK_PAGES: Record<string, SitePage> = {
  "private-dining": {
    title:"Private Dining",slug:"private-dining",heroEyebrow:"Private dining",heroTitle:"Your occasion.",heroAccent:"Our craft.",
    heroDescription:"From milestone dinners to company gatherings, our team will help shape a generous, memorable experience around your guests.",
    sections:[
      { eyebrow:"Made for gathering",heading:"A table that feels like yours.",body:"Tell us what you are celebrating, how many guests you expect, and the atmosphere you have in mind. Our restaurant team will follow up about availability, room options, menus, and minimums." },
      { eyebrow:"Thoughtfully hosted",heading:"Dinner, with every detail considered.",body:"Private dining options vary by restaurant. We can help with family-style menus, business dinners, birthdays, receptions, and other group occasions." },
    ],formConfig:{formEyebrow:"Event inquiry",formTitle:"Plan with {{location}}.",formDescription:"Required fields help us route your message to the right team.",submitLabel:"Request event details",eventTypeOptions:["Birthday","Wedding or rehearsal dinner","Corporate event","Family gathering","Reception","Other"]},
  },
  contact: {
    title:"Contact",slug:"contact",heroEyebrow:"Contact us",heroTitle:"We’re here to",heroAccent:"help.",
    heroDescription:"Questions about a visit, feedback for our team, or help with an order? Send a note directly to your Kitchen Master location.",
    sections:[{ eyebrow:"Your neighborhood team",heading:"Let’s start a conversation.",body:"Choose the restaurant your message is about and share as much detail as you can. The location team will review your note and respond as soon as possible." }],formConfig:{formEyebrow:"Send a note",formTitle:"Contact {{location}}.",formDescription:"Required fields help us route your message to the right team.",submitLabel:"Send message",subjectOptions:["General question","Order support","Feedback about a visit","Press or partnership","Other"]},
  },
  franchise: {
    title:"Franchise Opportunities",slug:"franchise",heroEyebrow:"Franchise opportunities",heroTitle:"Grow with",heroAccent:"Kitchen Master.",
    heroDescription:"We are exploring thoughtful growth with experienced operators who value hospitality, consistency, and craft.",
    sections:[
      { eyebrow:"The right partnership",heading:"Built for hands-on operators.",body:"We are interested in partners who understand their market, care deeply about guest experience, and are ready to protect the standards behind every Kitchen Master meal." },
      { eyebrow:"Start the conversation",heading:"Tell us where you want to grow.",body:"Share your target market, operating background, and investment readiness. Submitting an inquiry does not guarantee territory availability or approval; our team will follow up when there may be a fit." },
    ],formConfig:{formEyebrow:"Franchise inquiry",formTitle:"Introduce yourself.",formDescription:"Required fields help us route your message to the right team.",submitLabel:"Submit franchise inquiry",experienceOptions:["Restaurant owner or operator","Multi-unit operator","Hospitality management","Business ownership outside hospitality","New to ownership"],investmentRangeOptions:["Under $500,000","$500,000–$1 million","$1–$2 million","$2 million+"]},
  },
  happenings: {
    title:"Happenings",slug:"happenings",pageType:"happenings",heroEyebrow:"Specials · Events",heroTitle:"What’s happening",heroAccent:"at Kitchen Master.",
    heroDescription:"Seasonal specials, happy hour notes, and gatherings worth putting on your calendar.",
  },
  specials: {
    title:"Specials",slug:"specials",pageType:"specials",heroEyebrow:"Happenings · Specials",heroTitle:"From the kitchen",heroAccent:"right now.",
    heroDescription:"Limited dishes and seasonal ideas from your selected Kitchen Master.",
  },
};

async function getContent(preview = false, fresh = false): Promise<PublicContent> {
  try {
    const secret = process.env.STRAPI_PREVIEW_SECRET;
    const query = preview && secret ? `?preview=1&previewSecret=${encodeURIComponent(secret)}` : "";
    const response = await fetch(`${cmsUrl}/api/kitchen-master-content${query}`, preview || fresh ? { cache:"no-store" } : { next:{ revalidate:60 } });
    if (!response.ok) return {};
    return await response.json() as PublicContent;
  } catch {
    return {};
  }
}

function resolvePage(content: PublicContent, slug: string, locationSlug?: string) {
  const fallback = FALLBACK_PAGES[slug];
  const pageType = slug === "private-dining" || slug === "contact" || slug === "franchise" || slug === "happenings" || slug === "specials" ? slug : null;
  const candidates = content.pages?.filter((page) => (pageType && page.pageType === pageType) || page.slug === slug || page.documentId === slug) ?? [];
  const globalPage = candidates.find((page) => !page.location);
  const locationPage = locationSlug ? candidates.find((page) => page.location?.slug === locationSlug) : undefined;
  const directPage = candidates.find((page) => page.slug === slug || page.documentId === slug);
  const cmsPage = locationPage ?? globalPage ?? directPage;
  if (!cmsPage) return fallback ?? null;
  const base = globalPage && globalPage !== cmsPage ? { ...(fallback ?? {}), ...globalPage } : fallback;
  return {
    ...base,
    ...cmsPage,
    sections: cmsPage.sections?.length ? cmsPage.sections : globalPage?.sections?.length ? globalPage.sections : fallback?.sections,
    formConfig: { ...(fallback?.formConfig ?? {}), ...(globalPage?.formConfig ?? {}), ...(cmsPage.formConfig ?? {}) },
  } as SitePage;
}

function resolveLocation(content: PublicContent, locationSlug?: string) {
  const locations = content.locations?.length ? content.locations : FALLBACK_LOCATIONS;
  return { locations, selected: locations.find((location) => location.slug === locationSlug) ?? locations[0] };
}

function imageUrl(page: SitePage) {
  const url = page.heroImage?.url;
  if (!url) return null;
  return url.startsWith("/") ? `${cmsUrl}${url}` : url;
}

function happeningImageUrl(item: Happening) {
  const url = item.image?.url;
  if (!url) return null;
  return url.startsWith("/") ? `${cmsUrl}${url}` : url;
}

function locationField(locations: Location[], selected: Location, label = "Restaurant") {
  return <label>{label}<select name="location" defaultValue={selected.slug} required>{locations.map((location) => <option value={location.slug} key={location.slug}>{location.name}{location.locationStatus === "coming-soon" ? " — Coming soon" : ""}</option>)}</select></label>;
}

function ContactForm({ locations, selected, config }: { locations: Location[]; selected: Location; config: FormConfig }) {
  const subjects = config.subjectOptions?.length ? config.subjectOptions : ["General question", "Order support", "Feedback about a visit", "Press or partnership", "Other"];
  return <form className="inquiry-form" action="/api/inquiry" method="post">
    <input type="hidden" name="inquiryType" value="contact" />
    <label>Full name<input name="name" autoComplete="name" required /></label>
    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    <label>Phone<input name="phone" type="tel" autoComplete="tel" /></label>
    {locationField(locations, selected)}
    <label className="form-wide">What can we help with?<select name="subject" required defaultValue=""><option value="" disabled>Select a subject</option>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select></label>
    <label className="form-wide">Message<textarea name="message" rows={6} required /></label>
    <button className="button button-red" type="submit">{config.submitLabel || "Send message"} →</button>
  </form>;
}

function PrivateDiningForm({ locations, selected, config }: { locations: Location[]; selected: Location; config: FormConfig }) {
  const eventTypes = config.eventTypeOptions?.length ? config.eventTypeOptions : ["Birthday", "Wedding or rehearsal dinner", "Corporate event", "Family gathering", "Reception", "Other"];
  return <form className="inquiry-form" action="/api/inquiry" method="post">
    <input type="hidden" name="inquiryType" value="private-dining" />
    <label>Full name<input name="name" autoComplete="name" required /></label>
    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    <label>Phone<input name="phone" type="tel" autoComplete="tel" required /></label>
    {locationField(locations, selected)}
    <label>Preferred date<input name="eventDate" type="date" required /></label>
    <label>Estimated guest count<input name="partySize" type="number" min="1" max="500" required /></label>
    <label className="form-wide">Occasion<select name="eventType" required defaultValue=""><option value="" disabled>Select an occasion</option>{eventTypes.map((eventType) => <option key={eventType}>{eventType}</option>)}</select></label>
    <label className="form-wide">Tell us about your event<textarea name="message" rows={6} placeholder="Timing, menu preferences, accessibility needs, and anything else that will help us plan." required /></label>
    <button className="button button-red" type="submit">{config.submitLabel || "Request event details"} →</button>
  </form>;
}

function FranchiseForm({ locations, selected, config }: { locations: Location[]; selected: Location; config: FormConfig }) {
  const experienceOptions = config.experienceOptions?.length ? config.experienceOptions : ["Restaurant owner or operator", "Multi-unit operator", "Hospitality management", "Business ownership outside hospitality", "New to ownership"];
  const investmentOptions = config.investmentRangeOptions?.length ? config.investmentRangeOptions : ["Under $500,000", "$500,000–$1 million", "$1–$2 million", "$2 million+"];
  return <form className="inquiry-form" action="/api/inquiry" method="post">
    <input type="hidden" name="inquiryType" value="franchise" />
    <label>Full name<input name="name" autoComplete="name" required /></label>
    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    <label>Phone<input name="phone" type="tel" autoComplete="tel" required /></label>
    {locationField(locations, selected, "Preferred Kitchen Master")}
    <label>Target city and state<input name="targetMarket" required /></label>
    <label>Hospitality experience<select name="experience" required defaultValue=""><option value="" disabled>Select one</option>{experienceOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
    <label>Expected investment range<select name="investmentRange" required defaultValue=""><option value="" disabled>Select one</option>{investmentOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
    <label className="form-wide">Why Kitchen Master?<textarea name="message" rows={6} placeholder="Tell us about your market, operating background, and why you are interested in Kitchen Master." required /></label>
    <button className="button button-red" type="submit">{config.submitLabel || "Submit franchise inquiry"} →</button>
  </form>;
}

export async function generateMetadata({ params, searchParams }: { params:Promise<{slug:string}>; searchParams:Promise<{preview?:string;location?:string}> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "our-story") return {};
  const query = await searchParams;
  const content = await getContent(query.preview === "1");
  const { selected } = resolveLocation(content, query.location);
  const page = resolvePage(content, slug, selected.slug);
  if (!page) return {};
  return { title:{ absolute:page.seoTitle || page.title }, description:page.seoDescription || page.heroDescription, alternates:{ canonical:page.canonicalUrl || `${siteUrl}/pages/${page.slug}` }, robots:query.preview === "1" || page.noIndex ? { index:false,follow:false } : undefined };
}

export default async function CmsPage({ params, searchParams }: { params:Promise<{slug:string}>; searchParams:Promise<{preview?:string;location?:string;submitted?:string}> }) {
  const { slug } = await params;
  if (slug === "our-story") notFound();
  const query = await searchParams;
  const content = await getContent(query.preview === "1");
  const { locations, selected } = resolveLocation(content, query.location);
  const page = resolvePage(content, slug, selected.slug);
  if (!page) notFound();
  const background = imageUrl(page);
  const isInquiryPage = slug === "contact" || slug === "private-dining" || slug === "franchise";
  const isHappeningsPage = slug === "happenings";
  const isSpecialsPage = slug === "specials";
  const formConfig = page.formConfig ?? {};
  const locationCopy = (value: string) => value.replaceAll("{{location}}", selected.name);
  const now = Date.now();
  const happenings = (content.happenings ?? [])
    .filter((item) => item.enabled !== false)
    .filter((item) => !item.endsAt || new Date(item.endsAt).getTime() >= now)
    .filter((item) => !item.locations?.length || item.locations.some((location) => location.slug === selected.slug))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.priority ?? 0) - Number(a.priority ?? 0) || new Date(a.startsAt ?? 0).getTime() - new Date(b.startsAt ?? 0).getTime());
  const events = happenings.filter((item) => item.happeningType !== "special");
  const specials = happenings.filter((item) => item.happeningType === "special");

  return <main className={`cms-page interior-page${isInquiryPage ? " inquiry-page" : ""}${isHappeningsPage || isSpecialsPage ? " happenings-page" : ""}${isSpecialsPage ? " specials-page" : ""}`} style={background ? { backgroundImage:`linear-gradient(90deg,#11100ff2,#11100f88),url(${background})` } : undefined}>
    <SiteHeader location={selected} />
    {isInquiryPage ? <section className="form-page-layout">
      <div className="form-page-copy">
        <p className="kicker">{page.heroEyebrow || page.title}{(slug === "contact" || slug === "private-dining") && ` · ${selected.name}`}</p>
        <h1>{page.heroTitle || page.title}<br/><em>{page.heroAccent}</em></h1>
        {page.heroDescription && <p className="form-page-description">{page.heroDescription}</p>}
        {(slug === "contact" || slug === "private-dining") && <aside className="page-location-card"><small>YOUR SELECTED RESTAURANT</small><h3>{selected.name}</h3><p>{selected.address}<br/>{selected.city}</p>{selected.phone && <a href={`tel:${selected.phone.replace(/[^\d+]/g, "")}`}>{selected.phone}</a>}{selected.hours && <p>{selected.hours}</p>}</aside>}
      </div>
      <div className="inquiry-panel">
        {query.submitted === "1" ? <section className="inquiry-success"><small>MESSAGE RECEIVED</small><h2>Thank you.</h2><p>{slug === "franchise" ? "Our development team will review your information and follow up when there may be a fit." : `Your message has been sent to the ${selected.name} team.`}</p></section> : <>
          <div className="inquiry-form-intro"><small>{formConfig.formEyebrow || (slug === "contact" ? "SEND A NOTE" : slug === "private-dining" ? "EVENT INQUIRY" : "FRANCHISE INQUIRY")}</small><h2>{formConfig.formTitle ? locationCopy(formConfig.formTitle) : slug === "contact" ? `Contact ${selected.name}.` : slug === "private-dining" ? `Plan with ${selected.name}.` : "Introduce yourself."}</h2><p>{formConfig.formDescription || "Required fields help us route your message to the right team."}</p></div>
          {slug === "contact" ? <ContactForm locations={locations} selected={selected} config={formConfig} /> : slug === "private-dining" ? <PrivateDiningForm locations={locations} selected={selected} config={formConfig} /> : <FranchiseForm locations={locations} selected={selected} config={formConfig} />}
        </>}
      </div>
    </section> : <>
      <section className="cms-page-hero">
        <p className="kicker">{page.heroEyebrow || page.title}</p>
        <h1>{page.heroTitle || page.title}<br/><em>{page.heroAccent}</em></h1>
        {page.heroDescription && <p>{page.heroDescription}</p>}
      </section>
      {isHappeningsPage ? <HappeningsCalendar locationName={selected.name} items={events.map((item) => ({
      id:item.documentId || item.slug,slug:item.slug,title:item.title,type:item.happeningType === "special" ? "special" : "event",eyebrow:item.eyebrow,summary:item.summary,details:item.details,
      startsAt:item.startsAt,endsAt:item.endsAt,schedule:item.schedule,buttonLabel:item.buttonLabel,buttonUrl:item.buttonUrl,imageUrl:happeningImageUrl(item),
    }))} /> : isSpecialsPage ? <section className="specials-list" aria-label={`Current specials at Kitchen Master ${selected.name}`}>
      {specials.length ? specials.map((item) => <article className={happeningImageUrl(item) ? undefined : "special-card-no-image"} id={`special-${item.slug}`} key={item.documentId || item.slug}>
        {happeningImageUrl(item) && <img src={happeningImageUrl(item) as string} alt="" />}
        <div><div className="special-meta"><span>{item.eyebrow || "Weekly special"}</span><span>{item.schedule || "Available now"}</span></div><h2>{item.title}</h2>{item.summary && <p>{item.summary}</p>}{item.details && <p className="special-details">{item.details}</p>}{item.buttonUrl && <a className="under-link" href={item.buttonUrl}>{item.buttonLabel || "Learn more"} <span>→</span></a>}</div>
      </article>) : <div className="calendar-empty"><strong>No specials are posted yet.</strong><span>New dishes for {selected.name} will appear here.</span></div>}
    </section> : page.sections?.map((section, index) => <section className="cms-content-block" key={index}>{section.eyebrow && <small>{section.eyebrow}</small>}{section.heading && <h2>{section.heading}</h2>}{section.body && <p>{section.body}</p>}{section.linkUrl && <a className="button button-red" href={section.linkUrl}>{section.linkLabel || "Learn more"} →</a>}</section>)}
    </>}
  </main>;
}
