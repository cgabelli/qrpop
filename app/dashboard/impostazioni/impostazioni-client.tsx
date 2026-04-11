"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { Save, Key } from "lucide-react";

export default function ImpostazioniClient({ utente }: { utente: any }) {
  const [saving, setSaving] = useState(false);
  const [openAiKey, setOpenAiKey] = useState(utente.openAiKey || "");
  const [geminiKey, setGeminiKey] = useState(utente.geminiKey || "");
  const [aiProvider, setAiProvider] = useState(utente.aiProvider || "openai");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openAiKey, geminiKey, aiProvider }),
      });

      if (res.ok) {
        setMessage("Impostazioni salvate con successo.");
      } else {
        setMessage("Errore durante il salvataggio.");
      }
    } catch (e) {
      setMessage("Errore di rete.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Impostazioni Piattaforma</h1>
      <p style={{ color: "hsl(240 5% 65%)", marginBottom: 40 }}>Configura le integrazioni esterne e i tuoi dati personali.</p>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Key size={20} color="hsl(262 83% 68%)" /> Integrazione AI (Bring Your Own Key)
        </h2>
        <p style={{ color: "hsl(240 5% 65%)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
          QRpop Studio ti permette di usare l'intelligenza artificiale per farti scrivere in autonomia i testi promozionali (Copywriting) perfetti per il tuo business. Per far questo, utilizza la tua chiave personale per abbattere ogni costo mensile. Seleziona il tuo provider preferito.
        </p>

        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
           <button 
             onClick={() => setAiProvider("openai")}
             style={{ flex: 1, padding: 16, borderRadius: 12, border: aiProvider === "openai" ? "2px solid hsl(262 83% 68%)" : "1px solid rgba(255,255,255,0.1)", background: aiProvider === "openai" ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.02)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transition: "all 0.2s" }}
           >
             <span style={{ fontSize: 16, fontWeight: 600, color: "white" }}>OpenAI</span>
             <span style={{ fontSize: 12, color: "hsl(240 5% 60%)" }}>ChatGPT 4o-mini</span>
           </button>

           <button 
             onClick={() => setAiProvider("gemini")}
             style={{ flex: 1, padding: 16, borderRadius: 12, border: aiProvider === "gemini" ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)", background: aiProvider === "gemini" ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.02)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transition: "all 0.2s" }}
           >
             <span style={{ fontSize: 16, fontWeight: 600, color: "white" }}>Google Gemini</span>
             <span style={{ fontSize: 12, color: "hsl(240 5% 60%)" }}>Gemini 1.5 Flash</span>
           </button>
        </div>

        {aiProvider === "openai" && (
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "white" }}>
              Chiave API OpenAI Segreta
            </label>
            <input 
              type="password"
              className="input-field"
              placeholder="sk-proj-..."
              value={openAiKey}
              onChange={(e) => setOpenAiKey(e.target.value)}
              style={{ width: "100%", marginBottom: 20 }}
            />
          </div>
        )}

        {aiProvider === "gemini" && (
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "white" }}>
              Chiave API Google Gemini
            </label>
            <input 
              type="password"
              className="input-field"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              style={{ width: "100%", marginBottom: 20 }}
            />
          </div>
        )}

        {message && (
          <div style={{ padding: 12, background: message.includes("Errore") ? "rgba(225,29,72,0.1)" : "rgba(34,197,94,0.1)", color: message.includes("Errore") ? "hsl(340 82% 65%)" : "hsl(142 71% 45%)", borderRadius: 8, fontSize: 14, marginBottom: 20 }}>
            {message}
          </div>
        )}

        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Save size={16} />
          {saving ? "Salvataggio..." : "Salva Impostazioni"}
        </button>

      </div>
    </div>
  );
}
