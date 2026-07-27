import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { AgeGate } from "@/components/layout/age-gate";
import { Toaster } from "@/components/ui/toaster";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://eyce.example"),
  title: {
    default: "EYCE — Silicone-First Smoking Gear",
    template: "%s · EYCE",
  },
  description:
    "Bongs, rigs, and pipes engineered from platinum-cured silicone. Drop them, freeze them, live with them.",
  openGraph: {
    title: "EYCE — Silicone-First Smoking Gear",
    description: "Bongs, rigs, and pipes engineered from platinum-cured silicone.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable} dark`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AgeGate />
        <AnnouncementBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
