"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface Props {
  url: string;
  slug: string;
  businessName: string;
}

export default function QRCodeClient({ url, slug, businessName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 320,
        margin: 2,
        color: {
          dark: "#ffffff",
          light: "#0a0a0f",
        },
      });
    }
  }, [url]);

  async function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a larger canvas with branding
    const branded = document.createElement("canvas");
    branded.width = 440;
    branded.height = 540;
    const ctx = branded.getContext("2d")!;

    // Background
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, 440, 540);

    // Rounded card bg
    ctx.fillStyle = "#12121a";
    roundRect(ctx, 20, 20, 400, 500, 24);
    ctx.fill();

    // Business name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(businessName, 220, 70);

    // QR code
    ctx.drawImage(canvas, 60, 90, 320, 320);

    // URL text
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "13px system-ui";
    ctx.fillText(url, 220, 440);

    // We need to load the SVG image before we can draw it, so we wrap it in a Promise
    const logoImg = new Image();
    logoImg.src = "/logo-negative.svg";
    await new Promise((resolve) => {
      logoImg.onload = resolve;
    });

    // QRpop branding
    // Draw the image at the bottom center. If height is 24, we scale width proportionally
    const logoHeight = 24;
    const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
    // We already have 'branded', 'ctx', etc.
    // X center is 220. So we draw at 220 - logoWidth / 2
    ctx.globalAlpha = 0.8;
    ctx.drawImage(logoImg, 220 - logoWidth / 2, 484, logoWidth, logoHeight);
    ctx.globalAlpha = 1.0;

    const link = document.createElement("a");
    link.download = `qrpop-${slug}.png`;
    link.href = branded.toDataURL("image/png");
    link.click();
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 48, alignItems: "start" }}>
      {/* QR card */}
      <div
        className="card"
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          background: "hsl(240 6% 8%)",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: "hsl(240 5% 80%)" }}>{businessName}</div>
        <div
          style={{
            padding: 16,
            borderRadius: 16,
            background: "#0a0a0f",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <canvas ref={canvasRef} />
        </div>
        <div style={{ fontSize: 12, color: "hsl(240 5% 45%)", textAlign: "center", maxWidth: 220, lineHeight: 1.5 }}>
          {url}
        </div>
      </div>

      {/* Info and actions */}
      <div>
        <div className="card" style={{ padding: 32, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Il tuo link permanente</h2>

          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 16px", borderRadius: 12,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 16,
          }}>
            <code style={{ flex: 1, fontSize: 14, color: "hsl(262 83% 75%)", wordBreak: "break-all" }}>
              {url}
            </code>
            <button
              onClick={handleCopy}
              style={{
                flexShrink: 0, padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                background: copied ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)",
                color: copied ? "hsl(142 71% 60%)" : "hsl(240 5% 70%)",
                fontSize: 12, fontWeight: 600, transition: "all 0.2s", fontFamily: "Inter, sans-serif",
              }}
            >
              {copied ? "✓ Copiato!" : "Copia"}
            </button>
          </div>

          <p style={{ fontSize: 14, color: "hsl(240 5% 55%)", lineHeight: 1.7 }}>
            Questo link non cambierà mai, anche se cambi i contenuti. Puoi usarlo anche su siti web, social media o biglietti da visita.
          </p>
        </div>

        <div className="card" style={{ padding: 32, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Scarica il QR</h2>
          <p style={{ fontSize: 14, color: "hsl(240 5% 55%)", marginBottom: 20, lineHeight: 1.7 }}>
            Scarica il QR code in alta risoluzione con il nome del tuo locale. Pronto per la stampa.
          </p>
          <button
            onClick={handleDownload}
            className="btn-primary"
            style={{ width: "100%" }}
          >
            ⬇️ Scarica QR code PNG
          </button>
        </div>

        <div className="card" style={{ padding: 32, background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.2)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "hsl(262 83% 72%)" }}>
            💡 Suggerimento
          </h2>
          <p style={{ fontSize: 14, color: "hsl(240 5% 60%)", lineHeight: 1.7 }}>
            Stampa il QR a minimo <strong>5×5 cm</strong> per garantire la leggibilità da tutti i telefoni. Posizionalo su ogni tavolo del locale per il massimo impatto.
          </p>
        </div>
      </div>
    </div>
  );
}
