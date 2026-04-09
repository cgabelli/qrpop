"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

interface Plan {
  id: string;
  name: string;
  type: string;
  description: string;
  monthly: { price: number };
  annual: { price: number; monthlyEquiv: number };
}

const PLANS_LIST: Plan[] = [
  { id: "basic_image", name: "Immagine Base", type: "image", description: "3 upload al mese", monthly: { price: 10 }, annual: { price: 99, monthlyEquiv: 8 } },
  { id: "unlimited_image", name: "Immagine Unlimited", type: "image", description: "Upload illimitati", monthly: { price: 15 }, annual: { price: 149, monthlyEquiv: 12 } },
  { id: "basic_video", name: "Video Base", type: "video", description: "2 video al mese", monthly: { price: 20 }, annual: { price: 199, monthlyEquiv: 17 } },
  { id: "unlimited_video", name: "Video Unlimited", type: "video", description: "Video illimitati", monthly: { price: 50 }, annual: { price: 499, monthlyEquiv: 42 } },
];

interface Props {
  currentPlanId: string;
  currentBillingInterval: string;
  currentPlanName: string;
  currentPlanDesc: string;
  stripeSubscriptionId: string | null;
  successParam: boolean;
  canceledParam: boolean;
}

export default function AbbonamentoClient({
  currentPlanId,
  currentBillingInterval,
  currentPlanName,
  currentPlanDesc,
  stripeSubscriptionId,
  successParam,
  canceledParam,
}: Props) {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">(
    currentBillingInterval === "annual" ? "annual" : "monthly"
  );
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const currentPlanData = PLANS_LIST.find(p => p.id === currentPlanId);
  const currentPrice = currentPlanData
    ? (currentBillingInterval === "annual" ? currentPlanData.annual.price : currentPlanData.monthly.price)
    : 0;

  async function handleChangePlan(planId: string) {
    setLoadingPlan(planId);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, billingInterval }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoadingPlan(null);
  }

  return (
    <div style={{ padding: "40px 48px", maxWidth: 900 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Abbonamento</h1>
        <p style={{ color: "hsl(240 5% 55%)", fontSize: 16 }}>Gestisci il tuo piano QRpop</p>
      </div>

      {successParam && (
        <div style={{ padding: "16px 20px", borderRadius: 12, marginBottom: 24, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "hsl(142 71% 60%)", fontSize: 15, fontWeight: 500 }}>
          ✅ Abbonamento attivato con successo! Benvenuto nel piano {currentPlanName}.
        </div>
      )}
      {canceledParam && (
        <div style={{ padding: "16px 20px", borderRadius: 12, marginBottom: 24, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", color: "hsl(38 92% 65%)", fontSize: 15 }}>
          ⚠️ Pagamento annullato. Il tuo piano non è stato modificato.
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
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10,
              padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700,
              background: currentBillingInterval === "annual" ? "rgba(34,197,94,0.12)" : "rgba(124,58,237,0.12)",
              color: currentBillingInterval === "annual" ? "hsl(142 71% 55%)" : "hsl(262 83% 72%)",
            }}>
              {currentBillingInterval === "annual" ? "📅 Fatturato annualmente" : "📆 Fatturato mensilmente"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "hsl(262 83% 72%)", fontFamily: "Space Grotesk, sans-serif" }}>
              €{currentPrice}
            </div>
            <div style={{ fontSize: 14, color: "hsl(240 5% 50%)" }}>
              {currentBillingInterval === "annual" ? "all'anno" : "al mese"}
            </div>
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
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Cambia piano</h2>

        {/* Interval toggle */}
        <div style={{
          display: "inline-flex", alignItems: "center",
          background: "hsl(240 6% 8%)", border: "1px solid hsl(240 5% 15%)",
          borderRadius: 999, padding: "4px 6px",
        }}>
          {(["monthly", "annual"] as const).map(val => (
            <button
              key={val}
              onClick={() => setBillingInterval(val)}
              style={{
                padding: "7px 16px", borderRadius: 999, border: "none", cursor: "pointer",
                background: billingInterval === val ? "linear-gradient(135deg, hsl(262 83% 58%), hsl(330 81% 60%))" : "transparent",
                color: billingInterval === val ? "white" : "hsl(240 5% 55%)",
                fontSize: 13, fontWeight: 600, transition: "all 0.2s", fontFamily: "Inter, sans-serif",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {val === "annual" ? "Annuale" : "Mensile"}
              {val === "annual" && (
                <span style={{ padding: "1px 6px", borderRadius: 999, fontSize: 10, fontWeight: 700, background: "rgba(34,197,94,0.2)", color: "hsl(142 71% 55%)" }}>
                  -17%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {PLANS_LIST.map(plan => {
          const isCurrent = plan.id === currentPlanId && currentBillingInterval === billingInterval;
          const price = billingInterval === "annual" ? plan.annual.price : plan.monthly.price;
          return (
            <div
              key={plan.id}
              style={{
                background: isCurrent ? "rgba(124,58,237,0.1)" : "hsl(240 6% 8%)",
                border: isCurrent ? "1px solid rgba(124,58,237,0.4)" : "1px solid hsl(240 5% 15%)",
                borderRadius: 16, padding: 24,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "hsl(240 5% 55%)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {plan.type === "image" ? "🖼️ Immagine" : "🎬 Video"}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontSize: 13, color: "hsl(240 5% 55%)", marginBottom: 12 }}>{plan.description}</div>
              <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", marginBottom: billingInterval === "annual" ? 4 : 20 }}>
                €{price}
              </div>
              {billingInterval === "annual" && (
                <div style={{ fontSize: 12, color: "hsl(142 71% 55%)", marginBottom: 16 }}>
                  ≈ €{plan.annual.monthlyEquiv}/mese
                </div>
              )}

              {isCurrent ? (
                <div style={{ padding: "10px", textAlign: "center", borderRadius: 10, background: "rgba(124,58,237,0.15)", color: "hsl(262 83% 72%)", fontSize: 13, fontWeight: 600 }}>
                  Piano attuale ✓
                </div>
              ) : (
                <button
                  onClick={() => handleChangePlan(plan.id)}
                  disabled={!!loadingPlan}
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
