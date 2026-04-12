"use client";

import { useState } from "react";

export default function WalletForm({ qrSpotId, template }: { qrSpotId: string; template: any }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/wallet/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrSpotId, firstName, lastName: "", email })
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Errore di rete" });
    }
    setLoading(false);
  };

  if (result?.success) {
    return (
      <div style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>Carta Generata!</h2>
        <p style={{ color: "hsl(240 5% 65%)", lineHeight: 1.6, marginBottom: 24 }}>
          {result.message}
        </p>
        <div style={{ padding: 16, background: "rgba(255,255,255,0.05)", borderRadius: 12, fontSize: 13, color: "hsl(240 5% 50%)" }}>
          Pass Serial: {result.passSerial}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400, margin: "0 auto", padding: 32 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: template?.textColor || "white" }}>
          {template?.brandName || "Ricevi la tua Carta"}
        </h2>
        <p style={{ color: "hsl(240 5% 65%)", fontSize: 15 }}>
          Inserisci i tuoi dati per aggiungere la tessera fedeltà a Wallet e accumulare sconti.
        </p>
      </div>

      {result?.error && (
        <div style={{ padding: 12, background: "rgba(225,29,72,0.1)", color: "hsl(340 82% 65%)", borderRadius: 8, fontSize: 14, marginBottom: 20 }}>
          {result.error}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 13, color: "hsl(240 5% 65%)", marginBottom: 6 }}>Nome</label>
        <input 
          required 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 16 }} 
          placeholder="Il tuo nome" 
        />
      </div>

      <div style={{ marginBottom: 32 }}>
        <label style={{ display: "block", fontSize: 13, color: "hsl(240 5% 65%)", marginBottom: 6 }}>Indirizzo Email</label>
        <input 
          required 
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 16 }} 
          placeholder="La tua email" 
        />
      </div>

      <button type="submit" disabled={loading} style={{ width: "100%", padding: 16, borderRadius: 12, background: "white", color: "black", fontWeight: 700, fontSize: 16, cursor: "pointer", border: "none" }}>
        {loading ? "Generazione in corso..." : "Aggiungi a Apple Wallet"}
      </button>
    </form>
  );
}
