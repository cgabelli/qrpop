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
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: "#0f172a" }}>Impostazioni Piattaforma</h1>
      <p style={{ color: "#475569", marginBottom: 40, fontSize: 16 }}>Configura le integrazioni esterne e i tuoi dati personali.</p>

      <div style={{ background: "white", border: "1px solid #e2e8f0", boxShadow: "0 10px 20px -10px rgba(0,0,0,0.05)", borderRadius: 20, padding: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          Informazioni Account
        </h2>
        <p style={{ color: "#475569", fontWeight: 500, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
          Attualmente non ci sono integrazioni esterne configurabili necessarie per l'utilizzo della piattaforma. Il tuo QRpop funziona out-of-the-box.
        </p>

        {message && (
          <div style={{ padding: 12, background: message.includes("Errore") ? "rgba(225,29,72,0.1)" : "rgba(34,197,94,0.1)", color: message.includes("Errore") ? "hsl(340 82% 65%)" : "hsl(142 71% 45%)", borderRadius: 8, fontSize: 14, marginBottom: 20 }}>
            {message}
          </div>
        )}

      </div>
    </div>
  );
}
