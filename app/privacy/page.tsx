import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "80px 24px", background: "hsl(240 10% 3.9%)", color: "white" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", background: "hsl(240 6% 8%)", padding: "40px 48px", borderRadius: 24, border: "1px solid hsl(240 5% 15%)" }}>
        <Link href="/" style={{ color: "hsl(262 83% 72%)", textDecoration: "none", fontSize: 14, fontWeight: 600, display: "inline-block", marginBottom: 32 }}>
          ← Torna alla Home
        </Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>Informativa sulla Privacy (Privacy Policy)</h1>
        <div style={{ color: "hsl(240 5% 70%)", lineHeight: 1.8, fontSize: 15, display: "flex", flexDirection: "column", gap: 20 }}>
          <p>
            <strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString("it-IT")}
          </p>
          <p>
            Rispettiamo la tua privacy e ci impegniamo a proteggere i tuoi dati personali in conformità del GDPR (Regolamento (UE) 2016/679).
          </p>
          <h2>1. Dati Raccolti</h2>
          <p>
            Al momento della registrazione, raccogliamo il tuo nome/nome del locale, la tua email e la tua password in forma criptata in maniera sicura (salt/hash). 
            Durante il completamento del profilo aziendale per il pagamento su Stripe, raccogliamo e trattiamo (tramite provider esterno sicuro) le seguenti informazioni fiscali e anagrafiche:
            indirizzo, Partita IVA, dati della carta di credito (che non transitano né vengono salvati sui nostri server ma solo su Stripe).
          </p>
          <h2>2. Finalità del Trattamento</h2>
          <p>
            Utilizziamo i tuoi dati esclusivamente per:
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li>Consentirti l&apos;accesso e l&apos;utilizzo della dashboard di QRpop.</li>
              <li>Generare la fatturazione e le ricevute associate al tuo piano di abbonamento.</li>
              <li>Mantenere un registro normativo contro abusi della piattaforma, potendo accertare sempre il soggetto titolare di un determinato QR Code.</li>
            </ul>
          </p>
          <h2>3. Terze Parti</h2>
          <p>
            I tuoi dati non vengono venduti o scambiati a fini di lucro o pubblicitari.
            Condividiamo unicamente i tuoi dati fiscali strettamente necessari con Stripe, il nostro elaboratore dei pagamenti certificato, al fine primario dell&apos;erogazione del servizio di pagamento e fatturazione.
          </p>
          <h2>4. I tuoi Diritti</h2>
          <p>
            In conformità al GDPR, hai diritto di accesso, rettifica, cancellazione e portabilità dei dati. Per esercitarli, puoi inviare comunicazione formale all&apos;indirizzo di supporto indicato sul nostro portale o estingueremo direttamente tutto al momento dell&apos;eliminazione dell&apos;account dal tuo pannello.
          </p>
        </div>
      </div>
    </div>
  );
}
