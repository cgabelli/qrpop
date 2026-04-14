import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/accedi");

  const user = session.user as { id: string; email: string; name?: string; slug?: string; businessName?: string };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          flexShrink: 0,
          background: "#0f172a",
          borderRight: "1px solid #1e293b",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex", alignItems: "center", gap: 10,
            textDecoration: "none", marginBottom: 40, padding: "0 8px",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 900, color: "#ffffff", letterSpacing: -1, marginLeft: 6 }}>QRpop</div>
        </Link>

        {/* Nav links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {[
            { href: "/dashboard", label: "Panoramica", icon: "⬡" },
            { href: "/dashboard/abbonamento", label: "I tuoi QR", icon: "◈" },
            { href: "/dashboard/leads", label: "I tuoi Clienti", icon: "👥" },
            { href: "/dashboard/analytics", label: "Statistiche", icon: "📈" },
            { href: "/dashboard/impostazioni", label: "Impostazioni", icon: "⚙" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 10,
                textDecoration: "none",
                color: "#cbd5e1",
                fontSize: 15, fontWeight: 600,
                transition: "all 0.2s",
              }}
              className="sidebar-link"
            >
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div style={{
          borderTop: "1px solid #1e293b",
          paddingTop: 20,
          marginTop: 20,
        }}>
          <div style={{
            padding: "12px 14px", borderRadius: 10,
            background: "#1e293b",
            marginBottom: 12,
            border: "1px solid #334155",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#ffffff", marginBottom: 2 }}>
              {user.businessName ?? user.name}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{user.email}</div>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                background: "transparent",
                border: "1px solid #334155",
                color: "#cbd5e1",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <span>🚪</span> Esci
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowX: "hidden" }}>
        {children}
      </main>

      <style>{`
        .sidebar-link:hover {
          background: #1e293b !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
