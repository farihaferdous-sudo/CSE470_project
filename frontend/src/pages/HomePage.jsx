import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
  const [foods, setFoods] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sortBy, setSortBy] = useState("freshness");
  const [filterCategory, setFilterCategory] = useState("all");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchFoods = async () => {
      let url = `http://localhost:5001/api/foods?sortBy=${sortBy}`;
      if (filterCategory !== "all") {
        url += `&category=${filterCategory}`;
      }
      if (userLocation) {
        url += `&lat=${userLocation.lat}&lng=${userLocation.lng}`;
      }

      try {
        const res = await axios.get(url);
        console.log("Fetched foods:", res.data);
        setFoods(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFoods();
  }, [refreshTrigger, sortBy, filterCategory, userLocation]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);

    if (value === "distance" && !userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            alert("Could not access location. Defaulting to Dhaka center.");
            setUserLocation({ lat: 23.8103, lng: 90.4125 });
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/foods/${id}`);
      setFoods(foods.filter((f) => f._id !== id));
      alert("Food deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting food");
    }
  };

  const handleClaim = async (id, donorId) => {
    try {
      await axios.patch(`http://localhost:5001/api/foods/${id}/claim`, {
        recipientId: localStorage.getItem("donorId") || "recipient1"
      });
      alert("Food claimed successfully! The donation will now count towards the donor's impact.");
      setRefreshTrigger(refreshTrigger + 1);
    } catch (err) {
      console.error("Error claiming food:", err);
      alert("Error claiming food: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
        <h1 style={{ fontSize: "2rem", color: "#2c3e50", fontWeight: "700", margin: 0 }}>Available Food Donations</h1>
        
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ fontWeight: "600", color: "#555" }}>Filter:</label>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)} 
              className="control-select"
            >
              <option value="all">All Categories</option>
              <option value="cooked">Cooked</option>
              <option value="uncooked">Uncooked</option>
              <option value="packaged">Packaged</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ fontWeight: "600", color: "#555" }}>Sort By:</label>
            <select 
              value={sortBy} 
              onChange={handleSortChange} 
              className="control-select"
            >
              <option value="freshness">Freshness (Newest)</option>
              <option value="distance">Distance (Nearest)</option>
            </select>
          </div>
        </div>
      </div>

      {foods.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px", color: "#888", background: "#fff", borderRadius: "12px", border: "1px dashed #ccc" }}>
          <h2>No food donations found matching your criteria.</h2>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
        {foods.map((food) => {
          const isExpired = food.status === "expired" || food.isExpired;

          return (
            <div
              key={food._id}
              className="card"
              style={{
                backgroundColor: isExpired ? "#f8f9fa" : "#fff",
                opacity: isExpired ? 0.75 : 1,
                position: "relative"
              }}
            >
              {isExpired && (
                <div style={{
                  position: "absolute", top: "12px", right: "12px", 
                  background: "#e74c3c", color: "white", padding: "4px 10px", 
                  borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold", zIndex: 10,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}>
                  EXPIRED
                </div>
              )}

              <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                  <span className={`tag ${food.category === 'cooked' ? 'tag-green' : 'tag'}`} 
                        style={{ background: food.category !== 'cooked' ? '#f0f0f0' : undefined }}>
                    {food.category || "General"}
                  </span>
                  {food.distance !== null && food.distance !== undefined && (
                     <span style={{ fontSize: "0.9rem", color: "#2980b9", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                       📍 {food.distance.toFixed(1)} km
                     </span>
                  )}
                </div>

                {!isExpired ? (
                  <Link
                    to={`/food/${food._id}`}
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                  >
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "1.35rem", color: "#2c3e50", fontWeight: "700", lineHeight: "1.3" }}>
                      {food.foodType}
                    </h3>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: "#636e72", fontSize: "0.95rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                         <span style={{ fontSize: "1.1rem" }}>📦</span> 
                         <span><strong>Qty:</strong> {food.quantity}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                         <span style={{ fontSize: "1.1rem" }}>📍</span> 
                         <span>{food.pickupLocation}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                         <span style={{ fontSize: "1.1rem" }}>⏰</span> 
                         <span>{new Date(food.pickupTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#d35400", fontWeight: "600", marginTop: "4px" }}>
                         <span style={{ fontSize: "1.1rem" }}>⏳</span> 
                         <span>{getRemainingTime(food.preparedAt, food.maxSafeHours)}</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div>
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "1.35rem", color: "#95a5a6", textDecoration: "line-through" }}>{food.foodType}</h3>
                    <p style={{ color: "#95a5a6", fontStyle: "italic" }}>This item is no longer available.</p>
                  </div>
                )}
              </div>

              {!isExpired && food.status === "available" && (
                <div style={{ 
                  padding: "16px 24px", 
                  background: "#f8fdfa", 
                  borderTop: "1px solid #eef2f5", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center"
                }}>
                   <div style={{ display: "flex", gap: "8px" }}>
                     <Link to={`/edit/${food._id}`}>
                       <button className="btn-outline" style={{ fontSize: "0.85rem", padding: "6px 12px" }}>Edit</button>
                     </Link>
                     <button
                        onClick={() => handleDelete(food._id)}
                        className="btn-outline"
                        style={{ color: "#e74c3c", borderColor: "#fadbd8", fontSize: "0.85rem", padding: "6px 12px" }}
                      >
                        Delete
                      </button>
                   </div>
                   
                   <button
                     onClick={() => handleClaim(food._id, food.donorId)}
                     className="btn-primary"
                     style={{ boxShadow: "0 4px 6px rgba(46, 204, 113, 0.2)" }}
                   >
                     Claim Food
                   </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
