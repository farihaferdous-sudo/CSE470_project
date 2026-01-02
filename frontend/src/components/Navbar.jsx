// import React from "react";
// import { Link, useLocation } from "react-router-dom";

// const Navbar = () => {
//   return (
//     <nav style={styles.nav}>
//       <h1 style={styles.brand}>SaveTheServe</h1>
//       <div>
//         <Link to="/" style={styles.link}>Home</Link>
//         <Link to="/create" style={styles.link}>Donate</Link>
//         <Link to="/impact" style={styles.link}>Impact</Link>
//         <Link to="/profile" style={styles.link}>Profile</Link>
//       </div>
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
//   brand: {
//     margin: 0,
//     fontSize: "1.5rem",
//   },
//   link: {
//     marginLeft: "15px",
//     textDecoration: "none",
//     color: "#fff",
//     fontWeight: "bold",
//   },
// };

// export default Navbar;

import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  //  Hide nav links on login & signup pages
  const disableNav =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav style={styles.nav}>
      <h1 style={styles.brand}>SaveTheServe</h1>

      {!disableNav && (
        <div>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/create" style={styles.link}>Donate</Link>
          <Link to="/impact" style={styles.link}>Impact</Link>
          <Link to="/profile" style={styles.link}>Profile</Link>
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
  link: {
    marginLeft: "15px",
    textDecoration: "none",
    color: "#fff",
    fontWeight: "bold",
  },
};

export default Navbar;
