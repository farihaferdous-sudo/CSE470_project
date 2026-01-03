// import { useState } from "react";
// import axios from "axios";

// export default function CreatePage() {
//   const [form, setForm] = useState({
//     foodType: "",
//     quantity: "",
//     preparedAt: "",
//     maxSafeHours: 6,
//     pickupLocation: "",
//     pickupTime: "",
//     area: "Banani",
//   });
//   const [msg, setMsg] = useState({ type: "", text: "" });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setMsg({ type: "", text: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const donorId = JSON.parse(localStorage.getItem("user"))?.user?._id || "donor1";
//       await axios.post("http://localhost:5001/api/foods", {
//         donorId,
//         ...form,
//       });

//       setMsg({ type: "success", text: "Food added successfully!" });

//       // Reset form
//       setForm({
//         foodType: "",
//         quantity: "",
//         preparedAt: "",
//         maxSafeHours: 6,
//         pickupLocation: "",
//         pickupTime: "",
//         area: "Banani",
//       });
//     } catch (err) {
//       console.error(err);
//       setMsg({ type: "error", text: "Error adding food" });
//     }

//     setLoading(false);
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h2 style={styles.title}>Add Food Donation</h2>

//         {msg.text && (
//           <p style={msg.type === "error" ? styles.error : styles.success}>
//             {msg.text}
//           </p>
//         )}

//         <form onSubmit={handleSubmit} style={styles.form}>
//           <label>Food Type</label>
//           <input
//             type="text"
//             name="foodType"
//             placeholder="e.g., Rice, Sandwich"
//             value={form.foodType}
//             onChange={handleChange}
//             required
//             style={styles.input}
//           />

//           <label>Quantity</label>
//           <input
//             type="number"
//             name="quantity"
//             placeholder="Number of servings"
//             value={form.quantity}
//             onChange={handleChange}
//             required
//             style={styles.input}
//           />

//           <label>Prepared At</label>
//           <input
//             type="datetime-local"
//             name="preparedAt"
//             value={form.preparedAt}
//             onChange={handleChange}
//             required
//             style={styles.input}
//           />

//           <label>Max Safe Hours</label>
//           <input
//             type="number"
//             name="maxSafeHours"
//             value={form.maxSafeHours}
//             onChange={handleChange}
//             required
//             style={styles.input}
//           />

//           <label>Pickup Location</label>
//           <input
//             type="text"
//             name="pickupLocation"
//             placeholder="Exact address or landmark"
//             value={form.pickupLocation}
//             onChange={handleChange}
//             required
//             style={styles.input}
//           />

//           <label>Preferred Pickup Time</label>
//           <input
//             type="datetime-local"
//             name="pickupTime"
//             value={form.pickupTime}
//             onChange={handleChange}
//             required
//             style={styles.input}
//           />

//           <label>Area</label>
//           <select
//             name="area"
//             value={form.area}
//             onChange={handleChange}
//             required
//             style={styles.select}
//           >
//             <option value="Banani">Banani</option>
//             <option value="Gulshan">Gulshan</option>
//             <option value="Dhanmondi">Dhanmondi</option>
//             <option value="Uttara">Uttara</option>
//             <option value="Mirpur">Mirpur</option>
//             <option value="Mohammadpur">Mohammadpur</option>
//           </select>

//           <button type="submit" style={styles.button} disabled={loading}>
//             {loading ? "Adding..." : "Add Food"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     minHeight: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "#f4f6f9",
//     padding: "20px",
//   },
//   card: {
//     width: "400px",
//     padding: "30px",
//     background: "#fff",
//     borderRadius: "14px",
//     boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
//   },
//   title: { textAlign: "center", marginBottom: "20px" },
//   form: { display: "flex", flexDirection: "column", gap: "12px" },
//   input: {
//     padding: "12px",
//     fontSize: "15px",
//     borderRadius: "8px",
//     border: "1px solid #ccc",
//   },
//   select: {
//     padding: "12px",
//     fontSize: "15px",
//     borderRadius: "8px",
//     border: "1px solid #ccc",
//     backgroundColor: "#fff",
//   },
//   button: {
//     padding: "12px",
//     borderRadius: "8px",
//     border: "none",
//     background: "#28a745",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "16px",
//     fontWeight: "bold",
//     marginTop: "10px",
//   },
//   error: { color: "red", textAlign: "center" },
//   success: { color: "green", textAlign: "center" },
// };


import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreatePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    foodType: "",
    quantity: "",
    preparedAt: "",
    maxSafeHours: 6,
    pickupLocation: "",
    pickupTime: "",
    area: "Banani",
  });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.role !== "donor") {
        alert("Only donors can access this page");
        navigate("/");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5001/api/foods", {
        donorId: user._id,
        ...form,
      });
      setMsg({ type: "success", text: "Food added successfully!" });
      setForm({ foodType: "", quantity: "", preparedAt: "", maxSafeHours: 6, pickupLocation: "", pickupTime: "", area: "Banani" });
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "Error adding food" });
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add Food Donation</h2>
        {msg.text && <p style={msg.type === "error" ? styles.error : styles.success}>{msg.text}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Food Type</label>
          <input type="text" name="foodType" value={form.foodType} onChange={handleChange} placeholder="e.g., Rice" required style={styles.input} />

          <label>Quantity</label>
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Number of servings" required style={styles.input} />

          <label>Prepared At</label>
          <input type="datetime-local" name="preparedAt" value={form.preparedAt} onChange={handleChange} required style={styles.input} />

          <label>Max Safe Hours</label>
          <input type="number" name="maxSafeHours" value={form.maxSafeHours} onChange={handleChange} required style={styles.input} />

          <label>Pickup Location</label>
          <input type="text" name="pickupLocation" value={form.pickupLocation} onChange={handleChange} placeholder="Exact address or landmark" required style={styles.input} />

          <label>Preferred Pickup Time</label>
          <input type="datetime-local" name="pickupTime" value={form.pickupTime} onChange={handleChange} required style={styles.input} />

          <label>Area</label>
          <select name="area" value={form.area} onChange={handleChange} required style={styles.select}>
            <option value="Banani">Banani</option>
            <option value="Gulshan">Gulshan</option>
            <option value="Dhanmondi">Dhanmondi</option>
            <option value="Uttara">Uttara</option>
            <option value="Mirpur">Mirpur</option>
            <option value="Mohammadpur">Mohammadpur</option>
          </select>

          <button type="submit" style={styles.button} disabled={loading}>{loading ? "Adding..." : "Add Food"}</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f4f6f9", padding: "20px" },
  card: { width: "400px", padding: "30px", background: "#fff", borderRadius: "14px", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "12px", fontSize: "15px", borderRadius: "8px", border: "1px solid #ccc" },
  select: { padding: "12px", fontSize: "15px", borderRadius: "8px", border: "1px solid #ccc", backgroundColor: "#fff" },
  button: { padding: "12px", borderRadius: "8px", border: "none", background: "#28a745", color: "#fff", cursor: "pointer", fontSize: "16px", fontWeight: "bold", marginTop: "10px" },
  error: { color: "red", textAlign: "center" },
  success: { color: "green", textAlign: "center" },
};
