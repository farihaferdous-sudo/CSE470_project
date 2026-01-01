// import React from 'react'

// const FoodDetailPage = () => {
//   return (
//     <div>FoodDetailPage</div>
//   )
// }

// export default FoodDetailPage

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FoodDetailPage = () => {
  const { id } = useParams();  // Step 1: Get the ID from URL
  const [food, setFood] = useState(null);

  useEffect(() => {
    // Step 2: Fetch food data from backend using the ID
    axios
      .get(`http://localhost:5001/api/foods/${id}`)
      .then((res) => setFood(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!food) return <p>Loading...</p>; // Step 3: Show loading while fetching

  return (
    <div style={{ padding: "20px" }}>
      <h1>{food.foodType}</h1>
      <p><strong>Quantity:</strong> {food.quantity}</p>
      <p><strong>Pickup Location:</strong> {food.pickupLocation}</p>
      <p><strong>Prepared At:</strong> {new Date(food.preparedAt).toLocaleString()}</p>
      <p><strong>Max Safe Hours:</strong> {food.maxSafeHours}</p>
      <p><strong>Status:</strong> {food.status}</p>
      <p><strong>Remaining Safe Time:</strong>{" "}{getRemainingTime(food.preparedAt, food.maxSafeHours)}</p>

    </div>
  );
};

export default FoodDetailPage;
