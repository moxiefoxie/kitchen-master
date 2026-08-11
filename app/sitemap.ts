import type { MetadataRoute } from "next";
const siteUrl=process.env.NEXT_PUBLIC_SITE_URL??"https://kitchen-master-two.vercel.app";
const cmsUrl=process.env.STRAPI_URL??process.env.NEXT_PUBLIC_STRAPI_URL;
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const entries:MetadataRoute.Sitemap=[{url:siteUrl,changeFrequency:"weekly",priority:1}];if(!cmsUrl)return entries;try{const response=await fetch(`${cmsUrl.replace(/\/$/,"")}/api/kitchen-master-content`,{next:{revalidate:3600}});const payload=await response.json();for(const location of payload.locations??[])entries.push({url:`${siteUrl}/locations/${location.slug}`,changeFrequency:"weekly",priority:.9});}catch{}return entries;}
