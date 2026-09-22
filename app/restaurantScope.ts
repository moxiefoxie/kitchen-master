export type RestaurantScope = "all" | "suwanee" | "frisco" | "southlake" | "midtown" | "multiple";

export function contentAppliesToLocation(
  scope: string | undefined,
  locationSlugs: string[] | undefined,
  selectedSlug: string,
) {
  if (scope === "all") return true;
  if (scope && scope !== "multiple") return scope === selectedSlug;
  return !locationSlugs?.length || locationSlugs.includes(selectedSlug);
}
