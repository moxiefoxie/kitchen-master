import { STRAPI_URL } from "@/lib/strapi";

export const DEFAULT_HIRING_ROLES = [
  "Front of house",
  "Server",
  "Bartender",
  "Host",
  "Kitchen",
  "Sushi chef",
  "Management",
  "Other",
] as const;

export type CareersLocation = {
  name: string;
  slug: string;
  state: string;
  orderUrl?: string;
  reservationUrl?: string;
  hiringEmail?: string;
  hiringRoles: string[];
  availableLocations: Array<{ name: string; slug: string; comingSoon: boolean }>;
  careerPage?: {
    heroEyebrow?: string;
    heroTitle?: string;
    heroAccent?: string;
    heroDescription?: string;
    formEyebrow?: string;
    formTitle?: string;
    formDescription?: string;
    submitLabel?: string;
  };
};

type CmsLocation = {
  name?: unknown;
  slug?: unknown;
  state?: unknown;
  orderUrl?: unknown;
  reservationUrl?: unknown;
  hiringEmail?: unknown;
  hiringRoles?: unknown;
  locationStatus?: unknown;
};

type CmsCareerPage = {
  pageType?: unknown;
  slug?: unknown;
  location?: { slug?: unknown } | null;
  heroEyebrow?: unknown;
  heroTitle?: unknown;
  heroAccent?: unknown;
  heroDescription?: unknown;
  formConfig?: unknown;
};

function hiringRoles(value: unknown): string[] {
  if (!Array.isArray(value)) return [...DEFAULT_HIRING_ROLES];

  const roles = value
    .map((role) => {
      if (typeof role === "string") return role.trim();
      if (role && typeof role === "object" && "name" in role && typeof role.name === "string") {
        return role.name.trim();
      }
      return "";
    })
    .filter((role, index, all) => role.length > 0 && all.indexOf(role) === index);

  return roles.length > 0 ? roles : [...DEFAULT_HIRING_ROLES];
}

export async function getCareersLocation(slug: string, fresh = false): Promise<CareersLocation | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;

  const response = await fetch(`${STRAPI_URL}/api/kitchen-master-content`, fresh
    ? { cache: "no-store" }
    : { next: { revalidate: 60 } });

  if (!response.ok) return null;

  const payload = await response.json() as { locations?: CmsLocation[]; pages?: CmsCareerPage[] };
  const location = payload.locations?.find((entry) => entry.slug === slug);
  if (!location || typeof location.name !== "string" || typeof location.state !== "string") return null;
  const configuredEmail = typeof location.hiringEmail === "string" ? location.hiringEmail.trim() : "";
  const careerPages = payload.pages?.filter((page) => page.pageType === "careers") ?? [];
  const globalPage = careerPages.find((page) => !page.location);
  const locationPage = careerPages.find((page) => page.location?.slug === slug);
  const careerPage = locationPage ?? globalPage;
  const pageValue = (key: keyof CmsCareerPage) => {
    const value = careerPage?.[key] ?? globalPage?.[key];
    return typeof value === "string" && value.trim() ? value : undefined;
  };
  const formConfig = careerPage?.formConfig && typeof careerPage.formConfig === "object" && !Array.isArray(careerPage.formConfig)
    ? careerPage.formConfig as Record<string, unknown>
    : {};
  const formValue = (key: string) => typeof formConfig[key] === "string" && String(formConfig[key]).trim()
    ? String(formConfig[key])
    : undefined;

  return {
    name: location.name,
    slug,
    state: location.state,
    orderUrl: typeof location.orderUrl === "string" ? location.orderUrl : undefined,
    reservationUrl: typeof location.reservationUrl === "string" ? location.reservationUrl : undefined,
    hiringEmail: /^\S+@\S+\.\S+$/.test(configuredEmail) ? configuredEmail : undefined,
    hiringRoles: hiringRoles(location.hiringRoles),
    availableLocations: (payload.locations ?? []).flatMap((entry) => typeof entry.name === "string" && typeof entry.slug === "string"
      ? [{ name:entry.name, slug:entry.slug, comingSoon:entry.locationStatus === "coming-soon" }]
      : []),
    careerPage: careerPage ? {
      heroEyebrow: pageValue("heroEyebrow"),
      heroTitle: pageValue("heroTitle"),
      heroAccent: pageValue("heroAccent"),
      heroDescription: pageValue("heroDescription"),
      formEyebrow: formValue("formEyebrow"),
      formTitle: formValue("formTitle"),
      formDescription: formValue("formDescription"),
      submitLabel: formValue("submitLabel"),
    } : undefined,
  };
}
