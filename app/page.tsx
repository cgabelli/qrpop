"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const QR_SPOT_TYPES = [
  {
    id: "wallet",
    emoji: "🪪",
    name: "Wallet Card",
    type: "CRM",
    annualPrice: 79,
    description: "Crea e rilascia carte fedeltà per Apple Wallet",
    features: ["Acquisisci Lead", "Template personalizzato", "Notifiche e Timbri", "Database CRM incluso"],
    popular: true,
    highlight: true,
    cta: "Inizia a fidelizzare",
  },
  {
    id: "unlimited",
    emoji: "🌟",
    name: "Unlimited",
    type: "Marketing",
    annualPrice: 99,
    description: "Piattaforma marketing totale illimitata",
    features: ["Wallet Cards incluse", "Formati visivi (Video/PDF)", "Statistiche avanzate", "Cambia offetta Live"],
    popular: false,
    highlight: false,
    cta: "Acquista",
  },
  {
    id: "free",
    emoji: "🔗",
    name: "Starter Link",
    type: "Gratis",
    annualPrice: 0,
    description: "Reindirizza e scopri la piattaforma",
    features: ["Redirect base", "QR code dinamico", "Statistiche limitate"],
    popular: false,
    highlight: false,
    cta: "Inizia Gratis",
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
        background: scrolled ? "rgba(255, 255, 255, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.05)" : "1px solid transparent",
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
          {/* Sostituito con il logo standard non negativo */}
          <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, color: "hsl(var(--brand))" }}>QRpop</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/login"
            style={{
              color: "hsl(var(--text-muted))",
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
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "140px 24px 80px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Background abstract shapes (SaaS Light Theme) */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120%",
          height: 800,
          background: "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "20%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.04) 0%, transparent 60%)",
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
          border: "1px solid rgba(37,99,235,0.2)",
          background: "rgba(37,99,235,0.05)",
          fontSize: 13,
          fontWeight: 600,
          color: "hsl(var(--brand))",
          marginBottom: 32,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "hsl(var(--brand-light))", animation: "pulse 2s infinite" }} />
        La Piattaforma Marketing N°1 per Locali 
      </div>

      <h1
        className="animate-fade-up-delay-1"
        style={{
          fontSize: "clamp(3rem, 7vw, 5.5rem)",
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: 24,
          maxWidth: 900,
          color: "hsl(var(--text))",
        }}
      >
        Da semplice passante a <br/>
        <span className="gradient-text">Cliente Fedele in 3 secondi.</span>
      </h1>

      <p
        className="animate-fade-up-delay-2"
        style={{
          fontSize: "clamp(1.1rem, 2.3vw, 1.3rem)",
          color: "hsl(var(--text-muted))",
          maxWidth: 700,
          marginBottom: 48,
          lineHeight: 1.7,
        }}
      >
        Non siamo i soliti creatori di QR Code. QRpop è il CRM automatico che emette <b>Carte Fedeltà su Apple Wallet</b>, acquisisce lead dai tuoi tavoli e ti permette di lanciare campagne marketing mirate. Mai più "Night Club mode", solo crescita del tuo fatturato.
      </p>

      <div className="animate-fade-up-delay-3" style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/register" className="btn-primary" style={{ padding: "16px 36px", fontSize: 16, borderRadius: 12 }}>
          Lancia il tuo Programma Fedeltà →
        </Link>
        <a href="#come-funziona" className="btn-ghost" style={{ padding: "16px 36px", fontSize: 16, borderRadius: 12, background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
          Scopri il Funnel
        </a>
      </div>

      {/* Abstract Dashboard Mockup */}
      <div
        className="animate-fade-up-delay-4"
        style={{
          marginTop: 80,
          position: "relative",
          width: "100%",
          maxWidth: 1000,
          height: 480,
          background: "white",
          borderRadius: 24,
          boxShadow: "0 30px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* Fake UI Sidebar */}
        <div style={{ width: 240, background: "#f8fafc", borderRight: "1px solid #f1f5f9", padding: 24 }}>
          <div style={{ width: 100, height: 24, background: "#e2e8f0", borderRadius: 6, marginBottom: 40 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[1,2,3,4,5].map(i => <div key={i} style={{ height: 20, background: i === 2 ? "hsl(var(--brand-light))" : "#e2e8f0", borderRadius: 4, width: i%2===0?"80%":"60%" }} />)}
          </div>
        </div>
        
        {/* Fake UI Content */}
        <div style={{ flex: 1, padding: 40, background: "white", display: "flex", flexDirection: "column" }}>
           <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "#0f172a" }}>I tuoi Clienti (CRM) 👥</h3>
           
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 40 }}>
              {[
                { l: "Acquisizioni oggi", v: "+42", c: "hsl(var(--brand))" },
                { l: "Carte in Apple Wallet", v: "1,204", c: "#10b981" },
                { l: "Scontrino Medio", v: "€ 34.50", c: "#xf59e0b" }
              ].map((stat, i) => (
                <div key={i} style={{ padding: 20, borderRadius: 16, border: "1px solid #f1f5f9", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{stat.l}</span>
                  <span style={{ fontSize: 32, fontWeight: 800, color: stat.c, marginTop: 8 }}>{stat.v}</span>
                </div>
              ))}
           </div>
           
           <div style={{ flex: 1, borderRadius: 16, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
              {/* Fake Graph */}
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ opacity: 0.5 }}>
                 <path d="M0,100 L0,80 Q20,60 40,70 T80,30 L100,20 L100,100 Z" fill="rgba(37,99,235,0.1)" />
                 <path d="M0,80 Q20,60 40,70 T80,30 L100,20" fill="none" stroke="hsl(var(--brand))" strokeWidth="2" />
              </svg>
           </div>
        </div>
        
        {/* Abstract Floating Phone overlapping */}
        <div style={{
          position: "absolute",
          right: -40,
          bottom: -40,
          width: 260,
          height: 400,
          background: "#fff",
          borderRadius: 30,
          boxShadow: "-20px 20px 60px rgba(0,0,0,0.1), 0 0 0 10px #f8fafc",
          padding: 20,
          transform: "rotate(-10deg)",
          zIndex: 10
        }}>
           <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, hsl(var(--brand)), hsl(var(--accent)))", borderRadius: 16, padding: 24, color: "white" }}>
              <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.8 }}>Apple Wallet</div>
              <div style={{ marginTop: 24, fontSize: 24, fontWeight: 800, lineHeight: 1.1 }}>Tessera Fedeltà Premium</div>
              <div style={{ marginTop: "auto", paddingTop: 100 }}>
                 <div style={{ fontSize: 40, fontWeight: 800 }}>88 <span style={{fontSize:16, fontWeight: 500}}>Punti</span></div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: "📲",
      title: "1. Stampa il cavalletto QR",
      desc: "Posiziona i nostri pannelli acrilici premium sui tavoli. Meno di 3 secondi per inquadrarlo.",
    },
    {
      icon: "🎁",
      title: "2. Offri l'iscrizione on-the-fly",
      desc: "Il cliente vede subito la tua Landing personalizzata. Inserisce Nome ed Email per ottenere il regalo di benvenuto.",
    },
    {
      icon: "🪪",
      title: "3. Download su Apple Wallet",
      desc: "In un click, la nostra piattaforma genera una PKPass che finisce direttamente nello smartphone (iOS o Android) del cliente.",
    },
    {
      icon: "💰",
      title: "4. Aumenta gli incassi",
      desc: "Ora possiedi il suo contatto. Puoi mandargli sconti, inviti e notifiche Push riportandolo nel locale quando vuoi tu.",
    },
  ];

  return (
    <section
      id="come-funziona"
      style={{
        padding: "120px 24px",
        background: "white",
        borderTop: "1px solid #f1f5f9"
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 80, maxWidth: 800, margin: "0 auto 80px" }}>
        <div
          style={{
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(37,99,235,0.1)",
            color: "hsl(var(--brand))",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          Flusso CRM
        </div>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, marginBottom: 20, color: "hsl(var(--text))" }}>
          Un processo <span style={{ color: "hsl(var(--brand))" }}>silenzioso e automatico.</span>
        </h2>
        <p style={{ fontSize: 18, color: "hsl(var(--text-muted))", lineHeight: 1.6 }}>
          Nessuna app da far scaricare, nessuna inutile registrazione. Creiamo ponti perfetti tra il mondo fisico del tuo locale e il database digitale per massimizzare la retention dei clienti.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 24,
          maxWidth: 1200,
          margin: "0 auto"
        }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: 36,
              background: "#fff",
              border: "1px solid #f1f5f9",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              position: "relative",
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 24 }}>{step.icon}</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: "hsl(var(--text))" }}>{step.title}</h3>
            <p style={{ fontSize: 15, color: "hsl(var(--text-muted))", lineHeight: 1.6 }}>{step.desc}</p>
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
        background: "hsl(var(--bg))", // Slate 50
        borderTop: "1px solid #f1f5f9",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, marginBottom: 16 }}>
            Accendi l'acquisizione dati.
          </h2>
          <p style={{ fontSize: 18, color: "hsl(var(--text-muted))", maxWidth: 560, margin: "0 auto" }}>
            Un investimento minimo per raccogliere il bene più prezioso della tua azienda: il database dei tuoi compratori reali.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          {QR_SPOT_TYPES.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: plan.highlight ? "linear-gradient(180deg, #fff 0%, #f8fafc 100%)" : "white",
                border: plan.highlight ? "2px solid hsl(var(--brand))" : "1px solid #e2e8f0",
                borderRadius: 24, padding: 40, position: "relative",
                boxShadow: plan.highlight ? "0 20px 40px rgba(37,99,235,0.15)" : "0 10px 30px rgba(0,0,0,0.04)",
              }}
            >
              {plan.highlight && (
                <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  padding: "6px 20px", background: "hsl(var(--brand))",
                  borderRadius: 999, fontSize: 13, fontWeight: 700, color: "white",
                  boxShadow: "0 4px 10px rgba(37,99,235,0.3)"
                }}>
                  Scelta Strategica
                </div>
              )}

              <div style={{ fontSize: 32, marginBottom: 16 }}>{plan.emoji}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{plan.name}</div>
              <div style={{ color: "hsl(var(--text-muted))", fontSize: 14, marginBottom: 24 }}>{plan.description}</div>

              <div style={{ marginBottom: 32 }}>
                {plan.annualPrice === 0 ? (
                  <div style={{ fontSize: 48, fontWeight: 800, color: "hsl(var(--text))", letterSpacing: -1 }}>
                    Gratis
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontSize: 48, fontWeight: 800, color: "hsl(var(--text))", letterSpacing: -1 }}>
                        €{plan.annualPrice}
                      </span>
                      <span style={{ color: "hsl(var(--text-muted))", fontSize: 15, fontWeight: 500 }}>/anno</span>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={plan.annualPrice === 0 ? "/register" : `/register?spot=${plan.id}`}
                className="btn-primary"
                style={{
                  display: "block", textAlign: "center", textDecoration: "none", marginBottom: 32,
                  padding: "16px 20px", fontSize: 16, borderRadius: 12,
                  width: "100%",
                  background: plan.highlight ? "hsl(var(--brand))" : "#f1f5f9",
                  color: plan.highlight ? "white" : "#0f172a",
                  boxShadow: plan.highlight ? "0 8px 20px rgba(37,99,235,0.2)" : "none",
                }}
              >
                {plan.cta}
              </Link>

              <ul style={{ display: "flex", flexDirection: "column", gap: 14, listStyle: "none" }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "hsl(var(--text-muted))", fontWeight: 500 }}>
                    <div style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>✓</div>
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

function CTASection() {
  return (
    <section style={{ padding: "120px 24px", textAlign: "center", background: "linear-gradient(135deg, hsl(var(--brand)), hsl(var(--accent)))", color: "white" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, marginBottom: 20, color: "white" }}>
          Inizia a costruire il tuo <br/> Database oggi stesso.
        </h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", marginBottom: 40, lineHeight: 1.7 }}>
          Smetti di sperare che i clienti tornino. Prendi il controllo dando a loro un motivo per tornare con uno strumento Premium sul loro Apple Wallet.
        </p>
        <Link href="/register" className="btn-primary" style={{ padding: "18px 40px", fontSize: 17, background: "white", color: "hsl(var(--brand))", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          Crea Accout Gratis →
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #e2e8f0",
        background: "white",
        padding: "40px 24px",
        textAlign: "center",
        color: "hsl(var(--text-muted))",
        fontSize: 14,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 800, color: "hsl(var(--text))", fontSize: 18, letterSpacing: -0.5 }}>QRpop</span>
          <span style={{ color: "#cbd5e1" }}>—</span>
          <span>© {new Date().getFullYear()} Software B2B per Locali</span>
        </div>
        <div style={{ display: "flex", gap: 24, fontWeight: 500 }}>
          <Link href="/login" style={{ color: "hsl(var(--text-muted))", textDecoration: "none" }}>
            Accesso Partner
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
