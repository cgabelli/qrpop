"use client";

import { useState } from "react";
import { QRSpot } from "@prisma/client";
import { QR_SPOT_TYPES, QRSpotTypeId } from "@/lib/plans";
import Link from "next/link";

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
    if (spotTypeId === "free") {
      setLoadingSpot(spotTypeId);
      try {
        const res = await fetch("/api/qrspot/free", { method: "POST" });
        if (res.ok) {
          window.location.reload();
        } else {
          const data = await res.json();
          alert(data.error || "Errore nella comunicazione");
          setLoadingSpot(null);
        }
      } catch (err) {
        alert("Errore di rete");
        setLoadingSpot(null);
      }
      return;
    }

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
  const SPOT_OPTIONS = Object.values(QR_SPOT_TYPES);

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1000 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>I Tuoi QR Spot</h1>
        <p style={{ color: "#475569", fontSize: 16 }}>Gestisci i tuoi canali QR o espandi le tue postazioni</p>
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
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Spot Acquistati</h2>
      {qrSpots.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", background: "#f8fafc", borderRadius: 16, border: "1px dashed #cbd5e1" }}>
          <p style={{ color: "#64748b", fontWeight: 500 }}>Nessun QR Spot attivo al momento.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, marginBottom: 60 }}>
          {qrSpots.map(spot => {
             const typeDef = QR_SPOT_TYPES[spot.type as QRSpotTypeId];
             const isActive = spot.status === "active";
             return (
              <Link 
                href={`/dashboard/qr/${spot.id}`}
                key={spot.id} 
                style={{ 
                  background: "white", 
                  border: isActive ? "2px solid #2563eb" : "1px solid #e2e8f0", 
                  borderRadius: 16, padding: 20,
                  textDecoration: "none", color: "inherit",
                  display: "flex", flexDirection: "column",
                  transition: "all 0.2s",
                  boxShadow: isActive ? "0 10px 20px -10px rgba(37,99,235,0.2)" : "0 4px 6px -1px rgba(0,0,0,0.02)"
                }}
                className="hover-card"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{typeDef?.emoji || "📱"}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{spot.name}</h3>
                  </div>
                  <div style={{ 
                    padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                    background: isActive ? "rgba(34,197,94,0.15)" : "rgba(225,29,72,0.15)",
                    color: isActive ? "hsl(142 71% 55%)" : "hsl(340 82% 65%)"
                  }}>
                    {spot.status}
                  </div>
                </div>
                
                <div style={{ fontSize: 13, color: "#475569", marginBottom: 16, flex: 1, fontWeight: 500 }}>
                  <div><strong style={{ color: "#0f172a" }}>Tipo:</strong> {typeDef?.name || spot.type}</div>
                  <div><strong style={{ color: "#0f172a" }}>Scadenza:</strong> {spot.expiresAt ? new Date(spot.expiresAt).toLocaleDateString("it-IT") : "Mai"}</div>
                </div>

                <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
                   <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 700 }}>Gestisci →</span>
                </div>
              </Link>
             )
          })}
        </div>
      )}

      {/* Acquista nuovi */}
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Compra una nuova Postazione QR</h2>
      <p style={{ color: "#475569", fontSize: 15, marginBottom: 24, fontWeight: 500 }}>Aggiungi un nuovo QR. Ogni QR ha la sua immagine e i suoi permessi indipendenti.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {SPOT_OPTIONS.map(spot => {
          return (
            <div key={spot.id} style={{
              background: "white",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 20px -10px rgba(0,0,0,0.05)",
              borderRadius: 20, padding: 24, display: "flex", flexDirection: "column"
            }}>
               <div style={{ fontSize: 32, marginBottom: 12 }}>{spot.emoji}</div>
               <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{spot.name}</div>
               <div style={{ fontSize: 13, color: "#475569", marginBottom: 16, minHeight: 40, fontWeight: 500 }}>{spot.description}</div>
               
               <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", marginBottom: 24, color: "#0f172a" }}>
                 {spot.price === 0 ? "Gratis" : `€${spot.price}`}<span style={{ fontSize: 14, color: "#64748b", fontWeight: 600 }}>/anno</span>
               </div>
               
               <div style={{ flex: 1 }}>
                 <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                   {spot.features.slice(0, 3).map((f, i) => (
                     <li key={i} style={{ fontSize: 13, color: "#334155", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                       <span style={{ color: "#2563eb", fontWeight: 800 }}>✓</span> {f}
                     </li>
                   ))}
                 </ul>
               </div>

               <button
                  onClick={() => handleBuyNewSpot(spot.id)}
                  disabled={loadingSpot !== null}
                  className={spot.price === 0 ? "btn-ghost" : "btn-primary"}
                  style={{
                    width: "100%", padding: "12px 0", fontSize: 15, borderRadius: 12,
                    opacity: loadingSpot ? 0.7 : 1, pointerEvents: loadingSpot ? "none" : "auto",
                    background: spot.price === 0 ? "#f1f5f9" : undefined,
                    border: spot.price === 0 ? "1px solid #e2e8f0" : undefined,
                    color: spot.price === 0 ? "#0f172a" : undefined,
                  }}
               >
                 {loadingSpot === spot.id ? "Apertura..." : spot.price === 0 ? `Attiva QR ${spot.name}` : `Acquista QR ${spot.name}`}
               </button>
            </div>
          )
        })}
      </div>
    </div>
  );
}
