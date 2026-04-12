import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const qrSpot = await prisma.qRSpot.findUnique({ 
    where: { slug },
    include: { user: true }
  });
  
  if (!qrSpot || qrSpot.status !== "active") return { title: "QRpop" };
  
  return {
    title: `${qrSpot.name} | ${qrSpot.user.businessName}`,
    description: `Contenuti di ${qrSpot.user.businessName} su QRpop`,
  };
}

export const revalidate = 30; // Revalida ogni 30 secondi

async function getActiveSpot(slug: string) {
  const qrSpot = await prisma.qRSpot.findUnique({
    where: { slug },
    include: { user: true }
  });
  
  if (!qrSpot || qrSpot.status !== "active" || !qrSpot.user.isActive) return null;

  const now = new Date();

  // Attiva scheduled
  await prisma.creativita.updateMany({
    where: { qrSpotId: qrSpot.id, status: "scheduled", publishAt: { lte: now } },
    data: { status: "active" },
  });
  // Scade attivi
  await prisma.creativita.updateMany({
    where: { qrSpotId: qrSpot.id, status: "active", expiresAt: { lt: now } },
    data: { status: "expired" },
  });

  const creativita = await prisma.creativita.findFirst({
    where: { qrSpotId: qrSpot.id, status: "active" },
    orderBy: { publishAt: "desc" },
  });

  return { qrSpot, creativita };
}

import WalletForm from "./wallet-form";

export default async function ScanPage({ params }: Props) {
  const { slug } = await params;
  const result = await getActiveSpot(slug);

  if (!result) {
    // Spot non trovato o inattivo
    return (
      <div style={{ minHeight: "100dvh", background: "#000", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>QR Code Non Attivo</h1>
        <p style={{ color: "hsl(240 5% 65%)", maxWidth: 400 }}>Questo contenuto non è attualmente disponibile o il servizio è scaduto.</p>
        <div style={{ marginTop: 40 }}>
           <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px 24px", borderRadius: 30, fontSize: 14, fontWeight: "bold", display: "inline-block" }}>
             Powered by <span style={{ color: "hsl(262 83% 72%)" }}>QRpop</span>
           </div>
        </div>
      </div>
    );
  }

  const { qrSpot, creativita } = result;

  if (qrSpot.type === "free") {
    if (qrSpot.redirectUrl) {
       redirect(qrSpot.redirectUrl);
    } else {
      return (
        <div style={{ minHeight: "100dvh", background: "#000", color: "white", display: "flex", alignContent: "center", justifyContent: "center", padding: 24 }}>
          <p>Nessun link configurato per questo QR.</p>
        </div>
      );
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: qrSpot.type === "wallet" ? (qrSpot as any).walletTemplate?.backgroundColor || "#000" : "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {qrSpot.type === "wallet" ? (
         <WalletForm qrSpotId={qrSpot.id} template={(qrSpot as any).walletTemplate} />
      ) : creativita ? (
        <>
          {creativita.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={creativita.filePath}
              alt={creativita.title ?? qrSpot.name}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : creativita.type === "video" ? (
            <video
              src={creativita.filePath}
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
             <embed src={creativita.filePath} type="application/pdf" width="100%" height="100%" style={{ position: "absolute", inset: 0 }} />
          )}

          {/* Footer "Powered By" */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(10px)",
              padding: "10px 20px",
              borderRadius: 30,
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.1)",
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "linear-gradient(135deg, hsl(262 83% 65%), hsl(262 83% 50%))",
              }}
            />
            <span style={{ color: "white", fontSize: 13, fontWeight: "500", letterSpacing: "-0.02em" }}>
              Powered by <span style={{ fontWeight: "700" }}>QRpop</span>
            </span>
          </div>
        </>
      ) : (
        <div style={{ color: "white", textAlign: "center", padding: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>{qrSpot.name}</h2>
          <p style={{ color: "hsl(240 5% 65%)" }}>Non c'è ancora nessun contenuto attivo in questo momento.</p>
        </div>
      )}
    </div>
  );
}
