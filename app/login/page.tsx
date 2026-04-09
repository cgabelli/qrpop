"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction } from "./actions";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const errorParam = searchParams.get("error");

  async function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      try {
        const res = await loginAction(formData);
        if (res?.error) {
          setError(res.error);
        } else {
          router.push("/dashboard");
        }
      } catch (e: any) {
         if (e.message.includes('NEXT_REDIRECT')) {
            router.push("/dashboard");
         } else {
            setError("Si è verificato un errore, riprova.");
         }
      }
    });
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "hsl(240 10% 4%)", padding: 20 }}>
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <img src="/logo-negative.svg" alt="QRpop" style={{ height: 36, marginBottom: 16 }} />
        <div style={{ color: "hsl(240 5% 55%)", fontSize: 16 }}>Accedi al pannello di controllo</div>
      </div>

      <div className="card" style={{ width: "100%", maxWidth: 420, padding: "40px 32px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 32, textAlign: "center" }}>Bentornato</h1>

        {(error || errorParam) && (
          <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "hsl(0 84% 60%)", fontSize: 14, marginBottom: 24 }}>
            {error || "Errore durante l'accesso"}
          </div>
        )}

        <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "hsl(240 5% 70%)" }}>Email</label>
            <input type="email" name="email" required className="input" placeholder="tuo@indirizzo.com" style={{ width: "100%" }} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "hsl(240 5% 70%)" }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: 13, color: "hsl(262 83% 70%)", textDecoration: "none" }}>Password dimenticata?</Link>
            </div>
            <input type="password" name="password" required className="input" placeholder="••••••••" style={{ width: "100%" }} />
          </div>

          <button type="submit" disabled={isPending} className="btn-primary" style={{ width: "100%", marginTop: 8 }}>
            {isPending ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: "center", fontSize: 14, color: "hsl(240 5% 55%)" }}>
          Non hai un account? <Link href="/register" style={{ color: "hsl(262 83% 70%)", fontWeight: 600, textDecoration: "none" }}>Registrati</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "hsl(240 10% 4%)" }} />}>
      <LoginForm />
    </Suspense>
  );
}
