import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get logged-in user from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Fetch impact data for the logged-in user
    const userId = userData._id || userData.id;
    axios
      .get(`http://localhost:5001/api/impact/donor/${userId}`)
      .then((res) => {
        console.log("User impact:", res.data);
        setImpact(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user impact:", err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading profile...
      </div>
    );
  if (!impact)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        No profile data found
      </div>
    );

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          paddingBottom: "20px",
          borderBottom: "3px solid #4caf50",
        }}
      >
        <h1 style={{ margin: 0 }}>👤 My Profile</h1>
      </div>

      {/* User Info Display */}
      <div
        style={{
          backgroundColor: "#e8f5e9",
          padding: "15px 20px",
          borderRadius: "8px",
          marginBottom: "25px",
          border: "2px solid #4caf50",
        }}
      >
        <p style={{ margin: 0, color: "#333" }}>
          <strong>Active User:</strong>{" "}
          <span style={{ fontSize: "1.1em", color: "#2e7d32" }}>
            {user?.username || "User"}
          </span>
        </p>
        <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "0.95em" }}>
          {user?.email}
        </p>
      </div>

      {/* Personal Stats */}
      <div style={{ marginBottom: "30px" }}>
        <h2
          style={{
            color: "#333",
            borderBottom: "2px solid #4caf50",
            paddingBottom: "10px",
            marginBottom: "20px",
          }}
        >
          📊 Your Contribution Stats
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#e8f5e9",
              padding: "25px",
              borderRadius: "8px",
              border: "3px solid #4caf50",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ margin: "0 0 12px 0", color: "#666", fontSize: "0.95em" }}>
              🍽️ Food Donated
            </p>
            <h2 style={{ margin: 0, color: "#2e7d32", fontSize: "2.5em" }}>
              {impact.totalFoodDonated}
            </h2>
            <p style={{ margin: "8px 0 0 0", color: "#999", fontSize: "0.85em" }}>
              items
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#e3f2fd",
              padding: "25px",
              borderRadius: "8px",
              border: "3px solid #2196f3",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ margin: "0 0 12px 0", color: "#666", fontSize: "0.95em" }}>
              ✅ Meals Saved
            </p>
            <h2 style={{ margin: 0, color: "#1565c0", fontSize: "2.5em" }}>
              {impact.mealsSaved}
            </h2>
            <p style={{ margin: "8px 0 0 0", color: "#999", fontSize: "0.85em" }}>
              rescued
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#fff3e0",
              padding: "25px",
              borderRadius: "8px",
              border: "3px solid #ff9800",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ margin: "0 0 12px 0", color: "#666", fontSize: "0.95em" }}>
              🌍 Waste Reduced
            </p>
            <h2 style={{ margin: 0, color: "#e65100", fontSize: "2.5em" }}>
              {impact.wasteReduced.toFixed(1)}
            </h2>
            <p style={{ margin: "8px 0 0 0", color: "#999", fontSize: "0.85em" }}>
              kg prevented
            </p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div style={{ marginBottom: "30px" }}>
        <h2
          style={{
            color: "#333",
            borderBottom: "2px solid #ff9800",
            paddingBottom: "10px",
            marginBottom: "20px",
          }}
        >
          🎖️ Badges & Recognition ({impact.badges.length})
        </h2>
        {impact.badges.length === 0 ? (
          <div
            style={{
              backgroundColor: "#fff3e0",
              padding: "25px",
              borderRadius: "8px",
              border: "2px dashed #ff9800",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#e65100", fontSize: "1.1em", margin: 0 }}>
              🏅 No badges earned yet
            </p>
            <p style={{ color: "#999", margin: "10px 0 0 0" }}>
              Keep donating and claiming food to earn badges!
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "15px",
            }}
          >
            {impact.badges.map((badge) => (
              <div
                key={badge.badgeId}
                style={{
                  backgroundColor: "#fff3e0",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "2px solid #ff9800",
                  textAlign: "center",
                  boxShadow: "0 3px 10px rgba(255,152,0,0.2)",
                  transition: "transform 0.2s",
                }}
              >
                <div style={{ fontSize: "3.5em", marginBottom: "12px" }}>
                  {badge.badgeId === "first_donor" && "🎉"}
                  {badge.badgeId === "generous_soul" && "❤️"}
                  {badge.badgeId === "meals_hero" && "🦸"}
                  {badge.badgeId === "eco_warrior" && "🌍"}
                  {badge.badgeId === "consistent_giver" && "📅"}
                </div>
                <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                  {badge.title}
                </h4>
                <p style={{ margin: "0 0 10px 0", fontSize: "0.8em", color: "#666" }}>
                  {badge.description}
                </p>
                <p
                  style={{
                    margin: "0",
                    fontSize: "0.75em",
                    color: "#999",
                    borderTop: "1px solid #ffe0b2",
                    paddingTop: "8px",
                  }}
                >
                  Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Activity */}
      {impact.monthlyStats && impact.monthlyStats.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2
            style={{
              color: "#333",
              borderBottom: "2px solid #2196f3",
              paddingBottom: "10px",
              marginBottom: "20px",
            }}
          >
            📅 Monthly Activity
          </h2>
          <div
            style={{
              overflowX: "auto",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "8px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#fff",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#2196f3" }}>
                  <th
                    style={{
                      padding: "15px",
                      textAlign: "left",
                      color: "white",
                      fontWeight: "bold",
                      borderBottom: "3px solid #1976d2",
                    }}
                  >
                    📆 Month
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                      borderBottom: "3px solid #1976d2",
                    }}
                  >
                    🍽️ Donations
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                      borderBottom: "3px solid #1976d2",
                    }}
                  >
                    ✅ Meals Saved
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                      borderBottom: "3px solid #1976d2",
                    }}
                  >
                    🌍 Waste Reduced (kg)
                  </th>
                </tr>
              </thead>
              <tbody>
                {impact.monthlyStats.map((stat, idx) => (
                  <tr
                    key={stat.month}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    <td
                      style={{
                        padding: "15px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {stat.month}
                    </td>
                    <td
                      style={{
                        padding: "15px",
                        textAlign: "center",
                        color: "#4caf50",
                        fontWeight: "bold",
                      }}
                    >
                      {stat.foodDonated}
                    </td>
                    <td
                      style={{
                        padding: "15px",
                        textAlign: "center",
                        color: "#2196f3",
                        fontWeight: "bold",
                      }}
                    >
                      {stat.mealsSaved}
                    </td>
                    <td
                      style={{
                        padding: "15px",
                        textAlign: "center",
                        color: "#ff9800",
                        fontWeight: "bold",
                      }}
                    >
                      {stat.wasteReduced.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
