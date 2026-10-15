import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "http://localhost:8080";

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        role === "doctor"
          ? "/api/doctor/login"
          : "/api/patient/login";

      const response = await fetch(
        `${BACKEND_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      // Handle both JSON and plain-text responses
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
          data.message || "Login failed."
        );
      }

      // Make sure backend actually returned a token
      if (!data.token) {
        throw new Error(
          "Login successful, but JWT token was not received."
        );
      }

      // Store authentication information
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "role",
        data.role
      );

      localStorage.setItem(
        "userId",
        String(data.userId)
      );

      localStorage.setItem(
        "name",
        data.name || ""
      );

      localStorage.setItem(
        "email",
        data.email || email
      );

      // Redirect according to role
      if (data.role === "DOCTOR") {
        navigate("/doctor");
      } else if (data.role === "PATIENT") {
        navigate("/patient");
      } else {
        throw new Error(
          "Unknown user role received from server."
        );
      }

    } catch (err) {

      console.error("Login error:", err);

      setError(
        err.message ||
        "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
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
            onClick={() => {
              setRole("patient");
              setError("");
            }}
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
            onClick={() => {
              setRole("doctor");
              setError("");
            }}
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
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={styles.input}
            disabled={loading}
          />

          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={styles.input}
            disabled={loading}
          />

          {error && (
            <p style={styles.error}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={styles.loginButton}
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : `Login as ${
                  role === "doctor"
                    ? "Doctor"
                    : "Patient"
                }`}
          </button>

        </form>

        <p style={styles.demoText}>
          Secure JWT authentication
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
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.08)",
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
    marginBottom: "15px",
  },

  demoText: {
    marginTop: "20px",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "12px",
  },
};

export default Login;