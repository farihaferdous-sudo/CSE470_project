import Food from "../models/Food.js";

// Create food donation
export const createFood = async (req, res) => {
  try {
    const food = new Food({
      donorId: req.body.donorId, // TEMPORARY
      foodType: req.body.foodType,
      quantity: req.body.quantity,
      preparedAt: req.body.preparedAt,
      maxSafeHours: req.body.maxSafeHours,
      pickupLocation: req.body.pickupLocation,
      pickupTime: req.body.pickupTime,
      area: req.body.area
    //   status: "available"
    });

    await food.save();
    res.status(201).json(food);
    // } catch (error) {
    //     res.status(500).json({ message: "Failed to create food listing" });
    // } 
    } catch (error) {
        console.error("Create food error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get single food by ID
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    //Update expired status dynamically for single fetch
    const expiryTime = new Date(food.preparedAt).getTime() + food.maxSafeHours * 60 * 60 * 1000;
    if (expiryTime < Date.now() && food.status !== "expired") {
      food.status = "expired";
      await food.save();
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    const now = Date.now();

    const updatedFoods = foods.map((food) => {
      const expiryTime = new Date(food.preparedAt).getTime() + food.maxSafeHours * 60 * 60 * 1000;

      return {
        ...food.toObject(),
        isExpired: expiryTime <= now, // frontend flag
      };
    });

    res.json(updatedFoods);
  } catch (error) {
    console.error("Get all foods error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const claimFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { recipientId } = req.body;

    const food = await Food.findById(id);
    if (!food) return res.status(404).json({ message: "Food not found" });

    if (food.status !== "available")
      return res.status(400).json({ message: "Food cannot be claimed" });

    food.status = "claimed";
    food.recipientId = recipientId;

    await food.save();

    res.json({ message: "Food claimed successfully", food });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFoodsByDonor = async (req, res) => {
  try {
    const { donorId } = req.params;
    const foods = await Food.find({ donorId }); // only foods by this donor
    res.status(200).json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch donor's foods" });
  }
};