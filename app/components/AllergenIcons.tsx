import type { MenuAllergen } from "../menuData";

const FALLBACK_LABELS: Record<string, string> = {
  milk: "M",
  eggs: "E",
  fish: "F",
  shellfish: "SH",
  "tree-nuts": "TN",
  peanuts: "P",
  wheat: "W",
  soy: "S",
  sesame: "SE",
};

export default function AllergenIcons({ allergens }: { allergens?: MenuAllergen[] }) {
  if (!allergens?.length) return null;

  return <div className="allergen-icons" aria-label="Major allergens">
    {allergens.map((allergen) => <abbr
      className="allergen-icon"
      title={`Contains ${allergen.name}`}
      aria-label={`Contains ${allergen.name}`}
      key={allergen.slug}
    >{allergen.shortLabel || FALLBACK_LABELS[allergen.slug] || allergen.name.slice(0, 2).toUpperCase()}</abbr>)}
  </div>;
}
