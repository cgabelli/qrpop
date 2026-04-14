import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const metadata = { title: "I tuoi Clienti" };

export default async function LeadsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/accedi");

  const leads = await prisma.customerLead.findMany({
    where: { qrSpot: { userId: session.user.id } },
    include: { qrSpot: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: "#0f172a" }}>
          I tuoi Clienti (CRM) 👥
        </h1>
        <p style={{ color: "#475569", fontSize: 16 }}>
          Qui trovi l'elenco dei contatti che hanno scaricato la tua Wallet Card tramite scansione QR.
        </p>
      </div>

      {leads.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", background: "#f8fafc", borderRadius: 16, border: "1px dashed #cbd5e1" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🌱</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Nessun contatto ancora.</h3>
          <p style={{ color: "#64748b", maxWidth: 400, margin: "0 auto", fontWeight: 500 }}>
            Inizia a configurare i tuoi QR Spot come "Wallet Card" per richiedere l'email in cambio della tessera.
          </p>
        </div>
      ) : (
        <div style={{ background: "white", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "16px 20px", fontSize: 13, color: "#475569", fontWeight: 700 }}>Nome Completo</th>
                <th style={{ padding: "16px 20px", fontSize: 13, color: "#475569", fontWeight: 700 }}>Email</th>
                <th style={{ padding: "16px 20px", fontSize: 13, color: "#475569", fontWeight: 700 }}>QR Acquisizione</th>
                <th style={{ padding: "16px 20px", fontSize: 13, color: "#475569", fontWeight: 700 }}>Data</th>
                <th style={{ padding: "16px 20px", fontSize: 13, color: "#475569", fontWeight: 700 }}>Punti</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{lead.firstName} {lead.lastName || ""}</td>
                  <td style={{ padding: "16px 20px", fontSize: 14, color: "#475569" }}>{lead.email}</td>
                  <td style={{ padding: "16px 20px", fontSize: 14 }}>
                    <span style={{ padding: "4px 8px", background: "#f1f5f9", color: "#2563eb", fontWeight: 600, borderRadius: 6, fontSize: 12 }}>
                      {lead.qrSpot.name}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 14, color: "#64748b" }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 800, color: "#2563eb" }}>{lead.points} pt</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
