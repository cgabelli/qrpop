import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code per Recensioni Google - Generatore Dinamico Gratis",
  description: "Crea gratis un QR Code con il tuo logo per raccogliere recensioni su Google My Business. QR dinamico: cambia il link in tempo reale senza ristampare.",
  alternates: {
    canonical: "/qr-code-recensioni-google",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
