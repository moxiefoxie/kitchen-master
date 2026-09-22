import HomeClient from "./HomeClient";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ location?: string }> }) {
  const query = await searchParams;
  const initialLocation = typeof query.location === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(query.location)
    ? query.location
    : undefined;

  return <HomeClient initialLocation={initialLocation} playIntro={!initialLocation} />;
}
