// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";

// const Navbar = () => {
//   const location = useLocation();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   const disableNav = location.pathname === "/login" || location.pathname === "/signup";

//   return (
//     <nav style={styles.nav}>
//       <h1 style={styles.brand}>SaveTheServe</h1>

//       {!disableNav && (
//         <div>
//           <Link to="/" style={styles.link}>Home</Link>
//           {user?.role === "donor" && <Link to="/create" style={styles.link}>Donate</Link>}
//           {user?.role === "donor" && <Link to="/mydonations" style={styles.link}>My Donations</Link>}
//           <Link to="/impact" style={styles.link}>Impact</Link>
//           <Link to="/profile" style={styles.link}>Profile</Link>
//         </div>
//       )}
//     </nav>
//   );
// };

// const styles = {
//   nav: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "10px 20px",
//     backgroundColor: "#4caf50",
//     color: "#fff",
//     marginBottom: "20px",
//   },
//   brand: { margin: 0, fontSize: "1.5rem" },
//   link: { marginLeft: "15px", textDecoration: "none", color: "#fff", fontWeight: "bold" },
// };

// export default Navbar;

import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  //  Notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  //  Load user from localStorage (and keep it updated)
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } else {
        setUser(null);
      }
    };

    loadUser(); // initial load
    window.addEventListener("focus", loadUser);   // when user logs in & returns
    window.addEventListener("storage", loadUser); // if multiple tabs

    return () => {
      window.removeEventListener("focus", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // ✅ Fetch notifications ONLY for logged-in user
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?._id) {
        setNotifications([]);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5001/api/user/${user._id}/notifications`
        );
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [user]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Hide nav links on login & signup pages
  const disableNav =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav style={styles.nav}>
      <h1 style={styles.brand}>SaveTheServe</h1>

      {!disableNav && (
        <div>
          <Link to="/" style={styles.link}>Home</Link>

          {user?.role === "donor" && (
            <Link to="/create" style={styles.link}>Donate</Link>
          )}

          {user?.role === "donor" && (
            <Link to="/mydonations" style={styles.link}>My Donations</Link>
          )}

          <Link to="/impact" style={styles.link}>Impact</Link>
          <Link to="/profile" style={styles.link}>Profile</Link>

          {/* ✅ Notifications Dropdown - only if user is logged in */}
          {user && (
            <span
              style={{ position: "relative", display: "inline-block" }}
              ref={dropdownRef}
            >
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={styles.notificationBtn}
              >
                🔔
                {notifications.length > 0 && (
                  <span style={styles.badge}>{notifications.length}</span>
                )}
              </button>

              {showNotifications && (
                <div style={styles.dropdown}>
                  <h4 style={styles.dropdownTitle}>Notifications</h4>

                  {notifications.length === 0 ? (
                    <p style={styles.emptyText}>No notifications</p>
                  ) : (
                    notifications
                      .slice()
                      .reverse()
                      .map((n, index) => (
                        <div key={index} style={styles.notificationItem}>
                          <p style={styles.notificationText}>
                            {n.message || "New notification"}
                          </p>

                          {n.createdAt && (
                            <small style={styles.notificationTime}>
                              {new Date(n.createdAt).toLocaleString()}
                            </small>
                          )}
                        </div>
                      ))
                  )}
                </div>
              )}
            </span>
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
  brand: { margin: 0, fontSize: "1.5rem" },
  link: {
    marginLeft: "15px",
    textDecoration: "none",
    color: "#fff",
    fontWeight: "bold",
  },

  // ✅ Notification styles
  notificationBtn: {
    marginLeft: "15px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "#fff",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: "-6px",
    right: "-10px",
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "11px",
    fontWeight: "bold",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "28px",
    backgroundColor: "white",
    color: "black",
    width: "260px",
    borderRadius: "6px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 999,
    padding: "10px",
  },
  dropdownTitle: {
    margin: "0 0 10px 0",
    borderBottom: "1px solid #ddd",
    paddingBottom: "6px",
  },
  emptyText: {
    fontSize: "14px",
    color: "#666",
    margin: 0,
  },
  notificationItem: {
    borderBottom: "1px solid #eee",
    padding: "8px 0",
  },
  notificationText: {
    margin: 0,
    fontSize: "14px",
  },
  notificationTime: {
    color: "#777",
    fontSize: "12px",
  },
};

export default Navbar;