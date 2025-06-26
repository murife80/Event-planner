// src/Login.js
import React, { useState } from "react";

function Login({ setToken }) {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5555/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.access_token) {
          setToken(data.access_token);
        } else {
          alert("Login failed. Check your credentials.");
        }
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "300px", margin: "auto", marginTop: "4rem" }}>
      <h2 style={{ textAlign: "center" }}>🔐 Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <button type="submit" style={{ width: "100%", padding: "0.5rem", background: "#ff69b4", color: "white", border: "none", borderRadius: "8px" }}>
        Login
      </button>
    </form>
  );
}

export default Login;
