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
