"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore");
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Errore");
    } finally {
      setLoading(false);
    }
  }

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
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <img src="/logo-negative.svg" alt="QRpop Logo" style={{ height: 36, width: "auto" }} />
          </Link>
          <p style={{ marginTop: 8, color: "hsl(240 5% 55%)", fontSize: 14 }}>Recupero accesso</p>
        </div>

        <div className="card" style={{ padding: 40 }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Email inviata!</h1>
              <p style={{ color: "hsl(240 5% 60%)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                Se l&apos;email è registrata nel sistema, riceverai un link per reimpostare la password entro pochi minuti.
                Controlla anche la cartella spam.
              </p>
              <Link href="/login" style={{ color: "hsl(262 83% 72%)", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>
                ← Torna al login
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>
                Password dimenticata?
              </h1>
              <p style={{ color: "hsl(240 5% 60%)", fontSize: 14, textAlign: "center", marginBottom: 28, lineHeight: 1.6 }}>
                Inserisci la tua email e ti invieremo un link per reimpostarla.
              </p>

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
                    Email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    className="input-field"
                    placeholder="nome@locale.it"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <button
                  id="forgot-submit"
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: "100%", marginTop: 8, padding: "14px", fontSize: 15 }}
                >
                  {loading ? "Invio in corso..." : "Invia link di recupero →"}
                </button>
              </form>

              <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "hsl(240 5% 55%)" }}>
                <Link href="/login" style={{ color: "hsl(262 83% 72%)", fontWeight: 600, textDecoration: "none" }}>
                  ← Torna al login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
