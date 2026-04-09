"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const errorParam = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email o password non corretti");
      setLoading(false);
    } else {
      router.push("/dashboard");
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
      {/* BG glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <img src="/logo-negative.svg" alt="QRpop Logo" style={{ height: 36, width: "auto" }} />
          </Link>
          <p style={{ marginTop: 8, color: "hsl(240 5% 55%)", fontSize: 14 }}>Accedi al pannello di controllo</p>
        </div>

        <div className="card" style={{ padding: 40 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 28, textAlign: "center" }}>
            Bentornato
          </h1>

          {(error || errorParam) && (
            <div style={{
              padding: "12px 16px", borderRadius: 10, marginBottom: 20,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              color: "hsl(0 72% 70%)", fontSize: 14,
            }}>
              {error || "Sessione scaduta. Accedi di nuovo."}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(240 5% 70%)", marginBottom: 8 }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="nome@locale.it"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "hsl(240 5% 70%)" }}>
                  Password
                </label>
                <Link href="/forgot-password" style={{ fontSize: 12, color: "hsl(262 83% 72%)", textDecoration: "none" }}>
                  Password dimenticata?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%", marginTop: 8, padding: "14px", fontSize: 15 }}
            >
              {loading ? "Accesso in corso..." : "Accedi al pannello →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "hsl(240 5% 55%)" }}>
            Non hai un account?{" "}
            <Link href="/register" style={{ color: "hsl(262 83% 72%)", fontWeight: 600, textDecoration: "none" }}>
              Registrati
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
