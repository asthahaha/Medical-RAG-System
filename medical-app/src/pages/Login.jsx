import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    // Demo authentication
    if (role === "doctor") {
      navigate("/doctor");
    } else {
      navigate("/patient");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.logo}>
          MediRAG
        </div>

        <h1 style={styles.title}>
          Welcome Back
        </h1>

        <p style={styles.subtitle}>
          Medical document assistant
        </p>

        {/* Role Selection */}
        <div style={styles.roleContainer}>

          <button
            type="button"
            onClick={() => setRole("patient")}
            style={
              role === "patient"
                ? styles.activeRole
                : styles.roleButton
            }
          >
            👤 Patient
          </button>

          <button
            type="button"
            onClick={() => setRole("doctor")}
            style={
              role === "doctor"
                ? styles.activeRole
                : styles.roleButton
            }
          >
            🩺 Doctor
          </button>

        </div>

        <form onSubmit={handleLogin}>

          <label style={styles.label}>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {error && (
            <p style={styles.error}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={styles.loginButton}
          >
            Login as {role === "doctor" ? "Doctor" : "Patient"}
          </button>

        </form>

        <p style={styles.demoText}>
          Demo authentication — backend authentication
          will be added later.
        </p>

      </div>
    </div>
  );
}


const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "400px",
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },

  logo: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: "20px",
  },

  title: {
    textAlign: "center",
    marginBottom: "8px",
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: "30px",
  },

  roleContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
  },

  roleButton: {
    flex: 1,
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
  },

  activeRole: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontWeight: "bold",
    color: "#374151",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginBottom: "18px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
  },

  loginButton: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    color: "#dc2626",
    fontSize: "14px",
  },

  demoText: {
    marginTop: "20px",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "12px",
  },
};


export default Login;