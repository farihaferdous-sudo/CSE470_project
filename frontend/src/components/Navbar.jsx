import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get logged-in user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
  }, [location]); // Re-check on location change

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  //  Hide nav links on login & signup pages
  const disableNav =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav style={styles.nav}>
      <h1 style={styles.brand}>SaveTheServe</h1>

      {!disableNav && (
        <div style={styles.navContent}>
          <div style={styles.links}>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/create" style={styles.link}>Donate</Link>
            <Link to="/impact" style={styles.link}>Impact</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
          </div>

          {user && (
            <div style={styles.userSection}>
              <span style={styles.username}>👤 {user.username}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          )}

          {!user && (
            <div style={styles.authLinks}>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/signup" style={styles.link}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#4caf50",
    color: "#fff",
    marginBottom: "20px",
  },
  brand: {
    margin: 0,
    fontSize: "1.5rem",
  },
  navContent: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  links: {
    display: "flex",
    gap: "0",
  },
  link: {
    marginLeft: "15px",
    textDecoration: "none",
    color: "#fff",
    fontWeight: "bold",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderLeft: "2px solid rgba(255,255,255,0.3)",
    paddingLeft: "15px",
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9em",
  },
  authLinks: {
    display: "flex",
    gap: "10px",
    borderLeft: "2px solid rgba(255,255,255,0.3)",
    paddingLeft: "15px",
  },
};

export default Navbar;
