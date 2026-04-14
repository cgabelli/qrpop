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

          {/* WhatsApp Support */}
          <a
            href={`https://wa.me/393484106020?text=${encodeURIComponent(`Ciao! Sono ${user.businessName ?? user.name} (${user.email}) e ho bisogno di assistenza con QRpop.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 14px",
              borderRadius: 10,
              background: "rgba(37,211,102,0.12)",
              border: "1px solid rgba(37,211,102,0.25)",
              color: "#25d366",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              marginBottom: 10,
              transition: "all 0.2s",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Assistenza WhatsApp
          </a>

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
