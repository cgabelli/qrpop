import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu Digitale QR Code Gratis per Ristoranti e Bar",
  description: "Crea il tuo menu digitale QR dinamico a costo zero. Inserisci il logo del ristorante al centro. Aggiorna sconti e piatti senza mai dover ristampare i talloncini.",
  alternates: {
    canonical: "/menu-digitale-ristoranti",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
