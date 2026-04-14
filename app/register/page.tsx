"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const PLANS = [
  { id: "free", name: "Link Redirect", price: "Gratis", icon: "🔗", desc: "Prova senza impegno" },
  { id: "image", name: "Immagine", price: "€ 19/anno", icon: "🖼️", desc: "Menu foto e promozioni visive" },
  { id: "video", name: "Video", price: "€ 29/anno", icon: "🎥", desc: "Promo video in loop sui tavoli" },
  { id: "pdf", name: "PDF", price: "€ 49/anno", icon: "📄", desc: "Menù e cataloghi professionali" },
  { id: "unlimited", name: "Unlimited", price: "€ 99/anno", icon: "🌟", desc: "Nessun vincolo, massima libertà" },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPlan = searchParams.get("spot") ?? searchParams.get("plan") ?? "free";

  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [isCompany, setIsCompany] = useState<boolean | null>(null);
  
  const [form, setForm] = useState({ 
    firstName: "", lastName: "", businessName: "", 
    address: "", city: "", zipCode: "", province: "", 
    fiscalCode: "", vatNumber: "", sdiCode: "", phone: "",
    email: "", password: "", confirmPassword: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const plan = searchParams.get("spot") ?? searchParams.get("plan");
    if (plan) setSelectedPlan(plan);
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

    const payload = {
      ...form,
      plan: selectedPlan,
      isCompany,
      billingInterval: "annual"
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Errore durante la registrazione");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  const plan = PLANS.find(p => p.id === selectedPlan) ?? PLANS[0];

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#f8fafc" }}>
        <div style={{ maxWidth: 460, padding: 40, textAlign: "center", background: "white", border: "1px solid #e2e8f0", borderRadius: 24, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16, color: "#0f172a" }}>Controlla la tua email</h1>
          <p style={{ color: "#475569", lineHeight: 1.6, marginBottom: 24, fontWeight: 500 }}>
            Ti abbiamo inviato un link di verifica all'indirizzo <strong>{form.email}</strong>.<br/><br/>
            Clicca sul link per confermare la tua identità e accedere alla piattaforma.
          </p>
          <Link href="/accedi" className="btn-primary" style={{ display: "inline-block", padding: "12px 24px", textDecoration: "none" }}>
            Vai al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f8fafc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: step === 1 ? 680 : 560, position: "relative", zIndex: 1, paddingBottom: 40 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-block" }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#0f172a", letterSpacing: -1 }}>QRpop</div>
          </Link>
        </div>

        {/* Step 1: Choose plan */}
        {step === 1 && (
          <div className="animate-fade-up">
            <h1 style={{ fontSize: 28, fontWeight: 800, textAlign: "center", color: "#0f172a", marginBottom: 8 }}>Scegli il tuo piano</h1>
            <p style={{ textAlign: "center", color: "#475569", fontWeight: 500, fontSize: 15, marginBottom: 36 }}>Puoi cambiarlo in qualsiasi momento</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  style={{
                    background: selectedPlan === p.id ? "#eff6ff" : "white",
                    border: selectedPlan === p.id ? "2px solid #2563eb" : "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                    borderRadius: 16, padding: "20px", cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 20
                  }}
                >
                  <div style={{ fontSize: 32 }}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 14, color: "#475569", fontWeight: 500 }}>{p.desc}</div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", color: selectedPlan === p.id ? "#2563eb" : "#0f172a" }}>
                    {p.price}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="btn-primary"
              style={{ width: "100%", padding: "16px", fontSize: 16, fontWeight: 600 }}
            >
              Continua con {plan.name} →
            </button>
            <p style={{ textAlign: "center", marginTop: 24, fontSize: 15, color: "#475569", fontWeight: 500 }}>
              Hai già un account? <Link href="/accedi" style={{ color: "#2563eb", fontWeight: 800, textDecoration: "none" }}>Accedi</Link>
            </p>
          </div>
        )}

        {/* Step 2: Choose type */}
        {step === 2 && (
          <div className="animate-fade-up">
            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#475569", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>← Torna ai piani</button>
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 24, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", padding: "40px" }}>
              <h1 style={{ fontSize: 24, color: "#0f172a", fontWeight: 800, textAlign: "center", marginBottom: 12 }}>Chi sei?</h1>
              <p style={{ textAlign: "center", color: "#475569", fontWeight: 500, marginBottom: 32 }}>Per offrirti il servizio e redigere i documenti fiscali, abbiamo bisogno di sapere come registrarti.</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <button
                  onClick={() => { setIsCompany(false); setStep(3); }}
                  style={{ background: "white", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", padding: 30, borderRadius: 16, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                >
                  <div style={{ fontSize: 40, marginBottom: 16 }}>👤</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Privato</h3>
                  <p style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>Acquisto senza Partita IVA</p>
                </button>

                <button
                  onClick={() => { setIsCompany(true); setStep(3); }}
                  style={{ background: "white", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", padding: 30, borderRadius: 16, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                >
                  <div style={{ fontSize: 40, marginBottom: 16 }}>🏢</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Azienda</h3>
                  <p style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>Acquisto con P.IVA e SDI</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Complex form */}
        {step === 3 && (
          <div className="animate-fade-up">
            <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: "#475569", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>← Indietro</button>
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 24, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", padding: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Dati {isCompany ? "Aziendali" : "Personali"}</h1>
                <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb" }}>
                  Piano: {plan.name}
                </span>
              </div>

              {error && (
                <div style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 20, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "hsl(0 72% 70%)", fontSize: 14 }}>{error}</div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                
                {isCompany ? (
                  <>
                    <div>
                      <label className="form-label">Ragione Sociale *</label>
                      <input className="input-field" type="text" value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} required />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label className="form-label">Nome Referente *</label>
                        <input className="input-field" type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
                      </div>
                      <div>
                        <label className="form-label">Cognome Referente *</label>
                        <input className="input-field" type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label className="form-label">Nome *</label>
                      <input className="input-field" type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
                    </div>
                    <div>
                      <label className="form-label">Cognome *</label>
                      <input className="input-field" type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
                    </div>
                  </div>
                )}

                <div>
                  <label className="form-label">Indirizzo (Via e Civico) *</label>
                  <input className="input-field" type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
                  <div>
                    <label className="form-label">Comune *</label>
                    <input className="input-field" type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required />
                  </div>
                  <div>
                    <label className="form-label">CAP *</label>
                    <input className="input-field" type="text" value={form.zipCode} onChange={e => setForm({...form, zipCode: e.target.value})} required />
                  </div>
                </div>

                <div>
                  <label className="form-label">Provincia (Sigla) *</label>
                  <input className="input-field" type="text" maxLength={2} value={form.province} onChange={e => setForm({...form, province: e.target.value})} required style={{ textTransform: "uppercase" }} />
                </div>

                {isCompany ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label className="form-label">Partita IVA *</label>
                      <input className="input-field" type="text" value={form.vatNumber} onChange={e => setForm({...form, vatNumber: e.target.value})} required />
                    </div>
                    <div>
                      <label className="form-label">Codice univoco SDI *</label>
                      <input className="input-field" type="text" maxLength={7} value={form.sdiCode} onChange={e => setForm({...form, sdiCode: e.target.value})} required style={{ textTransform: "uppercase" }} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="form-label">Codice Fiscale *</label>
                    <input className="input-field" type="text" maxLength={16} value={form.fiscalCode} onChange={e => setForm({...form, fiscalCode: e.target.value})} required style={{ textTransform: "uppercase" }} />
                  </div>
                )}

                <div>
                  <label className="form-label">Cellulare (Opzionale)</label>
                  <input className="input-field" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>

                <div style={{ height: 1, backgroundColor: "#e2e8f0", margin: "8px 0" }} />

                <div>
                  <label className="form-label">Email di accesso *</label>
                  <input className="input-field" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required autoComplete="username" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label className="form-label">Password *</label>
                    <input className="input-field" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required autoComplete="new-password" />
                  </div>
                  <div>
                    <label className="form-label">Conferma Password *</label>
                    <input className="input-field" type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required autoComplete="new-password" />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 8 }}>
                  <input type="checkbox" id="accepted-terms" required style={{ marginTop: 3, cursor: "pointer", accentColor: "#2563eb", width: 16, height: 16 }} />
                  <label htmlFor="accepted-terms" style={{ fontSize: 13, color: "#475569", fontWeight: 500, lineHeight: 1.5, cursor: "pointer" }}>
                    Dichiaro l'esattezza dei dati inseriti e accetto i <Link href="/termini" target="_blank" style={{ color: "#2563eb", fontWeight: 700 }}>Termini e Condizioni</Link> e la <Link href="/privacy" target="_blank" style={{ color: "#2563eb", fontWeight: 700 }}>Privacy Policy</Link>.
                  </label>
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", marginTop: 12, padding: "16px", fontSize: 15, fontWeight: 600 }}>
                  {loading ? "Creazione in corso..." : "Crea account e verifica l'email →"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .form-label { display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px; }
      `}} />
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
