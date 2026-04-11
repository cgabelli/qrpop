import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      qrSpots: true,
      creativita: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
  });

  if (!user) redirect("/login");

  const totalSpots = user.qrSpots.length;
  const activeSpots = user.qrSpots.filter((s) => s.status === "active").length;
  const activeCreativity = user.creativita.find((c) => c.status === "active");
  const totalCreativity = await prisma.creativita.count({ where: { userId: user.id } });

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          Ciao, {user.businessName ?? user.firstName} 👋
        </h1>
        <p style={{ color: "hsl(240 5% 55%)", fontSize: 16 }}>
          Ecco il riepilogo della tua area
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
        {[
          {
            label: "QR Spot Totali",
            value: totalSpots.toString(),
            icon: "📋",
            color: "hsl(262 83% 65%)",
            bg: "rgba(124,58,237,0.1)",
          },
          {
            label: "QR Spot Attivi",
            value: activeSpots.toString(),
            icon: "✅",
            color: activeSpots > 0 ? "hsl(142 71% 55%)" : "hsl(240 5% 55%)",
            bg: activeSpots > 0 ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)",
          },
          {
            label: "Totale creatività",
            value: totalCreativity.toString(),
            icon: "🗂️",
            color: "hsl(38 92% 60%)",
            bg: "rgba(251,191,36,0.08)",
          },
          {
            label: "Ultimo Caricamento",
            value: activeCreativity ? "Recente" : "Nessuno",
            icon: "⬆️",
            color: "hsl(200 70% 60%)",
            bg: "rgba(56,189,248,0.08)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card"
            style={{ padding: 24, background: stat.bg, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16 }}
          >
            <div style={{ fontSize: 28, marginBottom: 12 }}>{stat.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: stat.color, marginBottom: 4, fontFamily: "Space Grotesk, sans-serif" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: "hsl(240 5% 55%)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 40 }}>
        <Link
          href="/dashboard/abbonamento"
          style={{
            textDecoration: "none",
            background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(219,39,119,0.1))",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: 16,
            padding: 28,
            display: "block",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 16 }}>🎯</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 8 }}>Gestisci i tuoi QR</h3>
          <p style={{ color: "hsl(240 5% 70%)", fontSize: 14 }}>Carica foto, link o pdf nei tuoi codici QR</p>
        </Link>
      </div>

      {/* Recenti */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>File Caricati di Recente</h3>
          <Link href="/dashboard/abbonamento" style={{ fontSize: 13, color: "hsl(262 83% 70%)", textDecoration: "none" }}>
            Vedi tutti i QR →
          </Link>
        </div>

        {user.creativita.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>👻</div>
            <div style={{ color: "hsl(240 5% 60%)", marginBottom: 16 }}>Non hai ancora caricato nulla.</div>
            <Link href="/dashboard/abbonamento" className="btn-primary">Vai ai QR Spot</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {user.creativita.map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                    {c.type === "image" ? "🖼️" : c.type === "video" ? "🎥" : "📄"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "white" }}>{c.title || c.fileName}</div>
                    <div style={{ fontSize: 12, color: "hsl(240 5% 50%)" }}>{new Date(c.createdAt).toLocaleDateString("it-IT")}</div>
                  </div>
                </div>
                <div style={{ padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: c.status === "active" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.1)", color: c.status === "active" ? "hsl(142 71% 55%)" : "hsl(240 5% 60%)", textTransform: "uppercase" }}>
                  {c.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
