"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import Link from "next/link";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function QRClient({ qrSpot, publicUrl, typeDef }: any) {
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Stili Form e Generici
  const [updatingName, setUpdatingName] = useState(false);
  const [nameVal, setNameVal] = useState(qrSpot.name);
  
  // Free Type
  const [redirectUrl, setRedirectUrl] = useState(qrSpot.redirectUrl || "");
  const [savingUrl, setSavingUrl] = useState(false);

  // Upload (Altri)
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Logo
  const logoRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (canvasRef.current && publicUrl) {
      QRCode.toCanvas(canvasRef.current, publicUrl, {
        width: 200,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: "H",
      }, (err) => {
        if (err) {
           console.error("Errore generazione QR", err);
           return;
        }

        if (qrSpot.customLogoPath && canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (!ctx) return;
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
             // Il logo è garantito essere quadrato (150x150) dall'API
             // Dipingiamo il quadrato nel centro del canvas di 200px.
             // Copriamo circa il 25% dell'area centrale (es. 50x50 su 200x200).
             const logoSize = 56; // 28% della larghezza
             const center = 100; // metà di 200
             
             // Disegniamo sfondo bianco per mascherare il codice dietro al logo se ha trasparenze
             ctx.fillStyle = "white";
             ctx.fillRect(center - logoSize/2, center - logoSize/2, logoSize, logoSize);
             
             ctx.drawImage(img, center - logoSize/2, center - logoSize/2, logoSize, logoSize);
          };
          img.src = qrSpot.customLogoPath;
        }
      });
    }
  }, [publicUrl, qrSpot.customLogoPath]);

  async function downloadQR() {
    if (!canvasRef.current) return;
    setDownloading(true);
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `QR_${qrSpot.slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloading(false);
  }

  async function handleUpdateField(field: string, val: string) {
    if (field === "name" && val === qrSpot.name) return;
    if (field === "redirectUrl" && val === qrSpot.redirectUrl) return;

    if (field === "name") setUpdatingName(true);
    if (field === "redirectUrl") setSavingUrl(true);
    setError("");

    try {
      const res = await fetch(`/api/qrspot/${qrSpot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: val })
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
    } catch {
      setError("Errore di rete");
    }

    if (field === "name") setUpdatingName(false);
    if (field === "redirectUrl") setSavingUrl(false);
  }

  async function handleUpload(e: React.FormEvent | React.DragEvent, droppedFile?: File) {
    if (e.type !== "drop") e.preventDefault();
    const targetFile = droppedFile || (fileRef.current?.files ? fileRef.current.files[0] : null);
    if (!targetFile) return;

    setUploading(true);
    setError("");

    const fd = new FormData();
    fd.append("file", targetFile);
    fd.append("qrSpotId", qrSpot.id);

    try {
      const res = await fetch("/api/creativita", { method: "POST", body: fd });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error || "Errore upload");
      }
    } catch {
      setError("Errore di rete");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setError("");

    const fd = new FormData();
    fd.append("logo", file);

    try {
      const res = await fetch(`/api/qrspot/${qrSpot.id}/logo`, { method: "POST", body: fd });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error || "Errore upload logo");
      }
    } catch {
      setError("Errore di rete");
    }
    setUploadingLogo(false);
    if (logoRef.current) logoRef.current.value = "";
  }

  async function handleRemoveLogo() {
    if (!confirm("Sei sicuro di voler rimuovere il logo?")) return;
    setUploadingLogo(true);
    try {
      const res = await fetch(`/api/qrspot/${qrSpot.id}/logo`, { method: "DELETE" });
      if (res.ok) {
        window.location.reload();
      } else {
         setError("Errore durante la rimozione del logo");
      }
    } catch {
      setError("Errore di rete");
    }
    setUploadingLogo(false);
  }

  async function handleDeleteFile(id: string) {
    if (!confirm("Sei sicuro di voler eliminare questo file? Il QR diventerà vuoto.")) return;
    await fetch(`/api/creativita/${id}`, { method: "DELETE" });
    window.location.reload();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(e, file);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 32 }}>
      {/* Colonna SX: Configurazione QR */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* QR Code Anteprima */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <canvas ref={canvasRef} style={{ borderRadius: 12, marginBottom: 20 }}></canvas>
          <button onClick={downloadQR} disabled={downloading} className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
            {downloading ? "Download..." : "⬇ Scarica .PNG"}
          </button>
        </div>

        {/* Impostazioni Base */}
        <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Impostazioni QR</h3>
          <div style={{ marginBottom: 16 }}>
             <label style={{ display: "block", fontSize: 13, color: "hsl(240 5% 65%)", marginBottom: 6 }}>Nome Identificativo</label>
             <div style={{ display: "flex", gap: 8 }}>
                <input 
                  className="input-field" 
                  value={nameVal} 
                  onChange={(e) => setNameVal(e.target.value)} 
                  placeholder="Es. QR Tavolo 5" 
                />
                <button onClick={() => handleUpdateField("name", nameVal)} disabled={updatingName || nameVal === qrSpot.name} className="btn-secondary">
                  Salva
                </button>
             </div>
          </div>
        </div>

        {/* Add-on Logo */}
        <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Stile e Logo</h3>
          <p style={{ fontSize: 13, color: "hsl(240 5% 65%)", marginBottom: 16 }}>
            Seleziona un'immagine PNG o JPG da inserire comodamente al centro del design del QR Code.
          </p>
          <input type="file" ref={logoRef} accept="image/png, image/jpeg" style={{ display: "none" }} onChange={handleLogoUpload} />
          
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button 
              onClick={() => logoRef.current?.click()} 
              disabled={uploadingLogo} 
              className="btn-primary" 
              style={{ width: "100%", justifyContent: "center" }}
            >
              {uploadingLogo ? "Caricamento in corso..." : (qrSpot.customLogoPath ? "Sostituisci Logo" : "Carica Logo")}
            </button>
            
            {qrSpot.customLogoPath && (
               <button 
                 onClick={handleRemoveLogo} 
                 disabled={uploadingLogo} 
                 className="btn-secondary" 
                 style={{ width: "100%", justifyContent: "center", color: "hsl(340 82% 65%)" }}
               >
                 Rimuovi Logo
               </button>
            )}
          </div>
        </div>
      </div>

      {/* Colonna DX: Gestione Contenuto */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Contenuto Collegato</h2>
        
        {error && <div style={{ padding: 12, background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.25)", color: "hsl(340 82% 65%)", borderRadius: 8, fontSize: 14, marginBottom: 24 }}>{error}</div>}

        {qrSpot.type === "free" ? (
           <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24 }}>
              <p style={{ color: "hsl(240 5% 65%)", fontSize: 14, marginBottom: 20 }}>Questo è un QR Code di tipo Free (Redirect). Inserisci il link a cui desideri che le persone vengano portate quando inquadrano il QR Code.</p>
              <label style={{ display: "block", fontSize: 13, color: "hsl(240 5% 65%)", marginBottom: 6 }}>URL Esterno (es: https://www.tuosito.it)</label>
              <div style={{ display: "flex", gap: 8, maxWidth: 500 }}>
                <input 
                  className="input-field" 
                  type="url"
                  value={redirectUrl} 
                  onChange={(e) => setRedirectUrl(e.target.value)} 
                  placeholder="https://" 
                />
                <button onClick={() => handleUpdateField("redirectUrl", redirectUrl)} disabled={savingUrl || redirectUrl === qrSpot.redirectUrl} className="btn-primary">
                  {savingUrl ? "..." : "Applica"}
                </button>
              </div>
           </div>
        ) : (
           <>
              {qrSpot.type === "image" && (
                <div style={{ marginBottom: 24, padding: "20px", background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(219,39,119,0.1))", borderRadius: 20, border: "1px solid rgba(124,58,237,0.3)" }}>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                           QRpop Studio <span style={{ padding: "2px 6px", background: "hsl(262 83% 58%)", borderRadius: 4, fontSize: 10, fontWeight: 800 }}>BETA</span>
                        </h3>
                        <p style={{ color: "hsl(240 5% 70%)", fontSize: 13 }}>Non hai la grafica pronta? Creane una fantastica direttamente qui.</p>
                      </div>
                      <Link href={`/dashboard/qr/${qrSpot.id}/studio`} className="btn-primary" style={{ padding: "10px 16px", fontSize: 13, textDecoration: "none" }}>
                         Apri Studio 🪄
                      </Link>
                   </div>
                </div>
              )}

              <div 
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragOver ? "hsl(262 83% 72%)" : "rgba(255,255,255,0.15)"}`,
                  background: dragOver ? "rgba(262, 83%, 72%, 0.05)" : "transparent",
                  borderRadius: 20, padding: "40px 20px", textAlign: "center", marginBottom: 32,
                  transition: "all 0.2s"
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>📤</div>
                <p style={{ color: "hsl(240 5% 65%)", fontSize: 15, marginBottom: 16 }}>
                  Trascina qui il tuo file {qrSpot.type.toUpperCase()} oppure usa il bottone.
                </p>
                <input type="file" ref={fileRef} style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) handleUpload(e as any); }} />
                <button onClick={() => fileRef.current?.click()} className="btn-primary" disabled={uploading}>
                  {uploading ? "Caricamento in corso..." : "Scegli File Dal Dispositivo"}
                </button>
              </div>

              {/* Lista Creatività Caricate */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {qrSpot.creativita?.map((file: any) => (
                  <div key={file.id} style={{
                    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px 20px",
                    display: "flex", alignItems: "center", justifyContent: "space-between"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                       <div style={{ fontSize: 24 }}>{file.type === "image" ? "🖼️" : file.type === "video" ? "🎥" : "📄"}</div>
                       <div>
                         <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 2 }}>{file.fileName || file.title || "File"}</div>
                         <div style={{ fontSize: 13, color: "hsl(240 5% 55%)" }}>{formatBytes(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString()}</div>
                       </div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <a href={file.filePath} target="_blank" className="btn-secondary" style={{ padding: "8px 12px", fontSize: 13 }}>Apri File</a>
                      <button onClick={() => handleDeleteFile(file.id)} className="btn-secondary" style={{ padding: "8px 12px", fontSize: 13, color: "hsl(340 82% 65%)" }}>Rimuovi</button>
                    </div>
                  </div>
                ))}
                {(!qrSpot.creativita || qrSpot.creativita.length === 0) && (
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, fontStyle: "italic", padding: 20 }}>
                    Nessun {qrSpot.type} associato a questo QR. Inquadrandolo, non mostrerà nulla!
                  </div>
                )}
              </div>
           </>
        )}
      </div>
    </div>
  );
}
