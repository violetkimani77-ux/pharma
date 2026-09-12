export default function HomePage() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "64px 24px" }}>
      <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        HeriPHARMAS
      </p>
      <h1 style={{ margin: "0 0 16px", fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.05 }}>
        Pharmacy inventory you can trust.
      </h1>
      <p style={{ maxWidth: 680, fontSize: 18, lineHeight: 1.6 }}>
        Runtime foundation initialized. Inventory, traceability, tenant isolation,
        auditability, and operational workflows will be added behind explicit domain boundaries.
      </p>
    </main>
  );
}
