import React, { useState, useEffect } from "react";

function App() {
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
  });

  // Fetch all events once on mount
  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then(setEvents)
      .catch((err) => console.error("Fetch events error:", err));
  }, []);

  // -------------------- AUTH (login / register) --------------------
  function handleAuthSubmit(e) {
    e.preventDefault();
    const endpoint = mode === "login" ? "login" : "register";
    const data = Object.fromEntries(new FormData(e.target));

    fetch(`http://localhost:5000/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .then((obj) => {
        if (obj.access_token) {
          setToken(obj.access_token);
          localStorage.setItem("token", obj.access_token);
        } else {
          alert(obj.error || "Auth failed");
        }
      });
  }

  // -------------------- FORM FIELD CHANGE --------------------
  function handleEventChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // -------------------- CREATE EVENT --------------------
  function handleAddEvent(e) {
    e.preventDefault();

    const { title, location, start_time, end_time } = formData;
    if (!title || !location || !start_time || !end_time) {
      alert("Please fill in all required fields.");
      return;
    }

    fetch("http://localhost:5000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then(async (r) => {
        const bodyText = await r.text();
        if (!r.ok) {
          throw new Error(`Server error ${r.status}: ${bodyText}`);
        }
        return JSON.parse(bodyText);
      })
      .then((obj) => {
        if (obj.event) {
          setEvents([...events, obj.event]);
          setFormData({
            title: "" ,
            description:"" ,
            location: "",
            start_time: "" ,
            end_time: "",
          });
        } else {
          alert(obj.error || "Could not create event");
        }
      })
      .catch((err) => {
        console.error("Add event failed:", err.message);
        alert(err.message);
      });
  }

  function handleLogout() {
    setToken(null);
    localStorage.removeItem("token");
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎉 Event Planner 🎨</h1>

      {/* -------------------- AUTH BOX -------------------- */}
      {!token ? (
        <div style={styles.authBox}>
          <h2>{mode === "login" ? "🔐 Login" : "📝 Register"}</h2>
          <form onSubmit={handleAuthSubmit} style={styles.form}>
            {mode === "register" && (
              <input
                name="username"
                placeholder="Username"
                required
                style={styles.input}
              />
            )}
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              style={styles.input}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
            {mode === "login" ? (
              <>
                No account?{" "}
                <span style={styles.link} onClick={() => setMode("register")}>Register</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span style={styles.link} onClick={() => setMode("login")}>Login</span>
              </>
            )}
          </p>
        </div>
      ) : (
        <>
          {/* -------------------- ADD EVENT -------------------- */}
          <div style={styles.eventBox}>
            <h2>➕ Add Event</h2>
            <form onSubmit={handleAddEvent} style={styles.form}>
              <input
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleEventChange}
                style={styles.input}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleEventChange}
                rows="2"
                style={styles.textarea}
              />
              <input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleEventChange}
                style={styles.input}
                required
              />
              <label style={styles.label}>Start Time</label>
              <input
                name="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={handleEventChange}
                style={styles.input}
                required
              />
              <label style={styles.label}>End Time</label>
              <input
                name="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={handleEventChange}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.button}>
                Create Event
              </button>
            </form>
            <button onClick={handleLogout} style={styles.logoutButton}>🔓 Logout</button>
          </div>

          {/* -------------------- EVENT LIST -------------------- */}
          <div style={{ marginTop: "3rem" }}>
            <h2 style={{ textAlign: "center" }}>📅 Upcoming Events</h2>
            {events.length === 0 ? (
              <p style={{ textAlign: "center" }}>No events found</p>
            ) : (
              events.map((ev) => (
                <div key={ev.id} style={styles.card}>
                  <h3>{ev.title}</h3>
                  <p>{ev.description}</p>
                  <p>
                    <strong>Location:</strong> {ev.location}
                  </p>
                  <p>
                    <strong>Start:</strong> {new Date(ev.start_time).toLocaleString()}
                  </p>
                  <p>
                    <strong>End:</strong> {new Date(ev.end_time).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

// -------------------- INLINE STYLES --------------------
const styles = {
  container: {
    fontFamily: "Comic Sans MS, cursive, sans-serif",
    background: "#fff0f5",
    padding: "2rem",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    fontSize: "2.5rem",
    color: "#ff69b4",
  },
  authBox: {
    background: "#e0f7fa",
    borderRadius: "1rem",
    padding: "1.5rem",
    maxWidth: "400px",
    margin: "1rem auto",
    boxShadow: "0 0 10px #b2ebf2",
  },
  eventBox: {
    background: "#fff3e0",
    borderRadius: "1rem",
    padding: "1.5rem",
    maxWidth: "500px",
    margin: "1rem auto",
    boxShadow: "0 0 10px #ffe0b2",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  label: {
    fontWeight: "bold",
    marginTop: "0.5rem",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "0.5rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  button: {
    padding: "0.7rem",
    background: "#ff69b4",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  logoutButton: {
    marginTop: "1rem",
    padding: "0.5rem",
    background: "#ccc",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  card: {
    background: "#ffe4e1",
    padding: "1rem",
    borderRadius: "12px",
    margin: "1rem auto",
    maxWidth: "600px",
    boxShadow: "0 0 10px #ffc0cb",
  },
  link: {
    color: "#1976d2",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default App;
