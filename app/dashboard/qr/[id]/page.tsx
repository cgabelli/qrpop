import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import QRClient from "./qr-client";
import { QR_SPOT_TYPES, QRSpotTypeId } from "@/lib/plans";

export const metadata = { title: "Dettaglio QR Spot" };

export default async function QRSpotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const qrSpot = await prisma.qRSpot.findUnique({ 
    where: { id },
    include: {
       creativita: {
          orderBy: { createdAt: "desc" }
       },
       walletTemplate: true
    }
  });

  if (!qrSpot || qrSpot.userId !== session.user.id) {
    redirect("/dashboard/abbonamento");
  }

  const typeDef = QR_SPOT_TYPES[qrSpot.type as QRSpotTypeId];
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://qrpop.it"}/r/${qrSpot.slug}`;

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1000 }}>
      {/* Header breadcrumb */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/dashboard/abbonamento" style={{ color: "#475569", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          ← Torna agli Spot
        </Link>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}>{qrSpot.name}</h1>
            <div style={{ 
               padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase",
               background: qrSpot.status === "active" ? "rgba(34,197,94,0.15)" : "rgba(225,29,72,0.15)",
               color: qrSpot.status === "active" ? "hsl(142 71% 40%)" : "hsl(340 82% 60%)"
            }}>
               {qrSpot.status}
            </div>
          </div>
          <p style={{ color: "#475569", fontSize: 15, display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
            <span>{typeDef?.emoji || "📱"}</span>
            <span>QR {typeDef?.name || qrSpot.type}</span>
            <span>•</span>
            <a href={publicUrl} target="_blank" style={{ color: "#2563eb", fontWeight: 700 }} rel="noreferrer">
              {publicUrl}
            </a>
          </p>
        </div>
      </div>

      {qrSpot.status !== "active" && (
        <div style={{ padding: "16px 20px", borderRadius: 12, marginBottom: 32, background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.25)", color: "hsl(340 82% 65%)", fontSize: 15, fontWeight: 500 }}>
          ⚠️ Questo QR Spot è disattivato o scaduto. Rinnova l'abbonamento per riattivarlo.
        </div>
      )}

      {/* Interfaccia Operativa basata sul Tipo */}
      <QRClient qrSpot={qrSpot} publicUrl={publicUrl} typeDef={typeDef} />
    </div>
  );
}
