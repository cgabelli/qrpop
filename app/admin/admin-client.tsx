"use client";
import { useState } from "react";

type User = {
  id: string;
  email: string;
  businessName: string;
  firstName?: string | null;
  lastName?: string | null;
  isCompany: boolean;
  city?: string | null;
  province?: string | null;
  vatNumber?: string | null;
  fiscalCode?: string | null;
  phone?: string | null;
  isActive: boolean;
  stripeCustomerId?: string | null;
  createdAt: string;
  qrSpots: Array<{ id: string; status: string; type: string; name: string; stripeSubscriptionId?: string | null }>;
  _count: { qrSpots: number; creativita: number };
};

type Stats = {
  totalUsers: number;
  activeUsers: number;
  totalSpots: number;
  activeSpots: number;
  companiesCount: number;
  stripeConnected: number;
};

const PLAN_LABELS: Record<string, string> = {
  image: "📷 Foto",
  video: "🎥 Video",
  pdf: "📄 PDF",
  unlimited: "🚀 Unlimited",
  free: "🆓 Free",
};

export default function AdminClient({ users, stats }: { users: User[]; stats: Stats }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "stripe">("all");
  const [selected, setSelected] = useState<User | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.email.toLowerCase().includes(q) ||
      u.businessName.toLowerCase().includes(q) ||
      (u.city || "").toLowerCase().includes(q);
    const matchFilter =
      filter === "all" ||
      (filter === "active" && u.isActive) ||
      (filter === "inactive" && !u.isActive) ||
      (filter === "stripe" && !!u.stripeCustomerId);
    return matchSearch && matchFilter;
  });

  const toggleActive = async (user: User) => {
    setLoading(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/toggle`, { method: "POST" });
      if (res.ok) window.location.reload();
    } finally {
      setLoading(null);
    }
  };

  const statCards = [
    { label: "Utenti Totali", value: stats.totalUsers, icon: "👥", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
    { label: "Utenti Attivi", value: stats.activeUsers, icon: "✅", color: "#16a34a", bg: "rgba(22,163,74,0.08)" },
    { label: "QR Spot Totali", value: stats.totalSpots, icon: "📋", color: "#0284c7", bg: "rgba(2,132,199,0.08)" },
    { label: "QR Spot Attivi", value: stats.activeSpots, icon: "🔴", color: "#dc2626", bg: "rgba(220,38,38,0.08)" },
    { label: "Aziende", value: stats.companiesCount, icon: "🏢", color: "#d97706", bg: "rgba(217,119,6,0.08)" },
    { label: "Con Stripe", value: stats.stripeConnected, icon: "💳", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
  ];

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{
            background: "white",
            borderRadius: 16,
            padding: "20px 24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "Space Grotesk, sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        background: "white",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", flexGrow: 1 }}>
            Utenti Registrati
          </h2>
          <input
            placeholder="Cerca per email, nome, città..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              fontSize: 13,
              width: 260,
              outline: "none",
              color: "#0f172a",
            }}
          />
          {(["all", "active", "inactive", "stripe"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: filter === f ? "none" : "1px solid #e2e8f0",
                background: filter === f ? "#7c3aed" : "white",
                color: filter === f ? "white" : "#64748b",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {f === "all" ? "Tutti" : f === "active" ? "✅ Attivi" : f === "inactive" ? "❌ Inattivi" : "💳 Stripe"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Nome / Azienda", "Email", "Città", "QR Spot", "Piano attivo", "Stripe", "Registrato", "Stato", ""].map((h) => (
                  <th key={h} style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #f1f5f9",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const activeSpot = user.qrSpots.find((s) => s.status === "active");
                return (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: "1px solid #f8fafc",
                      transition: "background 0.15s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                    onClick={() => setSelected(user)}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{user.businessName}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{user.isCompany ? "🏢 Azienda" : "👤 Privato"}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>{user.email}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>{user.city || "—"}{user.province ? `, ${user.province}` : ""}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        background: user._count.qrSpots > 0 ? "rgba(124,58,237,0.1)" : "#f1f5f9",
                        color: user._count.qrSpots > 0 ? "#7c3aed" : "#94a3b8",
                        padding: "3px 10px",
                        borderRadius: 99,
                        fontSize: 12,
                        fontWeight: 700,
                      }}>{user._count.qrSpots}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13 }}>
                      {activeSpot ? (PLAN_LABELS[activeSpot.type] ?? activeSpot.type) : <span style={{ color: "#cbd5e1" }}>Nessuno</span>}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {user.stripeCustomerId ? (
                        <span style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>✓ Connesso</span>
                      ) : (
                        <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8" }}>
                      {new Date(user.createdAt).toLocaleDateString("it-IT")}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        background: user.isActive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        color: user.isActive ? "#16a34a" : "#dc2626",
                        padding: "4px 10px",
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 700,
                      }}>{user.isActive ? "Attivo" : "Sospeso"}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleActive(user)}
                        disabled={loading === user.id}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 8,
                          border: "1px solid",
                          borderColor: user.isActive ? "#fecaca" : "#bbf7d0",
                          background: user.isActive ? "rgba(239,68,68,0.05)" : "rgba(34,197,94,0.05)",
                          color: user.isActive ? "#dc2626" : "#16a34a",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: loading === user.id ? "wait" : "pointer",
                        }}
                      >
                        {loading === user.id ? "..." : user.isActive ? "Sospendi" : "Attiva"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                    Nessun utente trovato
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ background: "white", borderRadius: 20, padding: 32, maxWidth: 560, width: "100%", maxHeight: "80vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{selected.businessName}</h3>
                <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Tipo", value: selected.isCompany ? "Azienda" : "Privato" },
                { label: "Città", value: `${selected.city || "—"} ${selected.province || ""}` },
                { label: "Telefono", value: selected.phone || "—" },
                { label: "P.IVA / CF", value: selected.vatNumber || selected.fiscalCode || "—" },
                { label: "Stripe ID", value: selected.stripeCustomerId || "Non collegato" },
                { label: "Iscritto il", value: new Date(selected.createdAt).toLocaleDateString("it-IT") },
              ].map((item) => (
                <div key={item.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 16px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 600, wordBreak: "break-all" }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>QR Spot ({selected.qrSpots.length})</h4>
              {selected.qrSpots.length === 0 ? (
                <p style={{ color: "#94a3b8", fontSize: 13 }}>Nessun QR spot</p>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {selected.qrSpots.map((spot) => (
                    <div key={spot.id} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 14px", background: "#f8fafc", borderRadius: 10,
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{spot.name}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{PLAN_LABELS[spot.type] ?? spot.type}</div>
                      </div>
                      <span style={{
                        padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                        background: spot.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        color: spot.status === "active" ? "#16a34a" : "#dc2626",
                      }}>{spot.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
