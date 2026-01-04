// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const getRemainingTime = (preparedAt, maxSafeHours) => {
//   const preparedTime = new Date(preparedAt).getTime();
//   const expiryTime = preparedTime + maxSafeHours * 60 * 60 * 1000;
//   const now = Date.now();
//   const diff = expiryTime - now;

//   if (diff <= 0) return "Expired";
//   const hours = Math.floor(diff / (1000 * 60 * 60));
//   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//   return `${hours}h ${minutes}m remaining`;
// };

// const HomePage = () => {
//   const [user, setUser] = useState(null);
//   const [foods, setFoods] = useState([]);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const [sortBy, setSortBy] = useState("freshness");
//   const [filterCategory, setFilterCategory] = useState("all");
//   const [userLocation, setUserLocation] = useState(null);

//   useEffect(() => {
// <<<<<<< HEAD
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   useEffect(() => {
//     axios.get("http://localhost:5001/api/foods")
//       .then(res => setFoods(res.data))
//       .catch(err => console.error(err));
//   }, [refreshTrigger]);
// =======
//     const fetchFoods = async () => {
//       let url = `http://localhost:5001/api/foods?sortBy=${sortBy}`;
//       if (filterCategory !== "all") {
//         url += `&category=${filterCategory}`;
//       }
//       if (userLocation) {
//         url += `&lat=${userLocation.lat}&lng=${userLocation.lng}`;
//       }

//       try {
//         const res = await axios.get(url);
//         console.log("Fetched foods:", res.data);
//         setFoods(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchFoods();
//   }, [refreshTrigger, sortBy, filterCategory, userLocation]);

//   const handleSortChange = (e) => {
//     const value = e.target.value;
//     setSortBy(value);

//     if (value === "distance" && !userLocation) {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             setUserLocation({
//               lat: position.coords.latitude,
//               lng: position.coords.longitude
//             });
//           },
//           (error) => {
//             console.error("Error getting location:", error);
//             alert("Could not access location. Defaulting to Dhaka center.");
//             setUserLocation({ lat: 23.8103, lng: 90.4125 });
//           }
//         );
//       } else {
//         alert("Geolocation is not supported by this browser.");
//       }
//     }
//   };
// >>>>>>> aeefc2bf96c33fd0d41c26284917928cf106edd6

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this listing?")) return;
//     try {
//       await axios.delete(`http://localhost:5001/api/foods/${id}`);
//       setFoods(foods.filter(f => f._id !== id));
//       alert("Food deleted successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Error deleting food");
//     }
//   };

//   const handleClaim = async (id) => {
//     try {
//       await axios.patch(`http://localhost:5001/api/foods/${id}/claim`, {
//         recipientId: user._id
//       });
//       alert("Food claimed successfully!");
//       setRefreshTrigger(refreshTrigger + 1);
//     } catch (err) {
//       console.error(err);
//       alert("Error claiming food: " + (err.response?.data?.message || err.message));
//     }
//   };

//   return (
// <<<<<<< HEAD
//     <div style={{ padding: "20px" }}>
//       {user && (
//         <h2 style={{ marginBottom: "10px" }}>
//           Welcome, <span style={{ color: "#28a745" }}>{user.username}</span>!
//         </h2>
//       )}

//       <h1>Available Food Donations</h1>
//       {foods.length === 0 && <p>No food available right now.</p>}

//       {foods.map(food => {
//         const isExpired = food.status === "expired" || food.isExpired;
//         const isOwner = user?._id === food.donorId;
//         return (
//           <div key={food._id} style={{
//             border: "1px solid #ccc",
//             padding: "12px",
//             marginBottom: "10px",
//             borderRadius: "5px",
//             backgroundColor: isExpired ? "#f0f0f0" : "#fff",
//             opacity: isExpired ? 0.6 : 1,
//             pointerEvents: isExpired ? "none" : "auto"
//           }}>
//             {/* <Link to={!isExpired ? `/food/${food._id}` : "#"} style={{ textDecoration: "none", color: "inherit" }}> */}
//             <h3>{food.foodType}</h3>
//             <p><strong>Quantity:</strong> {food.quantity}</p>
//             <p><strong>Pickup Location:</strong> {food.pickupLocation}</p>
//             <p><strong>Prepared At:</strong> {new Date(food.preparedAt).toLocaleString()}</p>
//             <p><strong>Safe Time:</strong> {isExpired ? "Expired" : getRemainingTime(food.preparedAt, food.maxSafeHours)}</p>
//             <p><strong>Preferred Pickup Time:</strong> {new Date(food.pickupTime).toLocaleString()}</p>
//             {/* </Link> */}

//             {/* Role-based buttons */}
//             {user?.role === "donor" && isOwner && !isExpired && food.status === "available" && (
//               <div style={{ marginTop: "5px" }}>
//                 <Link to={`/edit/${food._id}`}><button>Edit</button></Link>
//                 <button onClick={() => handleDelete(food._id)} style={{ marginLeft: "5px" }}>Delete</button>
//               </div>
//             )}

//             {user?.role === "receiver" && !isExpired && food.status === "available" && (
//               <button onClick={() => handleClaim(food._id)} style={{
//                 marginTop: "5px",
//                 backgroundColor: "#4caf50",
//                 color: "white",
//                 padding: "5px 10px",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer"
//               }}>✓ Claim Food</button>
//             )}
// =======
//     <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
//         <h1 style={{ fontSize: "2rem", color: "#2c3e50", fontWeight: "700", margin: 0 }}>Available Food Donations</h1>
        
//         <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
//            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <label style={{ fontWeight: "600", color: "#555" }}>Filter:</label>
//             <select 
//               value={filterCategory} 
//               onChange={(e) => setFilterCategory(e.target.value)} 
//               className="control-select"
//             >
//               <option value="all">All Categories</option>
//               <option value="cooked">Cooked</option>
//               <option value="uncooked">Uncooked</option>
//               <option value="packaged">Packaged</option>
//             </select>
// >>>>>>> aeefc2bf96c33fd0d41c26284917928cf106edd6
//           </div>

//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <label style={{ fontWeight: "600", color: "#555" }}>Sort By:</label>
//             <select 
//               value={sortBy} 
//               onChange={handleSortChange} 
//               className="control-select"
//             >
//               <option value="freshness">Freshness (Newest)</option>
//               <option value="distance">Distance (Nearest)</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {foods.length === 0 && (
//         <div style={{ textAlign: "center", padding: "50px", color: "#888", background: "#fff", borderRadius: "12px", border: "1px dashed #ccc" }}>
//           <h2>No food donations found matching your criteria.</h2>
//         </div>
//       )}

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
//         {foods.map((food) => {
//           const isExpired = food.status === "expired" || food.isExpired;

//           return (
//             <div
//               key={food._id}
//               className="card"
//               style={{
//                 backgroundColor: isExpired ? "#f8f9fa" : "#fff",
//                 opacity: isExpired ? 0.75 : 1,
//                 position: "relative"
//               }}
//             >
//               {isExpired && (
//                 <div style={{
//                   position: "absolute", top: "12px", right: "12px", 
//                   background: "#e74c3c", color: "white", padding: "4px 10px", 
//                   borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold", zIndex: 10,
//                   boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
//                 }}>
//                   EXPIRED
//                 </div>
//               )}

//               <div style={{ padding: "24px" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
//                   <span className={`tag ${food.category === 'cooked' ? 'tag-green' : 'tag'}`} 
//                         style={{ background: food.category !== 'cooked' ? '#f0f0f0' : undefined }}>
//                     {food.category || "General"}
//                   </span>
//                   {food.distance !== null && food.distance !== undefined && (
//                      <span style={{ fontSize: "0.9rem", color: "#2980b9", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
//                        📍 {food.distance.toFixed(1)} km
//                      </span>
//                   )}
//                 </div>

//                 {!isExpired ? (
//                   <Link
//                     to={`/food/${food._id}`}
//                     style={{ textDecoration: "none", color: "inherit", display: "block" }}
//                   >
//                     <h3 style={{ margin: "0 0 12px 0", fontSize: "1.35rem", color: "#2c3e50", fontWeight: "700", lineHeight: "1.3" }}>
//                       {food.foodType}
//                     </h3>
                    
//                     <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: "#636e72", fontSize: "0.95rem" }}>
//                       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                          <span style={{ fontSize: "1.1rem" }}>📦</span> 
//                          <span><strong>Qty:</strong> {food.quantity}</span>
//                       </div>
//                       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                          <span style={{ fontSize: "1.1rem" }}>📍</span> 
//                          <span>{food.pickupLocation}</span>
//                       </div>
//                       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                          <span style={{ fontSize: "1.1rem" }}>⏰</span> 
//                          <span>{new Date(food.pickupTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
//                       </div>
//                       <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#d35400", fontWeight: "600", marginTop: "4px" }}>
//                          <span style={{ fontSize: "1.1rem" }}>⏳</span> 
//                          <span>{getRemainingTime(food.preparedAt, food.maxSafeHours)}</span>
//                       </div>
//                     </div>
//                   </Link>
//                 ) : (
//                   <div>
//                     <h3 style={{ margin: "0 0 12px 0", fontSize: "1.35rem", color: "#95a5a6", textDecoration: "line-through" }}>{food.foodType}</h3>
//                     <p style={{ color: "#95a5a6", fontStyle: "italic" }}>This item is no longer available.</p>
//                   </div>
//                 )}
//               </div>

//               {!isExpired && food.status === "available" && (
//                 <div style={{ 
//                   padding: "16px 24px", 
//                   background: "#f8fdfa", 
//                   borderTop: "1px solid #eef2f5", 
//                   display: "flex", 
//                   justifyContent: "space-between", 
//                   alignItems: "center"
//                 }}>
//                    <div style={{ display: "flex", gap: "8px" }}>
//                      <Link to={`/edit/${food._id}`}>
//                        <button className="btn-outline" style={{ fontSize: "0.85rem", padding: "6px 12px" }}>Edit</button>
//                      </Link>
//                      <button
//                         onClick={() => handleDelete(food._id)}
//                         className="btn-outline"
//                         style={{ color: "#e74c3c", borderColor: "#fadbd8", fontSize: "0.85rem", padding: "6px 12px" }}
//                       >
//                         Delete
//                       </button>
//                    </div>
                   
//                    <button
//                      onClick={() => handleClaim(food._id, food.donorId)}
//                      className="btn-primary"
//                      style={{ boxShadow: "0 4px 6px rgba(46, 204, 113, 0.2)" }}
//                    >
//                      Claim Food
//                    </button>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default HomePage;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

/* ---------- Utility: Remaining Safe Time ---------- */
const getRemainingTime = (preparedAt, maxSafeHours) => {
  const preparedTime = new Date(preparedAt).getTime();
  const expiryTime = preparedTime + maxSafeHours * 60 * 60 * 1000;
  const now = Date.now();
  const diff = expiryTime - now;

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m remaining`;
};

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [foods, setFoods] = useState([]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sortBy, setSortBy] = useState("freshness");
  const [filterCategory, setFilterCategory] = useState("all");
  const [userLocation, setUserLocation] = useState(null);

  /* ---------- Load logged-in user ---------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ---------- Fetch foods (filter + sort) ---------- */
  useEffect(() => {
    const fetchFoods = async () => {
      let url = `http://localhost:5001/api/foods?sortBy=${sortBy}`;

      if (filterCategory !== "all") {
        url += `&category=${filterCategory}`;
      }

      if (sortBy === "distance" && userLocation) {
        url += `&lat=${userLocation.lat}&lng=${userLocation.lng}`;
      }

      try {
        const res = await axios.get(url);
        setFoods(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFoods();
  }, [refreshTrigger, sortBy, filterCategory, userLocation]);

  /* ---------- Handle sort change ---------- */
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);

    if (value === "distance" && !userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          () => {
            alert("Could not access location. Defaulting to Dhaka.");
            setUserLocation({ lat: 23.8103, lng: 90.4125 });
          }
        );
      }
    }
  };

  /* ---------- Donor delete ---------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this food listing?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/foods/${id}`);
      setFoods((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting food");
    }
  };

  /* ---------- Receiver claim ---------- */
  const handleClaim = async (id) => {
    try {
      await axios.patch(`http://localhost:5001/api/foods/${id}/claim`, {
        recipientId: user._id,
      });
      alert("Food claimed successfully!");
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error claiming food");
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      {/* ---------- Welcome ---------- */}
      {user && (
        <h2 style={{ marginBottom: "10px" }}>
          Welcome, <span style={{ color: "#28a745" }}>{user.username}</span>!
        </h2>
      )}

      {/* ---------- Header + Controls ---------- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <h1>Available Food Donations</h1>

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          {/* Filter */}
          <div>
            <label>Category: </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All</option>
              <option value="cooked">Cooked</option>
              <option value="uncooked">Uncooked</option>
              <option value="packaged">Packaged</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label>Sort By: </label>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="freshness">Freshness</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        </div>
      </div>

      {/* ---------- Empty state ---------- */}
      {foods.length === 0 && <p>No food available right now.</p>}

      {/* ---------- Food Cards ---------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {foods.map((food) => {
          const isExpired =
            food.status === "expired" || food.isExpired === true;
          const isOwner = user?._id === food.donorId;

          return (
            <div
              key={food._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "20px",
                background: isExpired ? "#f5f5f5" : "#fff",
                opacity: isExpired ? 0.6 : 1,
              }}
            >
              {/* Content (NOT clickable) */}
              <h3>{food.foodType}</h3>
              <p><strong>Category:</strong> {food.category}</p>
              <p><strong>Quantity:</strong> {food.quantity}</p>
              <p><strong>Pickup:</strong> {food.pickupLocation}</p>
              <p>
                <strong>Pickup Time:</strong>{" "}
                {new Date(food.pickupTime).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {isExpired
                  ? "Expired"
                  : getRemainingTime(food.preparedAt, food.maxSafeHours)}
              </p>

              {/* ---------- Donor controls ---------- */}
              {user?.role === "donor" &&
                isOwner &&
                !isExpired &&
                food.status === "available" && (
                  <div style={{ marginTop: "10px" }}>
                    <Link to={`/edit/${food._id}`}>
                      <button>Edit</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(food._id)}
                      style={{ marginLeft: "8px" }}
                    >
                      Delete
                    </button>
                  </div>
                )}

              {/* ---------- Receiver controls ---------- */}
              {user?.role === "receiver" &&
                !isExpired &&
                food.status === "available" && (
                  <button
                    onClick={() => handleClaim(food._id)}
                    style={{
                      marginTop: "10px",
                      background: "#28a745",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Claim Food
                  </button>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
