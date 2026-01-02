import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "receiver",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          totalDonated: 0,
          totalReceived: 0,
          mealsSaved: 0,
          donationCount: 0,
          receptionCount: 0,
          badges: [],
          notifications: [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg({ type: "error", text: data.message || "Signup failed" });
      } else {
        setMsg({ type: "success", text: "Signup successful! Redirecting..." });
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (err) {
      setMsg({ type: "error", text: "Server error. Try again." });
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create an Account</h2>

        {msg.text && (
          <p style={msg.type === "error" ? styles.error : styles.success}>
            {msg.text}
          </p>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <div style={{ marginTop: "8px" }}>
            <label>
              <input
                type="radio"
                name="role"
                value="donor"
                checked={form.role === "donor"}
                onChange={handleChange}
              />{" "}
              Donor
            </label>
            <label style={{ marginLeft: "20px" }}>
              <input
                type="radio"
                name="role"
                value="receiver"
                checked={form.role === "receiver"}
                onChange={handleChange}
              />{" "}
              Receiver
            </label>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.linkText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9",
  },
  card: {
    width: "380px",
    padding: "30px",
    background: "white",
    borderRadius: "14px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },
  title: { marginBottom: "16px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    padding: "12px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#007bff",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  linkText: { marginTop: "14px", textAlign: "center", fontSize: "14px" },
  link: { color: "#007bff", cursor: "pointer", fontWeight: "bold" },
  error: { color: "red", textAlign: "center" },
  success: { color: "green", textAlign: "center" },
};
