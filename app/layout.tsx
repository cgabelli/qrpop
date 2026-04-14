import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "QRpop — Trasforma il tuo QR code in un'esperienza",
    template: "%s | QRpop",
  },
  description:
    "QRpop ti permette di gestire i contenuti del tuo QR code in tempo reale. Carica immagini e video per i tuoi clienti direttamente dal telefono.",
  keywords: ["QR code", "ristorante", "menu digitale", "marketing", "QRpop"],
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://qrpop.it",
    siteName: "QRpop",
    title: "QRpop — Trasforma il tuo QR code in un'esperienza",
    description:
      "Gestisci i contenuti del tuo QR code in tempo reale. Per ristoranti e locali.",
  },
};

import { CookieBanner } from "@/components/CookieBanner";
import WhatsAppWidget from "@/components/WhatsAppWidget";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={inter.className}>
      <body className="min-h-screen antialiased">
        {children}
        <WhatsAppWidget />
        <CookieBanner />
      </body>

    </html>
  );
}
