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
  const [user, setUser] = useState(null);
  const [foods, setFoods] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Logged-in user:", parsedUser); // keeps your debug log
      setUser(parsedUser); // only parse once
    }
  }, []);



  useEffect(() => {
    axios
      .get("http://localhost:5001/api/foods")
      .then((res) => {
        console.log("Fetched foods:", res.data);
        setFoods(res.data);
      })
      .catch((err) => console.error(err));
  }, [refreshTrigger]);

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
    <div style={{ padding: "20px" }}>
      {user && (
        <h2 style={{ marginBottom: "10px" }}>
          Welcome, <span style={{ color: "#28a745" }}>{user.username}</span>!
        </h2>
      )}

      <h1>Available Food Donations</h1>

      {foods.length === 0 && <p>No food available right now.</p>}

      {foods.map((food) => {
        //  expired check using STATUS (not isExpired)
        const isExpired = food.status === "expired" || food.isExpired;

        return (
          <div
            key={food._id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "5px",

              //  gray + dim expired cards
              backgroundColor: isExpired ? "#f0f0f0" : "#fff",
              opacity: isExpired ? 0.6 : 1,
              pointerEvents: isExpired ? "none" : "auto" // disables clicks
            }}
          >
            {/* disable link for expired food */}
            {!isExpired ? (
              <Link
                to={`/food/${food._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <h3>{food.foodType}</h3>
                <p><strong>Quantity:</strong> {food.quantity}</p>
                <p><strong>Pickup Location:</strong> {food.pickupLocation}</p>
                <p>
                  <strong>Prepared At:</strong>{" "}
                  {new Date(food.preparedAt).toLocaleString()}
                </p>
                <p>
                  <strong>Safe Time:</strong>{" "}
                  {getRemainingTime(food.preparedAt, food.maxSafeHours)}
                </p>
                <p>
                  <strong>Preferred Pickup Time:</strong>{" "}
                  {new Date(food.pickupTime).toLocaleString()}
                </p>

              </Link>
            ) : (
              <div>
                <h3>{food.foodType}</h3>
                <p><strong>Quantity:</strong> {food.quantity}</p>
                <p><strong>Pickup Location:</strong> {food.pickupLocation}</p>
                <p>
                  <strong>Prepared At:</strong>{" "}
                  {new Date(food.preparedAt).toLocaleString()}
                </p>
                <p><strong>Safe Time:</strong> Expired</p>
              </div>
            )}

            {/*  hide Edit/Delete when expired */}
            {!isExpired && food.status === "available" && (
              <div style={{ marginTop: "5px" }}>
                <Link to={`/edit/${food._id}`}>
                  <button>Edit</button>
                </Link>
                <button
                  onClick={() => handleDelete(food._id)}
                  style={{ marginLeft: "5px" }}
                >
                  Delete
                </button>
                <button
                  onClick={() => handleClaim(food._id, food.donorId)}
                  style={{
                    marginLeft: "5px",
                    backgroundColor: "#4caf50",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  ✓ Claim Food
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HomePage;
