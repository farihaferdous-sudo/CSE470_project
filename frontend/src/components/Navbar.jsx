import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Notifications state from development
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // Unified User Loader
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing stored user:", e);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("focus", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("focus", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Fetch notifications (from development)
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?._id) {
        setNotifications([]);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5001/api/user/${user._id}/notifications`);
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, [user]);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const disableNav = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav style={styles.nav}>
      <h1 style={styles.brand}>SaveTheServe</h1>

      {!disableNav && (
        <div style={styles.navContent}>
          <div style={styles.links}>
            <Link to="/" style={styles.link}>Home</Link>
            {user?.role === "donor" && <Link to="/create" style={styles.link}>Donate</Link>}
            {user?.role === "donor" && <Link to="/mydonations" style={styles.link}>My Donations</Link>}
            <Link to="/impact" style={styles.link}>Impact</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
          </div>

          {user && (
            <div style={styles.userSection}>
              {/* Notifications Bell */}
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} style={styles.notificationBtn}>
                  🔔 {notifications.length > 0 && <span style={styles.badge}>{notifications.length}</span>}
                </button>
                {showNotifications && (
                  <div style={styles.dropdown}>
                    <h4 style={styles.dropdownTitle}>Notifications</h4>
                    {notifications.length === 0 ? <p style={styles.emptyText}>No notifications</p> : 
                      notifications.slice().reverse().map((n, i) => (
                        <div key={i} style={styles.notificationItem}>
                          <p style={styles.notificationText}>{n.message}</p>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
              
              <span style={styles.username}>👤 {user.username}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
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
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", backgroundColor: "#4caf50", color: "#fff" },
  brand: { margin: 0, fontSize: "1.5rem" },
  navContent: { display: "flex", alignItems: "center", gap: "20px" },
  links: { display: "flex" },
  link: { marginLeft: "15px", textDecoration: "none", color: "#fff", fontWeight: "bold" },
  userSection: { display: "flex", alignItems: "center", gap: "15px", borderLeft: "2px solid rgba(255,255,255,0.3)", paddingLeft: "15px" },
  username: { color: "#fff", fontWeight: "bold" },
  logoutBtn: { padding: "6px 12px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  authLinks: { display: "flex", gap: "10px" },
  notificationBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: "18px", color: "#fff" },
  badge: { position: "absolute", top: "-5px", right: "-5px", backgroundColor: "red", borderRadius: "50%", padding: "2px 5px", fontSize: "10px" },
  dropdown: { position: "absolute", right: 0, top: "30px", backgroundColor: "white", color: "black", width: "250px", borderRadius: "6px", padding: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", zIndex: 100 },
  dropdownTitle: { margin: "0 0 10px 0", borderBottom: "1px solid #ddd" },
  notificationItem: { padding: "5px 0", borderBottom: "1px solid #eee" },
  notificationText: { margin: 0, fontSize: "13px" },
  emptyText: { fontSize: "12px", color: "#666" }
};

export default Navbar;