import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { siteUrl, assetPath } from "@/lib/site";
const serif = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--serif",
  display: "swap",
});
const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--sans",
  display: "swap",
});
export const metadata: Metadata = {
  icons: { icon: assetPath("/icon.svg") },
  metadataBase: new URL(siteUrl + "/"),
  alternates: { canonical: siteUrl + "/" },
  title: {
    default: "BARE LISS. — Гладкость как состояние",
    template: "%s | BARE LISS.",
  },
  description:
    "Студия лазерной эпиляции BARE LISS. Технологии, комфорт и эстетика. Выберите зону и почувствуйте разницу.",
  openGraph: {
    title: "BARE LISS. SKIN STUDIO",
    description: "LESS HAIR. MORE SKIN.",
    images: [siteUrl + "/hero.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BARE LISS.",
    images: [siteUrl + "/hero.webp"],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
