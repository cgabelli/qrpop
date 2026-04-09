"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

interface Plan {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  features: string[];
  addon?: {
    price: number;
    amount: number;
  } | null;
}

const PLANS_LIST: Plan[] = [
  { 
    id: "media", 
    name: "Media", 
    type: "video", 
    description: "10 upload all'anno (JPG, GIF, MP4)", 
    price: 49,
    features: ["10 upload all'anno", "Formati supportati: JPG, GIF, MP4", "QR code statico dedicato", "Scheduling contenuti"],
    addon: { price: 15, amount: 10 }
  },
  { 
    id: "pdf", 
    name: "Pdf", 
    type: "pdf", 
    description: "20 upload all'anno (Incluso PDF)", 
    price: 99,
    features: ["20 upload all'anno", "Supporto file PDF per Menu", "Modifica contenuti fluida", "Video autoplay mobile"],
    addon: { price: 25, amount: 10 }
  },
  { 
    id: "unlimited", 
    name: "Unlimited", 
    type: "pdf", 
    description: "Upload illimitati (qualunque formato)", 
    price: 149,
    features: ["Upload illimitati totali", "Tutti i formati (Inclusi PDF Multi-pagina)", "QR code statico dedicato", "Analytics e report (Prossimamente)"],
    addon: null
  },
];

interface Props {
  currentPlanId: string;
  currentPlanName: string;
  currentPlanDesc: string;
  stripeSubscriptionId: string | null;
  baseCredits: number;
  purchasedCredits: number;
  successParam: boolean;
  canceledParam: boolean;
}

export default function AbbonamentoClient({
  currentPlanId,
  currentPlanName,
  currentPlanDesc,
  stripeSubscriptionId,
  baseCredits,
  purchasedCredits,
  successParam,
  canceledParam,
}: Props) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const currentPlanData = PLANS_LIST.find(p => p.id === currentPlanId);
  const currentPrice = currentPlanData ? currentPlanData.price : 0;

  async function handleChangePlan(planId: string, isAddon: boolean = false) {
    setLoadingPlan(isAddon ? `addon_${planId}` : planId);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, isAddon }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoadingPlan(null);
  }

  const isUnlimited = currentPlanId === "unlimited";
  const totalCredits = baseCredits + purchasedCredits;

  return (
    <div style={{ padding: "40px 48px", maxWidth: 900 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Abbonamento</h1>
        <p style={{ color: "hsl(240 5% 55%)", fontSize: 16 }}>Gestisci il tuo piano e i crediti QRpop</p>
      </div>

      {successParam && (
        <div style={{ padding: "16px 20px", borderRadius: 12, marginBottom: 24, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "hsl(142 71% 60%)", fontSize: 15, fontWeight: 500 }}>
          ✅ Operazione completata con successo! I tuoi vantaggi sono attivi.
        </div>
      )}
      {canceledParam && (
        <div style={{ padding: "16px 20px", borderRadius: 12, marginBottom: 24, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", color: "hsl(38 92% 65%)", fontSize: 15 }}>
          ⚠️ Pagamento annullato. Nessuna modifica è stata apportata.
        </div>
      )}

      {/* Current plan */}
      <div className="card" style={{ padding: 32, marginBottom: 32, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(262 83% 65%)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Piano attivo
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{currentPlanName}</div>
            <div style={{ fontSize: 15, color: "hsl(240 5% 60%)" }}>{currentPlanDesc}</div>
            
            {!isUnlimited && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 13, color: "hsl(240 5% 60%)", marginBottom: 8, fontWeight: 600 }}>Portafoglio Crediti</div>
                <div style={{ display: "flex", gap: 16 }}>
                   <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }}>
                      <div style={{ fontSize: 12, color: "hsl(240 5% 50%)" }}>Base Annuali</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: baseCredits > 0 ? "white" : "hsl(340 82% 65%)" }}>{baseCredits}</div>
                   </div>
                   <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }}>
                      <div style={{ fontSize: 12, color: "hsl(240 5% 50%)" }}>Acquistati</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{purchasedCredits}</div>
                   </div>
                </div>
              </div>
            )}
            {isUnlimited && (
              <div style={{ marginTop: 24 }}>
                <div style={{ display: "inline-block", background: "rgba(34,197,94,0.1)", padding: "8px 16px", borderRadius: 8, color: "hsl(142 71% 55%)", fontWeight: 700 }}>
                  ✓ Upload Illimitati Attivati
                </div>
              </div>
            )}

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16,
              padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700,
              background: "rgba(34,197,94,0.12)",
              color: "hsl(142 71% 55%)",
            }}>
              📅 Fatturato annualmente
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "hsl(262 83% 72%)", fontFamily: "Space Grotesk, sans-serif" }}>
              €{currentPrice}
            </div>
            <div style={{ fontSize: 14, color: "hsl(240 5% 50%)" }}>
              all'anno
            </div>

            {/* Ricarica Addon Button */}
            {!isUnlimited && currentPlanData?.addon && (
               <button
                  onClick={() => handleChangePlan(currentPlanId, true)}
                  disabled={loadingPlan !== null}
                  style={{
                     marginTop: 16, display: "block", width: "100%", background: "linear-gradient(135deg, hsl(262 83% 58%), hsl(330 81% 60%))",
                     border: "none", color: "white", padding: "10px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14
                  }}
               >
                  {loadingPlan === `addon_${currentPlanId}` ? "..." : `+${currentPlanData.addon.amount} Crediti (€${currentPlanData.addon.price})`}
               </button>
            )}

          </div>
        </div>
        {stripeSubscriptionId && (
          <div style={{ marginTop: 20, fontSize: 13, color: "hsl(240 5% 50%)" }}>
            ID abbonamento: <code style={{ color: "hsl(240 5% 65%)" }}>{stripeSubscriptionId}</code>
          </div>
        )}
      </div>

      {/* Change plan */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Piani disponibili</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {PLANS_LIST.map(plan => {
          const isCurrent = plan.id === currentPlanId;
          const price = plan.price;
          return (
            <div
              key={plan.id}
              style={{
                background: isCurrent ? "rgba(124,58,237,0.1)" : "hsl(240 6% 8%)",
                border: isCurrent ? "1px solid rgba(124,58,237,0.4)" : "1px solid hsl(240 5% 15%)",
                borderRadius: 16, padding: 24,
                display: "flex", flexDirection: "column", justifyContent: "space-between"
              }}
            >
              <div>
                 <div style={{ fontSize: 12, fontWeight: 700, color: "hsl(240 5% 55%)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                   {plan.type === "image" ? "🖼️ Immagine" : plan.type === "pdf" ? "📄 Pdf & Media" : "🎬 Video"}
                 </div>
                 <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{plan.name}</div>
                 <div style={{ fontSize: 13, color: "hsl(240 5% 55%)", marginBottom: 12 }}>{plan.description}</div>
                 <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", marginBottom: 4 }}>
                   €{price}
                 </div>
                 <div style={{ fontSize: 12, color: "hsl(142 71% 55%)", marginBottom: 16 }}>
                   all'anno
                 </div>
                 <ul style={{ padding: 0, margin: "0 0 24px 0", listStyle: "none" }}>
                    {plan.features?.map((f, i) => (
                       <li key={i} style={{ fontSize: 13, color: "hsl(240 5% 65%)", marginBottom: 6, display: "flex", gap: 6, alignItems: "start" }}>
                          <span style={{ color: "hsl(262 83% 65%)" }}>✓</span> {f}
                       </li>
                    ))}
                 </ul>
              </div>

              {isCurrent ? (
                <div style={{ padding: "10px", textAlign: "center", borderRadius: 10, background: "rgba(124,58,237,0.15)", color: "hsl(262 83% 72%)", fontSize: 13, fontWeight: 600 }}>
                  Piano attuale ✓
                </div>
              ) : (
                <button
                  onClick={() => handleChangePlan(plan.id)}
                  disabled={loadingPlan !== null}
                  className="btn-ghost"
                  style={{ display: "block", width: "100%", textAlign: "center" }}
                >
                  {loadingPlan === plan.id ? "..." : `Passa a ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
