import { notFound } from "next/navigation";

const FALLBACK_LOCATIONS: Record<string, { name: string; state: string; email: string }> = {
  suwanee: { name: "Suwanee", state: "Georgia", email: "Management@kitchenmasterga.com" },
  frisco: { name: "Frisco", state: "Texas", email: "Management@kitchenmasterga.com" },
  southlake: { name: "Southlake", state: "Texas", email: "Management@kitchenmasterga.com" },
  midtown: { name: "Midtown Atlanta", state: "Georgia", email: "Management@kitchenmasterga.com" },
};

export default async function CareersPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ submitted?: string }> }) {
  const { slug } = await params;
  const query = await searchParams;
  const location = FALLBACK_LOCATIONS[slug];
  if (!location) notFound();

  return <main className="careers-page">
    <header><a className="gateway-brand" href="/"><span className="brand-mark">KM</span><span>KITCHEN MASTER</span></a><a className="text-link" href={`/?location=${slug}`}>Back to restaurant →</a></header>
    <div className="careers-layout">
      <section className="careers-hero"><p className="kicker">Careers · {location.state}</p><h1>Bring your craft<br /><em>to {location.name}.</em></h1><p>We’re always interested in thoughtful, hardworking people who care about hospitality. Tell us where you shine and attach your resume.</p></section>
    {query.submitted === "1" ? <section className="application-success"><h2>Application received.</h2><p>Thank you. The {location.name} team will be in touch if your experience matches an opening.</p></section> :
    <form className="application-form" action="/api/apply" method="post" encType="multipart/form-data">
      <input type="hidden" name="location" value={slug} />
      <label>Full name<input name="name" autoComplete="name" required /></label>
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      <label>Phone<input name="phone" type="tel" autoComplete="tel" required /></label>
      <label>Role you’re interested in<select name="role" required defaultValue=""><option value="" disabled>Select a role</option><option>Front of house</option><option>Server</option><option>Bartender</option><option>Host</option><option>Kitchen</option><option>Sushi chef</option><option>Management</option><option>Other</option></select></label>
      <label className="form-wide">Tell us about yourself<textarea name="message" rows={4} required /></label>
      <label className="form-wide file-field">Resume (PDF, DOC, or DOCX; 10 MB max)<input name="resume" type="file" accept=".pdf,.doc,.docx" required /></label>
      <button className="button button-red" type="submit">Submit application →</button>
      <p className="form-note">Applications go directly to the {location.name} hiring team. Prefer email? <a href={`mailto:${location.email}`}>{location.email}</a></p>
    </form>}
    </div>
  </main>;
}
