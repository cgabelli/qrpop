"use client";
import Link from "next/link";
import { Metadata } from "next";

export default function MenuDigitaleRistoranti() {
  return (
    <>
      <nav style={{ padding: "24px", position: "absolute", top: 0, left: 0, right: 0, zIndex: 100 }}>
         <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
               <img src="/logo-negative.svg" alt="QRpop Logo" style={{ height: 32, filter: "brightness(0)" }} />
            </Link>
            <Link href="/register" className="btn-primary" style={{ padding: "10px 20px" }}>Crea il tuo Menu</Link>
         </div>
      </nav>

      <main style={{ minHeight: "100vh", padding: "160px 24px 80px", textAlign: "center", background: "#f8fafc" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, color: "#0f172a" }}>
            Menu Digitale QR Code <span style={{ color: "#2563eb" }}>Gratis</span>.
          </h1>
          
          <p style={{ fontSize: 20, color: "#475569", lineHeight: 1.6, marginBottom: 40, fontWeight: 500 }}>
            Ottieni il QR Code gratuito per il tuo ristorante. Inserisci il tuo logo al centro, gestisci il menu PDF e aggiornalo quante volte vuoi senza mai più dover ristampare i talloncini sui tavoli.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 60 }}>
             <Link href="/register?spot=pdf" className="btn-primary" style={{ padding: "18px 40px", fontSize: 17 }}>Inizia a creare →</Link>
          </div>

          <div style={{ textAlign: "left", background: "white", padding: 40, borderRadius: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
             <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16, color: "#0f172a" }}>Perché usare un QR Code Dinamico per il menu?</h2>
             <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: 24 }}>
               Il classico QR Code statico ti costringe a rifare tutto da zero ogni qualvolta cambia il link del tuo menu o hai una nuova carta dei vini. Con il <strong>QR Dinamico</strong> di QRpop, tu stampi i talloncini per i tavoli una volta sola.
               Se domani decidi di cambiare l'hosting del tuo PDF, o di sostituirlo con un'immagine, ti basterà accedere alla piattaforma e aggiornare la destinazione. Il codice fisico sul tavolo rimarrà esattamente lo stesso.
             </p>

             <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16, color: "#0f172a" }}>Inserisci il Logo del tuo Ristorante</h2>
             <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: 24 }}>
               Basta QR Code anonimi. Grazie a una tolleranza agli errori di livello professionale (correzione H), puoi inserire il marchio della tua attività direttamente al centro del codice senza perdere liquidità e velocità nell'inquadratura da smartphone.
             </p>
          </div>

        </div>
      </main>
    </>
  );
}
