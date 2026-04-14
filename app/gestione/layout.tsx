import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const ADMIN_EMAIL = "cgabelli@gmail.com";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    redirect("/dashboard");
  }
  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', sans-serif" }}>
      {/* Top bar */}
      <div style={{
        background: "#0f172a",
        padding: "0 32px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #1e293b",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: "white", letterSpacing: -0.5 }}>
            QRpop
          </span>
          <span style={{
            background: "rgba(124,58,237,0.3)",
            color: "#a78bfa",
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 99,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}>Super Admin</span>
        </div>
        <a href="/dashboard" style={{ color: "#94a3b8", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
          ← Torna al tuo account
        </a>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        {children}
      </div>
    </div>
  );
}
