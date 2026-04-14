"use client";
import { useState } from "react";

type Campaign = {
  id: string;
  userId: string;
  type: string;
  fileName: string;
  title?: string | null;
  status: string;
  filePath: string;
  publishAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  user: { businessName: string };
  qrSpot?: { name: string } | null;
};

type QRSpot = {
  id: string;
  name: string;
  status: string;
  type: string;
  stripeSubscriptionId?: string | null;
  expiresAt?: string | null;
};

type User = {
  id: string;
  email: string;
  businessName: string;
  firstName?: string | null;
  lastName?: string | null;
  isCompany: boolean;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  zipCode?: string | null;
  fiscalCode?: string | null;
  vatNumber?: string | null;
  sdiCode?: string | null;
  phone?: string | null;
  isActive: boolean;
  stripeCustomerId?: string | null;
  createdAt: string;
  qrSpots: QRSpot[];
  _count: { qrSpots: number; creativita: number };
};

type Stats = {
  totalUsers: number; activeUsers: number; totalSpots: number;
  activeSpots: number; companiesCount: number; stripeConnected: number;
};

const PLAN_PRICES: Record<string, number> = {
  free: 0, image: 19, video: 29, pdf: 49, unlimited: 99, wallet: 79,
};
const PLAN_LABELS: Record<string, string> = {
  image: "🖼️ Immagine", video: "🎥 Video", pdf: "📄 PDF",
  unlimited: "🌟 Unlimited", free: "🔗 Free", wallet: "🪪 Wallet",
};

function formatDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("it-IT");
}
function toInputDate(d?: string | null) {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}
function getExpiryColor(d?: string | null) {
  if (!d) return "#94a3b8";
  const days = (new Date(d).getTime() - Date.now()) / 86400000;
  if (days < 0) return "#dc2626";
  if (days < 30) return "#d97706";
  return "#16a34a";
}
function userRevenue(spots: QRSpot[]) {
  return spots.filter((s) => s.status === "active").reduce((sum, s) => sum + (PLAN_PRICES[s.type] ?? 0), 0);
}
function nearestExpiry(spots: QRSpot[]) {
  const active = spots.filter((s) => s.status === "active" && s.expiresAt);
  if (!active.length) return null;
  return active.sort((a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime())[0].expiresAt;
}

const INPUT = {
  padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0",
  fontSize: 13, width: "100%", outline: "none", color: "#0f172a",
  background: "white", boxSizing: "border-box" as const,
};

export default function AdminClient({ users: initialUsers, stats, campaigns }: { users: User[]; stats: Stats; campaigns: Campaign[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "campaigns">("users");
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "expiring">("all");
  const [selected, setSelected] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [editSpots, setEditSpots] = useState<Record<string, { status: string; expiresAt: string }>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.email.toLowerCase().includes(q) || u.businessName.toLowerCase().includes(q) ||
      (u.city || "").toLowerCase().includes(q) || (u.vatNumber || "").toLowerCase().includes(q) || (u.fiscalCode || "").toLowerCase().includes(q);
    const expiry = nearestExpiry(u.qrSpots);
    const daysToExpiry = expiry ? (new Date(expiry).getTime() - Date.now()) / 86400000 : Infinity;
    const matchFilter = filter === "all" || (filter === "active" && u.isActive) ||
      (filter === "inactive" && !u.isActive) || (filter === "expiring" && daysToExpiry < 30);
    return matchSearch && matchFilter;
  });

  const openEdit = (user: User) => {
    setEditData({ ...user });
    const spotsMap: Record<string, { status: string; expiresAt: string }> = {};
    user.qrSpots.forEach((s) => { spotsMap[s.id] = { status: s.status, expiresAt: toInputDate(s.expiresAt) }; });
    setEditSpots(spotsMap);
    setEditing(true);
  };

  const saveUser = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      // Salva dati utente
      const res = await fetch(`/api/admin/users/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) { alert("Errore nel salvataggio"); return; }

      // Salva dati spot
      for (const [spotId, spotData] of Object.entries(editSpots)) {
        await fetch(`/api/admin/spots/${spotId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: spotData.status, expiresAt: spotData.expiresAt || null }),
        });
      }

      // Aggiorna stato locale
      const updatedUser: User = {
        ...selected,
        ...editData,
        qrSpots: selected.qrSpots.map((s) => ({
          ...s,
          status: editSpots[s.id]?.status ?? s.status,
          expiresAt: editSpots[s.id]?.expiresAt ? new Date(editSpots[s.id].expiresAt).toISOString() : s.expiresAt,
        })),
      } as User;
      setUsers((prev) => prev.map((u) => (u.id === selected.id ? updatedUser : u)));
      setSelected(updatedUser);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async () => {
    if (!selected) return;
    if (!confirm(`Sei sicuro di voler eliminare DEFINITIVAMENTE l'utente ${selected.businessName} e TUTTI i suoi QR Code? L'operazione è irreversibile.`)) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${selected.id}`, { method: "DELETE" });
      if (!res.ok) { alert("Errore nell'eliminazione"); return; }
      
      setUsers((prev) => prev.filter((u) => u.id !== selected.id));
      setSelected(null);
      setEditing(false);
    } catch (e) {
      alert("Errore di rete");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (user: User) => {
    setLoading(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/toggle`, { method: "POST" });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
        if (selected?.id === user.id) setSelected((s) => s ? { ...s, isActive: !s.isActive } : s);
      }
    } finally { setLoading(null); }
  };

  const totalRevenue = users.reduce((sum, u) => sum + userRevenue(u.qrSpots), 0);
  const statCards = [
    { label: "Utenti Totali", value: users.length, icon: "👥", color: "#7c3aed" },
    { label: "Utenti Attivi", value: users.filter((u) => u.isActive).length, icon: "✅", color: "#16a34a" },
    { label: "Aziende", value: users.filter((u) => u.isCompany).length, icon: "🏢", color: "#0284c7" },
    { label: "Privati", value: users.filter((u) => !u.isCompany).length, icon: "👤", color: "#d97706" },
    { label: "QR Spot Attivi", value: stats.activeSpots, icon: "📋", color: "#7c3aed" },
    { label: "Ricavi Annui", value: `€ ${totalRevenue}`, icon: "💰", color: "#16a34a" },
  ];

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ background: "white", borderRadius: 16, padding: "20px 24px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "Space Grotesk, sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <button onClick={() => setActiveTab("users")} style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: activeTab === "users" ? "#0f172a" : "white", color: activeTab === "users" ? "white" : "#64748b", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>👥 Utenti Registrati</button>
        <button onClick={() => setActiveTab("campaigns")} style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: activeTab === "campaigns" ? "#0f172a" : "white", color: activeTab === "campaigns" ? "white" : "#64748b", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>🚀 Campagne / Creatività</button>
      </div>

      {activeTab === "users" ? (
      <>
      {/* Table */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", flexGrow: 1 }}>Utenti Registrati</h2>
          <input placeholder="Cerca email, nome, P.IVA, CF, città..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, width: 280, outline: "none", color: "#0f172a" }} />
          {(["all", "active", "inactive", "expiring"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "8px 14px", borderRadius: 10, border: filter === f ? "none" : "1px solid #e2e8f0",
              background: filter === f ? "#7c3aed" : "white", color: filter === f ? "white" : "#64748b",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>
              {f === "all" ? "Tutti" : f === "active" ? "✅ Attivi" : f === "inactive" ? "❌ Sospesi" : "⚠️ In scadenza"}
            </button>
          ))}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Cliente", "Tipo", "Email / Contatto", "Dati Fiscali", "Piano", "Importo", "Scadenza", "Stato", ""].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const activeSpots = user.qrSpots.filter((s) => s.status === "active");
                const revenue = userRevenue(user.qrSpots);
                const expiry = nearestExpiry(user.qrSpots);
                return (
                  <tr key={user.id} style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                    onClick={() => { setSelected(user); setEditing(false); }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{user.businessName}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{new Date(user.createdAt).toLocaleDateString("it-IT")}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: user.isCompany ? "rgba(2,132,199,0.1)" : "rgba(217,119,6,0.1)", color: user.isCompany ? "#0284c7" : "#d97706" }}>
                        {user.isCompany ? "🏢 Azienda" : "👤 Privato"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 13, color: "#475569" }}>{user.email}</div>
                      {user.phone && <div style={{ fontSize: 11, color: "#94a3b8" }}>{user.phone}</div>}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 12, color: "#475569", fontFamily: "monospace" }}>{user.isCompany ? (user.vatNumber || "—") : (user.fiscalCode || "—")}</div>
                      {user.isCompany && user.sdiCode && <div style={{ fontSize: 11, color: "#94a3b8" }}>SDI: {user.sdiCode}</div>}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {activeSpots.length > 0 ? activeSpots.map((s) => (
                        <div key={s.id} style={{ fontSize: 12, color: "#475569" }}>{PLAN_LABELS[s.type] ?? s.type}</div>
                      )) : <span style={{ color: "#cbd5e1", fontSize: 12 }}>Nessuno</span>}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: revenue > 0 ? "#16a34a" : "#94a3b8", fontFamily: "Space Grotesk, sans-serif" }}>
                        {revenue > 0 ? `€ ${revenue}` : "—"}
                      </span>
                      {revenue > 0 && <div style={{ fontSize: 10, color: "#94a3b8" }}>/ anno</div>}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: getExpiryColor(expiry) }}>{formatDate(expiry)}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: user.isActive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: user.isActive ? "#16a34a" : "#dc2626", padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>
                        {user.isActive ? "Attivo" : "Sospeso"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }} onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleActive(user)} disabled={loading === user.id}
                        style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid", borderColor: user.isActive ? "#fecaca" : "#bbf7d0", background: user.isActive ? "rgba(239,68,68,0.05)" : "rgba(34,197,94,0.05)", color: user.isActive ? "#dc2626" : "#16a34a", fontSize: 11, fontWeight: 700, cursor: loading === user.id ? "wait" : "pointer" }}>
                        {loading === user.id ? "..." : user.isActive ? "Sospendi" : "Attiva"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>Nessun utente trovato</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      ) : (
      <>
      {/* Campagne */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 12, alignItems: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", flexGrow: 1 }}>Tutte le Creatività ({campaigns.length})</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Creatività", "Azienda / Utente", "QR Spot", "Tipo / Stato", "Inizio", "Fine", ""].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((camp) => (
                <tr key={camp.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{camp.title || camp.fileName || "Senza Titolo"}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{new Date(camp.createdAt).toLocaleDateString("it-IT")}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#0284c7" }}>
                    {camp.user?.businessName || "Sconosciuto"}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569", fontWeight: 500 }}>
                    {camp.qrSpot?.name || "Nessuno (Orfano)"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "rgba(124,58,237,0.1)", color: "#7c3aed" }}>
                      {camp.type.toUpperCase()}
                    </span>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, fontWeight: 600 }}>STATUS: {camp.status}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: camp.publishAt ? "#16a34a" : "#94a3b8", fontWeight: 700 }}>
                    {camp.publishAt ? new Date(camp.publishAt).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" }) : "Nessuno"}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: camp.expiresAt ? "#dc2626" : "#94a3b8", fontWeight: 700 }}>
                    {camp.expiresAt ? new Date(camp.expiresAt).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" }) : "Nessuna"}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                     <a href={camp.filePath} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "white", color: "#0f172a", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>Apri File</a>
                  </td>
                </tr>
              ))}
              {campaigns.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>Nessuna creatività trovata</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* Detail / Edit Modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}
          onClick={() => { setSelected(null); setEditing(false); }}>
          <div style={{ background: "white", borderRadius: 20, padding: 32, maxWidth: 660, width: "100%", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{selected.businessName}</h3>
                  <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: selected.isCompany ? "rgba(2,132,199,0.1)" : "rgba(217,119,6,0.1)", color: selected.isCompany ? "#0284c7" : "#d97706" }}>
                    {selected.isCompany ? "🏢 Azienda" : "👤 Privato"}
                  </span>
                </div>
                <p style={{ color: "#64748b", fontSize: 14 }}>{selected.email}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {!editing ? (
                  <>
                    <button onClick={deleteUser} disabled={saving} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #fee2e2", background: "#fef2f2", color: "#ef4444", fontSize: 13, fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
                      🗑️ Elimina
                    </button>
                    <button onClick={() => openEdit(selected)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#7c3aed", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      ✏️ Modifica
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditing(false)} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "white", color: "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      Annulla
                    </button>
                    <button onClick={saveUser} disabled={saving} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#16a34a", color: "white", fontSize: 13, fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
                      {saving ? "Salvo..." : "💾 Salva"}
                    </button>
                  </>
                )}
                <button onClick={() => { setSelected(null); setEditing(false); }} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16 }}>✕</button>
              </div>
            </div>

            {/* Dati Fatturazione */}
            <Section title="Dati Fatturazione">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {editing ? (
                  <>
                    <Field label="Nome / Ragione Sociale" value={editData.businessName} onChange={(v) => setEditData((d) => ({ ...d, businessName: v }))} />
                    <Field label="Email" value={editData.email} onChange={(v) => setEditData((d) => ({ ...d, email: v }))} />
                    <Field label="Telefono" value={editData.phone} onChange={(v) => setEditData((d) => ({ ...d, phone: v }))} />
                    {editData.isCompany ? (
                      <>
                        <Field label="Partita IVA" value={editData.vatNumber} onChange={(v) => setEditData((d) => ({ ...d, vatNumber: v }))} mono />
                        <Field label="Codice SDI" value={editData.sdiCode} onChange={(v) => setEditData((d) => ({ ...d, sdiCode: v }))} mono />
                      </>
                    ) : (
                      <>
                        <Field label="Nome" value={editData.firstName} onChange={(v) => setEditData((d) => ({ ...d, firstName: v }))} />
                        <Field label="Cognome" value={editData.lastName} onChange={(v) => setEditData((d) => ({ ...d, lastName: v }))} />
                        <Field label="Codice Fiscale" value={editData.fiscalCode} onChange={(v) => setEditData((d) => ({ ...d, fiscalCode: v }))} mono />
                      </>
                    )}
                    <Field label="Indirizzo" value={editData.address} onChange={(v) => setEditData((d) => ({ ...d, address: v }))} />
                    <Field label="Città" value={editData.city} onChange={(v) => setEditData((d) => ({ ...d, city: v }))} />
                    <Field label="Provincia" value={editData.province} onChange={(v) => setEditData((d) => ({ ...d, province: v }))} />
                    <Field label="CAP" value={editData.zipCode} onChange={(v) => setEditData((d) => ({ ...d, zipCode: v }))} />
                  </>
                ) : (
                  <>
                    {selected.isCompany ? (
                      <>
                        <InfoBox label="Ragione Sociale" value={selected.businessName} />
                        <InfoBox label="Partita IVA" value={selected.vatNumber} mono />
                        <InfoBox label="Codice SDI" value={selected.sdiCode} mono />
                      </>
                    ) : (
                      <>
                        <InfoBox label="Nome" value={`${selected.firstName || ""} ${selected.lastName || ""}`.trim()} />
                        <InfoBox label="Codice Fiscale" value={selected.fiscalCode} mono />
                      </>
                    )}
                    <InfoBox label="Indirizzo" value={[selected.address, selected.city, selected.province, selected.zipCode].filter(Boolean).join(", ")} />
                    <InfoBox label="Telefono" value={selected.phone} />
                    <InfoBox label="Email" value={selected.email} />
                    <InfoBox label="Stripe ID" value={selected.stripeCustomerId} mono small />
                  </>
                )}
              </div>
            </Section>

            {/* Abbonamenti */}
            <Section title={`Abbonamenti (${selected.qrSpots.length})`}>
              {selected.qrSpots.length === 0 ? (
                <p style={{ color: "#94a3b8", fontSize: 13 }}>Nessun abbonamento</p>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {selected.qrSpots.map((spot) => {
                    const price = PLAN_PRICES[spot.type] ?? 0;
                    const spotEdit = editSpots[spot.id];
                    return (
                      <div key={spot.id} style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editing ? 12 : 0 }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{spot.name}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>{PLAN_LABELS[spot.type] ?? spot.type} · € {price}/anno</div>
                          </div>
                          {!editing && (
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: getExpiryColor(spot.expiresAt) }}>{formatDate(spot.expiresAt)}</div>
                                <div style={{ fontSize: 10, color: "#94a3b8" }}>scadenza</div>
                              </div>
                              <span style={{ padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: spot.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: spot.status === "active" ? "#16a34a" : "#dc2626" }}>{spot.status}</span>
                            </div>
                          )}
                        </div>
                        {editing && spotEdit && (
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div>
                              <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, display: "block", marginBottom: 4 }}>STATO</label>
                              <select value={spotEdit.status}
                                onChange={(e) => setEditSpots((prev) => ({ ...prev, [spot.id]: { ...prev[spot.id], status: e.target.value } }))}
                                style={{ ...INPUT }}>
                                <option value="active">active</option>
                                <option value="inactive">inactive</option>
                                <option value="expired">expired</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, display: "block", marginBottom: 4 }}>SCADENZA</label>
                              <input type="date" value={spotEdit.expiresAt}
                                onChange={(e) => setEditSpots((prev) => ({ ...prev, [spot.id]: { ...prev[spot.id], expiresAt: e.target.value } }))}
                                style={{ ...INPUT }} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {!editing && (
                    <div style={{ padding: "12px 16px", background: "rgba(124,58,237,0.05)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(124,58,237,0.15)" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed" }}>Totale annuo</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: "#7c3aed", fontFamily: "Space Grotesk, sans-serif" }}>€ {userRevenue(selected.qrSpots)}</span>
                    </div>
                  )}
                </div>
              )}
            </Section>

            {/* Creatività dell'utente */}
            {!editing && (() => {
              const userCampaigns = campaigns.filter(c => c.userId === selected.id);
              return (
              <Section title={`Creatività Caricate (${userCampaigns.length})`}>
                {userCampaigns.length === 0 ? (
                  <p style={{ color: "#94a3b8", fontSize: 13 }}>Nessun file caricato</p>
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {userCampaigns.map((camp) => (
                      <div key={camp.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "#f8fafc", borderRadius: 12, border: "1px solid #f1f5f9" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{camp.title || camp.fileName || "File"}</div>
                          <span style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700 }}>{camp.type.toUpperCase()}</span>
                          <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>{camp.qrSpot?.name || "Orfano"}</span>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                           {camp.publishAt && <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 700 }}>Dal: {new Date(camp.publishAt).toLocaleDateString("it-IT")}</div>}
                           {camp.expiresAt && <div style={{ fontSize: 11, color: "#dc2626", fontWeight: 700 }}>Al: {new Date(camp.expiresAt).toLocaleDateString("it-IT")}</div>}
                           <a href={camp.filePath} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "white", color: "#0f172a", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>Apri File</a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
              );
            })()}

          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>{title}</h4>
      {children}
    </div>
  );
}

function InfoBox({ label, value, mono, small }: { label: string; value?: string | null; mono?: boolean; small?: boolean }) {
  return (
    <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 16px" }}>
      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: small ? 11 : 13, color: value ? "#0f172a" : "#cbd5e1", fontWeight: 600, fontFamily: mono ? "monospace" : "inherit", wordBreak: "break-all" }}>{value || "—"}</div>
    </div>
  );
}

function Field({ label, value, onChange, mono }: { label: string; value?: string | null; onChange: (v: string) => void; mono?: boolean }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 4 }}>{label}</label>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)}
        style={{ ...INPUT, fontFamily: mono ? "monospace" : "inherit" }} />
    </div>
  );
}
