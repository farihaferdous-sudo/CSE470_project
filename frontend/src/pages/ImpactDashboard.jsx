import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ImpactDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/impact/community/stats")
      .then((res) => {
        console.log("Impact stats:", res.data);
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching impact stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading impact data...
      </div>
    );
  if (!stats)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        No impact data available
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌍 Community Impact Dashboard</h1>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            backgroundColor: "#e8f5e9",
            padding: "20px",
            borderRadius: "8px",
            border: "2px solid #4caf50",
          }}
        >
          <p style={{ margin: "0 0 10px 0", color: "#666" }}>Meals Saved</p>
          <h2 style={{ margin: 0, color: "#2e7d32", fontSize: "2em" }}>
            {stats.totalMealsSaved}
          </h2>
        </div>

        <div
          style={{
            backgroundColor: "#e3f2fd",
            padding: "20px",
            borderRadius: "8px",
            border: "2px solid #2196f3",
          }}
        >
          <p style={{ margin: "0 0 10px 0", color: "#666" }}>Waste Reduced (kg)</p>
          <h2 style={{ margin: 0, color: "#1565c0", fontSize: "2em" }}>
            {stats.totalWasteReduced.toFixed(1)}
          </h2>
        </div>

        <div
          style={{
            backgroundColor: "#fff3e0",
            padding: "20px",
            borderRadius: "8px",
            border: "2px solid #ff9800",
          }}
        >
          <p style={{ margin: "0 0 10px 0", color: "#666" }}>
            Total Donations
          </p>
          <h2 style={{ margin: 0, color: "#e65100", fontSize: "2em" }}>
            {stats.totalDonations}
          </h2>
        </div>

        <div
          style={{
            backgroundColor: "#f3e5f5",
            padding: "20px",
            borderRadius: "8px",
            border: "2px solid #9c27b0",
          }}
        >
          <p style={{ margin: "0 0 10px 0", color: "#666" }}>Active Donors</p>
          <h2 style={{ margin: 0, color: "#6a1b9a", fontSize: "2em" }}>
            {stats.totalDonors}
          </h2>
        </div>
      </div>

      {/* Charts */}
      {stats.monthlyData && stats.monthlyData.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>Monthly Meals Saved</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyData}>
                <CartesianGrid />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mealsSaved"
                  stroke="#4caf50"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>Monthly Waste Reduced</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyData}>
                <CartesianGrid />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="wasteReduced" fill="#2196f3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Donors */}
      {stats.topDonors && stats.topDonors.length > 0 && (
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>🏆 Top Donors</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "10px",
            }}
          >
            {stats.topDonors.map((donor, idx) => (
              <div
                key={donor.donorId}
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: "0 0 5px 0", color: "#666" }}>
                  #{idx + 1} {donor.donorId}
                </p>
                <p style={{ margin: "0", fontSize: "1.2em", fontWeight: "bold" }}>
                  {donor.donations} donations
                </p>
                <p style={{ margin: "5px 0 0 0", color: "#888", fontSize: "0.9em" }}>
                  {donor.mealsSaved} meals saved
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpactDashboard;
