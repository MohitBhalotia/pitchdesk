"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token) {
      toast.error("Reset token is missing.");
      return;
    }

    if (!password || password.length < 6) {
      toast.warning("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/reset-password", {
        token,
        password,
      });

      if (response.status === 200) {
        toast.success("Password updated successfully!");
        router.push("/login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Reset Your Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleReset} disabled={loading} style={styles.button}>
        {loading ? "Updating..." : "Update Password"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "80px auto",
    padding: "24px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
    textAlign: "center" as const,
  },
  input: {
    padding: "10px",
    marginTop: "10px",
    width: "100%",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "16px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#2754C5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
