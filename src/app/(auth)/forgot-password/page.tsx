"use client";

import { useState, ChangeEvent } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/forgot-password", { email });
      toast.success("Password reset link sent to your email.");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Forgot Your Password?</h2>
      <p style={styles.description}>
        Enter your email address below. We’ll send you a link to reset your password.
      </p>

      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={handleChange}
        style={styles.input}
      />

      <button
        onClick={handleSendResetLink}
        disabled={loading}
        style={{
          ...styles.button,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "420px",
    margin: "80px auto",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "Segoe UI, sans-serif",
    textAlign: "center",
  },
  heading: {
    fontSize: "22px",
    fontWeight: 600,
    marginBottom: "10px",
    color: "#1a202c",
  },
  description: {
    fontSize: "15px",
    color: "#4a5568",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2754C5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: 600,
  },
};
