// // import { useState } from "react";
// // import axios from "axios";

// // export default function CreatePage() {
// //   const [form, setForm] = useState({
// //     foodType: "",
// //     quantity: "",
// //     preparedAt: "",
// //     maxSafeHours: 6,
// //     pickupLocation: "",
// //     pickupTime: "",
// //     area: "Banani",
// //   });
// //   const [msg, setMsg] = useState({ type: "", text: "" });
// //   const [loading, setLoading] = useState(false);

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //     setMsg({ type: "", text: "" });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     try {
// //       const donorId = JSON.parse(localStorage.getItem("user"))?.user?._id || "donor1";
// //       await axios.post("http://localhost:5001/api/foods", {
// //         donorId,
// //         ...form,
// //       });

// //       setMsg({ type: "success", text: "Food added successfully!" });

// //       // Reset form
// //       setForm({
// //         foodType: "",
// //         quantity: "",
// //         preparedAt: "",
// //         maxSafeHours: 6,
// //         pickupLocation: "",
// //         pickupTime: "",
// //         area: "Banani",
// //       });
// //     } catch (err) {
// //       console.error(err);
// //       setMsg({ type: "error", text: "Error adding food" });
// //     }

// //     setLoading(false);
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <div style={styles.card}>
// //         <h2 style={styles.title}>Add Food Donation</h2>

// //         {msg.text && (
// //           <p style={msg.type === "error" ? styles.error : styles.success}>
// //             {msg.text}
// //           </p>
// //         )}

// //         <form onSubmit={handleSubmit} style={styles.form}>
// //           <label>Food Type</label>
// //           <input
// //             type="text"
// //             name="foodType"
// //             placeholder="e.g., Rice, Sandwich"
// //             value={form.foodType}
// //             onChange={handleChange}
// //             required
// //             style={styles.input}
// //           />

// //           <label>Quantity</label>
// //           <input
// //             type="number"
// //             name="quantity"
// //             placeholder="Number of servings"
// //             value={form.quantity}
// //             onChange={handleChange}
// //             required
// //             style={styles.input}
// //           />

// //           <label>Prepared At</label>
// //           <input
// //             type="datetime-local"
// //             name="preparedAt"
// //             value={form.preparedAt}
// //             onChange={handleChange}
// //             required
// //             style={styles.input}
// //           />

// //           <label>Max Safe Hours</label>
// //           <input
// //             type="number"
// //             name="maxSafeHours"
// //             value={form.maxSafeHours}
// //             onChange={handleChange}
// //             required
// //             style={styles.input}
// //           />

// //           <label>Pickup Location</label>
// //           <input
// //             type="text"
// //             name="pickupLocation"
// //             placeholder="Exact address or landmark"
// //             value={form.pickupLocation}
// //             onChange={handleChange}
// //             required
// //             style={styles.input}
// //           />

// //           <label>Preferred Pickup Time</label>
// //           <input
// //             type="datetime-local"
// //             name="pickupTime"
// //             value={form.pickupTime}
// //             onChange={handleChange}
// //             required
// //             style={styles.input}
// //           />

// //           <label>Area</label>
// //           <select
// //             name="area"
// //             value={form.area}
// //             onChange={handleChange}
// //             required
// //             style={styles.select}
// //           >
// //             <option value="Banani">Banani</option>
// //             <option value="Gulshan">Gulshan</option>
// //             <option value="Dhanmondi">Dhanmondi</option>
// //             <option value="Uttara">Uttara</option>
// //             <option value="Mirpur">Mirpur</option>
// //             <option value="Mohammadpur">Mohammadpur</option>
// //           </select>

// //           <button type="submit" style={styles.button} disabled={loading}>
// //             {loading ? "Adding..." : "Add Food"}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // const styles = {
// //   container: {
// //     minHeight: "100vh",
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     background: "#f4f6f9",
// //     padding: "20px",
// //   },
// //   card: {
// //     width: "400px",
// //     padding: "30px",
// //     background: "#fff",
// //     borderRadius: "14px",
// //     boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
// //   },
// //   title: { textAlign: "center", marginBottom: "20px" },
// //   form: { display: "flex", flexDirection: "column", gap: "12px" },
// //   input: {
// //     padding: "12px",
// //     fontSize: "15px",
// //     borderRadius: "8px",
// //     border: "1px solid #ccc",
// //   },
// //   select: {
// //     padding: "12px",
// //     fontSize: "15px",
// //     borderRadius: "8px",
// //     border: "1px solid #ccc",
// //     backgroundColor: "#fff",
// //   },
// //   button: {
// //     padding: "12px",
// //     borderRadius: "8px",
// //     border: "none",
// //     background: "#28a745",
// //     color: "#fff",
// //     cursor: "pointer",
// //     fontSize: "16px",
// //     fontWeight: "bold",
// //     marginTop: "10px",
// //   },
// //   error: { color: "red", textAlign: "center" },
// //   success: { color: "green", textAlign: "center" },
// // };


// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function CreatePage() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [form, setForm] = useState({
//     foodType: "",
//     category: "cooked",
//     quantity: "",
//     preparedAt: "",
//     maxSafeHours: 6,
//     pickupLocation: "",
//     pickupTime: "",
//     area: "Banani",
//   });
//   const [msg, setMsg] = useState({ type: "", text: "" });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       setUser(parsedUser);
//       if (parsedUser.role !== "donor") {
//         alert("Only donors can access this page");
//         navigate("/");
//       }
//     }
//   }, [navigate]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setMsg({ type: "", text: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
// <<<<<<< HEAD
//       await axios.post("http://localhost:5001/api/foods", {
//         donorId: user._id,
//         ...form,
//       });
//       setMsg({ type: "success", text: "Food added successfully!" });
//       setForm({ foodType: "", category: "cooked", quantity: "", preparedAt: "", maxSafeHours: 6, pickupLocation: "", pickupTime: "", area: "Banani" });

//       // Reset form
//       setFoodType("");
//       setQuantity("");
//       setCategory("cooked");
//       setPreparedAt("");
//       setMaxSafeHours(6);
//       setPickupLocation("");
//       setPickupTime("");
//       setArea("Banani");
// =======
//       const donorId = localStorage.getItem("donorId") || "donor1";
//       const res = await axios.post("http://localhost:5001/api/foods", {
//         donorId: donorId,
//         foodType,
//         quantity,
//         category, // Send category
//         preparedAt,
//         maxSafeHours,
//         pickupLocation,
//         pickupTime,
//         area
//       });
//       alert("Food added successfully!");

//       // Reset form
//       setFoodType("");
//       setQuantity("");
//       setCategory("cooked");
//       setPreparedAt("");
//       setMaxSafeHours(6);
//       setPickupLocation("");
//       setPickupTime("");
//       setArea("Banani");

// >>>>>>> aeefc2bf96c33fd0d41c26284917928cf106edd6
//     } catch (err) {
//       console.error(err);
//       setMsg({ type: "error", text: "Error adding food" });
//     }

//     setLoading(false);
//   };

//   return (
// <<<<<<< HEAD
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h2 style={styles.title}>Add Food Donation</h2>
//         {msg.text && <p style={msg.type === "error" ? styles.error : styles.success}>{msg.text}</p>}
// =======
//     <div style={{ padding: "20px" }}>
//       <h1>Add Food Donation</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Food Type"
//           value={foodType}
//           onChange={(e) => setFoodType(e.target.value)}
//           required
//         />
//         <br />
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           required
//         >
//           <option value="cooked">Cooked</option>
//           <option value="uncooked">Uncooked</option>
//           <option value="packaged">Packaged</option>
//         </select>
//         <br />
//         <input
//           type="text"
//           placeholder="Quantity"
//           value={quantity}
//           onChange={(e) => setQuantity(e.target.value)}
//           required
//         />
//         <br />
//         <input
//           type="datetime-local"
//           placeholder="Prepared At"
//           value={preparedAt}
//           onChange={(e) => setPreparedAt(e.target.value)}
//           required
//         />
//         <br />
//         <input
//           type="number"
//           placeholder="Max Safe Hours"
//           value={maxSafeHours}
//           onChange={(e) => setMaxSafeHours(e.target.value)}
//           required
//         />
//         <br />
//         <input
//           type="text"
//           placeholder="Pickup Location"
//           value={pickupLocation}
//           onChange={(e) => setPickupLocation(e.target.value)}
//           required
//         />
//         <br />
//         <input
//           type="datetime-local"
//           placeholder="Preferred Pickup Time"
//           value={pickupTime}
//           onChange={(e) => setPickupTime(e.target.value)}
//           required
//         />
//         <br />
// >>>>>>> aeefc2bf96c33fd0d41c26284917928cf106edd6

//         <form onSubmit={handleSubmit} style={styles.form}>
//           <label>Food Type</label>
//           <input type="text" name="foodType" value={form.foodType} onChange={handleChange} placeholder="e.g., Rice" required style={styles.input} />

//           <label>Quantity</label>
//           <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Number of servings" required style={styles.input} />

//           <label>Prepared At</label>
//           <input type="datetime-local" name="preparedAt" value={form.preparedAt} onChange={handleChange} required style={styles.input} />

//           <label>Max Safe Hours</label>
//           <input type="number" name="maxSafeHours" value={form.maxSafeHours} onChange={handleChange} required style={styles.input} />

//           <label>Pickup Location</label>
//           <input type="text" name="pickupLocation" value={form.pickupLocation} onChange={handleChange} placeholder="Exact address or landmark" required style={styles.input} />

//           <label>Preferred Pickup Time</label>
//           <input type="datetime-local" name="pickupTime" value={form.pickupTime} onChange={handleChange} required style={styles.input} />

//           <label>Area</label>
//           <select name="area" value={form.area} onChange={handleChange} required style={styles.select}>
//             <option value="Banani">Banani</option>
//             <option value="Gulshan">Gulshan</option>
//             <option value="Dhanmondi">Dhanmondi</option>
//             <option value="Uttara">Uttara</option>
//             <option value="Mirpur">Mirpur</option>
//             <option value="Mohammadpur">Mohammadpur</option>
//           </select>

//           <button type="submit" style={styles.button} disabled={loading}>{loading ? "Adding..." : "Add Food"}</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f4f6f9", padding: "20px" },
//   card: { width: "400px", padding: "30px", background: "#fff", borderRadius: "14px", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" },
//   title: { textAlign: "center", marginBottom: "20px" },
//   form: { display: "flex", flexDirection: "column", gap: "12px" },
//   input: { padding: "12px", fontSize: "15px", borderRadius: "8px", border: "1px solid #ccc" },
//   select: { padding: "12px", fontSize: "15px", borderRadius: "8px", border: "1px solid #ccc", backgroundColor: "#fff" },
//   button: { padding: "12px", borderRadius: "8px", border: "none", background: "#28a745", color: "#fff", cursor: "pointer", fontSize: "16px", fontWeight: "bold", marginTop: "10px" },
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
    category: "cooked",       
    quantity: "",
    preparedAt: "",
    maxSafeHours: 6,
    pickupLocation: "",
    pickupTime: "",
    area: "Banani",
  });

  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  //  Only donors can access this page
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "donor") {
      alert("Only donors can add food donations");
      navigate("/");
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  //  Unified form handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg({ type: "", text: "" });
  };

  //  Submit food donation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5001/api/foods", {
        donorId: user._id,     //  REAL donor ID
        ...form,              //  includes category
      });

      setMsg({ type: "success", text: "Food added successfully!" });

      // Reset form
      setForm({
        foodType: "",
        category: "cooked",
        quantity: "",
        preparedAt: "",
        maxSafeHours: 6,
        pickupLocation: "",
        pickupTime: "",
        area: "Banani",
      });
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "Error adding food donation" });
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add Food Donation</h2>

        {msg.text && (
          <p style={msg.type === "error" ? styles.error : styles.success}>
            {msg.text}
          </p>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Food Type</label>
          <input
            type="text"
            name="foodType"
            value={form.foodType}
            onChange={handleChange}
            placeholder="e.g., Rice"
            required
            style={styles.input}
          />

          {/*  CATEGORY — REQUIRED FEATURE */}
          <label>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="cooked">Cooked</option>
            <option value="uncooked">Uncooked</option>
            <option value="packaged">Packaged</option>
          </select>

          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Number of servings"
            required
            style={styles.input}
          />

          <label>Prepared At</label>
          <input
            type="datetime-local"
            name="preparedAt"
            value={form.preparedAt}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label>Max Safe Hours</label>
          <input
            type="number"
            name="maxSafeHours"
            value={form.maxSafeHours}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label>Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            value={form.pickupLocation}
            onChange={handleChange}
            placeholder="Exact address or landmark"
            required
            style={styles.input}
          />

          <label>Preferred Pickup Time</label>
          <input
            type="datetime-local"
            name="pickupTime"
            value={form.pickupTime}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label>Area</label>
          <select
            name="area"
            value={form.area}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="Banani">Banani</option>
            <option value="Gulshan">Gulshan</option>
            <option value="Dhanmondi">Dhanmondi</option>
            <option value="Uttara">Uttara</option>
            <option value="Mirpur">Mirpur</option>
            <option value="Mohammadpur">Mohammadpur</option>
          </select>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Adding..." : "Add Food"}
          </button>
        </form>
      </div>
    </div>
  );
}

//  Styles
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9",
    padding: "20px",
  },
  card: {
    width: "400px",
    padding: "30px",
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },
  title: { textAlign: "center", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    padding: "12px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  select: {
    padding: "12px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#28a745",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  error: { color: "red", textAlign: "center" },
  success: { color: "green", textAlign: "center" },
};
