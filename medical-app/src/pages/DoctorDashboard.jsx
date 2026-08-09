import React, { useEffect, useState } from "react";

function DoctorDashboard() {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8001/report"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }

      const data = await response.json();

      setReport(data.report);
    } catch (error) {
      console.error(error);
      setError("Unable to load medical report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>MediRAG</h2>

        <div style={styles.menuItem}>
          🏠 Dashboard
        </div>

        <div style={styles.menuItem}>
          📄 Medical Reports
        </div>

        <div style={styles.menuItem}>
          👤 Patients
        </div>
      </aside>


      {/* Main Content */}
      <main style={styles.main}>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Doctor Dashboard
            </h1>

            <p style={styles.subtitle}>
              Review uploaded medical reports
            </p>
          </div>

          <div style={styles.status}>
            ● System Active
          </div>
        </div>


        {/* Report Card */}
        <div style={styles.card}>

          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                Medical Report
              </h2>

              <p style={styles.cardSubtitle}>
                Uploaded patient document
              </p>
            </div>

            <button
              onClick={fetchReport}
              style={styles.refreshButton}
            >
              ↻ Refresh
            </button>
          </div>


          {/* Report Content */}
          <div style={styles.reportContainer}>

            {loading && (
              <p>Loading medical report...</p>
            )}

            {error && (
              <p style={styles.error}>
                {error}
              </p>
            )}

            {!loading && !error && report && (
              <div style={styles.reportText}>
                {report}
              </div>
            )}

            {!loading && !error && !report && (
              <p>
                No medical report has been uploaded.
              </p>
            )}

          </div>

        </div>


        {/* Information Cards */}
        <div style={styles.cardsRow}>

          <div style={styles.smallCard}>
            <h3>Report Status</h3>
            <p style={styles.greenText}>
              Available
            </p>
          </div>

          <div style={styles.smallCard}>
            <h3>AI Assistant</h3>
            <p style={styles.greenText}>
              Ready
            </p>
          </div>

          <div style={styles.smallCard}>
            <h3>Document Type</h3>
            <p>Medical PDF</p>
          </div>

        </div>

      </main>
    </div>
  );
}


const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
  },

  sidebar: {
    width: "230px",
    background: "#111827",
    color: "white",
    padding: "30px 20px",
  },

  logo: {
    marginBottom: "40px",
  },

  menuItem: {
    padding: "14px 10px",
    marginBottom: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "35px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
  },

  subtitle: {
    color: "#6b7280",
  },

  status: {
    background: "#dcfce7",
    color: "#166534",
    padding: "10px 16px",
    borderRadius: "20px",
    fontSize: "14px",
  },

  card: {
    background: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  cardTitle: {
    margin: 0,
  },

  cardSubtitle: {
    color: "#6b7280",
    marginTop: "5px",
  },

  refreshButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },

  reportContainer: {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "20px",
    minHeight: "250px",
    background: "#fafafa",
  },

  reportText: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.7",
    color: "#374151",
  },

  error: {
    color: "#dc2626",
  },

  cardsRow: {
    display: "flex",
    gap: "20px",
    marginTop: "25px",
  },

  smallCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    flex: 1,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  greenText: {
    color: "#16a34a",
    fontWeight: "bold",
  },
};


export default DoctorDashboard;