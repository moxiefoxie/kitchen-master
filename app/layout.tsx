import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://kitchen-master-two.vercel.app"),
  title: { default: "Kitchen Master | Taiwanese & Japanese Dining", template: "%s | Kitchen Master" },
  description: "Handcrafted soup dumplings, fresh sushi, and bold modern plates at Kitchen Master restaurants in Georgia and Texas.",
  keywords: ["Kitchen Master", "soup dumplings", "sushi", "Taiwanese restaurant", "Japanese restaurant"],
  openGraph: { type: "website", siteName: "Kitchen Master", title: "Kitchen Master", description: "Taiwanese craft and Japanese precision, served in Georgia and Texas." },
  icons: { icon: "/images/logo.jpeg", shortcut: "/images/logo.jpeg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
