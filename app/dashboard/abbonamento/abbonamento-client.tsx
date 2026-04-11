"use client";

import { useState } from "react";
import { QRSpot } from "@prisma/client";
import { QR_SPOT_TYPES, QRSpotTypeId } from "@/lib/plans";

interface Props {
  qrSpots: QRSpot[];
  successParam: boolean;
  canceledParam: boolean;
}

export default function AbbonamentoClient({
  qrSpots,
  successParam,
  canceledParam,
}: Props) {
  const [loadingSpot, setLoadingSpot] = useState<string | null>(null);

  async function handleBuyNewSpot(spotTypeId: string) {
    setLoadingSpot(spotTypeId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spotTypeId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Errore nella comunicazione con Stripe");
        setLoadingSpot(null);
      }
    } catch (err) {
      alert("Errore di rete");
      setLoadingSpot(null);
    }
  }

  // Prendi i tipi configurati rimuovendo il piano "free" se non ha un prezzo Stripe definito per l'acquisto
  const SPOT_OPTIONS = Object.values(QR_SPOT_TYPES).filter(s => s.annualPrice !== undefined && s.price > 0);

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1000 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>I Tuoi QR Spot</h1>
        <p style={{ color: "hsl(240 5% 55%)", fontSize: 16 }}>Gestisci i tuoi canali QR o espandi le tue postazioni</p>
      </div>

      {successParam && (
        <div style={{ padding: "16px 20px", borderRadius: 12, marginBottom: 24, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "hsl(142 71% 60%)", fontSize: 15, fontWeight: 500 }}>
          ✅ Acquisto completato con successo! Il tuo nuovo QR Spot è pronto.
        </div>
      )}
      {canceledParam && (
        <div style={{ padding: "16px 20px", borderRadius: 12, marginBottom: 24, background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.25)", color: "hsl(340 82% 65%)", fontSize: 15, fontWeight: 500 }}>
          ❌ Pagamento annullato. Nessun addebito è stato effettuato.
        </div>
      )}

      {/* Spots attuali */}
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "white", marginBottom: 16 }}>Spot Acquistati</h2>
      {qrSpots.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)" }}>
          <p style={{ color: "hsl(240 5% 60%)" }}>Nessun QR Spot attivo al momento.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, marginBottom: 60 }}>
          {qrSpots.map(spot => {
             const typeDef = QR_SPOT_TYPES[spot.type as QRSpotTypeId];
             const isActive = spot.status === "active";
             return (
              <div key={spot.id} style={{ 
                background: "rgba(255,255,255,0.03)", 
                border: isActive ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.06)", 
                borderRadius: 16, padding: 20 
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{typeDef?.emoji || "📱"}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "white" }}>{spot.name}</h3>
                  </div>
                  <div style={{ 
                    padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                    background: isActive ? "rgba(34,197,94,0.15)" : "rgba(225,29,72,0.15)",
                    color: isActive ? "hsl(142 71% 55%)" : "hsl(340 82% 65%)"
                  }}>
                    {spot.status}
                  </div>
                </div>
                
                <div style={{ fontSize: 13, color: "hsl(240 5% 65%)", marginBottom: 16 }}>
                  <div><strong>Tipo:</strong> {typeDef?.name || spot.type}</div>
                  <div><strong>Scadenza:</strong> {spot.expiresAt ? new Date(spot.expiresAt).toLocaleDateString("it-IT") : "Mai"}</div>
                </div>
              </div>
             )
          })}
        </div>
      )}

      {/* Acquista nuovi */}
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "white", marginBottom: 16 }}>Compra una nuova Postazione QR</h2>
      <p style={{ color: "hsl(240 5% 55%)", fontSize: 15, marginBottom: 24 }}>Aggiungi un nuovo QR. Ogni QR ha la sua immagine e i suoi permessi indipendenti.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {SPOT_OPTIONS.map(spot => {
          return (
            <div key={spot.id} style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20, padding: 24, display: "flex", flexDirection: "column"
            }}>
               <div style={{ fontSize: 32, marginBottom: 12 }}>{spot.emoji}</div>
               <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{spot.name}</div>
               <div style={{ fontSize: 13, color: "hsl(240 5% 55%)", marginBottom: 16, minHeight: 40 }}>{spot.description}</div>
               
               <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", marginBottom: 24 }}>
                 €{spot.price}<span style={{ fontSize: 14, color: "hsl(240 5% 55%)", fontWeight: 500 }}>/anno</span>
               </div>
               
               <div style={{ flex: 1 }}>
                 <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                   {spot.features.slice(0, 3).map((f, i) => (
                     <li key={i} style={{ fontSize: 13, color: "hsl(240 5% 70%)", display: "flex", alignItems: "center", gap: 8 }}>
                       <span style={{ color: "hsl(142 71% 45%)" }}>✓</span> {f}
                     </li>
                   ))}
                 </ul>
               </div>

               <button
                  onClick={() => handleBuyNewSpot(spot.id)}
                  disabled={loadingSpot !== null}
                  className="btn-primary"
                  style={{
                    width: "100%", padding: "12px 0", fontSize: 14, borderRadius: 12,
                    opacity: loadingSpot ? 0.7 : 1, pointerEvents: loadingSpot ? "none" : "auto",
                  }}
               >
                 {loadingSpot === spot.id ? "Apertura Checkout..." : `Acquista QR ${spot.name}`}
               </button>
            </div>
          )
        })}
      </div>
    </div>
  );
}
