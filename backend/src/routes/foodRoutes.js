import express from "express";
import Food from "../models/Food.js";
import { createFood, getFoodById, getAllFoods } from "../controllers/foodController.js";

console.log("Imported controllers:", { createFood, getFoodById });

const router = express.Router();

router.post("/", createFood);
router.get("/", getAllFoods); 
router.get("/:id", getFoodById);

// Update food listing
router.put("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });

    if (food.status !== "available") {
      return res.status(400).json({ message: "Cannot edit claimed or expired food" });
    }

    // Update fields
    food.foodType = req.body.foodType || food.foodType;
    food.quantity = req.body.quantity || food.quantity;
    food.preparedAt = req.body.preparedAt || food.preparedAt;
    food.maxSafeHours = req.body.maxSafeHours || food.maxSafeHours;
    food.pickupLocation = req.body.pickupLocation || food.pickupLocation;
    food.area = req.body.area || food.area;

    await food.save();
    res.json({ message: "Food updated successfully", food });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete food listing
router.delete("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });

    if (food.status !== "available") {
      return res.status(400).json({ message: "Cannot delete claimed or expired food" });
    }

    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
