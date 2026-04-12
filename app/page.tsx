"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const QR_SPOT_TYPES = [
  {
    id: "free",
    emoji: "🔗",
    name: "Link Redirect",
    type: "Gratis",
    annualPrice: 0,
    description: "Prova senza impegno",
    features: ["Redirect verso qualsiasi URL", "Facebook, Instagram, sito web", "QR code dinamico", "Durata 1 anno"],
    popular: false,
    highlight: false,
    cta: "Crea gratis",
  },
  {
    id: "image",
    emoji: "🖼️",
    name: "Immagine",
    type: "Foto & GIF",
    annualPrice: 19,
    description: "Menu foto e promozioni visive",
    features: ["Upload illimitati", "Formati: JPG, PNG, GIF", "QR code dinamico", "Durata 1 anno"],
    popular: false,
    highlight: false,
    cta: "Acquista",
  },
  {
    id: "video",
    emoji: "🎥",
    name: "Video",
    type: "Filmati",
    annualPrice: 29,
    description: "Promo video in loop sui tavoli",
    features: ["Upload illimitati", "Formato MP4 ottimizzato", "Autoplay e loop", "Durata 1 anno"],
    popular: false,
    highlight: false,
    cta: "Acquista",
  },
  {
    id: "pdf",
    emoji: "📄",
    name: "PDF",
    type: "Documenti",
    annualPrice: 49,
    description: "Menù e cataloghi professionali",
    features: ["Upload illimitati", "PDF multipagina fino a 50MB", "Visualizzatore integrato", "Durata 1 anno"],
    popular: true,
    highlight: true,
    cta: "Acquista",
  },
  {
    id: "unlimited",
    emoji: "🌟",
    name: "Unlimited",
    type: "Tutto incluso",
    annualPrice: 99,
    description: "Nessun vincolo, massima libertà",
    features: ["Upload illimitati", "Tutti i formati (JPG, MP4, PDF)", "Cambia contenuto liberamente", "Durata 1 anno"],
    popular: false,
    highlight: false,
    cta: "Acquista",
  },
];

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(9, 9, 11, 0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo-negative.svg" alt="QRpop Logo" style={{ height: 32, width: "auto", marginLeft: -8 }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/login"
            style={{
              color: "hsl(240 5% 65%)",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
              padding: "8px 16px",
              borderRadius: 8,
              transition: "color 0.2s",
            }}
          >
            Accedi
          </Link>
          <Link href="/register" className="btn-primary" style={{ padding: "10px 20px", fontSize: 14, borderRadius: 10 }}>
            Inizia ora →
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Background glows */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "30%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(219,39,119,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Badge */}
      <div
        className="animate-fade-up"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          borderRadius: 999,
          border: "1px solid rgba(124,58,237,0.4)",
          background: "rgba(124,58,237,0.1)",
          fontSize: 13,
          fontWeight: 600,
          color: "hsl(262 83% 75%)",
          marginBottom: 32,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "hsl(262 83% 68%)", animation: "pulse 2s infinite" }} />
        Ora disponibile su qrpop.it
      </div>

      <h1
        className="animate-fade-up-delay-1"
        style={{
          fontSize: "clamp(3rem, 8vw, 6rem)",
          fontWeight: 800,
          lineHeight: 1.05,
          marginBottom: 24,
          maxWidth: 900,
        }}
      >
        Il tuo QR Code <br/>
        <span className="gradient-text">Parla da Solo.</span>
      </h1>

      <p
        className="animate-fade-up-delay-2"
        style={{
          fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
          color: "hsl(240 5% 65%)",
          maxWidth: 700,
          marginBottom: 48,
          lineHeight: 1.7,
        }}
      >
        Trasforma i tuoi tavoli e le tue grafiche in un motore di marketing. Modifica le landing page, acquisisci lead e traccia le interazioni offline in tempo reale senza mai dover ristampare.
      </p>

      <div className="animate-fade-up-delay-3" style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/register" className="btn-primary" style={{ padding: "16px 32px", fontSize: 16 }}>
          Crea QR Gratis →
        </Link>
        <a href="#come-funziona" className="btn-ghost" style={{ padding: "16px 32px", fontSize: 16 }}>
          Scopri di più
        </a>
      </div>

      {/* Visual Demo Section */}
      <div
        className="animate-fade-up-delay-4"
        style={{
          marginTop: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(30px, 6vw, 80px)",
          flexWrap: "wrap",
          perspective: 1000,
          position: "relative",
        }}
      >
        {/* Glowing background line connecting them (desktop only) */}
        <div className="hidden md:block" style={{
          position: "absolute",
          top: "50%",
          left: "20%",
          right: "20%",
          height: 2,
          background: "linear-gradient(90deg, transparent, hsl(262 83% 68%), transparent)",
          zIndex: -1,
          opacity: 0.5,
        }} />

        {/* Action 1: Scan (Bright Physical Mode) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, zIndex: 2 }}>
          {/* Table Tent / Card mockup */}
          <div style={{
            position: "relative",
            width: 240,
            height: 280,
            background: "linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)",
            borderRadius: "16px 16px 4px 4px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,1)",
            padding: "30px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: "rotateY(10deg) rotateX(5deg)",
          }}>
            <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ color: "#333", fontWeight: 800, fontSize: 18, marginBottom: 12, textAlign: "center", lineHeight: 1.2 }}>
                RICEVI IL 10%<br/><span style={{ color: "hsl(262 83% 58%)", fontSize: 14 }}>Iscriviti al Club</span>
              </div>
              
              {/* High Contrast QR Code */}
              <div style={{
                width: 140,
                height: 140,
                background: "white",
                padding: 10,
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                position: "relative",
              }}>
                <div style={{
                  width: "100%",
                  height: "100%",
                  background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"%23000\"><path d=\"M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm13-2h2v2h-2zm-2 2h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm-2-4h2v2h-2zm2 2h2v2h-2z\"/></svg>')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }} />
                
                {/* Laser scan line */}
                <div style={{
                  position: "absolute",
                  top: "10%",
                  left: -5,
                  right: -5,
                  height: 4,
                  background: "hsl(262 83% 58%)",
                  boxShadow: "0 0 15px 3px hsl(262 83% 68%)",
                  animation: "scanLine 2.5s infinite ease-in-out",
                  borderRadius: "50%",
                }} />
              </div>
              
              <div style={{ marginTop: 16, fontSize: 11, color: "#666", fontWeight: 600 }}>INQUADRA CON LA FOTOCAMERA</div>
            </div>
            {/* Base of table tent */}
            <div style={{ position: "absolute", bottom: -10, left: 0, right: 0, height: 20, background: "#e5e7eb", borderRadius: "0 0 8px 8px", transform: "skewX(-10deg)" }} />
          </div>
          
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 12, 
            padding: "10px 24px", 
            borderRadius: 999, 
            background: "white",
            color: "#000", 
            fontSize: 16, 
            fontWeight: 800,
            boxShadow: "0 10px 30px rgba(124,58,237,0.3)"
          }}>
            <span>1. Offri un incentivo</span>
          </div>
        </div>

        {/* Action arrow (Mobile mainly) */}
        <div className="md:hidden" style={{ fontSize: 32, color: "hsl(262 83% 68%)", fontWeight: 800, transform: "rotate(90deg)" }}>→</div>

        {/* Action 2: Result in Phone */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, zIndex: 2 }}>
          <div
            style={{
              width: 280,
              height: 560,
              borderRadius: 40,
              background: "hsl(240 6% 8%)",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 2px hsl(240 6% 15%), inset 0 0 0 1px rgba(255,255,255,0.1)",
              overflow: "hidden",
              position: "relative",
              transform: "rotateY(-5deg) rotateX(5deg)",
            }}
          >
            {/* Notch */}
            <div style={{
              position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
              width: 80, height: 20, borderRadius: 10,
              background: "hsl(240 6% 5%)", zIndex: 10,
            }} />

            {/* Video hero */}
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => {
                (e.currentTarget as HTMLVideoElement).style.display = "none";
              }}
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>

            {/* Overlay brand watermark */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "40px 16px 20px",
              background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
              textAlign: "center", fontSize: 11,
              color: "rgba(255,255,255,0.6)",
              fontWeight: 500,
            }}>
              Powered by QRpop
            </div>
          </div>
          
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            padding: "10px 24px", 
            borderRadius: 999, 
            background: "linear-gradient(135deg, hsl(262 83% 58%), hsl(330 81% 60%))",
            color: "white", 
            fontSize: 16, 
            fontWeight: 800,
            boxShadow: "0 10px 30px rgba(219,39,119,0.3)",
          }}>
            2. Generi un Lead 🎉
          </div>
        </div>

        {/* Glow under everything */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(124,58,237,0.15), transparent 70%)",
          filter: "blur(40px)",
          zIndex: 0,
        }} />
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: "1️⃣",
      title: "Crea e carica il Logo",
      desc: "QRpop innesca in automatico la correzione errori 'H'. Inserisci il logo aziendale al centro del codice senza perdere leggibilità.",
    },
    {
      icon: "2️⃣",
      title: "Scegli cosa mostrare",
      desc: "Imposta una promo, un modulo acquisizione contatti o ospita file PDF e Video ottimizzati per i tuoi clienti in loco.",
    },
    {
      icon: "3️⃣",
      title: "Stampa ed esponi",
      desc: "Scarica il QR in formato HD, stampalo e mettilo sui tavoli, volantini o vetrine. Non dovrai mai più ristamparlo.",
    },
    {
      icon: "4️⃣",
      title: "Traccia & Modifica live",
      desc: "Analizza quando e dove convertono i clienti. Aggiorna l'offerta in tempo reale senza mai dover ristampare il cartaceo.",
    },
  ];

  return (
    <section
      id="come-funziona"
      style={{
        padding: "120px 24px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <div
          style={{
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.3)",
            fontSize: 13,
            fontWeight: 600,
            color: "hsl(262 83% 75%)",
            marginBottom: 20,
          }}
        >
          Come funziona
        </div>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, marginBottom: 16 }}>
          Da semplice Link,<br/>a Macchina per Lead.
        </h2>
        <p style={{ fontSize: 18, color: "hsl(240 5% 65%)", maxWidth: 600, margin: "0 auto" }}>
          QRpop è lo strumento definitivo di QR Marketing. Acquisisci nuovi contatti, promuovi il tuo brand e traccia l'intelligenza offline tutto da un'unica piattaforma.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 24,
        }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: 32,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 20 }}>{step.icon}</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{step.title}</h3>
            <p style={{ fontSize: 15, color: "hsl(240 5% 60%)", lineHeight: 1.6 }}>{step.desc}</p>
            {/* Number watermark */}
            <div
              style={{
                position: "absolute",
                bottom: -10,
                right: 16,
                fontSize: 80,
                fontWeight: 900,
                color: "rgba(255,255,255,0.03)",
                fontFamily: "Space Grotesk, sans-serif",
                userSelect: "none",
              }}
            >
              {i + 1}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section
      id="prezzi"
      style={{
        padding: "120px 24px",
        background: "rgba(255,255,255,0.01)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{
            display: "inline-block", padding: "6px 14px", borderRadius: 999,
            background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)",
            fontSize: 13, fontWeight: 600, color: "hsl(262 83% 75%)", marginBottom: 20,
          }}>
            Prezzi
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, marginBottom: 16 }}>
            Un QR per ogni esigenza.
          </h2>
          <p style={{ fontSize: 18, color: "hsl(240 5% 65%)", maxWidth: 560, margin: "0 auto 16px" }}>
            Crea un account gratis, poi aggiungi i QR che ti servono. Ogni postazione ha il suo contenuto e la sua URL univoca.
          </p>
          <p style={{ fontSize: 14, color: "hsl(142 71% 45%)", margin: "0 auto 48px" }}>
            ✓ Upload illimitati &nbsp;·&nbsp; ✓ Durata annuale &nbsp;·&nbsp; ✓ Nessun abbonamento mensile
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {QR_SPOT_TYPES.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: plan.highlight ? "rgba(124,58,237,0.12)" : "hsl(240 6% 8%)",
                border: plan.highlight ? "1px solid rgba(124,58,237,0.5)" : "1px solid hsl(240 5% 15%)",
                borderRadius: 20, padding: 28, position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = plan.highlight
                  ? "0 20px 60px rgba(124,58,237,0.3)" : "0 20px 60px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "none";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  padding: "4px 16px", background: "linear-gradient(135deg, hsl(262 83% 58%), hsl(330 81% 60%))",
                  borderRadius: 999, fontSize: 12, fontWeight: 700, color: "white", whiteSpace: "nowrap",
                }}>
                  ⭐ Più scelto
                </div>
              )}

              <div style={{ fontSize: 28, marginBottom: 12 }}>{plan.emoji}</div>

              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ color: "hsl(240 5% 55%)", fontSize: 13, marginBottom: 20 }}>{plan.description}</div>

              <div style={{ marginBottom: 24 }}>
                {plan.annualPrice === 0 ? (
                  <div style={{ fontSize: 40, fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
                    Gratis
                    <div style={{ fontSize: 13, color: "hsl(240 5% 55%)", fontWeight: 400, marginTop: 2 }}>per 1 anno</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: 40, fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
                        €{plan.annualPrice}
                      </span>
                      <span style={{ color: "hsl(240 5% 55%)", fontSize: 14 }}>/anno</span>
                    </div>
                    <div style={{ fontSize: 12, color: "hsl(142 71% 45%)", marginTop: 2 }}>
                      ≈ €{Math.round((plan.annualPrice / 12) * 10) / 10}/mese
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={plan.annualPrice === 0 ? "/register" : `/register?spot=${plan.id}`}
                className="btn-primary"
                style={{
                  display: "block", textAlign: "center", textDecoration: "none", marginBottom: 24,
                  padding: "12px 20px", fontSize: 14,
                  background: plan.highlight
                    ? "linear-gradient(135deg, hsl(262 83% 58%), hsl(330 81% 60%))"
                    : plan.annualPrice === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.07)",
                  boxShadow: plan.highlight ? "0 4px 24px rgba(124,58,237,0.4)" : "none",
                  border: plan.annualPrice === 0 ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}
              >
                {plan.cta}
              </Link>

              <ul style={{ display: "flex", flexDirection: "column", gap: 10, listStyle: "none" }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "hsl(240 5% 75%)" }}>
                    <span style={{ color: "hsl(142 71% 45%)", fontSize: 14, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: 40, fontSize: 14, color: "hsl(240 5% 45%)" }}>
          💡 Aggiungi quanti QR Spot vuoi allo stesso account — ogni postazione ha la sua URL e il suo contenuto indipendente.
        </p>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section style={{ padding: "120px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div
          style={{
            display: "inline-block",
            fontWeight: 700,
            fontSize: 64,
            marginBottom: 24,
          }}
        >
          ◈
        </div>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, marginBottom: 20 }}>
          Smetti di usare{" "}
          <span className="gradient-text">QR code anonimi.</span>
        </h2>
        <p style={{ fontSize: 18, color: "hsl(240 5% 65%)", marginBottom: 40, lineHeight: 1.7 }}>
          Entra a far parte delle aziende e dei professionisti che usano QRpop per tracciare il comportamento offline e generare lead quotidiani sul punto vendita.
        </p>
        <Link href="/register" className="btn-primary" style={{ padding: "18px 40px", fontSize: 17 }}>
          Inizia gratis il tuo primo QR →
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "40px 24px",
        textAlign: "center",
        color: "hsl(240 5% 45%)",
        fontSize: 14,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 700, color: "hsl(240 5% 70%)" }}>QRpop</span>
          <span style={{ color: "hsl(240 5% 30%)" }}>—</span>
          <span>© {new Date().getFullYear()} Tutti i diritti riservati</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <Link href="/login" style={{ color: "hsl(240 5% 50%)", textDecoration: "none", transition: "color 0.2s" }}>
            Accedi
          </Link>
          <Link href="/register" style={{ color: "hsl(240 5% 50%)", textDecoration: "none", transition: "color 0.2s" }}>
            Registrati
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <HowItWorks />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
