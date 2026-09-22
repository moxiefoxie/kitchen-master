type InquiryType = "contact" | "private-dining" | "franchise";

const BRAND_RED = "#882020";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function title(value: string) {
  return value.replaceAll("-", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function shell(eyebrow: string, heading: string, content: string, footer: string) {
  return `<!doctype html>
<html lang="en"><body style="margin:0;background:#f2eee7;color:#171513;font-family:Georgia,serif">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2eee7;padding:30px 14px"><tr><td align="center">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fffdf9;border:1px solid #d3cbc0">
      <tr><td style="padding:38px 42px 22px;border-bottom:4px solid ${BRAND_RED}">
        <p style="margin:0 0 12px;color:${BRAND_RED};font:700 11px Arial,sans-serif;letter-spacing:2px;text-transform:uppercase">${escapeHtml(eyebrow)}</p>
        <h1 style="margin:0;font:400 38px/1.08 Georgia,serif">${escapeHtml(heading)}</h1>
      </td></tr>
      <tr><td style="padding:32px 42px">${content}</td></tr>
      <tr><td style="padding:22px 42px;background:#171513;color:#c7c0b7;font:12px/1.5 Arial,sans-serif">${escapeHtml(footer)}</td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function detailsTable(rows: Array<[string, string]>) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows
    .filter(([, value]) => value)
    .map(([label, value]) => `<tr>
      <td style="width:155px;padding:10px 14px 10px 0;border-bottom:1px solid #e4ded5;color:#746e67;font:700 10px Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #e4ded5;font:16px/1.5 Georgia,serif;white-space:pre-wrap">${escapeHtml(value)}</td>
    </tr>`).join("")}</table>`;
}

const inquiryLabels: Record<InquiryType, string> = {
  contact: "Website contact",
  "private-dining": "Private dining inquiry",
  franchise: "Franchise inquiry",
};

export function inquiryEmail(input: {
  type: InquiryType;
  locationName: string;
  values: Record<string, string>;
}) {
  const { type, locationName, values } = input;
  const rows: Array<[string, string]> = [
    ["Name", values.name],
    ["Email", values.email],
    ["Phone", values.phone],
    ["Restaurant", locationName],
  ];
  if (type === "contact") rows.push(["Subject", values.subject]);
  if (type === "private-dining") rows.push(
    ["Preferred date", values.eventDate],
    ["Guest count", values.partySize],
    ["Occasion", values.eventType],
  );
  if (type === "franchise") rows.push(
    ["Target market", values.targetMarket],
    ["Experience", values.experience],
    ["Investment range", values.investmentRange],
  );
  rows.push([type === "private-dining" ? "Event details" : "Message", values.message]);

  const heading = `${inquiryLabels[type]} from ${values.name}`;
  return {
    subject: `${inquiryLabels[type]} · ${locationName} · ${values.name}`,
    html: shell(inquiryLabels[type], heading, detailsTable(rows), "Kitchen Master website submission · Reply directly to reach the sender."),
    text: rows.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`).join("\n\n"),
  };
}

export function applicationEmail(input: {
  locationName: string;
  values: Record<string, string>;
}) {
  const rows: Array<[string, string]> = [
    ["Name", input.values.name],
    ["Email", input.values.email],
    ["Phone", input.values.phone],
    ["Restaurant", input.locationName],
    ["Role", input.values.role],
    ["Introduction", input.values.message],
  ];
  return {
    subject: `Career application · ${input.locationName} · ${input.values.name}`,
    html: shell("Career application", `A new applicant for ${input.locationName}`, detailsTable(rows), "The applicant’s résumé is attached. Reply directly to contact them."),
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n\n") + "\n\nThe applicant's resume is attached.",
  };
}

export function insidersWelcomeEmail(preferredLocation: string) {
  const locationName = title(preferredLocation);
  const content = `
    <p style="margin:0 0 20px;font:18px/1.7 Georgia,serif">You’re on the Kitchen Master Insiders list, with <strong>${escapeHtml(locationName)}</strong> saved as your preferred restaurant.</p>
    <p style="margin:0;font:16px/1.7 Georgia,serif;color:#5e5851">Look out for restaurant news, special events, and rewards created for people who love gathering around a great table.</p>`;
  return {
    subject: "Welcome to Kitchen Master Insiders",
    html: shell("Kitchen Master Insiders", "Your table has its advantages.", content, "You joined through the Kitchen Master website. Future campaign messages include an unsubscribe link."),
    text: `You're on the Kitchen Master Insiders list, with ${locationName} saved as your preferred restaurant.\n\nLook out for restaurant news, special events, and rewards.`,
  };
}
