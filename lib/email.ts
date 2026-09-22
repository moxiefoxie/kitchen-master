import { createHash } from "node:crypto";

const RESEND_API_URL = "https://api.resend.com";

export type EmailAttachment = {
  filename: string;
  content: string;
};

type EmailTag = {
  name: string;
  value: string;
};

export type TransactionalEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
  tags?: EmailTag[];
  idempotencyKey?: string;
};

type EmailResult = {
  ok: boolean;
  status: number;
};

type MarketingSignupResult = EmailResult & {
  created: boolean;
};

function apiKey() {
  return process.env.RESEND_API_KEY?.trim() ?? "";
}

function emailFrom() {
  return process.env.EMAIL_FROM?.trim() ?? "";
}

function segmentIds(preferredLocation: string) {
  const ids = new Set<string>();
  const primary = process.env.INSIDERS_SEGMENT_ID?.trim();
  if (primary) ids.add(primary);

  const configuredLocations = process.env.INSIDERS_LOCATION_SEGMENTS;
  if (configuredLocations) {
    try {
      const locations = JSON.parse(configuredLocations) as Record<string, unknown>;
      const locationSegment = locations[preferredLocation];
      if (typeof locationSegment === "string" && locationSegment.trim()) {
        ids.add(locationSegment.trim());
      }
    } catch {
      console.error("[email] INSIDERS_LOCATION_SEGMENTS must be a JSON object.");
    }
  }

  return [...ids];
}

async function resend(path: string, init: RequestInit) {
  return fetch(`${RESEND_API_URL}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${apiKey()}`,
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...init.headers,
    },
    signal: AbortSignal.timeout(15_000),
  }).catch(() => null);
}

export function transactionalEmailConfigured() {
  return Boolean(apiKey() && emailFrom());
}

export function marketingEmailConfigured() {
  return Boolean(apiKey() && process.env.INSIDERS_SEGMENT_ID?.trim());
}

export function submissionIdempotencyKey(kind: string, values: Record<string, string>) {
  const digest = createHash("sha256")
    .update(JSON.stringify(Object.entries(values).sort(([left], [right]) => left.localeCompare(right))))
    .digest("hex")
    .slice(0, 32);
  return `website-${kind}/${digest}`;
}

export function attachmentDigest(content: string) {
  return createHash("sha256").update(content).digest("hex").slice(0, 24);
}

export async function sendTransactionalEmail(message: TransactionalEmail): Promise<EmailResult> {
  if (!transactionalEmailConfigured()) return { ok: false, status: 503 };

  const response = await resend("/emails", {
    method: "POST",
    headers: message.idempotencyKey ? { "idempotency-key": message.idempotencyKey } : undefined,
    body: JSON.stringify({
      from: emailFrom(),
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      ...(message.attachments?.length ? { attachments: message.attachments } : {}),
      ...(message.tags?.length ? { tags: message.tags } : {}),
    }),
  });

  if (!response?.ok) {
    const details = response ? await response.text().catch(() => "") : "";
    console.error(`[email] Resend email request failed with status ${response?.status ?? "network-error"}: ${details.slice(0, 1000)}`);
  }
  return { ok: response?.ok ?? false, status: response?.status ?? 502 };
}

export async function subscribeMarketingContact(email: string, preferredLocation: string): Promise<MarketingSignupResult> {
  if (!marketingEmailConfigured()) return { ok: false, status: 503, created: false };

  const normalizedEmail = email.trim().toLowerCase();
  const segments = segmentIds(preferredLocation);
  const response = await resend("/contacts", {
    method: "POST",
    body: JSON.stringify({
      email: normalizedEmail,
      unsubscribed: false,
      segments: segments.map((id) => ({ id })),
    }),
  });

  if (response?.ok) return { ok: true, status: response.status, created: true };

  // An existing contact may be subscribed elsewhere or globally opted out. Add
  // the requested segments without changing their global unsubscribe status.
  if (response?.status === 409) {
    const additions = await Promise.all(segments.map((segmentId) => resend(
      `/contacts/${encodeURIComponent(normalizedEmail)}/segments/${encodeURIComponent(segmentId)}`,
      { method: "POST" },
    )));
    const ok = additions.every((addition) => addition?.ok || addition?.status === 409);
    return { ok, status: ok ? 200 : 502, created: false };
  }

  console.error(`[email] Resend contact request failed with status ${response?.status ?? "network-error"}.`);
  return { ok: false, status: response?.status ?? 502, created: false };
}

export function subscriberKey(email: string) {
  const digest = createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 32);
  return `insiders-welcome/${digest}`;
}
