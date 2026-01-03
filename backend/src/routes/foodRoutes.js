import express from "express";
import Food from "../models/Food.js";
import { createFood, getFoodById, getAllFoods, claimFood  } from "../controllers/foodController.js";
import { updateImpactOnDonate, updateImpactOnClaim } from "../controllers/impactController.js";

console.log("Imported controllers:", { createFood, getFoodById });

const router = express.Router();

router.post("/", createFood);
router.get("/", getAllFoods); 
router.get("/:id", getFoodById);

router.patch("/:id/claim", claimFood);

// router.get("/my-donations/:donorId", getFoodsByDonor);

router.post("/", async (req, res) => {
  try {
    // Sanitize donorId
    const donorId = req.body.donorId ? req.body.donorId.trim().toLowerCase() : null;
    
    const food = new Food({
      donorId: donorId,
      foodType: req.body.foodType,
      quantity: req.body.quantity,
      preparedAt: req.body.preparedAt,
      maxSafeHours: req.body.maxSafeHours,
      pickupLocation: req.body.pickupLocation,
      pickupTime: req.body.pickupTime,
      area: req.body.area
    });

    await food.save();
    
    // Track impact after food is saved
    if (donorId) {
      await updateImpactOnDonate(donorId);
      console.log(`Impact updated for donor: ${donorId}`);
    }
    
    res.status(201).json(food);
  } catch (error) {
    console.error("Create food error:", error);
    res.status(500).json({ message: error.message });
  }
});
router.get("/", getAllFoods); 
router.get("/:id", getFoodById);

// Claim food (mark as claimed)
router.patch("/:id/claim", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });

    if (food.status !== "available") {
      return res.status(400).json({ message: "Food is not available" });
    }

    // Track impact - sanitize donorId from food record FIRST
    const sanitizedDonorId = food.donorId ? food.donorId.trim().toLowerCase() : null;
    
    food.status = "claimed";
    food.donorId = sanitizedDonorId; // Normalize donorId in food record
    const recipientId = req.body.recipientId;
    
    // Parse quantity - extract number from strings like "5 plates" or just "5"
    let mealQuantity = 1;
    if (food.quantity) {
      const match = food.quantity.match(/(\d+)/);
      mealQuantity = match ? parseInt(match[1]) : 1;
    }
    const wasteEstimate = mealQuantity * 0.25;
    
    console.log(`Claiming food: quantity=${mealQuantity}, waste=${wasteEstimate}, donorId=${sanitizedDonorId}`);
    
    await updateImpactOnClaim(sanitizedDonorId, mealQuantity, wasteEstimate);

    await food.save();
    res.json({ message: "Food claimed successfully", food });
  } catch (error) {
    console.error("Claim food error:", error);
    res.status(500).json({ message: error.message });
  }
});

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
