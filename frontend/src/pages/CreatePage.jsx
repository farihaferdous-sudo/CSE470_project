// import React from 'react'

// const CreatePage = () => {
//   return (
//     <div>CreatePage</div>
//   )
// }

// export default CreatePage

import { useState } from "react";
import axios from "axios";

const CreatePage = () => {
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [preparedAt, setPreparedAt] = useState("");
  const [maxSafeHours, setMaxSafeHours] = useState(6);
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [area, setArea] = useState("Banani");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const donorId = localStorage.getItem("donorId") || "donor1";
      const res = await axios.post("http://localhost:5001/api/foods", {
        donorId: donorId,
        foodType,
        quantity,
        preparedAt,
        maxSafeHours,
        pickupLocation,
        pickupTime,
        area
      });
      alert("Food added successfully!");

      // Reset form
      setFoodType("");
      setQuantity("");
      setPreparedAt("");
      setMaxSafeHours(6);
      setPickupLocation("");
      setPickupTime("");
      setArea("Banani");

    } catch (err) {
      console.error(err);
      alert("Error adding food");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Food Donation</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Food Type"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <br />
        <input
          type="datetime-local"
          placeholder="Prepared At"
          value={preparedAt}
          onChange={(e) => setPreparedAt(e.target.value)}
          required
        />
        <br />
        <input
          type="number"
          placeholder="Max Safe Hours"
          value={maxSafeHours}
          onChange={(e) => setMaxSafeHours(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          required
        />
        <br />
        <input
          type="datetime-local"
          placeholder="Preferred Pickup Time"
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
          required
        />
        <br />

        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
        >
          <option value="Banani">Banani</option>
          <option value="Gulshan">Gulshan</option>
          <option value="Dhanmondi">Dhanmondi</option>
          <option value="Uttara">Uttara</option>
          <option value="Mirpur">Mirpur</option>
          <option value="Mohammadpur">Mohammadpur</option>
        </select>
        <br />

        <button type="submit">Add Food</button>
      </form>
    </div>
  );
};

export default CreatePage;
