"use client";
import Link from "next/link";

export default function QRCodeRecensioniGoogle() {
  return (
    <>
      <nav style={{ padding: "24px", position: "absolute", top: 0, left: 0, right: 0, zIndex: 100 }}>
         <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
               <img src="/logo-negative.svg" alt="QRpop Logo" style={{ height: 32, filter: "brightness(0)" }} />
            </Link>
            <Link href="/register" className="btn-primary" style={{ padding: "10px 20px" }}>Crea il tuo QR Gratis</Link>
         </div>
      </nav>

      <main style={{ minHeight: "100vh", padding: "160px 24px 80px", textAlign: "center", background: "#f8fafc" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, color: "#0f172a" }}>
            Più <span style={{ color: "#2563eb" }}>Recensioni Google</span> col tuo QR Code Dinamico.
          </h1>
          
          <p style={{ fontSize: 20, color: "#475569", lineHeight: 1.6, marginBottom: 40, fontWeight: 500 }}>
            Ottieni opinioni 5 stelle dai tuoi clienti ancor prima che escano dal locale. Genera un QR Code gratuito, posizionalo al bancone o sui tavoli e rimanda istantaneamente alla tua scheda Google My Business.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 60 }}>
             <Link href="/register?spot=free" className="btn-primary" style={{ padding: "18px 40px", fontSize: 17 }}>Crea QR Gratuito →</Link>
          </div>

          <div style={{ textAlign: "left", background: "white", padding: 40, borderRadius: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
             <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16, color: "#0f172a" }}>Il trucco del QR Dinamico per il Marketing</h2>
             <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: 24 }}>
               I normali generatori di QR creano codici "statici": se un domani vuoi dirottare il traffico da Google a TripAdvisor, o farti recensire su TrustPilot, devi stampare tutti i cartellini da zero.
               <br/><br/>
               Con QRpop ottieni un <strong>QR Code Dinamico a Link Gratuito</strong>. Tu piazzi il codice alla cassa del tuo ufficio o ristorante ed invii il traffico a Google. Se domani lanci una campagna sconti, accedi a QRpop e cambi la destinazione sul momento, in tempo reale, mantenendo esposto lo stesso storico QR Code.
             </p>

             <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16, color: "#0f172a" }}>Personalizzazione del Brand</h2>
             <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: 24 }}>
               Il cliente fida e recensisce solo se il canale è professionale. Inserisci comodamente il tuo logo aziendale in alta qualità proprio al centro del codice. Grazie all'algoritmo di mitigazione errori di QRpop, il logo non inficerà minimamente i tempi di scansione dei cellulari.
             </p>
          </div>

        </div>
      </main>
    </>
  );
}
