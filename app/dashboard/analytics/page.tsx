export const metadata = { title: "Statistiche & Analytics" };

export default function AnalyticsPage() {
  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: "#0f172a" }}>
          Statistiche 📊
        </h1>
        <p style={{ color: "#475569", fontSize: 16 }}>
          Scopri quante persone inquadrano i tuoi QR e in quali orari.
        </p>
      </div>

      <div style={{ padding: 60, textAlign: "center", background: "#f8fafc", borderRadius: 16, border: "1px dashed #cbd5e1" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📈</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Dati in elaborazione...</h3>
        <p style={{ color: "#64748b", maxWidth: 400, margin: "0 auto", fontWeight: 500 }}>
          Non appena i tuoi clienti inizieranno a scansionare i QR, vedrai qui i grafici di conversione in tempo reale.
        </p>
      </div>
    </div>
  );
}
