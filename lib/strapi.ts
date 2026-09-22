const DEFAULT_STRAPI_URL = 'https://devoted-angel-d525a2a640.strapiapp.com';
const configuredStrapiUrl = process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL;
const configuredForTemporaryHost = configuredStrapiUrl
  ? /^https?:\/\/((localhost|127\.0\.0\.1)(:\d+)?|[^/]+\.trycloudflare\.com)(\/|$)/i.test(
      configuredStrapiUrl,
    )
  : false;

export const STRAPI_URL = (
  process.env.NODE_ENV === 'production' && configuredForTemporaryHost
    ? DEFAULT_STRAPI_URL
    : configuredStrapiUrl ?? DEFAULT_STRAPI_URL
).replace(/\/$/, '');
