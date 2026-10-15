import React, { useEffect, useState } from "react";

function DoctorDashboard() {
  const BACKEND_URL = "http://localhost:8080";

  const token = localStorage.getItem("token");
  const doctorId = localStorage.getItem("userId");
  const doctorName = localStorage.getItem("name");

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedReport, setSelectedReport] = useState(null);

  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [notes, setNotes] = useState("");

  const [savingNote, setSavingNote] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // =====================================================
  // AUTHENTICATION CHECK
  // =====================================================

  useEffect(() => {
    if (!token || !doctorId) {
      window.location.href = "/";
      return;
    }

    fetchPatientReports();
  }, []);

  // =====================================================
  // FETCH PATIENT REPORTS
  // =====================================================

  const fetchPatientReports = async () => {
    try {
      setLoadingReports(true);
      setError("");

      if (!token || !doctorId) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(
        `${BACKEND_URL}/api/doctor/reports`,
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
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data.message ||
              data.error ||
              "Failed to fetch patient reports"
        );
      }

      setReports(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Reports error:", err);

      setError(
        err.message ||
          "Unable to load patient reports."
      );
    } finally {
      setLoadingReports(false);
    }
  };

  // =====================================================
  // SELECT REPORT
  // =====================================================

  const handleSelectReport = (report) => {
    setSelectedReport(report);

    setDiagnosis("");
    setTreatment("");
    setNotes("");

    setError("");
    setSuccessMessage("");
  };

  // =====================================================
  // SAVE DOCTOR NOTE
  // =====================================================

  const saveDoctorNote = async () => {
    if (!selectedReport) {
      setError(
        "Please select a patient report first."
      );
      return;
    }

    if (!diagnosis.trim()) {
      setError("Please enter diagnosis.");
      return;
    }

    if (!treatment.trim()) {
      setError("Please enter treatment.");
      return;
    }

    try {
      setSavingNote(true);
      setError("");
      setSuccessMessage("");

      if (!token || !doctorId) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(
        `${BACKEND_URL}/api/doctor/notes/create`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            // Kept for frontend compatibility.
            // Backend now gets doctor from JWT.
            doctorId: Number(doctorId),

            patientId: selectedReport.patient.id,

            diagnosis: diagnosis.trim(),

            treatment: treatment.trim(),

            notes: notes.trim(),
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data.message ||
              data.error ||
              "Failed to save doctor note"
        );
      }

      setSuccessMessage(
        "Doctor's clinical note saved successfully."
      );

      setDiagnosis("");
      setTreatment("");
      setNotes("");

    } catch (err) {
      console.error(
        "Doctor note error:",
        err
      );

      setError(
        err.message ||
          "Unable to save doctor's note."
      );

    } finally {
      setSavingNote(false);
    }
  };

  // =====================================================
  // SELECT PDF
  // =====================================================

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file.");
      setSelectedFile(null);
      return;
    }

    setError("");
    setSuccessMessage("");
    setSelectedFile(file);
  };

  // =====================================================
  // UPLOAD PDF
  // =====================================================

  const uploadPDF = async () => {
    if (!selectedFile) {
      setError(
        "Please select a PDF file first."
      );
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccessMessage("");

      if (!token || !doctorId) {
        throw new Error("You are not logged in.");
      }

      const formData = new FormData();

      // IMPORTANT:
      // Only send the PDF.
      // doctorId is NOT sent anymore.
      // Backend gets doctor from JWT.
      formData.append("file", selectedFile);

      const response = await fetch(
        `${BACKEND_URL}/api/doctor/documents/upload`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          // Do NOT manually set Content-Type.
          // Browser adds multipart/form-data boundary.
          body: formData,
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data.message ||
              data.error ||
              "Upload failed"
        );
      }

      setSuccessMessage(
        typeof data === "string"
          ? data
          : data.message ||
            "Medical PDF uploaded successfully."
      );

      setSelectedFile(null);

    } catch (err) {
      console.error(
        "Upload error:",
        err
      );

      setError(
        err.message ||
          "Unable to upload the medical PDF."
      );

    } finally {
      setUploading(false);
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
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fb",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>Loading Doctor Dashboard...</h2>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f5f7fb",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >

        <div>
          <h1
            style={{
              margin: 0,
              color: "#111827",
            }}
          >
            Doctor Dashboard
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "8px",
            }}
          >
            Welcome, {doctorName || "Doctor"}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >

          <button
            onClick={fetchPatientReports}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              background: "#2563eb",
              color: "white",
              fontSize: "14px",
            }}
          >
            Refresh Reports
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              background: "#dc2626",
              color: "white",
              fontSize: "14px",
            }}
          >
            Logout
          </button>

        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {successMessage && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            background: "#dcfce7",
            color: "#166534",
            borderRadius: "8px",
            border: "1px solid #bbf7d0",
          }}
        >
          {successMessage}
        </div>
      )}

      {/* UPLOAD MEDICAL PDF */}

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >

        <h2
          style={{
            marginTop: 0,
            color: "#111827",
          }}
        >
          Upload Medical PDF
        </h2>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          Upload research papers, medical books,
          or educational material to the Medical RAG
          knowledge base.
        </p>

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
        />

        {selectedFile && (
          <p
            style={{
              color: "#374151",
            }}
          >
            Selected file:{" "}
            <strong>
              {selectedFile.name}
            </strong>
          </p>
        )}

        <button
          onClick={uploadPDF}
          disabled={!selectedFile || uploading}
          style={{
            marginTop: "15px",
            padding: "12px 22px",
            border: "none",
            borderRadius: "8px",
            cursor:
              !selectedFile || uploading
                ? "not-allowed"
                : "pointer",
            background: "#16a34a",
            color: "white",
            fontSize: "15px",
            opacity:
              !selectedFile || uploading
                ? 0.6
                : 1,
          }}
        >
          {uploading
            ? "Uploading..."
            : "Upload PDF"}
        </button>

      </div>

      {/* PATIENT REPORTS */}

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >

        <h2
          style={{
            marginTop: 0,
            color: "#111827",
          }}
        >
          Patient Reports
        </h2>

        {reports.length === 0 ? (

          <p
            style={{
              color: "#6b7280",
            }}
          >
            No patient reports available.
          </p>

        ) : (

          <div
            style={{
              display: "grid",
              gap: "15px",
            }}
          >

            {reports.map((item) => (

              <div
                key={item.id}
                onClick={() =>
                  handleSelectReport(item)
                }
                style={{
                  padding: "20px",
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: "10px",
                  cursor: "pointer",
                  background:
                    selectedReport?.id === item.id
                      ? "#eff6ff"
                      : "white",
                }}
              >

                <h3
                  style={{
                    marginTop: 0,
                    color: "#111827",
                  }}
                >
                  Patient Report #{item.id}
                </h3>

                <p>
                  <strong>Patient:</strong>{" "}
                  {item.patient?.name ||
                    "Unknown"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {item.patient?.email ||
                    "N/A"}
                </p>

                <p>
                  <strong>Symptoms:</strong>{" "}
                  {item.symptoms}
                </p>

                <p>
                  <strong>
                    AI Analysis:
                  </strong>
                </p>

                <div
                  style={{
                    padding: "15px",
                    background: "#f3f4f6",
                    borderRadius: "8px",
                    whiteSpace: "pre-wrap",
                    color: "#374151",
                  }}
                >
                  {item.aiResponse ||
                    "No AI analysis available."}
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* DOCTOR REVIEW */}

      {selectedReport && (

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.08)",
            marginBottom: "30px",
          }}
        >

          <h2
            style={{
              marginTop: 0,
              color: "#111827",
            }}
          >
            Doctor Clinical Review
          </h2>

          <p>
            <strong>Patient:</strong>{" "}
            {selectedReport.patient?.name}
          </p>

          <p>
            <strong>Symptoms:</strong>{" "}
            {selectedReport.symptoms}
          </p>

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#f3f4f6",
              borderRadius: "8px",
            }}
          >

            <strong>
              AI Analysis
            </strong>

            <p
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
              }}
            >
              {selectedReport.aiResponse}
            </p>

          </div>

          {/* DIAGNOSIS */}

          <label
            style={{
              display: "block",
              marginTop: "20px",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Doctor's Diagnosis
          </label>

          <textarea
            value={diagnosis}
            onChange={(e) =>
              setDiagnosis(e.target.value)
            }
            placeholder="Enter clinical diagnosis"
            rows={3}
            style={{
              width: "100%",
              padding: "12px",
              boxSizing: "border-box",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              resize: "vertical",
            }}
          />

          {/* TREATMENT */}

          <label
            style={{
              display: "block",
              marginTop: "20px",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Treatment
          </label>

          <textarea
            value={treatment}
            onChange={(e) =>
              setTreatment(e.target.value)
            }
            placeholder="Enter treatment or clinical plan"
            rows={4}
            style={{
              width: "100%",
              padding: "12px",
              boxSizing: "border-box",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              resize: "vertical",
            }}
          />

          {/* NOTES */}

          <label
            style={{
              display: "block",
              marginTop: "20px",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Doctor's Notes
          </label>

          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            placeholder="Additional clinical notes"
            rows={4}
            style={{
              width: "100%",
              padding: "12px",
              boxSizing: "border-box",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              resize: "vertical",
            }}
          />

          {/* SAVE */}

          <button
            onClick={saveDoctorNote}
            disabled={savingNote}
            style={{
              marginTop: "20px",
              padding: "13px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: savingNote
                ? "not-allowed"
                : "pointer",
              background: "#7c3aed",
              color: "white",
              fontSize: "16px",
              opacity:
                savingNote ? 0.7 : 1,
            }}
          >
            {savingNote
              ? "Saving..."
              : "Save Doctor Review"}
          </button>

        </div>
      )}

    </div>
  );
}

export default DoctorDashboard;