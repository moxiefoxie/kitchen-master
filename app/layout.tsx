import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kitchen Master | Taiwanese & Japanese Dining in Suwanee",
  description: "Handcrafted soup dumplings, fresh sushi, and bold modern plates in Suwanee, Georgia.",
  icons: { icon: "/images/logo.jpeg", shortcut: "/images/logo.jpeg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
