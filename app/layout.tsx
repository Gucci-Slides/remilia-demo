import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT TYPEFACE STACK — FREE FONTS ONLY (via next/font/google)
//
// TIER I   LABEL:    IBM Plex Mono
// TIER II  STATE:    Inter
// TIER III MONUMENT: Inter (legal header style — wide tracking, authoritative)
// TIER IV  ARCHIVE:  Source Serif 4
//
// NO PAID FONTS. NO EXCEPTIONS.
// ═══════════════════════════════════════════════════════════════════════════════

// TIER I — LABEL (IBM Plex Mono)
// Uppercase metadata, small, tracked
const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// TIER II + III — STATE + MONUMENT (Inter)
// Monument: legal header (wide tracking, semibold)
// State: system status (narrower tracking, medium)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// TIER IV — ARCHIVE (Source Serif 4)
// Dense record text, logs, historical entries
const sourceSerif4 = Source_Serif_4({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-archive",
  display: "swap",
});

export const metadata: Metadata = {
  title: "REMILIA",
  description: "A Network State",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexMono.variable} ${inter.variable} ${sourceSerif4.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
