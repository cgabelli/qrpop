"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import { QRSpot } from "@prisma/client";

// L'importazione dinamica con ssr: false è TASSATIVA per react-konva e Canvas engine in Next.js
// Altrimenti crasherà durante il build o l'inizializzazione lato server
const CanvasEngine = dynamic(() => import("./canvas-core"), {
  ssr: false,
  loading: () => (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "hsl(240 6% 8%)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(124,58,237,0.3)", borderTopColor: "hsl(262 83% 58%)", animation: "spin 1s linear infinite" }} />
        <div style={{ color: "hsl(240 5% 60%)", fontSize: 14 }}>Caricamento Studio Vettoriale...</div>
      </div>
    </div>
  ),
});

export default function StudioClient({ qrSpot }: { qrSpot: QRSpot }) {
  // L'architettura è: Wrapper Layout che non cambia -> CanvasEngine
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "hsl(240 10% 4%)" }}>
      {/* Topbar Studio */}
      <div style={{ height: 60, flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.08)", background: "hsl(240 6% 6%)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href={`/dashboard/qr/${qrSpot.id}`} style={{ color: "hsl(240 5% 65%)", textDecoration: "none", fontSize: 20 }}>
            ←
          </Link>
          <div style={{ fontSize: 15, fontWeight: 600, color: "white" }}>
            QRpop Studio <span style={{ color: "hsl(240 5% 50%)", fontWeight: 400, marginLeft: 8 }}>/ {qrSpot.name}</span>
          </div>
        </div>
      </div>

      {/* Core Vettoriale Konva */}
      <CanvasEngine qrSpot={qrSpot} />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
