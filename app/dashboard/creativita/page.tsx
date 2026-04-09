"use client";

import { useState, useEffect, useRef } from "react";

interface Creativita {
  id: string;
  type: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  title: string | null;
  status: string;
  publishAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function CreativitaPage() {
  const [list, setList] = useState<Creativita[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ title: "", publishAt: "", expiresAt: "" });
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => { fetchList(); }, []);

  async function fetchList() {
    setLoading(true);
    const res = await fetch("/api/creativita");
    const data = await res.json();
    setList(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) { setError("Seleziona un file"); return; }
    setUploading(true);
    setError("");
    setSuccess("");

    const fd = new FormData();
    fd.append("file", selectedFile);
    if (form.title) fd.append("title", form.title);
    if (form.publishAt) fd.append("publishAt", form.publishAt);
    if (form.expiresAt) fd.append("expiresAt", form.expiresAt);

    const res = await fetch("/api/creativita", { method: "POST", body: fd });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Errore durante l'upload");
    } else {
      setSuccess("Creatività caricata con successo!");
      setSelectedFile(null);
      setForm({ title: "", publishAt: "", expiresAt: "" });
      if (fileRef.current) fileRef.current.value = "";
      fetchList();
    }
    setUploading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminare questa creatività?")) return;
    await fetch(`/api/creativita/${id}`, { method: "DELETE" });
    setList(list.filter(c => c.id !== id));
  }

  async function handleToggleActive(item: Creativita) {
    const newStatus = item.status === "active" ? "draft" : "active";
    const res = await fetch(`/api/creativita/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setList(list.map(c => c.id === item.id ? { ...c, status: newStatus } : c));
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  }

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Creatività</h1>
        <p style={{ color: "hsl(240 5% 55%)", fontSize: 16 }}>
          Carica immagini e video da mostrare ai clienti quando scansionano il QR
        </p>
      </div>

      {/* Upload form */}
      <div className="card" style={{ padding: 40, marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 28 }}>Carica nuovo contenuto</h2>

        <form onSubmit={handleUpload}>
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? "hsl(262 83% 58%)" : "rgba(255,255,255,0.12)"}`,
              borderRadius: 16,
              padding: "48px 24px",
              textAlign: "center",
              cursor: "pointer",
              background: dragOver ? "rgba(124,58,237,0.06)" : "rgba(255,255,255,0.02)",
              transition: "all 0.2s",
              marginBottom: 24,
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={e => setSelectedFile(e.target.files?.[0] ?? null)}
            />
            {selectedFile ? (
              <div>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{selectedFile.type.startsWith("video") ? "🎬" : "🖼️"}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 4 }}>{selectedFile.name}</div>
                <div style={{ fontSize: 13, color: "hsl(240 5% 55%)" }}>{formatBytes(selectedFile.size)}</div>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setSelectedFile(null); }}
                  style={{ marginTop: 12, background: "rgba(239,68,68,0.15)", border: "none", color: "hsl(0 72% 70%)", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "Inter, sans-serif" }}
                >
                  Rimuovi
                </button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⬆️</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "hsl(240 5% 75%)", marginBottom: 4 }}>
                  Trascina qui o clicca per selezionare
                </div>
                <div style={{ fontSize: 13, color: "hsl(240 5% 45%)" }}>
                  Immagini (JPG, PNG, GIF, WebP) o Video (MP4, MOV, WebM) — Max 50MB
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(240 5% 70%)", marginBottom: 8 }}>
                Titolo (opzionale)
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Es. Offerta del weekend"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(240 5% 70%)", marginBottom: 8 }}>
                Pubblica dal
              </label>
              <input
                type="datetime-local"
                className="input-field"
                value={form.publishAt}
                onChange={e => setForm({ ...form, publishAt: e.target.value })}
                style={{ colorScheme: "dark" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(240 5% 70%)", marginBottom: 8 }}>
                Scade il
              </label>
              <input
                type="datetime-local"
                className="input-field"
                value={form.expiresAt}
                onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>

          {error && (
            <div style={{ padding: "12px 16px", borderRadius: 10, marginBottom: 16, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "hsl(0 72% 70%)", fontSize: 14 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: "12px 16px", borderRadius: 10, marginBottom: 16, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "hsl(142 71% 60%)", fontSize: 14 }}>
              {success}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={uploading || !selectedFile}>
            {uploading ? "Caricamento..." : "Carica creatività →"}
          </button>
        </form>
      </div>

      {/* List */}
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
        Le tue creatività ({list.length})
      </h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "hsl(240 5% 50%)" }}>Caricamento...</div>
      ) : list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16, color: "hsl(240 5% 50%)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗂️</div>
          <div>Nessuna creatività ancora. Carica la prima!</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map(item => (
            <div key={item.id} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              {/* Preview */}
              <div style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.05)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.filePath} alt={item.title ?? item.fileName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 28 }}>🎬</span>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.title ?? item.fileName}
                </div>
                <div style={{ fontSize: 12, color: "hsl(240 5% 50%)", display: "flex", gap: 16 }}>
                  <span>{item.type === "video" ? "🎬 Video" : "🖼️ Immagine"}</span>
                  <span>{formatBytes(item.fileSize)}</span>
                  {item.publishAt && <span>Dal {formatDate(item.publishAt)}</span>}
                  {item.expiresAt && <span>Al {formatDate(item.expiresAt)}</span>}
                </div>
              </div>

              <span className={`badge badge-${item.status}`}>{item.status}</span>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleToggleActive(item)}
                  title={item.status === "active" ? "Disattiva" : "Attiva"}
                  style={{
                    padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
                    background: item.status === "active" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
                    border: "none", color: item.status === "active" ? "hsl(142 71% 60%)" : "hsl(240 5% 65%)",
                    transition: "all 0.2s", fontFamily: "Inter, sans-serif",
                  }}
                >
                  {item.status === "active" ? "✓ Attivo" : "Attiva"}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  title="Elimina"
                  style={{
                    padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
                    background: "rgba(239,68,68,0.1)", border: "none", color: "hsl(0 72% 70%)",
                    transition: "all 0.2s", fontFamily: "Inter, sans-serif",
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
