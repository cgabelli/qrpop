"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const PLANS = [
  {
    id: "basic_image",
    name: "Immagine Base",
    type: "Immagini",
    monthlyPrice: 10,
    annualPrice: 99,
    annualMonthly: 8,
    description: "3 upload al mese",
    features: ["3 immagini al mese", "QR code statico dedicato", "Scheduling contenuti", "Link permanente"],
    popular: false,
  },
  {
    id: "unlimited_image",
    name: "Immagine Unlimited",
    type: "Immagini",
    monthlyPrice: 15,
    annualPrice: 149,
    annualMonthly: 12,
    description: "Upload illimitati",
    features: ["Immagini illimitate", "QR code statico dedicato", "Scheduling avanzato", "Link permanente", "Priorità supporto"],
    popular: false,
  },
  {
    id: "basic_video",
    name: "Video Base",
    type: "Video",
    monthlyPrice: 20,
    annualPrice: 199,
    annualMonthly: 17,
    description: "2 video al mese",
    features: ["2 video al mese", "QR code statico dedicato", "Video autoplay mobile", "Scheduling contenuti"],
    popular: true,
  },
  {
    id: "unlimited_video",
    name: "Video Unlimited",
    type: "Video",
    monthlyPrice: 50,
    annualPrice: 499,
    annualMonthly: 42,
    description: "Video illimitati",
    features: ["Video illimitati", "QR code statico dedicato", "Video autoplay mobile", "Scheduling avanzato", "Priorità supporto", "Analytics (prossimamente)"],
    popular: false,
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
            Inizia gratis →
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
        Il tuo QR code{" "}
        <span className="gradient-text">parla</span>
        {" "}da solo.
      </h1>

      <p
        className="animate-fade-up-delay-2"
        style={{
          fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
          color: "hsl(240 5% 65%)",
          maxWidth: 600,
          marginBottom: 48,
          lineHeight: 1.7,
        }}
      >
        Carica immagini e video promozionali che i tuoi clienti vedono subito
        dopo aver scansionato il QR. Cambi contenuto quando vuoi, il QR resta
        sempre lo stesso.
      </p>

      <div className="animate-fade-up-delay-3" style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/register" className="btn-primary" style={{ padding: "16px 32px", fontSize: 16 }}>
          Inizia ora — da 10€/mese →
        </Link>
        <a href="#come-funziona" className="btn-ghost" style={{ padding: "16px 32px", fontSize: 16 }}>
          Come funziona
        </a>
      </div>

      {/* Phone mockup */}
      <div
        className="animate-fade-up-delay-4"
        style={{
          marginTop: 80,
          position: "relative",
          display: "inline-block",
        }}
      >
        <div
          style={{
            width: 280,
            height: 560,
            borderRadius: 40,
            background: "hsl(240 6% 8%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 0 1px rgba(255,255,255,0.05)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Screen content */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(180deg, rgba(124,58,237,0.3) 0%, rgba(219,39,119,0.2) 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              padding: 24,
            }}
          >
            <div style={{ fontSize: 64 }}>🍕</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Offerta del Giorno</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
                Pizza Margherita + Birra<br />
                <strong style={{ fontSize: 18, color: "hsl(262 83% 75%)" }}>€ 12,90</strong>
              </div>
            </div>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
              }}
            >
              ◈
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
              Powered by QRpop
            </div>
          </div>
        </div>
        {/* Glow under phone */}
        <div style={{
          position: "absolute",
          bottom: -30,
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 60,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(124,58,237,0.4), transparent 70%)",
          filter: "blur(10px)",
        }} />
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: "1️⃣",
      title: "Registrati e scegli il piano",
      desc: "Crea il tuo account in 2 minuti, scegli tra immagine o video e attiva l'abbonamento.",
    },
    {
      icon: "2️⃣",
      title: "Scarica il tuo QR code",
      desc: "Ricevi il tuo QR code statico personalizzato. Stampalo e posizionalo sui tavoli del locale.",
    },
    {
      icon: "3️⃣",
      title: "Carica i contenuti",
      desc: "Dal pannello di controllo, carica immagini o video promozionali e imposta quando mostrarli.",
    },
    {
      icon: "4️⃣",
      title: "I clienti scansionano",
      desc: "Chi punta il telefono al QR vede immediatamente il tuo contenuto. Senza app, senza attese.",
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
          Semplice come deve essere.
        </h2>
        <p style={{ fontSize: 18, color: "hsl(240 5% 65%)", maxWidth: 500, margin: "0 auto" }}>
          Dal tuo pannello di controllo al tavolo del cliente, in meno di un minuto.
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
  const [annual, setAnnual] = useState(false);

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
            Zero sorprese, prezzi chiari.
          </h2>
          <p style={{ fontSize: 18, color: "hsl(240 5% 65%)", maxWidth: 500, margin: "0 auto 36px" }}>
            Scegli il piano più adatto al tuo locale. Nessun costo nascosto.
          </p>

          {/* Billing toggle */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 16,
            background: "hsl(240 6% 8%)", border: "1px solid hsl(240 5% 15%)",
            borderRadius: 999, padding: "6px 8px",
          }}>
            <button
              onClick={() => setAnnual(false)}
              style={{
                padding: "8px 20px", borderRadius: 999, border: "none", cursor: "pointer",
                background: !annual ? "linear-gradient(135deg, hsl(262 83% 58%), hsl(330 81% 60%))" : "transparent",
                color: !annual ? "white" : "hsl(240 5% 55%)",
                fontSize: 14, fontWeight: 600, transition: "all 0.2s", fontFamily: "Inter, sans-serif",
              }}
            >
              Mensile
            </button>
            <button
              onClick={() => setAnnual(true)}
              style={{
                padding: "8px 20px", borderRadius: 999, border: "none", cursor: "pointer",
                background: annual ? "linear-gradient(135deg, hsl(262 83% 58%), hsl(330 81% 60%))" : "transparent",
                color: annual ? "white" : "hsl(240 5% 55%)",
                fontSize: 14, fontWeight: 600, transition: "all 0.2s", fontFamily: "Inter, sans-serif",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              Annuale
              <span style={{
                padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                background: "rgba(34,197,94,0.15)", color: "hsl(142 71% 55%)",
              }}>
                -17%
              </span>
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: plan.popular ? "rgba(124,58,237,0.1)" : "hsl(240 6% 8%)",
                border: plan.popular ? "1px solid rgba(124,58,237,0.5)" : "1px solid hsl(240 5% 15%)",
                borderRadius: 20, padding: 32, position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = plan.popular
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

              <div style={{
                display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: 8,
                background: plan.type === "Video" ? "rgba(219,39,119,0.15)" : "rgba(124,58,237,0.15)",
                color: plan.type === "Video" ? "hsl(330 81% 70%)" : "hsl(262 83% 75%)",
                fontSize: 12, fontWeight: 700, marginBottom: 20,
              }}>
                {plan.type === "Video" ? "🎬" : "🖼️"} {plan.type}
              </div>

              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ color: "hsl(240 5% 65%)", fontSize: 14, marginBottom: 24 }}>{plan.description}</div>

              {/* Price display */}
              {annual ? (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 48, fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
                      €{plan.annualPrice}
                    </span>
                    <span style={{ color: "hsl(240 5% 55%)", fontSize: 15 }}>/anno</span>
                  </div>
                  <div style={{ fontSize: 13, color: "hsl(142 71% 55%)", marginBottom: 24 }}>
                    ≈ €{plan.annualMonthly}/mese — pagamento anticipato
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 32 }}>
                  <span style={{ fontSize: 48, fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
                    €{plan.monthlyPrice}
                  </span>
                  <span style={{ color: "hsl(240 5% 55%)", fontSize: 15 }}>/mese</span>
                </div>
              )}

              <Link
                href={`/register?plan=${plan.id}&billing=${annual ? "annual" : "monthly"}`}
                className="btn-primary"
                style={{
                  display: "block", textAlign: "center", textDecoration: "none", marginBottom: 32,
                  background: plan.popular
                    ? "linear-gradient(135deg, hsl(262 83% 58%), hsl(330 81% 60%))"
                    : "rgba(255,255,255,0.07)",
                  boxShadow: plan.popular ? "0 4px 24px rgba(124,58,237,0.4)" : "none",
                }}
              >
                Inizia ora
              </Link>

              <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none" }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "hsl(240 5% 80%)" }}>
                    <span style={{ color: "hsl(142 71% 45%)", fontSize: 16 }}>✓</span>
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
          Pronto a far parlare{" "}
          <span className="gradient-text">il tuo locale?</span>
        </h2>
        <p style={{ fontSize: 18, color: "hsl(240 5% 65%)", marginBottom: 40, lineHeight: 1.7 }}>
          Unisciti ai ristoratori che hanno già trasformato il semplice QR code in uno strumento di comunicazione potente.
        </p>
        <Link href="/register" className="btn-primary" style={{ padding: "18px 40px", fontSize: 17 }}>
          Crea il tuo account gratis →
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
