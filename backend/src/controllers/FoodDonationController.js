import FoodDonation from "../models/donateFood.js";

// GET available foods (sorted by freshness + filter)
export const getAvailableFoods = async (req, res) => {
  const { category } = req.query;

  const filter = { status: "available" };
  if (category) filter.category = category;

  const foods = await FoodDonation.find(filter)
    .sort({ preparedAt: -1 }); // freshness

  res.json(foods);
};

// CLAIM food
export const claimFood = async (req, res) => {
  const { id } = req.params;
  const { receiverId } = req.body;

  const food = await FoodDonation.findById(id);

  if (!food) return res.status(404).json({ message: "Food not found" });

  if (food.status !== "available") {
    return res.status(400).json({ message: "Already claimed" });
  }

  food.status = "claimed";
  food.claimedBy = receiverId;

  await food.save();

  // simulate notification
  console.log(`📧 Email sent to donor: ${food.donorEmail}`);

  res.json({ message: "Food claimed successfully" });
};
