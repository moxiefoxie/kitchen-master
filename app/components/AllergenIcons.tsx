import type { MenuAllergen } from "../menuData";

const ALLERGEN_LEGEND: MenuAllergen[] = [
  { name: "Milk", slug: "milk" },
  { name: "Eggs", slug: "eggs" },
  { name: "Fish", slug: "fish" },
  { name: "Shellfish", slug: "shellfish" },
  { name: "Tree nuts", slug: "tree-nuts" },
  { name: "Peanuts", slug: "peanuts" },
  { name: "Wheat", slug: "wheat" },
  { name: "Soy", slug: "soy" },
  { name: "Sesame", slug: "sesame" },
];

function Icon({ slug }: { slug: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (slug) {
    case "milk":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M8 3h7l2 4v14H7V7l1-4Zm-1 4h10M9 3l2 4" /></svg>;
    case "eggs":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M12 3c3 0 6 6.1 6 10.8a6 6 0 1 1-12 0C6 9.1 9 3 12 3Z" /></svg>;
    case "fish":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M4 12c2.8-4.5 7.8-6.2 12-2.7L21 6v12l-5-3.3C11.8 18.2 6.8 16.5 4 12Zm1 0H2m11-1h.01" /></svg>;
    case "shellfish":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M5 6c8-2 14 2 14 7.3 0 4.3-3.8 6.7-7.2 5.4-2.7-1-3.7-4.4-1.8-6.4 1.4-1.5 4.1-.9 4.1 1.3 0 1.2-.9 2-2 2M7.5 6.1l1.2 3M11.2 5.7l.3 3.1M15 7l-.7 2.6M5 6 3 3m2 3L2 7" /></svg>;
    case "tree-nuts":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M12 7c4 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3-7 7-7Zm0 0c-1.5-2.5-.6-4.2 2.5-4.5M8.4 9.2c2.2 1.3 4.2 1 6.9-.3" /></svg>;
    case "peanuts":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M9.4 3.5c2.3-.2 4.3 1.5 4.6 3.8.2 1.4.8 2 2.2 2.3a4.7 4.7 0 0 1-1.1 9.3c-2.3-.2-3.2-2-3.4-4.1-.2-1.6-.9-2.2-2.4-2.5a4.4 4.4 0 0 1 .1-8.8ZM7 7.4l4.7 4.7m.7-5 4.7 4.7M8.2 10l4.2-4.2m1.6 10 3.5-3.5" /></svg>;
    case "wheat":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M12 21V4m0 5C8.8 9 7 7.5 7 5c3.2 0 5 1.5 5 4Zm0 4c-3.2 0-5-1.5-5-4 3.2 0 5 1.5 5 4Zm0 4c-3.2 0-5-1.5-5-4 3.2 0 5 1.5 5 4Zm0-8c3.2 0 5-1.5 5-4-3.2 0-5 1.5-5 4Zm0 4c3.2 0 5-1.5 5-4-3.2 0-5 1.5-5 4Zm0 4c3.2 0 5-1.5 5-4-3.2 0-5 1.5-5 4Z" /></svg>;
    case "soy":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M4 15c3.2-7.7 9-10 16-8-1.4 7.6-6.8 11.7-14.8 10.2L4 15Zm5.2-1.2h.01m4.1-2.8h.01m3.4-1.9h.01" /></svg>;
    case "sesame":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M9.3 3.5c3.2 2.2 3.5 5.1.8 7.6-3.1-2.2-3.4-5-.8-7.6Zm6 7.5c3.2 2.2 3.5 5.1.8 7.6-3.1-2.2-3.4-5-.8-7.6ZM6.2 13c3.6 1.3 4.6 4 2.7 7-3.6-1.3-4.6-3.9-2.7-7Z" /></svg>;
    default:
      return <svg viewBox="0 0 24 24" aria-hidden="true"><circle {...common} cx="12" cy="12" r="8" /><path {...common} d="M12 8v5m0 3h.01" /></svg>;
  }
}

function AllergenIcon({ allergen }: { allergen: MenuAllergen }) {
  return <span className="allergen-icon" role="img" aria-label={`Contains ${allergen.name}`}><Icon slug={allergen.slug} /></span>;
}

export default function AllergenIcons({ allergens }: { allergens?: MenuAllergen[] }) {
  if (!allergens?.length) return null;

  return <div className="allergen-icons" aria-label="Major allergens">
    {allergens.map((allergen) => <AllergenIcon allergen={allergen} key={allergen.slug} />)}
  </div>;
}

export function AllergenLegend() {
  return <div className="allergen-legend" aria-label="Allergen icon legend">
    <strong>Allergen key</strong>
    {ALLERGEN_LEGEND.map((allergen) => <span className="allergen-legend-item" key={allergen.slug}>
      <AllergenIcon allergen={allergen} />
      <span>{allergen.name}</span>
    </span>)}
  </div>;
}
