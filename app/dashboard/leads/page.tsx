export const metadata = { title: "Leads & Contatti" };

export default function LeadsPage() {
  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          I tuoi Contatti 👥
        </h1>
        <p style={{ color: "hsl(240 5% 55%)", fontSize: 16 }}>
          Qui troverai tutte le email e i recapiti lasciati dai tuoi clienti.
        </p>
      </div>

      <div style={{ padding: 60, textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🌱</div>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Nessun contatto ancora.</h3>
        <p style={{ color: "hsl(240 5% 60%)", maxWidth: 400, margin: "0 auto" }}>
          Inizia a configurare i tuoi QR Spot per richiedere l'email in cambio di un'offerta o sconto.
        </p>
      </div>
    </div>
  );
}
