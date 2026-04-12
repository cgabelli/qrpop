import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const metadata = { title: "I tuoi Clienti" };

export default async function LeadsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const leads = await prisma.customerLead.findMany({
    where: { qrSpot: { userId: session.user.id } },
    include: { qrSpot: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          I tuoi Clienti (CRM) 👥
        </h1>
        <p style={{ color: "hsl(240 5% 55%)", fontSize: 16 }}>
          Qui trovi l'elenco dei contatti che hanno scaricato la tua Wallet Card tramite scansione QR.
        </p>
      </div>

      {leads.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🌱</div>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Nessun contatto ancora.</h3>
          <p style={{ color: "hsl(240 5% 60%)", maxWidth: 400, margin: "0 auto" }}>
            Inizia a configurare i tuoi QR Spot come "Wallet Card" per richiedere l'email in cambio della tessera.
          </p>
        </div>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <th style={{ padding: "16px 20px", fontSize: 13, color: "hsl(240 5% 60%)", fontWeight: 600 }}>Nome Completo</th>
                <th style={{ padding: "16px 20px", fontSize: 13, color: "hsl(240 5% 60%)", fontWeight: 600 }}>Email</th>
                <th style={{ padding: "16px 20px", fontSize: 13, color: "hsl(240 5% 60%)", fontWeight: 600 }}>QR Acquisizione</th>
                <th style={{ padding: "16px 20px", fontSize: 13, color: "hsl(240 5% 60%)", fontWeight: 600 }}>Data</th>
                <th style={{ padding: "16px 20px", fontSize: 13, color: "hsl(240 5% 60%)", fontWeight: 600 }}>Punti</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 500 }}>{lead.firstName} {lead.lastName || ""}</td>
                  <td style={{ padding: "16px 20px", fontSize: 14, color: "hsl(240 5% 70%)" }}>{lead.email}</td>
                  <td style={{ padding: "16px 20px", fontSize: 14 }}>
                    <span style={{ padding: "4px 8px", background: "rgba(124,58,237,0.15)", color: "hsl(262 83% 75%)", borderRadius: 6, fontSize: 12 }}>
                      {lead.qrSpot.name}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 14, color: "hsl(240 5% 60%)" }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 700, color: "hsl(38 92% 60%)" }}>{lead.points} pt</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
