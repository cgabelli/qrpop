import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const user = await prisma.user.findUnique({ where: { slug, isActive: true } });
  if (!user) return { title: "QRpop" };
  return {
    title: `${user.businessName} | QRpop`,
    description: `Contenuti di ${user.businessName} su QRpop`,
  };
}

export const revalidate = 30; // Revalida ogni 30 secondi

async function getActiveContent(slug: string) {
  const user = await prisma.user.findUnique({
    where: { slug, isActive: true },
  });
  if (!user) return null;

  const now = new Date();

  // Attiva scheduled
  await prisma.creativita.updateMany({
    where: { userId: user.id, status: "scheduled", publishAt: { lte: now } },
    data: { status: "active" },
  });
  // Scade attivi
  await prisma.creativita.updateMany({
    where: { userId: user.id, status: "active", expiresAt: { lt: now } },
    data: { status: "expired" },
  });

  const creativita = await prisma.creativita.findFirst({
    where: { userId: user.id, status: "active" },
    orderBy: { publishAt: "desc" },
  });

  return { user, creativita };
}

export default async function ScanPage({ params }: Props) {
  const { slug } = await params;
  const result = await getActiveContent(slug);

  if (!result) notFound();

  const { user, creativita } = result;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {creativita ? (
        <>
          {creativita.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={creativita.filePath}
              alt={creativita.title ?? user.businessName}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
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
          )}

          {/* Overlay gradient bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "30%",
              background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            }}
          />

          {/* QRpop badge */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <img src="/logo-negative.svg" alt="QRpop" style={{ height: 16, width: "auto" }} />
          </div>
        </>
      ) : (
        /* Fallback: no active content */
        <div
          style={{
            textAlign: "center",
            padding: "40px 24px",
            maxWidth: 380,
          }}
        >
          {/* Animated background */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, rgba(124,58,237,0.2) 0%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
               <img src="/logo-negative.svg" alt="QRpop" style={{ height: 64, width: "auto" }} />
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, color: "white" }}>
              {user.businessName}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
              Al momento non ci sono contenuti attivi. Torna a breve!
            </p>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              Powered by <img src="/logo-negative.svg" alt="QRpop" style={{ height: 14, width: "auto", opacity: 0.6 }} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
