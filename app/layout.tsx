import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "QR Code Dinamico Gratis: Menu, Offerte e Recensioni | QRpop",
    template: "%s | QRpop",
  },
  description:
    "Generatore QR Code dinamico progettato per uffici e ristoranti. Inserisci il logo gratis, crea menu digitali o converti i clienti su Google Maps. Cambia link live.",
  keywords: ["Generatore QR Code", "QR code", "Menu digitale ristorante", "QR Dinamico Gratis", "QR code con logo", "marketing", "QRpop"],
  authors: [{ name: "Springfield S.r.l.", url: "https://www.springfield.srl" }],
  creator: "Springfield S.r.l.",
  category: "BusinessApplication",
  metadataBase: new URL("https://qrpop.it"),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://qrpop.it",
    siteName: "QRpop",
    title: "QR Code Dinamico Gratis: Menu e Marketing | QRpop",
    description:
      "Il tool definitivo per il tuo locale. Personalizza il QR Code con il tuo logo gratuitamente ed aggiorna il link interno di continuo senza mai dover ristampare i codici.",
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
    title: "Miglior Generatore QR Code Dinamico ITA | QRpop",
    description: "Crea il tuo QR Code aziendale. Gestisci menu, grafiche, recensioni Google in tempo reale dal telefono.",
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
