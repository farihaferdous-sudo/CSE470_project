import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [preparedAt, setPreparedAt] = useState("");
  const [maxSafeHours, setMaxSafeHours] = useState(6);
  const [pickupLocation, setPickupLocation] = useState("");
  const [area, setArea] = useState("Banani");

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/foods/${id}`)
      .then((res) => {
        const f = res.data;
        setFoodType(f.foodType);
        setQuantity(f.quantity);
        setPreparedAt(new Date(f.preparedAt).toISOString().slice(0, 16));
        setMaxSafeHours(f.maxSafeHours);
        setPickupLocation(f.pickupLocation);
        setArea(f.area);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/foods/${id}`, {
        foodType,
        quantity,
        preparedAt,
        maxSafeHours,
        pickupLocation,
        area,
      });
      alert("Food updated successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error updating food");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Food Donation</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Food Type" value={foodType} onChange={(e) => setFoodType(e.target.value)} required />
        <br />
        <input type="text" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        <br />
        <input type="datetime-local" placeholder="Prepared At" value={preparedAt} onChange={(e) => setPreparedAt(e.target.value)} required />
        <br />
        <input type="number" placeholder="Max Safe Hours" value={maxSafeHours} onChange={(e) => setMaxSafeHours(e.target.value)} required />
        <br />
        <input type="text" placeholder="Pickup Location" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required />
        <br />
        <select value={area} onChange={(e) => setArea(e.target.value)} required>
          <option value="Banani">Banani</option>
          <option value="Gulshan">Gulshan</option>
          <option value="Dhanmondi">Dhanmondi</option>
          <option value="Uttara">Uttara</option>
          <option value="Mirpur">Mirpur</option>
          <option value="Mohammadpur">Mohammadpur</option>
        </select>
        <br />
        <button type="submit">Update Food</button>
      </form>
    </div>
  );
};

export default EditPage;
