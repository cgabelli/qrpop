export const metadata = { title: "Statistiche & Analytics" };

export default function AnalyticsPage() {
  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          Statistiche 📊
        </h1>
        <p style={{ color: "hsl(240 5% 55%)", fontSize: 16 }}>
          Scopri quante persone inquadrano i tuoi QR e in quali orari.
        </p>
      </div>

      <div style={{ padding: 60, textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📈</div>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Dati in elaborazione...</h3>
        <p style={{ color: "hsl(240 5% 60%)", maxWidth: 400, margin: "0 auto" }}>
          Non appena i tuoi clienti inizieranno a scansionare i QR, vedrai qui i grafici di conversione in tempo reale.
        </p>
      </div>
    </div>
  );
}
