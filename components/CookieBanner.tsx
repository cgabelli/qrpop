"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem("qrpop-cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  if (!showBanner) return null;

  const acceptCookies = () => {
    localStorage.setItem("qrpop-cookie-consent", "accepted");
    setShowBanner(false);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)",
      width: "calc(100% - 48px)",
      maxWidth: 600,
      backgroundColor: "hsl(240 6% 15%)",
      border: "1px solid hsl(240 5% 26%)",
      borderRadius: 16,
      padding: "20px 24px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
    }}>
      <div>
        <h3 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 700, color: "#fff" }}>
          Utilizzo dei Cookie 🍪
        </h3>
        <p style={{ margin: 0, fontSize: 13, color: "hsl(240 5% 70%)", lineHeight: 1.5 }}>
          Questo sito utilizza cookie tecnici e analitici per garantire il corretto funzionamento della piattaforma e comprendere come gli utenti interagiscono con il servizio. Chiudendo questo banner acconsenti all&apos;uso dei cookie.
          Per maggiori dettagli, leggi la nostra <Link href="/cookie" style={{ color: "hsl(262 83% 72%)", textDecoration: "underline" }}>Cookie Policy</Link>.
        </p>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
        <button
          onClick={acceptCookies}
          style={{
            padding: "8px 20px",
            backgroundColor: "hsl(262 83% 58%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "hsl(262 83% 68%)")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "hsl(262 83% 58%)")}
        >
          Accetto i Cookie
        </button>
      </div>
    </div>
  );
}
