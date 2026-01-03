import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyDonationPage = () => {
  const [user, setUser] = useState(null);
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user safely
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed.user ? parsed.user : parsed);
    }
  }, []);

  // Fetch foods and filter by donorId
  useEffect(() => {
    const fetchMyDonations = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/foods");

        if (!user?._id) {
          setMyDonations([]);
          setLoading(false);
          return;
        }

        const filtered = res.data.filter(
          (food) =>
            food.donorId &&
            food.donorId.trim().toLowerCase() === user._id.trim().toLowerCase()
        );

        setMyDonations(filtered);
      } catch (err) {
        console.error("Error fetching donations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyDonations();
  }, [user]);

  // ✅ Delete donation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/foods/${id}`);
      setMyDonations(myDonations.filter((food) => food._id !== id));
      alert("Donation deleted successfully!");
    } catch (err) {
      console.error("Error deleting donation:", err);
      alert("Error deleting donation");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Donations</h1>

      {!user && <p>Please login first to view your donations.</p>}

      {loading && user && <p>Loading donations...</p>}

      {!loading && user && myDonations.length === 0 && (
        <p>You have not donated any food yet.</p>
      )}

      {!loading &&
        user &&
        myDonations.map((food) => {
          const isExpired = food.status === "expired" || food.isExpired;

          return (
            <div
              key={food._id}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "5px",
                backgroundColor: isExpired ? "#f0f0f0" : "#fff",
                opacity: isExpired ? 0.6 : 1,
              }}
            >
              <h3>{food.foodType}</h3>
              <p>
                <strong>Quantity:</strong> {food.quantity}
              </p>
              <p>
                <strong>Pickup Location:</strong> {food.pickupLocation}
              </p>
              <p>
                <strong>Prepared At:</strong>{" "}
                {new Date(food.preparedAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {food.status}
              </p>

              {/* ✅ Edit + Delete options enabled */}
              {!isExpired && (
                <div style={{ marginTop: "8px" }}>
                  <Link to={`/edit/${food._id}`}>
                    <button>Edit</button>
                  </Link>

                  <button
                    onClick={() => handleDelete(food._id)}
                    style={{ marginLeft: "6px" }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default MyDonationPage;
