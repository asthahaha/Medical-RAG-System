import React, { useEffect, useState } from "react";

function PatientDashboard() {
  const BACKEND_URL = "http://localhost:8080";

  const patientId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const patientName = localStorage.getItem("name");

  const [symptoms, setSymptoms] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =====================================================
  // CHECK AUTHENTICATION
  // =====================================================

  useEffect(() => {
    if (!token || !patientId) {
      window.location.href = "/";
      return;
    }

    fetchReports();
  }, []);

  // =====================================================
  // FETCH PATIENT REPORTS
  // =====================================================

  const fetchReports = async () => {
    try {
      setLoadingReports(true);
      setError("");

      if (!token || !patientId) {
        throw new Error("You are not logged in.");
      }

      // IMPORTANT:
      // Backend now identifies the patient from JWT.
      // We no longer send patientId in the URL.
      const response = await fetch(
        `${BACKEND_URL}/api/patient/reports`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        data = {
          message: text,
        };
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to fetch reports"
        );
      }

      setReports(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {
      console.error(
        "Reports error:",
        err
      );

      setError(
        err.message ||
          "Unable to load your medical reports."
      );

    } finally {
      setLoadingReports(false);
    }
  };

  // =====================================================
  // SUBMIT SYMPTOMS
  // =====================================================

  const submitSymptoms = async () => {
    const currentSymptoms =
      symptoms.trim();

    if (!currentSymptoms) {
      setError(
        "Please describe your symptoms."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      if (!token || !patientId) {
        throw new Error(
          "You are not logged in."
        );
      }

      // Backend gets patient identity from JWT.
      const url =
        `${BACKEND_URL}/api/patient/reports/create` +
        `?symptoms=${encodeURIComponent(
          currentSymptoms
        )}`;

      const response = await fetch(
        url,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        data = await response.json();
      } else {
        const text =
          await response.text();

        data = {
          message: text,
        };
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to create medical report"
        );
      }

      setSuccessMessage(
        "Your symptoms have been analyzed successfully."
      );

      setSymptoms("");

      // Refresh reports after successful creation
      await fetchReports();

    } catch (err) {
      console.error(
        "Symptom submission error:",
        err
      );

      setError(
        err.message ||
          "Unable to analyze your symptoms."
      );

    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      submitSymptoms();
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    window.location.href = "/";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingReports) {
    return (
      <div style={styles.loadingPage}>
        <h2>
          Loading Patient Dashboard...
        </h2>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}

      <aside style={styles.sidebar}>

        <h2 style={styles.logo}>
          MediRAG
        </h2>

        <div style={styles.patientInfo}>

          <div style={styles.patientAvatar}>
            👤
          </div>

          <div>

            <strong>
              {patientName || "Patient"}
            </strong>

            <p style={styles.patientRole}>
              Patient
            </p>

          </div>

        </div>

        <div style={styles.activeMenu}>
          🏠 Dashboard
        </div>

        <div style={styles.menuItem}>
          🩺 My Symptoms
        </div>

        <div style={styles.menuItem}>
          📋 My Reports
        </div>

        <button
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}

      <main style={styles.main}>

        {/* HEADER */}

        <div style={styles.header}>

          <div>

            <h1 style={styles.title}>
              Patient Dashboard
            </h1>

            <p style={styles.subtitle}>
              Describe your symptoms and review
              your medical reports.
            </p>

          </div>

          <div style={styles.status}>
            ● Medical RAG Ready
          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {successMessage && (
          <div style={styles.successMessage}>
            {successMessage}
          </div>
        )}

        {/* SYMPTOM INPUT */}

        <div style={styles.card}>

          <h2 style={styles.cardTitle}>
            Describe Your Symptoms
          </h2>

          <p style={styles.description}>
            Tell us what symptoms you are
            experiencing. The Medical RAG system
            will retrieve relevant information from
            the doctor's uploaded medical knowledge
            base.
          </p>

          <textarea
            value={symptoms}
            onChange={(e) =>
              setSymptoms(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Example: I have fever, headache and body pain..."
            rows={6}
            style={styles.symptomTextarea}
          />

          <button
            onClick={submitSymptoms}
            disabled={submitting}
            style={{
              ...styles.primaryButton,
              opacity: submitting
                ? 0.6
                : 1,
              cursor: submitting
                ? "not-allowed"
                : "pointer",
            }}
          >
            {submitting
              ? "Analyzing..."
              : "Analyze Symptoms"}
          </button>

          <p style={styles.disclaimer}>
            This AI analysis provides possible
            medical information and is not a
            definitive diagnosis. A qualified doctor
            should make the final clinical assessment.
          </p>

        </div>

        {/* MY REPORTS */}

        <div style={styles.card}>

          <div style={styles.reportHeader}>

            <div>

              <h2 style={styles.cardTitle}>
                My Medical Reports
              </h2>

              <p style={styles.description}>
                Previous symptom analyses are
                shown below.
              </p>

            </div>

            <button
              onClick={fetchReports}
              style={styles.refreshButton}
            >
              Refresh
            </button>

          </div>

          {reports.length === 0 ? (

            <div style={styles.emptyReports}>

              <div style={styles.emptyIcon}>
                📋
              </div>

              <p>
                No medical reports yet.
              </p>

              <p style={styles.description}>
                Submit your symptoms above to create
                your first report.
              </p>

            </div>

          ) : (

            <div>

              {reports.map((report) => (

                <div
                  key={report.id}
                  style={styles.reportCard}
                >

                  <div style={styles.reportTop}>

                    <h3>
                      Medical Report #{report.id}
                    </h3>

                    <span
                      style={styles.reportDate}
                    >
                      {report.createdAt
                        ? new Date(
                            report.createdAt
                          ).toLocaleString()
                        : "Date unavailable"}
                    </span>

                  </div>

                  {/* SYMPTOMS */}

                  <div style={styles.section}>

                    <h4>
                      Symptoms
                    </h4>

                    <p
                      style={styles.reportText}
                    >
                      {report.symptoms}
                    </p>

                  </div>

                  {/* AI RESPONSE */}

                  <div style={styles.aiBox}>

                    <h4>
                      🤖 Medical RAG Analysis
                    </h4>

                    <p
                      style={styles.reportText}
                    >
                      {report.aiResponse ||
                        "No AI analysis available."}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* INFORMATION CARDS */}

        <div style={styles.cardsRow}>

          <div style={styles.smallCard}>

            <div style={styles.icon}>
              🧠
            </div>

            <h3>
              RAG Powered
            </h3>

            <p>
              Relevant information is retrieved
              from medical documents before
              generating a response.
            </p>

          </div>

          <div style={styles.smallCard}>

            <div style={styles.icon}>
              👨‍⚕️
            </div>

            <h3>
              Doctor Review
            </h3>

            <p>
              Your report can be reviewed by a
              doctor who makes the final clinical
              assessment.
            </p>

          </div>

          <div style={styles.smallCard}>

            <div style={styles.icon}>
              🔒
            </div>

            <h3>
              Secure Reports
            </h3>

            <p>
              Your symptom reports and AI analysis
              are stored for later review.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
  },

  sidebar: {
    width: "230px",
    background: "#111827",
    color: "white",
    padding: "30px 20px",
    boxSizing: "border-box",
  },

  logo: {
    marginBottom: "30px",
  },

  patientInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 5px",
    marginBottom: "25px",
  },

  patientAvatar: {
    fontSize: "28px",
  },

  patientRole: {
    margin: "3px 0 0",
    fontSize: "12px",
    color: "#9ca3af",
  },

  activeMenu: {
    padding: "14px 10px",
    marginBottom: "10px",
    borderRadius: "8px",
    background: "#2563eb",
  },

  menuItem: {
    padding: "14px 10px",
    marginBottom: "10px",
    borderRadius: "8px",
  },

  logoutButton: {
    width: "100%",
    marginTop: "30px",
    padding: "12px",
    border: "1px solid #374151",
    borderRadius: "8px",
    background: "transparent",
    color: "white",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "35px",
    boxSizing: "border-box",
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
    color: "#111827",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
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
    marginBottom: "25px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.06)",
  },

  cardTitle: {
    marginTop: 0,
    color: "#111827",
  },

  description: {
    color: "#6b7280",
    lineHeight: "1.6",
  },

  symptomTextarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
    marginTop: "15px",
  },

  primaryButton: {
    marginTop: "15px",
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontSize: "16px",
  },

  disclaimer: {
    marginTop: "15px",
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: "1.5",
  },

  errorMessage: {
    padding: "15px",
    marginBottom: "20px",
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "8px",
    border: "1px solid #fecaca",
  },

  successMessage: {
    padding: "15px",
    marginBottom: "20px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "8px",
    border: "1px solid #bbf7d0",
  },

  reportHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  refreshButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },

  emptyReports: {
    textAlign: "center",
    padding: "50px 20px",
    color: "#9ca3af",
  },

  emptyIcon: {
    fontSize: "40px",
  },

  reportCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "20px",
  },

  reportTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  reportDate: {
    color: "#6b7280",
    fontSize: "13px",
  },

  section: {
    marginTop: "15px",
  },

  reportText: {
    color: "#374151",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
  },

  aiBox: {
    marginTop: "20px",
    padding: "18px",
    background: "#f3f4f6",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },

  cardsRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },

  smallCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    flex: 1,
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",
  },

  icon: {
    fontSize: "28px",
  },
};

export default PatientDashboard;