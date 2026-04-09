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
  if (!session?.user) redirect("/login");

  const user = session.user as { id: string; email: string; name?: string; slug?: string; plan?: string; businessName?: string };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "hsl(240 10% 3.9%)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          flexShrink: 0,
          background: "hsl(240 6% 6%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
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
          <img src="/logo-negative.svg" alt="QRpop Logo" style={{ height: 28, width: "auto", marginLeft: -8 }} />
        </Link>

        {/* Nav links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {[
            { href: "/dashboard", label: "Panoramica", icon: "⬡" },
            { href: "/dashboard/creativita", label: "Creatività", icon: "🎨" },
            { href: "/dashboard/qrcode", label: "Il mio QR", icon: "◈" },
            { href: "/dashboard/abbonamento", label: "Abbonamento", icon: "💳" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 10,
                textDecoration: "none",
                color: "hsl(240 5% 65%)",
                fontSize: 14, fontWeight: 500,
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
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: 20,
          marginTop: 20,
        }}>
          <div style={{
            padding: "12px 14px", borderRadius: 10,
            background: "rgba(255,255,255,0.03)",
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 2 }}>
              {user.businessName ?? user.name}
            </div>
            <div style={{ fontSize: 12, color: "hsl(240 5% 50%)" }}>{user.email}</div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              marginTop: 8, padding: "3px 8px", borderRadius: 6,
              background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
              fontSize: 11, fontWeight: 700, color: "hsl(262 83% 72%)",
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              {user.plan?.replace("_", " ")}
            </div>
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
                border: "1px solid rgba(255,255,255,0.08)",
                color: "hsl(240 5% 55%)",
                fontSize: 13,
                fontWeight: 500,
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
          background: rgba(255,255,255,0.05) !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
}
