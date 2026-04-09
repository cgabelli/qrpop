import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Termini e Condizioni",
};

export default function TerminiPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "80px 24px", background: "hsl(240 10% 3.9%)", color: "white" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", background: "hsl(240 6% 8%)", padding: "40px 48px", borderRadius: 24, border: "1px solid hsl(240 5% 15%)" }}>
        <Link href="/" style={{ color: "hsl(262 83% 72%)", textDecoration: "none", fontSize: 14, fontWeight: 600, display: "inline-block", marginBottom: 32 }}>
          ← Torna alla Home
        </Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>Termini e Condizioni di Servizio</h1>
        <div style={{ color: "hsl(240 5% 70%)", lineHeight: 1.8, fontSize: 15, display: "flex", flexDirection: "column", gap: 20 }}>
          <p>
            <strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString("it-IT")}
          </p>
          <p>
            Benvenuto su QRpop. I presenti Termini e Condizioni delineano le regole e le normative per l&apos;utilizzo della piattaforma QRpop.it. 
            Registrandoti e utilizzando il nostro servizio, dichiari di aver letto, compreso e accettato i presenti termini nella loro interezza.
          </p>
          <h2>1. Il Servizio</h2>
          <p>
            QRpop fornisce una piattaforma digitale ("SaaS") che permette la creazione e la gestione di pagine vetrina e di reindirizzamento dinamico tramite QR Code.
            L&apos;utente è l&apos;esclusivo responsabile di tutti i contenuti (immagini, video, testi) caricati e resi disponibili tramite i propri QR Code.
          </p>
          <h2>2. Responsabilità dell&apos;Utente</h2>
          <p>
            L&apos;Utente garantisce che i contenuti caricati non violano le leggi vigenti, diritti d&apos;autore di terzi, o normative sulla privacy. 
            In quanto società erogatrice del servizio, ci riserviamo il diritto di sospendere l&apos;account e rimuovere contenuti ritenuti illegali, offensivi o inappropriati a nostro insindacabile giudizio senza obbligo di preavviso né di rimborso.
          </p>
          <h2>3. Fatturazione e Pagamenti</h2>
          <p>
            Tutti i pagamenti e le sottoscrizioni (Piani Annuali o Ricariche) sono gestiti tramite il circuito Stripe. 
            Inserendo i dati fiscali al momento del checkout (Partita IVA, indirizzo), l&apos;Utente richiede formalmente l&apos;emissione della ricevuta/fattura commerciale, che verrà elaborata e prodotta in conformità con la normativa vigente.
            I pagamenti per gli abbonamenti annuali e i pacchetti di ricarica non sono rimborsabili.
          </p>
          <h2>4. Modifiche ai Termini</h2>
          <p>
            Ci riserviamo il diritto di modificare questi termini in qualsiasi momento, dandone comunicazione via email agli iscritti.
          </p>
        </div>
      </div>
    </div>
  );
}
