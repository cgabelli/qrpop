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
  const [rememberMe, setRememberMe] = useState(false);
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
      callbackUrl: "/dashboard",
    });

    if (res?.error) {
      setError("Email o password non corretti.");
      setLoading(false);
    } else if (res?.ok) {
      // Force hard navigation so the session cookie is read fresh
      window.location.href = "/dashboard";
    } else {
      setError("Errore durante l'accesso. Riprova.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: 20,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#0f172a", letterSpacing: -1, marginBottom: 16 }}>QRpop</div>
        </Link>
        <div style={{ color: "#475569", fontSize: 16, fontWeight: 500 }}>
          Accedi al pannello di controllo
        </div>
      </div>

      {/* Card */}
      <div
        style={{ width: "100%", maxWidth: 420, padding: "40px 32px", background: "white", border: "1px solid #e2e8f0", borderRadius: 24, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
      >
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            marginBottom: 32,
            textAlign: "center",
            color: "#0f172a",
          }}
        >
          Bentornato
        </h1>

        {/* Error */}
        {(error || errorParam) && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              background: "rgba(220,38,38,0.1)",
              border: "1px solid rgba(220,38,38,0.3)",
              color: "hsl(0 84% 60%)",
              fontSize: 14,
              marginBottom: 24,
            }}
          >
            {error || "Errore durante l'accesso"}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {/* Email */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 8,
                color: "#475569",
              }}
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              className="input"
              placeholder="tuo@indirizzo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          {/* Password */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <label
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                style={{
                  fontSize: 13,
                  color: "#2563eb",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Password dimenticata?
              </Link>
            </div>
            <input
              id="login-password"
              type="password"
              required
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          {/* Remember me */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <div
              onClick={() => setRememberMe(!rememberMe)}
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                border: rememberMe
                  ? "2px solid #2563eb"
                  : "2px solid #cbd5e1",
                background: rememberMe
                  ? "#2563eb"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s",
                cursor: "pointer",
              }}
            >
              {rememberMe && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 14, color: "#475569", fontWeight: 500 }}>
              Ricordami per 30 giorni
            </span>
          </label>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", marginTop: 8 }}
          >
            {loading ? "Accesso in corso..." : "Accedi →"}
          </button>
        </form>

        <div
          style={{
            marginTop: 32,
            textAlign: "center",
            fontSize: 14,
            color: "hsl(240 5% 55%)",
          }}
        >
          Non hai un account?{" "}
          <Link
            href="/register"
            style={{
              color: "#2563eb",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Registrati
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", background: "#f8fafc" }} />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
