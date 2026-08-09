import React, { useState } from "react";

function PatientDashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // ---------------------------------------
  // Upload PDF
  // ---------------------------------------

  const uploadPDF = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);
    setUploadMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8001/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      setUploadMessage(data.message);

      // Clear previous conversation when a new document is uploaded
      setMessages([]);

    } catch (error) {
      console.error(error);

      setUploadMessage(
        "Unable to upload PDF. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };


  // ---------------------------------------
  // Ask Question
  // ---------------------------------------

  const askQuestion = async () => {
    const currentQuestion = question.trim();

    if (!currentQuestion) {
      return;
    }

    // Add user question immediately
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        type: "user",
        text: currentQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8001/ask?question=${encodeURIComponent(
          currentQuestion
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();

      // Add AI answer
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "ai",
          text: data.answer,
        },
      ]);

    } catch (error) {
      console.error(error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "ai",
          text: "Unable to get an answer. Please try again.",
        },
      ]);

    } finally {
      setLoading(false);
    }
  };


  // ---------------------------------------
  // Enter key
  // ---------------------------------------

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askQuestion();
    }
  };


  return (
    <div style={styles.page}>

      {/* Sidebar */}

      <aside style={styles.sidebar}>

        <h2 style={styles.logo}>
          MediRAG
        </h2>

        <div style={styles.activeMenu}>
          🏠 Dashboard
        </div>

        <div style={styles.menuItem}>
          📄 My Medical Report
        </div>

        <div style={styles.menuItem}>
          💬 Ask AI
        </div>

      </aside>


      {/* Main */}

      <main style={styles.main}>

        {/* Header */}

        <div style={styles.header}>

          <div>
            <h1 style={styles.title}>
              Patient Dashboard
            </h1>

            <p style={styles.subtitle}>
              Upload your medical report and ask questions
            </p>
          </div>

          <div style={styles.status}>
            ● AI Assistant Ready
          </div>

        </div>


        {/* Upload Card */}

        <div style={styles.card}>

          <h2>
            Upload Medical Report
          </h2>

          <p style={styles.description}>
            Upload a PDF medical report to ask questions
            about its contents.
          </p>

          <div style={styles.uploadBox}>

            <div style={styles.uploadIcon}>
              📄
            </div>

            <p>
              Select your medical PDF
            </p>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) =>
                setSelectedFile(e.target.files[0])
              }
            />

            <br />
            <br />

            <button
              onClick={uploadPDF}
              disabled={uploading}
              style={styles.primaryButton}
            >
              {uploading
                ? "Uploading..."
                : "Upload PDF"}
            </button>

            {selectedFile && (
              <p style={styles.fileName}>
                Selected: {selectedFile.name}
              </p>
            )}

            {uploadMessage && (
              <p style={styles.successMessage}>
                {uploadMessage}
              </p>
            )}

          </div>

        </div>


        {/* Chat Card */}

        <div style={styles.card}>

          <h2>
            Ask About Your Report
          </h2>

          <p style={styles.description}>
            Ask questions based only on your uploaded
            medical document.
          </p>


          {/* Chat History */}

          <div style={styles.chatBox}>

            {messages.length === 0 && (
              <div style={styles.emptyChat}>
                <div style={styles.emptyIcon}>
                  💬
                </div>

                <p>
                  Ask a question about your medical report
                  to get started.
                </p>
              </div>
            )}


            {messages.map((message, index) => (

              <div
                key={index}
                style={
                  message.type === "user"
                    ? styles.userMessage
                    : styles.aiMessage
                }
              >

                <div style={styles.messageLabel}>
                  {message.type === "user"
                    ? "You"
                    : "🤖 MediRAG"}
                </div>

                <div>
                  {message.text}
                </div>

              </div>

            ))}


            {loading && (
              <div style={styles.aiMessage}>
                <div style={styles.messageLabel}>
                  🤖 MediRAG
                </div>

                Thinking...
              </div>
            )}

          </div>


          {/* Question Input */}

          <div style={styles.inputRow}>

            <textarea
              rows="2"
              placeholder="Ask a question about your report..."
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={handleKeyDown}
              style={styles.textarea}
            />

            <button
              onClick={askQuestion}
              disabled={loading}
              style={styles.askButton}
            >
              {loading ? "..." : "Ask"}
            </button>

          </div>

          <p style={styles.hint}>
            Press Enter to ask • Shift + Enter for a new line
          </p>

        </div>


        {/* Information Cards */}

        <div style={styles.cardsRow}>

          <div style={styles.smallCard}>
            <div style={styles.icon}>
              🔒
            </div>

            <h3>
              Document Based
            </h3>

            <p>
              Answers are generated using the uploaded
              medical document.
            </p>
          </div>


          <div style={styles.smallCard}>
            <div style={styles.icon}>
              🧠
            </div>

            <h3>
              AI Powered
            </h3>

            <p>
              Retrieval augmented generation finds
              relevant information.
            </p>
          </div>


          <div style={styles.smallCard}>
            <div style={styles.icon}>
              📚
            </div>

            <h3>
              Context Aware
            </h3>

            <p>
              Questions are answered using relevant
              document sections.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}


// ---------------------------------------
// Styles
// ---------------------------------------

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
    marginBottom: "25px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },

  description: {
    color: "#6b7280",
  },

  uploadBox: {
    border: "2px dashed #d1d5db",
    borderRadius: "10px",
    padding: "30px",
    textAlign: "center",
    marginTop: "20px",
  },

  uploadIcon: {
    fontSize: "40px",
  },

  fileName: {
    color: "#374151",
    fontWeight: "bold",
  },

  successMessage: {
    color: "#16a34a",
    fontWeight: "bold",
  },

  primaryButton: {
    padding: "11px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
  },

  chatBox: {
    minHeight: "300px",
    maxHeight: "500px",
    overflowY: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px",
    background: "#fafafa",
    marginTop: "20px",
  },

  emptyChat: {
    textAlign: "center",
    color: "#9ca3af",
    padding: "80px 20px",
  },

  emptyIcon: {
    fontSize: "40px",
  },

  userMessage: {
    maxWidth: "75%",
    marginLeft: "auto",
    marginBottom: "15px",
    padding: "13px 16px",
    borderRadius: "12px",
    background: "#2563eb",
    color: "white",
  },

  aiMessage: {
    maxWidth: "75%",
    marginRight: "auto",
    marginBottom: "15px",
    padding: "13px 16px",
    borderRadius: "12px",
    background: "white",
    border: "1px solid #e5e7eb",
    color: "#374151",
  },

  messageLabel: {
    fontWeight: "bold",
    fontSize: "13px",
    marginBottom: "6px",
  },

  inputRow: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },

  textarea: {
    flex: 1,
    boxSizing: "border-box",
    padding: "13px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    resize: "vertical",
    fontSize: "15px",
  },

  askButton: {
    width: "80px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
  },

  hint: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "8px",
  },

  cardsRow: {
    display: "flex",
    gap: "20px",
  },

  smallCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    flex: 1,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  icon: {
    fontSize: "28px",
  },
};


export default PatientDashboard;