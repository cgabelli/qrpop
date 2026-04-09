"use client";

import { Suspense, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const PLANS = [
  { id: "basic_image", name: "Immagine Base", price: "€10/mese", icon: "🖼️", type: "Immagini", desc: "3 upload al mese" },
  { id: "unlimited_image", name: "Immagine Unlimited", price: "€15/mese", icon: "🖼️", type: "Immagini", desc: "Illimitati" },
  { id: "basic_video", name: "Video Base", price: "€20/mese", icon: "🎬", type: "Video", desc: "2 video al mese" },
  { id: "unlimited_video", name: "Video Unlimited", price: "€50/mese", icon: "🎬", type: "Video", desc: "Illimitati" },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPlan = searchParams.get("plan") ?? "basic_image";
  const defaultBilling = searchParams.get("billing") === "annual" ? "annual" : "monthly";

  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">(defaultBilling);
  const [form, setForm] = useState({ businessName: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan) setSelectedPlan(plan);
    const billing = searchParams.get("billing");
    if (billing === "annual" || billing === "monthly") setBillingInterval(billing);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Le password non coincidono");
      return;
    }
    if (form.password.length < 8) {
      setError("La password deve essere di almeno 8 caratteri");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: form.businessName,
        email: form.email,
        password: form.password,
        plan: selectedPlan,
        billingInterval,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Errore durante la registrazione");
      setLoading(false);
      return;
    }

    // Auto-login after registration
    const loginRes = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (loginRes?.error) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }

  const plan = PLANS.find(p => p.id === selectedPlan) ?? PLANS[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "hsl(240 10% 3.9%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: step === 1 ? 680 : 460, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <img src="/logo-negative.svg" alt="QRpop Logo" style={{ height: 36, width: "auto" }} />
          </Link>
        </div>

        {/* Step 1: Choose plan */}
        {step === 1 && (
          <div className="animate-fade-up">
            <h1 style={{ fontSize: 28, fontWeight: 800, textAlign: "center", marginBottom: 8 }}>
              Scegli il tuo piano
            </h1>
            <p style={{ textAlign: "center", color: "hsl(240 5% 55%)", fontSize: 15, marginBottom: 36 }}>
              Puoi cambiarlo in qualsiasi momento
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  style={{
                    background: selectedPlan === p.id ? "rgba(124,58,237,0.15)" : "hsl(240 6% 8%)",
                    border: selectedPlan === p.id ? "2px solid hsl(262 83% 58%)" : "2px solid transparent",
                    borderRadius: 16,
                    padding: "20px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: "hsl(240 5% 55%)", marginBottom: 8 }}>{p.desc}</div>
                  <div style={{
                    fontSize: 20, fontWeight: 800, fontFamily: "Space Grotesk, sans-serif",
                    color: selectedPlan === p.id ? "hsl(262 83% 72%)" : "white",
                  }}>{p.price}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: 15 }}
            >
              Continua con {plan.name} →
            </button>

            <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "hsl(240 5% 55%)" }}>
              Hai già un account?{" "}
              <Link href="/login" style={{ color: "hsl(262 83% 72%)", fontWeight: 600, textDecoration: "none" }}>
                Accedi
              </Link>
            </p>
          </div>
        )}

        {/* Step 2: Account details */}
        {step === 2 && (
          <div className="animate-fade-up">
            <button
              onClick={() => setStep(1)}
              style={{
                background: "none", border: "none", color: "hsl(240 5% 55%)",
                cursor: "pointer", fontSize: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 6,
              }}
            >
              ← Torna ai piani
            </button>

            <div className="card" style={{ padding: 40 }}>
              {/* Plan badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 14px", borderRadius: 10, marginBottom: 24,
                background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)",
              }}>
                <span>{plan.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "hsl(262 83% 75%)" }}>
                  {plan.name} — {plan.price}
                </span>
              </div>

              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 28 }}>Crea il tuo account</h1>

              {error && (
                <div style={{
                  padding: "12px 16px", borderRadius: 10, marginBottom: 20,
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                  color: "hsl(0 72% 70%)", fontSize: 14,
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(240 5% 70%)", marginBottom: 8 }}>
                    Nome del locale
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    className="input-field"
                    placeholder="Es. Pizzeria da Marco"
                    value={form.businessName}
                    onChange={e => setForm({ ...form, businessName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(240 5% 70%)", marginBottom: 8 }}>
                    Email
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    className="input-field"
                    placeholder="nome@locale.it"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(240 5% 70%)", marginBottom: 8 }}>
                    Password
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    className="input-field"
                    placeholder="Minimo 8 caratteri"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(240 5% 70%)", marginBottom: 8 }}>
                    Conferma password
                  </label>
                  <input
                    id="reg-confirm-password"
                    type="password"
                    className="input-field"
                    placeholder="Ripeti la password"
                    value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <button
                  id="register-submit"
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: "100%", marginTop: 8, padding: "14px", fontSize: 15 }}
                >
                  {loading ? "Creazione account..." : "Crea account e inizia →"}
                </button>

                <p style={{ textAlign: "center", fontSize: 12, color: "hsl(240 5% 45%)", lineHeight: 1.5 }}>
                  Creando un account accetti i termini di servizio. L&apos;abbonamento si attiva subito e può essere cancellato in qualsiasi momento.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
