import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getPlan } from "@/lib/plans";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      creativita: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
  });

  if (!user) redirect("/login");

  const plan = getPlan(user.plan);
  const activeCreativity = user.creativita.find((c: any) => c.status === "active");
  const totalCreativity = await prisma.creativita.count({ where: { userId: user.id } });
  const uploadedThisMonth = user.uploadCount;

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          Ciao, {user.businessName} 👋
        </h1>
        <p style={{ color: "hsl(240 5% 55%)", fontSize: 16 }}>
          Ecco il riepilogo della tua area
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
        {[
          {
            label: "Piano attivo",
            value: plan.name,
            icon: "📋",
            color: "hsl(262 83% 65%)",
            bg: "rgba(124,58,237,0.1)",
          },
          {
            label: "Contenuto attivo",
            value: activeCreativity ? "Sì ✓" : "Nessuno",
            icon: "📡",
            color: activeCreativity ? "hsl(142 71% 55%)" : "hsl(240 5% 55%)",
            bg: activeCreativity ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)",
          },
          {
            label: "Totale creatività",
            value: totalCreativity.toString(),
            icon: "🗂️",
            color: "hsl(38 92% 60%)",
            bg: "rgba(251,191,36,0.08)",
          },
          {
            label: "Upload questo mese",
            value: plan.limit === null ? `${uploadedThisMonth} (∞)` : `${uploadedThisMonth} / ${plan.limit}`,
            icon: "⬆️",
            color: "hsl(200 70% 60%)",
            bg: "rgba(56,189,248,0.08)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card"
            style={{ padding: 24, background: stat.bg, border: "1px solid rgba(255,255,255,0.06)" }}
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
          href="/dashboard/creativita"
          style={{
            textDecoration: "none",
            background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(219,39,119,0.1))",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: 16,
            padding: 28,
            transition: "transform 0.2s",
            display: "block",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎨</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8 }}>Gestisci creatività</div>
          <div style={{ fontSize: 14, color: "hsl(240 5% 60%)" }}>
            Carica immagini e video, imposta quando mostrarli
          </div>
        </Link>

        <Link
          href="/dashboard/qrcode"
          style={{
            textDecoration: "none",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 28,
            transition: "transform 0.2s",
            display: "block",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>◈</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8 }}>Il tuo QR code</div>
          <div style={{ fontSize: 14, color: "hsl(240 5% 60%)" }}>
            Scarica il QR statico da stampare e mettere sui tavoli
          </div>
        </Link>
      </div>

      {/* Recent content */}
      {user.creativita.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Creatività recenti</h2>
            <Link href="/dashboard/creativita" style={{ color: "hsl(262 83% 70%)", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
              Vedi tutte →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {user.creativita.map((c: any) => (
              <div key={c.id} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 28 }}>{c.type === "video" ? "🎬" : "🖼️"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.title ?? c.fileName}
                  </div>
                  <div style={{ fontSize: 12, color: "hsl(240 5% 50%)" }}>
                    {new Date(c.createdAt).toLocaleDateString("it-IT")}
                  </div>
                </div>
                <span className={`badge badge-${c.status}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {user.creativita.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "60px 24px",
          border: "1px dashed rgba(255,255,255,0.1)",
          borderRadius: 16,
          color: "hsl(240 5% 50%)",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "hsl(240 5% 70%)" }}>
            Nessuna creatività ancora
          </div>
          <div style={{ fontSize: 15, marginBottom: 24 }}>Carica la tua prima immagine o video</div>
          <Link href="/dashboard/creativita" className="btn-primary" style={{ textDecoration: "none" }}>
            Carica ora →
          </Link>
        </div>
      )}
    </div>
  );
}
