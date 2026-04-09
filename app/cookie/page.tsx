import Link from "next/link";

export const metadata = {
  title: "Cookie Policy",
};

export default function CookiePage() {
  return (
    <div style={{ minHeight: "100vh", padding: "80px 24px", background: "hsl(240 10% 3.9%)", color: "white" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", background: "hsl(240 6% 8%)", padding: "40px 48px", borderRadius: 24, border: "1px solid hsl(240 5% 15%)" }}>
        <Link href="/" style={{ color: "hsl(262 83% 72%)", textDecoration: "none", fontSize: 14, fontWeight: 600, display: "inline-block", marginBottom: 32 }}>
          ← Torna alla Home
        </Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>Informativa Estesa sui Cookie</h1>
        <div style={{ color: "hsl(240 5% 70%)", lineHeight: 1.8, fontSize: 15, display: "flex", flexDirection: "column", gap: 20 }}>
          <p>
            <strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString("it-IT")}
          </p>
          <p>
            La presente informativa descrive come e perché utilizziamo Cookie e altre tecnologie di tracciamento simili, nel rispetto delle più recenti normative vigenti in materia di privacy e dell&apos;informativa indicata dal Garante per la Privacy in Italia.
          </p>
          <h2>1. Cosa sono i Cookie?</h2>
          <p>
            Un cookie è un piccolo file di testo memorizzato sul tuo computer o dispositivo mobile dai siti web che visiti. 
            I file di testo contengono informazioni che facilitano la tua navigazione (salvando le tue preferenze e permettendo lo stato di accesso continuo senza costringerti al login continuo log-out).
          </p>
          <h2>2. Cookie Utilizzati dal nostro Servizio</h2>
          <p>
            Utilizziamo prettamente Cookie Tecnici e di Sessione o Strettamente Necessari:
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li><strong>Cookie di Sessione (NextAuth):</strong> Memorizzano temporaneamente lo stato del tuo Login. Sono fondamentali e necessari per permetterti di accedere alla tua Dashboard protetta.</li>
              <li><strong>Gestione consenso (qrpop-cookie-consent):</strong> Salva semplicemente la tua preferenza su questo specifico banner cookie in modo da non tornarti a disturbare per ogni pagina che apri sul sito web.</li>
            </ul>
          </p>
          <h2>3. Disabilitazione dei Cookie</h2>
          <p>
            Qualora l&apos;utente non desiderasse ricevere alcun tipo di cookie sul proprio elaboratore può disabilitare tali funzionalità agendo sulle direttive di privacy fornite dal proprio specifico browser (Chrome, Firefox, Safari ecc.). Ricorda che bloccando i Cookie potresti bloccare nativamente le possibilità di accedere in modo corretto all&apos;Area Riservata della tua Dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
