import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Location = { name:string;slug:string;address:string;city:string;state:string;phone?:string;hours?:string;latitude?:number;longitude?:number;locationStatus?:string;orderUrl?:string;reservationUrl?:string;seoTitle?:string;seoDescription?:string };
const cmsUrl = process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kitchen-master-two.vercel.app";

async function getLocation(slug:string):Promise<Location|null>{
  if(!cmsUrl)return null;
  const response=await fetch(`${cmsUrl.replace(/\/$/,"")}/api/kitchen-master-content`,{next:{revalidate:60}});
  if(!response.ok)return null;
  const payload=await response.json();
  return payload.locations?.find((location:Location)=>location.slug===slug)??null;
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const location=await getLocation(slug);if(!location)return {};
  const title=location.seoTitle||`Kitchen Master ${location.name}`;
  const description=location.seoDescription||`Menus, hours, reservations, and directions for Kitchen Master in ${location.city}.`;
  return {title,description,alternates:{canonical:`${siteUrl}/locations/${slug}`},openGraph:{title,description,type:"website",url:`${siteUrl}/locations/${slug}`}};
}

export default async function LocationPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const location=await getLocation(slug);if(!location)notFound();
  const structuredData={"@context":"https://schema.org","@type":"Restaurant",name:`Kitchen Master ${location.name}`,url:`${siteUrl}/locations/${slug}`,telephone:location.phone,address:{"@type":"PostalAddress",streetAddress:location.address,addressLocality:location.city,addressRegion:location.state,addressCountry:"US"},geo:location.latitude&&location.longitude?{"@type":"GeoCoordinates",latitude:location.latitude,longitude:location.longitude}:undefined,servesCuisine:["Taiwanese","Japanese","Chinese","Sushi"],openingHours:location.hours};
  return <main className="seo-location-page"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}}/><a className="gateway-brand" href={`/?location=${slug}`}><span className="brand-mark">KM</span><span>KITCHEN MASTER</span></a><div className="seo-location-copy"><p className="kicker">{location.state} · {location.locationStatus==="coming-soon"?"Coming soon":"Now open"}</p><h1>Kitchen Master<br/><em>{location.name}.</em></h1><p>{location.address}<br/>{location.city}</p><p>{location.hours}</p><div className="hero-actions"><a className="button button-red" href={`/?location=${slug}`}>Explore this location →</a>{location.reservationUrl&&<a className="text-link" href={location.reservationUrl}>Reserve a table →</a>}{location.orderUrl&&<a className="text-link" href={location.orderUrl}>Order online →</a>}</div></div></main>;
}
