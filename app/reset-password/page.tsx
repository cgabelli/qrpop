"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Le password non coincidono");
      return;
    }
    if (password.length < 8) {
      setError("La password deve essere di almeno 8 caratteri");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore");
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
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
        background: "#f8fafc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#0f172a", letterSpacing: -1 }}>QRpop</div>
          </Link>
          <p style={{ marginTop: 8, color: "#475569", fontWeight: 500, fontSize: 14 }}>Reimposta la tua password</p>
        </div>

        <div style={{ padding: 40, background: "white", border: "1px solid #e2e8f0", borderRadius: 24, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
          {!token ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <p style={{ color: "#475569", fontWeight: 500, fontSize: 14, marginBottom: 24 }}>
                Link non valido. Richiedi un nuovo link di recupero.
              </p>
              <Link href="/forgot-password" style={{ color: "#2563eb", fontWeight: 800, textDecoration: "none" }}>
                Richiedi nuovo link →
              </Link>
            </div>
          ) : done ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>Password aggiornata!</h1>
              <p style={{ color: "#475569", fontWeight: 500, fontSize: 14, lineHeight: 1.7 }}>
                La tua password è stata reimpostata con successo. Verrai reindirizzato al login tra pochi secondi...
              </p>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 8, textAlign: "center" }}>
                Nuova password
              </h1>
              <p style={{ color: "#475569", fontWeight: 500, fontSize: 14, textAlign: "center", marginBottom: 28 }}>
                Scegli una password sicura di almeno 8 caratteri.
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
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 8 }}>
                    Nuova password
                  </label>
                  <input
                    id="reset-password"
                    type="password"
                    className="input-field"
                    placeholder="Minimo 8 caratteri"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 8 }}>
                    Conferma password
                  </label>
                  <input
                    id="reset-password-confirm"
                    type="password"
                    className="input-field"
                    placeholder="Ripeti la password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                  />
                </div>

                <button
                  id="reset-submit"
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: "100%", marginTop: 8, padding: "14px", fontSize: 15 }}
                >
                  {loading ? "Salvataggio..." : "Salva nuova password →"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
