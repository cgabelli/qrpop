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
  {
    id: "wallet",
    emoji: "🪪",
    name: "Fidelity Card",
    type: "CRM Addon",
    annualPrice: "—",
    description: "Il nuovo modulo per Apple Wallet",
    features: ["Acquisisci Lead dal tavolo", "Design Personalizzabile", "Push Notifications CRM", "Statistiche Dedicate"],
    popular: false,
    highlight: false,
    cta: "Coming Soon",
    comingSoon: true,
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
        zIndex: 100,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        background: scrolled ? "rgba(255, 255, 255, 0.7)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.5)" : "1px solid transparent",
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
          height: scrolled ? 68 : 88,
          transition: "height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img 
            src="/logo-negative.svg" 
            alt="QRpop Logo" 
            style={{ 
              height: 32, 
              width: "auto", 
              marginLeft: -8, 
              filter: "brightness(0) drop-shadow(0 2px 4px rgba(0,0,0,0.05))" 
            }} 
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/login"
            style={{
              color: "hsl(var(--text-muted))",
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: 8,
              transition: "color 0.2s",
            }}
          >
            Accedi
          </Link>
          <Link href="/register" className="btn-primary" style={{ padding: "12px 24px", fontSize: 15 }}>
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
        padding: "160px 24px 80px",
        position: "relative",
        textAlign: "center",
      }}
    >
      {/* MESH BACKGROUND */}
      <div className="mesh-bg">
         <div className="mesh-blob mesh-blob-1" />
         <div className="mesh-blob mesh-blob-2" />
         <div className="mesh-blob mesh-blob-3" />
         <div className="mesh-blob mesh-blob-4" />
      </div>

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 1000, margin: "0 auto" }}>
        
        <div className="animate-fade-up" style={{
            display: "inline-block",
            padding: "8px 20px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,1)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            backdropFilter: "blur(12px)",
            fontWeight: 700,
            color: "hsl(var(--brand-dark))",
            marginBottom: 32,
            letterSpacing: "-0.01em"
          }}>
          <span style={{ marginRight: 8 }}>🏅</span> Il QR Marketing Made in Italy 🇮🇹
        </div>

        <h1 className="animate-fade-up-delay-1" style={{
            fontSize: "clamp(3.5rem, 8vw, 6rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 24,
            color: "#0f172a",
          }}>
          Il tuo QR Code <br/>
          <span className="gradient-text-hero">Parla da Solo.</span>
        </h1>

        <p className="animate-fade-up-delay-2" style={{
            fontSize: "clamp(1.1rem, 2.3vw, 1.3rem)",
            color: "#475569",
            maxWidth: 700,
            margin: "0 auto 48px",
            lineHeight: 1.7,
            fontWeight: 500,
          }}>
          Trasforma i tuoi menu e le tue grafiche in un canale di marketing diretto. Modifica la destinazione del QR e promuovi nuove offerte in tempo reale senza dover mai ristampare.
        </p>

        <div className="animate-fade-up-delay-3" style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/register" className="btn-primary" style={{ padding: "18px 40px", fontSize: 17 }}>
            Crea QR Gratis →
          </Link>
          <a href="#come-funziona" className="btn-ghost" style={{ padding: "18px 40px", fontSize: 17 }}>
            Scopri di più
          </a>
        </div>

        {/* HIGH-FIDELITY GLASS MOCKUP */}
        <div className="animate-fade-up-delay-4" style={{
            marginTop: 80,
            position: "relative",
            width: "100%",
            height: 540,
            perspective: 1200,
          }}>
          
          {/* Main Dashboard Panel */}
          <div className="glass-premium" style={{
              position: "absolute",
              top: 0, left: "5%", right: "15%", bottom: 0,
              borderRadius: 32,
              padding: 40,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              transform: "rotateX(4deg) rotateY(2deg)",
            }}>
             
             {/* Abstract Layout inside Dashboard */}
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div style={{ width: 140, height: 28, background: "#f1f5f9", borderRadius: 8 }} />
                <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #2563eb, #db2777)", borderRadius: "50%" }} />
             </div>

             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                <div className="glass-panel" style={{ padding: 24, borderRadius: 20 }}>
                   <div style={{ fontSize: 14, color: "#64748b", fontWeight: 600, marginBottom: 8 }}>Scansioni Menu Oggi</div>
                   <div style={{ fontSize: 40, fontWeight: 800, color: "#0f172a" }}>+124</div>
                </div>
                <div className="glass-panel" style={{ padding: 24, borderRadius: 20 }}>
                   <div style={{ fontSize: 14, color: "#64748b", fontWeight: 600, marginBottom: 8 }}>Acquisizioni Lead Fidelity</div>
                   <div style={{ fontSize: 40, fontWeight: 800, color: "#10b981" }}>42</div>
                </div>
             </div>

             <div className="glass-panel" style={{ flex: 1, borderRadius: 20, overflow: "hidden", position: "relative" }}>
                 <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,100 L0,70 Q25,40 50,60 T100,20 L100,100 Z" fill="rgba(37,99,235,0.05)" />
                    <path d="M0,70 Q25,40 50,60 T100,20" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: "#2563eb" }} />
                 </svg>
             </div>
          </div>

          {/* Overlapping Video Demo / Phone */}
          <div className="hover-lift" style={{
              position: "absolute",
              right: 20, bottom: -40,
              width: 250, height: 460,
              borderRadius: 32,
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)",
              transform: "rotate(-6deg)",
              zIndex: 10,
              overflow: "hidden"
            }}>
             {/* Notch */}
             <div style={{
               position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
               width: 60, height: 16, borderRadius: 10,
               background: "#020617", zIndex: 10,
             }} />
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
          </div>
        </div>
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
      desc: "Imposta un reindirizzamento o ospita un'offerta, file PDF o Video direttamente nei tuoi tavoli.",
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
    <section id="come-funziona" style={{ padding: "160px 24px", position: "relative", background: "white" }}>
      <div style={{ textAlign: "center", marginBottom: 80, maxWidth: 800, margin: "0 auto 80px" }}>
        <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, marginBottom: 24, color: "#0f172a" }}>
          Il nuovo standard del <span className="gradient-text-hero">Marketing Dinamico.</span>
        </h2>
        <p style={{ fontSize: 20, color: "#475569", lineHeight: 1.6, fontWeight: 500 }}>
          QRpop è lo strumento definitivo. Mostra offerte sempre aggiornate, promuovi il tuo brand e aggiorna l'esperienza del cliente senza ulteriori costi tipografici.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32, maxWidth: 1200, margin: "0 auto" }}>
        {steps.map((step, i) => (
          <div key={i} className="hover-lift" style={{
              padding: 40,
              background: "#fafcff",
              border: "1px solid #e2e8f0",
              borderRadius: 32,
              position: "relative",
            }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: "0 10px 20px rgba(0,0,0,0.05)", marginBottom: 24 }}>
               {step.icon}
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: "#0f172a" }}>{step.title}</h3>
            <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.6, fontWeight: 500 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="prezzi" style={{ padding: "160px 24px", background: "#f8fafc", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, marginBottom: 24, color: "#0f172a" }}>
            Un QR per <br/> ogni esigenza.
          </h2>
          <p style={{ fontSize: 20, color: "#475569", maxWidth: 640, margin: "0 auto", fontWeight: 500 }}>
            Crea un account gratis, poi aggiungi i QR che ti servono. Ogni postazione ha il suo contenuto e la sua URL univoca.
          </p>
          <p style={{ fontSize: 16, color: "#2563eb", margin: "20px auto 0", fontWeight: 700 }}>
            ✓ Upload illimitati &nbsp;·&nbsp; ✓ Durata annuale &nbsp;·&nbsp; ✓ Nessun abbonamento mensile
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 40 }}>
          {QR_SPOT_TYPES.map((plan) => (
            <div key={plan.id} className={plan.highlight ? "hover-lift" : ""} style={{
                background: "white",
                border: plan.highlight ? "2px solid #2563eb" : "1px solid #e2e8f0",
                borderRadius: 40, 
                padding: 48, 
                position: "relative",
                boxShadow: plan.highlight ? "0 40px 80px -20px rgba(37,99,235,0.25)" : "0 20px 40px -20px rgba(0,0,0,0.05)",
                transform: plan.highlight ? "scale(1.02)" : "scale(1)",
                zIndex: plan.highlight ? 10 : 1,
              }}>
              
              {plan.highlight && (
                <div style={{
                  position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)",
                  padding: "8px 24px", background: "linear-gradient(to right, #2563eb, #4f46e5)",
                  borderRadius: 999, fontSize: 14, fontWeight: 800, color: "white",
                  boxShadow: "0 10px 20px rgba(37,99,235,0.3)"
                }}>
                  ⭐ Più scelto
                </div>
              )}

              <div style={{ fontSize: 40, marginBottom: 24 }}>{plan.emoji}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", marginBottom: 12 }}>{plan.name}</div>
              <div style={{ color: "#64748b", fontSize: 16, marginBottom: 40, fontWeight: 500 }}>{plan.description}</div>

              <div style={{ marginBottom: 48 }}>
                {plan.annualPrice === 0 ? (
                  <div style={{ fontSize: 56, fontWeight: 900, color: "#0f172a", letterSpacing: -2 }}>
                    Gratis
                    <div style={{ fontSize: 16, color: "#64748b", fontWeight: 500, marginTop: 4 }}>per 1 anno</div>
                  </div>
                ) : typeof plan.annualPrice === "string" ? (
                  <div style={{ fontSize: 56, fontWeight: 900, color: "#0f172a", letterSpacing: -2 }}>
                    {plan.annualPrice}
                    <div style={{ fontSize: 16, color: "#64748b", fontWeight: 500, marginTop: 4 }}>Disponibile a breve</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 56, fontWeight: 900, color: "#0f172a", letterSpacing: -2 }}>
                        €{plan.annualPrice}
                      </span>
                      <span style={{ color: "#64748b", fontSize: 18, fontWeight: 600 }}>/anno</span>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={plan.comingSoon ? "#" : plan.annualPrice === 0 ? "/register" : `/register?spot=${plan.id}`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", marginBottom: 48,
                  padding: "20px 24px", fontSize: 18, fontWeight: 800, borderRadius: 16,
                  width: "100%",
                  background: plan.comingSoon ? "#f1f5f9" : plan.highlight ? "#0f172a" : "#f1f5f9",
                  color: plan.comingSoon ? "#94a3b8" : plan.highlight ? "white" : "#0f172a",
                  cursor: plan.comingSoon ? "default" : "pointer",
                  pointerEvents: plan.comingSoon ? "none" : "auto",
                  transition: "all 0.2s ease"
                }}
              >
                {plan.cta}
              </Link>

              <ul style={{ display: "flex", flexDirection: "column", gap: 16, listStyle: "none" }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 16, color: "#334155", fontWeight: 600 }}>
                    <div style={{ color: "#2563eb", fontWeight: 800 }}>✓</div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #e2e8f0", background: "white", padding: "60px 24px", textAlign: "center", color: "#64748b", fontSize: 15 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontWeight: 900, color: "#0f172a", fontSize: 20, letterSpacing: -1 }}>QRpop</span>
          <span style={{ color: "#cbd5e1" }}>—</span>
          <span style={{ fontWeight: 500 }}>© {new Date().getFullYear()} Tutti i diritti riservati</span>
        </div>
        <div style={{ display: "flex", gap: 24, fontWeight: 600, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/privacy" style={{ color: "#475569", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/cookie" style={{ color: "#475569", textDecoration: "none" }}>Cookie</Link>
          <Link href="/termini" style={{ color: "#475569", textDecoration: "none" }}>Termini</Link>
          <Link href="/login" style={{ color: "#475569", textDecoration: "none" }}>Accedi</Link>
          <Link href="/register" style={{ color: "#475569", textDecoration: "none" }}>Registrati</Link>
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
      </main>
      <Footer />
    </>
  );
}
