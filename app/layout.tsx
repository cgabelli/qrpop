import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "QRpop — Trasforma il tuo QR Code in un'esperienza di Marketing",
    template: "%s | QRpop",
  },
  description:
    "Crea il tuo QR Code gratuitamente e posiziona il tuo logo al centro. Gestisci menu, promozioni visive, video e PDF in tempo reale. Per ristoranti e attività.",
  keywords: ["QR code", "ristorante", "menu digitale", "marketing", "QRpop", "QR Dinamico", "Generatore QR Code", "Fidelity Card"],
  authors: [{ name: "Springfield S.r.l.", url: "https://www.springfield.srl" }],
  creator: "Springfield S.r.l.",
  category: "Software",
  metadataBase: new URL("https://qrpop.it"),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://qrpop.it",
    siteName: "QRpop",
    title: "QRpop — Trasforma il tuo QR Code in Marketing Dinamico",
    description:
      "Crea e gestisci QR Code dinamici per il tuo locale. Nessun vincolo, aggiorna i contenuti quante volte vuoi senza dover ristampare nulla.",
    images: [
      {
        url: "https://qrpop.it/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "QRpop Dashboard e Grafiche B2B",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QRpop — Il QR Code Dinamico per il TUO Locale",
    description: "Crea il tuo QR Code gratuito con logo. Gestisci menu, file video e PDF dei tuoi prodotti in tempo reale.",
    images: ["https://qrpop.it/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
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
