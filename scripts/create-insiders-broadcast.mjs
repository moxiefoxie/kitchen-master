import { readFile } from "node:fs/promises";

const required = ["RESEND_API_KEY", "EMAIL_FROM", "INSIDERS_SEGMENT_ID", "NEXT_PUBLIC_SITE_URL"];
const missing = required.filter((name) => !process.env[name]?.trim());
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exitCode = 1;
} else {
  const templateUrl = new URL("../emails/insiders-launch.html", import.meta.url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const html = (await readFile(templateUrl, "utf8")).replaceAll("{{SITE_URL}}", siteUrl);

  const response = await fetch("https://api.resend.com/broadcasts", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      segment_id: process.env.INSIDERS_SEGMENT_ID,
      from: process.env.EMAIL_FROM,
      name: "Kitchen Master Insiders — Launch",
      subject: "There’s always room at our table",
      html,
    }),
  }).catch(() => null);

  if (!response?.ok) {
    console.error(`Could not create the Resend draft (status ${response?.status ?? "network-error"}).`);
    process.exitCode = 1;
  } else {
    const result = await response.json();
    console.log(`Created Resend broadcast draft: ${result.id}`);
  }
}
